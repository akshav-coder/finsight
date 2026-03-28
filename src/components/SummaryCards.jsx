import { ArrowDownRight, ArrowUpRight, Activity, Wallet } from 'lucide-react';

export default function SummaryCards({ summary }) {
  const { totalIn = 0, totalOut = 0, netBalance = 0, totalTransactions = 0 } = summary || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Money Received</p>
            <h3 className="text-2xl font-bold text-success-600">
              ₹{totalIn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="p-3 bg-success-50 rounded-xl">
            <ArrowDownRight className="w-6 h-6 text-success-500" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Money Spent</p>
            <h3 className="text-2xl font-bold text-danger-600">
              ₹{totalOut.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="p-3 bg-danger-50 rounded-xl">
            <ArrowUpRight className="w-6 h-6 text-danger-500" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Net Balance</p>
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              ₹{Math.abs(netBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              {netBalance < 0 && <span className="text-sm font-normal text-danger-500 ml-1"></span>}
            </h3>
          </div>
          <div className={`p-3 rounded-xl ${netBalance >= 0 ? 'bg-success-50' : 'bg-danger-50'}`}>
            <Wallet className={`w-6 h-6 ${netBalance >= 0 ? 'text-success-500' : 'text-danger-500'}`} />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Transactions</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalTransactions}
            </h3>
          </div>
          <div className="p-3 bg-primary-50 rounded-xl">
            <Activity className="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
