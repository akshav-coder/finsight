import { describe, it, expect } from 'vitest';
import {
  getDynamicBenchmarks,
  calculateHealthScore,
  getAllocationData,
  calculatePotentialSavings,
  projectGrowth,
} from './savingsAdvisorCalculations';

describe('getDynamicBenchmarks', () => {
  it('scales every benchmark proportionally to income', () => {
    const low = getDynamicBenchmarks(30000);
    const high = getDynamicBenchmarks(60000);
    expect(high.groceries.good).toBeCloseTo(low.groceries.good * 2, 5);
  });
});

describe('calculateHealthScore', () => {
  it('gives a strong score to someone saving 30%+, no debt, investing well', () => {
    const score = calculateHealthScore({
      income: 100000,
      savings: 30000,
      loans: 0,
      investments: 20000,
      emergencyFund: 600000, // 6+ months of a low expense base
      rent: 20000,
    });
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('gives a weak score to someone saving nothing with high debt', () => {
    const score = calculateHealthScore({
      income: 50000,
      savings: 0,
      loans: 30000, // 60% debt-to-income
      investments: 0,
      emergencyFund: 0,
    });
    expect(score).toBeLessThan(30);
  });

  it('never exceeds 100 or goes negative', () => {
    const maxed = calculateHealthScore({
      income: 100000,
      savings: 50000,
      loans: 0,
      investments: 30000,
      emergencyFund: 1000000,
    });
    expect(maxed).toBeLessThanOrEqual(100);
    expect(maxed).toBeGreaterThanOrEqual(0);
  });

  it('does not throw on an empty input object', () => {
    expect(() => calculateHealthScore({})).not.toThrow();
  });
});

describe('getAllocationData', () => {
  it('buckets spending into needs/wants/EMI/savings correctly', () => {
    const data = getAllocationData({
      rent: 15000,
      groceries: 5000,
      foodDelivery: 2000,
      shopping: 3000,
      loans: 8000,
      savings: 10000,
      investments: 5000,
    });
    const needs = data.find((d) => d.name === 'Needs');
    const wants = data.find((d) => d.name === 'Wants');
    const emi = data.find((d) => d.name === 'EMI/Debt');
    const savings = data.find((d) => d.name === 'Savings');

    expect(needs.value).toBe(20000); // rent + groceries
    expect(wants.value).toBe(5000); // foodDelivery + shopping
    expect(emi.value).toBe(8000);
    expect(savings.value).toBe(15000); // savings + investments
  });
});

describe('calculatePotentialSavings', () => {
  it('only counts overspend above the benchmark, never underspend', () => {
    const income = 60000;
    const benchmarks = getDynamicBenchmarks(income);
    const potential = calculatePotentialSavings({
      income,
      foodDelivery: benchmarks.foodDelivery.good + 1000, // over by 1000
      groceries: benchmarks.groceries.good - 1000, // under — shouldn't subtract
    });
    expect(potential).toBe(1000);
  });

  it('returns 0 when nothing exceeds its benchmark', () => {
    const potential = calculatePotentialSavings({ income: 60000 });
    expect(potential).toBe(0);
  });
});

describe('projectGrowth', () => {
  it('at 0% return, equals the sum of contributions', () => {
    expect(projectGrowth(5000, 0, 10)).toBe(5000 * 120);
  });

  it('grows with a higher rate of return', () => {
    const lower = projectGrowth(5000, 6, 10);
    const higher = projectGrowth(5000, 12, 10);
    expect(higher).toBeGreaterThan(lower);
  });

  it('returns 0 for invalid input', () => {
    expect(projectGrowth(0, 10, 10)).toBe(0);
  });
});
