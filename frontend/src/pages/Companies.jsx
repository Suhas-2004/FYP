import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Activity,
  Briefcase,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  ExternalLink,
  ChevronRight,
  Zap,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import CompanyLogo from '../components/CompanyLogo';

const SECTORS = [
  'All',
  'Technology',
  'Retail',
  'FinTech',
  'Real Estate',
  'Automobile',
  'Healthcare',
  'Media'
];

export default function Companies({ setActiveTab, setSelectedCompanyId, selectedCompanyId, theme }) {
  const [sector, setSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [detailCompany, setDetailCompany] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState('revenue');
  
  // Track if we are viewing the dedicated detail page or the directory list
  const [viewingCompanyId, setViewingCompanyId] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#companies') && hash.includes('company=')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      return params.get('company') || null;
    }
    return null;
  });

  // Listen to browser Back/Forward within Companies page
  useEffect(() => {
    const handlePop = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#companies') && hash.includes('company=')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const comp = params.get('company');
        setViewingCompanyId(comp);
      } else if (hash.startsWith('#companies')) {
        setViewingCompanyId(null);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Load directory list
  useEffect(() => {
    async function loadCompanies() {
      setLoadingList(true);
      try {
        const data = await api.getCompanies(sector);
        setCompanies(data.companies || []);
      } catch (err) {
        console.error('Failed to load companies list:', err);
      } finally {
        setLoadingList(false);
      }
    }
    loadCompanies();
  }, [sector]);

  // If a companyId is selected, fetch full details for the dedicated page
  useEffect(() => {
    if (!viewingCompanyId) {
      setDetailCompany(null);
      return;
    }

    async function loadDetail() {
      setLoadingDetail(true);
      try {
        const full = await api.getCompanyDetail(viewingCompanyId);
        setDetailCompany(full);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load company detail:', err);
      } finally {
        setLoadingDetail(false);
      }
    }
    loadDetail();
  }, [viewingCompanyId]);

  const handleOpenCompanyPage = (companyId) => {
    setViewingCompanyId(companyId);
    if (setSelectedCompanyId) {
      setSelectedCompanyId(companyId);
    }
    window.history.pushState({ tab: 'companies', companyId, detail: true }, '', `#companies?company=${companyId}`);
  };

  const handleBackToDirectory = () => {
    setViewingCompanyId(null);
    setDetailCompany(null);
    window.history.pushState({ tab: 'companies' }, '', '#companies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewStrategy = (companyId) => {
    if (setSelectedCompanyId) {
      setSelectedCompanyId(companyId);
    }
    setActiveTab('strategy-steps');
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.primary_downfall && c.primary_downfall.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.primary_pump && c.primary_pump.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // =========================================================================
  // VIEW 2: FULL DEDICATED COMPANY DETAIL PAGE
  // =========================================================================
  if (viewingCompanyId && detailCompany) {
    const downfalls = detailCompany.six_year_downfalls_and_pumps?.filter(m => m.type === 'Downfall') || [];
    const pumps = detailCompany.six_year_downfalls_and_pumps?.filter(m => m.type === 'Pump' || m.type === 'Rebound') || [];

    return (
      <div className="space-y-8 pb-16">
        {/* Top Sticky Navigation Bar with Back Button */}
        <MotionSection direction="down" duration={0.35}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.04, x: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleBackToDirectory}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-dark-850 border border-slate-300/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm transition-all group"
              >
                <ArrowLeft className="w-4 h-4 text-brand-cyan group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Companies Directory</span>
              </motion.button>

              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>/</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{detailCompany.name}</span>
                <span>/</span>
                <span className="text-brand-cyan font-bold">Previous 6-Year Dossier (2019 – 2024)</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewStrategy(detailCompany.id)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white font-bold text-xs shadow-glow-cyan transition-all"
              >
                <span>View Actionable Strategy Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </MotionSection>

        {/* Hero Company Dossier Header */}
        <MotionSection direction="up" delay={0.05}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center space-x-5">
                <CompanyLogo 
                  companyId={detailCompany.id} 
                  ticker={detailCompany.ticker} 
                  logoUrl={detailCompany.logo_url}
                  logoColor={detailCompany.logo_color} 
                  className="w-16 h-16 sm:w-20 sm:h-20 shadow-xl"
                  size={64}
                />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                      {detailCompany.name}
                    </h1>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-dark-950 text-slate-800 dark:text-slate-300 rounded-lg border border-slate-300 dark:border-slate-700">
                      {detailCompany.ticker}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-brand-cyan/15 text-brand-cyan rounded-lg border border-brand-cyan/35">
                      {detailCompany.sector}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <span>Market Cap: <strong className="text-slate-900 dark:text-slate-200">{detailCompany.market_cap}</strong></span>
                    <span>•</span>
                    <span>Current CEO: <strong className="text-slate-900 dark:text-slate-200">{detailCompany.leadership?.current_ceo}</strong></span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold">
                      {detailCompany.crisis_info?.recovery_status || 'Analyzed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6-Year Window Prominent Tag */}
              <div className="p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 text-left lg:text-right shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-mono text-brand-cyan font-bold uppercase tracking-wider">Analysis Scope</div>
                <div className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">
                  Previous 6 Years (2019 – 2024)
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Longitudinal Performance & Turnaround Dossier
                </div>
              </div>
            </div>

            {/* Leadership Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-5">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <Users className="w-3.5 h-3.5 text-brand-cyan mr-1.5 flex-shrink-0" />
                  <span>Founding Background & Roots:</span>
                </div>
                <div className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  {detailCompany.leadership?.founder}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
                  {detailCompany.leadership?.founder_summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                  <span>Corporate Positioning & Scale:</span>
                </div>
                <div className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  Executive Headquarters & Market Footprint
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
                  {detailCompany.leadership?.company_background}
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* SECTION 1: 6-YEAR EXECUTIVE INTELLIGENCE NARRATIVE (PARAGRAPH) */}
        <MotionSection direction="up" delay={0.1}>
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-brand-indigo/10 to-transparent border-2 border-brand-cyan/40 shadow-xl overflow-hidden glass-panel">
            <div className="flex items-center space-x-2.5 mb-3 text-brand-cyan">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              <h2 className="text-base sm:text-lg font-heading font-bold tracking-tight text-slate-900 dark:text-white">
                6-Year Longitudinal Corporate Intelligence Narrative (2019 – 2024)
              </h2>
            </div>
            
            <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-normal bg-white/70 dark:bg-dark-950/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner">
              {detailCompany.executive_analysis_paragraph}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
              <span>● Synthesized across 6 financial quarters & audited balance sheets</span>
              <span>Focus: Downfalls, Pumps, Move Catalysts & Implemented Playbooks</span>
            </div>
          </div>
        </MotionSection>

        {/* SECTION 2: 6-YEAR DOWNFALLS & PUMPS BREAKDOWN WITH REASONS AND STRATEGIES */}
        <MotionSection direction="up" delay={0.15}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                  6-Year Downfall & Pump Events: Detailed Catalysts & Deployed Strategies
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Granular chronological inspection of major moves, underlying reasons behind market shifts, and operational turnarounds (2019–2024).
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-800 shadow-sm w-fit text-brand-cyan">
                {detailCompany.six_year_downfalls_and_pumps?.length || 0} Key Strategic Moves
              </span>
            </div>

            <div className="space-y-5">
              {detailCompany.six_year_downfalls_and_pumps?.map((move, idx) => {
                const isDownfall = move.type === 'Downfall';
                const isPump = move.type === 'Pump';
                const isRebound = move.type === 'Rebound';

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ translateY: -2 }}
                    className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 shadow-md ${
                      isDownfall 
                        ? 'border-rose-500/40 bg-gradient-to-br from-rose-50/50 via-white/80 to-transparent dark:from-rose-950/20 dark:via-dark-900/90 dark:to-dark-950 shadow-rose-500/5'
                        : isPump
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-white/80 to-transparent dark:from-emerald-950/20 dark:via-dark-900/90 dark:to-dark-950 shadow-emerald-500/5'
                        : 'border-brand-cyan/40 bg-gradient-to-br from-cyan-50/50 via-white/80 to-transparent dark:from-cyan-950/20 dark:via-dark-900/90 dark:to-dark-950 shadow-cyan-500/5'
                    }`}
                  >
                    {/* Move Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono flex items-center space-x-1.5 border ${
                          isDownfall 
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                            : isPump
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30'
                        }`}>
                          {isDownfall ? <TrendingDown className="w-3.5 h-3.5" /> : isPump ? <TrendingUp className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                          <span>{move.type} Event</span>
                        </span>

                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          Period: {move.period}
                        </span>
                      </div>

                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {detailCompany.ticker} • 6-Yr Window
                      </div>
                    </div>

                    {/* Move Title & Quantifiable Metric Data */}
                    <div className="space-y-2 mb-5">
                      <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 dark:text-white">
                        {move.title}
                      </h3>
                      <div className="p-3 rounded-xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-brand-cyan font-bold uppercase mr-1">Move Data:</span>
                        {move.move_data}
                      </div>
                    </div>

                    {/* 2-Column Deep Breakdown: Reason Behind Move & Strategy Implemented */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Reason Behind the Move */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-sm">
                        <div className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                          <AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span>1. Reason Behind the Move (Catalysts & Market Shifts):</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-xs sm:text-sm">
                          {move.reason_behind_move}
                        </p>
                      </div>

                      {/* Strategy Implemented */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shadow-sm">
                        <div className="flex items-center text-brand-cyan font-bold text-xs uppercase tracking-wider font-mono">
                          <Sparkles className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span>2. Strategy Implemented (Leadership Response & Pivot):</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-xs sm:text-sm">
                          {move.strategy_implemented}
                        </p>
                      </div>
                    </div>

                    {/* Outcome Narrative */}
                    {move.outcome_paragraph && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/25 flex items-start space-x-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                          <span className="font-bold">6-Year Strategic Outcome: </span>
                          {move.outcome_paragraph}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </MotionSection>

        {/* SECTION 3: 6-YEAR FINANCIAL PERFORMANCE VISUALIZER */}
        <MotionSection direction="up" delay={0.2}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                  6-Year Longitudinal Financial Indicator Trajectory (2019 – 2024)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Balance sheet strength, revenue elasticity, net profit, and free cash flow generation
                </p>
              </div>

              {/* Financial Metric Tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-100/90 dark:bg-dark-950/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                <button
                  onClick={() => setActiveMetricTab('revenue')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                    activeMetricTab === 'revenue' 
                      ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Revenue & Net Income
                </button>
                <button
                  onClick={() => setActiveMetricTab('debt')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                    activeMetricTab === 'debt' 
                      ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Debt vs Cash Flow
                </button>
                <button
                  onClick={() => setActiveMetricTab('roe')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                    activeMetricTab === 'roe' 
                      ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ROE & Order Book
                </button>
              </div>
            </div>

            {/* Interactive Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeMetricTab === 'revenue' ? (
                  <LineChart data={detailCompany.six_year_financials}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue_growth" name="Revenue Growth (%)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="net_income_growth" name="Net Income Growth (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                ) : activeMetricTab === 'debt' ? (
                  <BarChart data={detailCompany.six_year_financials}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Legend />
                    <Bar dataKey="debt_growth" name="Debt Growth (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cash_flow" name="Operating Cash Flow ($B)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={detailCompany.six_year_financials}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="roe" name="Return on Equity (ROE %)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="order_book" name="Order Book ($B)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </MotionSection>

        {/* SECTION 4: 2019-2024 MILESTONES & TURNING POINTS TIMELINE */}
        {detailCompany.business_info?.major_corporate_events && (
          <MotionSection direction="up" delay={0.25}>
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white flex items-center">
                  <Calendar className="w-4 h-4 text-brand-cyan mr-2" />
                  <span>2019–2024 Corporate Turning Points & Milestones</span>
                </h4>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Strictly 6-Year Scope</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {detailCompany.business_info.major_corporate_events.map((ev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                    <span className="text-xs font-mono font-bold text-brand-cyan px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/30">
                      {ev.year}
                    </span>
                    <div className="text-xs font-heading font-bold text-slate-900 dark:text-slate-100 pt-1">
                      {ev.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-medium">
                      {ev.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MotionSection>
        )}

        {/* SECTION 5: ACTIVE PROJECTS, COLLABORATIONS & INVESTMENTS (2019-2024) */}
        <MotionSection direction="up" delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Active 6-Year Projects</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {detailCompany.business_info?.major_projects?.map((p, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-brand-cyan font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Strategic Alliances & Partners</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {detailCompany.business_info?.collaborations?.map((c, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Target Sectors & Capital Deployment</span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {detailCompany.business_info?.investment_sectors?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple text-[10px] font-mono font-semibold border border-brand-purple/20">
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1 font-medium">
                  {detailCompany.business_info?.investments?.map((inv, i) => (
                    <li key={i} className="truncate">• {inv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* BOTTOM ACTION BAR */}
        <MotionSection direction="up" delay={0.35}>
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-cyan/20 via-brand-indigo/20 to-emerald-500/20 border border-brand-cyan/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">
                Apply {detailCompany.name}'s Turnaround Playbook to Your Startup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Access the 4-phase structured execution steps, immediate triage actions, and risk mitigation strategies.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleViewStrategy(detailCompany.id)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo text-white font-bold text-xs shadow-glow-cyan flex items-center space-x-2 transition-all w-fit"
            >
              <span>Launch Step-by-Step Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </MotionSection>

      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ENTERPRISE DIRECTORY (FULL GRID VIEW)
  // =========================================================================
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Previous 6 Years (2019 – 2024) Longitudinal Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Companies Intelligence Directory
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Explore previous 6-year financial performance, downfalls, pumps, reasons behind market moves, turnaround strategies, and longitudinal executive narratives. Click any company to open its dedicated dossier.
            </p>
          </div>

          {/* Search bar within companies */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search company, ticker, or catalyst..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white/95 dark:bg-dark-900/95 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
            />
          </div>
        </div>
      </MotionSection>

      {/* Sector Category Filter Tabs & Scope Badge */}
      <MotionSection direction="up" delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-none">
            {SECTORS.map((s) => {
              const isSelected = sector === s;
              return (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan font-bold'
                      : 'bg-white/90 dark:bg-dark-900/90 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 shadow-sm'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Scope: <strong>2019 – 2024 (6 Years)</strong></span>
            <span>•</span>
            <span><strong>{filteredCompanies.length}</strong> Companies</span>
          </div>
        </div>
      </MotionSection>

      {/* Full-Page Grid Directory */}
      {loadingList ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Loading 6-year corporate intelligence dossiers...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">No Companies Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try changing your search query or sector filter.</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((c) => (
            <StaggerItem key={c.id}>
              <motion.div
                whileHover={{ translateY: -4, scale: 1.01 }}
                onClick={() => handleOpenCompanyPage(c.id)}
                className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-cyan/60 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Card Top: Logo, Ticker, Sector, Cap */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <CompanyLogo 
                        companyId={c.id} 
                        ticker={c.ticker} 
                        logoUrl={c.logo_url}
                        logoColor={c.logo_color} 
                        className="w-12 h-12 shadow-md"
                        size={44}
                      />
                      <div>
                        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-cyan transition-colors leading-tight">
                          {c.name}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {c.ticker} • {c.sector}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      {c.market_cap}
                    </span>
                  </div>

                  {/* 6-Year Window Pill */}
                  <div className="flex items-center justify-between text-[11px] font-mono py-1 px-2.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-bold mb-3">
                    <span>Analysis Window:</span>
                    <span>2019 – 2024 (Previous 6 Yrs)</span>
                  </div>

                  {/* Primary Downfall & Pump Pills */}
                  <div className="space-y-1.5 text-xs mb-3">
                    {c.primary_downfall && (
                      <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400 font-medium line-clamp-1 bg-rose-50/70 dark:bg-rose-950/20 px-2 py-1 rounded-lg border border-rose-500/20">
                        <TrendingDown className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate"><strong>Downfall:</strong> {c.primary_downfall}</span>
                      </div>
                    )}
                    {c.primary_pump && (
                      <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-medium line-clamp-1 bg-emerald-50/70 dark:bg-emerald-950/20 px-2 py-1 rounded-lg border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate"><strong>Pump:</strong> {c.primary_pump}</span>
                      </div>
                    )}
                  </div>

                  {/* Executive Paragraph Excerpt */}
                  {c.executive_analysis_paragraph && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {c.executive_analysis_paragraph}
                    </p>
                  )}
                </div>

                {/* Card Bottom: Financials & Action */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Rev Growth: <strong className="text-brand-cyan">{c.financial_summary?.latest_revenue_growth}%</strong></span>
                    <span>ROE: <strong className="text-emerald-500">{c.financial_summary?.latest_roe}%</strong></span>
                    <span>Cash Flow: <strong className="text-purple-500">${c.financial_summary?.latest_cash_flow}B</strong></span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCompanyPage(c.id);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan/15 to-brand-indigo/15 hover:from-brand-cyan hover:to-brand-indigo hover:text-white text-brand-cyan border border-brand-cyan/35 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm group-hover:shadow-glow-cyan"
                  >
                    <span>Open 6-Year Intelligence Page</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
