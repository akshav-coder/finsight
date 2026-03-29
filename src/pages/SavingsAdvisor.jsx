import { useState, useMemo, useEffect } from 'react';
import { Lightbulb, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import SavingsInputForm from '../components/SavingsAdvisor/SavingsInputForm';
import HealthScoreCircle from '../components/SavingsAdvisor/HealthScoreCircle';
import SavingsSummaryCards from '../components/SavingsAdvisor/SavingsSummaryCards';
import AllocationDonutChart from '../components/SavingsAdvisor/AllocationDonutChart';
import SpendingBenchmarkTable from '../components/SavingsAdvisor/SpendingBenchmarkTable';
import SavingsTipCards from '../components/SavingsAdvisor/SavingsTipCards';
import GrowthSimulator from '../components/SavingsAdvisor/GrowthSimulator';
import EmergencyFundTracker from '../components/SavingsAdvisor/EmergencyFundTracker';
import QuickWins from '../components/SavingsAdvisor/QuickWins';
import { calculateHealthScore, getAllocationData, calculatePotentialSavings } from '../utils/savingsAdvisorCalculations';

export default function SavingsAdvisor() {
  const { transactions, categories } = useData();
  const [useStatementData, setUseStatementData] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Initial State
  const [formData, setFormData] = useState({
    income: 0,
    rent: 0,
    loans: 0,
    insurance: 0,
    foodDelivery: 0,
    groceries: 0,
    transport: 0,
    shopping: 0,
    entertainment: 0,
    bills: 0,
    health: 0,
    savings: 0,
    investments: 0,
    emergencyFund: 0
  });

  // Auto-detect statement data
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setUseStatementData(true);
      // Map categories to our form fields
      const categorySum = {};
      categories.forEach(cat => {
        categorySum[cat.name.toLowerCase()] = Math.abs(cat.value);
      });

      setFormData(prev => ({
        ...prev,
        foodDelivery: categorySum['food & drinks'] || categorySum['food'] || 0,
        shopping: categorySum['shopping'] || 0,
        entertainment: categorySum['entertainment'] || 0,
        transport: categorySum['transport'] || 0,
        bills: categorySum['bills'] || 0,
        groceries: 0, // Usually hard to distinguish from food without more logic
      }));
    }
  }, [transactions, categories]);

  const results = useMemo(() => {
    const score = calculateHealthScore(formData);
    const allocation = getAllocationData(formData);
    const wastage = calculatePotentialSavings(formData);
    const totalExpenses = (formData.rent || 0) + (formData.loans || 0) + (formData.insurance || 0) + 
                          (formData.foodDelivery || 0) + (formData.groceries || 0) + 
                          (formData.transport || 0) + (formData.shopping || 0) + 
                          (formData.entertainment || 0) + (formData.bills || 0) + 
                          (formData.health || 0);
    const currentSavings = formData.savings || 0;
    const savingsRate = (currentSavings / formData.income) * 100;

    return { score, allocation, wastage, totalExpenses, currentSavings, savingsRate };
  }, [formData]);

  const handleManualAnalyze = () => {
    setShowDashboard(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            <Lightbulb className="w-8 h-8 mr-3 text-amber-500" />
            Savings Advisor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Optimize your spending and build your future wealth
          </p>
        </div>

        {useStatementData && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Using your uploaded statement data ✓</span>
          </div>
        )}
      </div>

      {!showDashboard && !useStatementData ? (
        <div className="max-w-4xl mx-auto py-8">
           <div className="glass-panel p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Tell us about your monthly finances</h2>
              <SavingsInputForm data={formData} setData={setFormData} onAnalyze={handleManualAnalyze} />
           </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <HealthScoreCircle score={results.score} />
            </div>
            <div className="lg:col-span-7">
               <SavingsSummaryCards results={results} formData={formData} />
            </div>
          </div>

          {/* Allocation & Benchmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AllocationDonutChart allocation={results.allocation} income={formData.income} />
            <SpendingBenchmarkTable formData={formData} />
          </div>

          {/* AI Tips Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personalized Savings Tips</h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg font-black tracking-widest uppercase">AI Generated</span>
            </div>
            <SavingsTipCards formData={formData} results={results} />
          </section>

          {/* Growth & Emergency Fund */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
              <GrowthSimulator results={results} />
            </div>
            <div className="xl:col-span-5">
              <EmergencyFundTracker formData={formData} results={results} />
            </div>
          </div>

          {/* Quick Wins */}
          <QuickWins />

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
            <Info className="w-5 h-5 text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Savings Advice is powered by the Gemini AI and based on standard Indian financial benchmarks. Always consult with a certified financial planner for major life decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
