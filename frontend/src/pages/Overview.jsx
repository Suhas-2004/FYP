import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  BarChart3, 
  ChevronRight,
  Zap,
  Target,
  FileCheck,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';

export default function Overview({ setActiveTab, setSelectedCompanyId, selectedPersona, theme }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getOverviewMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <MotionSection direction="up" duration={0.6}>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 dark:from-dark-900 dark:via-dark-950 dark:to-dark-950 p-8 sm:p-12 shadow-xl dark:shadow-2xl transition-colors duration-300">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-brand-terracotta/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-amber/15 border border-brand-amber/35 text-brand-caramel dark:text-brand-amber text-xs font-semibold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-amber animate-spin-slow" />
              <span>Case-Based Corporate Intelligence & Turnaround Advisory</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Historical Corporate Turnarounds, <br />
              <span className="bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta bg-clip-text text-transparent">
                Engineered for Startup Survival.
              </span>
            </h1>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              ICLAS analyzes six years of longitudinal financial indicators, crisis downfalls, and proven recovery strategies of benchmark corporations. Match your startup's condition against historical cases, extract structured turnaround roadmaps, and connect with investors.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('companies')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta text-white font-bold text-sm shadow-glow-amber transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Explore Companies Intel</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('search-condition')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-dark-850 hover:bg-slate-50 dark:hover:bg-dark-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm hover:border-brand-amber/40 transition-all"
              >
                <Search className="w-4 h-4 text-brand-amber" />
                <span>Search Crisis Condition</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('graph-analysis')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-dark-850 hover:bg-slate-50 dark:hover:bg-dark-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm hover:border-emerald-500/40 transition-all"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Stock Trend AI</span>
              </motion.button>
            </div>
          </div>

          {/* Live Market & AI Signals Ticker */}
          {metrics?.market_signals && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 pt-6 border-t border-slate-200/90 dark:border-slate-800/80"
            >
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-amber" />
                  <span className="font-semibold">Live Predictive Market Signals</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline">● Real-Time Inference</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metrics.market_signals.map((sig) => (
                  <motion.div 
                    key={sig.ticker}
                    whileHover={{ scale: 1.03, translateY: -2 }}
                    onClick={() => setActiveTab('graph-analysis')}
                    className="p-3 rounded-xl bg-white/95 dark:bg-dark-900/90 border border-slate-200/90 dark:border-slate-800/80 hover:border-brand-amber/50 cursor-pointer shadow-sm transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-brand-amber transition-colors">{sig.ticker}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{sig.horizon} Horizon</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${sig.signal.includes('Rise') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {sig.signal}
                      </span>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{sig.confidence}% conf</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </MotionSection>

      {/* KPI Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 glass-panel-hover">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-medium">Companies Analyzed</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-brand-amber">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {metrics?.kpis?.companies_analyzed || '10+'}
            </div>
            <div className="text-[11px] text-brand-amber mt-1 font-semibold flex items-center">
              <span>Across 8 Commercial Sectors</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 glass-panel-hover">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-medium">Historical Turnaround Cases</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {metrics?.kpis?.historical_cases || '10+'}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">
              Turnaround Playbooks Verified
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 glass-panel-hover">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-medium">Historical Recovery Rate</span>
              <div className="p-2 rounded-lg bg-terracotta-500/10 bg-amber-600/10 text-brand-terracotta">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {metrics?.kpis?.recovery_success_rate || '100%'}
            </div>
            <div className="text-[11px] text-brand-terracotta mt-1 font-semibold">
              Documented Turnarounds
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 glass-panel-hover">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span className="font-medium">Active Startup Pitches</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-brand-caramel dark:text-brand-amber">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {metrics?.kpis?.active_startups || '5+'}
            </div>
            <div className="text-[11px] text-brand-caramel dark:text-brand-amber mt-1 font-semibold">
              Dealflow Pipeline Ready
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* 3 User Personas Flow Showcase */}
      <MotionSection direction="up" delay={0.1}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Three Purpose-Built Stakeholder Workflows
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                How ICLAS connects historical corporate intelligence across startup founders, investors, and researchers
              </p>
            </div>
            <span className="text-[10px] text-brand-amber font-mono px-2.5 py-1 rounded-full bg-brand-amber/15 border border-brand-amber/35 hidden sm:inline font-bold">
              PERSONA ECOSYSTEM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Persona 1: Entrepreneur */}
            <motion.div 
              whileHover={{ translateY: -4 }}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                selectedPersona === 'Entrepreneur' 
                  ? 'border-brand-amber shadow-glow-amber bg-amber-50/50 dark:bg-dark-850' 
                  : 'border-slate-200/90 dark:border-slate-800/80'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-amber/15 border border-brand-amber/35 text-brand-amber flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">1. Entrepreneur / Startup</h3>
                {selectedPersona === 'Entrepreneur' && (
                  <span className="px-2 py-0.5 text-[10px] bg-brand-amber/20 text-brand-caramel dark:text-brand-amber border border-brand-amber/40 rounded-full font-bold">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Search your current crisis conditions, discover similar corporate precedents, get similarity % scores, and follow structured step-by-step turnaround playbooks.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Crisis semantic matching & similarity scoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Phased action steps with PDF export</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Submit pitch to attract angel & VC investors</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveTab('search-condition')}
                className="w-full py-2.5 rounded-xl bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-caramel dark:text-brand-amber border border-brand-amber/35 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Launch Crisis Matcher</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Persona 2: Investor */}
            <motion.div 
              whileHover={{ translateY: -4 }}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                selectedPersona === 'Investor' 
                  ? 'border-brand-terracotta shadow-glow-terracotta bg-amber-50/50 dark:bg-dark-850' 
                  : 'border-slate-200/90 dark:border-slate-800/80'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-terracotta/15 border border-brand-terracotta/35 text-brand-terracotta flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">2. Investor</h3>
                {selectedPersona === 'Investor' && (
                  <span className="px-2 py-0.5 text-[10px] bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/40 rounded-full font-bold">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Explore curated, high-potential startups, examine detailed problem-solution viability, analyze market potential, and contact founders directly.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-terracotta flex-shrink-0" />
                  <span>Filter startups by sector & potential tier</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-terracotta flex-shrink-0" />
                  <span>Evaluate business models & expected ROI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-terracotta flex-shrink-0" />
                  <span>1-Click direct founder communication channel</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveTab('investors-startups')}
                className="w-full py-2.5 rounded-xl bg-brand-terracotta/15 hover:bg-brand-terracotta/25 text-brand-terracotta border border-brand-terracotta/35 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Explore Dealflow Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Persona 3: Researcher */}
            <motion.div 
              whileHover={{ translateY: -4 }}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                selectedPersona === 'Researcher' 
                  ? 'border-brand-caramel shadow-glow-caramel bg-amber-50/50 dark:bg-dark-850' 
                  : 'border-slate-200/90 dark:border-slate-800/80'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-caramel/15 border border-brand-caramel/35 text-brand-caramel flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">3. Researcher / Analyst</h3>
                {selectedPersona === 'Researcher' && (
                  <span className="px-2 py-0.5 text-[10px] bg-brand-caramel/20 text-brand-caramel border border-brand-caramel/40 rounded-full font-bold">
                    SELECTED
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Study 6-year longitudinal financial indicators (Revenue, Debt, ROE, Cash Flow), cross-compare sector downfalls, analyze leadership decisions, and track market predictions.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-400 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-caramel flex-shrink-0" />
                  <span>6-Year longitudinal financial trend charts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-caramel flex-shrink-0" />
                  <span>Leadership backstory & corporate crisis logs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-caramel flex-shrink-0" />
                  <span>Cross-sector downfall & recovery matrix</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveTab('companies')}
                className="w-full py-2.5 rounded-xl bg-brand-caramel/15 hover:bg-brand-caramel/25 text-brand-caramel border border-brand-caramel/35 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Explore Research DB</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </MotionSection>

      {/* System Flow Pipeline Visualization */}
      <MotionSection direction="up" delay={0.2}>
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200/90 dark:border-slate-800/80 gap-2">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Central System Decision Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The end-to-end Case-Based Reasoning architecture
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold w-fit">
              CBR Architecture Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-dark-900/80 border border-slate-200/90 dark:border-slate-800/80 text-center space-y-2 hover:border-brand-amber/40 transition-colors">
              <span className="text-[10px] font-bold text-brand-amber bg-brand-amber/15 px-2 py-0.5 rounded-md font-mono">STEP 1</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enter Condition</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">Founder enters crisis query (e.g. "High debt, low cash flow")</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-dark-900/80 border border-slate-200/90 dark:border-slate-800/80 text-center space-y-2 hover:border-brand-caramel/40 transition-colors">
              <span className="text-[10px] font-bold text-brand-caramel bg-brand-caramel/15 px-2 py-0.5 rounded-md font-mono">STEP 2</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Semantic Match</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">NLP vectorizer computes cosine similarity against 6-year cases</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-dark-900/80 border border-slate-200/90 dark:border-slate-800/80 text-center space-y-2 hover:border-brand-terracotta/40 transition-colors">
              <span className="text-[10px] font-bold text-brand-terracotta bg-brand-terracotta/15 px-2 py-0.5 rounded-md font-mono">STEP 3</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Similarity Score</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">Generates 91%, 84%, 78% matching scores with root causes</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-dark-900/80 border border-slate-200/90 dark:border-slate-800/80 text-center space-y-2 hover:border-emerald-500/40 transition-colors">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md font-mono">STEP 4</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Turnaround Strategy</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">Reveals what benchmark enterprises executed to reverse distress</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-dark-900/80 border border-brand-amber/40 text-center space-y-2 shadow-sm">
              <span className="text-[10px] font-bold text-brand-caramel dark:text-brand-amber bg-brand-amber/20 px-2 py-0.5 rounded-md font-mono">STEP 5</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Actionable Steps & PDF</h4>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">Transforms historical case into phased startup execution roadmap</p>
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
