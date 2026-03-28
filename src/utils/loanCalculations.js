/**
 * Loan Calculation Utilities
 */

// Monthly EMI calculation
export function calculateEMI(principal, annualRate, tenureYears) {
  if (!principal || !annualRate || !tenureYears) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Full amortization schedule generation — Reducing Balance Method (Indian Bank Standard)
export function generateSchedule(principal, annualRate, tenureYears, extraPayment = 0, paidEMIs = 0) {
  if (!principal || !annualRate || !tenureYears) return [];
  
  const r = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  let balance = principal;
  const schedule = [];
  
  // Fast forward already paid EMIs (reduces balance using real reducing balance logic)
  for (let i = 0; i < paidEMIs; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    if (balance <= 0) break;
  }
  
  // Generate remaining schedule — one row per month
  let month = 1;
  while (balance > 0.01) {
    const openingBalance = balance;

    // Step 1: Charge interest on outstanding principal (bank policy: daily reducing, approximated monthly)
    const interest = openingBalance * r;

    // Step 2: EMI covers interest first, rest goes to principal
    const principalFromEMI = Math.min(emi - interest, openingBalance);

    // Step 3: Prepayment is applied to principal AFTER the regular EMI (bank standard)
    const prepaymentApplied = Math.min(extraPayment, Math.max(0, openingBalance - principalFromEMI));

    const totalPrincipalPaid = principalFromEMI + prepaymentApplied;
    const totalPayment = interest + totalPrincipalPaid;

    balance = Math.max(0, openingBalance - totalPrincipalPaid);
    
    schedule.push({ 
      month, 
      emi,                                      // Fixed EMI amount
      principalPaid: Math.round(principalFromEMI), // Principal from EMI only
      prepaymentApplied: Math.round(prepaymentApplied), // Extra prepayment
      totalPrincipalPaid: Math.round(totalPrincipalPaid),
      interest: Math.round(interest), 
      totalPayment: Math.round(totalPayment),    // Total outflow this month
      openingBalance: Math.round(openingBalance), // For table display
      balance: Math.round(balance)               // Closing balance
    });
    
    month++;
    if (month > 600) break; // safety cap at 50 years
  }
  
  return schedule;
}

// Calculate savings from prepayment
export function calculateSavings(principal, annualRate, tenureYears, extraPayment) {
  const withoutPrepayment = generateSchedule(principal, annualRate, tenureYears, 0);
  const withPrepayment = generateSchedule(principal, annualRate, tenureYears, extraPayment);
  
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
