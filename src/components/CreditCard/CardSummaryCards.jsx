import { AlertCircle, Clock, TrendingDown, IndianRupee, Flame } from 'lucide-react';
import { formatINR, totalInterest } from '../../utils/creditCardCalculations';

export default function CardSummaryCards({ results, cardData }) {
  const { minSchedule, plannedSchedule } = results;
  
  const monthlyInterest = (cardData.balance * (cardData.rate / 12 / 100)) || 0;
  
  const minMonths = minSchedule.length;
  const plannedMonths = plannedSchedule.length;
  
  const minTotalInterest = totalInterest(minSchedule);
  const plannedTotalInterest = totalInterest(plannedSchedule);
  const savings = Math.max(0, minTotalInterest - plannedTotalInterest);

  const cards = [
    {
      title: "Monthly Interest",
      value: formatINR(monthlyInterest),
      subValue: "Eaten by interest every month",
      icon: Flame,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      darkBgColor: "dark:bg-rose-900/20"
    },
    {
      title: "Payoff Time (Min)",
      value: minMonths >= 600 ? "50+ Years" : `${Math.floor(minMonths / 12)}y ${minMonths % 12}mo`,
      subValue: "If you pay only minimum",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      darkBgColor: "dark:bg-orange-900/20"
    },
    {
      title: "Payoff Time (Planned)",
      value: plannedMonths >= 600 && cardData.plannedPayment > 0 ? "Infinite Trap" : `${Math.floor(plannedMonths / 12)}y ${plannedMonths % 12}mo`,
      subValue: `Paying ₹${cardData.plannedPayment}/mo`,
      icon: TrendingDown,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/20"
    },
    {
      title: "Potential Savings",
      value: formatINR(savings),
      subValue: "Saved vs. minimum payment",
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${card.bgColor} ${card.darkBgColor} rounded-2xl`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</span>
            </div>
            <div>
              <h3 className={`text-xl font-black ${card.color} dark:brightness-110`}>
                {card.value}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tight">
                {card.subValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
