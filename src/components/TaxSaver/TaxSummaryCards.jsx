import { formatINR } from '../../utils/taxCalculations';

export default function TaxSummaryCards({ taxAnalysis }) {
  if (!taxAnalysis) return null;

  const { grossIncome, newRegime, oldRegime } = taxAnalysis;
  const isOldBetter = oldRegime.totalTax < newRegime.totalTax;

  const Card = ({ title, regime, isBetter }) => (
    <div className={`p-6 rounded-3xl border-2 transition-all ${isBetter ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm relative' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'}`}>
      {isBetter && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
          Recommended
        </div>
      )}
      
      <h3 className={`text-lg font-black text-center mb-6 uppercase tracking-tight ${isBetter ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
        {title}
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-500 uppercase">Gross Income</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(grossIncome)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-500 uppercase flex flex-col">
            Total Deductions
            {title === 'New Regime' && <span className="text-[9px] text-slate-400 capitalize normal-case mt-0.5">(Standard Deduction only)</span>}
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-500">-{formatINR(regime.totalDeductions)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-500 uppercase">Taxable Income</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(regime.taxableIncome)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase flex flex-col">
            Tax Payable
            <span className="text-[9px] text-slate-400 normal-case mt-0.5 font-medium">Incl. cess & surcharge</span>
          </span>
          <span className={`text-lg font-black ${isBetter ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-500'}`}>
            {formatINR(regime.totalTax)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Est. Monthly TDS</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(regime.totalTax / 12)}/mo</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <Card title="Old Regime" regime={oldRegime} isBetter={isOldBetter} />
      <Card title="New Regime" regime={newRegime} isBetter={!isOldBetter} />
    </div>
  );
}
