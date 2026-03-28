import { formatINR, formatMonths } from '../../utils/debtCalculations';

export default function DebtProgressCards({ debts, schedule, strategyName }) {
  // Get the month when each debt is first fully paid off (balance reaches 0)
  const getPayoffMonth = (debtName) => {
    const payoffRow = schedule.find(row =>
      row.debtStates.find(d => d.name === debtName)?.balance === 0
    );
    return payoffRow ? payoffRow.month : schedule.length;
  };

  // Sort debts by payoff month (earliest = highest priority in this strategy)
  const sortedDebts = [...debts].sort((a, b) => getPayoffMonth(a.name) - getPayoffMonth(b.name));

  const getColorClass = (rate) => {
    if (rate >= 36) return 'border-red-500 shadow-red-500/10';
    if (rate >= 18) return 'border-orange-500 shadow-orange-500/10';
    if (rate >= 10) return 'border-amber-500 shadow-amber-500/10';
    return 'border-emerald-500 shadow-emerald-500/10';
  };

  const strategyLabel = strategyName === 'avalanche'
    ? 'Highest Rate First (Avalanche)'
    : 'Smallest Balance First (Snowball)';

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
        Payoff Order — {strategyLabel}
      </p>
      {sortedDebts.map((debt, idx) => {
        const payoffMonth = getPayoffMonth(debt.name);
        const colorClass = getColorClass(debt.rate);

        return (
          <div key={debt.id} className={`glass-panel p-5 rounded-2xl border-l-4 transition-all hover:translate-x-1 ${colorClass}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-[9px] font-black bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    #{idx + 1} Target
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{debt.name}</h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {debt.type} • {debt.rate}% Interest
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-slate-900 dark:text-white">{formatINR(debt.balance)}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Balance</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Time to Freedom</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {formatMonths(payoffMonth)}
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Min Payment</span>
                <span>{formatINR(debt.minPayment)}/mo</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

