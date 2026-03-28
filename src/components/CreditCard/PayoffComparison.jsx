import { Zap, TrendingDown, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatINR, totalInterest } from '../../utils/creditCardCalculations';

export default function PayoffComparison({ results, cardData }) {
  const { minSchedule, plannedSchedule, aggressiveSchedule } = results;

  const strategies = [
    {
      name: "Minimum Payment",
      payment: minSchedule[0]?.payment || 0,
      months: minSchedule.length,
      interest: totalInterest(minSchedule),
      color: "bg-rose-500",
      textColor: "text-rose-600",
      accentColor: "rose",
      isBest: false
    },
    {
      name: "Your Payment",
      payment: cardData.plannedPayment,
      months: plannedSchedule.length,
      interest: totalInterest(plannedSchedule),
      color: "bg-blue-500",
      textColor: "text-blue-600",
      accentColor: "blue",
      isBest: false
    },
    {
      name: "Aggressive",
      payment: cardData.plannedPayment + 2000,
      months: aggressiveSchedule.length,
      interest: totalInterest(aggressiveSchedule),
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      accentColor: "emerald",
      isBest: true
    }
  ];

  const minTotalInterest = totalInterest(minSchedule);

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Payoff Strategies</h3>
        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          The Escape Plan
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {strategies.map((strategy, i) => {
          const savings = Math.max(0, minTotalInterest - strategy.interest);
          const timeSavedMonths = Math.max(0, minSchedule.length - strategy.months);

          return (
            <div 
              key={i} 
              className={`relative overflow-hidden p-4 rounded-2xl border ${
                strategy.isBest ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50/30'
              } transition-all hover:scale-[1.01] group`}
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${strategy.color} text-white flex items-center justify-center shadow-sm`}>
                    {strategy.name === 'Aggressive' ? <Zap className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${strategy.textColor} uppercase tracking-tight`}>{strategy.name}</p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{formatINR(strategy.payment)}/mo</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {strategy.months >= 600 ? "Infinite" : `${Math.floor(strategy.months / 12)}y ${strategy.months % 12}m`}
                  </p>
                  {strategy.name !== 'Minimum Payment' && (
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      - {Math.floor(timeSavedMonths / 12)}y {timeSavedMonths % 12}m saved
                    </p>
                  )}
                </div>
              </div>

              {strategy.name !== 'Minimum Payment' && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center transition-all group-hover:pl-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest Savings</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatINR(savings)}</span>
                </div>
              )}
              
              {strategy.isBest && (
                <div className="absolute top-0 right-0 p-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-50 opacity-20" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-slate-500 italic">
          Tip: Adding just ₹2,000 extra can save lakhs in interest!
        </p>
      </div>
    </div>
  );
}
