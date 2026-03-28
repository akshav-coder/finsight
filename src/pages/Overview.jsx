import { useData } from '../context/DataContext';
import SummaryCards from '../components/SummaryCards';
import TopTransfers from '../components/TopTransfers';

export default function Overview() {
  const { appData } = useData();

  if (!appData) return null;

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto w-full transition-colors duration-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Financial Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg transition-colors">A high-level summary of your selected statement.</p>
      </div>
      
      <SummaryCards summary={appData.summary} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopTransfers topPayees={appData.topPayees} transactions={appData.transactions} />
        
        {/* Placeholder for future overview widgets or just empty space */}
        <div className="bg-gradient-to-br from-primary-50 dark:from-primary-900/30 to-primary-100/50 dark:to-primary-900/10 rounded-3xl p-8 border border-primary-100/50 dark:border-primary-800/30 flex flex-col items-center justify-center text-center transition-colors duration-200">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-primary-500 dark:text-primary-400 transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">Net Balance Impact</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 transition-colors">You've reached your dashboard. Detailed feature modules can be snapped in right here.</p>
        </div>
      </div>
    </div>
  );
}
