/**
 * Savings Advisor Calculation Utilities
 * All benchmarks are income-relative (% of take-home salary) unless fixed by standard.
 */

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Returns dynamic BENCHMARKS based on take-home income
 * Amounts are computed as % of income using standard Indian financial guidelines
 */
export function getDynamicBenchmarks(income = 60000) {
  return {
    foodDelivery:  { good: income * 0.04,  high: income * 0.08,  label: 'Food Delivery' },
    groceries:     { good: income * 0.07,  high: income * 0.12,  label: 'Groceries' },
    transport:     { good: income * 0.05,  high: income * 0.10,  label: 'Transport' },
    shopping:      { good: income * 0.05,  high: income * 0.10,  label: 'Shopping' },
    entertainment: { good: income * 0.03,  high: income * 0.06,  label: 'Entertainment' },
    bills:         { good: income * 0.05,  high: income * 0.08,  label: 'Bills & Utilities' },
    health:        { good: income * 0.02,  high: income * 0.05,  label: 'Health & Medical' },
    insurance:     { good: income * 0.05,  high: income * 0.10,  label: 'Insurance' },
  };
}

// Legacy static benchmarks for backward compat
export const BENCHMARKS = {
  foodDelivery:  { good: 2000,  high: 4000  },
  groceries:     { good: 4000,  high: 7000  },
  transport:     { good: 2500,  high: 5000  },
  shopping:      { good: 3000,  high: 6000  },
  entertainment: { good: 1500,  high: 3000  },
  bills:         { good: 2000,  high: 4000  },
  health:        { good: 1000,  high: 2500  },
  insurance:     { good: 2000,  high: 5000  },
};

/**
 * Financial Health Score — 0 to 100
 * 
 * Component         Max Points  Rationale
 * ------------------------------------------
 * Savings Rate          30      >20% ideal, <10% poor
 * Emergency Fund        20      6 months = full marks
 * Debt Ratio            20      0 = full; >50% = 0
 * Investment Rate       20      >15% = full
 * Discretionary Spend   10      <15% = full
 */
export function calculateHealthScore(data) {
  let score = 0;
  const income = Math.max(data.income || 1, 1);

  const totalMonthlyExpenses =
    (data.rent         || 0) + (data.loans       || 0) + (data.insurance || 0) +
    (data.foodDelivery || 0) + (data.groceries   || 0) + (data.transport || 0) +
    (data.shopping     || 0) + (data.entertainment || 0) + (data.bills   || 0) +
    (data.health       || 0);

  const currentSavings = data.savings || 0;

  // 1. Savings Rate (30 pts) — % of income saved
  const savingsRate = currentSavings / income;
  if      (savingsRate >= 0.30) score += 30;
  else if (savingsRate >= 0.20) score += 22;
  else if (savingsRate >= 0.10) score += 12;
  else if (savingsRate >= 0.05) score += 5;
  else                          score += 0;

  // 2. Emergency Fund (20 pts) — months of expenses covered
  const monthsCovered = (data.emergencyFund || 0) / Math.max(1, totalMonthlyExpenses);
  if      (monthsCovered >= 6) score += 20;
  else if (monthsCovered >= 3) score += 12;
  else if (monthsCovered >= 1) score += 6;
  else                         score += 0;

  // 3. Debt-to-Income Ratio (20 pts) — only loan EMIs vs income
  const debtRatio = (data.loans || 0) / income;
  if      (debtRatio === 0)      score += 20;
  else if (debtRatio <= 0.20)    score += 16;
  else if (debtRatio <= 0.35)    score += 10;
  else if (debtRatio <= 0.50)    score += 5;
  else                           score += 0;

  // 4. Investment Rate (20 pts) — % of income actively invested
  const investRate = (data.investments || 0) / income;
  if      (investRate >= 0.20) score += 20;
  else if (investRate >= 0.15) score += 16;
  else if (investRate >= 0.10) score += 12;
  else if (investRate >= 0.05) score += 6;
  else                         score += 2;

  // 5. Discretionary Spending (10 pts) — food delivery + shopping + entertainment
  const discretionary = ((data.foodDelivery || 0) + (data.shopping || 0) + (data.entertainment || 0)) / income;
  if      (discretionary <= 0.10) score += 10;
  else if (discretionary <= 0.15) score += 8;
  else if (discretionary <= 0.20) score += 5;
  else if (discretionary <= 0.30) score += 2;
  else                            score += 0;

  return Math.min(100, Math.round(score));
}

/**
 * Income allocation breakdown for the donut chart.
 * Ideal = 50-20-20-10 (Needs-Savings-EMI-Wants) — revised: loans have their own ideal
 */
export function getAllocationData(data) {
  const needs   = (data.rent || 0) + (data.insurance || 0) + (data.groceries || 0) + (data.bills || 0) + (data.health || 0) + (data.transport || 0);
  const wants   = (data.foodDelivery || 0) + (data.shopping || 0) + (data.entertainment || 0) + (data.misc || 0);
  const savings = (data.savings || 0) + (data.investments || 0);
  const emis    = data.loans || 0;

  return [
    { name: 'Needs',     value: needs,   color: '#3b82f6', ideal: 50 },
    { name: 'Wants',     value: wants,   color: '#f59e0b', ideal: 20 },
    { name: 'EMI/Debt',  value: emis,    color: '#ef4444', ideal: 10 },
    { name: 'Savings',   value: savings, color: '#10b981', ideal: 20 },
  ];
}

/**
 * Potential monthly savings = sum of overspend vs dynamic benchmarks.
 * Only counts VARIABLE spending categories (not rent, insurance, loans).
 */
export function calculatePotentialSavings(data) {
  const income = Math.max(data.income || 1, 1);
  const benchmarks = getDynamicBenchmarks(income);
  
  // Only variable/controllable categories
  const controllable = ['foodDelivery', 'groceries', 'shopping', 'entertainment', 'transport', 'bills', 'health'];
  
  let potential = 0;
  controllable.forEach(key => {
    const spent = data[key] || 0;
    const limit = benchmarks[key]?.good || 0;
    if (spent > limit) potential += (spent - limit);
  });
  return Math.round(potential);
}

/**
 * SIP / FD / PPF growth projection — monthly compounding (SIP uses exact formula)
 */
export function projectGrowth(monthlyAmount, annualRate, years) {
  if (!monthlyAmount || !years) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthlyAmount * n;
  return monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
