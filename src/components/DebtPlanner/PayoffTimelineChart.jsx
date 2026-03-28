import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';
import { formatINR } from '../../utils/debtCalculations';

export default function PayoffTimelineChart({ results }) {
  // We need to sync the 3 schedules into one data array for Recharts
  // Max months across all strategies
  const maxMonths = Math.max(
    results.minOnly.length,
    results.avalanche.length,
    results.snowball.length
  );

  const data = [];
  for (let i = 0; i <= maxMonths; i++) {
    const monthData = { month: i };
    
    // Initial balance at month 0
    if (i === 0) {
      monthData.minOnly = results.totalDebt;
      monthData.avalanche = results.totalDebt;
      monthData.snowball = results.totalDebt;
    } else {
      monthData.minOnly = results.minOnly[i-1]?.totalDebt ?? 0;
      monthData.avalanche = results.avalanche[i-1]?.totalDebt ?? 0;
      monthData.snowball = results.snowball[i-1]?.totalDebt ?? 0;
    }
    
    data.push(monthData);
  }

  // Find payoff months for markers
  const avalanchePayoff = results.avalanche.length;
  const snowballPayoff = results.snowball.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Month {label}</p>
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between space-x-8 mb-1">
              <span className="text-sm font-bold" style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            label={{ value: 'Months', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 800 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          />
          
          <Line 
            name="Min Payment Only" 
            type="monotone" 
            dataKey="minOnly" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false} 
          />
          <Line 
            name="Snowball" 
            type="monotone" 
            dataKey="snowball" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={false}
          />
          <Line 
            name="Avalanche" 
            type="monotone" 
            dataKey="avalanche" 
            stroke="#3b82f6" 
            strokeWidth={4} 
            dot={false}
          />

          {/* Markers */}
          <ReferenceLine x={avalanchePayoff} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'AVALANCHE', fill: '#3b82f6', fontSize: 10, fontWeight: 900 }} />
          <ReferenceLine x={snowballPayoff} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'bottom', value: 'SNOWBALL', fill: '#10b981', fontSize: 10, fontWeight: 900 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
