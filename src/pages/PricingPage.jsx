import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function PricingPage() {
  const { user, isPro, setIsPro } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isPro) {
      alert("You are already on the Pro plan!");
      return;
    }

    setLoading(true);
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SsnT8eTJ1VK64M',
      amount: 19900,
      currency: "INR",
      name: "FinSight Pro",
      description: "Upgrade to unlimited analytics",
      handler: async function (response) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { isPro: true });
          setIsPro(true);
          navigate('/app');
        } catch (error) {
          console.error("Failed to upgrade:", error);
          alert("Failed to update profile. Please contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      theme: {
        color: "#6366f1"
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      console.error(response.error);
      setLoading(false);
    });
    rzp.open();
  };

  return (
    <div className="max-w-5xl mx-auto w-full pt-10 pb-20 px-6 animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Choose Your Plan</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Upgrade to Pro to unlock unlimited insights and advanced tools.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl flex flex-col">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Free Plan</h3>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">₹0<span className="text-lg text-slate-500 font-normal">/month</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-slate-600 dark:text-slate-300">
              <Check className="w-5 h-5 text-success-500 mr-3 shrink-0" />
              2 statement uploads per month
            </li>
            <li className="flex items-center text-slate-600 dark:text-slate-300">
              <Check className="w-5 h-5 text-success-500 mr-3 shrink-0" />
              Basic spending charts
            </li>
            <li className="flex items-center text-slate-600 dark:text-slate-300">
              <Check className="w-5 h-5 text-success-500 mr-3 shrink-0" />
              All financial calculators
            </li>
          </ul>

          <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed uppercase tracking-widest text-sm">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-primary-500 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/50 flex flex-col relative shadow-2xl shadow-primary-500/10">
          <div className="absolute top-0 right-8 -translate-y-1/2">
            <span className="bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" /> Recommended
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Pro Plan</h3>
          <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">₹199<span className="text-lg text-slate-500 font-normal">/month</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
              <Check className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
              Unlimited statement uploads
            </li>
            <li className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
              <Check className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
              Income Analytics & Net Balance
            </li>
            <li className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
              <Check className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
              Export full history to CSV
            </li>
            <li className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
              <Check className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
              AI Insights & Recommendations
            </li>
          </ul>

          {import.meta.env.VITE_ENABLE_PAYMENTS === 'true' ? (
            <button 
              onClick={handleUpgrade}
              disabled={loading || isPro}
              className="w-full py-4 rounded-2xl font-black bg-primary-600 hover:bg-primary-700 text-white transition-all uppercase tracking-widest text-sm shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isPro ? 'Already Pro' : 'Get Pro'}
            </button>
          ) : (
            <button 
              disabled
              title="Payments launching soon!"
              className="w-full py-4 rounded-2xl font-black bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Coming Soon
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
