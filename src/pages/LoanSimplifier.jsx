import { useState, useMemo } from 'react';
import LoanInputForm from '../components/LoanSimplifier/LoanInputForm';
import LoanSummaryCards from '../components/LoanSimplifier/LoanSummaryCards';
import PrincipalInterestChart from '../components/LoanSimplifier/PrincipalInterestChart';
import AmortizationBarChart from '../components/LoanSimplifier/AmortizationBarChart';
import PrepaymentComparison from '../components/LoanSimplifier/PrepaymentComparison';
import AmortizationTable from '../components/LoanSimplifier/AmortizationTable';
import LoanAISummary from '../components/LoanSimplifier/LoanAISummary';
import { calculateSavings, generateSchedule } from '../utils/loanCalculations';

export default function LoanSimplifier() {
  const [loanData, setLoanData] = useState({
    amount: 0,
    rate: 0,
    tenure: 0,
    startMonth: new Date().getMonth(),
    startYear: new Date().getFullYear(),
    prepayment: 0,
    paidEmis: 0
  });

  // Calculate results based on current inputs
  const results = useMemo(() => {
    const savings = calculateSavings(
      loanData.amount, 
      loanData.rate, 
      loanData.tenure, 
      loanData.prepayment
    );
    
    const schedule = generateSchedule(
      loanData.amount, 
      loanData.rate, 
      loanData.tenure, 
      loanData.prepayment,
      loanData.paidEmis
    );

    return { ...savings, schedule };
  }, [loanData]);

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
          Loan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Simplifier</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Calculate EMIs, visualize amortization, and see how much you save by prepaying.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <LoanInputForm loanData={loanData} setLoanData={setLoanData} />
          <LoanAISummary loanData={loanData} results={results} />
        </div>

        {/* Right Side: Results & Charts */}
        <div className="lg:col-span-8 space-y-8">
          <LoanSummaryCards results={results} amount={loanData.amount} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PrincipalInterestChart 
              principal={loanData.amount} 
              totalInterest={results.totalInterestWithPrepayment} 
            />
            <PrepaymentComparison 
              loanData={loanData}
              results={results}
            />
          </div>

          <AmortizationBarChart schedule={results.schedule} />
          
          <AmortizationTable 
            schedule={results.schedule} 
            startMonth={loanData.startMonth}
            startYear={loanData.startYear}
          />
        </div>
      </div>
    </div>
  );
}
