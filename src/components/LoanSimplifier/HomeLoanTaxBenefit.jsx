import { useState, useMemo } from 'react';
import { Landmark } from 'lucide-react';
import { formatCurrency } from '../../utils/loanCalculations';
import { TAX_CONSTANTS } from '../../utils/taxCalculations';

// Only meaningful in the Old Tax Regime — the New Regime doesn't allow a
// self-occupied home loan interest deduction, which is exactly the kind of
// detail a layman wouldn't know to ask about.
const SLAB_OPTIONS = [
  { label: '5% slab', rate: 0.05 },
  { label: '20% slab', rate: 0.20 },
  { label: '30% slab', rate: 0.30 },
];

export default function HomeLoanTaxBenefit({ results }) {
  const [slabRate, setSlabRate] = useState(0.20);

  const { interestThisYear, principalThisYear } = useMemo(() => {
    const firstYearRows = results.schedule.slice(0, 12);
    return {
      interestThisYear: firstYearRows.reduce((sum, r) => sum + r.interest, 0),
      principalThisYear: firstYearRows.reduce((sum, r) => sum + r.totalPrincipalPaid, 0),
    };
  }, [results.schedule]);

  if (!results.schedule.length) return null;

  const deductibleInterest = Math.min(interestThisYear, TAX_CONSTANTS.section24B_limit);
  const deductiblePrincipal = Math.min(principalThisYear, TAX_CONSTANTS.section80C_limit);
  const estimatedTaxSaved = (deductibleInterest + deductiblePrincipal) * slabRate;

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center">
        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
          <Landmark className="w-5 h-5" />
        </span>
        Home Loan Tax Benefit
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 ml-11">
        Old Tax Regime only — the New Regime doesn't allow this deduction for a self-occupied home.
      </p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Interest paid, Year 1 (Sec 24B, capped at {formatCurrency(TAX_CONSTANTS.section24B_limit)})</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(deductibleInterest)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Principal paid, Year 1 (Sec 80C, shared {formatCurrency(TAX_CONSTANTS.section80C_limit)} limit)</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(deductiblePrincipal)}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900/30">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Your income tax slab</label>
        <div className="flex gap-2 mb-4">
          {SLAB_OPTIONS.map((opt) => (
            <button
              key={opt.rate}
              onClick={() => setSlabRate(opt.rate)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                slabRate === opt.rate
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Estimated tax saved, Year 1</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(estimatedTaxSaved)}</span>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-4 italic">
        Illustrative only — your actual 80C benefit depends on other investments (EPF, PPF, ELSS...)
        sharing the same limit. For a full picture, use the Tax Saver calculator with your real income.
      </p>
    </div>
  );
}
