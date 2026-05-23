import { useData } from '../context/DataContext';
import SummaryCards from '../components/SummaryCards';
import TopTransfers from '../components/TopTransfers';

function NetBalanceWidget({ summary }) {
  const { totalIn = 0, totalOut = 0, netBalance = 0 } = summary || {};
  
  const isPositive = netBalance >= 0;
  
  let spendRatio = 0;
  let savingsRate = 0;
  
  if (totalIn > 0) {
    spendRatio = (totalOut / totalIn) * 100;
    savingsRate = ((totalIn - totalOut) / totalIn) * 100;
  } else if (totalOut > 0) {
    spendRatio = 100;
    savingsRate = -100;
  }

  const progressBarWidth = Math.min(spendRatio, 100);

  let statusColor = "text-danger-500 dark:text-danger-400";
  let statusText = "High Spend";
  let badgeClasses = "bg-danger-50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400";

  if (savingsRate > 20) {
    statusColor = "text-success-500 dark:text-success-400";
    statusText = "Healthy";
    badgeClasses = "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400";
  } else if (savingsRate >= 10) {
    statusColor = "text-amber-500 dark:text-amber-400";
    statusText = "Moderate";
    badgeClasses = "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
  }

  const formatCurrency = (val) => Math.abs(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200 flex flex-col justify-center h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Net Balance Impact</h3>
          <div className={`text-4xl font-bold tracking-tight ${isPositive ? 'text-success-600 dark:text-success-500' : 'text-danger-600 dark:text-danger-500'}`}>
            {isPositive ? '+' : '-'}₹{formatCurrency(netBalance)}
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Savings Rate</div>
          <div className={`text-xl font-bold ${statusColor}`}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className={`text-[10px] font-bold px-2.5 py-1 rounded-md mt-1.5 inline-block tracking-wide uppercase ${badgeClasses}`}>
            {statusText}
          </div>
        </div>
      </div>

      <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Income: ₹{formatCurrency(totalIn)}</span>
        <span>Spend: ₹{formatCurrency(totalOut)}</span>
      </div>
      
      <div className="h-4 w-full bg-success-100 dark:bg-success-900/30 rounded-full overflow-hidden mb-6 flex relative">
        <div 
          className="h-full bg-danger-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center">
          {isPositive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-success-500 mr-2 flex-shrink-0"></span>
              You saved ₹{formatCurrency(netBalance)} this period.
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-danger-500 mr-2 flex-shrink-0"></span>
              You overspent by ₹{formatCurrency(netBalance)} this period.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

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
        <NetBalanceWidget summary={appData.summary} />
      </div>
    </div>
  );
}
