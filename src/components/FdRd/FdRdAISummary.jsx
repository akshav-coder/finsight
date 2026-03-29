import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getGeminiResponse } from '../../utils/geminiApi';
import { formatINR } from '../../utils/fdRdCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function FdRdAISummary({ type, data, results }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAIInsight = async () => {
    setLoading(true);
    setError('');
    
    const { rate, taxSlab } = data;
    const { maturity, grossInterest, taxImpact } = results;
    const tenure = type === 'FD' ? (data.years + data.months/12) : (data.months/12);
    const amount = type === 'FD' ? data.amount : data.monthlyAmount;

    const prompt = `You are a friendly Indian financial advisor.
    The user is investing ${type === 'FD' ? formatINR(amount) : formatINR(amount) + '/month'} as ${type} at ${rate}% for ${tenure.toFixed(1)} years.
    They will earn ${formatINR(grossInterest)} as gross interest, getting ${formatINR(maturity)} on maturity.
    After ${taxSlab}% tax slab, net interest is ${formatINR(taxImpact.netInterest)}.
    Current inflation in India is around 6%.
    Write 3-4 lines in simple friendly language:
    1. Is this a good investment?
    2. How does it compare to inflation?
    3. One suggestion to improve returns (like SFBs or index funds for long term).
    Use Indian number format (lakhs). No markdown. No bold text. Just plain text.`;

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
      featureName="AI Investment Advisor"
      description="Compare your fixed-income returns against inflation and get suggestions on alternative high-yield instruments tailored to your tax slab."
    >
      <div className="glass-panel p-6 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-900/5 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Sparkles className="w-5 h-5 text-emerald-500 mr-2" />
            AI Investment Advisor
          </h3>
          <button 
            onClick={getAIInsight}
            disabled={loading}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90 disabled:opacity-50"
            title="Refresh Insight"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {!insight && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium uppercase tracking-tighter">
              Get personalized advice on your {type} returns.
            </p>
            <button 
              onClick={getAIInsight}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 active:scale-95"
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
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic border-l-4 border-emerald-200 dark:border-emerald-800 pl-4 py-2">
              "{insight}"
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 mt-2 font-bold">
            {error}
          </p>
        )}
      </div>
    </AIFeatureGate>
  );
}
