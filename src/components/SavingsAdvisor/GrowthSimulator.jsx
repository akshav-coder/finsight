import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatINR, projectGrowth } from '../../utils/savingsAdvisorCalculations';

export default function GrowthSimulator({ results }) {
  const [extraSaving, setExtraSaving] = useState(2000);

  const projectionData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= 10; year++) {
      data.push({
        year: `${year}Y`,
        fd: projectGrowth(extraSaving, 7.0, year),
        ppf: projectGrowth(extraSaving, 7.1, year),
        sip: projectGrowth(extraSaving, 12.0, year)
      });
    }
    return data;
  }, [extraSaving]);

  const latest = projectionData[projectionData.length - 1];

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full uppercase tracking-tight font-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 italic">Savings Growth Simulator</h3>
          <p className="text-[10px] text-slate-400 opacity-80 decoration-dashed underline">If you save an extra {formatINR(extraSaving)} / month...</p>
        </div>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Amount</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatINR(extraSaving)} / mo</span>
          </div>
          <input 
            type="range" 
            min="500" 
            max="20000" 
            step="500" 
            value={extraSaving} 
            onChange={(e) => setExtraSaving(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[8px] mt-1 text-slate-300">
            <span>₹500</span>
            <span>₹20,000</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
           <p className="text-[8px] text-slate-400 mb-1">In 1 Year</p>
           <p className="text-sm text-slate-700 dark:text-slate-200">{formatINR(projectionData[1].sip)}</p>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
           <p className="text-[8px] text-emerald-600 dark:text-emerald-400 mb-1">In 5 Years</p>
           <p className="text-sm text-emerald-600 dark:text-emerald-300">{formatINR(projectionData[5].sip)}</p>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
           <p className="text-[8px] text-indigo-600 dark:text-indigo-400 mb-1">In 10 Years</p>
           <p className="text-sm text-indigo-600 dark:text-indigo-300">{formatINR(latest.sip)}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              formatter={(val) => [formatINR(val), '']}
            />
            <Legend verticalAlign="top" align="right" />
            <Line type="monotone" dataKey="fd" name="FD (7%)" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="ppf" name="PPF (7.1%)" stroke="#3b82f6" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="sip" name="SIP (12%)" stroke="#10b981" strokeWidth={4} dot={false} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[8px] text-slate-400 mt-4 italic">Projections are based on monthly compounding for SIP and annual compounding for FD/PPF. Actual returns may vary.</p>
    </div>
  );
}
