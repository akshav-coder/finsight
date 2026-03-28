import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatINR } from '../../utils/savingsAdvisorCalculations';

export default function AllocationDonutChart({ allocation, income }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].name}</p>
          <p className="text-lg font-black" style={{ color: payload[0].payload.color }}>
            {formatINR(payload[0].value)}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
            {((payload[0].value / income) * 100).toFixed(1)}% of income
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="flex flex-col mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Income Allocation</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v/s 50-30-20 Rule</p>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {allocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
        {allocation.map((item, i) => {
          const actual = (item.value / income) * 100;
          const isHigh = item.name !== 'Savings' && actual > item.ideal;
          const isLow = item.name === 'Savings' && actual < item.ideal;

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                <span className="text-slate-400">{item.name}</span>
                <span style={{ color: item.color }}>{actual.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${actual}%`, backgroundColor: item.color }} 
                />
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase italic">
                 <span className="text-slate-300">Ideal: {item.ideal}%</span>
                 {(isHigh || isLow) && <span className="text-rose-500 animate-pulse">! Action Needed</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
