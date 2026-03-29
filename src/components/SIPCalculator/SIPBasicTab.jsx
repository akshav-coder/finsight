import { useState, useMemo, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';
import { Settings, Info, TrendingUp, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { 
  calculateSIP, 
  calculateStepUpSIP, 
  generateSIPSchedule, 
  totalStepUpInvested,
  formatINR,
  formatINRLarge
} from '../../utils/sipCalculations';
import SIPAIAdvisor from './SIPAIAdvisor';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000];
const QUICK_RATES = [8, 10, 12, 15];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md">
        <p className="text-slate-300 font-medium mb-3">End of Year {label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center space-x-6 text-emerald-400 font-bold">
            <span>Total Value:</span>
            <span>{formatINR(data.totalValue)}</span>
          </div>
          <div className="flex justify-between items-center space-x-6 text-blue-400">
            <span>Invested:</span>
            <span>{formatINR(data.invested)}</span>
          </div>
          <div className="flex justify-between items-center space-x-6 text-emerald-500/80 text-sm">
            <span>Wealth Gained:</span>
            <span>{formatINR(data.returns)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SIPBasicTab() {
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(0);
  
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  
  const [showFullTable, setShowFullTable] = useState(false);
  const [showInflation, setShowInflation] = useState(false);

  // Animated Numbers State
  const [displayValue, setDisplayValue] = useState(0);

  // Core Math
  const totalInvested = useMemo(() => {
    return stepUpEnabled 
      ? totalStepUpInvested(monthly, years, stepUpPercent)
      : monthly * 12 * years;
  }, [monthly, years, stepUpEnabled, stepUpPercent]);

  const totalValue = useMemo(() => {
    return stepUpEnabled
      ? calculateStepUpSIP(monthly, rate, years, stepUpPercent)
      : calculateSIP(monthly, rate, years);
  }, [monthly, rate, years, stepUpEnabled, stepUpPercent]);

  const wealthGained = Math.max(0, totalValue - totalInvested);
  const growthMultiplier = totalInvested > 0 ? (totalValue / totalInvested).toFixed(1) : 0;
  
  const scheduleData = useMemo(() => {
    return generateSIPSchedule(monthly, rate, years, stepUpEnabled ? stepUpPercent : 0);
  }, [monthly, rate, years, stepUpEnabled, stepUpPercent]);

  // Comparison Data
  const comparisonData = useMemo(() => {
    // Treat the "Total Invested" as spread out over the same period for FD/Savings
    // A rough approximation for comparison: Savings ~3.5%, FD ~7%
    const savingsVal = calculateSIP(monthly, 3.5, years);
    const fdVal = calculateSIP(monthly, 7, years);
    const normalSipVal = calculateSIP(monthly, 12, years);
    const aggressiveSipVal = calculateSIP(monthly, 15, years);
    
    const data = [
      { name: 'Savings (3.5%)', value: savingsVal, color: '#94a3b8' },
      { name: 'Fixed Deposit (7%)', value: fdVal, color: '#f59e0b' },
      { name: 'SIP (12%)', value: normalSipVal, color: '#10b981' },
      { name: 'SIP (15%)', value: aggressiveSipVal, color: '#059669' },
    ];
    
    if (stepUpEnabled) {
      data.push({
        name: `Step-up (${stepUpPercent}%)`,
        value: totalValue,
        color: '#6366f1' // Indigo flair
      });
    }
    
    return data;
  }, [monthly, years, stepUpEnabled, stepUpPercent, totalValue]);

  // AI Prompt Data Package
  const sipPromptPayload = {
    monthly: formatINR(monthly),
    years,
    rate,
    totalInvested: formatINRLarge(totalInvested),
    maturityValue: formatINRLarge(totalValue),
    wealthGained: formatINRLarge(wealthGained)
  };

  // Animate hero numbers
  useEffect(() => {
    let startTimestamp = null;
    const duration = 800; // ms
    const initialValue = displayValue;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(initialValue + (totalValue - initialValue) * ease);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(totalValue); 
      }
    };
    
    window.requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalValue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: INPUTS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8">
          
          {/* Monthly Investment */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Monthly Investment
              </label>
              <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                {formatINR(monthly)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={monthly || 0}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  onClick={() => setMonthly(amt)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    monthly === amt
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  ₹{amt >= 1000 ? `${amt/1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Expected Return (p.a)
              </label>
              <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-lg border border-blue-200 dark:border-blue-800/50">
                <input
                  type="number"
                  value={rate || ''}
                  onChange={(e) => setRate(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="0"
                  className="w-10 bg-transparent text-right outline-none appearance-none placeholder:text-blue-400"
                />
                <span>%</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {/* Quick Rates */}
            <div className="flex flex-wrap gap-2">
              {QUICK_RATES.map(r => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    rate === r
                      ? 'bg-blue-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Time Period */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Time Period
              </label>
              <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold rounded-lg border border-purple-200 dark:border-purple-800/50">
                {years} Yr{years > 1 ? 's' : ''}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={years || 0}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Step-up SIP Toggle */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Step-up SIP
                </label>
                <div className="group relative cursor-help">
                  <Info className="w-4 h-4 text-slate-400" />
                  <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                    Increase your SIP amount every year, usually matching your salary hike.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStepUpEnabled(!stepUpEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  stepUpEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    stepUpEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {stepUpEnabled && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                    Annual Step-up Rate
                  </label>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                    {stepUpPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 leading-tight">
                  Next year your SIP will be {formatINR(monthly * (1 + stepUpPercent/100))}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: OUTPUTS & VISUALS */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* HERO NUMBERS */}
        <div className="glass-panel p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                The Magic of Compounding
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-6">
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Invested</p>
                   <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 font-mono">
                     {formatINR(totalInvested)}
                   </p>
                 </div>
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Est. Wealth Gained</p>
                   <p className="text-emerald-600 dark:text-emerald-500 text-2xl font-bold font-mono">
                     +{formatINR(wealthGained)}
                   </p>
                 </div>
              </div>

              <div className="md:border-l md:border-slate-200 md:dark:border-slate-800 md:pl-8">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Total Future Value</p>
                <div className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm flex flex-col md:flex-row md:items-baseline">
                  <span>{formatINRLarge(displayValue)}</span>
                </div>
                
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-100 dark:border-emerald-400/20">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Your money grew {growthMultiplier}x!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI ADVISOR — only render when AI is enabled to avoid locked-card UI clutter */}
        {import.meta.env.VITE_ENABLE_AI === 'true' && (
          <SIPAIAdvisor sipData={sipPromptPayload} type="basic" />
        )}

        {/* WEALTH CHART */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Growth over time</h3>
             <label className="flex items-center space-x-2 text-sm text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
               <input 
                 type="checkbox" 
                 checked={showInflation} 
                 onChange={(e) => setShowInflation(e.target.checked)}
                 className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 disabled:opacity-50"
                 title="Estimates 6% inflation to show real purchasing power"
               />
               <span>Adjust for Inflation (6%)</span>
             </label>
           </div>
           
           <div className="h-[400px] w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart
                 data={scheduleData}
                 margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
               >
                 <defs>
                   <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                   </linearGradient>
                   <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                 <XAxis 
                   dataKey="year" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#64748b', fontSize: 12 }} 
                   tickFormatter={(val) => `Yr ${val}`}
                   minTickGap={20}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#64748b', fontSize: 12 }}
                   tickFormatter={(val) => `₹${val>=10000000 ? (val/10000000).toFixed(1)+'Cr' : val>=100000 ? (val/100000).toFixed(0)+'L' : val/1000+'k'}`} 
                   width={60}
                 />
                 <Tooltip content={<CustomTooltip />} />
                 <Area 
                   type="monotone" 
                   dataKey="totalValue" 
                   stroke="#10b981" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorReturns)" 
                   animationDuration={1500}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="invested" 
                   stroke="#3b82f6" 
                   strokeWidth={2}
                   fillOpacity={1} 
                   fill="url(#colorInvested)" 
                   animationDuration={1500}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>

           {/* Inflation Reality Check */}
           {showInflation && (
             <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 flex items-start space-x-3 mt-4 animate-in fade-in zoom-in-95 duration-300">
               <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg text-amber-600 dark:text-amber-400 mt-0.5">
                 <Settings className="w-4 h-4" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">The Reality of Inflation</h4>
                  <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1 mb-2">
                    Accounting for an average 6% inflation, the purchasing power of <span className="font-semibold">{formatINRLarge(totalValue)}</span> in 
                    today's money will actually be around <span className="font-bold">{formatINRLarge(totalValue / Math.pow(1.06, years))}</span>.
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
                    Still better than keeping it under the mattress!
                  </p>
               </div>
             </div>
           )}
        </div>

        {/* COMPARISON BAR CHART */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">How does SIP compare?</h3>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 layout="vertical"
                 data={comparisonData}
                 margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#334155" opacity={0.15} />
                 <XAxis type="number" hide />
                 <YAxis 
                   type="category" 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false}
                   tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                   width={100}
                 />
                 <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-slate-900 shadow-xl border border-slate-700 rounded-lg p-3 text-white text-sm font-bold">
                           {formatINRLarge(payload[0].value)}
                         </div>
                       );
                     }
                     return null;
                   }}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000}>
                   {comparisonData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Investing the same amount in a 12% SIP generates 
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mx-1">
                {formatINRLarge(comparisonData.find(d => d.name === 'SIP (12%)').value - comparisonData.find(d => d.name.includes('Fixed Deposit')).value)} MORE
              </span> 
              than a traditional Fixed Deposit over {years} years!
            </p>
          </div>
        </div>

        {/* YEAR BY YEAR TABLE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
           <div 
             className="flex justify-between items-center cursor-pointer group"
             onClick={() => setShowFullTable(!showFullTable)}
           >
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Milestone Schedule</h3>
             <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
               {showFullTable ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
             </button>
           </div>
           
           <div className="overflow-x-auto mt-4">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/80 rounded-t-lg">
                 <tr>
                   <th className="px-4 py-3 rounded-tl-lg">Year</th>
                   {stepUpEnabled && <th className="px-4 py-3">Monthly SIP</th>}
                   <th className="px-4 py-3">Invested Amount</th>
                   <th className="px-4 py-3">Wealth Gained</th>
                   <th className="px-4 py-3 rounded-tr-lg text-right">Total Value</th>
                 </tr>
               </thead>
               <tbody>
                 {scheduleData
                    .filter((d) => showFullTable ? true : (d.year === 1 || d.year % 5 === 0 || d.year === years))
                    .map((row, idx, arr) => (
                   <tr 
                     key={row.year} 
                     className={`border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!showFullTable && idx === arr.length - 1 ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                   >
                     <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-300">
                       Year {row.year}
                       {!showFullTable && row.year === years && <span className="ml-2 text-[10px] text-emerald-500 font-bold uppercase tracking-wider hidden md:inline">Final</span>}
                     </td>
                     {stepUpEnabled && (
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">
                          {formatINR(row.monthlySIP)}
                        </td>
                     )}
                     <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">
                       {formatINR(row.invested)}
                     </td>
                     <td className="px-4 py-3 text-emerald-600 dark:text-emerald-500 font-mono">
                       +{formatINR(row.returns)}
                     </td>
                     <td className={`px-4 py-3 text-right font-bold font-mono ${!showFullTable && idx === arr.length - 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                       {formatINR(row.totalValue)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           {!showFullTable && (
             <div className="mt-4 text-center">
               <button 
                 onClick={() => setShowFullTable(true)}
                 className="text-sm font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-all"
               >
                 Show All {years} Years
               </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
