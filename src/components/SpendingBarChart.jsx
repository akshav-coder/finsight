import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function SpendingBarChart({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
     return (
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-80 flex items-center justify-center">
         <p className="text-slate-500 dark:text-slate-400">No daily spending data available.</p>
       </div>
     );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-full min-h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Day-wise Spending</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
              tickFormatter={(val) => {
                 const p = val.split('-');
                 if (p.length === 3) return p[0] + '/' + p[1];
                 return val;
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dx={-10}
              tickFormatter={(val) => `₹${val>=1000 ? (val/1000).toFixed(0)+'k' : val}`}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
            />
            <Bar 
              dataKey="amount" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={(data) => {
                if (data && data.date) {
                  navigate(`/app/statement-analytics/transactions?search=${encodeURIComponent(data.date)}`);
                }
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
