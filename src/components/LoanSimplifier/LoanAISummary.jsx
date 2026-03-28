import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getGeminiResponse } from '../../utils/geminiApi';
import { formatCurrency } from '../../utils/loanCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function LoanAISummary({ loanData, results }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAIInsight = async () => {
    setLoading(true);
    setError('');
    
    const { amount, rate, tenure, prepayment } = loanData;
    const { totalInterestWithPrepayment, monthsSaved, interestSaved } = results;
    const emi = results.schedule[0]?.emi || 0;

    const prompt = `You are a friendly financial advisor. Given this loan:
Principal: ${formatCurrency(amount)}, Interest: ${rate}%, Tenure: ${tenure} years, EMI: ${formatCurrency(emi)}.
Total interest payable: ${formatCurrency(totalInterestWithPrepayment)}. 
${prepayment > 0 ? `With ${formatCurrency(prepayment)} extra/month, saves ${formatCurrency(interestSaved)} and ${monthsSaved} months.` : ''}
Write a 3-4 line simple, friendly summary in plain English explaining what this loan truly costs and one key advice. 
Use Indian number format (lakhs/crores). No markdown. No bold text. Just plain text.`;

    try {
      const response = await getGeminiResponse(prompt);
      setInsight(response.trim());
    } catch (err) {
      console.error("AI Insight Error:", err);
      setError("Failed to get AI insight. Please check your internet or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIFeatureGate 
      featureName="AI Loan Strategy"
      description="Deep dive into the true cost of your debt. Our AI analyzes your prepayment potential to maximize savings and cut your tenure in half."
    >
      <div className="glass-panel p-6 rounded-3xl shadow-sm border border-primary-100 dark:border-primary-900/30 bg-primary-50/10 dark:bg-primary-900/5 transition-colors duration-200 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Sparkles className="w-5 h-5 text-primary-500 mr-2" />
            AI Loan Insight
          </h3>
          <button 
            onClick={getAIInsight}
            disabled={loading}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90 disabled:opacity-50"
            title="Refresh Insight"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary-500" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {!insight && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get personalized advice on your loan from our AI advisor.
            </p>
            <button 
              onClick={getAIInsight}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex items-center space-x-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI Insight</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-3 py-4">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full animate-pulse"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6 animate-pulse"></div>
          </div>
        )}

        {insight && !loading && (
          <div className="relative">
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
              "{insight}"
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 mt-2">
            {error}
          </p>
        )}
      </div>
    </AIFeatureGate>
  );
}
