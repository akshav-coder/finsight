import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';

export default function TransactionTable({ transactions }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState(searchParams.get('type') || 'all'); // 'all', 'credit', 'debit'
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Extract unique categories from transactions for the filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category || 'Other'));
    return ['all', ...Array.from(cats).sort()];
  }, [transactions]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTransactions = useMemo(() => {
    // 1. Filter
    let result = transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.date || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCategory = categoryFilter === 'all' || (t.category || 'Other') === categoryFilter;
      return matchSearch && matchType && matchCategory;
    });

    // 2. Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, categoryFilter, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-primary-500" /> : <ArrowDown className="w-3 h-3 ml-1 text-primary-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-colors duration-200">
      
      {/* Controls Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row gap-4 justify-between xl:items-center bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-200">
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Activity Ledger</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} records
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none pr-8 relative bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All Types</option>
              <option value="credit">Money In</option>
              <option value="debit">Money Out</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none pr-8 relative bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 transition-colors duration-200">
            <tr>
              <th 
                className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date <SortIcon columnKey="date" />
                </div>
              </th>
              <th 
                className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description <SortIcon columnKey="description" />
                </div>
              </th>
              <th 
                className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category <SortIcon columnKey="category" />
                </div>
              </th>
              <th 
                className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end">
                  Amount <SortIcon columnKey="amount" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAndSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-20 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center">
                    <Filter className="w-10 h-10 mb-4 opacity-20" />
                    <p className="text-lg">No history matches your current filters.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm(''); 
                        setFilterType('all'); 
                        setCategoryFilter('all');
                        setSearchParams({});
                      }}
                      className="mt-4 text-primary-500 hover:text-primary-600 font-semibold text-sm"
                    >
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedTransactions.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition duration-150">
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium font-mono">{t.date}</td>
                  <td className="py-4 px-6 text-sm text-slate-800 dark:text-slate-200">
                    <div className="max-w-md truncate" title={t.description}>
                      {t.description}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                      {t.category || 'Other'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-bold font-mono">
                    {t.type === 'credit' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">
                        -₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
