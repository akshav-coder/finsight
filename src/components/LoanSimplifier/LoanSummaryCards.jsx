import { CreditCard, Landmark, History, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/loanCalculations';

export default function LoanSummaryCards({ results, amount }) {
  const { totalInterestWithPrepayment, monthsSaved, interestSaved } = results;
  const emi = results.schedule[0]?.emi || 0;
  const totalPayable = amount + totalInterestWithPrepayment;

  const cards = [
    {
      title: "Monthly EMI",
      value: formatCurrency(emi),
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20"
    },
    {
      title: "Total Interest",
      value: formatCurrency(totalInterestWithPrepayment),
      icon: Landmark,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      darkBgColor: "dark:bg-rose-900/20"
    },
    {
      title: "Total Payable",
      value: formatCurrency(totalPayable),
      icon: History,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      darkBgColor: "dark:bg-slate-800"
    },
    {
      title: "Impact Saved",
      value: interestSaved > 0 ? formatCurrency(interestSaved) : "—",
      subValue: interestSaved > 0 ? `${Math.floor(monthsSaved / 12)}y ${monthsSaved % 12}mo earlier` : "No prepayment",
      icon: TrendingDown,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transform transition hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className={`text-xl font-black ${card.color} dark:brightness-110`}>
                  {card.value}
                </h3>
                {card.subValue && (
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {card.subValue}
                  </p>
                )}
              </div>
              <div className={`p-3 ${card.bgColor} ${card.darkBgColor} rounded-xl`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
