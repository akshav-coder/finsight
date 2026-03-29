import { useState } from 'react';
import { Sparkles, BrainCircuit, AlertCircle, Loader2 } from 'lucide-react';
import { getGeminiResponse } from '../../utils/geminiApi';
import { formatINR, formatMonths } from '../../utils/debtCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function DebtAIRecommendation({ debts, extraPayment, results }) {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAIAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const debtListStr = debts.map(d => 
        `- ${d.name}: Balance ${formatINR(d.balance)}, Rate ${d.rate}%, Min ${formatINR(d.minPayment)}`
      ).join('\n');

      const prompt = `You are a debt counselor for Indians.
The user has these debts:
${debtListStr}

Total debt: ${formatINR(results.totalDebt)}
Extra payment available: ${formatINR(extraPayment)}/month

Avalanche method: debt free in ${formatMonths(results.avalanche.length)}, saves ${formatINR(results.snowballInterest - results.avalancheInterest)} more than snowball.
Snowball method: debt free in ${formatMonths(results.snowball.length)}.

Based on:
1. The interest rates (high rate = urgent)
2. The balance sizes
3. The savings difference between methods

Give a 3-4 line recommendation:
- Which strategy to follow and why
- Which specific debt to attack first
- One motivational insight about being debt free

Use Indian number format. No markdown. Be direct.`;

      const response = await getGeminiResponse(prompt);
      setRecommendation(response.replace(/\*\*/g, '')); // Remove bold for consistency
    } catch (err) {
      console.error('Gemini Error:', err);
      setError('Could not get AI recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIFeatureGate 
      featureName="Smart Debt Consultant"
      description="Get personalized advice on which debt to attack first and which strategy (Snowball vs. Avalanche) fits your psychology and math perfectly."
    >
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-900/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center uppercase tracking-tight">
            <BrainCircuit className="w-5 h-5 mr-2 text-indigo-500" />
            AI Recommendation
          </h2>
          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg font-black tracking-widest uppercase">Beta</span>
        </div>

        {!recommendation && !loading && (
          <button 
            onClick={getAIAdvice}
            className="w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-500 hover:text-indigo-600 hover:border-indigo-500 transition-all font-bold text-sm bg-white dark:bg-slate-900"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Personalized AI Advice
          </button>
        )}

        {loading && (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing Strategies...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        {recommendation && (
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm animate-in zoom-in-95 duration-300">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{recommendation}"
            </p>
            <div className="mt-4 flex justify-end">
               <button 
                 onClick={getAIAdvice}
                 className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest"
               >
                 Regenerate
               </button>
            </div>
          </div>
        )}
      </div>
    </AIFeatureGate>
  );
}
