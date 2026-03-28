import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/taxCalculations';

export default function RegimeRecommendation({ taxAnalysis }) {
  if (!taxAnalysis) return null;

  const { newRegime, oldRegime } = taxAnalysis;
  
  const oldTax = oldRegime.totalTax;
  const newTax = newRegime.totalTax;
  
  const isOldBetter = oldTax < newTax;
  const savings = Math.abs(oldTax - newTax);
  
  if (savings === 0) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
          Both Regimes Cost The Same
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg">
          Your tax liability is exactly the same ({formatINR(newTax)}) under both Old and New regimes. The New regime is usually simpler with less paperwork.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-1 overflow-hidden transition-all duration-500 ${isOldBetter ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-br from-indigo-400 to-blue-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]'}`}>
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-[22px] p-6 md:p-8 h-full relative overflow-hidden">
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
          <CheckCircle2 className={`w-64 h-64 ${isOldBetter ? 'text-emerald-500' : 'text-indigo-500'}`} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isOldBetter ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
              Recommendation
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none pt-2">
              <span className={isOldBetter ? 'text-emerald-600 dark:text-emerald-500' : 'text-indigo-600 dark:text-indigo-500'}>
                {isOldBetter ? 'Old Regime' : 'New Regime'}
              </span> Is Better
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-lg pt-1">
              Saves you <strong className={isOldBetter ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}>{formatINR(savings)}</strong> more than the {isOldBetter ? 'New' : 'Old'} Regime.
            </p>
            {isOldBetter ? (
               <p className="text-xs text-slate-500 pt-2 font-medium">
                 Your high level of investments & deductions make the Old Regime highly efficient.
               </p>
            ) : (
               <p className="text-xs text-slate-500 pt-2 font-medium">
                 Your deductions are relatively low. The New Regime's lower slab rates combined with standard deduction are saving you more money.
               </p>
            )}
          </div>
          
          <div className={`p-6 rounded-2xl flex-shrink-0 text-center ${isOldBetter ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800'}`}>
             <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isOldBetter ? 'text-emerald-600 dark:text-emerald-500' : 'text-indigo-600 dark:text-indigo-500'}`}>
               You will pay
             </div>
             <div className="text-4xl font-black text-slate-900 dark:text-white">
                {formatINR(isOldBetter ? oldTax : newTax)}
             </div>
             <div className={`text-xs font-bold uppercase tracking-wider mt-2 ${isOldBetter ? 'text-emerald-500/80 dark:text-emerald-600/80' : 'text-indigo-500/80 dark:text-indigo-600/80'}`}>
               Taxes this year
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
