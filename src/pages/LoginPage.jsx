import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      const origin = location.state?.from?.pathname || '/app';
      navigate(origin);
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="glass-panel p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">FinSight</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your personal financial command center.</p>

          {error && (
            <div className="mb-6 w-full p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-100 dark:border-danger-800/30 text-danger-600 dark:text-danger-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-bold text-slate-700 dark:text-slate-200">Continue with Google</span>
          </button>

        </div>
      </div>
    </div>
  );
}
