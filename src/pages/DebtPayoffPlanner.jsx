import { useState, useMemo } from 'react';
import { Target, TrendingDown, Zap, PieChart, Table, Calendar, Info, Sparkles } from 'lucide-react';
import { 
  avalancheSchedule, 
  snowballSchedule, 
  minimumOnlySchedule, 
  getTotalInterestFromSchedule,
  formatINR
} from '../utils/debtCalculations';
import DebtInputSection from '../components/DebtPlanner/DebtInputSection';
import StrategyComparison from '../components/DebtPlanner/StrategyComparison';
import PayoffTimelineChart from '../components/DebtPlanner/PayoffTimelineChart';
import PayoffScheduleTable from '../components/DebtPlanner/PayoffScheduleTable';
import DebtProgressCards from '../components/DebtPlanner/DebtProgressCards';
import MotivationMilestone from '../components/DebtPlanner/MotivationMilestone';
import DebtAIRecommendation from '../components/DebtPlanner/DebtAIRecommendation';

export default function DebtPayoffPlanner() {
  // Pre-filled example debts
  const [debts, setDebts] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('avalanche');

  // Calculations
  const results = useMemo(() => {
    if (!debts || debts.length === 0) return {
      avalanche: [],
      snowball: [],
      minOnly: [],
      totalDebt: 0,
      totalMinPayment: 0,
      avalancheInterest: 0,
      snowballInterest: 0,
      minOnlyInterest: 0
    };

    const avalanche = avalancheSchedule(debts, extraPayment);
    const snowball = snowballSchedule(debts, extraPayment);
    const minOnly = minimumOnlySchedule(debts);

    return {
      avalanche,
      snowball,
      minOnly,
      totalDebt: debts.reduce((s, d) => s + Number(d.balance), 0),
      totalMinPayment: debts.reduce((s, d) => s + Number(d.minPayment), 0),
      avalancheInterest: getTotalInterestFromSchedule(avalanche),
      snowballInterest: getTotalInterestFromSchedule(snowball),
      minOnlyInterest: getTotalInterestFromSchedule(minOnly)
    };
  }, [debts, extraPayment]);

  if (!results) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            <Target className="w-8 h-8 mr-3 text-primary-600" />
            Debt Payoff Planner
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Compare strategies and fast-track your journey to debt freedom
          </p>
        </div>
        <div className="glass-panel px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Debt</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{formatINR(results.totalDebt)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-4 space-y-8">
          <DebtInputSection 
            debts={debts} 
            setDebts={setDebts} 
            extraPayment={extraPayment} 
            setExtraPayment={setExtraPayment} 
            totalMinPayment={results.totalMinPayment}
          />
          <DebtAIRecommendation debts={debts} extraPayment={extraPayment} results={results} />
        </div>

        {/* Right Side: Dashboard */}
        <div className="lg:col-span-8 space-y-8">
          <StrategyComparison 
            results={results} 
            selectedStrategy={selectedStrategy} 
            setSelectedStrategy={setSelectedStrategy} 
          />
          
          {results.totalDebt > 0 && (
            <>
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center mb-6">
                  <TrendingDown className="w-5 h-5 mr-2 text-primary-500" />
                  Payoff Timeline Comparison
                </h2>
                <PayoffTimelineChart results={results} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MotivationMilestone 
                  schedule={selectedStrategy === 'avalanche' ? results.avalanche : results.snowball} 
                  strategyName={selectedStrategy}
                />
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center px-1">
                      <Zap className="w-5 h-5 mr-2 text-amber-500" />
                      Debt Payoff Status
                    </h2>
                    <DebtProgressCards 
                      debts={debts} 
                      schedule={selectedStrategy === 'avalanche' ? results.avalanche : results.snowball} 
                      strategyName={selectedStrategy}
                    />
                </div>
              </div>

              <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
                    <Table className="w-5 h-5 mr-2 text-emerald-500" />
                    {selectedStrategy === 'avalanche' ? 'Avalanche' : 'Snowball'} Payoff Schedule
                  </h2>
                </div>
                <PayoffScheduleTable 
                  schedule={selectedStrategy === 'avalanche' ? results.avalanche : results.snowball} 
                  debts={debts}
                />
              </div>
            </>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
            <Info className="w-5 h-5 text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Strategy results are projections based on the mathematical models provided. Actual payoff dates may vary if interest rates or minimum payments change. Always prioritize high-interest debt for maximum savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
