import { useState, useMemo, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { calculateComprehensiveTax, DEFAULT_FY } from '../utils/taxCalculations';
import TaxInputForm from '../components/TaxSaver/TaxInputForm';
import RegimeRecommendation from '../components/TaxSaver/RegimeRecommendation';
import TaxSummaryCards from '../components/TaxSaver/TaxSummaryCards';
import TaxBreakdownChart from '../components/TaxSaver/TaxBreakdownChart';
import Section80CBar from '../components/TaxSaver/Section80CBar';
import TaxOpportunitiesTable from '../components/TaxSaver/TaxOpportunitiesTable';
import ActionCards from '../components/TaxSaver/ActionCards';
import ActionPlanTimeline from '../components/TaxSaver/ActionPlanTimeline';
import DecisionHelper from '../components/TaxSaver/DecisionHelper';
import TaxAIAdvisor from '../components/TaxSaver/TaxAIAdvisor';

export default function TaxSaver() {
  const [fy, setFy] = useState(DEFAULT_FY);
  const [inputs, setInputs] = useState({
    employmentType: 'Salaried',
    ageGroup: 'below60',
    annualCTC: 0,
    basicSalary: 0,
    hraReceived: 0,
    specialAllowance: 0,
    otherIncome: 0,
    epf: 0,
    ppf: 0,
    elss: 0,
    lifeInsurance: 0,
    nsc: 0,
    fdTaxSaver: 0,
    tuitionFees: 0,
    homeLoanPrincipal: 0,
    healthInsuranceSelf: 0,
    healthInsuranceParents: 0,
    parentsAbove60: false,
    nps: 0,
    homeLoanInterest: 0,
    payingRent: false,
    monthlyRent: 0,
    metroCity: true,
  });

  const taxAnalysis = useMemo(() => {
    return calculateComprehensiveTax(inputs, fy);
  }, [inputs, fy]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            <Receipt className="w-8 h-8 mr-3 text-primary-600" />
            Tax Saver
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Compare regimes and optimize your investments like a CA.
          </p>
        </div>
      </div>
      
      <RegimeRecommendation taxAnalysis={taxAnalysis} />

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Inputs */}
        <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6">
          <TaxInputForm inputs={inputs} setInputs={setInputs} fy={fy} setFy={setFy} />
        </div>

        {/* Right Column: Dashboard & Advice */}
        <div className="flex-1 flex flex-col space-y-8 min-w-0">
           <TaxSummaryCards taxAnalysis={taxAnalysis} />
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaxBreakdownChart taxAnalysis={taxAnalysis} />
              <Section80CBar inputs={inputs} />
           </div>
           
           <TaxOpportunitiesTable inputs={inputs} taxAnalysis={taxAnalysis} />
           
           <ActionCards inputs={inputs} taxAnalysis={taxAnalysis} />
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
              <ActionPlanTimeline />
              <div className="space-y-6">
                 <DecisionHelper taxAnalysis={taxAnalysis} />
                 <TaxAIAdvisor inputs={inputs} taxAnalysis={taxAnalysis} />
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
