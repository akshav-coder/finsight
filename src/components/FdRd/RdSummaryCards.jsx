import { CreditCard, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/fdRdCalculations';

export default function RdSummaryCards({ results, data }) {
  const { maturityAmount, totalInvested, grossInterest, taxImpact } = results;

  const cards = [
    {
      title: "Total Deposited",
      value: formatINR(totalInvested),
      subValue: `₹${data.monthlyAmount} × ${data.months} months`,
      icon: CreditCard,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      darkBgColor: "dark:bg-slate-900/20"
    },
    {
      title: "Maturity Amount",
      value: formatINR(maturityAmount),
      subValue: "Quarterly compounding (bank standard)",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/20"
    },
    {
      title: "Interest Earned",
      value: formatINR(grossInterest),
      subValue: "Gross interest profit",
      icon: PieChart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20"
    },
    {
      title: "Post-Tax Returns",
      value: formatINR(totalInvested + taxImpact.netInterest),
      subValue: `After ${data.taxSlab}% tax slab`,
      icon: ShieldCheck,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      darkBgColor: "dark:bg-amber-900/20"
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
