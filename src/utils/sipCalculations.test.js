import { describe, it, expect } from 'vitest';
import {
  calculateSIP,
  calculateRequiredSIP,
  calculateStepUpSIP,
  generateSIPSchedule,
  totalStepUpInvested,
} from './sipCalculations';

describe('calculateSIP', () => {
  it('matches the well-known ₹5,000/month, 12%, 10-year example (~₹11.6L)', () => {
    expect(calculateSIP(5000, 12, 10)).toBeCloseTo(1161695.38, 1);
  });

  it('at 0% return, future value is exactly the sum of contributions', () => {
    expect(calculateSIP(5000, 0, 10)).toBe(5000 * 12 * 10);
  });

  it('increases with a higher expected rate of return', () => {
    const lower = calculateSIP(5000, 8, 10);
    const higher = calculateSIP(5000, 15, 10);
    expect(higher).toBeGreaterThan(lower);
  });
});

describe('calculateRequiredSIP', () => {
  it('is the inverse of calculateSIP — investing the required amount hits the target', () => {
    const target = 1161695.38;
    const required = calculateRequiredSIP(target, 12, 10);
    const achieved = calculateSIP(required, 12, 10);
    expect(achieved).toBeCloseTo(target, 0);
  });

  it('at 0% return, required SIP is simply target divided by total months', () => {
    expect(calculateRequiredSIP(600000, 0, 10)).toBeCloseTo(600000 / 120, 5);
  });
});

describe('calculateStepUpSIP', () => {
  it('with 0% step-up and 0% return, equals a flat SIP total', () => {
    expect(calculateStepUpSIP(5000, 0, 10, 0)).toBe(5000 * 12 * 10);
  });

  it('produces a larger corpus than a flat SIP of the same starting amount', () => {
    const flat = calculateSIP(5000, 12, 10);
    const steppedUp = calculateStepUpSIP(5000, 12, 10, 10);
    expect(steppedUp).toBeGreaterThan(flat);
  });
});

describe('totalStepUpInvested', () => {
  it('with 0% step-up, equals monthly * 12 * years', () => {
    expect(totalStepUpInvested(5000, 10, 0)).toBe(5000 * 12 * 10);
  });

  it('increases total invested as the step-up percentage increases', () => {
    const noStepUp = totalStepUpInvested(5000, 10, 0);
    const withStepUp = totalStepUpInvested(5000, 10, 10);
    expect(withStepUp).toBeGreaterThan(noStepUp);
  });
});

describe('generateSIPSchedule', () => {
  it('produces one row per year, with invested amount growing monotonically', () => {
    const schedule = generateSIPSchedule(5000, 12, 5);
    expect(schedule).toHaveLength(5);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].invested).toBeGreaterThan(schedule[i - 1].invested);
      expect(schedule[i].totalValue).toBeGreaterThan(schedule[i - 1].totalValue);
    }
  });

  it('the final year\'s total invested matches a flat-SIP total (no step-up)', () => {
    const schedule = generateSIPSchedule(5000, 12, 10, 0);
    const lastYear = schedule[schedule.length - 1];
    expect(lastYear.invested).toBe(5000 * 12 * 10);
  });
});
