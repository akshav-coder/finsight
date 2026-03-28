import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/creditCardCalculations';

export default function MinPaymentTrapChart({ minSchedule, plannedSchedule }) {
  // Combine data for charting
  const data = [];
  const maxMonths = 24; // Show first 2 years for dramatic effect
  
  for (let i = 0; i < maxMonths; i++) {
    data.push({
      month: i + 1,
      minBalance: minSchedule[i]?.balance ?? (minSchedule[minSchedule.length - 1]?.balance || 0),
      plannedBalance: plannedSchedule[i]?.balance ?? (plannedSchedule[plannedSchedule.length - 1]?.balance || 0)
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 underline mb-2 tracking-widest uppercase">Month {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8 mb-1">
              <span className="text-[10px] font-bold uppercase transition-colors" style={{ color: entry.stroke }}>{entry.name === 'minBalance' ? 'Minimum Pay' : 'Planned Pay'}</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Minimum Payment Trap</h3>
          <p className="text-xs text-rose-500 font-bold mt-1 uppercase tracking-tighter">See how long you're trapped if you pay only minimum</p>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
              label={{ value: 'Months', position: 'insideBottomRight', offset: -10, fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Line 
              type="monotone" 
              dataKey="minBalance" 
              name="minBalance"
              stroke="#f43f5e" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, stroke: '#f43f5e', strokeWidth: 2, fill: '#fff' }}
              animationDuration={2000}
            />
            <Line 
              type="monotone" 
              dataKey="plannedBalance" 
              name="plannedBalance"
              stroke="#10b981" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-slate-400 mt-4 italic text-center">
        The red line stays high because interest eats almost all of your minimum payment.
      </p>
    </div>
  );
}
