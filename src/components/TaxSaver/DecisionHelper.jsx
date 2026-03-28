import { Lightbulb, Info, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/taxCalculations';

export default function DecisionHelper({ taxAnalysis }) {
  if (!taxAnalysis) return null;

  const { oldRegime, newRegime, grossIncome } = taxAnalysis;
  const isOldBetter = oldRegime.totalTax < newRegime.totalTax;
  
  // Breakeven logic simplified: 
  // Under the new regime from FY24-25, the standard deduction is 50k for both.
  // The breakeven point depends on income slab, but typically, if deductions 
  // (excluding standard ded) exceed ~3.75L to 4.25L at higher incomes, Old is better.
  // We'll calculate a dynamic breakeven string based on their actual inputs.

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-start justify-between mb-6">
        <div>
           <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
             <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
             Quick Decision Guide
           </h3>
           <p className="text-xs text-slate-500 font-medium mt-1">Should you switch regimes next year?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border ${isOldBetter ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
            Choose OLD Regime if:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <CheckCircle2 className={`w-3 h-3 mr-2 ${isOldBetter ? 'text-emerald-500' : 'text-slate-400'}`} />
              You claim HRA (pay rent)
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${isOldBetter ? 'text-emerald-500' : 'text-slate-400'}`} />
               Focus on 80C investments {'>'} ₹1L
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${isOldBetter ? 'text-emerald-500' : 'text-slate-400'}`} />
               Paying home loan interest
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${isOldBetter ? 'text-emerald-500' : 'text-slate-400'}`} />
               Have health insurance (80D)
            </li>
          </ul>
        </div>
        
        <div className={`p-5 rounded-2xl border ${!isOldBetter ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/50' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
            Choose NEW Regime if:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <CheckCircle2 className={`w-3 h-3 mr-2 ${!isOldBetter ? 'text-indigo-500' : 'text-slate-400'}`} />
              Gross income {"<"} ₹7.5 Lakhs (0 tax)
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${!isOldBetter ? 'text-indigo-500' : 'text-slate-400'}`} />
               Minimal or 0 investments
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${!isOldBetter ? 'text-indigo-500' : 'text-slate-400'}`} />
               Live in own home (No rent)
            </li>
            <li className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
               <CheckCircle2 className={`w-3 h-3 mr-2 ${!isOldBetter ? 'text-indigo-500' : 'text-slate-400'}`} />
               Want less paperwork / simplicity
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-start space-x-3">
         <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
         <div>
            <p className="text-xs font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">Breakeven Hint</p>
            <p className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-300 font-medium mt-1 leading-relaxed">
               Your current deductions (excl. std deduction) total <strong className="text-blue-600 dark:text-blue-400">{formatINR(oldRegime.totalDeductions - 50000)}</strong>. 
               If you stop investing or stop paying rent, the New Regime will quickly become the mathematical winner.
            </p>
         </div>
      </div>
    </div>
  );
}
