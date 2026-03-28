import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/loanCalculations';

export default function PrincipalInterestChart({ principal, totalInterest }) {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['#3b82f6', '#f43f5e'];

  const totalCost = principal + totalInterest;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 underline mb-1">{payload[0].name}</p>
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {((payload[0].value / totalCost) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Principal vs Interest</h3>
      
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Total Cost</p>
          <p className="text-lg font-black text-slate-900 dark:text-slate-100">
            {formatCurrency(totalCost)}
          </p>
        </div>
      </div>
    </div>
  );
}
