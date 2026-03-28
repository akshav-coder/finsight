import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatINR, TAX_CONSTANTS } from '../../utils/taxCalculations';

export default function TaxOpportunitiesTable({ inputs, taxAnalysis }) {
  if (!taxAnalysis) return null;
  const { oldRegime } = taxAnalysis;
  const { deductionsBreakdown } = oldRegime;

  const rows = [
    {
      section: 'Sec 80C (EPF, PPF, ELSS)',
      limit: TAX_CONSTANTS.section80C_limit,
      used: deductionsBreakdown.total80CInvested || 0,
    },
    {
      section: 'Sec 80D (Health Ins - Self)',
      limit: TAX_CONSTANTS.section80D_self,
      used: deductionsBreakdown.total80DSelfInvested || 0,
    },
    {
      section: 'Sec 80D (Health Ins - Parents)',
      limit: inputs.parentsAbove60 ? TAX_CONSTANTS.section80D_seniorParents : TAX_CONSTANTS.section80D_parents,
      used: deductionsBreakdown.total80DParentsInvested || 0,
    },
    {
      section: 'Sec 80CCD(1B) (NPS)',
      limit: TAX_CONSTANTS.section80CCD_limit,
      used: inputs.nps || 0,
    },
    {
      section: 'Sec 24B (Home Loan Interest)',
      limit: TAX_CONSTANTS.section24B_limit,
      used: inputs.homeLoanInterest || 0,
    },
    {
      section: 'HRA Exemption',
      limit: 'Calculated',
      used: deductionsBreakdown.hraExemption || 0,
      isVariableLimit: true,
      remaining: 'N/A' // HRA remaining doesn't make logical sense in a fixed cap way
    }
  ];

  let totalMissedDeductions = 0;

  const getStatus = (used, limit, isVariable) => {
    if (isVariable) return { text: 'Active', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
    if (used >= limit) return { text: 'Maxed', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (used === 0) return { text: 'Unused', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' };
    return { text: 'Partial', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Tax Saving Opportunities</h3>
      
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-slate-500">Section</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Limit</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Utilized</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Remaining Gap</th>
              <th className="py-3 pl-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {rows.map((row) => {
              const usedAmount = Math.min(row.used, row.isVariableLimit ? Infinity : row.limit);
              const remaining = row.isVariableLimit ? 0 : Math.max(0, row.limit - usedAmount);
              
              if (!row.isVariableLimit) totalMissedDeductions += remaining;
              const status = getStatus(row.used, row.limit, row.isVariableLimit);

              return (
                <tr key={row.section} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 pr-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{row.section}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                    {row.isVariableLimit ? row.limit : formatINR(row.limit)}
                  </td>
                  <td className="py-4 px-4 text-sm font-black text-slate-900 dark:text-white">
                    {formatINR(row.used)}
                  </td>
                  <td className={`py-4 px-4 text-sm font-black text-right ${remaining > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {row.isVariableLimit ? row.remaining : formatINR(remaining)}
                  </td>
                  <td className="py-4 pl-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalMissedDeductions > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">
              💰 Additional Deductions Available!
            </h4>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-500/80 mt-1 leading-relaxed max-w-2xl">
              You have <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{formatINR(totalMissedDeductions)}</strong> of unclaimed tax deductions across various sections. Utilizing these could save you up to <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(totalMissedDeductions * 0.3)}</strong> extra in taxes this year!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
