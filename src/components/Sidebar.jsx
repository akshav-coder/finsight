import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PieChart,
  LogOut,
  Copy,
  Check,
  Calculator,
  CreditCard,
  PiggyBank,
  Lightbulb,
  Target,
  FileSearch,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const { appData, setAppData } = useData();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    setAppData(null);
    navigate('/');
  };

  const handleCopyData = () => {
    if (!appData?.transactions) return;
    const json = JSON.stringify(appData.transactions, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Loan Simplifier', path: '/app/loan', icon: Calculator },
    { name: 'Credit Card', path: '/app/credit-card', icon: CreditCard },
    { name: 'FD / RD Tracker', path: '/app/fd-rd', icon: PiggyBank },
    { name: 'Savings Advisor', path: '/app/savings-advisor', icon: Lightbulb },
    { name: 'Debt Planner', path: '/app/debt-planner', icon: Target },
    { name: 'Tax Saver', path: '/app/tax-saver', icon: Receipt },
    { name: 'SIP Calculator', path: '/app/sip-calculator', icon: TrendingUp },
    { name: 'Statement Analytics', path: '/app/statement-analytics', icon: PieChart }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed top-0 left-0 hidden md:flex flex-col flex-shrink-0 z-20 shadow-sm transition-colors duration-200">
      <Link to="/" className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 mt-2 mb-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
        <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
          <path d="M32 4L56 32L32 60L8 32Z" fill="url(#facet_main_nav)" />
          <path d="M32 4L56 32L32 32Z" fill="url(#facet_right_nav)" />
          <path d="M32 4L8 32L32 32Z" fill="url(#facet_left_nav)" />
          <path d="M8 32L32 60L32 32Z" fill="url(#facet_bottom_left_nav)" />
          <path d="M56 32L32 60L32 32Z" fill="url(#facet_bottom_right_nav)" />
          <circle cx="32" cy="22" r="5" fill="#ffffff" />
        </svg>
        <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Fin<span className="text-rose-500">S</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-500">ight</span>
        </span>
      </Link>

      <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-3">App Dashboard</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all group ` +
                (isActive
                  ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-primary-200/50 dark:border-primary-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent')
              }
            >
              <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-5 border-t border-slate-100 dark:border-slate-800 mb-2 space-y-2">
        <ThemeToggle className="w-full justify-start space-x-3 px-4 py-3 font-semibold" />

        {appData && (
          <button
            onClick={handleCopyData}
            className={`flex w-full items-center justify-start space-x-3 px-4 py-3 rounded-2xl font-semibold transition-all border ${copied ? 'bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-400 border-success-200/50 dark:border-success-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 border-transparent hover:border-primary-200/50 dark:hover:border-primary-500/20'}`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Data Copied!' : 'Copy AI JSON'}</span>
          </button>
        )}

        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-start space-x-3 px-4 py-3 rounded-2xl font-semibold text-slate-500 dark:text-slate-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 dark:hover:text-danger-400 transition border border-transparent hover:border-danger-100/50 dark:hover:border-danger-800/50"
        >
          <LogOut className="w-5 h-5 opacity-80" />
          <span>Exit to Home</span>
        </button>
      </div>
      
      {/* Definitions for SVG gradients */}
      <svg width="0" height="0" className="absolute -z-50 invisible">
        <defs>
          <radialGradient id="bg_glow_nav" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
          <linearGradient id="facet_main_nav" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#3b82f6" /></linearGradient>
          <linearGradient id="facet_left_nav" x1="8" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#e11d48" /></linearGradient>
          <linearGradient id="facet_right_nav" x1="32" y1="4" x2="56" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6366f1" /></linearGradient>
          <linearGradient id="facet_bottom_left_nav" x1="8" y1="32" x2="32" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#fb923c" /><stop offset="1" stopColor="#f97316" /></linearGradient>
          <linearGradient id="facet_bottom_right_nav" x1="32" y1="32" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#2563eb" /></linearGradient>
        </defs>
      </svg>
    </aside>
  );
}
