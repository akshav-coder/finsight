import { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Calculator } from 'lucide-react';
import FunFactsTicker from '../components/SIPCalculator/FunFactsTicker';
import SIPBasicTab from '../components/SIPCalculator/SIPBasicTab';
import SIPGoalTab from '../components/SIPCalculator/SIPGoalTab';
import StartEarlyTab from '../components/SIPCalculator/StartEarlyTab';

const TabButton = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
      activeTab === id
        ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
    }`}
  >
    <Icon className={`w-4 h-4 ${activeTab === id ? 'text-primary-500' : ''}`} />
    <span>{label}</span>
    {activeTab === id && (
      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-t-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
    )}
  </button>
);

export default function SIPCalculator() {
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            <TrendingUp className="w-8 h-8 mr-3 text-emerald-500 drop-shadow-sm" />
            SIP Calculator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
            See how small, consistent investments turn into life-changing wealth over time using the magic of compounding.
          </p>
        </div>
      </div>

      <div className="glass-panel p-2 rounded-2xl border border-slate-200 dark:border-slate-800 inline-flex flex-wrap gap-2">
        <TabButton id="basic" icon={Calculator} label="SIP Calculator" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="goal" icon={Target} label="Goal Planner" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="delay" icon={Clock} label="Start Early vs Late" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-8 transition-all duration-500">
        {activeTab === 'basic' && <SIPBasicTab />}
        {activeTab === 'goal' && <SIPGoalTab />}
        {activeTab === 'delay' && <StartEarlyTab />}
      </div>

      <FunFactsTicker />
    </div>
  );
}

