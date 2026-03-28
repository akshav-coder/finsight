import { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import Dashboard from './components/Dashboard';
import { processFile } from './utils/parseFile';
import { analyzeTransactions } from './utils/analyzeData';
import { Loader2, AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const [appState, setAppState] = useState('uploading'); // 'uploading', 'analyzing', 'dashboard', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState(null);

  const handleFileSelect = async (file) => {
    try {
      setAppState('analyzing');
      setErrorMsg('');
      
      const transactions = await processFile(file);
      
      if (!transactions || transactions.length === 0) {
        throw new Error("No transactions were found or the file format is not supported properly.");
      }
      
      const analyzedData = analyzeTransactions(transactions);
      
      setData({ ...analyzedData, transactions });
      setAppState('dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An unknown error occurred while processing the file.');
      setAppState('error');
    }
  };

  const resetApp = () => {
    setAppState('uploading');
    setData(null);
    setErrorMsg('');
  };

  return (
    <div className="font-sans antialiased text-slate-900 min-h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900">
      
      {appState === 'uploading' && (
        <UploadScreen onFileSelect={handleFileSelect} />
      )}

      {appState === 'analyzing' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 animate-pulse-slow">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing your statement...</h2>
          <p className="text-slate-500 text-center max-w-md">
            Our app is reading your transactions and building your personalized dashboard. This goes through securely.
          </p>
        </div>
      )}

      {appState === 'error' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mb-6 text-danger-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-danger-600 mb-8 max-w-md bg-danger-50 p-4 rounded-xl border border-danger-100 text-sm shadow-sm break-words">
            {errorMsg}
          </p>
          <button 
            onClick={resetApp}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      )}

      {appState === 'dashboard' && data && (
        <Dashboard data={data} onReset={resetApp} />
      )}

    </div>
  );
}

export default App;
