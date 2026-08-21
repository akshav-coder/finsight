import { describe, it, expect } from 'vitest';
import { calculateTax, calculateDeductions, calculateComprehensiveTax } from './taxCalculations';

describe('calculateTax — new regime, FY 2025-26', () => {
  it('taxes a mid-range income correctly across multiple slabs', () => {
    // 0-4L: 0%, 4-8L: 5% (20,000), 8-12L: 10% (40,000), 12-15L: 15% (45,000)
    const { tax, cess, totalTax } = calculateTax(1500000, 'new', undefined, '2025-26');
    expect(tax).toBe(105000);
    expect(cess).toBe(4200);
    expect(totalTax).toBe(109200);
  });

  it('is fully rebated at exactly the ₹12L threshold (the "tax-free up to 12L" claim)', () => {
    const { totalTax } = calculateTax(1200000, 'new', undefined, '2025-26');
    expect(totalTax).toBe(0);
  });

  it('loses the full rebate one rupee past the threshold (a hard cliff, not marginal relief)', () => {
    const { totalTax } = calculateTax(1200001, 'new', undefined, '2025-26');
    expect(totalTax).toBeCloseTo(62400.16, 1);
  });

  it('applies a 10% surcharge above ₹50L', () => {
    const { totalTax: below } = calculateTax(4999999, 'new', undefined, '2025-26');
    const { totalTax: above } = calculateTax(5000001, 'new', undefined, '2025-26');
    // The surcharge should make the effective rate jump right at the threshold,
    // not just track the extra ₹2 of income.
    expect(above - below).toBeGreaterThan(1000);
  });

  it('returns zero tax for zero income', () => {
    expect(calculateTax(0, 'new', undefined, '2025-26').totalTax).toBe(0);
  });
});

describe('calculateTax — old regime, FY 2025-26', () => {
  it('taxes a mid-range income correctly', () => {
    const { totalTax } = calculateTax(600000, 'old', 'below60', '2025-26');
    expect(totalTax).toBe(33800);
  });

  it('is fully rebated at exactly the ₹5L threshold', () => {
    expect(calculateTax(500000, 'old', 'below60', '2025-26').totalTax).toBe(0);
  });

  it('gives senior citizens (60-80) a higher effective exemption', () => {
    const regular = calculateTax(600000, 'old', 'below60', '2025-26').totalTax;
    const senior = calculateTax(600000, 'old', '60-80', '2025-26').totalTax;
    expect(senior).toBeLessThan(regular);
    expect(senior).toBe(31200);
  });

  it('gives super senior citizens (80+) an even higher exemption than 60-80', () => {
    const senior = calculateTax(600000, 'old', '60-80', '2025-26').totalTax;
    const superSenior = calculateTax(600000, 'old', 'above80', '2025-26').totalTax;
    expect(superSenior).toBeLessThanOrEqual(senior);
  });
});

describe('calculateTax — falls back to FY 2025-26 config for an unknown FY', () => {
  it('does not throw and produces the same result as an explicit 2025-26', () => {
    const known = calculateTax(1500000, 'new', undefined, '2025-26');
    const fallback = calculateTax(1500000, 'new', undefined, 'not-a-real-year');
    expect(fallback).toEqual(known);
  });
});

describe('calculateDeductions', () => {
  it('caps Section 80C at the statutory limit even if actual investments exceed it', () => {
    const { section80C, total80CInvested } = calculateDeductions(
      { epf: 100000, ppf: 60000, elss: 50000 },
      '2025-26'
    );
    expect(total80CInvested).toBe(210000); // uncapped, for display
    expect(section80C).toBe(150000); // capped
  });

  it('gives a higher 80D limit for parents above 60', () => {
    const younger = calculateDeductions(
      { healthInsuranceParents: 60000, parentsAbove60: false },
      '2025-26'
    );
    const senior = calculateDeductions(
      { healthInsuranceParents: 60000, parentsAbove60: true },
      '2025-26'
    );
    expect(senior.section80D).toBeGreaterThan(younger.section80D);
  });

  it('computes HRA exemption as the minimum of the three statutory limits', () => {
    // basic=6L/yr, hra=3L/yr, rent=2.4L/yr, metro (50%)
    // min(actual HRA=300000, rent-10%basic=180000, 50%*basic=300000) = 180000
    const { hraExemption } = calculateDeductions(
      {
        employmentType: 'Salaried',
        payingRent: true,
        basicSalary: 50000,
        hraReceived: 25000,
        monthlyRent: 20000,
        metroCity: true,
      },
      '2025-26'
    );
    expect(hraExemption).toBe(180000);
  });

  it('gives no HRA exemption for a non-salaried filer', () => {
    const { hraExemption } = calculateDeductions(
      {
        employmentType: 'Self Employed',
        payingRent: true,
        basicSalary: 50000,
        hraReceived: 25000,
        monthlyRent: 20000,
      },
      '2025-26'
    );
    expect(hraExemption).toBe(0);
  });
});

describe('calculateComprehensiveTax', () => {
  it('produces internally consistent taxable income for both regimes', () => {
    const result = calculateComprehensiveTax(
      {
        annualCTC: 1200000,
        employmentType: 'Salaried',
        epf: 60000,
        ppf: 50000,
      },
      '2025-26'
    );

    expect(result.grossIncome).toBe(1200000);
    // New regime: standard deduction only (₹75,000 for FY25-26)
    expect(result.newRegime.taxableIncome).toBe(1200000 - 75000);
    // Old regime: standard deduction + 80C (capped/actual, whichever is lower)
    expect(result.oldRegime.taxableIncome).toBeLessThan(1200000);
    expect(result.oldRegime.taxableIncome).toBeGreaterThan(0);
  });

  it('never produces negative taxable income even with deductions exceeding gross income', () => {
    const result = calculateComprehensiveTax(
      { annualCTC: 100000, employmentType: 'Salaried', epf: 150000 },
      '2025-26'
    );
    expect(result.oldRegime.taxableIncome).toBeGreaterThanOrEqual(0);
    expect(result.newRegime.taxableIncome).toBeGreaterThanOrEqual(0);
  });
});
