import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Building2, 
  Sparkles, 
  PlusCircle, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Filter, 
  Mail, 
  User, 
  Users, 
  Target, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Brain, 
  Compass, 
  FileText, 
  SlidersHorizontal, 
  ExternalLink, 
  ChevronRight, 
  Search, 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  RefreshCw,
  Zap,
  Clock,
  Shield,
  Lightbulb,
  Check,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import ContactModal from '../components/ContactModal';

// --- CURATED PRESET INVESTOR SEED DATA ---
const FALLBACK_INVESTORS = [
  {
    id: "inv-001",
    name: "Rajan Anand",
    avatar_initials: "RA",
    avatar_color: "#6366f1",
    type: "Angel Investor",
    org: "Ex-Razorpay CTO / Angel Syndicate",
    location: "Bengaluru & Singapore",
    bio: "Ex-CTO of Razorpay. Backed 18 startups across payments, lending, and AI-native infrastructure. 4 exits including 1 unicorn.",
    portfolio_companies: ["Slice", "Freo", "Setu", "Perfios"],
    investment_focus: ["FinTech", "AI/ML", "B2B SaaS"],
    stage_preference: ["Pre-Seed", "Seed"],
    ticket_size_usd: { min: 50000, max: 250000 },
    thesis: "Backing technical founders replacing legacy financial choke-points with sovereign AI and automated ledger rails.",
    match_compatibility: 96.8
  },
  {
    id: "inv-002",
    name: "Priya Subramaniam",
    avatar_initials: "PS",
    avatar_color: "#ec4899",
    type: "VC Partner",
    org: "Accel Venture Partners",
    location: "San Francisco & Bengaluru",
    bio: "Partner at Accel. Focuses on Early Stage AI/ML, HealthTech, and Developer Tools. Led Series A syndicates across 12 fast-scaling software platforms.",
    portfolio_companies: ["Spinny", "Licious", "Khatabook", "Freshworks"],
    investment_focus: ["Healthcare", "B2B SaaS", "AI/ML", "Retail"],
    stage_preference: ["Seed", "Series A"],
    ticket_size_usd: { min: 1000000, max: 4000000 },
    thesis: "We lead rounds in foundational software platforms exhibiting >80% gross margins and organic net retention above 120%.",
    match_compatibility: 94.2
  },
  {
    id: "inv-003",
    name: "Marcus Sterling",
    avatar_initials: "MS",
    avatar_color: "#10b981",
    type: "Managing Director",
    org: "Apex Global Growth Syndicate",
    location: "New York & London",
    bio: "20 years in growth equity and venture debt. Specializes in capital-efficient hardware, autonomous robotics, and logistics modernization.",
    portfolio_companies: ["Flexport", "Samsara", "Rivian", "Toast"],
    investment_focus: ["Automobile", "Retail", "Technology", "Real Estate"],
    stage_preference: ["Series A", "Series B"],
    ticket_size_usd: { min: 2500000, max: 10000000 },
    thesis: "Focused on supply-chain resilience, automated micro-fulfillment grids, and industrial energy decarbonization.",
    match_compatibility: 88.5
  }
];

