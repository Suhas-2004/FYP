import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Info,
  Layers,
  Filter,
  Flame,
  Skull,
  Sparkles,
  Zap,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  X,
  LayoutGrid,
  Table as TableIcon,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import CompanyLogo from '../components/CompanyLogo';

export default function StartupIntel({ setActiveTab, setSelectedCompanyId, theme }) {
  const [matrix, setMatrix] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [crisisFilter, setCrisisFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatrix() {
      try {
        const data = await api.getEvidenceMatrix();
        setMatrix(data || []);
      } catch (err) {
        console.error('Failed to load evidence matrix:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatrix();
  }, []);

  const handleStudyCase = (companyId) => {
    if (setSelectedCompanyId) {
      setSelectedCompanyId(companyId);
    }
    if (setActiveTab) {
      setActiveTab('strategy-steps');
    }
  };

  const handleViewCompanyIntel = (companyId) => {
    if (setSelectedCompanyId) {
      setSelectedCompanyId(companyId);
    }
    if (setActiveTab) {
      setActiveTab('companies');
    }
  };

  // Distinct crisis categories for filter
  const crisisCategories = ['All', ...new Set(matrix.map(item => item.crisis_category).filter(Boolean))];

  const filteredItems = matrix.filter(item => {
    const query = searchFilter.toLowerCase();
    const matchesSearch = 
      (item.startup_name || '').toLowerCase().includes(query) ||
      (item.futuristic_idea || '').toLowerCase().includes(query) ||
      (item.visionary_promise || '').toLowerCase().includes(query) ||
      (item.fatal_crisis || '').toLowerCase().includes(query) ||
      (item.matched_mnc_name || '').toLowerCase().includes(query) ||
      (item.mnc_turnaround_strategy || '').toLowerCase().includes(query) ||
      (item.founder_heuristic || '').toLowerCase().includes(query);

    const matchesSector = sectorFilter === 'All' || (item.sector || '').toLowerCase() === sectorFilter.toLowerCase();
    const matchesCrisis = crisisFilter === 'All' || item.crisis_category === crisisFilter;

    return matchesSearch && matchesSector && matchesCrisis;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Empirical Crisis Post-Mortem & MNC Playbook Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Vanished Startups vs. MNC Turnarounds
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
              Discover iconic visionary startups that collapsed despite groundbreaking futuristic ideas, discover their fatal crisis points, and examine how established multinational corporations (MNCs) conquered the identical crisis to unlock multi-billion-dollar scale.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 p-3 rounded-2xl shadow-sm text-center">
            <div className="px-2 py-1">
              <div className="text-lg font-black text-rose-500">12</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Vanished Cases</div>
            </div>
            <div className="px-2 py-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-lg font-black text-amber-500">$18.4B+</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Burned Capital</div>
            </div>
            <div className="px-2 py-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-lg font-black text-emerald-500">11 MNCs</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Turnarounds</div>
            </div>
            <div className="px-2 py-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-lg font-black text-brand-cyan">100%</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Empirical Track</div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Filter & Control Bar */}
      <MotionSection direction="up" delay={0.05}>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search vanished startup, futuristic idea, crisis cause, or MNC turnaround strategy..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
              />
              {searchFilter && (
                <button 
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sector Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center">
                  <Filter className="w-3 h-3 mr-1 text-slate-400" /> Sector:
                </span>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-2.5 py-2 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                >
                  <option value="All">All Sectors ({matrix.length})</option>
                  <option value="Automobile">Automobile</option>
                  <option value="Technology">Technology</option>
                  <option value="Media">Media</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-200/80 dark:bg-dark-900 p-1 rounded-xl border border-slate-300/60 dark:border-slate-700/60">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-dark-800 text-brand-cyan shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Side-by-Side Comparison Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards View</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-dark-800 text-brand-cyan shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Structured Evidence Matrix Table"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Matrix Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-3 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Loading empirical startup failure & turnaround matrix...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">No Matching Intelligence Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your keyword search or sector filters.</p>
          <button
            onClick={() => { setSearchFilter(''); setSectorFilter('All'); setCrisisFilter('All'); }}
            className="px-4 py-2 rounded-xl bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-bold border border-brand-cyan/30 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW: Side-by-Side Comparison */
        <StaggerContainer className="space-y-6">
          {filteredItems.map((item, idx) => (
            <StaggerItem key={item.id}>
              <div className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                {/* Background Accent Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.sector}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-500" />
                      Peak Valuation: {item.peak_valuation} | Burned: {item.capital_burned}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-[11px] font-mono font-semibold">
                      {item.crisis_category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{item.similarity_score}% Crisis Match</span>
                    </div>
                    <button
                      onClick={() => setSelectedCase(item)}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-dark-850 hover:bg-brand-cyan/10 hover:text-brand-cyan text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700/80 flex items-center space-x-1"
                    >
                      <span>Deep Dive</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Split Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left Column: The Vanished Startup (The Failure Point) */}
                  <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-rose-500/[0.03] to-transparent dark:from-rose-500/[0.06] border border-rose-200/60 dark:border-rose-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Startup Title */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center font-bold text-xs">
                            <Skull className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                              {item.startup_name}
                            </h3>
                            <span className="text-[10px] font-mono text-rose-500 font-semibold block">
                              {item.startup_status} • Founded {item.founded_year}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
                          {item.severity} Risk
                        </span>
                      </div>

                      {/* Futuristic Visionary Idea */}
                      <div className="space-y-1 bg-white/80 dark:bg-dark-950/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500 flex-shrink-0" />
                          <span>The Futuristic Idea</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.futuristic_idea}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                          {item.visionary_promise}
                        </p>
                      </div>

                      {/* The Fatal Crisis */}
                      <div className="space-y-1 bg-rose-500/10 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-500/20">
                        <div className="flex items-center text-xs font-bold text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-500 flex-shrink-0" />
                          <span>The Fatal Crisis (Why It Vanished)</span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-rose-200/90 leading-relaxed font-medium">
                          {item.fatal_crisis}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: The Crisis Bridge Connector */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
                    <div className="w-full flex flex-row lg:flex-col items-center justify-center gap-2 text-center p-3 rounded-2xl bg-slate-100/80 dark:bg-dark-900/80 border border-slate-200 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Identical Dilemma</span>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight block mt-0.5">
                          {item.shared_crisis_core}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: The Firm MNC Turnaround Strategy */}
                  <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-emerald-500/[0.03] to-transparent dark:from-emerald-500/[0.06] border border-emerald-200/60 dark:border-emerald-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* MNC Title & Logo */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <CompanyLogo 
                            companyId={item.matched_mnc_id} 
                            className="w-8 h-8" 
                            size={32} 
                          />
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading flex items-center space-x-1.5">
                              <span>{item.matched_mnc_name}</span>
                            </h3>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                              MNC Valuation: {item.current_mnc_market_cap}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold">
                          Overcame Crisis
                        </span>
                      </div>

                      {/* Deployed Strategy */}
                      <div className="space-y-1 bg-white/80 dark:bg-dark-950/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center text-xs font-bold text-brand-cyan">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-brand-cyan flex-shrink-0" />
                          <span>Turnaround Strategy: {item.mnc_strategy_category}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {item.mnc_turnaround_strategy}
                        </p>
                      </div>

                      {/* Key Decisive Moves */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                          Decisive Tactical Moves:
                        </div>
                        <ul className="space-y-1">
                          {item.mnc_key_moves?.slice(0, 2).map((move, mIdx) => (
                            <li key={mIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start space-x-1.5">
                              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{move}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Proven Turnaround Outcome */}
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item.mnc_outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Heuristic & Direct Action Strip */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-dark-900/50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 rounded-b-3xl">
                  <div className="flex items-start space-x-2 max-w-2xl">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-snug">
                      <strong className="text-slate-900 dark:text-white not-italic font-semibold mr-1">Founder Heuristic:</strong>
                      "{item.founder_heuristic}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewCompanyIntel(item.matched_mnc_id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-dark-800 hover:bg-slate-300 dark:hover:bg-dark-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                      title="View 6-Year Company Intelligence"
                    >
                      6-Yr Dossier
                    </button>
                    <button
                      onClick={() => handleStudyCase(item.matched_mnc_id)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-cyan text-dark-950 hover:bg-brand-cyan/90 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-brand-cyan/20 transition-transform active:scale-95"
                    >
                      <span>Study Turnaround Playbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        /* TABLE VIEW: Structured Matrix */
        <MotionSection direction="up" delay={0.1}>
          <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100/90 dark:bg-dark-950/90 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200/80 dark:border-slate-800/80">
                  <tr>
                    <th className="px-5 py-4">Vanished Startup & Futuristic Idea</th>
                    <th className="px-5 py-4">The Fatal Crisis (Why It Collapsed)</th>
                    <th className="px-5 py-4">Matched MNC Precedent</th>
                    <th className="px-5 py-4">MNC Turnaround Strategy Deployed</th>
                    <th className="px-5 py-4">Proven Outcome</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                  {filteredItems.map((row) => (
                    <tr 
                      key={row.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-dark-850/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCase(row)}
                    >
                      {/* Vanished Startup */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                          <span className="font-heading font-extrabold text-slate-900 dark:text-white text-xs">{row.startup_name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-rose-500 ml-4 font-semibold block">{row.startup_status}</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 ml-4 mt-1 font-medium leading-snug">
                          {row.futuristic_idea}
                        </p>
                      </td>

                      {/* Fatal Crisis */}
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300 max-w-xs leading-relaxed">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold mb-1">
                          {row.crisis_category}
                        </span>
                        <p className="text-[11px] line-clamp-3 leading-snug text-slate-700 dark:text-slate-300">
                          {row.fatal_crisis}
                        </p>
                      </td>

                      {/* MNC Precedent */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <CompanyLogo companyId={row.matched_mnc_id} className="w-6 h-6" size={24} />
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{row.matched_mnc_name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mt-1 font-semibold">
                          Cap: {row.current_mnc_market_cap}
                        </span>
                      </td>

                      {/* Strategy */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-bold text-brand-cyan text-xs leading-snug">{row.mnc_strategy_category}</div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {row.mnc_turnaround_strategy}
                        </p>
                      </td>

                      {/* Outcome */}
                      <td className="px-5 py-4 text-emerald-700 dark:text-emerald-300 max-w-xs leading-relaxed font-medium">
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{row.mnc_outcome}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(row);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStudyCase(row.matched_mnc_id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                          >
                            <span>Study Case</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionSection>
      )}

      {/* DEEP DIVE MODAL */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 pr-10">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold">
                    {selectedCase.sector} Sector
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold">
                    {selectedCase.similarity_score}% Strategic Match
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                  {selectedCase.startup_name} ➔ {selectedCase.matched_mnc_name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Comprehensive comparative post-mortem analysis and operational turnaround blueprint.
                </p>
              </div>

              {/* Side-by-Side Deep Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: Startup Failure Matrix */}
                <div className="p-5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">
                      <Skull className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {selectedCase.startup_name}
                      </h4>
                      <span className="text-[10px] font-mono text-rose-500 font-semibold">
                        {selectedCase.startup_status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Peak Valuation & Burned Capital:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedCase.peak_valuation} | {selectedCase.capital_burned}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-600 dark:text-amber-400 block font-bold">The Futuristic Vision:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedCase.visionary_promise}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-rose-600 dark:text-rose-400 block font-bold">The Fatal Failure Mechanism:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedCase.fatal_crisis}</p>
                    </div>
                  </div>
                </div>

                {/* Right: MNC Turnaround Playbook */}
                <div className="p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-4">
                  <div className="flex items-center space-x-2">
                    <CompanyLogo companyId={selectedCase.matched_mnc_id} className="w-8 h-8" size={32} />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {selectedCase.matched_mnc_name}
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        Valuation: {selectedCase.current_mnc_market_cap}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Identical Crisis Scenario:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedCase.matched_mnc_crisis_title}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-brand-cyan block font-bold">Turnaround Strategy:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedCase.mnc_turnaround_strategy}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 block font-bold">Key Tactical Execution Steps:</span>
                      <ul className="space-y-1.5 mt-1">
                        {selectedCase.mnc_key_moves?.map((move, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5 text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Takeaway Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <h5 className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider font-mono text-[10px]">
                    Empirical Executive Heuristic
                  </h5>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{selectedCase.founder_heuristic}"
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  Close Analysis
                </button>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const compId = selectedCase.matched_mnc_id;
                      setSelectedCase(null);
                      handleViewCompanyIntel(compId);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-dark-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 text-xs font-bold transition-colors"
                  >
                    Open 6-Yr Dossier
                  </button>
                  <button
                    onClick={() => {
                      const compId = selectedCase.matched_mnc_id;
                      setSelectedCase(null);
                      handleStudyCase(compId);
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-cyan text-dark-950 hover:bg-brand-cyan/90 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-brand-cyan/20"
                  >
                    <span>Launch Step-by-Step Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

