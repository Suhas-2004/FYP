import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Info,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Building2
} from 'lucide-react';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import CompanyLogo from '../components/CompanyLogo';

export default function SearchCondition({ setActiveTab, setSelectedCompanyId, theme }) {
  const [query, setQuery] = useState('High debt and declining cash flow');
  const [sector, setSector] = useState('All');
  const [threshold, setThreshold] = useState(40);
  const [results, setResults] = useState([]);
  const [sampleQueries, setSampleQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function loadSamples() {
      try {
        const samples = await api.getSampleQueries();
        setSampleQueries(samples || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadSamples();
    handleSearch('High debt and declining cash flow', 'All', 40);
  }, []);

  const handleSearch = async (searchQuery = query, searchSector = sector, searchThreshold = threshold) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await api.searchCrisis(searchQuery, searchSector, searchThreshold);
      setResults(data.matches || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStrategy = (companyId) => {
    setSelectedCompanyId(companyId);
    setActiveTab('strategy-steps');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Core Intelligence Matcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Search Crisis Condition
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Input the critical business challenge or distress condition your startup is experiencing. The NLP vectorizer scans 6 years of corporate historical data to identify benchmark turnaround cases.
            </p>
          </div>

          {/* Methodology Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 max-w-xs space-y-1 shadow-sm">
            <div className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-[11px]">
              <Info className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span>Case-Based Similarity Scoring</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Matches represent mathematical proximity of structural symptoms and heuristics against benchmark playbooks.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* Main Search Panel */}
      <MotionSection direction="up" delay={0.1}>
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-brand-cyan" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. High debt and declining cash flow, massive inventory backlog, pricing backlash..."
                className="w-full pl-12 pr-36 py-4 bg-white/95 dark:bg-dark-950/95 border border-slate-300/80 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all shadow-sm font-medium"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white font-bold text-xs flex items-center space-x-2 transition-all disabled:opacity-50 shadow-glow-cyan"
              >
                <span>{loading ? 'Analyzing...' : 'Search Cases'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Filters & Threshold Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center">
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" /> Sector Filter:
                  </span>
                  <span className="text-brand-cyan font-mono text-[11px] font-bold">{sector}</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => {
                    setSector(e.target.value);
                    handleSearch(query, e.target.value, threshold);
                  }}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-cyan shadow-sm font-medium"
                >
                  <option value="All">All Commercial Sectors</option>
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Automobile">Automobile</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Media">Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Min Similarity Threshold:</span>
                  <span className="text-brand-cyan font-mono text-[11px] font-bold">{threshold}%</span>
                </label>
                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="range"
                    min="30"
                    max="85"
                    step="5"
                    value={threshold}
                    onChange={(e) => {
                      setThreshold(Number(e.target.value));
                      handleSearch(query, sector, Number(e.target.value));
                    }}
                    className="w-full h-2 bg-slate-200 dark:bg-dark-850 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 w-10 font-bold bg-slate-100 dark:bg-dark-850 px-1.5 py-0.5 rounded text-center border border-slate-200 dark:border-slate-700">
                    {threshold}%
                  </span>
                </div>
              </div>
            </div>
          </form>

          {/* Quick Sample Queries */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center">
              <Sparkles className="w-3 h-3 text-brand-cyan mr-1.5" />
              <span>Benchmark Crisis Scenarios:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((s, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setQuery(s.query);
                    handleSearch(s.query, sector, threshold);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-dark-950/90 hover:bg-slate-50 dark:hover:bg-dark-850 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-cyan/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded font-mono">
                    {s.category}
                  </span>
                  <span className="truncate max-w-[260px] font-medium">{s.query}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white tracking-tight">
            Matched Historical Precedents
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {results.length} benchmark corporate case{results.length !== 1 ? 's' : ''} matched for query: <span className="text-brand-cyan font-semibold">"{query}"</span>
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
          Ranked by Cosine Similarity %
        </div>
      </div>

      {/* Results Cards List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Vectorizing query and computing similarity scores...</p>
        </div>
      ) : results.length === 0 && hasSearched ? (
        <MotionSection direction="scale">
          <div className="p-12 text-center rounded-3xl bg-slate-50/80 dark:bg-dark-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">No historical cases above {threshold}% threshold</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try lowering the similarity threshold or testing one of the sample crisis scenarios above.
            </p>
          </div>
        </MotionSection>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6">
          {results.map((item, idx) => (
            <StaggerItem key={item.company_id}>
              <motion.div
                whileHover={{ translateY: -3 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-cyan/40 transition-all duration-300 space-y-6 relative overflow-hidden group shadow-md"
              >
                {/* Background Rank Glow */}
                <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5 dark:opacity-10 group-hover:opacity-15 transition-opacity">
                  <span className="text-7xl font-extrabold text-brand-cyan font-mono">#{idx + 1}</span>
                </div>

                {/* Card Header: Company, Similarity Score & Category */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center space-x-3.5">
                    <CompanyLogo 
                      companyId={item.company_id} 
                      ticker={item.ticker} 
                      logoUrl={item.logo_url}
                      logoColor={item.logo_color} 
                      className="w-12 h-12 shadow-md"
                      size={44}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">{item.company_name}</h3>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-dark-950 text-slate-800 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700">
                          {item.ticker}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-brand-indigo/10 text-brand-indigo rounded border border-brand-indigo/30">
                          {item.sector}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {item.crisis_title}
                      </p>
                    </div>
                  </div>

                  {/* Similarity Score Meter Badge */}
                  <div className="flex items-center space-x-4 bg-slate-100/90 dark:bg-dark-950/90 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm w-fit">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono font-semibold">Similarity Match</div>
                      <div className="text-2xl font-heading font-black text-brand-cyan font-mono">
                        {item.similarity_score}%
                      </div>
                    </div>
                    <div className="w-16 bg-slate-300 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, item.similarity_score)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-brand-cyan to-emerald-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Condition vs Historical Reality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-dark-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                      <span>Historical Crisis Condition Experienced:</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {item.similar_condition}
                    </p>
                    {/* Matched Keywords */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {item.matched_keywords?.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-brand-cyan/10 text-brand-cyan text-[10px] font-mono font-semibold border border-brand-cyan/20">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-dark-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                      <span>Strategy Used & Proven Recovery Outcome:</span>
                    </div>
                    <div className="font-heading font-bold text-brand-cyan text-sm">
                      {item.strategy_name}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                      {item.recovery_outcome}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      Status: {item.recovery_status}
                    </span>
                    <span>•</span>
                    <span>{item.recommended_steps_count} Actionable Recovery Steps Formulated</span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <motion.button
                      whileHover={{ scale: 1.03, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCompanyId(item.company_id);
                        setActiveTab('companies');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-dark-850 border border-slate-300/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>6-Yr Dossier</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectStrategy(item.company_id)}
                      className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white font-bold text-xs shadow-glow-cyan transition-all"
                    >
                      <span>View Strategy Steps</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
