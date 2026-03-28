/**
 * Debt Payoff Calculation Utility
 */

/**
 * Generate avalanche payoff schedule
 * Strategy: Pay minimums on all, extra goes to HIGHEST interest rate.
 */
export function avalancheSchedule(debts, extraPayment) {
  let remaining = debts.map(d => ({
    ...d, 
    balance: Number(d.balance),
    rate: Number(d.rate),
    minPayment: Number(d.minPayment)
  }));
  
  const schedule = [];
  let month = 0;
  let totalInterest = 0;
  
  while (remaining.some(d => d.balance > 0) && month < 600) {
    month++;
    let monthlyInterest = 0;
    
    // 1. Calculate interest and pay minimums on all active debts
    remaining.forEach(debt => {
      if (debt.balance <= 0) return;
      const interest = debt.balance * (debt.rate / 100 / 12);
      monthlyInterest += interest;
      totalInterest += interest;
      
      const principalFromMin = Math.min(debt.minPayment - interest, debt.balance);
      debt.balance = Math.max(0, debt.balance - principalFromMin);
    });
    
    // 2. Find highest rate debt with balance > 0 for extra payment
    const target = remaining
      .filter(d => d.balance > 0)
      .sort((a,b) => b.rate - a.rate)[0];
    
    // 3. Apply extra payment to target
    if (target) {
      target.balance = Math.max(0, target.balance - extraPayment);
    }
    
    schedule.push({
      month,
      target: target?.name || 'All Paid',
      debtStates: remaining.map(d => ({
        name: d.name, 
        balance: Math.round(Math.max(0, d.balance))
      })),
      totalDebt: Math.round(remaining.reduce((s,d) => s + Math.max(0,d.balance), 0)),
      totalInterest: Math.round(totalInterest)
    });
  }
  return schedule;
}

/**
 * Generate snowball payoff schedule
 * Strategy: Pay minimums on all, extra goes to SMALLEST balance.
 */
export function snowballSchedule(debts, extraPayment) {
  let remaining = debts.map(d => ({
    ...d, 
    balance: Number(d.balance),
    rate: Number(d.rate),
    minPayment: Number(d.minPayment)
  }));
  
  const schedule = [];
  let month = 0;
  let totalInterest = 0;
  
  while (remaining.some(d => d.balance > 0) && month < 600) {
    month++;
    let monthlyInterest = 0;
    
    remaining.forEach(debt => {
      if (debt.balance <= 0) return;
      const interest = debt.balance * (debt.rate / 100 / 12);
      monthlyInterest += interest;
      totalInterest += interest;
      
      const principalFromMin = Math.min(debt.minPayment - interest, debt.balance);
      debt.balance = Math.max(0, debt.balance - principalFromMin);
    });
    
    // Find SMALLEST balance debt (snowball difference)
    const target = remaining
      .filter(d => d.balance > 0)
      .sort((a,b) => a.balance - b.balance)[0];
    
    if (target) {
      target.balance = Math.max(0, target.balance - extraPayment);
    }
    
    schedule.push({
      month,
      target: target?.name || 'All Paid',
      debtStates: remaining.map(d => ({
        name: d.name,
        balance: Math.round(Math.max(0, d.balance))
      })),
      totalDebt: Math.round(remaining.reduce((s,d) => s + Math.max(0,d.balance), 0)),
      totalInterest: Math.round(totalInterest)
    });
  }
  return schedule;
}

/**
 * Minimum only schedule (for comparison)
 */
export function minimumOnlySchedule(debts) {
  return avalancheSchedule(debts, 0);
}

/**
 * Get total interest paid from a schedule
 */
export function getTotalInterestFromSchedule(schedule) {
  if (!schedule || schedule.length === 0) return 0;
  return schedule[schedule.length - 1].totalInterest;
}

/**
 * Format month count to years and months
 */
export function formatMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) return `${months} months`;
  if (months === 0) return `${years} years`;
  return `${years} years ${months} months`;
}

/**
 * Currency formatter for INR
 */
export function formatINR(amount) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return "₹0";
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericAmount);
}
