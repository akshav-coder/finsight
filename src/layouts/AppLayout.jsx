import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  const { appData } = useData();
  const location = useLocation();

  const isProtectedPath = (
    location.pathname.includes('/overview') || 
    location.pathname.includes('/analytics') || 
    location.pathname.includes('/transactions')
  ) && !location.pathname.includes('/upload');
  
  if (!appData && isProtectedPath) {
    return <Navigate to="/app/statement-analytics/upload" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary-100 dark:selection:bg-primary-900/50 selection:text-primary-900 dark:selection:text-primary-100 overflow-hidden transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 relative">
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full custom-scrollbar p-6 lg:p-10 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
