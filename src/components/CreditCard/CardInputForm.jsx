import { CreditCard, Percent, IndianRupee, ShieldAlert } from 'lucide-react';

export default function CardInputForm({ cardData, setCardData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ 
      ...prev, 
      [name]: value === '' ? '' : parseFloat(value) 
    }));
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
        <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mr-3">
          <CreditCard className="w-5 h-5" />
        </span>
        Card Details
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Outstanding Balance (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              name="balance"
              value={cardData.balance || ''}
              onChange={handleChange}
              placeholder="e.g. 50,000"
              className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono text-lg font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              name="rate"
              value={cardData.rate || ''}
              onChange={handleChange}
              placeholder="36"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 italic">Typical Indian CCs charge 36-42%!</p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Minimum Payment (%)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              name="minPercent"
              value={cardData.minPercent}
              onChange={handleChange}
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-sm font-black text-rose-600 dark:text-rose-400 w-12 text-right">
              {cardData.minPercent}%
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            Your Planned Payment (₹)
          </label>
          <input
            type="number"
            name="plannedPayment"
            value={cardData.plannedPayment || ''}
            onChange={handleChange}
            placeholder="3000"
            className="w-full px-4 py-3 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl text-emerald-700 dark:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-lg font-bold shadow-sm"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 italic">
            Credit Limit (₹) — optional
          </label>
          <input
            type="number"
            name="limit"
            value={cardData.limit || ''}
            onChange={handleChange}
            placeholder="e.g. 2,00,000"
            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent rounded-xl text-sm text-slate-600 dark:text-slate-400 focus:outline-none focus:bg-slate-50 transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
}
