import { describe, it, expect } from 'vitest';
import {
  avalancheSchedule,
  snowballSchedule,
  minimumOnlySchedule,
  getTotalInterestFromSchedule,
  isDebtTrap,
  getPayoffOrder,
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

describe('rollover — the actual "snowball" effect', () => {
  it('a paid-off debt\'s minimum payment rolls into the next target, not into the void', () => {
    // Regression: a previous version paid every active debt only its own
    // fixed minimum plus a flat extraPayment forever — once a debt cleared,
    // its minimum simply vanished from the model instead of accelerating
    // the next target, understating the real benefit of both strategies.
    const debts = [
      { name: 'Debt A (small)', balance: 20000, rate: 20, minPayment: 2000 },
      { name: 'Debt B (large)', balance: 300000, rate: 15, minPayment: 5000 },
    ];
    const schedule = snowballSchedule(debts, 1000);

    const clearRow = schedule.find(r => r.debtStates.find(d => d.name === 'Debt A (small)').balance === 0);
    const rowBefore = schedule[clearRow.month - 2]; // one full month before A clears
    const rowsAfter = schedule.slice(clearRow.month, clearRow.month + 3); // a few months after

    const balanceOf = (row, name) => row.debtStates.find(d => d.name === name).balance;
    const monthlyDropBefore = balanceOf(rowBefore, 'Debt B (large)') - balanceOf(schedule[clearRow.month - 1], 'Debt B (large)');
    const monthlyDropAfter = balanceOf(rowsAfter[0], 'Debt B (large)') - balanceOf(rowsAfter[1], 'Debt B (large)');

    // Debt B should start shrinking noticeably faster once A's ₹2,000
    // minimum rolls into it, on top of the original ₹1,000 extra.
    expect(monthlyDropAfter).toBeGreaterThan(monthlyDropBefore);
  });

  it('produces a shorter payoff and less interest than the old no-rollover behavior would', () => {
    const debts = [
      { name: 'A', balance: 20000, rate: 20, minPayment: 2000 },
      { name: 'B', balance: 300000, rate: 15, minPayment: 5000 },
    ];

    // Manually simulate the OLD (buggy) behavior for comparison: each
    // active debt pays only its own fixed minimum forever, and the target
    // gets just the flat extraPayment — a paid-off debt's minimum is never
    // redirected anywhere.
    function oldNoRolloverSchedule(inputDebts, extraPayment) {
      let remaining = inputDebts.map(d => ({ ...d }));
      let month = 0;
      let totalInterest = 0;
      while (remaining.some(d => d.balance > 0) && month < 600) {
        month++;
        remaining.forEach(debt => {
          if (debt.balance <= 0) return;
          const interest = debt.balance * (debt.rate / 100 / 12);
          totalInterest += interest;
          const principalFromMin = Math.min(debt.minPayment - interest, debt.balance);
          debt.balance = Math.max(0, debt.balance - principalFromMin);
        });
        const target = remaining.filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance)[0];
        if (target) target.balance = Math.max(0, target.balance - extraPayment);
      }
      return { months: month, totalInterest };
    }

    const fixedSchedule = snowballSchedule(debts, 1000);
    const oldBehavior = oldNoRolloverSchedule(debts, 1000);

    expect(fixedSchedule.length).toBeLessThan(oldBehavior.months);
    expect(getTotalInterestFromSchedule(fixedSchedule)).toBeLessThan(oldBehavior.totalInterest);
  });
});

describe('trap detection — no real progress being made', () => {
  it('flags a trap when even every rolled-over rupee can\'t outpace interest', () => {
    // With rollover now working correctly (see above), a debt with an
    // under-sized minimum is only a genuine, unsolvable trap if the FULL
    // combined budget — every debt's minimum, once rolled together —
    // still can't cover its interest. Here even a maxed-out ₹500,000
    // balance at 42% (~₹17,500/mo interest) receiving the entire ₹4,500/mo
    // combined budget (both debts' minimums, extraPayment = 0) can never
    // catch up. This used to silently run to the 600-month cap and sum
    // interest across a runaway-growing balance — producing a "total
    // interest" figure in the trillions for a two-debt scenario.
    const debts = [
      { name: 'Personal Loan', balance: 50000, rate: 14, minPayment: 3000 },
      { name: 'Credit Card', balance: 500000, rate: 42, minPayment: 1500 },
    ];
    const schedule = minimumOnlySchedule(debts); // extraPayment = 0
    expect(isDebtTrap(schedule)).toBe(true);
    expect(schedule.length).toBeLessThan(30);
    expect(getTotalInterestFromSchedule(schedule)).toBeLessThan(1000000); // sane, not trillions
  });

  it('is not a trap once rollover (or a big enough extra payment) lets the budget catch up', () => {
    // Same shape as the classic "under-sized minimum" case, but sized so
    // that once the Personal Loan clears and rolls its minimum onto the
    // Credit Card, the combined amount comfortably covers its interest —
    // this should resolve, not trap, thanks to the rollover fix.
    const debts = [
      { name: 'Personal Loan', balance: 200000, rate: 14, minPayment: 6000 },
      { name: 'Credit Card', balance: 50000, rate: 42, minPayment: 1500 },
    ];
    const withoutExtra = minimumOnlySchedule(debts);
    expect(isDebtTrap(withoutExtra)).toBe(false);
    expect(withoutExtra[withoutExtra.length - 1].totalDebt).toBe(0);

    const withExtra = avalancheSchedule(debts, 3000);
    expect(isDebtTrap(withExtra)).toBe(false);
    expect(withExtra[withExtra.length - 1].totalDebt).toBe(0);
  });
});

describe('getPayoffOrder', () => {
  it('reflects the actual strategy priority, not the order debts were entered in', () => {
    // Regression: the UI's "Payoff Order" list previously just echoed
    // debtStates from month 1 in input order, which is unrelated to which
    // debt the strategy actually targets first — it contradicted the
    // separately-computed (correct) order shown elsewhere on the same page.
    const debts = [
      { name: 'Personal Loan', balance: 200000, rate: 14, minPayment: 6000 }, // entered first
      { name: 'Credit Card', balance: 50000, rate: 42, minPayment: 1500 },    // entered second, but highest rate
    ];
    const schedule = avalancheSchedule(debts, 3000);
    const order = getPayoffOrder(debts, schedule);
    expect(order[0].name).toBe('Credit Card'); // avalanche pays this off first despite input order
    expect(order[1].name).toBe('Personal Loan');
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
