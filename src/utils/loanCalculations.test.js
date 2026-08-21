import { describe, it, expect } from 'vitest';
import { calculateEMI, generateSchedule, calculateSavings } from './loanCalculations';

describe('calculateEMI', () => {
  it('matches the standard reducing-balance EMI formula for a known case', () => {
    // ₹10L at 8.5% for 20 years — cross-checked independently against the formula
    expect(calculateEMI(1000000, 8.5, 20)).toBeCloseTo(8678.23, 1);
  });

  it('returns 0 if principal or tenure is missing', () => {
    expect(calculateEMI(0, 8.5, 20)).toBe(0);
    expect(calculateEMI(1000000, 8.5, 0)).toBe(0);
  });

  it('a genuine 0% interest rate is a valid loan, not missing input — EMI is a plain division', () => {
    // ₹10L over 240 months at 0% interest = exactly principal / months.
    // Previously this returned 0, because `!annualRate` is true for a real 0
    // just as it is for a missing value - a bug for the common "0% / no-cost
    // EMI" offers seen in India.
    expect(calculateEMI(1000000, 0, 20)).toBeCloseTo(1000000 / 240, 5);
  });

  it('increases with a higher interest rate, all else equal', () => {
    const lower = calculateEMI(1000000, 8, 20);
    const higher = calculateEMI(1000000, 12, 20);
    expect(higher).toBeGreaterThan(lower);
  });

  it('decreases with a longer tenure, all else equal', () => {
    const shortTenure = calculateEMI(1000000, 8.5, 10);
    const longTenure = calculateEMI(1000000, 8.5, 30);
    expect(longTenure).toBeLessThan(shortTenure);
  });
});

