import { describe, it, expect } from 'vitest';
import { calculateEMI, generateSchedule, calculateSavings } from './loanCalculations';

describe('calculateEMI', () => {
  it('matches the standard reducing-balance EMI formula for a known case', () => {
    // ₹10L at 8.5% for 20 years — cross-checked independently against the formula
    expect(calculateEMI(1000000, 8.5, 20)).toBeCloseTo(8678.23, 1);
  });

  it('returns 0 if any required input is missing or zero', () => {
    expect(calculateEMI(0, 8.5, 20)).toBe(0);
    expect(calculateEMI(1000000, 0, 20)).toBe(0);
    expect(calculateEMI(1000000, 8.5, 0)).toBe(0);
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
});
