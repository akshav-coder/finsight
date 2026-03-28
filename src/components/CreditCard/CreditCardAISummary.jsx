import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getGeminiResponse } from '../../utils/geminiApi';
import { formatINR, totalInterest } from '../../utils/creditCardCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function CreditCardAISummary({ cardData, results }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAIInsight = async () => {
    setLoading(true);
    setError('');
    
    const { balance, rate, minPercent, plannedPayment } = cardData;
    const { minSchedule, plannedSchedule } = results;
    
    const minMonths = minSchedule.length;
    const minInterest = totalInterest(minSchedule);
    
    const plannedMonths = plannedSchedule.length;
    const plannedInterest = totalInterest(plannedSchedule);

    const prompt = `You are a friendly financial advisor in India.
    The user has a credit card balance of ${formatINR(balance)} at ${rate}% annual interest.
    Minimum payment is ${minPercent}% of balance.
    If they pay only minimum: takes ${minMonths} months, costs ${formatINR(minInterest)} in interest.
    If they pay ${formatINR(plannedPayment)}/month: takes ${plannedMonths} months, costs ${formatINR(plannedInterest)} in interest.
    Write 3-4 lines in simple friendly language explaining how dangerous minimum payments are and give one strong actionable advice.
    Use Indian number format (lakhs/crores). No markdown. No bold text. Just plain text. Be direct and urgent.`;

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
      featureName="AI Debt Strategist"
      description="Understand the hidden trap of minimum payments. Our AI creates a custom 'Escapade' plan to get you out of high-interest credit card debt 10x faster."
    >
      <div className="glass-panel p-6 rounded-3xl shadow-sm border border-rose-100 dark:border-rose-900/30 bg-rose-50/10 dark:bg-rose-900/5 transition-colors duration-200 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Sparkles className="w-5 h-5 text-rose-500 mr-2" />
            AI Debt Advisor
          </h3>
          <button 
            onClick={getAIInsight}
            disabled={loading}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90 disabled:opacity-50"
            title="Refresh Insight"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-rose-500" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {!insight && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get urgent advice on escaping your credit card debt trap.
            </p>
            <button 
              onClick={getAIInsight}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex items-center space-x-2 active:scale-95"
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
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic border-l-4 border-rose-200 dark:border-rose-800 pl-4 py-2">
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
