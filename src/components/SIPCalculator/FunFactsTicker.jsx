import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const FUN_FACTS = [
  "₹5,000/month for 30 years at 12% = ₹1.76 Crore! 🚀",
  "Warren Buffett made 99% of his wealth after age 50 — thanks to compounding",
  "Starting SIP at 25 vs 35 gives you up to 4x more money at 60",
  "₹100 invested in the stock market in 1980 is worth over ₹1,00,000+ today",
  "The best time to start an SIP was yesterday. The second best time is today.",
  "Even ₹500/month for 20 years = ₹4.9L at 12% returns",
  "Compounding is the 8th wonder of the world. He who understands it, earns it."
];

export default function FunFactsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 overflow-hidden mt-8 mb-4">
      <div className="flex items-center space-x-2 flex-shrink-0 text-indigo-500">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-400">Wealth Fact</span>
      </div>
      <div className="flex-1 relative h-6 w-full flex items-center justify-center text-center">
        {FUN_FACTS.map((fact, index) => (
          <div
            key={index}
            className={`absolute w-full transition-all duration-700 ease-in-out px-4 ${
              index === currentIndex
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4 pointer-events-none'
            }`}
          >
            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
              {fact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
