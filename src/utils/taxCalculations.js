/**
 * Tax Calculations Utility
 * Supports FY 2023-24, 2024-25, 2025-26
 * FY 2025-26 New Regime: Finance Act 2025 — tax rebate u/s 87A raised to ₹60,000 effectively
 * making income up to ₹12,00,000 tax-free (₹12,75,000 for salaried after ₹75k std deduction).
 */

// ─── FY Config Map ──────────────────────────────────────────────────────────

export const FINANCIAL_YEARS = [
  { id: '2023-24', label: 'FY 2023-24' },
  { id: '2024-25', label: 'FY 2024-25' },
  { id: '2025-26', label: 'FY 2025-26 (Current)' },
];

export const DEFAULT_FY = '2025-26';

// ─── Per-FY Tax Config ──────────────────────────────────────────────────────

const FY_CONFIG = {
  '2023-24': {
    standardDeductionOld: 50000,
    standardDeductionNew: 50000, // No std deduction in new regime until FY24-25
    section80C_limit: 150000,
    section80D_self: 25000,
    section80D_parents: 25000,
    section80D_seniorParents: 50000,
    section80CCD_limit: 50000,
    section24B_limit: 200000,
    cess_rate: 0.04,
    oldSlabs: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 },
    ],
    newSlabs: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 0.05 },
      { min: 600000, max: 900000, rate: 0.10 },
      { min: 900000, max: 1200000, rate: 0.15 },
      { min: 1200000, max: 1500000, rate: 0.20 },
      { min: 1500000, max: Infinity, rate: 0.30 },
    ],
    rebate87A_old: { limit: 500000, amount: 12500 },
    rebate87A_new: { limit: 700000, amount: 25000 },
  },

  '2024-25': {
    standardDeductionOld: 50000,
    standardDeductionNew: 75000, // enhanced from Union Budget 2024
    section80C_limit: 150000,
    section80D_self: 25000,
    section80D_parents: 25000,
    section80D_seniorParents: 50000,
    section80CCD_limit: 50000,
    section24B_limit: 200000,
    cess_rate: 0.04,
    oldSlabs: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 },
    ],
    newSlabs: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 700000, rate: 0.05 },
      { min: 700000, max: 1000000, rate: 0.10 },
      { min: 1000000, max: 1200000, rate: 0.15 },
      { min: 1200000, max: 1500000, rate: 0.20 },
      { min: 1500000, max: Infinity, rate: 0.30 },
    ],
    rebate87A_old: { limit: 500000, amount: 12500 },
    rebate87A_new: { limit: 700000, amount: 25000 },
  },

  '2025-26': {
    standardDeductionOld: 50000,
    standardDeductionNew: 75000,
    section80C_limit: 150000,
    section80D_self: 25000,
    section80D_parents: 25000,
    section80D_seniorParents: 50000,
    section80CCD_limit: 50000,
    section24B_limit: 200000,
    cess_rate: 0.04,
    oldSlabs: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 },
    ],
    // Finance Act 2025: New slab rates revised
    newSlabs: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.20 },
      { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.30 },
    ],
    // Section 87A: Rebate raised to ₹60,000 → effectively 0 tax up to ₹12,00,000
    rebate87A_old: { limit: 500000, amount: 12500 },
    rebate87A_new: { limit: 1200000, amount: 60000 },
  },
};

export function getTaxConfig(fy = DEFAULT_FY) {
  return FY_CONFIG[fy] || FY_CONFIG[DEFAULT_FY];
}

// ─── Legacy constants (default to current FY) ─────────────────────────────
export const TAX_CONSTANTS = {
  ...FY_CONFIG['2025-26'],
  standardDeductionOld: 50000,
  standardDeductionNew: 75000,
  hra_metro_percent: 0.50,
  hra_nonmetro_percent: 0.40,
  hra_basic_percent: 0.10,
  rebate87A_oldRegime: 500000,
  rebate87A_newRegime: 1200000,
  rebate87A_amount_old: 12500,
  rebate87A_amount_new: 60000,
  tds_threshold_fd: 40000,
};

export const OLD_REGIME_SLABS = FY_CONFIG['2025-26'].oldSlabs;
export const NEW_REGIME_SLABS = FY_CONFIG['2025-26'].newSlabs;

// ─── Deduction Calculator ──────────────────────────────────────────────────

