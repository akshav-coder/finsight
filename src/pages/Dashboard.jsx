import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Calculator, CreditCard, PiggyBank, 
  Lightbulb, Target, Receipt, TrendingUp,
  ArrowRight, Sparkles, Files, Clock, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';

const tools = [
  {
    id: 'statement',
    name: 'Statement Analyzer',
    description: 'Upload bank statement → get full spending breakdown',
    icon: PieChart,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/30',
    path: '/app/statement-analytics',
    tag: 'Most Popular',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  },
  {
    id: 'loan',
    name: 'Loan Simplifier',
    description: 'See exactly how much your EMI costs you',
    icon: Calculator,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-100 dark:border-indigo-800/30',
    path: '/app/loan',
    tag: 'Save Money',
    tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
  },
  {
    id: 'credit-card',
    name: 'Credit Card Analyzer',
    description: 'Escape the minimum payment trap',
    icon: CreditCard,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-100 dark:border-rose-800/30',
    path: '/app/credit-card',
    tag: 'Eye Opener',
    tagColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
  },
  {
    id: 'fd-rd',
    name: 'FD / RD Tracker',
    description: 'Find the best FD rates across banks',
    icon: PiggyBank,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/30',
    path: '/app/fd-rd',
    tag: 'Earn More',
    tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'See how ₹5,000/month becomes ₹50L',
    icon: TrendingUp,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-100 dark:border-orange-800/30',
    path: '/app/sip-calculator',
    tag: 'Grow Wealth',
    tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
  },
  {
    id: 'tax',
    name: 'Tax Saver',
    description: 'Find how much tax you can legally save',
    icon: Receipt,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    border: 'border-cyan-100 dark:border-cyan-800/30',
    path: '/app/tax-saver',
    tag: 'Save Tax',
    tagColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
  },
  {
    id: 'debt',
    name: 'Debt Planner',
    description: 'Avalanche vs Snowball — which clears debt faster',
    icon: Target,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-800/30',
    path: '/app/debt-planner',
    tag: 'Get Free',
    tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-blue-300'
  },
  {
    id: 'savings',
    name: 'Savings Advisor',
    description: 'Get personalized tips based on your spending',
    icon: Lightbulb,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-100 dark:border-amber-800/30',
    path: '/app/savings-advisor',
    tag: 'AI Powered',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { historyCount, appData } = useData();

  return (
    <div className="animate-fade-in-up max-w-[1600px] mx-auto w-full pb-20 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600">Command Center</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
            Welcome back. Your personal financial health stats and specialized tools are consolidated here for total clarity.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-105 duration-300">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
            Local & Private
          </span>
        </div>
      </div>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 hover:shadow-xl transition-all duration-500">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform">
            <Files className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter tabular-nums">
            {historyCount}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Total Statements Analyzed
          </p>
        </div>

        <div className="group glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 hover:shadow-xl transition-all duration-500">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter tabular-nums">
            {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Current Reporting Period
          </p>
        </div>

        <div className="group glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 hover:shadow-xl transition-all duration-500">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">
            {appData ? "Active" : "Ready"}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Analysis Pipeline Status
          </p>
        </div>

        <div className="group glass-panel p-1 rounded-[2.5rem] border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 transition-all duration-500 cursor-pointer" onClick={() => navigate('/app/statement-analytics/upload')}>
          <div className="h-full w-full p-7 flex flex-col justify-between items-start bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.2rem] text-white shadow-lg shadow-primary-600/20 group-hover:scale-[0.98] transition-transform">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-1">Direct Action</p>
              <h3 className="text-xl font-bold leading-tight">Start New Analysis</h3>
            </div>
            <div className="mt-4 flex items-center text-sm font-bold opacity-80">
              <span>Go to upload</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbox grid heading */}
      <div className="pt-4">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Financial Toolbox</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className="group glass-panel p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${tool.bg} ${tool.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  {tool.tag && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tool.tagColor} shadow-sm`}>
                      {tool.tag}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary-500 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest group-hover:text-primary-500">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner / Recommendation */}
      {!appData && (
        <div className="mt-8 glass-panel p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900/50 relative overflow-hidden group hover:border-indigo-400/50 transition-all duration-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-indigo-500/10" />
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Sparkles className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Unlock Private Financial Insights</h4>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
                Our <strong className="text-slate-800 dark:text-slate-200">Local-First Analyzer</strong> processes your bank statement 100% inside your browser. No data ever leaves your computer.
              </p>
            </div>
            <button 
              onClick={() => navigate('/app/statement-analytics')}
              className="md:ml-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 whitespace-nowrap"
            >
              Analyze Your PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