describe('generateSchedule', () => {
  it('fully amortizes the loan — final balance is ~0', () => {
    const schedule = generateSchedule(500000, 10, 5);
    expect(schedule.length).toBeGreaterThan(0);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  it('sum of principal paid across the schedule equals the original principal', () => {
    const principal = 500000;
    const schedule = generateSchedule(principal, 10, 5);
    const totalPrincipalPaid = schedule.reduce((sum, row) => sum + row.totalPrincipalPaid, 0);
    // Rounding happens per-row, so allow a few rupees of drift over 60 rows.
    expect(totalPrincipalPaid).toBeGreaterThan(principal - 100);
    expect(totalPrincipalPaid).toBeLessThan(principal + 100);
  });

  it('a prepayment shortens the schedule versus no prepayment', () => {
    const withoutPrepayment = generateSchedule(1000000, 9, 20, 0);
    const withPrepayment = generateSchedule(1000000, 9, 20, 10000);
    expect(withPrepayment.length).toBeLessThan(withoutPrepayment.length);
  });

  it('the balance decreases monotonically month over month', () => {
    const schedule = generateSchedule(500000, 10, 5);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].balance).toBeLessThanOrEqual(schedule[i - 1].balance);
    }
  });

  it('returns an empty schedule for invalid input', () => {
    expect(generateSchedule(0, 10, 5)).toEqual([]);
  });

  it('at 0% interest, fully amortizes with zero interest charged in every row', () => {
    const schedule = generateSchedule(1000000, 0, 20);
    expect(schedule.length).toBe(240);
    expect(schedule.every((row) => row.interest === 0)).toBe(true);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  it('accounts for already-paid EMIs by fast-forwarding the balance, not restarting the loan', () => {
    const fullSchedule = generateSchedule(5000000, 8.5, 20, 0, 0);
    const remainingSchedule = generateSchedule(5000000, 8.5, 20, 0, 12);
    // 12 months already paid -> 12 fewer rows remain, and the remaining
    // schedule's opening balance should be lower than the original principal.
    expect(remainingSchedule.length).toBe(fullSchedule.length - 12);
    expect(remainingSchedule[0].openingBalance).toBeLessThan(5000000);
    expect(remainingSchedule[0].openingBalance).toBeGreaterThan(4800000);
  });

  describe('one-time lump sum prepayment', () => {
    it('in reduceTenure mode (default), keeps the EMI fixed and shortens the schedule', () => {
      const withoutLumpSum = generateSchedule(2000000, 9, 15, 0, 0);
      const withLumpSum = generateSchedule(2000000, 9, 15, 0, 0, 300000, 12, 'reduceTenure');
      expect(withLumpSum.length).toBeLessThan(withoutLumpSum.length);
      // EMI never changes in this mode.
      const uniqueEmis = new Set(withLumpSum.map((r) => Math.round(r.emi)));
      expect(uniqueEmis.size).toBe(1);
    });

    it('in reduceEMI mode, keeps roughly the original payoff date and lowers the EMI instead', () => {
      const withoutLumpSum = generateSchedule(2000000, 9, 15, 0, 0);
      const withLumpSum = generateSchedule(2000000, 9, 15, 0, 0, 300000, 12, 'reduceEMI');
      // Tenure should be very close to unchanged (recalculated EMI targets the same end date).
      expect(Math.abs(withLumpSum.length - withoutLumpSum.length)).toBeLessThanOrEqual(1);
      // EMI should have dropped after the lump sum lands.
      expect(withLumpSum[withLumpSum.length - 1].emi).toBeLessThan(withLumpSum[0].emi);
    });

    it('in reduceEMI mode, the lump-sum month itself still shows the OLD EMI — the drop applies from next month', () => {
      // Regression: an earlier version recalculated the EMI before pushing
      // that month's row, so the very month the lump sum landed displayed
      // the already-lowered EMI instead of what was actually paid.
      const schedule = generateSchedule(2000000, 9, 15, 0, 0, 300000, 1, 'reduceEMI');
      const lumpSumRow = schedule.find((r) => r.month === 1);
      const nextRow = schedule.find((r) => r.month === 2);
      const originalEmi = generateSchedule(2000000, 9, 15)[0].emi;

      expect(lumpSumRow.emi).toBeCloseTo(originalEmi, 5);
      expect(nextRow.emi).toBeLessThan(lumpSumRow.emi);
    });

    it('a lump sum always reduces total interest versus not paying it', () => {
      const base = generateSchedule(2000000, 9, 15, 0, 0);
      const withLumpSum = generateSchedule(2000000, 9, 15, 0, 0, 300000, 12, 'reduceTenure');
      const sumInterest = (s) => s.reduce((sum, r) => sum + r.interest, 0);
      expect(sumInterest(withLumpSum)).toBeLessThan(sumInterest(base));
    });
  });
});

describe('calculateSavings', () => {
  it('a prepayment always saves interest and shortens the tenure, never the reverse', () => {
    const result = calculateSavings(1000000, 9, 20, 15000);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.totalInterestWithPrepayment).toBeLessThan(result.totalInterestNoPrepayment);
  });

  it('zero prepayment saves nothing', () => {
    const result = calculateSavings(1000000, 9, 20, 0);
    expect(result.interestSaved).toBe(0);
    expect(result.monthsSaved).toBe(0);
  });

  it('with paidEMIs, totals match the remaining schedule — not a fresh from-scratch loan', () => {
    // This is the exact bug found testing with real numbers: a ₹50L/8.5%/20yr
    // loan with 12 EMIs already paid showed "Total Interest: ₹54,13,875" (the
    // full 240-month figure from scratch) right next to an amortization table
    // correctly showing only 228 remaining months - overstating remaining
    // interest by over ₹4 lakh. calculateSavings must be told paidEMIs too.
    const result = calculateSavings(5000000, 8.5, 20, 0, 12);
    const remainingSchedule = generateSchedule(5000000, 8.5, 20, 0, 12);
    const trueRemainingInterest = remainingSchedule.reduce((sum, row) => sum + row.interest, 0);

    expect(result.totalInterestNoPrepayment).toBeCloseTo(trueRemainingInterest, 0);
    // The old (buggy) behavior returned the full-loan-from-scratch figure -
    // guard against regressing back to it.
    const fullFromScratch = generateSchedule(5000000, 8.5, 20, 0, 0).reduce((sum, row) => sum + row.interest, 0);
    expect(result.totalInterestNoPrepayment).toBeLessThan(fullFromScratch);
  });

  it('paidEMIs is applied identically to both the with- and without-prepayment branches', () => {
    // Both branches need the same paidEMIs, or "interest saved" compares two
    // loans that started from different points in time.
    const result = calculateSavings(5000000, 8.5, 20, 10000, 12);
    const expectedWith = generateSchedule(5000000, 8.5, 20, 10000, 12);
    const expectedWithout = generateSchedule(5000000, 8.5, 20, 0, 12);
    expect(result.totalInterestWithPrepayment).toBeCloseTo(
      expectedWith.reduce((s, r) => s + r.interest, 0), 0
    );
    expect(result.totalInterestNoPrepayment).toBeCloseTo(
      expectedWithout.reduce((s, r) => s + r.interest, 0), 0
    );
  });
});
