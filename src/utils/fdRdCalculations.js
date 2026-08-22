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

// --- Premature Withdrawal Impact ---
// Breaking an FD early typically costs two things: the bank pays whatever
// rate actually applied for the real holding period (not the rate you
// booked at) and usually applies a further penalty (commonly 0.5-1%) on
// top. Banks price tenure-by-tenure, and we don't have a full rate card
// here, so this approximates using (booked rate − penalty) as the
// effective rate for the actual holding period — a reasonable, clearly
// labeled estimate, not a bank-exact figure.
export function calculatePrematureWithdrawal(principal, bookedRate, monthsHeld, compoundingPerYear = 4, penaltyPercent = 1) {
  if (!principal || !bookedRate || !monthsHeld) {
    return { effectiveRate: 0, payableAmount: principal, interestEarned: 0, penaltyCost: 0 };
  }
  const effectiveRate = Math.max(0, bookedRate - penaltyPercent);
  const yearsHeld = monthsHeld / 12;

  const withPenalty = calculateFDCumulative(principal, effectiveRate, yearsHeld, compoundingPerYear);
  // What the same holding period would have earned at the full booked rate
  // (no penalty) - the gap between the two is the actual cost of breaking it.
  const withoutPenalty = calculateFDCumulative(principal, bookedRate, yearsHeld, compoundingPerYear);

  return {
    effectiveRate,
    payableAmount: withPenalty.maturityAmount,
    interestEarned: withPenalty.totalInterest,
    penaltyCost: Math.max(0, withoutPenalty.totalInterest - withPenalty.totalInterest)
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

// --- Peak Annual Interest (for an honest TDS threshold check) ---
// Compound interest earns more in later years than earlier ones (the base
// balance is bigger), so "total interest ÷ number of years" understates the
// final year's actual interest — a multi-year deposit can cross the ₹40,000
// TDS threshold in its last year while the *average* stays under it, wrongly
// telling the depositor no TDS will be deducted. This scans a schedule
// (quarterly for FD, monthly for RD) and returns the single highest amount
// of interest earned in any one full year, which is what actually
// determines whether TDS applies.
export function getPeakAnnualInterest(schedule, periodsPerYear) {
  if (!schedule || schedule.length < 2 || !periodsPerYear) {
    return schedule?.[schedule.length - 1]?.interest || 0;
  }

  let peak = 0;
  for (let i = 0; i + periodsPerYear < schedule.length; i += periodsPerYear) {
    const yearInterest = schedule[i + periodsPerYear].interest - schedule[i].interest;
    peak = Math.max(peak, yearInterest);
  }

  // A trailing partial year beyond the last full year window
  const lastIndex = schedule.length - 1;
  const lastFullBoundary = Math.floor(lastIndex / periodsPerYear) * periodsPerYear;
  if (lastFullBoundary < lastIndex) {
    const partial = schedule[lastIndex].interest - schedule[lastFullBoundary].interest;
    peak = Math.max(peak, partial);
  }

  return peak;
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

// --- FD Non-Cumulative Growth Schedule (for chart) ---
// A non-cumulative FD doesn't compound — the principal sits unchanged until
// maturity, and interest is paid OUT at each period rather than added to
// the balance. The "interest" series here is the running total already
// received by that point (grows in flat steps, not a compounding curve) —
// using generateFDSchedule's compound curve for a non-cumulative FD would
// show growth that doesn't match how the product actually works.
export function generateFDNonCumulativeSchedule(principal, annualRate, totalYears, payoutFrequency = 'Monthly') {
  const { payoutPerPeriod, totalPayouts } = calculateFDNonCumulative(principal, annualRate, totalYears, payoutFrequency);
  const schedule = [{ period: 0, label: 'Start', principal, interest: 0, total: principal }];

  for (let i = 1; i <= totalPayouts; i++) {
    const interestSoFar = Math.round(payoutPerPeriod * i);
    schedule.push({
      period: i,
      label: `P${i}`,
      principal,
      interest: interestSoFar,
      total: principal + interestSoFar
    });
  }
  return schedule;
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
