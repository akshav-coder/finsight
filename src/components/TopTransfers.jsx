export default function TopTransfers({ payees }) {
  if (!payees || payees.length === 0) {
     return (
       <div className="glass-panel p-6 rounded-2xl h-80 flex items-center justify-center">
         <p className="text-slate-500">No payee data available.</p>
       </div>
     );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-200">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-200">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center">Top Payees & Merchants</h3>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <ul className="space-y-4">
          {payees.map((payee, idx) => (
            <li key={idx}>
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {payee.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">{payee.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">{payee.count} transaction{payee.count > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-800 dark:text-slate-100">
                    ₹{payee.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
