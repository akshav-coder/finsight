import { CalendarClock, Percent, IndianRupee, Receipt } from 'lucide-react';
import { formatINR } from '../../utils/fdRdCalculations';

/**
 * Shows detailed per-frequency interest breakdown for Non-Cumulative FDs.
 * Displays: Monthly / Quarterly / Half-Yearly / Annual interest payout,
 * total payouts over tenure, post-tax interest, and total post-tax amount receivable.
 */
export default function NonCumulativeBreakdown({ data, nonCumulativeData, taxImpact }) {
  const { breakdown, payoutPerPeriod, payoutLabel, totalPayouts, totalInterest } = nonCumulativeData;

  const rows = [
    { label: 'Daily Interest',       value: breakdown.daily,      period: 'per day' },
    { label: 'Monthly Interest',     value: breakdown.monthly,    period: 'per month' },
    { label: 'Quarterly Interest',   value: breakdown.quarterly,  period: 'per quarter' },
    { label: 'Half-Yearly Interest', value: breakdown.halfYearly, period: 'per half year' },
    { label: 'Annual Interest',      value: breakdown.annually,   period: 'per year' },
  ];

  const selected = data.payoutFrequency;
  const postTaxPayoutPerPeriod = taxImpact.grossInterest > 0
    ? payoutPerPeriod * (taxImpact.netInterest / taxImpact.grossInterest)
    : 0;

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-emerald-200 dark:border-emerald-900/40 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarClock className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            Interest Payout Breakdown
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">
          Non-Cumulative
        </span>
      </div>

      {/* Per-frequency table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 text-left">Frequency</th>
              <th className="pb-3 text-right">Gross Interest</th>
              <th className="pb-3 text-right">Post-Tax ({data.taxSlab}% slab)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const postTax = taxImpact.grossInterest > 0
                ? row.value * (taxImpact.netInterest / taxImpact.grossInterest)
                : row.value;
              const isSelected = (
                (selected === 'Monthly' && row.label === 'Monthly Interest') ||
                (selected === 'Quarterly' && row.label === 'Quarterly Interest') ||
                (selected === 'Half-yearly' && row.label === 'Half-Yearly Interest') ||
                (selected === 'Annually' && row.label === 'Annual Interest')
              );
              return (
                <tr
                  key={row.label}
                  className={`border-b border-slate-50 dark:border-slate-800/50 transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.label}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{row.period}</span>
                  </td>
                  <td className={`py-3 text-right font-mono font-bold ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {formatINR(row.value)}
                  </td>
                  <td className={`py-3 text-right font-mono font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatINR(postTax)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Payout</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatINR(payoutPerPeriod)}</p>
          <p className="text-[10px] text-slate-400">{payoutLabel}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post-Tax Payout</p>
          <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">{formatINR(postTaxPayoutPerPeriod)}</p>
          <p className="text-[10px] text-slate-400">After {data.taxSlab}% tax</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payouts</p>
          <p className="text-lg font-black text-blue-600 dark:text-blue-400">{totalPayouts} times</p>
          <p className="text-[10px] text-slate-400">Over tenure</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Interest</p>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400">{formatINR(totalInterest)}</p>
          <p className="text-[10px] text-slate-400">Gross (pre-tax)</p>
        </div>
      </div>

      {/* Post-tax total */}
      <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
            Total Amount Receivable (Principal + Post-Tax Interest)
          </span>
        </div>
        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
          {formatINR(data.amount + taxImpact.netInterest)}
        </span>
      </div>
    </div>
  );
}
