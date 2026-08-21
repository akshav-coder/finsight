import { describe, it, expect } from 'vitest';
import {
  totalYearsFromPeriod,
  calculateFDCumulative,
  calculateFDNonCumulative,
  calculateRDMaturity,
  calculatePostTaxReturns,
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
