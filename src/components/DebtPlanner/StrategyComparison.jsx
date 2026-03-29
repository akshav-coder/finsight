import { CheckCircle2, AlertCircle, Zap, Snowflake } from 'lucide-react';
import { formatINR, formatMonths } from '../../utils/debtCalculations';

export default function StrategyComparison({ results, selectedStrategy, setSelectedStrategy }) {
  const avalanche = results.avalanche;
  const snowball = results.snowball;
  
  const avalancheMonths = avalanche.length;
  const snowballMonths = snowball.length;
  
  const savings = results.snowballInterest - results.avalancheInterest;

  if (!results.totalDebt || results.totalDebt === 0) {
    return (
      <div className="lg:col-span-8 glass-panel p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
          <Zap className="w-8 h-8 text-slate-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Debts Added Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
            Add your loans or credit card balances on the left to see your personalized payoff strategy and savings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Avalanche Strategy */}
      <div 
        onClick={() => setSelectedStrategy('avalanche')}
        className={`relative glass-panel p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
          selectedStrategy === 'avalanche' 
            ? 'border-primary-500 shadow-xl shadow-primary-500/10 dark:bg-primary-900/10' 
            : 'border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
             <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Avalanche</h3>
                <span className="text-[10px] font-black uppercase text-primary-500 tracking-wider">Save More Money</span>
             </div>
          </div>
          {selectedStrategy === 'avalanche' && (
            <div className="bg-primary-500 text-white p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 fill-primary-500" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-primary-100 dark:border-primary-900/50 pb-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Debt Free In</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase">
              {formatMonths(avalancheMonths)}
            </div>
          </div>

          <div className="flex justify-between items-end border-b border-primary-100 dark:border-primary-900/50 pb-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Total Interest Paid</div>
            <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
              {formatINR(results.avalancheInterest)}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-center justify-between">
             <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Savings vs Snowball</div>
             <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                +{formatINR(savings)}
             </div>
          </div>

          <div className="pt-2">
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Payoff Order</div>
             <div className="space-y-2">
                {/* Find Payoff Order for Avalanche (Sorted by Rate) */}
                {results.avalanche?.[0]?.debtStates?.map((d, i) => (
                   <div key={d.name} className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                         {i + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{d.name}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Snowball Strategy */}
      <div 
        onClick={() => setSelectedStrategy('snowball')}
        className={`relative glass-panel p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
          selectedStrategy === 'snowball' 
            ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 dark:bg-emerald-900/10' 
            : 'border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
             <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <Snowflake className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Snowball</h3>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Stay Motivated</span>
             </div>
          </div>
          {selectedStrategy === 'snowball' && (
            <div className="bg-emerald-500 text-white p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-emerald-100 dark:border-emerald-900/50 pb-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Debt Free In</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase">
              {formatMonths(snowballMonths)}
            </div>
          </div>

          <div className="flex justify-between items-end border-b border-emerald-100 dark:border-emerald-900/50 pb-4">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Total Interest Paid</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(results.snowballInterest)}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl flex items-center justify-between">
             <div className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-tight">Difference</div>
             <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                {formatINR(Math.abs(savings))} more
             </div>
          </div>

          <div className="pt-2">
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Payoff Order</div>
             <div className="space-y-2">
                {/* For actual order, we'd need to simulate or use the starting sort */}
                {/* For snowball, it's just by balance ascending */}
                {results.snowball?.[0]?.debtStates?.map((d, i) => (
                   <div key={d.name} className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                         {i + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{d.name}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
