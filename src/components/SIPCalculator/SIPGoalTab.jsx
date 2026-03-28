import { useState, useMemo } from 'react';
import { Target, Home, GraduationCap, Plane, Car, UserCircle2, Heart, ArrowRight } from 'lucide-react';
import { 
  calculateRequiredSIP, 
  calculateRequiredStepUpSIP, 
  formatINR, 
  formatINRLarge 
} from '../../utils/sipCalculations';
import SIPAIAdvisor from './SIPAIAdvisor';

const PRESET_GOALS = [
  { id: 'house', name: 'Buy a House', icon: Home, amount: 5000000, years: 10, rate: 12 },
  { id: 'education', name: 'Child\'s Education', icon: GraduationCap, amount: 2500000, years: 15, rate: 12 },
  { id: 'vacation', name: 'Dream Vacation', icon: Plane, amount: 300000, years: 2, rate: 10 },
  { id: 'car', name: 'Buy a Car', icon: Car, amount: 800000, years: 3, rate: 10 },
  { id: 'retirement', name: 'Retirement Corpus', icon: UserCircle2, amount: 20000000, years: 25, rate: 12 },
  { id: 'wedding', name: 'Wedding', icon: Heart, amount: 1000000, years: 5, rate: 10 },
];

export default function SIPGoalTab() {
  const [goalName, setGoalName] = useState('My Dream Goal');
  const [targetAmount, setTargetAmount] = useState(5000000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (preset) => {
    setGoalName(preset.name);
    setTargetAmount(preset.amount);
    setYears(preset.years);
    setRate(preset.rate);
    setActivePreset(preset.id);
  };

  const handleCustomInput = (updater) => {
    setActivePreset(null);
    updater();
  };

  // Math
  const requiredMonthly = useMemo(() => {
    return calculateRequiredSIP(targetAmount, rate, years);
  }, [targetAmount, rate, years]);

  const requiredStepUpMonthly = useMemo(() => {
    return calculateRequiredStepUpSIP(targetAmount, rate, years, stepUpPercent);
  }, [targetAmount, rate, years, stepUpPercent]);

  const displaySIP = stepUpEnabled ? requiredStepUpMonthly : requiredMonthly;
  
  // Total Invested vs Returns mapped backwards
  // For total invested in step-up, we know out initial SIP, so we can calculate total invested
  const totalInvested = useMemo(() => {
    if (stepUpEnabled) {
      let total = 0;
      let current = requiredStepUpMonthly;
      for (let y = 0; y < years; y++) {
        total += current * 12;
        current *= (1 + stepUpPercent / 100);
      }
      return total;
    }
    return requiredMonthly * 12 * years;
  }, [stepUpEnabled, requiredStepUpMonthly, requiredMonthly, years, stepUpPercent]);

  const percentageInvested = targetAmount > 0 ? (totalInvested / targetAmount) * 100 : 0;
  
  const payloadForAI = {
    monthly: formatINR(displaySIP),
    years,
    rate,
    totalInvested: formatINRLarge(totalInvested),
    maturityValue: formatINRLarge(targetAmount),
    wealthGained: formatINRLarge(targetAmount - totalInvested),
    goalName,
    requiredSIP: formatINR(displaySIP)
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: INPUTS */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Presets */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
           <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Quick Goals</h3>
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
             {PRESET_GOALS.map((preset) => {
               const Icon = preset.icon;
               const isActive = activePreset === preset.id;
               return (
                 <button
                   key={preset.id}
                   onClick={() => applyPreset(preset)}
                   className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                     isActive 
                       ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 shadow-sm shadow-blue-500/20 text-blue-700 dark:text-blue-300 transform scale-[1.02]' 
                       : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                   }`}
                 >
                   <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                   <span className="text-xs font-semibold leading-tight">{preset.name}</span>
                 </button>
               );
             })}
           </div>
        </div>

        {/* Sliders */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8">
           <div className="space-y-4">
             <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Goal Name</label>
             <input
               type="text"
               value={goalName}
               onChange={(e) => handleCustomInput(() => setGoalName(e.target.value))}
               className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-200 font-medium"
               placeholder="e.g. Dream House"
             />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Amount</label>
                <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold rounded-lg border border-green-200 dark:border-green-800/50">
                  {formatINRLarge(targetAmount)}
                </div>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={targetAmount}
                onChange={(e) => handleCustomInput(() => setTargetAmount(Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Time to Goal</label>
                <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold rounded-lg border border-purple-200 dark:border-purple-800/50">
                  {years} Years
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => handleCustomInput(() => setYears(Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
           </div>
           
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expected Returns</label>
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-lg border border-blue-200 dark:border-blue-800/50">
                  {rate}%
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={rate}
                onChange={(e) => handleCustomInput(() => setRate(Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
           </div>
           
           <hr className="border-slate-200 dark:border-slate-800" />
           
           <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Step-up SIP Strategy</label>
                <span className="text-xs text-slate-500">Lower starting amount, grows yearly</span>
              </div>
              <button
                onClick={() => setStepUpEnabled(!stepUpEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    stepUpEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stepUpEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: OUTPUT */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* HERO RESULTS */}
        <div className="glass-panel p-8 rounded-3xl border border-blue-200 dark:border-blue-900/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
           
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                 <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-700 mb-6 shadow-sm">
                   <Target className="w-4 h-4 text-blue-500" />
                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target: {goalName}</span>
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
                   You need to invest
                   <span className="block text-blue-600 dark:text-blue-400 my-2">
                     {formatINR(displaySIP)} / month
                   </span>
                 </h2>
                 <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">
                   To reach your goal of <strong className="text-slate-800 dark:text-slate-200">{formatINRLarge(targetAmount)}</strong> in {years} years at {rate}% returns.
                 </p>
                 
                 {stepUpEnabled && (
                   <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl inline-flex items-center space-x-2">
                     <ArrowRight className="w-5 h-5 text-indigo-500" />
                     <p className="text-sm text-indigo-800 dark:text-indigo-300">
                       Starting small: Increasing your SIP by <strong className="font-bold">{stepUpPercent}%</strong> every year allows you to start an SIP of just <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{formatINR(requiredStepUpMonthly)}</strong> compared to the flat <strong className="line-through opacity-70 border border-transparent mx-1 bg-clip-border text-slate-500">{formatINR(requiredMonthly)}</strong>.
                     </p>
                   </div>
                 )}
              </div>
              
              <div className="mt-12">
                 <div className="flex justify-between text-sm font-bold mb-3">
                   <span className="text-slate-500 dark:text-slate-400">Total Investment Breakdown</span>
                   <span className="text-blue-600 dark:text-blue-400">{percentageInvested.toFixed(0)}% from your pocket</span>
                 </div>
                 
                 {/* Progress Bar Visualizer */}
                 <div className="w-full h-8 rounded-full overflow-hidden bg-emerald-500 flex shadow-inner">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000 flex items-center justify-end pr-3" 
                      style={{ width: `${percentageInvested}%` }}
                    >
                      <span className="text-xs font-bold text-white tracking-wider whitespace-nowrap overflow-hidden hidden md:inline">
                         {formatINRLarge(totalInvested)} Invested
                      </span>
                    </div>
                    <div className="flex-1 flex items-center pl-3">
                      <span className="text-xs font-bold text-white tracking-wider whitespace-nowrap overflow-hidden hidden md:inline">
                         {formatINRLarge(targetAmount - totalInvested)} Returns
                      </span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between text-xs mt-3 font-medium text-slate-500">
                   <div className="flex items-center space-x-1">
                     <div className="w-3 h-3 rounded bg-blue-500"></div>
                     <span>Your Money ({formatINRLarge(totalInvested)})</span>
                   </div>
                   <div className="flex items-center space-x-1">
                     <div className="w-3 h-3 rounded bg-emerald-500"></div>
                     <span>Compound Growth ({formatINRLarge(targetAmount - totalInvested)})</span>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* AI ADVISOR — only render when AI is enabled */}
        {import.meta.env.VITE_ENABLE_AI === 'true' && (
          <SIPAIAdvisor sipData={payloadForAI} type="goal" />
        )}
        
      </div>
    </div>
  );
}
