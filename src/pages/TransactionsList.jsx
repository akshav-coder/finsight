import { useData } from '../context/DataContext';
import TransactionTable from '../components/TransactionTable';

export default function TransactionsList() {
  const { appData } = useData();

  if (!appData) return null;

  return (
    <div className="animate-fade-in-up h-full flex flex-col max-w-7xl mx-auto w-full transition-colors duration-200">
      <div className="mb-8 flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Activity History</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg transition-colors">A permanent, searchable record of every line item from your banking history.</p>
      </div>
      
      <div className="flex-1 min-h-[500px]">
        <TransactionTable transactions={appData.transactions} />
      </div>
    </div>
  );
}
