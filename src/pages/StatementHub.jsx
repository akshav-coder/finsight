import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { UploadCloud, LayoutDashboard, PieChart, List, Lock } from 'lucide-react';

export default function StatementHub() {
  const { appData } = useData();
  const location = useLocation();

  const tabs = [
    { name: 'Upload', path: 'upload', icon: UploadCloud, enabled: true },
    { name: 'Overview', path: 'overview', icon: LayoutDashboard, enabled: !!appData },
    { name: 'Analytics', path: 'analytics', icon: PieChart, enabled: !!appData },
    { name: 'Transactions', path: 'transactions', icon: List, enabled: !!appData },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in-up transition-colors duration-200">
      {/* Tab Navigation */}
      <div className="mb-8 flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit self-center md:self-start transition-colors">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.includes(tab.path);
          
          if (!tab.enabled) {
            return (
              <div 
                key={tab.path}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-slate-400 dark:text-slate-500 cursor-not-allowed font-bold text-sm opacity-60"
                title="Upload a statement first to unlock"
              >
                <Lock className="w-4 h-4" />
                <span>{tab.name}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={`/app/statement-analytics/${tab.path}`}
              className={({ isActive }) => 
                `flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm ` +
                (isActive 
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')
              }
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : ''}`} />
              <span>{tab.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
