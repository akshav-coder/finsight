import { formatINR, TAX_CONSTANTS } from '../../utils/taxCalculations';
import { Shield, HeartPulse, Building, TrendingUp } from 'lucide-react';

export default function ActionCards({ inputs, taxAnalysis }) {
  if (!taxAnalysis || !inputs) return null;

  const cards = [];

  // Card 1: NPS
  const npsRemaining = TAX_CONSTANTS.section80CCD_limit - (inputs.nps || 0);
  if (npsRemaining > 0) {
    cards.push(
      <div key="nps" className="bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
        <Shield className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-indigo-950 dark:text-indigo-100 tracking-tight leading-tight">
            Invest in NPS<br/><span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold">Section 80CCD(1B)</span>
          </h3>
        </div>
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-medium text-indigo-800/80 dark:text-indigo-300">
            Additional <strong className="text-indigo-600 dark:text-indigo-400">{formatINR(npsRemaining)}</strong> deduction available over and above the regular 80C limit!
          </p>
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50">
             <div className="flex justify-between items-center text-xs mb-1">
               <span className="font-bold text-slate-500">Tax saved roughly:</span>
               <span className="font-black text-emerald-600 dark:text-emerald-400">{formatINR(npsRemaining * 0.3)}/yr</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="font-bold text-slate-500">Amount required:</span>
               <span className="font-black text-slate-900 dark:text-white">{formatINR(npsRemaining / 12)}/month</span>
             </div>
          </div>
          <p className="text-[10px] uppercase font-black text-indigo-400 flex items-center pt-2">
            ↳ Bonus: Builds retirement corpus
          </p>
        </div>
      </div>
    );
  }

  // Card 2: Health Insurance
  const healthUsed = (inputs.healthInsuranceSelf || 0) + (inputs.healthInsuranceParents || 0);
  const healthLimit = TAX_CONSTANTS.section80D_self + (inputs.parentsAbove60 ? TAX_CONSTANTS.section80D_seniorParents : TAX_CONSTANTS.section80D_parents);
  const healthRemaining = healthLimit - healthUsed;

  if (healthRemaining > 0) {
    cards.push(
      <div key="health" className="bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-800/50 rounded-3xl p-6 relative overflow-hidden group hover:border-rose-300 dark:hover:border-rose-700 transition-colors">
        <HeartPulse className="absolute -bottom-6 -right-6 w-32 h-32 text-rose-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-rose-950 dark:text-rose-100 tracking-tight leading-tight">
            Get Health Cover<br/><span className="text-[10px] text-rose-500 uppercase tracking-widest font-bold">Section 80D</span>
          </h3>
        </div>
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-medium text-rose-800/80 dark:text-rose-300">
            You have <strong className="text-rose-600 dark:text-rose-400">{formatINR(healthRemaining)}</strong> limit unused. Buying a family floater protects wealth and saves tax.
          </p>
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 border border-rose-100 dark:border-rose-800/50">
             <div className="flex justify-between items-center text-xs mb-1">
               <span className="font-bold text-slate-500">Tax saved roughly:</span>
               <span className="font-black text-emerald-600 dark:text-emerald-400">{formatINR(healthRemaining * 0.3)}/yr</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="font-bold text-slate-500">Cover size:</span>
               <span className="font-black text-slate-900 dark:text-white">Up to ₹10L+</span>
             </div>
          </div>
          <p className="text-[10px] uppercase font-black text-rose-400 flex items-center pt-2">
            ↳ Net benefit: Insurance + Savings
          </p>
        </div>
      </div>
    );
  }

  // Card 3: ELSS
  const total80C = (inputs.epf || 0) + (inputs.ppf || 0) + (inputs.elss || 0) + (inputs.lifeInsurance || 0) + (inputs.nsc || 0) + (inputs.fdTaxSaver || 0) + (inputs.tuitionFees || 0) + (inputs.homeLoanPrincipal || 0);
  const remaining80C = Math.max(0, TAX_CONSTANTS.section80C_limit - total80C);

  if (remaining80C > 0) {
    cards.push(
      <div key="elss" className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800/50 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
        <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-amber-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-amber-950 dark:text-amber-100 tracking-tight leading-tight">
            Start ELSS SIP<br/><span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Section 80C</span>
          </h3>
        </div>
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-medium text-amber-800/80 dark:text-amber-300">
            Remaining 80C limit: <strong className="text-amber-600 dark:text-amber-400">{formatINR(remaining80C)}</strong>. ELSS has the shortest lock-in (3y) among tax savers.
          </p>
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 border border-amber-100 dark:border-amber-800/50">
             <div className="flex justify-between items-center text-xs mb-1">
               <span className="font-bold text-slate-500">Tax saved roughly:</span>
               <span className="font-black text-emerald-600 dark:text-emerald-400">{formatINR(remaining80C * 0.3)}/yr</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="font-bold text-slate-500">SIP required:</span>
               <span className="font-black text-slate-900 dark:text-white">{formatINR(remaining80C / 12)}/month</span>
             </div>
          </div>
          <p className="text-[10px] uppercase font-black text-amber-400 flex items-center pt-2">
            ↳ Highest historic returns in 80C
          </p>
        </div>
      </div>
    );
  }

  // Card 4: HRA
  if (inputs.payingRent && !taxAnalysis.oldRegime.deductionsBreakdown.hraExemption) {
    cards.push(
      <div key="hra" className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
        <Building className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-emerald-950 dark:text-emerald-100 tracking-tight leading-tight">
            Claim HRA Exemption<br/><span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Section 10(13A)</span>
          </h3>
        </div>
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300">
            You are paying rent but your HRA exemption is 0. Ensure you have submitted rent receipts to your employer.
          </p>
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/50">
             <div className="flex justify-between items-center text-xs mb-1">
               <span className="font-bold text-slate-500">Rent Paid:</span>
               <span className="font-black text-slate-900 dark:text-white">{formatINR(inputs.monthlyRent)}/mo</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="font-bold text-slate-500">Requirement:</span>
               <span className="font-black text-slate-900 dark:text-white text-[10px]">Landlord PAN if {'>'} 1L/yr</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="pt-6">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Personalized Action Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards}
      </div>
    </div>
  );
}
