import { useState } from 'react';
import { 
  CreditCard, 
  User, 
  Home, 
  Car, 
  GraduationCap, 
  ShoppingBag, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3,
  IndianRupee,
  ChevronDown,
  Zap,
  Info
} from 'lucide-react';
import { formatINR } from '../../utils/debtCalculations';

const DEBT_TYPES = [
  { value: 'Credit Card', icon: CreditCard },
  { value: 'Personal Loan', icon: User },
  { value: 'Home Loan', icon: Home },
  { value: 'Car Loan', icon: Car },
  { value: 'Education Loan', icon: GraduationCap },
  { value: 'Buy Now Pay Later', icon: ShoppingBag },
  { value: 'Other', icon: HelpCircle }
];

export default function DebtInputSection({ debts, setDebts, extraPayment, setExtraPayment, totalMinPayment }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    type: 'Credit Card',
    balance: '',
    rate: '',
    minPayment: ''
  });

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.rate || !newDebt.minPayment) return;
    
    setDebts([...debts, { 
      ...newDebt, 
      id: Date.now().toString(),
      balance: Number(newDebt.balance),
      rate: Number(newDebt.rate),
      minPayment: Number(newDebt.minPayment)
    }]);
    
    setNewDebt({
      name: '',
      type: 'Credit Card',
      balance: '',
      rate: '',
      minPayment: ''
    });
    setIsAdding(false);
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const getIcon = (type) => {
    const found = DEBT_TYPES.find(t => t.value === type);
    const Icon = found ? found.icon : HelpCircle;
    return <Icon className="w-4 h-4" />;
  };

  if (!debts) return null;

  return (
    <div className="space-y-6">
      {/* Header & List */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Add All Your Debts</h2>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {debts.map((debt) => (
            <div key={debt.id} className="group relative flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 transition-all">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-colors`}>
                  {getIcon(debt.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{debt.name}</h3>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {formatINR(debt.balance)} • {debt.rate}% APR
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right mr-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Min Payment</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{formatINR(debt.minPayment)}</div>
                </div>
                <button 
                  onClick={() => removeDebt(debt.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {isAdding ? (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-primary-500/30 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <input 
                autoFocus
                type="text" 
                placeholder="Debt Name (e.g. HDFC Credit Card)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                value={newDebt.name}
                onChange={e => setNewDebt({...newDebt, name: e.target.value})}
              />
              
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newDebt.type}
                  onChange={e => setNewDebt({...newDebt, type: e.target.value})}
                >
                  {DEBT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.value}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Balance</label>
                   <input 
                    type="number" 
                    placeholder="₹"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold"
                    value={newDebt.balance}
                    onChange={e => setNewDebt({...newDebt, balance: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Rate %</label>
                   <input 
                    type="number" 
                    placeholder="%"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold"
                    value={newDebt.rate}
                    onChange={e => setNewDebt({...newDebt, rate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Monthly Min</label>
                   <input 
                    type="number" 
                    placeholder="₹"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold"
                    value={newDebt.minPayment}
                    onChange={e => setNewDebt({...newDebt, minPayment: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={handleAddDebt}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95"
                >
                  Save Debt
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              disabled={debts.length >= 10}
              className="w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all font-bold text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {debts.length >= 10 ? 'Limit (10) Reached' : 'Add Another Debt'}
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Min Payment</div>
           <div className="text-xl font-black text-slate-900 dark:text-white uppercase">
              {formatINR(totalMinPayment)}<span className="text-xs text-slate-400 ml-1">/mo</span>
           </div>
        </div>
      </div>

      {/* Extra Payment Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
        <label className="text-lg font-black text-slate-900 dark:text-white flex items-center mb-1">
          <Zap className="w-5 h-5 mr-2 text-amber-500" />
          Extra Monthly Budget
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
          How much extra can you pay beyond minimums?
        </p>
        
        <div className="relative">
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
          <input 
            type="number"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all placeholder:text-slate-200"
            placeholder="0"
            value={extraPayment}
            onChange={e => setExtraPayment(Number(e.target.value))}
          />
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-500 mt-0.5" />
          <p className="text-[10px] leading-tight text-amber-700 dark:text-amber-400 font-bold uppercase tracking-tight">
            Every ₹100 extra you pay directly reduces your principal and saves years of interest.
          </p>
        </div>
      </div>
    </div>
  );
}
