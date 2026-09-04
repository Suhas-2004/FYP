import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  PlusCircle, 
  Send, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  User, 
  Target, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import ContactModal from '../components/ContactModal';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';

export default function InvestorsStartups({ selectedPersona, theme }) {
  const [viewMode, setViewMode] = useState(selectedPersona === 'Entrepreneur' ? 'startup-submit' : 'investor-explore');
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [contactingStartup, setContactingStartup] = useState(null);
  const [industryFilter, setIndustryFilter] = useState('All');
  const [potentialFilter, setPotentialFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Form State for Startup submission
  const [formData, setFormData] = useState({
    name: '',
    industry: 'FinTech',
    founder_name: '',
    founder_title: 'Founder & CEO',
    founder_email: '',
    tagline: '',
    idea: '',
    problem_solved: '',
    proposed_solution: '',
    target_market: '',
    expected_usability: '',
    future_potential: '',
    business_model: '',
    funding_requirement: '$1,500,000 (Seed)',
    expected_returns: '8x-12x projected over 5 years',
    supporting_info: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadStartups();
  }, [industryFilter, potentialFilter]);

  async function loadStartups() {
    setLoading(true);
    try {
      const data = await api.getStartups(industryFilter, potentialFilter);
      setStartups(data.startups || []);
      if (data.startups?.length > 0 && !selectedStartup) {
        setSelectedStartup(data.startups[0]);
      }
    } catch (err) {
      console.error('Failed to load startups:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitStartup(formData);
      setSubmitSuccess(true);
      await loadStartups();
      setTimeout(() => {
        setSubmitSuccess(false);
        setViewMode('investor-explore');
      }, 2000);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-caramel dark:text-brand-amber text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Dual-Portal Dealflow & Pitch Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Investors & Startups
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              A specialized two-way gateway: Startups pitch their venture with unit economics & expected returns; Investors discover curated deals and initiate direct inquiries.
            </p>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex bg-slate-100/90 dark:bg-dark-900/90 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 self-start md:self-center shadow-sm">
            <button
              onClick={() => setViewMode('investor-explore')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'investor-explore'
                  ? 'bg-gradient-to-r from-brand-amber to-brand-caramel text-white shadow-glow-amber'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Investor Portal (Dealflow)</span>
            </button>
            <button
              onClick={() => setViewMode('startup-submit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'startup-submit'
                  ? 'bg-gradient-to-r from-brand-caramel to-brand-terracotta text-white shadow-glow-terracotta'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Startup Submission Studio</span>
            </button>
          </div>
        </div>
      </MotionSection>

      {/* VIEW 1: INVESTOR EXPLORATION PORTAL */}
      {viewMode === 'investor-explore' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <MotionSection direction="up" delay={0.05}>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center mr-1">
                  <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Filter Industry:
                </span>
                {['All', 'FinTech', 'Healthcare', 'Retail', 'Real Estate', 'Automobile'].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustryFilter(ind)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      industryFilter === ind
                        ? 'bg-brand-amber text-white font-bold shadow-sm'
                        : 'bg-white/90 dark:bg-dark-950/90 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800/80'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">Potential Tier:</span>
                <select
                  value={potentialFilter}
                  onChange={(e) => setPotentialFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                >
                  <option value="All">All Tiers</option>
                  <option value="High">High Potential</option>
                  <option value="Medium">Medium Potential</option>
                </select>
              </div>
            </div>
          </MotionSection>

          {/* Master-Detail Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Startup Dealflow List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between font-semibold">
                <span>Vetted Startups ({startups.length})</span>
                <span>Tier Rating</span>
              </div>

              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading startups...</div>
                ) : startups.map((s) => {
                  const isSelected = selectedStartup?.id === s.id;
                  return (
                    <motion.div
                      key={s.id}
                      whileHover={{ scale: 1.01, translateX: 2 }}
                      onClick={() => setSelectedStartup(s)}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/80 dark:bg-dark-850 border-brand-amber shadow-glow-amber'
                          : 'glass-panel hover:bg-slate-50 dark:hover:bg-dark-900 border-slate-200/80 dark:border-slate-800/80 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">{s.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.potential_rating === 'High'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                        }`}>
                          {s.potential_rating} Potential
                        </span>
                      </div>

                      <div className="text-xs text-brand-caramel dark:text-brand-amber font-bold mb-2">
                        {s.industry} • <span className="text-slate-600 dark:text-slate-300 font-normal">{s.tagline}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>Goal: <strong className="text-emerald-600 dark:text-emerald-400">{s.funding_requirement.split(' ')[0]}</strong></span>
                        <span>Founder: {s.founder_name.split(' ')[0]}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Full Pitch Reader (7 cols) */}
            <div className="lg:col-span-7">
              {selectedStartup ? (
                <MotionSection direction="scale" duration={0.35}>
                  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-lg">
                    {/* Header & CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">{selectedStartup.name}</h2>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-brand-amber/15 text-brand-caramel dark:text-brand-amber rounded border border-brand-amber/40">
                            {selectedStartup.industry}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                          {selectedStartup.tagline}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, translateY: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setContactingStartup(selectedStartup)}
                        className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta hover:opacity-95 text-white font-bold text-xs shadow-glow-amber transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact Startup</span>
                      </motion.button>
                    </div>

                    {/* Founder & Financial Metrics Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Founding Team</span>
                        <strong className="text-slate-900 dark:text-white text-xs">{selectedStartup.founder_name}</strong>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{selectedStartup.founder_title}</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Funding Requirement</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{selectedStartup.funding_requirement}</strong>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Target Raise</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-dark-950/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-mono">Projected Returns</span>
                        <strong className="text-brand-terracotta font-bold text-xs">{selectedStartup.expected_returns}</strong>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">5-Yr Horizon</div>
                      </div>
                    </div>

                    {/* Deep Pitch Sections */}
                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                        <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 mr-1.5 flex-shrink-0" />
                          <span>Problem Being Solved</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{selectedStartup.problem_solved}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                        <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                          <span>Proposed Solution & Core Idea</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{selectedStartup.proposed_solution}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">{selectedStartup.idea}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                            Target Market & Usability
                          </span>
                          <p className="text-slate-800 dark:text-slate-300 font-medium">{selectedStartup.target_market}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">Integration: {selectedStartup.expected_usability}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                            Business Model & Monetization
                          </span>
                          <p className="text-slate-800 dark:text-slate-300 font-medium">{selectedStartup.business_model}</p>
                          <p className="text-[11px] text-brand-caramel dark:text-brand-amber font-semibold pt-1">Future Potential: {selectedStartup.future_potential}</p>
                        </div>
                      </div>

                      {selectedStartup.supporting_info && (
                        <div className="p-3.5 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 text-[11px] text-slate-800 dark:text-slate-200">
                          <strong className="text-brand-caramel dark:text-brand-amber font-bold">Traction & Validation:</strong> {selectedStartup.supporting_info}
                        </div>
                      )}
                    </div>
                  </div>
                </MotionSection>
              ) : (
                <div className="p-16 text-center text-slate-500 font-mono text-xs">Select a startup from the left to view pitch details.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STARTUP SUBMISSION STUDIO */}
      {viewMode === 'startup-submit' && (
        <MotionSection direction="up" duration={0.4}>
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto space-y-6 shadow-xl">
            <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Startup Pitch Registration Studio</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Submit your startup to be indexed in the ICLAS dealflow registry and connect with institutional & angel investors.
              </p>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-glow-emerald"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Startup Successfully Registered!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your pitch has been evaluated and indexed in the investor discovery repository. Switching to dealflow view...
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Startup Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex BioTech"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry / Sector *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    >
                      <option value="FinTech">FinTech</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Retail">Retail</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Automobile">Automobile</option>
                      <option value="Technology">Technology</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">One-Line Elevator Tagline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI-driven precision therapeutics platform"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Row 2: Founder Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Founder Name(s) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan & Taylor S."
                      value={formData.founder_name}
                      onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Founder Title & Background</label>
                    <input
                      type="text"
                      placeholder="e.g. CEO (Ex-Google AI / Stanford PhD)"
                      value={formData.founder_title}
                      onChange={(e) => setFormData({ ...formData, founder_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Founder Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. founders@startup.com"
                      value={formData.founder_email}
                      onChange={(e) => setFormData({ ...formData, founder_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Problem and Solution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Problem Being Solved *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the severe market friction, cost inefficiency, or technical limitation..."
                      value={formData.problem_solved}
                      onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
                      className="w-full p-3.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber resize-none shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Proposed Solution & Core Idea *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detail your proprietary product, tech architecture, or service innovation..."
                      value={formData.proposed_solution}
                      onChange={(e) => setFormData({ ...formData, proposed_solution: e.target.value })}
                      className="w-full p-3.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber resize-none shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Market, Usability, Model */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Market (TAM) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global B2B Fintechs ($42B TAM)"
                      value={formData.target_market}
                      onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Usability / Integration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Drop-in REST SDK & Webhooks"
                      value={formData.expected_usability}
                      onChange={(e) => setFormData({ ...formData, expected_usability: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SaaS Tier ($2,500/mo) + 1% GMV"
                      value={formData.business_model}
                      onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* Funding and Returns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Funding Requirement *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $2,000,000 (Seed Round)"
                      value={formData.funding_requirement}
                      onChange={(e) => setFormData({ ...formData, funding_requirement: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected ROI / Investor Returns *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10x-15x projected return over 5 years"
                      value={formData.expected_returns}
                      onChange={(e) => setFormData({ ...formData, expected_returns: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Supporting Traction & Validations</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 beta pilot customers, $40k MRR, 2 patents pending"
                    value={formData.supporting_info}
                    onChange={(e) => setFormData({ ...formData, supporting_info: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-dark-950 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-amber shadow-sm font-medium"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('investor-explore')}
                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800/60 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02, translateY: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta hover:opacity-95 text-white font-bold shadow-glow-amber transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Registering Pitch...' : 'Register Pitch in Dealflow'}</span>
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </MotionSection>
      )}

      {/* Investor Contact Modal */}
      <AnimatePresence>
        {contactingStartup && (
          <ContactModal
            startup={contactingStartup}
            onClose={() => setContactingStartup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