export function calculateDeductions(inputs, fy = DEFAULT_FY) {
  const config = getTaxConfig(fy);

  let deductions = {
    standardDeduction: 0,
    section80C: 0,
    section80D: 0,
    section80CCD: 0,
    section24B: 0,
    hraExemption: 0,
    total80CInvested: 0,
    total80DSelfInvested: 0,
    total80DParentsInvested: 0,
  };

  // Standard Deduction (Old Regime only)
  if (inputs.employmentType === 'Salaried') {
    deductions.standardDeduction = config.standardDeductionOld;
  }

  // 80C
  const total80C = (inputs.epf || 0) + (inputs.ppf || 0) +
    (inputs.elss || 0) + (inputs.lifeInsurance || 0) +
    (inputs.nsc || 0) + (inputs.fdTaxSaver || 0) +
    (inputs.tuitionFees || 0) + (inputs.homeLoanPrincipal || 0);
  deductions.total80CInvested = total80C;
  deductions.section80C = Math.min(total80C, config.section80C_limit);

  // 80D
  deductions.total80DSelfInvested = inputs.healthInsuranceSelf || 0;
  deductions.total80DParentsInvested = inputs.healthInsuranceParents || 0;
  const selfFamily80D = Math.min(deductions.total80DSelfInvested, config.section80D_self);
  const parents80D = inputs.parentsAbove60
    ? Math.min(deductions.total80DParentsInvested, config.section80D_seniorParents)
    : Math.min(deductions.total80DParentsInvested, config.section80D_parents);
  deductions.section80D = selfFamily80D + parents80D;

  // 80CCD(1B) NPS
  deductions.section80CCD = Math.min(inputs.nps || 0, config.section80CCD_limit);

  // 24B Home Loan Interest
  deductions.section24B = Math.min(inputs.homeLoanInterest || 0, config.section24B_limit);

  // HRA
  if (inputs.payingRent && inputs.employmentType === 'Salaried') {
    const basic = (inputs.basicSalary || 0) * 12;
    const hra = (inputs.hraReceived || 0) * 12;
    const rent = (inputs.monthlyRent || 0) * 12;
    const cityMult = inputs.metroCity ? 0.50 : 0.40;
    if (basic > 0 && hra > 0 && rent > 0) {
      const hraExempt = Math.min(hra, Math.max(0, rent - 0.10 * basic), basic * cityMult);
      deductions.hraExemption = Math.max(0, hraExempt);
    }
  }

  return deductions;
}

// ─── Tax Slab Calculator ──────────────────────────────────────────────────

export function calculateTax(taxableIncome, regime, ageGroup, fy = DEFAULT_FY) {
  const config = getTaxConfig(fy);
  const slabs = regime === 'new' ? config.newSlabs : config.oldSlabs;

  let tax = 0;
  for (const slab of slabs) {
    let effectiveMin = slab.min;

    // Old regime age-based exemption
    if (regime === 'old') {
      if (ageGroup === '60-80') {
        if (effectiveMin === 0) continue;
        if (effectiveMin === 250000) effectiveMin = 300000;
      }
      if (ageGroup === 'above80') {
        if (effectiveMin === 0 || effectiveMin === 250000) continue;
      }
    }

    if (taxableIncome > effectiveMin) {
      const taxableInThisSlab = Math.min(taxableIncome, slab.max) - effectiveMin;
      if (taxableInThisSlab > 0) tax += taxableInThisSlab * slab.rate;
    }
  }

  // Rebate u/s 87A
  const rb87A = regime === 'new' ? config.rebate87A_new : config.rebate87A_old;
  if (taxableIncome <= rb87A.limit) {
    tax = Math.max(0, tax - rb87A.amount);
  }

  // Surcharge (simplified)
  let surcharge = 0;
  if (taxableIncome > 5000000) surcharge = tax * 0.10;
  tax += surcharge;

  const cess = tax * config.cess_rate;
  return { tax, cess, totalTax: tax + cess };
}

// ─── Comprehensive Tax ────────────────────────────────────────────────────

export function calculateComprehensiveTax(inputs, fy = DEFAULT_FY) {
  const config = getTaxConfig(fy);
  const grossIncome = (inputs.annualCTC || 0) + (inputs.otherIncome || 0);

  // New Regime
  const stdDedNew = inputs.employmentType === 'Salaried' ? config.standardDeductionNew : 0;
  const newRegimeTaxable = Math.max(0, grossIncome - stdDedNew);
  const newRegimeResult = calculateTax(newRegimeTaxable, 'new', inputs.ageGroup, fy);

  // Old Regime
  const deductions = calculateDeductions(inputs, fy);
  const oldRegimeTotalDeductions =
    deductions.standardDeduction + deductions.section80C + deductions.section80D +
    deductions.section80CCD + deductions.section24B + deductions.hraExemption;
  const oldRegimeTaxable = Math.max(0, grossIncome - oldRegimeTotalDeductions);
  const oldRegimeResult = calculateTax(oldRegimeTaxable, 'old', inputs.ageGroup, fy);

  return {
    grossIncome,
    fy,
    newRegime: { totalDeductions: stdDedNew, taxableIncome: newRegimeTaxable, ...newRegimeResult },
    oldRegime: { deductionsBreakdown: deductions, totalDeductions: oldRegimeTotalDeductions, taxableIncome: oldRegimeTaxable, ...oldRegimeResult },
  };
}

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
