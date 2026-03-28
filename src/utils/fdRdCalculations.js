/**
 * FD / RD Calculation Utilities — Bank Standard Formulas
 * 
 * FD Cumulative:    Compound Interest A = P(1 + r/n)^(nt)
 * FD Non-Cumulative: Simple Interest paid at chosen frequency, principal returned at maturity
 * RD:               Quarterly compounding as per Indian bank standard
 */

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Convert years + months + days => fractional years
export function totalYearsFromPeriod(years = 0, months = 0, days = 0) {
  return years + (months / 12) + (days / 365);
}

// --- FD CUMULATIVE (Compound Interest) ---
// Banks compound quarterly for most FDs. Interest reinvested, paid at maturity.
export function calculateFDCumulative(principal, annualRate, totalYears, compoundingPerYear = 4) {
  if (!principal || !annualRate || !totalYears) return { maturityAmount: principal, totalInterest: 0 };
  const r = annualRate / 100;
  const n = compoundingPerYear;
  const t = totalYears;
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  return {
    maturityAmount,
    totalInterest: maturityAmount - principal
  };
}

// --- FD NON-CUMULATIVE (Simple Interest paid periodically) ---
// Interest is calculated on principal and paid out at chosen frequency.
// Principal is returned at maturity.
export function calculateFDNonCumulative(principal, annualRate, totalYears, payoutFrequency = 'Monthly') {
  if (!principal || !annualRate || !totalYears) {
    return { maturityAmount: principal, totalInterest: 0, payoutPerPeriod: 0, totalPayouts: 0 };
  }

  // Simple interest: Interest = P x R x T
  const totalInterest = principal * (annualRate / 100) * totalYears;

  const frequencyConfig = {
    'Monthly':     { perYear: 12,  label: 'Monthly Payout' },
    'Quarterly':   { perYear: 4,   label: 'Quarterly Payout' },
    'Half-yearly': { perYear: 2,   label: 'Half-Yearly Payout' },
    'Annually':    { perYear: 1,   label: 'Annual Payout' },
    'At Maturity': { perYear: null, label: 'At Maturity Payout' }
  };

  const freq = frequencyConfig[payoutFrequency] || frequencyConfig['Monthly'];

  let payoutPerPeriod = 0;
  let totalPayouts = 0;

  if (freq.perYear) {
    payoutPerPeriod = (principal * (annualRate / 100)) / freq.perYear;
    totalPayouts = Math.floor(totalYears * freq.perYear);
  } else {
    // At Maturity: one single payout
    payoutPerPeriod = totalInterest;
    totalPayouts = 1;
  }

  return {
    maturityAmount: principal,           // principal returned at maturity
    totalInterest,
    payoutPerPeriod,
    totalPayouts,
    payoutLabel: freq.label,
    // Breakdown per frequency
    breakdown: {
      daily:       principal * (annualRate / 100) / 365,
      monthly:     principal * (annualRate / 100) / 12,
      quarterly:   principal * (annualRate / 100) / 4,
      halfYearly:  principal * (annualRate / 100) / 2,
      annually:    principal * (annualRate / 100),
    }
  };
}

// --- RD MATURITY (Quarterly Compounding — Indian Bank Standard) ---
// RD formula: M = R x [(1+r)^n – 1] / (1 – (1+r)^(−1/3))
// where r = quarterly rate, n = number of quarters
// Each monthly instalment grows for remaining quarters
export function calculateRDMaturity(monthlyDeposit, annualRate, months) {
  if (!monthlyDeposit || !annualRate || !months) return 0;
  const quarterlyRate = annualRate / 100 / 4;
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    // quarters remaining for deposit made in month i
    const quartersRemaining = (months - i + 1) / 3;
    maturity += monthlyDeposit * Math.pow(1 + quarterlyRate, quartersRemaining);
  }
  return maturity;
}

// --- Tax Calculation ---
export function calculatePostTaxReturns(grossInterest, taxSlabPercent, annualInterest) {
  if (!grossInterest || grossInterest <= 0) {
    return { grossInterest: 0, tdsAmount: 0, additionalTax: 0, netInterest: 0, tdsApplicable: false, totalTaxAmount: 0 };
  }
  // TDS at 10% if annual interest > ₹40,000 (₹50,000 for senior citizens — simplified to 40k)
  const tdsApplicable = annualInterest > 40000;
  const tdsRate = tdsApplicable ? 0.10 : 0;
  const tdsAmount = grossInterest * tdsRate;

  // Total tax based on slab; TDS is advance payment, so only pay remaining
  const totalTaxRate = taxSlabPercent / 100;
  const totalTaxAmount = grossInterest * totalTaxRate;
  const additionalTax = Math.max(0, totalTaxAmount - tdsAmount);

  return {
    grossInterest,
    tdsAmount: Math.round(tdsAmount),
    additionalTax: Math.round(additionalTax),
    netInterest: Math.round(grossInterest - tdsAmount - additionalTax),
    tdsApplicable,
    totalTaxAmount: Math.round(totalTaxAmount)
  };
}

// --- FD Growth Schedule (for chart) ---
export function generateFDSchedule(principal, annualRate, totalYears, compoundingPerYear = 4) {
  const schedule = [];
  const r = annualRate / 100 / compoundingPerYear;
  const totalPeriods = Math.max(1, Math.ceil(totalYears * compoundingPerYear));

  for (let i = 0; i <= totalPeriods; i++) {
    const amount = principal * Math.pow(1 + r, i);
    schedule.push({
      period: i,
      label: i === 0 ? 'Start' : `Q${i}`,
      principal,
      interest: Math.round(amount - principal),
      total: Math.round(amount)
    });
  }
  return schedule;
}

// --- RD Growth Schedule (for chart) ---
export function generateRDSchedule(monthlyDeposit, annualRate, months) {
  const schedule = [];
  let totalDeposited = 0;

  for (let i = 1; i <= months; i++) {
    totalDeposited += monthlyDeposit;
    const accumulated = calculateRDMaturity(monthlyDeposit, annualRate, i);
    schedule.push({
      month: i,
      label: `M${i}`,
      deposited: Math.round(totalDeposited),
      interest: Math.round(accumulated - totalDeposited),
      total: Math.round(accumulated)
    });
  }
  return schedule;
}
