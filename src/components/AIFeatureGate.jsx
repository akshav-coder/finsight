import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';

const AIFeatureGate = ({ children, featureName, description }) => {
  const isAIEnabled = import.meta.env.VITE_ENABLE_AI === 'true';

  if (isAIEnabled) {
    return children;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-primary-100/50 dark:border-primary-900/30 bg-white/40 dark:bg-slate-900/40 text-center group"
    >
      {/* Decorative Background Sparkles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-4 left-4 text-primary-400 group-hover:scale-125 transition-transform duration-700">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-4 right-4 text-primary-400 group-hover:scale-125 transition-transform duration-500 delay-150">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        
        <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Experimental Feature
        </div>

        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
          {featureName} <span className="text-primary-500">Coming Soon</span>
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
          {description || "We're currently fine-tuning our AI models to provide you with the most accurate financial insights. This feature will be available in the next update."}
        </p>

        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-400 dark:text-slate-500 italic">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
          <span>Models being optimized for live deployment</span>
        </div>
      </div>

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </motion.div>
  );
};

export default AIFeatureGate;
