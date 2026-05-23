import { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Initialize appData from localStorage on load
  const [appData, setAppDataState] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_app_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse appData from localStorage:', e);
      return null;
    }
  });

  const [historyCount, setHistoryCount] = useState(() => {
    const saved = localStorage.getItem('finsight_upload_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Custom setter to handle localStorage sync and history increment
  const setAppData = (data) => {
    setAppDataState(data);
    
    if (data) {
      localStorage.setItem('finsight_app_data', JSON.stringify(data));
      
      // Increment history count ONLY when new data is explicitly set (not on app load)
      const newCount = historyCount + 1;
      setHistoryCount(newCount);
      localStorage.setItem('finsight_upload_count', newCount.toString());
    } else {
      localStorage.removeItem('finsight_app_data');
    }
  };

  const clearData = () => {
    setAppDataState(null);
    localStorage.removeItem('finsight_app_data');
  };

  // appData holds { summary, categoryData, dailyData, topPayees, transactions }
  return (
    <DataContext.Provider value={{ appData, setAppData, clearData, historyCount }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
