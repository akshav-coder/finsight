import { useState, useMemo } from 'react';
import CardInputForm from '../components/CreditCard/CardInputForm';
import CardSummaryCards from '../components/CreditCard/CardSummaryCards';
import MinPaymentTrapChart from '../components/CreditCard/MinPaymentTrapChart';
import InterestGrowthChart from '../components/CreditCard/InterestGrowthChart';
import PayoffComparison from '../components/CreditCard/PayoffComparison';
import CreditCardAISummary from '../components/CreditCard/CreditCardAISummary';
import { calculateMinPaymentSchedule, calculateFixedPaymentSchedule } from '../utils/creditCardCalculations';

export default function CreditCardAnalyzer() {
  const [cardData, setCardData] = useState({
    balance: 50000,
    rate: 36,
    minPercent: 5,
    plannedPayment: 3000,
    limit: 0
  });

  // Calculate schedules
  const results = useMemo(() => {
    const minSchedule = calculateMinPaymentSchedule(cardData.balance, cardData.rate, cardData.minPercent);
    const plannedSchedule = calculateFixedPaymentSchedule(cardData.balance, cardData.rate, cardData.plannedPayment);
    const aggressiveSchedule = calculateFixedPaymentSchedule(cardData.balance, cardData.rate, Math.max(cardData.plannedPayment, 1000) + 2000);

    return {
      minSchedule,
      plannedSchedule,
      aggressiveSchedule
    };
  }, [cardData]);

  // Check if payment covers interest
  const monthlyInterest = (cardData.balance * (cardData.rate / 12 / 100));
  const isTrap = cardData.plannedPayment <= monthlyInterest && cardData.balance > 0;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto w-full pb-20">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
            Credit Card <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-600">Analyzer</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Escape the minimum payment trap and strategize your payoff.
          </p>
        </div>
        {cardData.limit > 0 && (
          <div className="glass-panel px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Utilization</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    (cardData.balance / cardData.limit) > 0.75 ? 'bg-rose-500' : 
                    (cardData.balance / cardData.limit) > 0.5 ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (cardData.balance / cardData.limit) * 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {Math.round((cardData.balance / cardData.limit) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {isTrap && (
        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-4 animate-pulse-slow">
          <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold">!</span>
          </div>
          <p className="text-rose-700 dark:text-rose-400 font-bold text-sm">
            Warning: Your payment of ₹{cardData.plannedPayment} doesn't even cover the monthly interest of ₹{Math.round(monthlyInterest)}. 
            Your balance will keep GROWING!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <CardInputForm cardData={cardData} setCardData={setCardData} />
          <CreditCardAISummary cardData={cardData} results={results} />
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-8 space-y-8">
          <CardSummaryCards results={results} cardData={cardData} />
          
          <div className="grid grid-cols-1 gap-8">
            <MinPaymentTrapChart 
              minSchedule={results.minSchedule} 
              plannedSchedule={results.plannedSchedule} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InterestGrowthChart plannedSchedule={results.plannedSchedule} />
              <PayoffComparison results={results} cardData={cardData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
