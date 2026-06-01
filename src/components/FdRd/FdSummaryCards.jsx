import { useMemo } from 'react';
import { TrendingUp, PieChart, ShieldCheck, Zap, Copy } from 'lucide-react';
import { formatINR } from '../../utils/fdRdCalculations';

export default function FdSummaryCards({ results, data }) {
  const { maturityAmount, grossInterest, taxImpact, totalYears, isCumulative } = results;
  
  const netTotal = data.amount + taxImpact.netInterest;
  // Effective annualised post-tax yield
  const effectiveReturn = totalYears > 0 && netTotal > 0
    ? (Math.pow(netTotal / data.amount, 1 / totalYears) - 1) * 100
    : 0;

  const maturityLabel = isCumulative
    ? `Maturity Amount`
    : `Principal at Maturity`;

  const cards = [
    {
      title: maturityLabel,
      value: formatINR(maturityAmount),
      subValue: `In ${data.years}y ${data.months}m${data.days > 0 ? ` ${data.days}d` : ''} • ${isCumulative ? 'CI' : 'SI'}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/20"
    },
    {
      title: "Total Interest Earned",
      value: formatINR(grossInterest),
      subValue: isCumulative ? "Compounded interest" : "Simple interest (paid out)",
      icon: PieChart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20"
    },
    {
      title: "Post-Tax Net Interest",
      value: formatINR(taxImpact.netInterest),
      subValue: `After TDS + ${data.taxSlab}% slab tax`,
      icon: ShieldCheck,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      darkBgColor: "dark:bg-amber-900/20"
    },
    {
      title: "Effective Yield (p.a.)",
      value: `${effectiveReturn.toFixed(2)}%`,
      subValue: "Post-tax annualized return",
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      darkBgColor: "dark:bg-indigo-900/20"
    }
  ];

  // Calculate maturity date
  const maturityDate = useMemo(() => {
    if (data.startMonth === undefined || data.startYear === undefined) return '';
    const date = new Date(data.startYear, data.startMonth, 1);
    date.setFullYear(date.getFullYear() + (data.years || 0));
    date.setMonth(date.getMonth() + (data.months || 0));
    date.setDate(date.getDate() + (data.days || 0));
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`My FD of ${formatINR(data.amount)} matures on ${maturityDate} with ${formatINR(grossInterest)} returns`);
  };

  return (
    <div className="space-y-4">
      {data.amount > 0 && totalYears > 0 && (
        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
            Matures on: {maturityDate}
          </span>
          <button onClick={handleCopy} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors" title="Copy to clipboard">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${card.bgColor} ${card.darkBgColor} rounded-2xl`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right max-w-[80px]">{card.title}</span>
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
    </div>
  );
}
