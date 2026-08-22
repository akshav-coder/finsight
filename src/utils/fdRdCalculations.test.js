import { describe, it, expect } from 'vitest';
import {
  totalYearsFromPeriod,
  calculateFDCumulative,
  calculateFDNonCumulative,
  calculateRDMaturity,
  calculatePostTaxReturns,
  calculatePrematureWithdrawal,
  getPeakAnnualInterest,
  generateFDSchedule,
  generateFDNonCumulativeSchedule,
  generateRDSchedule,
} from './fdRdCalculations';

describe('totalYearsFromPeriod', () => {
  it('converts years/months/days into a fractional year figure', () => {
    expect(totalYearsFromPeriod(1, 6, 0)).toBe(1.5);
    expect(totalYearsFromPeriod(0, 0, 365)).toBe(1);
  });
});

describe('calculateFDCumulative', () => {
  it('compounds quarterly by default — matches the standard compound interest formula', () => {
    // ₹1,00,000 at 7% for 5 years, quarterly compounding
    const { maturityAmount } = calculateFDCumulative(100000, 7, 5);
    // A = P(1+r/n)^(nt) = 100000 * (1.0175)^20
    expect(maturityAmount).toBeCloseTo(100000 * Math.pow(1.0175, 20), 2);
  });

  it('maturity amount always exceeds principal for a positive rate', () => {
    const { maturityAmount, totalInterest } = calculateFDCumulative(50000, 6.5, 3);
    expect(maturityAmount).toBeGreaterThan(50000);
    expect(totalInterest).toBeGreaterThan(0);
  });

  it('returns principal unchanged for invalid input', () => {
    expect(calculateFDCumulative(0, 7, 5)).toEqual({ maturityAmount: 0, totalInterest: 0 });
  });
});

describe('calculateFDNonCumulative', () => {
  it('uses simple interest (P x R x T), not compound', () => {
    const { totalInterest } = calculateFDNonCumulative(100000, 7, 5, 'At Maturity');
    expect(totalInterest).toBe(100000 * 0.07 * 5);
  });

  it('returns the principal itself as maturityAmount (paid out periodically, not compounded)', () => {
    const { maturityAmount } = calculateFDNonCumulative(100000, 7, 5, 'Monthly');
    expect(maturityAmount).toBe(100000);
  });

  it('monthly payout equals annual interest divided by 12', () => {
    const { payoutPerPeriod } = calculateFDNonCumulative(100000, 6, 2, 'Monthly');
    expect(payoutPerPeriod).toBeCloseTo((100000 * 0.06) / 12, 5);
  });
});

describe('calculateRDMaturity', () => {
  it('grows with a higher deposit, all else equal', () => {
    const lower = calculateRDMaturity(1000, 7, 12);
    const higher = calculateRDMaturity(2000, 7, 12);
    expect(higher).toBeCloseTo(lower * 2, 2);
  });

  it('maturity exceeds total deposited for a positive rate', () => {
    const maturity = calculateRDMaturity(5000, 7, 24);
    expect(maturity).toBeGreaterThan(5000 * 24);
  });

  it('returns 0 for invalid input', () => {
    expect(calculateRDMaturity(0, 7, 12)).toBe(0);
  });
});

describe('getPeakAnnualInterest', () => {
  it('finds the highest single-year interest, not the average — the actual TDS-relevant figure', () => {
    // Regression: ₹5,00,000 at 7% cumulative for 3 years earns ₹35,930 /
    // ₹38,511 / ₹41,279 in years 1/2/3 respectively (compounding earns
    // more each year). The average (₹38,573) stays under the ₹40,000 TDS
    // threshold, wrongly telling the depositor no TDS applies — but year 3
    // alone crosses it. The peak, not the average, is what a bank actually
    // checks.
    const schedule = generateFDSchedule(500000, 7, 3, 4); // quarterly
    const peak = getPeakAnnualInterest(schedule, 4);
    const totalInterest = schedule[schedule.length - 1].interest;
    const average = totalInterest / 3;

    expect(peak).toBeGreaterThan(40000); // crosses the threshold
    expect(average).toBeLessThan(40000); // average alone would miss it
    expect(peak).toBeGreaterThan(average); // compounding: later years earn more
  });

  it('equals total interest for a schedule shorter than one year', () => {
    const schedule = generateFDSchedule(100000, 7, 0.5, 4); // 6 months
    expect(getPeakAnnualInterest(schedule, 4)).toBe(schedule[schedule.length - 1].interest);
  });

  it('handles an RD (monthly) schedule the same way', () => {
    const schedule = generateRDSchedule(10000, 7.5, 36);
    const peak = getPeakAnnualInterest(schedule, 12);
    const totalInterest = schedule[schedule.length - 1].interest;
    // Year 3 should earn more than a flat average of the 3 years.
    expect(peak).toBeGreaterThan(totalInterest / 3);
  });
});

