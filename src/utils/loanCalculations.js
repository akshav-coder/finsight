/**
 * Loan Calculation Utilities
 */

// Distinguishes "the user hasn't entered a value yet" (undefined/null/empty
// string/NaN) from a genuinely valid number that happens to be 0 — a 0%
// interest loan (common for "no-cost EMI" offers in India) is valid input,
// not missing input.
function isProvided(value) {
  return value !== undefined && value !== null && value !== '' && !isNaN(value);
}

// Monthly EMI calculation
export function calculateEMI(principal, annualRate, tenureYears) {
  if (!principal || !isProvided(annualRate) || !tenureYears) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Full amortization schedule generation — Reducing Balance Method (Indian Bank Standard)
// lumpSum/lumpSumMonth: an optional one-time extra payment at a specific month
// (in addition to any recurring extraPayment). prepaymentMode controls what
// happens to future payments once that lump sum lands: 'reduceTenure' (default)
// keeps the EMI fixed and pays the loan off sooner; 'reduceEMI' keeps the
// original payoff date and recalculates a lower EMI instead.
export function generateSchedule(
  principal,
  annualRate,
  tenureYears,
  extraPayment = 0,
  paidEMIs = 0,
  lumpSum = 0,
  lumpSumMonth = 1,
  prepaymentMode = 'reduceTenure'
) {
  if (!principal || !isProvided(annualRate) || !tenureYears) return [];

  const r = annualRate / 12 / 100;
  let emi = calculateEMI(principal, annualRate, tenureYears);
  let balance = principal;
  const schedule = [];
  const totalMonths = Math.round(tenureYears * 12);

  // Fast forward already paid EMIs (reduces balance using real reducing balance logic)
  for (let i = 0; i < paidEMIs; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    if (balance <= 0) { balance = 0; break; }
  }

  // Generate remaining schedule — one row per month
  let month = 1;
  while (balance > 0.01) {
    const openingBalance = balance;

    // Step 1: Charge interest on outstanding principal (bank policy: daily reducing, approximated monthly)
    const interest = openingBalance * r;

    // Step 2: EMI covers interest first, rest goes to principal
    const emiForThisRow = emi; // captured before any reduceEMI recompute below
    const principalFromEMI = Math.min(emiForThisRow - interest, openingBalance);

    // Step 3: Recurring prepayment is applied to principal after the regular EMI (bank standard)
    const recurringPrepay = Math.min(extraPayment, Math.max(0, openingBalance - principalFromEMI));

    // Step 4: A one-time lump sum, if this is the month for it
    const availableAfterRecurring = Math.max(0, openingBalance - principalFromEMI - recurringPrepay);
    const lumpSumApplied = (lumpSum > 0 && month === lumpSumMonth)
      ? Math.min(lumpSum, availableAfterRecurring)
      : 0;

    const totalPrincipalPaid = principalFromEMI + recurringPrepay + lumpSumApplied;
    const totalPayment = interest + totalPrincipalPaid;

    balance = Math.max(0, openingBalance - totalPrincipalPaid);

    schedule.push({
      month,
      emi: emiForThisRow,                       // what was actually paid this month
      principalPaid: Math.round(principalFromEMI), // Principal from EMI only
      prepaymentApplied: Math.round(recurringPrepay + lumpSumApplied), // Extra prepayment (recurring + lump sum)
      totalPrincipalPaid: Math.round(totalPrincipalPaid),
      interest: Math.round(interest),
      totalPayment: Math.round(totalPayment),    // Total outflow this month
      openingBalance: Math.round(openingBalance), // For table display
      balance: Math.round(balance)               // Closing balance
    });

    // A lump sum in 'reduceEMI' mode keeps the original payoff date and
    // lowers the EMI from *next* month onward, instead of shortening the
    // tenure. Applied after recording this row, so this month's own EMI
    // still reflects what was actually paid.
    if (lumpSumApplied > 0 && prepaymentMode === 'reduceEMI' && balance > 0.01) {
      const monthsElapsedFromTrueStart = paidEMIs + month;
      const remainingMonths = Math.max(1, totalMonths - monthsElapsedFromTrueStart);
      emi = calculateEMI(balance, annualRate, remainingMonths / 12);
    }

    month++;
    if (month > 600) break; // safety cap at 50 years
  }

  return schedule;
}

// Calculate savings from prepayment. paidEMIs must match whatever was passed
// to generateSchedule elsewhere for the same loan, or the totals here will
// silently describe a different (full, from-scratch) loan than the
// amortization schedule shown alongside it.
export function calculateSavings(principal, annualRate, tenureYears, extraPayment, paidEMIs = 0, lumpSum = 0, lumpSumMonth = 1, prepaymentMode = 'reduceTenure') {
  const withoutPrepayment = generateSchedule(principal, annualRate, tenureYears, 0, paidEMIs);
  const withPrepayment = generateSchedule(principal, annualRate, tenureYears, extraPayment, paidEMIs, lumpSum, lumpSumMonth, prepaymentMode);

  const interestWithout = withoutPrepayment.reduce((sum, row) => sum + row.interest, 0);
  const interestWith = withPrepayment.reduce((sum, row) => sum + row.interest, 0);

  return {
    monthsSaved: Math.max(0, withoutPrepayment.length - withPrepayment.length),
    interestSaved: Math.max(0, interestWithout - interestWith),
    totalInterestNoPrepayment: interestWithout,
    totalInterestWithPrepayment: interestWith,
    tenureYearsNoPrepayment: withoutPrepayment.length / 12,
    tenureYearsWithPrepayment: withPrepayment.length / 12
  };
}

// Indian Rupee Formatting (INR)
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  // Handle Lakhs/Crores for large numbers in readable format if needed
  // But for simple consistency, reuse en-IN locale
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Precise formatting for EMI and Interest
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
