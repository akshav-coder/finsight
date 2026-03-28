import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { processFile } from '../utils/parseFile';
import { analyzeTransactions } from '../utils/analyzeData';
import { Loader2, AlertCircle } from 'lucide-react';
import UploadScreen from '../components/UploadScreen';

export default function UploadView() {
  const { setAppData } = useData();
  const navigate = useNavigate();
  
  const [appState, setAppState] = useState('uploading');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = async (file) => {
    try {
      setAppState('analyzing');
      setErrorMsg('');
      
      const transactions = await processFile(file);
      if (!transactions || transactions.length === 0) {
        throw new Error("No transactions were found.");
      }
      
      const analyzedData = analyzeTransactions(transactions);
      setAppData({ ...analyzedData, transactions });
      navigate('/app/statement-analytics/overview');
    } catch (err) {
      const isAIEnabled = import.meta.env.VITE_ENABLE_AI === 'true';
      const isAIFiles = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') || 
                       file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
      
      let msg = `Parsing Error: ${err.message || 'Unknown error'}`;
      
      if (isAIFiles && !isAIEnabled) {
        msg = "AI-Enhanced PDF parsing is coming soon to the live version. Currently, only Excel and CSV formats are supported offline.";
      } else if (isAIFiles) {
        msg += ". Please check if your Gemini API key is valid and you have quota.";
      }
      
      setErrorMsg(msg);
      setAppState('error');
    }
  };

  if (appState === 'analyzing') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-pulse-slow h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analyzing your statement...</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
          Please wait while we intelligently parse and categorize your transactions.
        </p>
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up h-full min-h-[60vh]">
        <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/40 rounded-full flex items-center justify-center mb-6 text-danger-500 dark:text-danger-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Oops! Something went wrong</h2>
        <p className="text-danger-600 dark:text-danger-400 mb-8 max-w-md bg-danger-50 dark:bg-danger-900/20 p-4 rounded-xl border border-danger-100 dark:border-danger-800/50 text-sm shadow-sm break-words">
          {errorMsg}
        </p>
        <button 
          onClick={() => setAppState('uploading')}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pt-10 animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">Upload Statement</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Drag and drop your PDF, EXCEL, or CSV statement below to begin analysis.</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="mb-4 flex justify-end">
           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg">
             AI Enhanced Parsing: {import.meta.env.VITE_ENABLE_AI === 'true' ? 'Active' : 'Coming Soon'}
           </span>
        </div>
        <UploadScreen onFileSelect={handleFileSelect} isStandalone />
      </div>
    </div>
  );
}