describe('generateFDNonCumulativeSchedule', () => {
  it('keeps principal flat throughout — a non-cumulative FD does not compound', () => {
    const schedule = generateFDNonCumulativeSchedule(100000, 7, 3, 'Monthly');
    expect(schedule.every((row) => row.principal === 100000)).toBe(true);
  });

  it('interest grows in flat linear steps, not a compounding curve', () => {
    const schedule = generateFDNonCumulativeSchedule(100000, 7, 3, 'Monthly');
    const steps = [];
    for (let i = 2; i < schedule.length; i++) {
      steps.push(schedule[i].interest - schedule[i - 1].interest);
    }
    // Every monthly payout should be (within a rupee of rounding) the same
    // size — simple interest doesn't compound. Contrast with
    // generateFDSchedule's compound curve, where each step is meaningfully
    // bigger than the last.
    steps.forEach((step) => expect(Math.abs(step - steps[0])).toBeLessThanOrEqual(1));
  });

  it('final total interest matches calculateFDNonCumulative\'s figure', () => {
    const { totalInterest } = calculateFDNonCumulative(100000, 7, 3, 'Monthly');
    const schedule = generateFDNonCumulativeSchedule(100000, 7, 3, 'Monthly');
    const last = schedule[schedule.length - 1];
    expect(last.interest).toBeCloseTo(totalInterest, 0);
  });
});

describe('calculatePrematureWithdrawal', () => {
  it('always earns less than staying to full maturity at the booked rate', () => {
    const { maturityAmount: fullTermInterest } = calculateFDCumulative(100000, 7, 2);
    const early = calculatePrematureWithdrawal(100000, 7, 12); // withdrawn after 1 of 2 years
    expect(early.payableAmount).toBeLessThan(fullTermInterest);
  });

  it('applies the penalty as a lower effective rate than the booked rate', () => {
    const result = calculatePrematureWithdrawal(100000, 7, 12, 4, 1);
    expect(result.effectiveRate).toBe(6); // 7% booked - 1% penalty
  });

  it('penaltyCost is the interest gap versus the same holding period at the full booked rate', () => {
    const result = calculatePrematureWithdrawal(100000, 7, 12, 4, 1);
    const withoutPenalty = calculateFDCumulative(100000, 7, 1, 4);
    expect(result.penaltyCost).toBeCloseTo(withoutPenalty.totalInterest - result.interestEarned, 5);
    expect(result.penaltyCost).toBeGreaterThan(0);
  });

  it('a bigger penalty percent costs more interest', () => {
    const smallPenalty = calculatePrematureWithdrawal(100000, 7, 12, 4, 0.5);
    const bigPenalty = calculatePrematureWithdrawal(100000, 7, 12, 4, 2);
    expect(bigPenalty.interestEarned).toBeLessThan(smallPenalty.interestEarned);
  });

  it('returns the principal unchanged for invalid input', () => {
    expect(calculatePrematureWithdrawal(0, 7, 12)).toEqual({ effectiveRate: 0, payableAmount: 0, interestEarned: 0, penaltyCost: 0 });
  });
});

describe('calculatePostTaxReturns', () => {
  it('applies 10% TDS when annual interest exceeds ₹40,000', () => {
    const result = calculatePostTaxReturns(50000, 20, 50000);
    expect(result.tdsApplicable).toBe(true);
    expect(result.tdsAmount).toBe(5000);
  });

  it('applies no TDS when annual interest is at or below ₹40,000', () => {
    const result = calculatePostTaxReturns(40000, 20, 40000);
    expect(result.tdsApplicable).toBe(false);
    expect(result.tdsAmount).toBe(0);
  });

  it('charges additional tax on top of TDS for a filer in a higher slab', () => {
    // 30% slab, 10% already deducted as TDS -> 20% more owed
    const result = calculatePostTaxReturns(50000, 30, 50000);
    expect(result.additionalTax).toBe(Math.round(50000 * 0.20));
  });

  it('net interest equals gross minus TDS minus additional tax', () => {
    const result = calculatePostTaxReturns(50000, 30, 50000);
    expect(result.netInterest).toBe(result.grossInterest - result.tdsAmount - result.additionalTax);
  });
});
