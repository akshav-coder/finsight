import { Wallet, Home, ShoppingBag, PiggyBank, Heart } from 'lucide-react';

const InputField = ({ value, label, name, placeholder, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || '0'}
        min="0"
        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-black text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-500 outline-none transition-all"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none group-focus-within:text-amber-500 text-xs">₹</div>
    </div>
  </div>
);

export default function SavingsInputForm({ data, setData, onAnalyze }) {
  // Use string state for inputs to allow partial entry (e.g. "100" without resetting after each digit)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string while typing; store numeric when valid, 0 when empty
    const numeric = value === '' ? 0 : parseFloat(value);
    setData(prev => ({ ...prev, [name]: isNaN(numeric) ? prev[name] : numeric }));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Income */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Monthly Income</h3>
          </div>
          <div className="space-y-3">
            <InputField value={data.income || ''} label="Take-Home Salary" name="income" placeholder="e.g. 60000" onChange={handleChange} />
            <InputField value={data.miscIncome || ''} label="Other Income" name="miscIncome" placeholder="e.g. 5000" onChange={handleChange} />
          </div>
        </div>

        {/* Section 2: Fixed Expenses */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Home className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Fixed Expenses</h3>
          </div>
          <div className="space-y-3">
            <InputField value={data.rent || ''} label="Rent / Home EMI" name="rent" placeholder="e.g. 15000" onChange={handleChange} />
            <InputField value={data.loans || ''} label="Other Loan EMIs" name="loans" placeholder="e.g. 5000" onChange={handleChange} />
            <InputField value={data.insurance || ''} label="Insurance Premiums" name="insurance" placeholder="e.g. 2000" onChange={handleChange} />
          </div>
        </div>

        {/* Section 3: Variable Spending */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            <ShoppingBag className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Variable Spending</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <InputField value={data.foodDelivery || ''} label="Food Delivery" name="foodDelivery" onChange={handleChange} />
            <InputField value={data.groceries || ''} label="Groceries" name="groceries" onChange={handleChange} />
            <InputField value={data.shopping || ''} label="Shopping" name="shopping" onChange={handleChange} />
            <InputField value={data.entertainment || ''} label="Entertainment" name="entertainment" onChange={handleChange} />
            <InputField value={data.transport || ''} label="Transport" name="transport" onChange={handleChange} />
            <InputField value={data.bills || ''} label="Bills & Utilities" name="bills" onChange={handleChange} />
          </div>
        </div>

        {/* Section 4: Health */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            <Heart className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Health & Wellbeing</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField value={data.health || ''} label="Health & Medical" name="health" placeholder="e.g. 1000" onChange={handleChange} />
          </div>
        </div>

        {/* Section 5: Savings */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            <PiggyBank className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Savings & Investments</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InputField value={data.savings || ''} label="Monthly Savings" name="savings" placeholder="e.g. 5000" onChange={handleChange} />
            <InputField value={data.investments || ''} label="Monthly Investments" name="investments" placeholder="e.g. 3000" onChange={handleChange} />
            <InputField value={data.emergencyFund || ''} label="Emergency Fund Balance" name="emergencyFund" placeholder="e.g. 20000" onChange={handleChange} />
            <InputField value={data.additionalEFSavings || ''} label="Extra EF Contribution" name="additionalEFSavings" placeholder="e.g. 2000" onChange={handleChange} />
          </div>
          <p className="text-[10px] text-slate-400 pl-1">Extra EF Contribution = amount you plan to add to emergency fund each month beyond regular savings</p>
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <button
          onClick={onAnalyze}
          className="px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
        >
          Analyze My Savings
        </button>
      </div>
    </div>
  );
}
