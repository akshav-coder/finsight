import { ShieldAlert, TrendingUp } from 'lucide-react';
import { formatINR, TAX_CONSTANTS } from '../../utils/taxCalculations';

export default function Section80CBar({ inputs }) {
  const totalInvested = (inputs.epf || 0) + (inputs.ppf || 0) + 
    (inputs.elss || 0) + (inputs.lifeInsurance || 0) + 
    (inputs.nsc || 0) + (inputs.fdTaxSaver || 0) +
    (inputs.tuitionFees || 0) + (inputs.homeLoanPrincipal || 0);

  const limit = TAX_CONSTANTS.section80C_limit;
  const used = Math.min(totalInvested, limit);
  const remaining = Math.max(0, limit - totalInvested);
  const percentUsed = Math.min(100, (used / limit) * 100);
  
  const isMaxed = remaining === 0;

  // Potential tax saved is roughly 30% for someone earning > 10L, 
  // we'll just use a generic assumption or say "up to 30%"
  const potentialSavings = remaining * 0.30;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center">
            Section 80C Utilization
          </h3>
          <p className="text-xs text-slate-500 font-medium">Core tax saving bucket</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-slate-900 dark:text-white uppercase">
            {formatINR(used)} <span className="text-slate-400 text-xs lowercase">/ {formatINR(limit)}</span>
          </div>
        </div>
      </div>

      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative flex">
         {totalInvested > 0 && percentUsed < 100 && (
            <div className="h-full bg-emerald-500" style={{ width: `${percentUsed}%` }} />
         )}
         {percentUsed === 100 && (
            <div className="h-full bg-emerald-500 w-full" />
         )}
         {/* Subtle overflow indication if they invested more than 1.5L */}
         {totalInvested > limit && (
           <div className="absolute right-0 top-0 bottom-0 pr-2 flex items-center text-[8px] font-black text-white mix-blend-overlay">
             OVER LIMIT ({formatINR(totalInvested)})
           </div>
         )}
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        {!isMaxed ? (
          <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex space-x-3 items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-xl text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">Focus Here First</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-500 font-bold leading-tight">
                You have {formatINR(remaining)} of unused 80C limit! Invest this in ELSS or PPF to save up to {formatINR(potentialSavings)} in tax.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex space-x-3 items-center">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">Maxed Out! Awesome!</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-500 font-bold leading-tight">
                You are fully utilizing your 80C limit. Look for other deductions like 80D (Health) or NPS below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
