import { describe, it, expect } from 'vitest';
import {
  avalancheSchedule,
  snowballSchedule,
  minimumOnlySchedule,
  getTotalInterestFromSchedule,
  formatMonths,
} from './debtCalculations';

const twoDebts = [
  { name: 'Credit Card', balance: 50000, rate: 36, minPayment: 2000 },
  { name: 'Personal Loan', balance: 150000, rate: 14, minPayment: 4000 },
];

describe('avalancheSchedule', () => {
  it('targets the highest-rate debt first (Credit Card at 36%)', () => {
    const schedule = avalancheSchedule(twoDebts, 5000);
    expect(schedule[0].target).toBe('Credit Card');
  });

  it('eventually pays off all debt', () => {
    const schedule = avalancheSchedule(twoDebts, 5000);
    const last = schedule[schedule.length - 1];
    expect(last.totalDebt).toBe(0);
  });

  it('a bigger extra payment clears debt in fewer months', () => {
    const slow = avalancheSchedule(twoDebts, 2000);
    const fast = avalancheSchedule(twoDebts, 10000);
    expect(fast.length).toBeLessThan(slow.length);
  });
});

describe('snowballSchedule', () => {
  it('targets the smallest-balance debt first (Credit Card at ₹50,000)', () => {
    const schedule = snowballSchedule(twoDebts, 5000);
    expect(schedule[0].target).toBe('Credit Card');
  });

  it('eventually pays off all debt', () => {
    const schedule = snowballSchedule(twoDebts, 5000);
    const last = schedule[schedule.length - 1];
    expect(last.totalDebt).toBe(0);
  });
});

describe('avalanche vs snowball', () => {
  it('avalanche never pays more total interest than snowball (it targets the costliest debt)', () => {
    const avalancheInterest = getTotalInterestFromSchedule(avalancheSchedule(twoDebts, 5000));
    const snowballInterest = getTotalInterestFromSchedule(snowballSchedule(twoDebts, 5000));
    expect(avalancheInterest).toBeLessThanOrEqual(snowballInterest);
  });
});

describe('minimumOnlySchedule', () => {
  it('is equivalent to avalanche with zero extra payment', () => {
    const minOnly = minimumOnlySchedule(twoDebts);
    const avalancheZero = avalancheSchedule(twoDebts, 0);
    expect(minOnly).toEqual(avalancheZero);
  });
});

describe('formatMonths', () => {
  it('formats whole years with no remainder', () => {
    expect(formatMonths(24)).toBe('2 years');
  });

  it('formats a partial year as months only', () => {
    expect(formatMonths(8)).toBe('8 months');
  });

  it('formats a mix of years and months', () => {
    expect(formatMonths(26)).toBe('2 years 2 months');
  });
});
