import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/debtCalculations';

export default function PayoffScheduleTable({ schedule, debts }) {
  const [showAll, setShowAll] = useState(false);
  const visibleSchedule = showAll ? schedule : schedule.slice(0, 6);

  // Group columns for cleaner mobile view
  const debtNames = debts.map(d => d.name);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Month</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Extra Goes To</th>
              {debtNames.map(name => (
                <th key={name} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  {name} Balance
                </th>
              ))}
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total Debt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleSchedule.map((row, idx) => {
              const isClearedThisMonth = row.target === 'All Paid' || (idx > 0 && row.debtStates.some((d, i) => d.balance === 0 && schedule[idx-1].debtStates[i].balance > 0));
              
              return (
                <tr 
                  key={row.month} 
                  className={`group transition-colors ${isClearedThisMonth ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}
                >
                  <td className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400">
                    {row.month}
                  </td>
                  <td className="px-6 py-4">
                    {isClearedThisMonth ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">🎉 Milestone!</span>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{row.target}</span>
                    )}
                  </td>
                  {row.debtStates.map((debt) => (
                    <td key={debt.name} className={`px-6 py-4 text-right text-xs font-bold whitespace-nowrap ${debt.balance === 0 ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400'}`}>
                      {debt.balance === 0 ? '✅ CLEARED' : formatINR(debt.balance)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{formatINR(row.totalDebt)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button 
        onClick={() => setShowAll(!showAll)}
        className="w-full py-4 flex items-center justify-center text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
      >
        {showAll ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            View Full {schedule.length} Month Schedule
          </>
        )}
      </button>
    </div>
  );
}
