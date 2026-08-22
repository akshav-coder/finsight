import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatINR, calculatePrematureWithdrawal } from '../../utils/fdRdCalculations';

export default function PrematureWithdrawalCard({ fdData, fdResults }) {
  const [monthsHeld, setMonthsHeld] = useState(6);
  const [penaltyPercent, setPenaltyPercent] = useState(1);

  const totalMonths = Math.round(fdResults.totalYears * 12);
  const maxMonths = Math.max(1, totalMonths - 1);

  const impact = useMemo(
    () => calculatePrematureWithdrawal(fdData.amount, fdData.rate, monthsHeld, fdData.compounding, penaltyPercent),
    [fdData.amount, fdData.rate, monthsHeld, fdData.compounding, penaltyPercent]
  );

  if (!fdData.amount || !fdData.rate || totalMonths < 2) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center">
        <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-3">
          <AlertTriangle className="w-5 h-5" />
        </span>
        What If You Withdraw Early?
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 ml-11">
        Breaking an FD early usually costs you twice: a lower rate for the actual holding period, plus a penalty on top.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Months held so far
          </label>
          <input
            type="range"
            min="1"
            max={maxMonths}
            value={Math.min(monthsHeld, maxMonths)}
            onChange={(e) => setMonthsHeld(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">{Math.min(monthsHeld, maxMonths)} of {totalMonths} months</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Bank's penalty (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={penaltyPercent}
            onChange={(e) => setPenaltyPercent(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
          />
          <p className="text-[10px] text-slate-400 mt-1">Typically 0.5–1%</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Effective rate for this period</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{impact.effectiveRate.toFixed(2)}% <span className="text-slate-400 font-normal">(vs {fdData.rate}% booked)</span></span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">You'd receive</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{formatINR(impact.payableAmount)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-amber-100 dark:border-amber-900/30 flex justify-between items-center">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Cost of breaking it early</span>
        <span className="text-xl font-black text-amber-600 dark:text-amber-400">{formatINR(impact.penaltyCost)}</span>
      </div>

      <p className="text-[10px] text-slate-400 mt-4 italic">
        Estimate only — actual penalty terms and the rate applicable to your real holding period vary by bank. Some
        tax-saver (5-year, Section 80C) FDs don't allow premature withdrawal at all.
      </p>
    </div>
  );
}
