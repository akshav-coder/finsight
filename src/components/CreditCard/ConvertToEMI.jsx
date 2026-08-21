import { useState, useMemo } from 'react';
import { Repeat, ArrowRight } from 'lucide-react';
import { formatINR, totalInterest } from '../../utils/creditCardCalculations';
import { calculateEMI } from '../../utils/loanCalculations';

const TENURE_OPTIONS = [6, 12, 18, 24, 36];

export default function ConvertToEMI({ cardData, results }) {
  const [emiRate, setEmiRate] = useState(15);
  const [tenureMonths, setTenureMonths] = useState(12);

  const { balance } = cardData;

  const emi = useMemo(
    () => calculateEMI(balance, emiRate, tenureMonths / 12),
    [balance, emiRate, tenureMonths]
  );
  const emiTotalInterest = emi * tenureMonths - balance;
  const cardInterestIfContinued = totalInterest(results.plannedSchedule);
  const interestSaved = cardInterestIfContinued - emiTotalInterest;

  if (!balance) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-indigo-200/60 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center">
        <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
          <Repeat className="w-5 h-5" />
        </span>
        Consider Converting to EMI
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 ml-11">
        Most Indian banks let you convert an outstanding balance into a fixed EMI at a much
        lower rate than the {cardData.rate || 36}% your card charges on revolving balances —
        often the easiest way out, since it needs no extra cash.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Bank's EMI conversion rate (%)
          </label>
          <input
            type="number"
            step="0.5"
            value={emiRate}
            onChange={(e) => setEmiRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Tenure
          </label>
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {TENURE_OPTIONS.map((m) => (
              <option key={m} value={m}>{m} months</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Fixed EMI</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{formatINR(emi)}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Total interest on EMI</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{formatINR(Math.max(0, emiTotalInterest))}</span>
        </div>
      </div>

      {cardData.plannedPayment > 0 && (
        <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
          <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            Revolving at {cardData.rate}%
            <ArrowRight className="w-3 h-3 mx-1.5" />
            EMI at {emiRate}%
          </div>
          <span className={`text-lg font-black ${interestSaved > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            {interestSaved > 0 ? `Save ${formatINR(interestSaved)}` : 'No savings at this rate'}
          </span>
        </div>
      )}

      <p className="text-[10px] text-slate-400 mt-4 italic">
        Illustrative — confirm your bank's actual EMI conversion rate and any processing fee
        before converting; both vary by issuer and offer.
      </p>
    </div>
  );
}
