import { Info } from 'lucide-react';

export default function RdInputForm({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ 
      ...prev, 
      [name]: parseFloat(value) || 0 
    }));
  };

  return (
    <div className="space-y-5">
      {/* Monthly Deposit Amount */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Monthly Deposit (₹)</label>
        <div className="relative group">
          <input
            type="number"
            name="monthlyAmount"
            value={data.monthlyAmount || ''}
            onChange={handleChange}
            placeholder="e.g. 5000"
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-lg font-black text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none group-focus-within:text-emerald-500">₹</div>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Annual Interest Rate (%)</label>
        <div className="relative group">
          <input
            type="number"
            step="0.1"
            name="rate"
            value={data.rate || ''}
            onChange={handleChange}
            placeholder="e.g. 6.5"
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-lg font-black text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none group-focus-within:text-emerald-500">%</div>
        </div>
      </div>

      {/* Tenure */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tenure (Months)</label>
        <input
          type="number"
          name="months"
          value={data.months}
          onChange={handleChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all"
        />
        <div className="flex justify-between px-1">
          <p className="text-[10px] text-slate-400 font-medium">6 months to 120 months.</p>
          <p className="text-[10px] text-emerald-600 font-bold uppercase">{Math.floor(data.months/12)}y {data.months%12}m</p>
        </div>
      </div>

      {/* Tax Slab */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pl-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tax Slab (%)</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 5, 10, 20, 30].map(slab => (
            <button
              key={slab}
              type="button"
              onClick={() => setData(prev => ({ ...prev, taxSlab: slab }))}
              className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                data.taxSlab === slab 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
              }`}
            >
              {slab}%
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/5 rounded-2xl border border-emerald-100 dark:border-emerald-900/10 flex items-start space-x-3">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5" />
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
          RD interest is compounded quarterly in most Indian banks. Interest is taxable if your total income exceeds the basic exemption limit.
        </p>
      </div>
    </div>
  );
}
