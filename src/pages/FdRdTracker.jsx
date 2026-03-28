import { useState, useMemo } from 'react';
import { PiggyBank, TrendingUp, Info } from 'lucide-react';
import FdInputForm from '../components/FdRd/FdInputForm';
import RdInputForm from '../components/FdRd/RdInputForm';
import FdSummaryCards from '../components/FdRd/FdSummaryCards';
import RdSummaryCards from '../components/FdRd/RdSummaryCards';
import FdGrowthChart from '../components/FdRd/FdGrowthChart';
import RdGrowthChart from '../components/FdRd/RdGrowthChart';
import BankComparisonTable from '../components/FdRd/BankComparisonTable';
import TaxImpactCard from '../components/FdRd/TaxImpactCard';
import FdRdAISummary from '../components/FdRd/FdRdAISummary';
import NonCumulativeBreakdown from '../components/FdRd/NonCumulativeBreakdown';
import { 
  calculateFDCumulative,
  calculateFDNonCumulative,
  calculateRDMaturity, 
  calculatePostTaxReturns, 
  generateFDSchedule,
  generateRDSchedule,
  totalYearsFromPeriod
} from '../utils/fdRdCalculations';

export default function FdRdTracker() {
  const [activeTab, setActiveTab] = useState('FD');
  
  // FD State
  const [fdData, setFdData] = useState({
    amount: 100000,
    rate: 7.10,
    years: 1,
    months: 0,
    days: 0,
    compounding: 4,
    payoutType: 'Cumulative',
    payoutFrequency: 'Monthly',
    taxSlab: 20
  });

  // RD State
  const [rdData, setRdData] = useState({
    monthlyAmount: 5000,
    rate: 6.50,
    months: 12,
    days: 0,
    taxSlab: 20
  });

  // Derived FD Results
  const fdResults = useMemo(() => {
    const totalYears = totalYearsFromPeriod(fdData.years, fdData.months, fdData.days);
    const isCumulative = fdData.payoutType === 'Cumulative';

    let maturityAmount, grossInterest, nonCumulativeData = null;

    if (isCumulative) {
      const r = calculateFDCumulative(fdData.amount, fdData.rate, totalYears, fdData.compounding);
      maturityAmount = r.maturityAmount;
      grossInterest = r.totalInterest;
    } else {
      const r = calculateFDNonCumulative(fdData.amount, fdData.rate, totalYears, fdData.payoutFrequency);
      maturityAmount = fdData.amount; // principal returned at maturity
      grossInterest = r.totalInterest;
      nonCumulativeData = r;
    }
    
    const annualInterest = totalYears > 0 ? grossInterest / totalYears : grossInterest;
    const taxImpact = calculatePostTaxReturns(grossInterest, fdData.taxSlab, annualInterest);
    const schedule = generateFDSchedule(fdData.amount, fdData.rate, totalYears, fdData.compounding);

    return { maturityAmount, grossInterest, taxImpact, schedule, totalYears, nonCumulativeData, isCumulative };
  }, [fdData]);

  // Derived RD Results
  const rdResults = useMemo(() => {
    const totalYears = totalYearsFromPeriod(0, rdData.months, rdData.days || 0);
    const maturity = calculateRDMaturity(rdData.monthlyAmount, rdData.rate, rdData.months);
    const totalInvested = rdData.monthlyAmount * rdData.months;
    const grossInterest = maturity - totalInvested;
    const annualInterest = totalYears > 0 ? (grossInterest / totalYears) : grossInterest;
    const taxImpact = calculatePostTaxReturns(grossInterest, rdData.taxSlab, annualInterest);
    const schedule = generateRDSchedule(rdData.monthlyAmount, rdData.rate, rdData.months);

    return { maturityAmount: maturity, totalInvested, grossInterest, taxImpact, schedule, totalYears };
  }, [rdData]);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            <PiggyBank className="w-8 h-8 mr-3 text-emerald-500" />
            FD / RD Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Grow your savings with smart deposit planning
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
          {['FD', 'RD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'FD' ? 'Fixed Deposit' : 'Recurring Deposit'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-6 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5 font-bold" />
              <h2 className="text-sm font-black uppercase tracking-widest">Investment Details</h2>
            </div>
            {activeTab === 'FD' ? (
              <FdInputForm data={fdData} setData={setFdData} />
            ) : (
              <RdInputForm data={rdData} setData={setRdData} />
            )}
          </div>
          
          <FdRdAISummary 
            type={activeTab} 
            data={activeTab === 'FD' ? fdData : rdData} 
            results={activeTab === 'FD' ? fdResults : rdResults} 
          />
        </div>

        {/* Right Column: Visuals & Analysis */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'FD' ? (
            <>
              <FdSummaryCards results={fdResults} data={fdData} />
              
              {/* Non-Cumulative Breakdown Panel */}
              {!fdResults.isCumulative && fdResults.nonCumulativeData && (
                <NonCumulativeBreakdown 
                  data={fdData}
                  nonCumulativeData={fdResults.nonCumulativeData}
                  taxImpact={fdResults.taxImpact}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FdGrowthChart schedule={fdResults.schedule} />
                <TaxImpactCard taxImpact={fdResults.taxImpact} />
              </div>
            </>
          ) : (
            <>
              <RdSummaryCards results={rdResults} data={rdData} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RdGrowthChart schedule={rdResults.schedule} />
                <TaxImpactCard taxImpact={rdResults.taxImpact} />
              </div>
            </>
          )}

          <BankComparisonTable 
            type={activeTab} 
            userRate={activeTab === 'FD' ? fdData.rate : rdData.rate} 
            tenure={activeTab === 'FD' ? fdResults.totalYears : (rdData.months/12)}
            amount={activeTab === 'FD' ? fdData.amount : rdData.monthlyAmount * rdData.months}
          />
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
        <Info className="w-5 h-5 text-slate-400 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Disclaimer: Rates are indicative and change frequently. Cumulative FD uses compound interest (quarterly compounding). Non-Cumulative FD uses simple interest paid at chosen frequency. RD uses quarterly compounding as per Indian bank standard.
        </p>
      </div>
    </div>
  );
}
