import { CreditCard, ArrowRightLeft, CalendarCheck } from 'lucide-react';

export default function QuickWins() {
  const wins = [
    {
      title: "Switch to Cashback Card",
      impact: "₹800 - ₹2,000 / month",
      action: "Use a dedicated cashback card for utilities & groceries.",
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "High-Interest Savings",
      impact: "₹500+ / month extra",
      action: "Move idle balance to a 7% interest savings account.",
      icon: ArrowRightLeft,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Auto-SIP on Salary Day",
      impact: "Disciplined Wealth",
      action: "Schedule investments on the 1st of every month.",
      icon: CalendarCheck,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight italic pl-1">⚡ Quick Wins (Zero Lifestyle Change)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wins.map((win, i) => {
          const Icon = win.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-all">
              <div className={`p-4 ${win.bgColor} rounded-2xl`}>
                 <Icon className={`w-6 h-6 ${win.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{win.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase leading-snug">{win.action}</p>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-sm">
                 <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{win.impact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
