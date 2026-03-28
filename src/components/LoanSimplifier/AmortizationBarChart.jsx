import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/loanCalculations';

export default function AmortizationBarChart({ schedule }) {
  // Aggregate monthly schedule into yearly data
  const yearlyData = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const yearSlice = schedule.slice(i, i + 12);
    const yearNumber = Math.floor(i / 12) + 1;
    
    const principalPaid = yearSlice.reduce((sum, m) => sum + m.principalPaid, 0);
    const interestPaid = yearSlice.reduce((sum, m) => sum + m.interest, 0);
    
    yearlyData.push({
      year: `Year ${yearNumber}`,
      Principal: principalPaid,
      Interest: interestPaid
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 underline mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8 mb-1">
              <span className="text-[10px] font-bold uppercase" style={{ color: entry.fill }}>{entry.name}</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Yearly Breakdown</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Bar dataKey="Principal" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Interest" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-slate-400 mt-4 italic">
        Note: Interest dominates the early years while principal repayment increases over time.
      </p>
    </div>
  );
}
