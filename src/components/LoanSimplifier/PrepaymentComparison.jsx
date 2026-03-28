import { TrendingDown, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { formatCurrency, calculateSavings } from '../../utils/loanCalculations';

export default function PrepaymentComparison({ loanData, results }) {
  const { amount, rate, tenure, prepayment } = loanData;
  const { monthsSaved, interestSaved } = results;

  const standardMonths = Math.round(tenure * 12);
  const prepayMonths = standardMonths - monthsSaved;

  const newYears = Math.floor(prepayMonths / 12);
  const newRemainingMonths = prepayMonths % 12;
  const newTenureStr = `${newYears}y ${newRemainingMonths}mo`;

  const getEndDate = (totalMonths) => {
    if (!totalMonths || isNaN(totalMonths)) return '';
    const endMonthIndex = Number(loanData.startMonth) + totalMonths - 1;
    const endYear = Number(loanData.startYear) + Math.floor(endMonthIndex / 12);
    const endMonthName = new Date(0, endMonthIndex % 12).toLocaleString('default', { month: 'short' });
    return `${endMonthName} ${endYear}`;
  };

  if (prepayment <= 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center opacity-50 h-[400px]">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <TrendingDown className="w-8 h-8 text-slate-400" />
        </div>
        <h4 className="text-lg font-bold text-slate-400">Prepayment Power</h4>
        <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
          Enter an extra monthly payment to see how much you save!
        </p>
      </div>
    );
  }

  // Recalculate 'Without' to show comparison
  const baseSavings = calculateSavings(amount, rate, tenure, 0);
  const totalInterestNoPrepay = baseSavings.totalInterestNoPrepayment;

  const totalCostNoPrepay = amount + totalInterestNoPrepay;
  const totalCostWithPrepay = amount + results.totalInterestWithPrepayment;

  return (
    <div className="glass-panel overflow-hidden rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900/30 flex flex-col h-[400px]">
      <div className="bg-emerald-500 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center">
          <TrendingDown className="w-5 h-5 mr-2" />
          Prepayment Impact
        </h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          ₹{prepayment}/mo extra
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-8 relative">
          {/* Vertical Divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800"></div>

          {/* WITHOUT */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Standard Plan</p>
            <div>
              <p className="text-xs text-slate-500">Tenure & Payoff</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {Number(tenure).toFixed(2).replace(/\.?0+$/, '')} Years <span className="text-xs font-semibold text-slate-400 ml-1">({getEndDate(standardMonths)})</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Interest</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatCurrency(totalInterestNoPrepay)}</p>
            </div>
          </div>

          {/* WITH */}
          <div className="space-y-4 pl-4">
            <p className="text-[10px] font-bold text-emerald-500 uppercase">With Prepayment</p>
            <div>
              <p className="text-xs text-slate-500">New Tenure & Payoff</p>
              <div className="flex items-center text-emerald-600 font-bold whitespace-nowrap">
                <span className="text-sm">{newTenureStr} <span className="text-xs font-semibold text-emerald-500/70 ml-1">({getEndDate(prepayMonths)})</span></span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Interest</p>
              <p className="text-sm font-bold text-emerald-600">
                {formatCurrency(results.totalInterestWithPrepayment)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-6 -mb-6 p-6 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Lifetime Savings</p>
              <h4 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {formatCurrency(interestSaved)}
              </h4>
              <p className="text-xs font-bold text-emerald-600/70 mt-1 flex items-center">
                + {Math.floor(monthsSaved / 12)} years {monthsSaved % 12} months saved from your life
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center animate-bounce-slow">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
