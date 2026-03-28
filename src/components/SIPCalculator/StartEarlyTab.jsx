import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateSIP, calculateStepUpSIP, totalStepUpInvested, formatINR, formatINRLarge } from '../../utils/sipCalculations';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md">
        <p className="text-slate-300 font-bold mb-3 border-b border-slate-700 pb-2">Age {label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center space-x-6">
              <span style={{ color: entry.color }} className="font-semibold text-sm">{entry.name}:</span>
              <span className="text-white font-mono text-sm">{formatINRLarge(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Inline editable slider + number input combo
const SliderInput = ({ label, value, onChange, min, max, step, format, accentClass = 'accent-emerald-500' }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        min={min}
        max={max}
        className="w-28 text-right px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
    <input
      type="range" min={min} max={max} step={step}
      value={value} onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${accentClass}`}
    />
    <div className="flex justify-between text-[9px] text-slate-400">
      <span>{format(min)}</span>
      <span>{format(max)}</span>
    </div>
  </div>
);

export default function StartEarlyTab() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(0); // Annual step-up %
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);

  const scenario1_Age = currentAge;
  const scenario2_Age = currentAge + 5;
  const scenario3_Age = currentAge + 10;

  const years1 = Math.max(0, retireAge - scenario1_Age);
  const years2 = Math.max(0, retireAge - scenario2_Age);
  const years3 = Math.max(0, retireAge - scenario3_Age);

  // Without step-up (regular SIP)
  const inv1_flat  = monthly * 12 * years1;
  const inv2_flat  = monthly * 12 * years2;
  const inv3_flat  = monthly * 12 * years3;

  // With step-up
  const inv1 = stepUp > 0 ? totalStepUpInvested(monthly, years1, stepUp) : inv1_flat;
  const inv2 = stepUp > 0 ? totalStepUpInvested(monthly, years2, stepUp) : inv2_flat;
  const inv3 = stepUp > 0 ? totalStepUpInvested(monthly, years3, stepUp) : inv3_flat;

  const val1 = stepUp > 0 ? calculateStepUpSIP(monthly, rate, years1, stepUp) : calculateSIP(monthly, rate, years1);
  const val2 = stepUp > 0 ? calculateStepUpSIP(monthly, rate, years2, stepUp) : calculateSIP(monthly, rate, years2);
  const val3 = stepUp > 0 ? calculateStepUpSIP(monthly, rate, years3, stepUp) : calculateSIP(monthly, rate, years3);

  const gain1 = val1 - inv1;
  const gain2 = val2 - inv2;
  const gain3 = val3 - inv3;

  const costOfDelay5Years = val1 - val2;
  const costOfDelay1Year = costOfDelay5Years / 5;

  const chartData = useMemo(() => {
    const data = [];
    for (let age = currentAge; age <= retireAge; age++) {
      const y = (a, startAge, years) => {
        if (age < startAge) return null;
        const y = age - startAge;
        return stepUp > 0 ? calculateStepUpSIP(monthly, rate, y, stepUp) : calculateSIP(monthly, rate, y);
      };
      data.push({
        age,
        'Start Now':    y(age, scenario1_Age, years1),
        [`Wait 5Y`]:    y(age, scenario2_Age, years2),
        [`Wait 10Y`]:   y(age, scenario3_Age, years3),
      });
    }
    return data;
  }, [currentAge, retireAge, monthly, rate, stepUp, scenario1_Age, scenario2_Age, scenario3_Age, years1, years2, years3]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">

          <SliderInput
            label="Monthly SIP"
            value={monthly}
            onChange={setMonthly}
            min={1000} max={100000} step={1000}
            format={(v) => `₹${(v/1000).toFixed(0)}k`}
          />

          <SliderInput
            label="Annual Step-Up %"
            value={stepUp}
            onChange={setStepUp}
            min={0} max={30} step={1}
            format={(v) => `${v}%`}
            accentClass="accent-purple-500"
          />
          {stepUp > 0 && (
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold -mt-2">
              ✦ SIP increases {stepUp}% every year. First year monthly: {formatINR(monthly)}, 10th year: {formatINR(Math.round(monthly * Math.pow(1 + stepUp/100, 9)))}
            </p>
          )}

          <SliderInput
            label="Expected Return (p.a.)"
            value={rate}
            onChange={setRate}
            min={5} max={25} step={0.5}
            format={(v) => `${v}%`}
            accentClass="accent-blue-500"
          />

          <hr className="border-slate-200 dark:border-slate-800" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Age</label>
              <input
                type="number" value={currentAge} min={18} max={55}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-center font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Retire Age</label>
              <input
                type="number" value={retireAge} min={40} max={80}
                onChange={(e) => setRetireAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-center font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {costOfDelay5Years > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 p-6 rounded-3xl">
            <div className="flex items-center space-x-2 mb-4 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold">The Cost of Delaying</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-sm">
              Waiting just 5 years costs you a staggering <strong className="text-rose-600 dark:text-rose-400">{formatINRLarge(costOfDelay5Years)}</strong> from your retirement corpus.
            </p>
            <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-rose-100 dark:border-rose-900/30 text-sm text-center">
              Every <strong>year</strong> you delay costs approx <br />
              <span className="text-xl font-black text-rose-600 dark:text-rose-500 my-1 block">{formatINRLarge(costOfDelay1Year)}</span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-8 space-y-6">
        {/* Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { age: scenario1_Age, years: years1, val: val1, inv: inv1, gain: gain1, highlight: true },
            { age: scenario2_Age, years: years2, val: val2, inv: inv2, gain: gain2, highlight: false },
            { age: scenario3_Age, years: years3, val: val3, inv: inv3, gain: gain3, highlight: false },
          ].map((sc, idx) => (
            <div key={idx} className={`glass-panel p-5 rounded-2xl border-2 relative overflow-hidden transition-all hover:scale-[1.02] ${sc.highlight ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100'}`}>
              {sc.highlight && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Winner</div>
              )}
              <h4 className={`font-bold flex items-center mb-1 ${sc.highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                <Clock className="w-4 h-4 mr-1.5" /> Start at {sc.age}
              </h4>
              <p className="text-xs text-slate-500 mb-4">Invest for {sc.years} years</p>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block">Final Corpus</span>
                  <span className={`text-2xl font-black block ${sc.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{formatINRLarge(sc.val)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span className="text-slate-500">Total Invested</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatINRLarge(sc.inv)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Gain</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-500">+{formatINRLarge(sc.gain)}</span>
                </div>
                {stepUp > 0 && (
                  <p className="text-[9px] text-purple-500 font-bold uppercase tracking-wide">Step-up {stepUp}%/yr applied</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" /> The Compounding Curve
              {stepUp > 0 && <span className="ml-2 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">Step-up {stepUp}%</span>}
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `Age ${v}`} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => v >= 10000000 ? `₹${(v/10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v/100000).toFixed(0)}L` : `₹${v/1000}k`} width={65} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={currentAge} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#f43f5e', fontSize: 12 }} />
                <ReferenceLine x={retireAge} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Retire', fill: '#64748b', fontSize: 11 }} />
                <Line type="monotone" dataKey="Start Now" stroke="#10b981" strokeWidth={4} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                <Line type="monotone" dataKey="Wait 5Y" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={1500} />
                <Line type="monotone" dataKey="Wait 10Y" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="3 3" animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" /> Start Now (Age {scenario1_Age})</div>
            <div className="flex items-center"><div className="w-4 h-0.5 bg-blue-500 mr-2 border-t-2 border-dashed" /> Wait 5Y (Age {scenario2_Age})</div>
            <div className="flex items-center"><div className="w-4 h-0.5 bg-amber-500 mr-2 border-t-2 border-dotted" /> Wait 10Y (Age {scenario3_Age})</div>
          </div>
        </div>
      </div>
    </div>
  );
}
