import { describe, it, expect } from 'vitest';
import {
  calculateMinPaymentSchedule,
  calculateFixedPaymentSchedule,
  totalInterest,
  isPaymentSufficient,
  calculateUtilization,
} from './creditCardCalculations';

describe('calculateMinPaymentSchedule', () => {
  it('eventually pays off the balance when the minimum comfortably covers interest', () => {
    const schedule = calculateMinPaymentSchedule(50000, 36, 5);
    const last = schedule[schedule.length - 1];
    expect(last.balance).toBeLessThan(11); // loop exits once remaining <= 10
  });

  it('takes many months — this is the "minimum payment trap" the tool exists to illustrate', () => {
    const schedule = calculateMinPaymentSchedule(50000, 36, 5);
    expect(schedule.length).toBeGreaterThan(12);
  });
});

describe('calculateFixedPaymentSchedule', () => {
  it('pays off the balance when the fixed payment exceeds interest', () => {
    const schedule = calculateFixedPaymentSchedule(50000, 36, 5000);
    const last = schedule[schedule.length - 1];
    expect(last.balance).toBe(0);
    expect(last.warning).toBeFalsy();
  });

  it('flags a warning and grows the balance when payment doesn\'t cover interest', () => {
    // 36% APR on ₹50,000 ≈ ₹1,500/month interest — a ₹1,000 payment can't cover it.
    const schedule = calculateFixedPaymentSchedule(50000, 36, 1000);
    expect(schedule[0].warning).toBe(true);
    expect(schedule[schedule.length - 1].balance).toBeGreaterThan(50000);
  });

  it('a bigger fixed payment clears the balance faster', () => {
    const slow = calculateFixedPaymentSchedule(50000, 36, 3000);
    const fast = calculateFixedPaymentSchedule(50000, 36, 10000);
    expect(fast.length).toBeLessThan(slow.length);
  });
});

describe('totalInterest', () => {
  it('sums the interest column of a schedule', () => {
    const schedule = [{ interest: 100 }, { interest: 200 }, { interest: 50 }];
    expect(totalInterest(schedule)).toBe(350);
  });
});

describe('isPaymentSufficient', () => {
  it('is false when payment does not exceed the monthly interest charge', () => {
    // 36% APR on ₹50,000 = ₹1,500/month interest
    expect(isPaymentSufficient(50000, 36, 1500)).toBe(false);
    expect(isPaymentSufficient(50000, 36, 1000)).toBe(false);
  });

  it('is true once payment exceeds the monthly interest charge', () => {
    expect(isPaymentSufficient(50000, 36, 2000)).toBe(true);
  });
});

describe('calculateUtilization', () => {
  it('computes balance as a percentage of the credit limit', () => {
    expect(calculateUtilization(30000, 100000)).toBe(30);
  });

  it('returns 0 for a missing or zero limit instead of dividing by zero', () => {
    expect(calculateUtilization(30000, 0)).toBe(0);
    expect(calculateUtilization(30000, null)).toBe(0);
  });
});
