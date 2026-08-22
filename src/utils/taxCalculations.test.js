import { describe, it, expect } from 'vitest';
import { calculateTax, calculateDeductions, calculateComprehensiveTax, getSection80DSelfLimit, getMarginalRate } from './taxCalculations';

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

  it('applies marginal relief one rupee past the ₹12L threshold, instead of a hard cliff', () => {
    // BUG (found live in the browser): ₹12,81,000 CTC -> ₹12,06,000 taxable showed
    // ₹63,336 tax (full slab tax, no relief) instead of being capped near the
    // ₹6,000 excess over the ₹12L rebate limit. The New Regime has a statutory
    // marginal-relief proviso (CBDT Circular 01/2023, carried into FY25-26 by
    // Finance Act 2025) so tax payable should never exceed the income that
    // crossed the threshold.
    const oneRupeeOver = calculateTax(1200001, 'new', undefined, '2025-26');
    expect(oneRupeeOver.tax).toBe(1); // capped at the ₹1 excess, not ~₹60,000
    expect(oneRupeeOver.totalTax).toBeCloseTo(1.04, 2);

    const sixThousandOver = calculateTax(1206000, 'new', undefined, '2025-26');
    expect(sixThousandOver.tax).toBe(6000); // capped at the ₹6,000 excess
    expect(sixThousandOver.totalTax).toBe(6240);
  });

  it('does not apply marginal relief once income clears the relief band (tax owed exceeds the excess)', () => {
    // Well past ₹12L, the normal slab tax is less than the "excess income" cap,
    // so marginal relief stops applying and full slab tax is charged again.
    const { tax } = calculateTax(1500000, 'new', undefined, '2025-26');
    expect(tax).toBe(105000);
  });

  it('applies the correct tiered surcharge (not a flat 10% for every income above ₹50L)', () => {
    // BUG (found live in the browser): ₹1.1 Cr CTC -> ₹1,09,25,000 taxable
    // showed tax computed with a flat 10% surcharge (₹32,68,980 total) instead
    // of the 15% rate that applies between ₹1Cr-₹2Cr (correct: ₹34,17,570).
    const { tax, totalTax } = calculateTax(10925000, 'new', undefined, '2025-26');
    expect(tax).toBe(3286125); // slab tax * 1.15, not * 1.10
    expect(totalTax).toBe(3417570);
  });

  it('caps New Regime surcharge at 25% even above ₹5Cr (Old Regime keeps rising to 37%)', () => {
    const { totalTax: newRegimeTax } = calculateTax(60000000, 'new', undefined, '2025-26');
    const { totalTax: oldRegimeTax } = calculateTax(60000000, 'old', 'below60', '2025-26');
    expect(newRegimeTax).toBe(22854000);
    expect(oldRegimeTax).toBe(25379250);
    expect(oldRegimeTax).toBeGreaterThan(newRegimeTax);
  });

  it('applies marginal relief across a surcharge threshold crossing (₹50L boundary)', () => {
    // Crossing ₹50L by a small amount should not cost anywhere near the full
    // 10% surcharge on the entire tax — only up to the excess income.
    const { totalTax: below } = calculateTax(4999999, 'new', undefined, '2025-26');
    const { totalTax: above } = calculateTax(5000001, 'new', undefined, '2025-26');
    expect(above - below).toBeLessThan(10); // ~₹2 of income, not a >₹1,000 cliff
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

  it('has NO marginal relief past the ₹5L rebate threshold (unlike the New Regime)', () => {
    // Section 87A's marginal-relief proviso only exists for the New Regime.
    // The Old Regime's ₹5L rebate is a hard cliff by law — this must stay a
    // cliff even though the New Regime near ₹12L is now smoothed.
    const { totalTax } = calculateTax(500001, 'old', 'below60', '2025-26');
    expect(totalTax).toBeCloseTo(13000.21, 1); // full slab tax, not capped at ₹1
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

  it('gives a higher 80D self+family limit when the FILER (not just their parents) is a senior citizen', () => {
    // BUG (found live in the browser): a 60-80 filer with ₹40,000 of self+family
    // health insurance premium was capped at the regular ₹25,000 limit, showing
    // "Total Deductions -₹75,000" (50k std ded + 25k 80D) instead of the correct
    // -₹90,000 (50k + 40k, since the ₹50k senior cap wasn't hit yet).
    const regular = calculateDeductions(
      { ageGroup: 'below60', healthInsuranceSelf: 40000 },
      '2025-26'
    );
    const senior = calculateDeductions(
      { ageGroup: '60-80', healthInsuranceSelf: 40000 },
      '2025-26'
    );
    expect(regular.section80D).toBe(25000); // capped at the regular limit
    expect(senior.section80D).toBe(40000); // fully allowed, under the ₹50k senior cap

    const superSenior = calculateDeductions(
      { ageGroup: 'above80', healthInsuranceSelf: 60000 },
      '2025-26'
    );
    expect(superSenior.section80D).toBe(50000); // capped at the ₹50k senior limit
  });

  it('getSection80DSelfLimit returns ₹25k for regular filers and ₹50k for senior filers', () => {
    expect(getSection80DSelfLimit('below60', '2025-26')).toBe(25000);
    expect(getSection80DSelfLimit('60-80', '2025-26')).toBe(50000);
    expect(getSection80DSelfLimit('above80', '2025-26')).toBe(50000);
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

describe('getMarginalRate', () => {
  it('matches the actual Old Regime slab the income falls into, unlike a hardcoded guess', () => {
    // BUG (found live in the browser): the "what if I add ₹50,000 to NPS" widget
    // used hardcoded CTC breakpoints (₹7L/10L/12L/15L) copied from a stale FY's
    // New Regime slabs, applied to raw CTC instead of Old Regime taxable income.
    // For ₹15,00,000 CTC (₹14,10,000 Old Regime taxable with senior 80D used),
    // it estimated a 20% marginal rate (₹10,000 saved) when the real Old Regime
    // slab rate at that income is 30% (₹15,000 saved) — NPS 80CCD(1B) is an
    // Old-Regime-only deduction, so the New Regime's slabs are irrelevant here.
    expect(getMarginalRate(1410000, 'old', '60-80', '2025-26')).toBe(0.30);
    expect(getMarginalRate(600000, 'old', 'below60', '2025-26')).toBe(0.20);
    expect(getMarginalRate(200000, 'old', 'below60', '2025-26')).toBe(0);
  });
});
