import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINR } from '../../utils/taxCalculations';

export default function TaxBreakdownChart({ taxAnalysis }) {
  if (!taxAnalysis) return null;

  const { grossIncome, newRegime, oldRegime } = taxAnalysis;
  const isOldBetter = oldRegime.totalTax < newRegime.totalTax;
  const activeRegime = isOldBetter ? oldRegime : newRegime;

  if (activeRegime.totalTax === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-emerald-600 dark:text-emerald-400">
         <div className="text-4xl font-black mb-2">0%</div>
         <div className="text-xs font-bold uppercase tracking-widest text-emerald-500">Effective Tax Rate</div>
         <p className="text-sm mt-4 text-emerald-700/70 dark:text-emerald-500/70">Your income is entirely tax-free under the recommended regime!</p>
      </div>
    );
  }

  const effectiveTaxRate = ((activeRegime.totalTax / grossIncome) * 100).toFixed(1);
  const takeHome = grossIncome - activeRegime.totalTax;

  const data = [
    { name: 'Income Tax', value: activeRegime.tax, color: '#f43f5e' }, // Rose 500
    { name: 'Health & Edu Cess', value: activeRegime.cess, color: '#f59e0b' }, // Amber 500
    { name: 'Take Home', value: takeHome, color: '#10b981' } // Emerald 500
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{data.name}</p>
          <p className="text-sm font-black text-white" style={{ color: data.color }}>{formatINR(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-xl p-4 md:p-6">
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
            {effectiveTaxRate}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Effective Rate
          </span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
             </div>
             <span className="text-xs font-black text-slate-900 dark:text-white">{formatINR(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
