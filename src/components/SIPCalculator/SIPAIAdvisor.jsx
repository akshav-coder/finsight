import { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import { getGeminiResponse, generateSIPAdvisorPrompt } from '../../utils/geminiApi';
import AIFeatureGate from '../AIFeatureGate';

export default function SIPAIAdvisor({ sipData, type = "basic" }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState(null);

  const handleGetInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateSIPAdvisorPrompt(sipData);
      const response = await getGeminiResponse(prompt);
      setInsight(response);
    } catch (err) {
      setError(err.message || 'Failed to generate insight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIFeatureGate 
      featureName="Pocket Wealth Coach"
      description="Get personalized insights on your SIP strategy, market alignment, and wealth-building tips tailored to your goal timeline."
    >
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Bot className="w-24 h-24 text-indigo-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Pocket Wealth Coach
            </h3>
          </div>

          {!insight && !loading && !error && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get personalized feedback on your {type === 'basic' ? 'SIP plan' : 'Goal strategy'} based on current market realities.
              </p>
              <button
                onClick={handleGetInsight}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center shadow-sm shadow-indigo-600/20"
              >
                Analyze My Plan
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium animate-pulse">Consulting the markets...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">
              {error}
            </div>
          )}

          {insight && !loading && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white/20 dark:border-slate-800/50 backdrop-blur-sm">
                <p className="whitespace-pre-line">{insight}</p>
              </div>
              <button
                onClick={handleGetInsight}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Regenerate Advice
              </button>
            </div>
          )}
        </div>
      </div>
    </AIFeatureGate>
  );
}
