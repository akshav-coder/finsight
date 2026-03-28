import { CalendarCheck, CalendarDays, Hourglass } from 'lucide-react';

export default function ActionPlanTimeline() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Tax Saving Action Plan</h3>
      
      <div className="relative pl-6 space-y-8 border-l border-slate-200 dark:border-slate-800 ml-4">
        
        {/* Step 1 */}
        <div className="relative">
          <div className="absolute -left-[37px] top-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full border-4 border-white dark:border-slate-950">
            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Step 1: Do This Today</h4>
            <p className="text-xs font-bold text-slate-500 mb-2">Free, takes 10 mins</p>
            <ul className="space-y-2">
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Activate NPS account via eNPS website</span>
               </li>
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Submit rent receipts to HR department</span>
               </li>
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Declare investments in IT declaration form</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="absolute -left-[37px] top-0.5 p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full border-4 border-white dark:border-slate-950">
            <CalendarDays className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Step 2: Do This This Week</h4>
            <p className="text-xs font-bold text-slate-500 mb-2">Setup automated investments</p>
            <ul className="space-y-2">
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Start ELSS SIP or open a PPF account online</span>
               </li>
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Buy family health insurance plan (80D)</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="absolute -left-[37px] top-0.5 p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-full border-4 border-white dark:border-slate-950">
            <Hourglass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Step 3: Before March 31st</h4>
            <p className="text-xs font-bold text-slate-500 mb-2">Final deadline for FY 25-26</p>
            <ul className="space-y-2">
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Max out remaining 80C limit to ₹1,50,000</span>
               </li>
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>File Form 12BB with employer</span>
               </li>
               <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <span className="text-slate-400 mt-0.5">☐</span>
                  <span>Collect and scan all investment proofs</span>
               </li>
            </ul>
          </div>
        </div>

      </div>

      <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-center">
        <p className="text-xs font-black text-rose-600 dark:text-rose-500 uppercase tracking-widest mb-1">⚠️ Deadline Approaching</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Invest now to claim deductions. Wait until March and you'll run out of time to open accounts!</p>
      </div>

    </div>
  );
}
