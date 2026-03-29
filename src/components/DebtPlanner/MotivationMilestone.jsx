import { Flag, Trophy, Target, Star, PartyPopper } from 'lucide-react';
import { formatMonths } from '../../utils/debtCalculations';

export default function MotivationMilestone({ schedule, strategyName }) {
  // Find payoff months for each debt
  const debts = schedule?.[0]?.debtStates?.map(d => d.name) || [];
  const milestones = [];

  debts.forEach(name => {
    // Find the first month where balance is 0
    const payoffRow = schedule.find(row => 
      row.debtStates.find(d => d.name === name)?.balance === 0
    );
    if (payoffRow) {
      milestones.push({
        name,
        month: payoffRow.month,
        icon: <Target className="w-4 h-4" />
      });
    }
  });

  // Sort milestones by month
  milestones.sort((a,b) => a.month - b.month);

  // Add Debt Free milestone
  const totalMonths = schedule.length;
  milestones.push({
    name: 'TOTAL DEBT FREEDOM!',
    month: totalMonths,
    isFinal: true,
    icon: <PartyPopper className="w-5 h-5" />
  });

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-900/10">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center tracking-tight uppercase">
        <Trophy className="w-6 h-6 mr-3 text-amber-500" />
        Debt Freedom Milestones
      </h2>

      <div className="relative pl-8 space-y-10">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-emerald-500 to-amber-500 rounded-full opacity-30"></div>

        {milestones.map((ms, idx) => (
          <div key={ms.name} className="relative group">
            {/* Dot */}
            <div className={`absolute -left-[23px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-125 z-10 ${
              ms.isFinal ? 'bg-amber-500' : 'bg-primary-500'
            }`}></div>
            
            <div className={`p-4 rounded-2xl border transition-all ${
              ms.isFinal 
                ? 'bg-amber-500 text-white border-amber-400 shadow-xl shadow-amber-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary-500/50'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${ms.isFinal ? 'text-amber-100' : 'text-slate-400'}`}>
                  Month {ms.month}
                </span>
                <div className={`${ms.isFinal ? 'text-white' : 'text-primary-500'}`}>
                  {ms.icon}
                </div>
              </div>
              <h3 className={`text-sm font-black uppercase tracking-tight ${ms.isFinal ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {ms.name} {ms.isFinal ? '' : 'Paid Off'}
              </h3>
              
              {ms.isFinal && (
                <p className="text-xs font-bold text-amber-100 mt-2 italic">
                  Imagine the weight off your shoulders! All your monthly payments are now YOURS to invest.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center text-center">
         <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Date to Circle</span>
         <div className="text-xl font-black text-slate-900 dark:text-white">
            {new Date(new Date().setMonth(new Date().getMonth() + totalMonths)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
         </div>
      </div>
    </div>
  );
}
