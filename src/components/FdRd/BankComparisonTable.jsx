import { useState } from 'react';
import { ArrowUpRight, TrendingUp, HelpCircle } from 'lucide-react';
import { formatINR, calculateFDCumulative, calculateRDMaturity } from '../../utils/fdRdCalculations';

// Indicative rates as of Q1 2026 — check bank website for latest
const FD_RATES = [
  { name: "SBI",           regular: 6.80, senior: 7.30, rdRegular: 6.50, rdSenior: 7.00 },
  { name: "HDFC Bank",     regular: 7.10, senior: 7.60, rdRegular: 7.00, rdSenior: 7.50 },
  { name: "ICICI Bank",    regular: 7.10, senior: 7.60, rdRegular: 7.00, rdSenior: 7.50 },
  { name: "Axis Bank",     regular: 7.10, senior: 7.75, rdRegular: 7.00, rdSenior: 7.60 },
  { name: "Kotak Bank",    regular: 7.25, senior: 7.75, rdRegular: 7.10, rdSenior: 7.60 },
  { name: "Yes Bank",      regular: 7.75, senior: 8.25, rdRegular: 7.50, rdSenior: 7.90 },
  { name: "IndusInd Bank", regular: 7.75, senior: 8.25, rdRegular: 7.50, rdSenior: 7.90 },
  { name: "IDFC First",    regular: 7.75, senior: 8.25, rdRegular: 7.50, rdSenior: 7.90 },
  { name: "Ujjivan SFB",   regular: 8.25, senior: 8.75, rdRegular: 8.00, rdSenior: 8.50 },
  { name: "AU Small Finance", regular: 8.00, senior: 8.50, rdRegular: 7.75, rdSenior: 8.25 },
];

export default function BankComparisonTable({ type, userRate, tenure, amount }) {
  const [isSenior, setIsSenior] = useState(false);
  const isRD = type === 'RD';

  const getRate = (bank) => isSenior
    ? (isRD ? bank.rdSenior : bank.senior)
    : (isRD ? bank.rdRegular : bank.regular);

  // Calculate maturity for a given rate
  const calcMaturity = (rate) => {
    if (isRD) {
      const months = Math.round(tenure * 12);
      return calculateRDMaturity(amount / months, rate, months);
    } else {
      return calculateFDCumulative(amount, rate, tenure).maturityAmount;
    }
  };

  const userMaturity = calcMaturity(userRate);

  const sortedBanks = [...FD_RATES].sort((a, b) => getRate(b) - getRate(a));
  const bestBank = sortedBanks[0];
  const bestRate = getRate(bestBank);
  const bestMaturity = calcMaturity(bestRate);
  const extraGain = Math.max(0, bestMaturity - userMaturity);

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
            Best {isRD ? 'RD' : 'FD'} Rates
            <span className="ml-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase px-2 py-0.5 rounded-full">Top Offers</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 flex items-center">
            Indicative rates — Q1 2026
            <HelpCircle className="w-3 h-3 ml-1 text-slate-300" title="Rates change frequently. Check bank website." />
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit self-end">
          <button
            onClick={() => setIsSenior(false)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${!isSenior ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400'}`}
          >
            Regular
          </button>
          <button
            onClick={() => setIsSenior(true)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${isSenior ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400'}`}
          >
            Senior (60+)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto max-h-[400px] scrollbar-hide">
        {amount > 0 ? (
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="pb-2 pl-2">Bank</th>
                <th className="pb-2">Rate</th>
                <th className="pb-2">Maturity</th>
                <th className="pb-2 pr-2 text-right">vs Yours</th>
              </tr>
            </thead>
            <tbody>
              {sortedBanks.map((bank, i) => {
                const currentRate = getRate(bank);
                const bankMaturity = calcMaturity(currentRate);
                const diff = bankMaturity - userMaturity;
                const isBest = currentRate === bestRate;
                const isUser = Math.abs(currentRate - userRate) < 0.01;

                return (
                  <tr 
                    key={i} 
                    className={`group transition-all hover:scale-[1.01] ${
                      isBest ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 
                      isUser ? 'bg-blue-50/50 dark:bg-blue-900/10' : 
                      'bg-slate-50/50 dark:bg-slate-800/30'
                    } rounded-xl`}
                  >
                    <td className="py-3 pl-4 rounded-l-xl">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{bank.name}</span>
                        {isUser && <span className="text-[9px] text-blue-500 font-bold uppercase">Your Rate</span>}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm font-black ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {currentRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatINR(bankMaturity)}</span>
                    </td>
                    <td className={`py-3 pr-4 text-right rounded-r-xl font-bold text-xs ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {diff > 0 ? `+${formatINR(diff)}` : diff < 0 ? `-${formatINR(Math.abs(diff))}` : 'Match'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600" />
             </div>
             <div>
                <p className="text-slate-900 dark:text-white font-bold">Compare Maturity Values</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-1">
                  Enter a deposit amount on the left to see how much you could earn with different banks.
                </p>
             </div>
          </div>
        )}
      </div>

      {amount > 0 && extraGain > 0 && (
        <div className="mt-6 p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-3" />
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Better alternative found</p>
                <p className="text-sm font-black">Earn {formatINR(extraGain)} more with {bestBank.name}!</p>
              </div>
            </div>
            <ArrowUpRight className="w-6 h-6 opacity-50" />
          </div>
        </div>
      )}
    </div>
  );
}