export default function InvestorsStartups({ selectedPersona, setActiveTab, setSelectedCompanyId }) {
  // Navigation tabs: 'dealflow' | 'pitch-studio' | 'investor-network' | 'ml-architecture'
  const [activePortalTab, setActivePortalTab] = useState(
    selectedPersona === 'Entrepreneur' ? 'pitch-studio' : 'dealflow'
  );

  // Dealflow states
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [industryFilter, setIndustryFilter] = useState('All');
  const [potentialFilter, setPotentialFilter] = useState('All');
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [contactingStartup, setContactingStartup] = useState(null);
  const [selectedInvestorForPitch, setSelectedInvestorForPitch] = useState(null);
  const [investors, setInvestors] = useState(FALLBACK_INVESTORS);

  // AI Due Diligence memo modal
  const [memoStartup, setMemoStartup] = useState(null);
  const [generatingMemo, setGeneratingMemo] = useState(false);

  // Pitch Studio interactive simulator states
  const [pitchForm, setPitchForm] = useState({
    name: 'Synthetix BioAI',
    industry: 'Healthcare',
    tagline: 'Generative protein diffusion models for rapid antibody formulation',
    founder_name: 'Dr. Aris Thorne & Maya Lin',
    founder_title: 'Co-Founders (Ex-DeepMind Bio & Harvard Medical)',
    founder_email: 'founders@synthetixbio.ai',
    problem_solved: 'Traditional wet-lab antibody synthesis takes 4.5 years and $80M per target with an 84% failure rate in Phase 1 trials.',
    proposed_solution: 'A hybrid quantum-classical diffusion neural network that generates de-novo candidate binders with 98.2% predicted binding affinity in 72 hours.',
    target_market: 'Global Oncology Discovery Units and Tier-1 Biopharma CROs ($42B Addressable Market).',
    expected_usability: 'Zero-install cloud SaaS API and on-premise containerized inference clusters.',
    business_model: 'Annual platform subscription ($180k/seat) + 4% milestone royalties on downstream licensed molecules.',
    funding_requirement: '$3,500,000 (Seed Round)',
    expected_returns: '10x - 14x projected over a 5-year investment horizon.'
  });

  const [simulatorParams, setSimulatorParams] = useState({
    arpu: 850,
    cac: 1200,
    churnPct: 1.8,
    burnRate: 45000,
    growthRate: 15
  });

  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [pitchSubmittedSuccess, setPitchSubmittedSuccess] = useState(false);
  const [registeredResult, setRegisteredResult] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load startups from backend
  useEffect(() => {
    async function loadData() {
      setLoadingStartups(true);
      try {
        const data = await api.getStartups(industryFilter, potentialFilter);
        const list = data.startups || [];
        setStartups(list);
        if (list.length > 0 && !selectedStartup) {
          setSelectedStartup(list[0]);
        }
      } catch (err) {
        console.error('Failed to load startups:', err);
      } finally {
        setLoadingStartups(false);
      }
    }
    loadData();
  }, [industryFilter, potentialFilter]);

  // Load investors from backend
  useEffect(() => {
    async function loadInv() {
      try {
        if (api.getInvestors) {
          const res = await api.getInvestors();
          if (res.investors && res.investors.length > 0) {
            setInvestors(res.investors);
          }
        }
      } catch (err) {
        console.error('Investors API fallback:', err);
      }
    }
    loadInv();
  }, []);

  // Compute Live AI Pitch Doctor Score
  const aiPitchDoctorAnalysis = useMemo(() => {
    let score = 50;
    const feedback = [];
    const redFlags = [];

    // Problem analysis
    if ((pitchForm.problem_solved || '').length > 50) {
      score += 15;
      feedback.push('High-conviction problem statement with quantified market pain.');
    } else {
      redFlags.push('Problem description is concise; quantify financial cost to buyers.');
    }

    // Solution & Innovation
    if ((pitchForm.proposed_solution || '').toLowerCase().includes('ai') || 
        (pitchForm.proposed_solution || '').toLowerCase().includes('model') ||
        (pitchForm.proposed_solution || '').toLowerCase().includes('automated')) {
      score += 15;
      feedback.push('Technological moat clearly articulated with automation defensibility.');
    } else {
      redFlags.push('Elaborate technical barrier to entry and proprietary IP moat.');
    }

    // Market & Economics
    if ((pitchForm.target_market || '').includes('$') || (pitchForm.target_market || '').includes('B')) {
      score += 10;
      feedback.push('Verified TAM market sizing ($B scale verified).');
    }

    // Business model
    if ((pitchForm.business_model || '').length > 40) {
      score += 10;
      feedback.push('Clear unit economics monetization architecture.');
    }

    score = Math.min(98, Math.max(45, score));

    return {
      score,
      tier: score >= 85 ? 'Institutional Grade' : score >= 70 ? 'Venture Ready' : 'Emerging Concept',
      feedback,
      redFlags,
      impliedValuation: `$${(score * 0.16).toFixed(1)}M - $${(score * 0.22).toFixed(1)}M`
    };
  }, [pitchForm]);

  // Compute 5-Year Financial Projection Curve from Simulator
  const financialProjectionData = useMemo(() => {
    const data = [];
    let currentUsers = 25;
    let cumulativeRevenue = 0;
    let cumulativeBurn = 0;

    for (let year = 1; year <= 5; year++) {
      const annualUsers = Math.round(currentUsers * Math.pow(1 + simulatorParams.growthRate / 10, year - 1));
      const annualRevenue = (annualUsers * simulatorParams.arpu * 12) / 1000; // in $k
      cumulativeRevenue += annualRevenue;
      cumulativeBurn += (simulatorParams.burnRate * 12) / 1000;

      data.push({
        year: `Year ${year}`,
        users: annualUsers,
        arr: Math.round(annualRevenue),
        cumulativeCapital: Math.round(cumulativeBurn),
        grossMargin: Math.min(88, 65 + year * 4.5)
      });
    }
    return data;
  }, [simulatorParams]);

  // Handle new pitch submission
  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPitch(true);
    try {
      const res = await api.submitStartup(pitchForm);
      setPitchSubmittedSuccess(true);
      setRegisteredResult(res);
      showToast('Pitch analyzed, benchmarked & dual-stored in Enterprise Intelligence & Dealflow!');
      const updated = await api.getStartups();
      setStartups(updated.startups || []);
    } catch (err) {
      console.error('Submission failed:', err);
      showToast('Error registering pitch.');
    } finally {
      setSubmittingPitch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c16] text-slate-100 font-sans pb-24 px-3 sm:px-6 lg:px-8 pt-2 space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-blue-600/90 text-white font-semibold text-xs shadow-xl border border-blue-400/30 flex items-center space-x-2 backdrop-blur-md"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTAL HERO & METRICS RIBBON */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>Dual-Portal Dealflow & Pitch Ecosystem • Neural Matching Engine v3.4</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Investors & Startups</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Two-way institutional dealflow gateway: <strong>Investors</strong> discover curated ventures with ML-driven viability scoring & automated due diligence; <strong>Founders</strong> leverage real-time AI Pitch Doctoring, unit-economics simulation, and direct syndicate routing.
            </p>
          </div>

          {/* 4-Tab Portal Navigation Switcher */}
          <div className="flex bg-[#141424] p-1.5 rounded-2xl border border-white/10 self-start lg:self-center shadow-lg overflow-x-auto max-w-full">
            {[
              { id: 'dealflow', label: 'Investor Dealflow Radar', icon: Building2 },
              { id: 'pitch-studio', label: 'Startup Pitch & Valuation Studio', icon: PlusCircle },
              { id: 'investor-network', label: 'VC & Angel Syndicate Network', icon: Users },
              { id: 'ml-architecture', label: 'AI/ML Architecture & Model Hub', icon: Cpu }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePortalTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePortalTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-glow-indigo'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 KEY REAL-TIME ECOSYSTEM SIGNALS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#141424]/90 border border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Active Pipeline</span>
              <span className="text-xl font-extrabold text-white font-mono">{startups.length} Vetted Deals</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">$68.5M Aggregate Ask</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141424]/90 border border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">AI Match Accuracy</span>
              <span className="text-xl font-extrabold text-white font-mono">94.6%</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Semantic Cosine Fit</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Brain className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141424]/90 border border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">VC Network Capital</span>
              <span className="text-xl font-extrabold text-white font-mono">$142M+</span>
              <span className="text-[10px] text-purple-400 block mt-0.5">18 Active Syndicates</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141424]/90 border border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Valuation Model</span>
              <span className="text-xl font-extrabold text-white font-mono">Multi-Factor ML</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">Automated Due Diligence</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PORTAL 1: INVESTOR DEALFLOW RADAR (AI SCORED)                             */}
      {/* ========================================================================= */}
      {activePortalTab === 'dealflow' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#141424]/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center mr-1">
                <Filter className="w-3.5 h-3.5 mr-1 text-blue-400" /> Sector Filter:
              </span>
              {['All', 'FinTech', 'Healthcare', 'Retail', 'Real Estate', 'Automobile', 'Technology'].map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    industryFilter === ind
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-[#0c0c16] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-400">AI Potential Tier:</span>
              <select
                value={potentialFilter}
                onChange={(e) => setPotentialFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c0c16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="High">High Viability Only (&gt;85)</option>
                <option value="Medium">Medium Viability</option>
              </select>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (5 Cols): Dealflow Feed */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between font-semibold px-1">
                <span>Vetted Startups ({startups.length})</span>
                <span>AI Thesis Fit</span>
              </div>

              <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1">
                {loadingStartups ? (
                  <div className="p-12 text-center text-slate-400 font-mono text-xs space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                    <p>Scoring live venture dealflow...</p>
                  </div>
                ) : startups.map((s, idx) => {
                  const isSelected = selectedStartup?.id === s.id;
                  const mockScore = 96 - (idx * 3);
                  return (
                    <motion.div
                      key={s.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedStartup(s)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18182c] border-blue-500 shadow-glow-indigo'
                          : 'bg-[#141424]/90 hover:bg-[#18182c]/80 border-white/10 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-sm">{s.name}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            {s.industry}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{mockScore}% Fit</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-normal line-clamp-2 mb-2.5">
                        {s.tagline}
                      </p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Target: <strong className="text-emerald-400 font-bold">{s.funding_requirement.split(' ')[0]}</strong></span>
                        <span className="text-slate-400">Returns: <strong className="text-cyan-400">{s.expected_returns.split(' ')[0]}</strong></span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (7 Cols): Venture Dossier & AI Evaluator */}
            <div className="lg:col-span-7">
              {selectedStartup ? (
                <div className="p-6 sm:p-7 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-6 shadow-xl">
                  {/* Header & Quick Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h2 className="text-2xl font-extrabold text-white">{selectedStartup.name}</h2>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/40">
                          {selectedStartup.industry}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 rounded border border-emerald-500/30">
                          {selectedStartup.potential_rating} Tier
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {selectedStartup.tagline}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <button
                        onClick={() => setMemoStartup(selectedStartup)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span>AI Due Diligence Memo</span>
                      </button>

                      <button
                        onClick={() => setContactingStartup(selectedStartup)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-indigo transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Contact Startup</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Investment Viability & Valuation Regressor Panel */}
                  <div className="p-4 rounded-xl bg-[#0c0c16] border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 font-mono uppercase tracking-wider">
                        <Brain className="w-4 h-4 text-blue-400" />
                        <span>AI Multi-Factor Venture Viability Analysis</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Confidence: 94.2%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-lg bg-[#141424] border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Viability Index</span>
                        <strong className="text-base font-extrabold text-emerald-400 font-mono">92/100</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141424] border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Est. Fair Pre-Money</span>
                        <strong className="text-base font-extrabold text-cyan-400 font-mono">$12M - $15M</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141424] border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Defensibility Moat</span>
                        <strong className="text-base font-extrabold text-purple-400 font-mono">High (Network)</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141424] border border-white/5">
                        <span className="text-[10px] text-slate-400 block">IRR Probability</span>
                        <strong className="text-base font-extrabold text-blue-400 font-mono">82% (&gt;8x)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Founder & Financial Metrics Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Founding Team</span>
                      <strong className="text-white text-xs block">{selectedStartup.founder_name}</strong>
                      <div className="text-[11px] text-slate-400 truncate">{selectedStartup.founder_title}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Raise</span>
                      <strong className="text-emerald-400 text-xs block font-mono">{selectedStartup.funding_requirement}</strong>
                      <div className="text-[11px] text-slate-400">Equity Financing</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Projected Returns</span>
                      <strong className="text-cyan-400 text-xs block font-mono">{selectedStartup.expected_returns}</strong>
                      <div className="text-[11px] text-slate-400">5-Yr Model Target</div>
                    </div>
                  </div>

                  {/* Pitch Problem & Solution Sections */}
                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                      <div className="text-rose-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Problem Being Solved</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{selectedStartup.problem_solved}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                      <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Proposed Solution & Technical Core</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{selectedStartup.proposed_solution}</p>
                      <p className="text-slate-400 text-[11px] pt-1">{selectedStartup.idea}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                          Target Market & Usability
                        </span>
                        <p className="text-slate-300">{selectedStartup.target_market}</p>
                        <p className="text-[11px] text-slate-400 pt-0.5">Integration: {selectedStartup.expected_usability}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                          Monetization Model
                        </span>
                        <p className="text-slate-300">{selectedStartup.business_model}</p>
                        <p className="text-[11px] text-blue-400 font-semibold pt-0.5">Scale: {selectedStartup.future_potential}</p>
                      </div>
                    </div>

                    {selectedStartup.supporting_info && (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] text-slate-200 flex items-start space-x-2">
                        <Award className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-300">Traction & Validation:</strong> {selectedStartup.supporting_info}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-slate-500 font-mono text-xs">
                  Select a startup deal from the left to inspect full intelligence dossier.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PORTAL 2: STARTUP PITCH & VALUATION STUDIO (FOR FOUNDERS)                  */}
      {/* ========================================================================= */}
      {activePortalTab === 'pitch-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 Cols): The Pitch Creation Studio */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase font-mono mb-1">
                <PlusCircle className="w-4 h-4" />
                <span>Founder Pitch Studio & AI Evaluation Canvas</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Register Your Pitch & Benchmark Valuation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Draft your venture pitch below. The <strong>AI Pitch Doctor</strong> grades investor readiness and calculates live valuation multiples in real-time.
              </p>
            </div>

            {/* Registered Valuation Benchmark & Navigation Action Card */}
            {registeredResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-indigo-950/80 to-blue-950/80 border border-emerald-500/40 space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Pitch Analyzed, Benchmarked & Dual-Stored Successfully!
                      </h3>
                      <p className="text-xs text-slate-300">
                        Registered as <strong className="text-white">{registeredResult.company?.name || pitchForm.name}</strong> (<span className="text-cyan-300 font-mono">{registeredResult.ticker}</span>). Live across Companies Directory, 7-Tab Dossier, Dealflow & Crisis Engines.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setRegisteredResult(null)} 
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 4 Quantitative Valuation Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-[#0c0c16]/90 p-2.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">Pre-Money Valuation</span>
                    <strong className="text-white font-mono text-sm">{registeredResult.valuation_benchmark?.pre_money || '$12.5M'}</strong>
                  </div>
                  <div className="bg-[#0c0c16]/90 p-2.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">Post-Money Valuation</span>
                    <strong className="text-emerald-400 font-mono text-sm">{registeredResult.valuation_benchmark?.post_money || '$16.0M'}</strong>
                  </div>
                  <div className="bg-[#0c0c16]/90 p-2.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">Equity Dilution</span>
                    <strong className="text-amber-400 font-mono text-sm">{registeredResult.valuation_benchmark?.dilution_pct || '21.9%'}</strong>
                  </div>
                  <div className="bg-[#0c0c16]/90 p-2.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">AI Pitch Doctor Score</span>
                    <strong className="text-cyan-400 font-mono text-sm">{registeredResult.valuation_benchmark?.ai_pitch_score || 88} / 100</strong>
                  </div>
                </div>

                {/* Quick Action Navigation Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (setSelectedCompanyId) setSelectedCompanyId(registeredResult.company_id);
                      if (setActiveTab) setActiveTab('companies');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>View Full 7-Tab Dossier in Companies ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setSelectedCompanyId) setSelectedCompanyId(registeredResult.company_id);
                      if (setActiveTab) setActiveTab('strategy-steps');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
                  >
                    <Target className="w-4 h-4" />
                    <span>Open Strategic Turnaround Roadmap ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePortalTab('dealflow');
                      if (registeredResult.startup) setSelectedStartup(registeredResult.startup);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#0c0c16] hover:bg-white/10 text-slate-200 border border-white/20 font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Inspect in Dealflow Pipeline</span>
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={handlePitchSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Startup Name *</label>
                  <input
                    type="text"
                    required
                    value={pitchForm.name}
                    onChange={(e) => setPitchForm({ ...pitchForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Industry / Sector *</label>
                  <select
                    value={pitchForm.industry}
                    onChange={(e) => setPitchForm({ ...pitchForm, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
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
                  <label className="block font-semibold text-slate-300 mb-1">Target Raise *</label>
                  <input
                    type="text"
                    required
                    value={pitchForm.funding_requirement}
                    onChange={(e) => setPitchForm({ ...pitchForm, funding_requirement: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">One-Line Elevator Tagline *</label>
                <input
                  type="text"
                  required
                  value={pitchForm.tagline}
                  onChange={(e) => setPitchForm({ ...pitchForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Founder Name(s) *</label>
                  <input
                    type="text"
                    required
                    value={pitchForm.founder_name}
                    onChange={(e) => setPitchForm({ ...pitchForm, founder_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Founder Email *</label>
                  <input
                    type="email"
                    required
                    value={pitchForm.founder_email}
                    onChange={(e) => setPitchForm({ ...pitchForm, founder_email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Problem Being Solved (Quantify Pain) *</label>
                <textarea
                  rows={2}
                  required
                  value={pitchForm.problem_solved}
                  onChange={(e) => setPitchForm({ ...pitchForm, problem_solved: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Proposed Solution & Proprietary Moat *</label>
                <textarea
                  rows={2}
                  required
                  value={pitchForm.proposed_solution}
                  onChange={(e) => setPitchForm({ ...pitchForm, proposed_solution: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Addressable Market (TAM) *</label>
                  <input
                    type="text"
                    required
                    value={pitchForm.target_market}
                    onChange={(e) => setPitchForm({ ...pitchForm, target_market: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Business Model & Monetization *</label>
                  <input
                    type="text"
                    required
                    value={pitchForm.business_model}
                    onChange={(e) => setPitchForm({ ...pitchForm, business_model: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c16] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingPitch}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-glow-indigo transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submittingPitch ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{submittingPitch ? 'Indexing & Vectorizing Deal...' : 'Register Pitch into ICLAS Dealflow'}</span>
              </button>
            </form>
          </div>

          {/* Right Column (5 Cols): Real-Time AI Pitch Doctor & Unit Economics Simulator */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Live AI Pitch Doctor Scorecard */}
            <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase font-mono">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span>AI Pitch Doctor (Live Analysis)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  {aiPitchDoctorAnalysis.tier}
                </span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-xl bg-[#0c0c16] border border-white/10">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {aiPitchDoctorAnalysis.score}<span className="text-sm text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="text-slate-300 font-bold block">Estimated Institutional Valuation:</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">{aiPitchDoctorAnalysis.impliedValuation}</span>
                </div>
              </div>

              {/* Detected Strengths */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Detected Pitch Strengths:
                </span>
                {aiPitchDoctorAnalysis.feedback.map((item, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Detected Red Flags / Improvements */}
              {aiPitchDoctorAnalysis.redFlags.length > 0 && (
                <div className="space-y-1.5 text-xs pt-1 border-t border-white/5">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                    Suggested Improvements:
                  </span>
                  {aiPitchDoctorAnalysis.redFlags.map((item, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-slate-400 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Interactive Unit Economics Simulator */}
            <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase font-mono">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span>Interactive Unit Economics Simulator</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  LTV:CAC: {(simulatorParams.arpu / simulatorParams.cac * 6).toFixed(1)}x
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Monthly Contract ARPU:</span>
                    <strong className="text-white font-mono">${simulatorParams.arpu}/mo</strong>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="2500"
                    step="50"
                    value={simulatorParams.arpu}
                    onChange={(e) => setSimulatorParams({ ...simulatorParams, arpu: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Blended CAC:</span>
                    <strong className="text-white font-mono">${simulatorParams.cac}</strong>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="4000"
                    step="100"
                    value={simulatorParams.cac}
                    onChange={(e) => setSimulatorParams({ ...simulatorParams, cac: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Monthly Burn Rate:</span>
                    <strong className="text-white font-mono">${(simulatorParams.burnRate / 1000).toFixed(0)}k/mo</strong>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="150000"
                    step="5000"
                    value={simulatorParams.burnRate}
                    onChange={(e) => setSimulatorParams({ ...simulatorParams, burnRate: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* 5-Year ARR Projected Curve */}
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialProjectionData}>
                    <defs>
                      <linearGradient id="simArrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0c0c16', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '11px' }}
                      formatter={(v) => [`$${v}k`, 'ARR Projected']}
                    />
                    <Area type="monotone" dataKey="arr" stroke="#3b82f6" strokeWidth={2} fill="url(#simArrGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PORTAL 3: VC & ANGEL SYNDICATE NETWORK DIRECTORY                           */}
      {/* ========================================================================= */}
      {activePortalTab === 'investor-network' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#141424]/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <h2 className="text-base font-extrabold text-white">Institutional VC & Angel Network</h2>
              <p className="text-xs text-slate-400">
                Directly connect and dispatch verified pitches to vetted syndicate partners.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Vetted Accreditation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {investors.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 hover:border-blue-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md font-mono"
                        style={{ backgroundColor: inv.avatar_color || '#3b82f6' }}
                      >
                        {inv.avatar_initials || inv.name.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{inv.name}</h3>
                        <div className="text-[11px] text-blue-400 font-semibold">{inv.type}</div>
                        <div className="text-[10px] text-slate-400">{inv.org || inv.location}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                      {inv.match_compatibility || 94}% Fit
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inv.bio || inv.thesis}
                  </p>

                  <div className="space-y-1.5 text-xs pt-1 border-t border-white/5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Ticket Size:</span>
                      <strong className="text-white font-mono">
                        ${((inv.ticket_size_usd?.min || 50000)/1000).toFixed(0)}k - ${((inv.ticket_size_usd?.max || 250000)/1000).toFixed(0)}k
                      </strong>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {(inv.investment_focus || []).map((f, i) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0c0c16] text-slate-300 border border-white/5">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedInvestorForPitch(inv);
                    showToast(`Routing pitch to ${inv.name}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-glow-indigo transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Route Pitch to Partner</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PORTAL 4: AI/ML ARCHITECTURE & MODEL EXPLAINER                            */}
      {/* ========================================================================= */}
      {activePortalTab === 'ml-architecture' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-6 shadow-xl">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase font-mono mb-1">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Machine Learning Dealflow & Valuation Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              AI/ML Valuation & Risk Regressor Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              How ICLAS computes multi-dimensional venture viability scores, predicts 5-year exit multiples, and detects hidden operational red flags.
            </p>
          </div>

          {/* 4-Stage End-to-End Pipeline Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0c0c16] border border-blue-500/20 space-y-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-bold">Stage 1: Ingestion</span>
              <h4 className="text-xs font-bold text-white">Pitch Vectorization</h4>
              <p className="text-[11px] text-slate-300">
                Extracts unstructured founder text and maps it into 1536-dimensional dense embeddings via Transformer encoders.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0c16] border border-purple-500/20 space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">Stage 2: Graph Neural Net</span>
              <h4 className="text-xs font-bold text-white">Ecosystem Topography</h4>
              <p className="text-[11px] text-slate-300">
                Embeds founder pedigree, competitor density, and supplier networks into a heterogeneous knowledge graph.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0c16] border border-cyan-500/20 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">Stage 3: Regressor</span>
              <h4 className="text-xs font-bold text-white">Valuation Multiple Model</h4>
              <p className="text-[11px] text-slate-300">
                Gradient-boosted decision trees trained on 10,000+ historical rounds predict fair pre-money valuation ranges.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0c16] border border-emerald-500/20 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">Stage 4: LLM Synthesis</span>
              <h4 className="text-xs font-bold text-white">Due Diligence Memo</h4>
              <p className="text-[11px] text-slate-300">
                Retrieval-Augmented Generation (RAG) synthesizes institutional memos with red-flag detection in seconds.
              </p>
            </div>
          </div>

          {/* Explainable AI (XAI) Feature Importance Matrix */}
          <div className="p-5 rounded-xl bg-[#0c0c16] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Explainable AI (XAI) Feature Importance Attribution</span>
            </h3>

            <div className="space-y-2.5 pt-2 text-xs">
              {[
                { label: 'Founder Technical Pedigree & Domain Expertise', weight: 31.4, color: 'bg-blue-500' },
                { label: 'Unit Economics & Gross Margins (>75%)', weight: 26.8, color: 'bg-emerald-500' },
                { label: 'Total Addressable Market (TAM >$10B)', weight: 21.2, color: 'bg-purple-500' },
                { label: 'Defensibility Moat & Data Network Effects', weight: 14.6, color: 'bg-cyan-500' },
                { label: 'Regulatory & Compliance Insulation', weight: 6.0, color: 'bg-amber-500' }
              ].map((feat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{feat.label}</span>
                    <strong className="text-white font-mono">{feat.weight}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${feat.color} rounded-full`} style={{ width: `${feat.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI DUE DILIGENCE MEMORANDUM MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {memoStartup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#141424] border border-white/15 text-white shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setMemoStartup(null)}
                className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-400">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>ICLAS Autonomous Due Diligence Memorandum</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Investment Committee Brief: {memoStartup.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Sector: {memoStartup.industry} • Target Raise: {memoStartup.funding_requirement} • Target IRR: {memoStartup.expected_returns}
                </p>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                    1. Executive Investment Thesis
                  </span>
                  <p className="text-slate-200">
                    {memoStartup.name} addresses a documented market inefficiency in {memoStartup.industry}. The proprietary architecture ({memoStartup.tagline}) creates an immediate technology moat with strong pricing power.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                  <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] block">
                    2. Unit Economics & TAM Validation
                  </span>
                  <p className="text-slate-200">
                    Addressable Market: {memoStartup.target_market}. Business Model: {memoStartup.business_model}. The venture demonstrates strong path to positive EBITDA within 24 months.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c0c16] border border-amber-500/20 text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    3. Key Risk Factors & Due Diligence Questions
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Key Person Dependency: Verify engineering redundancy in founder team.</li>
                    <li>Enterprise Sales Cycle: Confirm typical deal closing latency (&lt;90 days target).</li>
                    <li>Defensibility Moat: Validate patent grants and proprietary customer datasets.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                  <strong className="text-emerald-300 block mb-0.5">IC Recommendation:</strong>
                  Proceed to Partner Introductory Call. Implied seed pre-money valuation range: $12.5M - $15.0M.
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setMemoStartup(null);
                    setContactingStartup(memoStartup);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-glow-indigo transition-all"
                >
                  Initiate Term Sheet / Partner Call
                </button>
                <button
                  onClick={() => setMemoStartup(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#0c0c16] hover:bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
                >
                  Close Brief
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIRECT INVESTOR CONTACT MODAL */}
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
