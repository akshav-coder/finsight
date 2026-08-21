/**
 * Credit Card Calculation Utilities
 */

// Format as Indian Rupee
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Minimum payment schedule
export function calculateMinPaymentSchedule(balance, annualRate, minPercent) {
  const monthlyRate = annualRate / 12 / 100;
  const schedule = [];
  let remaining = balance;
  let month = 0;

  while (remaining > 10 && month < 600) {
    const interest = remaining * monthlyRate;
    // Standard Indian CC min payment is usually 5% of balance or a fixed min (e.g. ₹100)
    const minPayment = Math.max(remaining * (minPercent / 100), 100);

    if (minPayment <= interest) {
      // DANGER: the minimum payment doesn't cover interest, so the balance
      // can only grow — never shrink. Since minPayment and interest both
      // scale with `remaining`, this isn't a temporary dip: if it's true
      // once, it's true every month forever. Flag it and stop after
      // showing the trend (same 24-month grace period as the fixed-payment
      // path below), rather than compounding an unbounded balance out to
      // the 600-month cap — which previously produced "total interest"
      // figures in the hundreds of crores for an ordinary card balance.
      remaining = remaining + (interest - minPayment);
      schedule.push({
        month: month + 1,
        payment: minPayment,
        interest,
        principalPaid: 0,
        balance: remaining,
        warning: true
      });
      if (month > 24) break;
    } else {
      const principalPaid = minPayment - interest;
      remaining = remaining - principalPaid;

      schedule.push({
        month: month + 1,
        payment: minPayment,
        interest,
        principalPaid: Math.max(0, principalPaid),
        balance: Math.max(0, remaining)
      });
    }
    month++;
  }
  return schedule;
}

// Fixed payment schedule
export function calculateFixedPaymentSchedule(balance, annualRate, monthlyPayment) {
  const monthlyRate = annualRate / 12 / 100;
  const schedule = [];
  let remaining = balance;
  let month = 0;

  while (remaining > 0 && month < 600) {
    const interest = remaining * monthlyRate;

    if (monthlyPayment <= interest) {
      // DANGER: Payment doesn't even cover interest — balance grows!
      schedule.push({
        month: month + 1,
        payment: monthlyPayment,
        interest,
        principalPaid: 0,
        balance: remaining + (interest - monthlyPayment),
        warning: true
      });
      // We break early if it's an infinite loop trap for visualization
      if (month > 24) break;
    } else {
      const principalPaid = Math.min(remaining, monthlyPayment - interest);
      remaining = Math.max(0, remaining - principalPaid);

      schedule.push({
        month: month + 1,
        payment: monthlyPayment,
        interest,
        principalPaid,
        balance: remaining
      });
    }
    month++;
    if (remaining <= 0) break;
  }
  return schedule;
}

// True if a schedule ends because the payment can never cover interest (the
// balance is still growing when the schedule stops), rather than because
// the card was actually paid off. Downstream UI should show "Never" /
// a clear warning instead of treating the schedule's totals as a real payoff.
export function isInfiniteTrap(schedule) {
  return schedule.length > 0 && schedule[schedule.length - 1].warning === true;
}

export function totalInterest(schedule) {
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

export function isPaymentSufficient(balance, annualRate, payment) {
  const monthlyInterest = balance * (annualRate / 12 / 100);
  return payment > monthlyInterest;
}

export function calculateUtilization(balance, limit) {
  if (!limit || limit <= 0) return 0;
  return (balance / limit) * 100;
}
