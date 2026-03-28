import { useData } from '../context/DataContext';
import SpendingPieChart from '../components/SpendingPieChart';
import SpendingBarChart from '../components/SpendingBarChart';

export default function Analytics() {
  const { appData } = useData();

  if (!appData) return null;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto w-full transition-colors duration-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Spending Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg transition-colors">Deep dive into your categories and daily trends.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SpendingPieChart data={appData.categoryData} />
        <SpendingBarChart data={appData.dailyData} />
      </div>
    </div>
  );
}
