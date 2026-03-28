import { useState, useMemo } from 'react';
import { Shield, Zap, TrendingUp, Plus, Minus } from 'lucide-react';
import { formatINR } from '../../utils/savingsAdvisorCalculations';

export default function EmergencyFundTracker({ formData, results }) {
  const { totalExpenses } = results;
  
  // Allow user to adjust additional monthly EF contribution within this component
  const [additionalContribution, setAdditionalContribution] = useState(formData.additionalEFSavings || 1000);

  const currentEF = formData.emergencyFund || 0;
  const targetEF = totalExpenses * 6;
  const progress = Math.min(100, (currentEF / Math.max(1, targetEF)) * 100);
  const gap = Math.max(0, targetEF - currentEF);

  const monthlySavings = results.currentSavings;

  // Time to goal with just regular savings
  const monthsToGoal = monthlySavings > 0 && gap > 0
    ? Math.ceil(gap / monthlySavings)
    : gap <= 0 ? 0 : Infinity;

  // Time to goal with additional EF contribution
  const totalMonthly = monthlySavings + additionalContribution;
  const fasterMonths = totalMonthly > 0 && gap > 0
    ? Math.ceil(gap / totalMonthly)
    : gap <= 0 ? 0 : Infinity;

  const timeSaved = (monthsToGoal !== Infinity && fasterMonths !== Infinity)
    ? Math.max(0, monthsToGoal - fasterMonths)
    : 0;

  const coverageMonths = totalExpenses > 0 ? (currentEF / totalExpenses).toFixed(1) : '0';

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full uppercase tracking-tight font-black">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-indigo-500" />
          Emergency Fund
        </h3>
        <span className="text-[10px] text-slate-400">Target: 6 Months</span>
      </div>

      <div className="space-y-6 flex-1">
        {/* Balance vs Target */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-[8px] text-slate-400">Current Balance</p>
            <p className="text-xl text-indigo-600 dark:text-indigo-400">{formatINR(currentEF)}</p>
            <p className="text-[8px] text-slate-400 mt-0.5">{coverageMonths} months covered</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-400">Target (6 Mo.)</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{formatINR(targetEF)}</p>
            <p className="text-[8px] text-slate-400 mt-0.5">Gap: {formatINR(gap)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-white drop-shadow-md">{progress.toFixed(0)}% Complete</span>
          </div>
        </div>

        {gap > 0 ? (
          <>
            {/* Additional Contribution Adjuster */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500">Extra Monthly EF Contribution</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAdditionalContribution(a => Math.max(0, a - 500))}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-black min-w-[60px] text-center">
                    {formatINR(additionalContribution)}
                  </span>
                  <button
                    onClick={() => setAdditionalContribution(a => Math.min(50000, a + 500))}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={additionalContribution}
                onChange={(e) => setAdditionalContribution(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Timeline Comparison */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center text-slate-400 text-[8px]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  At Current Savings
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {monthsToGoal === Infinity ? 'N/A (No Savings)' : `${monthsToGoal} Months`}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-emerald-500 text-[8px]">
                  <Zap className="w-3 h-3 mr-1" />
                  With Extra {formatINR(additionalContribution)}/mo
                </div>
                <p className="text-sm text-emerald-500">
                  {fasterMonths === Infinity ? 'N/A' : `${fasterMonths} Months`}
                  {timeSaved > 0 && <span className="text-[9px] ml-1 text-emerald-400">(-{timeSaved}mo faster)</span>}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 rounded-full text-white">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 normal-case">
              You are fully protected! Your buffer covers 6+ months of expenses.
            </p>
          </div>
        )}
      </div>

      <p className="text-[8px] text-slate-400 mt-6 italic lowercase first-letter:uppercase">
        Based on monthly expenses of {formatINR(totalExpenses)}.
      </p>
    </div>
  );
}
