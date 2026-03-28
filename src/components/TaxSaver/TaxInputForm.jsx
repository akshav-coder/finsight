import { 
  Briefcase, 
  Building, 
  Wallet, 
  PiggyBank, 
  HeartPulse, 
  Home, 
  FileText,
  User,
  Calendar,
  IndianRupee,
  Shield,
  GraduationCap
} from 'lucide-react';
import { FINANCIAL_YEARS } from '../../utils/taxCalculations';

export default function TaxInputForm({ inputs, setInputs, fy, setFy }) {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  return (
    <div className="space-y-6">

      {/* 0. Financial Year Selector */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-primary-50/50 to-indigo-50/50 dark:from-primary-900/10 dark:to-indigo-900/10">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-primary-500" />
          <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Financial Year</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FINANCIAL_YEARS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFy(id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                fy === id
                  ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {fy === '2025-26' && (
          <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mt-3 leading-relaxed">
            ✦ Finance Act 2025 — New Regime: Revised slabs + ₹60,000 rebate u/s 87A makes income up to ₹12L effectively tax-free.
          </p>
        )}
        {fy === '2023-24' && (
          <p className="text-[10px] font-bold text-slate-400 mt-3">
            Standard deduction not available under new regime for this FY.
          </p>
        )}
      </div>

      {/* 1. Income Details */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary-500" />
          Income Details
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Employment Type</label>
              <select 
                name="employmentType"
                value={inputs.employmentType}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self Employed">Self Employed / Freelancer</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1">
               <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Annual CTC (₹)</label>
               <input 
                 type="number" name="annualCTC" value={inputs.annualCTC || ''} onChange={handleChange} placeholder="e.g. 1200000"
                 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2 sm:col-span-1 space-y-1">
               <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Basic Salary (₹/mo)</label>
               <input 
                 type="number" name="basicSalary" value={inputs.basicSalary || ''} onChange={handleChange} placeholder="Often 40-50% of CTC"
                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
               />
               <p className="text-[10px] text-slate-400">Needed for HRA calc</p>
             </div>
             <div className="col-span-2 sm:col-span-1 space-y-1">
               <label className="text-xs font-bold uppercase tracking-wider text-slate-500">HRA Received (₹/mo)</label>
               <input 
                 type="number" name="hraReceived" value={inputs.hraReceived || ''} onChange={handleChange} placeholder="0"
                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Other Income (₹/yr)</label>
            <input 
              type="number" name="otherIncome" value={inputs.otherIncome || ''} onChange={handleChange} placeholder="FD Interest, Rent received etc."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. 80C Investments */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center">
          <PiggyBank className="w-5 h-5 mr-2 text-emerald-500" />
          Section 80C Investments
        </h2>
        <p className="text-xs text-slate-500 mb-6">Max limit ₹1,50,000/year applies across all these combined.</p>
        
        <div className="grid grid-cols-2 gap-4">
           {/* Auto-calculate EPF hint */}
           <div className="col-span-2 sm:col-span-1 space-y-1 relative">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">EPF (₹/yr)</label>
             <input type="number" name="epf" value={inputs.epf || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">PPF (₹/yr)</label>
             <input type="number" name="ppf" value={inputs.ppf || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ELSS Mutual Funds (₹/yr)</label>
             <input type="number" name="elss" value={inputs.elss || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Life Ins Premium (₹/yr)</label>
             <input type="number" name="lifeInsurance" value={inputs.lifeInsurance || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">5-Yr Tax Saver FD (₹/yr)</label>
             <input type="number" name="fdTaxSaver" value={inputs.fdTaxSaver || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center"><GraduationCap className="w-3 h-3 mr-1"/> Tuition Fees (₹/yr)</label>
             <input type="number" name="tuitionFees" value={inputs.tuitionFees || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Home Loan Principal (₹/yr)</label>
             <input type="number" name="homeLoanPrincipal" value={inputs.homeLoanPrincipal || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
           </div>
        </div>
      </div>

      {/* 3. Other Deductions */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Other Deductions
        </h2>

        <div className="space-y-6">
          {/* 80D */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
             <div className="flex items-center space-x-2 mb-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Health Insurance (80D)</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Self + Family (₹/yr)</label>
                  <input type="number" name="healthInsuranceSelf" value={inputs.healthInsuranceSelf || ''} onChange={handleChange} placeholder="Max ₹25k" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Parents (₹/yr)</label>
                  <input type="number" name="healthInsuranceParents" value={inputs.healthInsuranceParents || ''} onChange={handleChange} placeholder="Max ₹25k/50k" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
                </div>
             </div>
             <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" name="parentsAbove60" id="parentsAbove60" checked={inputs.parentsAbove60} onChange={handleChange} className="rounded text-primary-500 focus:ring-primary-500 bg-white border-slate-300" />
                <label htmlFor="parentsAbove60" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">Are any parents above 60? (Increases limit to ₹50k)</label>
             </div>
          </div>

          {/* NPS & Home Loan */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2 sm:col-span-1 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-indigo-500" /> NPS 80CCD(1B)
                </h3>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Own Contribution (₹/yr)</label>
                <input type="number" name="nps" value={inputs.nps || ''} onChange={handleChange} placeholder="Max ₹50k" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
             </div>
             
             <div className="col-span-2 sm:col-span-1 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <Home className="w-4 h-4 mr-2 text-amber-500" /> Home Loan (24B)
                </h3>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interest Paid (₹/yr)</label>
                <input type="number" name="homeLoanInterest" value={inputs.homeLoanInterest || ''} onChange={handleChange} placeholder="Max ₹2L" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
             </div>
          </div>

          {/* HRA */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <Building className="w-4 h-4 text-purple-500" />
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white">House Rent Allowance (HRA)</h3>
                </div>
                <div className="flex items-center space-x-2">
                   <span className="text-xs font-bold text-slate-500">Paying Rent?</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" name="payingRent" checked={inputs.payingRent} onChange={handleChange} className="sr-only peer" />
                     <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                   </label>
                </div>
             </div>
             
             {inputs.payingRent && (
               <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700/50 hidden-animate-in slide-in-from-top-2">
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Rent (₹)</label>
                    <input type="number" name="monthlyRent" value={inputs.monthlyRent || ''} onChange={handleChange} placeholder="0" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</label>
                    <select name="metroCity" value={inputs.metroCity} onChange={(e) => setInputs(p => ({...p, metroCity: e.target.value === 'true'}))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none">
                       <option value={true}>Metro (50% Basic)</option>
                       <option value={false}>Non-Metro (40% Basic)</option>
                    </select>
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* 4. Other Details */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-slate-500" />
          Demographics (affects basic exemption)
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Age Group</label>
             <select name="ageGroup" value={inputs.ageGroup} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none">
                <option value="below60">Below 60 Years</option>
                <option value="60-80">60-80 Years (Senior Citizen)</option>
                <option value="above80">Above 80 Years (Super Senior)</option>
             </select>
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Financial Year</label>
             <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-xl px-3 py-2 text-sm font-bold cursor-not-allowed">
               FY 2025-26 (AY 2026-27)
             </div>
           </div>
        </div>
      </div>

    </div>
  );
}
