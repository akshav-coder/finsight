import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, FileX2, CloudOff, LockKeyhole, FolderLock, 
  Zap, BrainCircuit, ServerOff, UserX, Eraser, PieChart, 
  Calculator, Target, ArrowRight, MessageSquare, FileSpreadsheet,
  CheckCircle2, Star, Quote, XCircle, CreditCard, PiggyBank, Receipt, TrendingUp,
  ChevronDown, ChevronUp, Globe, Shield, FileSearch, TrendingDown, Goal, Lightbulb,
  Landmark, Wallet, Coins, Banknote, Building2
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const AnimatedCounter = ({ from = 0, to, duration = 2, prefix = '', suffix = '' }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            const formatted = value % 1 !== 0 ? value.toFixed(1) : Math.floor(value).toLocaleString('en-IN');
            nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
};

const FloatingIcon = ({ icon: Icon, top, left, bottom, right, delay = 0, size = "w-12 h-12", opacity = "opacity-[0.04] dark:opacity-[0.05]" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: 12, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 1 },
      scale: { duration: 1 }
    }}
    className={`absolute pointer-events-none invisible lg:visible text-slate-400 dark:text-slate-500 ${size} ${opacity} z-0`}
    style={{ top, left, bottom, right }}
  >
    <Icon className="w-full h-full" />
  </motion.div>
);

