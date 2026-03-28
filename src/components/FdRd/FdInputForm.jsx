import { Info } from 'lucide-react';

export default function FdInputForm({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ 
      ...prev, 
      [name]: (name === 'payoutType' || name === 'payoutFrequency') ? value : parseFloat(value) || 0 
    }));
  };

  const isCumulative = data.payoutType === 'Cumulative';

  return (
    <div className="space-y-5">
      {/* Deposit Amount */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Deposit Amount (₹)</label>
        <div className="relative group">
          <input
            type="number"
            name="amount"
            value={data.amount || ''}
            onChange={handleChange}
            placeholder="e.g. 100000"
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
            step="0.01"
            name="rate"
            value={data.rate || ''}
            onChange={handleChange}
            placeholder="e.g. 7.1"
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-lg font-black text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none group-focus-within:text-emerald-500">%</div>
        </div>
        <p className="text-[10px] text-slate-400 pl-1 font-medium">Standard Indian rates range from 6% to 8.5%</p>
      </div>

      {/* Tenure — Years / Months / Days */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tenure</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 pl-1 font-bold uppercase">Years</p>
            <input
              type="number"
              name="years"
              min="0"
              value={data.years}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-3 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all text-center"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 pl-1 font-bold uppercase">Months</p>
            <input
              type="number"
              name="months"
              min="0"
              max="11"
              value={data.months}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-3 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all text-center"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 pl-1 font-bold uppercase">Days</p>
            <input
              type="number"
              name="days"
              min="0"
              max="30"
              value={data.days || 0}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-3 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all text-center"
            />
          </div>
        </div>
      </div>

      {/* Payout Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Payout Type</label>
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl">
          {['Cumulative', 'Non-Cumulative'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setData(prev => ({ ...prev, payoutType: type }))}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                data.payoutType === type 
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 pl-1">
          {isCumulative
            ? '✦ Interest compounded & paid at maturity (higher returns)'
            : '✦ Interest paid out periodically; principal at maturity'}
        </p>
      </div>

      {/* Compounding Frequency (only for Cumulative) */}
      {isCumulative && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Compounding Frequency</label>
          <select
            name="compounding"
            value={data.compounding}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="12">Monthly</option>
            <option value="4">Quarterly (Bank Standard)</option>
            <option value="2">Half-Yearly</option>
            <option value="1">Yearly</option>
          </select>
        </div>
      )}

      {/* Payout Frequency (only for Non-Cumulative) */}
      {!isCumulative && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Interest Payout Frequency</label>
          <select
            name="payoutFrequency"
            value={data.payoutFrequency || 'Monthly'}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-yearly">Half-Yearly</option>
            <option value="Annually">Annually</option>
            <option value="At Maturity">At Maturity</option>
          </select>
        </div>
      )}

      {/* Tax Slab */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pl-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tax Slab (%)</label>
          <div className="group relative">
            <Info className="w-3 h-3 text-slate-300 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-10">
              TDS (10%) is deducted by bank if annual interest &gt; ₹40,000. You pay the remaining tax at slab rate.
            </div>
          </div>
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
    </div>
  );
}
