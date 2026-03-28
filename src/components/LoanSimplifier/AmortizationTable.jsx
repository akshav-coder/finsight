import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../utils/loanCalculations';

export default function AmortizationTable({ schedule, startMonth, startYear }) {
  const [expanded, setExpanded] = useState(false);
  
  const displayRows = expanded ? schedule : schedule.slice(0, 12);
  const hasPrepayment = schedule.some(row => row.prepaymentApplied > 0);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="glass-panel overflow-hidden rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Amortization Schedule</h3>
          <p className="text-xs text-slate-400 mt-0.5">Reducing Balance Method — Interest charged on outstanding principal each month</p>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          {displayRows.length} of {schedule.length} months
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4">Month</th>
              <th className="px-6 py-4 text-right">Opening Balance</th>
              <th className="px-6 py-4 text-right">EMI</th>
              <th className="px-6 py-4 text-right text-blue-600 dark:text-blue-400">Principal</th>
              <th className="px-6 py-4 text-right text-rose-600 dark:text-rose-400">Interest</th>
              {hasPrepayment && (
                <th className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">Prepayment</th>
              )}
              <th className="px-6 py-4 text-right">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {displayRows.map((row, i) => {
              const currentMonthIndex = (startMonth + i) % 12;
              const currentYear = startYear + Math.floor((startMonth + i) / 12);
              
              return (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-slate-100 font-bold">{months[currentMonthIndex]} {currentYear}</span>
                      <span className="text-[10px] text-slate-400">Month {row.month}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCurrency(row.openingBalance)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {formatCurrency(Math.round(row.emi))}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {formatCurrency(row.principalPaid)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-rose-600 dark:text-rose-400">
                    {formatCurrency(row.interest)}
                  </td>
                  {hasPrepayment && (
                    <td className="px-6 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {row.prepaymentApplied > 0 ? formatCurrency(row.prepaymentApplied) : '—'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-slate-100 font-bold">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {schedule.length > 12 && (
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-center">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:scale-105 active:scale-95 group"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                <span>View All {schedule.length} Months</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
