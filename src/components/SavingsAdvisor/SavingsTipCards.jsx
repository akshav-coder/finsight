import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getGeminiResponse } from '../../utils/geminiApi';
import { formatINR } from '../../utils/savingsAdvisorCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function SavingsTipCards({ formData, results }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAITips = async () => {
    setLoading(true);
    setError('');
    
    const prompt = `You are a personal finance advisor for young Indians.
    Analyze this person's monthly spending and give 5-6 personalized savings tips.
    
    Income: ₹${formData.income}
    Spending:
    - Food Delivery: ₹${formData.foodDelivery}
    - Groceries: ₹${formData.groceries}
    - Transport: ₹${formData.transport}
    - Shopping: ₹${formData.shopping}
    - Entertainment: ₹${formData.entertainment}
    - Bills: ₹${formData.bills}
    - Rent/EMI: ₹${formData.rent}
    - Loans: ₹${formData.loans}
    Current Savings: ₹${results.currentSavings} (${results.savingsRate.toFixed(1)}%)
    Emergency Fund: ₹${formData.emergencyFund}
    
    Return ONLY a valid JSON array. No markdown. No explanation.
    Each tip MUST follow this structure:
    {
      "title": "Short catchy title",
      "current": "Briefly state current spending issue",
      "action": "Specific actionable step",
      "saving": 2000,
      "difficulty": "Easy" | "Medium" | "Hard",
      "impact": "high" | "medium" | "low",
      "category": "Food" | "Shopping" | "Lifestyle" | "Finance"
    }`;

  try {
      const response = await getGeminiResponse(prompt);
      // Clean potential markdown if Gemini ignores "No markdown"
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const parsedTips = JSON.parse(cleanJson);
      setTips(parsedTips);
    } catch (err) {
      console.error("AI Tips Error:", err);
      setError("Failed to get AI tips. Gemini might be busy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAIEnabled = import.meta.env.VITE_ENABLE_AI === 'true';
    if (isAIEnabled) {
      getAITips();
    }
  }, []);

  return (
    <AIFeatureGate 
      featureName="Smart Savings Advisor"
      description="Let our AI scan your spending habits across categories to find hidden leaks and suggest actionable swaps that could save you thousands each month."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-panel h-48 rounded-3xl animate-pulse bg-slate-100 dark:bg-slate-800/50"></div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 rounded-3xl">
            <p className="text-rose-500 font-bold mb-4">{error}</p>
            <button onClick={getAITips} className="px-6 py-2 bg-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-widest">Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <div 
                key={i} 
                className={`glass-panel p-6 rounded-3xl shadow-sm border-l-4 border font-bold transition-all hover:scale-[1.02] flex flex-col justify-between ${
                  tip.impact === 'high' ? 'border-l-rose-500 border-slate-200 dark:border-slate-800' :
                  tip.impact === 'medium' ? 'border-l-amber-500 border-slate-200 dark:border-slate-800' :
                  'border-l-emerald-500 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">{tip.title}</h4>
                    <span className="text-lg opacity-80" role="img">{tip.category === 'Food' ? '🍱' : tip.category === 'Shopping' ? '🛍️' : '💡'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">{tip.current}</p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                      <span className="font-black mr-1">Action:</span>
                      {tip.action}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      tip.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                      tip.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {tip.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                     <span className="text-xs font-black mr-1">Save {formatINR(tip.saving)}</span>
                     <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Refresh Button Tile */}
            <button 
              onClick={getAITips}
              className="glass-panel p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all space-y-3"
            >
              <RefreshCw className="w-8 h-8" />
              <span className="text-xs font-black uppercase tracking-widest">Refresh AI Tips</span>
            </button>
          </div>
        )}
      </div>
    </AIFeatureGate>
  );
}
