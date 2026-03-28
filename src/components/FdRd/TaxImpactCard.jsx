import { ShieldAlert, Info, Percent } from 'lucide-react';
import { formatINR } from '../../utils/fdRdCalculations';

export default function TaxImpactCard({ taxImpact }) {
  const { grossInterest, tdsAmount, additionalTax, netInterest, tdsApplicable, totalTaxAmount } = taxImpact;
  
  const taxPercentage = (totalTaxAmount / grossInterest) * 100 || 0;

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full uppercase tracking-tight">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <Percent className="w-5 h-5 mr-2 text-amber-500" />
          Tax Breakdown
        </h3>
        {tdsApplicable && (
          <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse-slow">
            TDS Active
          </span>
        )}
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400">Gross Interest</span>
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">{formatINR(grossInterest)}</span>
        </div>

        <div className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center">
            <span className="text-[10px] font-bold text-slate-500">TDS Deducted (10%)</span>
            {tdsApplicable && <Info className="w-3 h-3 ml-1 text-slate-400 cursor-help" title="Bank deducts this if annual interest > ₹40k" />}
          </div>
          <span className="text-sm font-black text-rose-500">-{formatINR(tdsAmount)}</span>
        </div>

        <div className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-500">Additional Slab Tax</span>
          <span className="text-sm font-black text-rose-500">-{formatINR(additionalTax)}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border-2 border-emerald-100 dark:border-emerald-800/50">
          <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase">Net Interest in Hand</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatINR(netInterest)}</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50 flex space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 mb-1">Tax Insight</p>
            <p className="text-[10px] text-amber-700 dark:text-amber-500 font-medium leading-relaxed lowercase italic first-letter:uppercase">
              {taxPercentage > 0 
                ? `You're paying ${taxPercentage.toFixed(1)}% of your interest in taxes. Submit Form 15G/15H to avoid TDS if your income is below taxable limit.`
                : "Your interest is below the TDS threshold. No tax will be deducted by the bank."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
