import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [appData, setAppData] = useState(null);
  const [historyCount, setHistoryCount] = useState(() => {
    const saved = localStorage.getItem('finsight_upload_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Increment history count whenever a new statement is successfully loaded
  useEffect(() => {
    if (appData) {
      const newCount = historyCount + 1;
      setHistoryCount(newCount);
      localStorage.setItem('finsight_upload_count', newCount.toString());
    }
  }, [appData]);

  // appData will hold { summary, categoryData, dailyData, topPayees, transactions }
  return (
    <DataContext.Provider value={{ appData, setAppData, historyCount }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
