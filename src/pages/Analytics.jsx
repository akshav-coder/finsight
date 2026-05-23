import { useData } from '../context/DataContext';
import SpendingPieChart from '../components/SpendingPieChart';
import SpendingBarChart from '../components/SpendingBarChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const INCOME_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#a7f3d0'];

function IncomeBreakdownChart({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
     return (
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-80 flex items-center justify-center">
         <p className="text-slate-500 dark:text-slate-400">No income category data available.</p>
       </div>
     );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-full min-h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Income by Source</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              onClick={(entry) => {
                if (entry && entry.name) {
                  navigate(`/app/statement-analytics/transactions?category=${encodeURIComponent(entry.name)}&type=credit`);
                }
              }}
              className="cursor-pointer outline-none"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                
                if (percent < 0.05) return null;
                
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold" className="pointer-events-none drop-shadow-md">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                  className="hover:opacity-80 transition-opacity outline-none" 
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function IncomeVsExpenseChart({ dailyData, dailyIncomeData }) {
  if ((!dailyData || dailyData.length === 0) && (!dailyIncomeData || dailyIncomeData.length === 0)) {
     return (
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-80 flex items-center justify-center">
         <p className="text-slate-500 dark:text-slate-400">No monthly data available.</p>
       </div>
     );
  }

  const monthlyMap = {};
  
  const processData = (data, key) => {
    if (!data) return;
    data.forEach(item => {
      if (item.timestamp) {
        const d = dayjs(item.timestamp);
        const monthStr = d.format('MMM YYYY');
        if (!monthlyMap[monthStr]) {
          monthlyMap[monthStr] = { name: monthStr, income: 0, expense: 0, ts: d.startOf('month').valueOf() };
        }
        monthlyMap[monthStr][key] += item.amount;
      }
    });
  };

  processData(dailyData, 'expense');
  processData(dailyIncomeData, 'income');

  const chartData = Object.values(monthlyMap).sort((a, b) => a.ts - b.ts);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 p-6 rounded-3xl h-full min-h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Income vs Expense (Monthly)</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dx={-10}
              tickFormatter={(val) => `₹${val>=1000 ? (val/1000).toFixed(0)+'k' : val}`}
            />
            <RechartsTooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value, name) => {
                const label = name === 'income' ? 'Income' : 'Expense';
                return [`₹${Number(value).toLocaleString('en-IN')}`, label];
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} formatter={(val) => val === 'income' ? 'Income' : 'Expense'} />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { appData } = useData();

  if (!appData) return null;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto w-full transition-colors duration-200 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Spending Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg transition-colors">Deep dive into your categories and daily trends.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <SpendingPieChart data={appData.categoryData} />
        <SpendingBarChart data={appData.dailyData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <IncomeBreakdownChart data={appData.incomeData} />
        <IncomeVsExpenseChart dailyData={appData.dailyData} dailyIncomeData={appData.dailyIncomeData} />
      </div>
    </div>
  );
}
