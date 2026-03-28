import SummaryCards from './SummaryCards';
import SpendingPieChart from './SpendingPieChart';
import SpendingBarChart from './SpendingBarChart';
import TopTransfers from './TopTransfers';
import TransactionTable from './TransactionTable';
import { LogOut } from 'lucide-react';

export default function Dashboard({ data, onReset }) {
  if (!data) return null;

  const { summary, categoryData, dailyData, topPayees, transactions } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md flex-shrink-0">
              <circle cx="32" cy="32" r="30" fill="url(#bg_glow_nav)" opacity="0.2" />
              <path d="M32 4L56 24L32 60L8 24L32 4Z" fill="url(#facet_main_nav)" />
              <path d="M32 4L56 24L32 38Z" fill="url(#facet_right_nav)" />
              <path d="M32 4L8 24L32 38Z" fill="url(#facet_left_nav)" />
              <path d="M8 24L32 38L32 60Z" fill="url(#facet_bottom_left_nav)" />
              <path d="M56 24L32 38L32 60Z" fill="url(#facet_bottom_right_nav)" />
              <circle cx="32" cy="24" r="5" fill="#ffffff" />
              <defs>
                <radialGradient id="bg_glow_nav" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
                <linearGradient id="facet_main_nav" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient>
                <linearGradient id="facet_left_nav" x1="8" y1="24" x2="32" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#f97316" /></linearGradient>
                <linearGradient id="facet_right_nav" x1="32" y1="4" x2="56" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#3b82f6" /></linearGradient>
                <linearGradient id="facet_bottom_left_nav" x1="8" y1="24" x2="32" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
                <linearGradient id="facet_bottom_right_nav" x1="32" y1="38" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#0ea5e9" /></linearGradient>
              </defs>
            </svg>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500">Sight</span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Your statement has been analyzed successfully.</p>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Analyze Another
          </button>
        </header>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SpendingPieChart data={categoryData} />
          <SpendingBarChart data={dailyData} />
        </div>

        <TopTransfers payees={topPayees} />

        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
