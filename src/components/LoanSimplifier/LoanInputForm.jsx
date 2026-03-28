import { Calendar } from 'lucide-react';

export default function LoanInputForm({ loanData, setLoanData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep as string if empty to allow blank inputs, otherwise parse to float
    setLoanData(prev => ({ 
      ...prev, 
      [name]: value === '' ? '' : parseFloat(value)
    }));
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
        <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
          <Calendar className="w-5 h-5" />
        </span>
        Loan Parameters
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={loanData.amount || ''}
            onChange={handleChange}
            placeholder="e.g. 50,00,000"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono text-lg font-bold"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            name="rate"
            value={loanData.rate || ''}
            onChange={handleChange}
            placeholder="8.5"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Number of Installments (Months)
          </label>
          <input
            type="number"
            min="1"
            max="360"
            value={loanData.tenure ? Math.round(loanData.tenure * 12) : ''}
            onChange={(e) => {
               const val = e.target.value;
               setLoanData(prev => ({
                 ...prev,
                 tenure: val === '' ? '' : parseFloat(val) / 12
               }));
            }}
            placeholder="e.g. 60"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 mt-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Loan Tenure (Years)
            </label>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {loanData.tenure ? Number(loanData.tenure).toFixed(2).replace(/\.?0+$/, '') : 0} Years
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="30"
            step="0.5"
            name="tenure"
            value={loanData.tenure || 0}
            onChange={handleChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Start Month
            </label>
            <select
              name="startMonth"
              value={loanData.startMonth}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Start Year
            </label>
            <input
              type="number"
              name="startYear"
              value={loanData.startYear}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-bold text-success-600 dark:text-success-400 mb-2">
            Extra Monthly Prepayment (₹)
          </label>
          <input
            type="number"
            name="prepayment"
            value={loanData.prepayment || ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-3 bg-success-50/30 dark:bg-success-900/10 border border-success-200/50 dark:border-success-800/30 rounded-xl text-success-700 dark:text-success-300 focus:outline-none focus:ring-2 focus:ring-success-500/20 focus:border-success-500 transition-all font-mono text-lg font-bold"
          />
          <p className="text-[10px] text-slate-500 mt-2">
            Even a small monthly prepay can save lakhs in interest!
          </p>
        </div>
      </div>
    </div>
  );
}
