/**
 * Debt Payoff Calculation Utility
 */

/**
 * Shared engine for both avalanche and snowball. Every dollar you were
 * paying stays committed each month: once a debt is paid off, its minimum
 * payment doesn't disappear — it rolls into the "extra" pool for whichever
 * debt is currently the strategy's target, on top of the flat extraPayment.
 * This is the actual textbook definition of both methods (the "snowball"
 * in debt snowball specifically refers to this accelerating effect) — a
 * previous version paid each debt only its own fixed minimum plus a flat
 * extraPayment forever, understating the real benefit of both strategies.
 *
 * @param {Array} debts
 * @param {number} extraPayment
 * @param {(a, b) => number} pickTargetSort - comparator; debts[0] after
 *   sorting is this month's priority target.
 */
function runSchedule(debts, extraPayment, pickTargetSort) {
  let remaining = debts.map(d => ({
    ...d,
    balance: Number(d.balance),
    rate: Number(d.rate),
    minPayment: Number(d.minPayment)
  }));

  const totalMinPayment = remaining.reduce((s, d) => s + d.minPayment, 0);
  const schedule = [];
  let month = 0;
  let totalInterest = 0;
  let stuckMonths = 0;
  let previousTotalDebt = remaining.reduce((s, d) => s + d.balance, 0);
  let isTrap = false;

  while (remaining.some(d => d.balance > 0) && month < 600) {
    month++;

    // Freed-up minimums from already-paid-off debts roll into this month's
    // extra pool, on top of the flat extraPayment — the actual "snowball".
    const activeMinPayment = remaining
      .filter(d => d.balance > 0)
      .reduce((s, d) => s + d.minPayment, 0);
    const rolledOverExtra = extraPayment + (totalMinPayment - activeMinPayment);

    // 1. Charge interest and apply each active debt's own minimum payment.
    remaining.forEach(debt => {
      if (debt.balance <= 0) return;
      const interest = debt.balance * (debt.rate / 100 / 12);
      totalInterest += interest;

      // Deliberately not clamped to 0: if this debt's own minimum doesn't
      // cover its own interest, the shortfall capitalizes onto the balance
      // (the balance grows) exactly like it would with a real lender.
      const principalFromMin = debt.minPayment - interest;
      debt.balance = Math.max(0, debt.balance - principalFromMin);
    });

    // 2. This month's target (highest rate for avalanche, smallest balance
    //    for snowball) gets the entire rolled-over extra pool.
    const target = remaining
      .filter(d => d.balance > 0)
      .sort(pickTargetSort)[0];

    if (target && rolledOverExtra > 0) {
      target.balance = Math.max(0, target.balance - rolledOverExtra);
    }

    schedule.push({
      month,
      target: target?.name || 'All Paid',
      debtStates: remaining.map(d => ({
        name: d.name,
        balance: Math.round(Math.max(0, d.balance))
      })),
      totalDebt: Math.round(remaining.reduce((s, d) => s + Math.max(0, d.balance), 0)),
      totalInterest: Math.round(totalInterest)
    });

    // Even with every dollar of every minimum plus all extra payments
    // rolled together, it's possible for combined interest to outpace the
    // whole budget (e.g. a high-rate debt with an under-sized minimum and
    // no meaningful extra payment set). Detect "no real progress being
    // made" robustly — rather than reasoning about any one debt in
    // isolation — and stop instead of compounding for 600 months straight
    // into an astronomical "total interest" figure.
    const currentTotalDebt = remaining.reduce((s, d) => s + Math.max(0, d.balance), 0);
    stuckMonths = currentTotalDebt >= previousTotalDebt - 0.01 ? stuckMonths + 1 : 0;
    previousTotalDebt = currentTotalDebt;
    if (stuckMonths >= 3) {
      isTrap = true;
      break;
    }
  }

  if (isTrap) {
    schedule[schedule.length - 1].warning = true;
  }

  return schedule;
}

/**
 * Generate avalanche payoff schedule
 * Strategy: Pay minimums on all, extra (plus any freed-up minimums from
 * paid-off debts) goes to the HIGHEST interest rate debt.
 */
export function avalancheSchedule(debts, extraPayment) {
  return runSchedule(debts, extraPayment, (a, b) => b.rate - a.rate);
}

/**
 * Generate snowball payoff schedule
 * Strategy: Pay minimums on all, extra (plus any freed-up minimums from
 * paid-off debts) goes to the SMALLEST balance debt.
 */
export function snowballSchedule(debts, extraPayment) {
  return runSchedule(debts, extraPayment, (a, b) => a.balance - b.balance);
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
 * True if a schedule ends because no further progress was being made
 * (the combined minimums + extra payment can't outpace interest), rather
 * than because every debt actually reached zero.
 */
export function isDebtTrap(schedule) {
  return schedule.length > 0 && schedule[schedule.length - 1].warning === true;
}

/**
 * The order debts actually get paid off in, derived from when each one's
 * balance first hits zero in the schedule — not the order they were typed
 * in, which may not match the strategy's real priority (e.g. avalanche
 * targets the highest rate first regardless of input order).
 */
export function getPayoffOrder(debts, schedule) {
  const payoffMonth = (name) => {
    if (!schedule || schedule.length === 0) return Infinity;
    const row = schedule.find(r => r.debtStates?.find(d => d.name === name)?.balance === 0);
    return row ? row.month : schedule.length;
  };
  return [...debts].sort((a, b) => payoffMonth(a.name) - payoffMonth(b.name));
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
