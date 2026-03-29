import { useState } from 'react';
import { Bot, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getGeminiResponse, generateTaxAdvisorPrompt } from '../../utils/geminiApi';
import { formatINR, TAX_CONSTANTS } from '../../utils/taxCalculations';
import AIFeatureGate from '../AIFeatureGate';

export default function TaxAIAdvisor({ inputs, taxAnalysis }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInsight = async () => {
    setLoading(true);
    setError('');
    
    // Calculate total unused limits
    const healthLimit = TAX_CONSTANTS.section80D_self + (inputs.parentsAbove60 ? TAX_CONSTANTS.section80D_seniorParents : TAX_CONSTANTS.section80D_parents);
    const healthUsed = (inputs.healthInsuranceSelf || 0) + (inputs.healthInsuranceParents || 0);
    const healthRemaining = healthLimit - healthUsed;
    
    const total80C = (inputs.epf || 0) + (inputs.ppf || 0) + (inputs.elss || 0) + (inputs.lifeInsurance || 0) + (inputs.nsc || 0) + (inputs.fdTaxSaver || 0) + (inputs.tuitionFees || 0) + (inputs.homeLoanPrincipal || 0);
    const remaining80C = Math.max(0, TAX_CONSTANTS.section80C_limit - total80C);
    
    const npsRemaining = TAX_CONSTANTS.section80CCD_limit - (inputs.nps || 0);
    
    // Approx extra savings possible (using flat 30% for AI context simplicity)
    const extraSavingsPossible = (healthRemaining + remaining80C + npsRemaining) * 0.30;

    const dataContext = {
      annualIncome: formatINR(taxAnalysis.grossIncome),
      current80C: formatINR(total80C),
      limit80C: formatINR(TAX_CONSTANTS.section80C_limit),
      premium80D: formatINR(healthUsed),
      nps: formatINR(inputs.nps || 0),
      hraSituation: inputs.payingRent ? 'paying rent' : 'not paying rent',
      homeLoanInterest: formatINR(inputs.homeLoanInterest || 0),
      oldRegimeTax: formatINR(taxAnalysis.oldRegime.totalTax),
      newRegimeTax: formatINR(taxAnalysis.newRegime.totalTax),
      extraSavingsPossible: formatINR(extraSavingsPossible),
    };

    const prompt = generateTaxAdvisorPrompt(dataContext);

    try {
      const result = await getGeminiResponse(prompt);
      const cleanResult = result.replace(/```/g, '').replace(/\*\*/g, '').trim();
      setInsight(cleanResult);
    } catch (err) {
      console.error(err);
      setError('Could not generate CA insight. Check your API key or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIFeatureGate 
      featureName="Pocket CA Advisor"
      description="Get personalized tax optimization strategies. Our AI analyzes your deductions and investments to find legal ways to reduce your tax liability to zero."
    >
      <div className="relative group overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-6 rounded-[22px] border border-white/20 dark:border-slate-800/50 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5 shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                  Pocket CA (AI)
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Powered by Gemini</p>
              </div>
            </div>
            
            <button 
              onClick={generateInsight}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-500" />}
              <span>{insight ? 'Refresh Advice' : 'Get CA Advice'}</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl font-medium border border-rose-100 dark:border-rose-800/50">
              {error}
            </div>
          )}

          {insight && (
            <div className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-800/30 flex-1">
               <div className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                 {insight}
               </div>
            </div>
          )}
          
          {!insight && !loading && !error && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex-1 flex items-center justify-center">
              Click "Get CA Advice" to receive a personalized, 5-line tax strategy based on your unique inputs above.
            </div>
          )}
        </div>
      </div>
    </AIFeatureGate>
  );
}