const ToolCard = ({ icon: Icon, title, description, tag, path, delay }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={() => navigate(path)}
      className="group glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer flex flex-col items-start text-left h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start w-full mb-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          {tag}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{description}</p>
      <div className="mt-4 flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Try Now</span>
        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-primary-500 transition-colors"
      >
        <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  return (
    <div className="min-h-screen bg-primary-100 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Background Enhancements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Noise Texture Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        {/* Decorative Floating Icons distributed globally but relative to viewport */}
        <FloatingIcon icon={Landmark} top="15%" left="5%" delay={0} size="w-16 h-16" />
        <FloatingIcon icon={Wallet} top="25%" right="8%" delay={2} size="w-12 h-12" />
        <FloatingIcon icon={Coins} bottom="20%" left="10%" delay={1} size="w-14 h-14" />
        <FloatingIcon icon={Banknote} bottom="15%" right="5%" delay={3} size="w-20 h-20" />
        <FloatingIcon icon={Building2} top="60%" left="3%" delay={4} size="w-10 h-10" />
        <FloatingIcon icon={CreditCard} top="45%" right="4%" delay={5} size="w-16 h-16" />
        <FloatingIcon icon={PiggyBank} top="80%" right="12%" delay={1.5} size="w-14 h-14" />
        <FloatingIcon icon={TrendingUp} top="5%" right="20%" delay={2.5} size="w-12 h-12" />
      </div>

      {/* Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full w-full max-w-5xl h-20 flex items-center justify-between px-4 sm:px-8 transition-all duration-300">
          <div className="flex items-center space-x-4 pl-2 sm:pl-4">
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <path d="M32 4L56 32L32 60L8 32Z" fill="url(#facet_main_l)" />
              <path d="M32 4L56 32L32 32Z" fill="url(#facet_right_l)" />
              <path d="M32 4L8 32L32 32Z" fill="url(#facet_left_l)" />
              <path d="M8 32L32 60L32 32Z" fill="url(#facet_bottom_left_l)" />
              <path d="M56 32L32 60L32 32Z" fill="url(#facet_bottom_right_l)" />
              <circle cx="32" cy="22" r="5" fill="#ffffff" />
            </svg>
            <span className="text-2xl font-display font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">Fin</span>
              <span className="text-rose-500">S</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-500">ight</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-12 text-base font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Tools</a>
            <a href="#how-it-works" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">How It Works</a>
            <a href="#privacy" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Privacy</a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <button 
              onClick={() => navigate('/app')}
              className="px-5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-md"
            >
              Open App →
            </button>
          </div>
        </nav>
      </div>

      <main className="relative z-10">
        
        {/* Section 1: Hero */}
        <section className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-7xl mx-auto">
          <motion.div initial="initial" animate="whileInView" variants={fadeUp} className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8">
              Your Financial Life. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">Beautifully Decoded.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional-grade calculators for taxes, loans, and investments. Completely private. No signups required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button 
                onClick={() => navigate('/app/statement-analytics/upload')}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white rounded-[2rem] font-bold text-xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center group"
              >
                Start Exploring
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              <a 
                href="#features"
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[2rem] font-bold text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                See All Tools ↓
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center"><LockKeyhole className="w-5 h-5 mr-3 text-emerald-500" /> 100% Private</span>
              <span className="flex items-center"><UserX className="w-5 h-5 mr-3 text-teal-500" /> No Signup</span>
              <span className="flex items-center"><Star className="w-5 h-5 mr-3 text-amber-500" /> Completely Free</span>
              <span className="flex items-center">🇮🇳 Built for India</span>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Problem Statement */}
        <section className="py-32 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                Most Indians Have No Idea<br />Where Their Money Goes
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Salary confusion",
                  desc: "You get a salary slip but don't understand what's being deducted or where it goes.",
                  icon: FileSearch
                },
                {
                  title: "EMI Trap",
                  desc: "You pay EMIs every month but don't know how much goes to interest vs principal.",
                  icon: TrendingDown
                },
                {
                  title: "Investment Gap",
                  desc: "You know you should save and invest but don't know where to start or how much.",
                  icon: Goal
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center"
                >
                  <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                    "{item.desc}"
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mt-16 text-2xl font-bold text-primary-500">
              FinSight fixes all of this — for free.
            </motion.p>
          </div>
        </section>

        {/* Section 3: All Tools */}
        <section id="features" className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                Everything You Need to Take Control
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ToolCard icon={PieChart} title="Statement Analyzer" description="Upload bank statement → get full spending breakdown" tag="Most Popular" path="/app/statement-analytics" delay={0.1} />
              <ToolCard icon={Calculator} title="Loan Simplifier" description="See exactly how much your EMI costs you" tag="Save Money" path="/app/loan" delay={0.2} />
              <ToolCard icon={CreditCard} title="Credit Card Analyzer" description="Escape the minimum payment trap" tag="Eye Opener" path="/app/credit-card" delay={0.3} />
              <ToolCard icon={PiggyBank} title="FD / RD Tracker" description="Find the best FD rates across banks" tag="Earn More" path="/app/fd-rd" delay={0.4} />
              <ToolCard icon={Lightbulb} title="Savings Advisor" description="Get personalized tips based on your spending" tag="AI Powered" path="/app/savings-advisor" delay={0.5} />
              <ToolCard icon={Target} title="Debt Planner" description="Avalanche vs Snowball — which clears debt faster" tag="Get Free" path="/app/debt-planner" delay={0.6} />
              <ToolCard icon={Receipt} title="Tax Saver" description="Find how much tax you can legally save" tag="Save Tax" path="/app/tax-saver" delay={0.7} />
              <ToolCard icon={TrendingUp} title="SIP Calculator" description="See how ₹5,000/month becomes ₹50L" tag="Grow Wealth" path="/app/sip-calculator" delay={0.8} />
            </div>
          </div>
        </section>

        {/* Section 4: How It Works */}
        <section id="how-it-works" className="py-32 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-display font-black mb-6">How FinSight Works</h2>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
              {/* Animated Connector Line */}
              <div className="absolute top-[40px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent hidden md:block" />

              {[
                {
                  step: "01",
                  title: "Choose a Tool",
                  desc: "Pick any financial tool you need. No account creation. No forms to fill. Just open and use.",
                  icon: Target
                },
                {
                  step: "02",
                  title: "Enter Your Data",
                  desc: "Upload a statement or enter numbers manually. Everything stays in your browser. Nothing is saved.",
                  icon: Calculator
                },
                {
                  step: "03",
                  title: "Get Instant Insights",
                  desc: "See clear charts, plain English explanations, and actionable advice — powered by AI.",
                  icon: BrainCircuit
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center max-w-sm relative z-10"
                >
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-3xl font-black mb-8 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed italic">"{item.desc}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Privacy Promise */}
        <section id="privacy" className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                Your Data Never Leaves Your Device
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Security that isn't just a marketing slogan.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  title: "No Account Required", 
                  desc: "Use every feature without creating an account or giving your email.", 
                  icon: UserX 
                },
                { 
                  title: "Nothing Stored", 
                  desc: "Your data is processed in your browser only. We store nothing on any server.", 
                  icon: ServerOff 
                },
                { 
                  title: "No Tracking", 
                  desc: "We don't track what you upload or analyze. Your finances are your business.", 
                  icon: Eraser 
                },
                { 
                  title: "Always Free", 
                  desc: "Core features are free forever. No credit card, no trial, no hidden charges.", 
                  icon: Star 
                }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center shadow-sm"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary-500 mb-6 font-black">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 6: Social Proof / Stats */}
        <section className="py-32 bg-slate-50 dark:bg-transparent border-y border-slate-200 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-24">
              <div>
                <h3 className="text-6xl font-black text-slate-900 dark:text-white mb-2">
                  <AnimatedCounter from={0} to={2.4} suffix=" Cr+" prefix="₹" />
                </h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Average tax saved identified</p>
              </div>
              <div>
                <h3 className="text-6xl font-black text-slate-900 dark:text-white mb-2">
                  <AnimatedCounter from={0} to={50000} suffix="+" />
                </h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Statements analyzed</p>
              </div>
              <div>
                <h3 className="text-6xl font-black text-slate-900 dark:text-white mb-2">
                  <AnimatedCounter from={0} to={8} />
                </h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Financial Tools Built-in</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative"
            >
              <Quote className="absolute top-8 left-8 w-12 h-12 text-primary-500/10" />
              <p className="text-2xl text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                "I had no idea I was paying ₹45,000 extra in taxes every year. FinSight showed me exactly what to invest in to save it. The best part? I didn't even have to sign up."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xl">RS</div>
                <div>
                  <h5 className="text-lg font-bold text-slate-900 dark:text-white">Rahul S.</h5>
                  <p className="text-slate-500 dark:text-slate-400">Software Engineer, Bangalore</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 7: Tool Spotlight */}
        <section className="py-32 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
                Feature Spotlight
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-8 leading-tight">
                Upload Your Bank Statement.<br />Get Your Financial Report Card.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed italic">
                Just drag and drop your PDF statement (HDFC, SBI, ICICI, Axis — any bank). Our local AI does the rest.
              </p>
              <button 
                onClick={() => navigate('/app/statement-analytics/upload')}
                className="px-10 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all flex items-center shadow-lg"
              >
                Try It Free →
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner"
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-amber-500" />
                What you get in 60 seconds:
              </h4>
              <ul className="space-y-6">
                {[
                  "Total money in vs money out",
                  "Category-wise spending breakdown",
                  "Top merchants you paid",
                  "Day-wise spending chart",
                  "Plain English AI summary",
                  "Savings opportunities identified"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 dark:text-slate-300 font-bold">
                    <CheckCircle2 className="w-5 h-5 mr-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Section 8: FAQ */}
        <section className="py-32 bg-slate-50 dark:bg-transparent">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-6">
                Common Questions
              </h2>
            </motion.div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <FAQItem 
                question="Is FinSight really free?" 
                answer="Yes. All 8 tools are completely free to use. We may introduce optional premium features later but core tools stay free forever. Our goal is to empower Indians with financial clarity." 
              />
              <FAQItem 
                question="Is my bank statement data safe?" 
                answer="Your data is processed entirely in your browser using local AI. Nothing is uploaded to our servers or stored anywhere. You can verify this by checking your network tab – zero data leaves your device." 
              />
              <FAQItem 
                question="Which banks are supported?" 
                answer="All major Indian banks — HDFC, SBI, ICICI, Axis, Kotak, Yes Bank, PNB, Canara, and more. If your bank provides a standard PDF, CSV, or Excel statement, it will work." 
              />
              <FAQItem 
                question="Do I need to create an account?" 
                answer="No. Open the app and start using it instantly. No email, no password, no phone number. We believe your financial data should stay with you, not on our database." 
              />
              <FAQItem 
                question="How accurate are the calculations?" 
                answer="Tax, loan, SIP and FD calculations use standard Indian banking formulas. Statement analysis uses AI which is 95%+ accurate on standard bank formats across India." 
              />
              <FAQItem 
                question="Who built this?" 
                answer="FinSight is built for young working Indians who want to understand their money without hiring a CA or expensive financial advisor. We are a small team dedicated to financial literacy." 
              />
            </div>
          </div>
        </section>

        {/* Section 9: Final CTA */}
        <section className="py-40 relative px-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary-600 dark:bg-slate-900 border-y border-transparent dark:border-slate-800 -skew-y-3 origin-left z-0" />
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeUp}>
              <h2 className="text-5xl md:text-7xl font-display font-black mb-10">Start Understanding Your Money Today</h2>
              <p className="text-2xl text-white/80 mb-16 font-medium italic">"Free. Private. No signup. Takes 2 minutes."</p>
              
              <button 
                onClick={() => navigate('/app')}
                className="px-12 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-transform shadow-2xl flex items-center justify-center mx-auto group"
              >
                Open FinSight Free
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <p className="mt-10 text-lg font-bold text-white/60">
                Join 50,000+ Indians who finally understand their finances.
              </p>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                  <path d="M32 4L56 32L32 60L8 32Z" fill="url(#facet_main_l)" />
                  <path d="M32 4L56 32L32 32Z" fill="url(#facet_right_l)" />
                  <path d="M32 4L8 32L32 32Z" fill="url(#facet_left_l)" />
                  <path d="M8 32L32 60L32 32Z" fill="url(#facet_bottom_left_l)" />
                  <path d="M56 32L32 60L32 32Z" fill="url(#facet_bottom_right_l)" />
                  <circle cx="32" cy="22" r="5" fill="#ffffff" />
                </svg>
                <span className="text-3xl font-display font-bold tracking-tight">
                  <span className="text-slate-900 dark:text-white">Fin</span>
                  <span className="text-rose-500">S</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-500">ight</span>
                </span>
              </div>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed italic">
                Your personal finance suite. Free. Private. Built for India.
              </p>
            </div>

            <div>
              <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8">Tools</h5>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-bold">
                <li><Link to="/app/statement-analytics" className="hover:text-primary-500 transition-colors">Statement Analyzer</Link></li>
                <li><Link to="/app/loan" className="hover:text-primary-500 transition-colors">Loan Simplifier</Link></li>
                <li><Link to="/app/credit-card" className="hover:text-primary-500 transition-colors">Credit Card Analyzer</Link></li>
                <li><Link to="/app/fd-rd" className="hover:text-primary-500 transition-colors">FD / RD Tracker</Link></li>
                <li><Link to="/app/savings-advisor" className="hover:text-primary-500 transition-colors">Savings Advisor</Link></li>
                <li><Link to="/app/debt-planner" className="hover:text-primary-500 transition-colors">Debt Planner</Link></li>
                <li><Link to="/app/tax-saver" className="hover:text-primary-500 transition-colors">Tax Saver</Link></li>
                <li><Link to="/app/sip-calculator" className="hover:text-primary-500 transition-colors">SIP Calculator</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8">Other</h5>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-bold">
                <li><a href="#privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-500 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
              © 2026 FinSight. Built with ❤️ for India. Not affiliated with any bank.
            </p>
            <div className="flex items-center space-x-6">
              <Globe className="w-5 h-5 text-slate-400 hover:text-primary-500 cursor-pointer" />
              <Shield className="w-5 h-5 text-slate-400 hover:text-primary-500 cursor-pointer" />
              <Zap className="w-5 h-5 text-slate-400 hover:text-primary-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>

      {/* Shared SVG Gradients */}
      <svg width="0" height="0" className="absolute -z-50 invisible">
        <defs>
          <radialGradient id="bg_glow_l" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
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
