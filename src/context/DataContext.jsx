import { createContext, useContext, useState, useEffect } from 'react';
import { getByKey, setByKey, deleteByKey } from '../utils/indexedDB';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [appData, setAppDataState] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize data asynchronously on mount (with automatic localStorage migration)
  useEffect(() => {
    async function loadData() {
      try {
        let savedData = null;
        let savedCount = 0;

        // 1. One-time legacy localStorage migration check
        const legacyDataStr = localStorage.getItem('finsight_app_data');
        const legacyCountStr = localStorage.getItem('finsight_upload_count');

        if (legacyDataStr) {
          console.log('Migrating legacy localStorage financial data to IndexedDB...');
          try {
            savedData = JSON.parse(legacyDataStr);
            await setByKey('app_data', savedData);
          } catch (e) {
            console.error('Failed to migrate legacy appData:', e);
          }
          localStorage.removeItem('finsight_app_data');
        }

        if (legacyCountStr) {
          savedCount = parseInt(legacyCountStr, 10) || 0;
          await setByKey('upload_count', savedCount);
          localStorage.removeItem('finsight_upload_count');
        }

        // 2. Fetch from IndexedDB if not just migrated
        if (!savedData) {
          savedData = await getByKey('app_data');
        }
        if (savedCount === 0) {
          savedCount = (await getByKey('upload_count')) || 0;
        }

        setAppDataState(savedData);
        setHistoryCount(savedCount);
      } catch (err) {
        console.error('Failed to load data from IndexedDB:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Custom setter to handle IndexedDB sync and history increment
  const setAppData = async (data) => {
    setAppDataState(data);
    
    try {
      if (data) {
        await setByKey('app_data', data);
        
        // Increment history count ONLY when new data is explicitly set
        const newCount = historyCount + 1;
        setHistoryCount(newCount);
        await setByKey('upload_count', newCount);
      } else {
        await deleteByKey('app_data');
      }
    } catch (err) {
      console.error('Failed to sync data with IndexedDB:', err);
    }
  };

  const clearData = async () => {
    setAppDataState(null);
    try {
      await deleteByKey('app_data');
    } catch (err) {
      console.error('Failed to delete data from IndexedDB:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="relative flex items-center justify-center">
          {/* Pulsing glow background */}
          <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
          
          {/* Logo container */}
          <div className="relative z-10 flex items-center justify-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
              <path d="M32 4L56 32L32 60L8 32Z" fill="url(#facet_main_l)" />
              <path d="M32 4L56 32L32 32Z" fill="url(#facet_right_l)" />
              <path d="M32 4L8 32L32 32Z" fill="url(#facet_left_l)" />
              <path d="M8 32L32 60L32 32Z" fill="url(#facet_bottom_left_l)" />
              <path d="M56 32L32 60L32 32Z" fill="url(#facet_bottom_right_l)" />
              <circle cx="32" cy="22" r="5" fill="#ffffff" />
            </svg>
          </div>
        </div>
        
        {/* Loading text with Outfit font */}
        <h2 className="mt-8 text-xl font-display font-bold text-slate-800 dark:text-slate-200 tracking-wide animate-pulse">
          Fin<span className="text-rose-500">S</span>ight
        </h2>
        <p className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
          Loading secure storage...
        </p>

        {/* Global SVGs definitions needed for the logo gradients */}
        <svg width="0" height="0" className="absolute -z-50 invisible">
          <defs>
            <linearGradient id="facet_main_l" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#3b82f6" /></linearGradient>
            <linearGradient id="facet_left_l" x1="8" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#e11d48" /></linearGradient>
            <linearGradient id="facet_right_l" x1="32" y1="4" x2="56" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6366f1" /></linearGradient>
            <linearGradient id="facet_bottom_left_l" x1="8" y1="32" x2="32" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#fb923c" /><stop offset="1" stopColor="#f97316" /></linearGradient>
            <linearGradient id="facet_bottom_right_l" x1="32" y1="32" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#2563eb" /></linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ appData, setAppData, clearData, historyCount }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
