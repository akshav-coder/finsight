import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { formatINR, getDynamicBenchmarks } from '../../utils/savingsAdvisorCalculations';

export default function SpendingBenchmarkTable({ formData }) {
  const benchmarks = getDynamicBenchmarks(formData.income || 60000);

  const categories = [
    { key: 'foodDelivery',  label: 'Food Delivery',   icon: '🍕' },
    { key: 'groceries',     label: 'Groceries',        icon: '🛒' },
    { key: 'shopping',      label: 'Shopping',         icon: '🛍️' },
    { key: 'entertainment', label: 'Entertainment',    icon: '🎟️' },
    { key: 'transport',     label: 'Transport',        icon: '🚗' },
    { key: 'bills',         label: 'Bills & Utilities', icon: '⚡' },
    { key: 'health',        label: 'Health & Medical', icon: '💊' },
    { key: 'insurance',     label: 'Insurance',        icon: '🛡️' },
  ];

  const getStatus = (spent, benchmark) => {
    if (spent <= benchmark.good) return { label: 'Good',      icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (spent <= benchmark.high) return { label: 'High',      icon: AlertTriangle, color: 'text-amber-500',  bgColor: 'bg-amber-50 dark:bg-amber-900/20' };
    return                               { label: 'Very High', icon: XCircle,       color: 'text-rose-500',   bgColor: 'bg-rose-50 dark:bg-rose-900/20' };
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="flex flex-col mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Spending Audit</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          vs. Benchmarks based on your ₹{(formData.income || 0).toLocaleString('en-IN')} salary
        </p>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="pb-2 pl-2">Category</th>
              <th className="pb-2">You Spend</th>
              <th className="pb-2">Ideal (≤)</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 pr-2 text-right">Save</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => {
              const spent = formData[cat.key] || 0;
              const benchmark = benchmarks[cat.key];
              const status = getStatus(spent, benchmark);
              const potentialSaving = Math.max(0, spent - benchmark.good);

              return (
                <tr key={i} className="group transition-all hover:scale-[1.01] bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                  <td className="py-3 pl-4 rounded-l-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cat.label}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300">{formatINR(spent)}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold text-slate-400">{formatINR(Math.round(benchmark.good))}</span>
                  </td>
                  <td className="py-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg w-fit ${status.bgColor}`}>
                      <status.icon className={`w-3 h-3 ${status.color}`} />
                      <span className={`text-[9px] font-black uppercase ${status.color}`}>{status.label}</span>
                    </div>
                  </td>
                  <td className={`py-3 pr-4 text-right rounded-r-xl font-bold text-xs ${potentialSaving > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {potentialSaving > 0 ? `+${formatINR(potentialSaving)}` : '✓'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
