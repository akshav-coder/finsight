import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatINR } from '../../utils/fdRdCalculations';

export default function RdGrowthChart({ schedule }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 underline mb-2 tracking-widest uppercase">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8 mb-1">
              <span className="text-[10px] font-bold uppercase transition-colors" style={{ color: entry.fill }}>{entry.name}</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatINR(entry.value)}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Value</span>
            <span className="text-sm font-black text-slate-700 dark:text-slate-300">
              {formatINR(payload.reduce((sum, e) => sum + e.value, 0))}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col">
      <div className="flex flex-col mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your RD Growth</h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Monthly Deposit vs. Interest</p>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={schedule} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Bar dataKey="deposited" name="Deposited" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} animationDuration={1500} />
            <Bar dataKey="interest" name="Interest" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
