import { TrendingUp, Trash2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/savingsAdvisorCalculations';

export default function SavingsSummaryCards({ results, formData }) {
  const { currentSavings, savingsRate, wastage, totalExpenses } = results;
  const annualPotential = wastage * 12;
  const monthsCovered = (formData.emergencyFund || 0) / Math.max(1, totalExpenses);

  const cards = [
    {
      title: "Monthly Savings",
      value: formatINR(currentSavings),
      subValue: `${savingsRate.toFixed(1)}% of income`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/20"
    },
    {
      title: "Monthly Wastage",
      value: formatINR(wastage),
      subValue: "Potentially saveable",
      icon: Trash2,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      darkBgColor: "dark:bg-rose-900/20"
    },
    {
      title: "Annual Potential",
      value: formatINR(annualPotential),
      subValue: "More savings possible/yr",
      icon: ArrowUpRight,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20"
    },
    {
      title: "Emergency Fund",
      value: `${monthsCovered.toFixed(1)} Months`,
      subValue: monthsCovered >= 6 ? "Safe / Ideal buffer" : "Below 6-month target",
      icon: ShieldCheck,
      color: monthsCovered >= 6 ? "text-indigo-600" : "text-amber-600",
      bgColor: monthsCovered >= 6 ? "bg-indigo-50" : "bg-amber-50",
      darkBgColor: monthsCovered >= 6 ? "dark:bg-indigo-900/20" : "dark:bg-amber-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${card.bgColor} ${card.darkBgColor} rounded-2xl`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{card.title}</span>
            </div>
            <div>
              <h3 className={`text-2xl font-black ${card.color} dark:brightness-110 tracking-tight`}>
                {card.value}
              </h3>
              <p className={`text-[10px] font-bold mt-1 uppercase tracking-tight ${card.color} opacity-70`}>
                {card.subValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
