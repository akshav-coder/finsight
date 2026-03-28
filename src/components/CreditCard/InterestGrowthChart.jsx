import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/creditCardCalculations';

export default function InterestGrowthChart({ plannedSchedule }) {
  // Show first 24 months to keep it readable
  const data = plannedSchedule.slice(0, 24).map(row => ({
    month: `M${row.month}`,
    Principal: row.principalPaid,
    Interest: row.interest
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 underline mb-2 tracking-widest uppercase">Month {label.replace('M', '')}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8 mb-1">
              <span className="text-[10px] font-bold uppercase transition-colors" style={{ color: entry.fill }}>{entry.name}</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatINR(entry.value)}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Pay</span>
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
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[450px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Where Your Money Goes</h3>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest font-bold">Planned Payment Breakdown — First 24 Months</p>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Bar dataKey="Principal" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} animationDuration={1500} />
            <Bar dataKey="Interest" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-rose-500 mt-4 italic font-bold text-center animate-pulse-slow">
        Warning: In early months, interest makes up a huge portion of your payment.
      </p>
    </div>
  );
}
