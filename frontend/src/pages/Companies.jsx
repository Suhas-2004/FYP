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
  Clock,
  Plane,
  Target,
  ShieldCheck,
  Check,
  BarChart3
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

// Curated 6-Year Turnaround Rate & Multiplier Data for Comparative Matrix
const COMPARATIVE_RATES_DATA = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    sector: 'Technology',
    ticker: 'AAPL',
    crisisWindow: '2022–2023 Zhengzhou Shock',
    rateMetric: '+33.3% — +64.9%',
    metricLabel: 'Net Margin Supercycle',
    cashBuffer: '$118.3B FCF',
    category: 'mnc'
  },
  {
    id: 'netflix',
    name: 'Netflix Inc.',
    sector: 'Media',
    ticker: 'NFLX',
    crisisWindow: '2011 Qwikster Backlash',
    rateMetric: '$100M → $250B Cap',
    metricLabel: 'Original IP Pivot',
    cashBuffer: '$6.9B FCF',
    category: 'mnc'
  },
  {
    id: 'marvel',
    name: 'Marvel Entertainment',
    sector: 'Media',
    ticker: 'MVL',
    crisisWindow: '1996 Ch.11 Bankruptcy',
    rateMetric: '$525M → $4.24B Exit',
    metricLabel: 'Non-Recourse Financing',
    cashBuffer: '$30B+ MCU Box Office',
    category: 'growth'
  },
  {
    id: 'lego',
    name: 'The LEGO Group',
    sector: 'Retail',
    ticker: 'LEGO',
    crisisWindow: '2004 $800M Debt Crisis',
    rateMetric: '12k → 6k SKUs Halved',
    metricLabel: '#1 Global Toymaker',
    cashBuffer: '30% Margin Rebound',
    category: 'mnc'
  },
  {
    id: 'tesla',
    name: 'Tesla Motors',
    sector: 'Automobile',
    ticker: 'TSLA',
    crisisWindow: '2008 & 2018 Production Hell',
    rateMetric: '10x Capacity Ramp',
    metricLabel: 'Gigafactory Scaling',
    cashBuffer: '$1T+ Market Cap Peak',
    category: 'growth'
  },
  {
    id: 'bestbuy',
    name: 'Best Buy Co.',
    sector: 'Retail',
    ticker: 'BBY',
    crisisWindow: '2012 Amazon Showrooming',
    rateMetric: '+350% Stock Surge',
    metricLabel: 'Renew Blue Price Match',
    cashBuffer: '$1.4B Cost Savings',
    category: 'mnc'
  },
  {
    id: 'ford',
    name: 'Ford Motor Company',
    sector: 'Automobile',
    ticker: 'F',
    crisisWindow: '2006 $12.7B Loss',
    rateMetric: '$23.6B Buffer Line',
    metricLabel: '$0 Federal Bailout Needed',
    cashBuffer: '$4.2B Cost Cuts',
    category: 'mnc'
  },
  {
    id: 'block',
    name: 'Block, Inc. (Square)',
    sector: 'FinTech',
    ticker: 'SQ',
    crisisWindow: '2022 Post-Pandemic Contraction',
    rateMetric: '+45% Gross Profit',
    metricLabel: 'Cash App Ecosystem Sync',
    cashBuffer: '$1.2B Op Income',
    category: 'growth'
  },
  {
    id: 'paypal',
    name: 'PayPal Holdings',
    sector: 'FinTech',
    ticker: 'PYPL',
    crisisWindow: '2022 Checkout Saturation',
    rateMetric: '$1.5T+ TPV Scale',
    metricLabel: 'Braintree Unbranded Flow',
    cashBuffer: '$5.0B FCF',
    category: 'growth'
  }
];

export default function Companies({ setActiveTab, setSelectedCompanyId, selectedCompanyId, theme }) {
  const [sector, setSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [detailCompany, setDetailCompany] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState('revenue');

  // Comparative Table Filter Options (Matching Reference Layout)
  const [includeAutoTriage, setIncludeAutoTriage] = useState(true);
  const [rateFilterCategory, setRateFilterCategory] = useState('all'); // 'all' | 'mnc' | 'growth'
  const [hoveredRowId, setHoveredRowId] = useState(null);
  
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
        window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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

  const filteredRatesData = COMPARATIVE_RATES_DATA.filter(item => {
    if (rateFilterCategory === 'all') return true;
    return item.category === rateFilterCategory;
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.04, x: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleBackToDirectory}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-dark-850 border border-slate-300/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm transition-all group"
              >
                <ArrowLeft className="w-4 h-4 text-brand-amber group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Companies Directory</span>
              </motion.button>

              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>/</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{detailCompany.name}</span>
                <span>/</span>
                <span className="text-brand-caramel dark:text-brand-amber font-bold">Previous 6-Year Dossier (2019 – 2024)</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewStrategy(detailCompany.id)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta hover:opacity-95 text-white font-bold text-xs shadow-glow-amber transition-all"
              >
                <span>View Actionable Strategy Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </MotionSection>

        {/* Hero Company Dossier Header */}
        <MotionSection direction="up" delay={0.05}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/90 dark:border-slate-800/80">
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
                    <span className="px-2.5 py-1 text-xs font-semibold bg-brand-amber/15 text-brand-caramel dark:text-brand-amber rounded-lg border border-brand-amber/35">
                      {detailCompany.sector}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <span>Market Cap: <strong className="text-slate-900 dark:text-slate-200">{detailCompany.market_cap}</strong></span>
                    <span>•</span>
                    <span>Current CEO: <strong className="text-slate-900 dark:text-slate-200">{detailCompany.leadership?.current_ceo}</strong></span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold">
                      {detailCompany.crisis_info?.recovery_status || 'Analyzed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6-Year Window Prominent Tag */}
              <div className="p-4 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 text-left lg:text-right shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-mono text-brand-caramel dark:text-brand-amber font-bold uppercase tracking-wider">Analysis Scope</div>
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
                  <Users className="w-3.5 h-3.5 text-brand-amber mr-1.5 flex-shrink-0" />
                  <span>Founding Background & Roots:</span>
                </div>
                <div className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  {detailCompany.leadership?.founder}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-medium">
                  {detailCompany.leadership?.founder_summary || detailCompany.leadership?.company_background}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
                  <span>Executive Turnaround Summary:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs font-medium">
                  {detailCompany.executive_analysis_paragraph}
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* SECTION 2: 6-YEAR FINANCIAL METRIC CHARTS (2019 - 2024) */}
        {detailCompany.six_year_financials && detailCompany.six_year_financials.length > 0 && (
          <MotionSection direction="up" delay={0.15}>
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800/80">
                <div>
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white flex items-center">
                    <Activity className="w-5 h-5 text-brand-amber mr-2" />
                    <span>6-Year Longitudinal Financial Indicators (2019 – 2024)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Strict longitudinal trendlines across revenue, margins, cash flows, and order books.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-dark-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setActiveMetricTab('revenue')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeMetricTab === 'revenue'
                        ? 'bg-brand-amber text-dark-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Revenue Growth (%)
                  </button>
                  <button
                    onClick={() => setActiveMetricTab('cash_flow')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeMetricTab === 'cash_flow'
                        ? 'bg-brand-amber text-dark-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Operating Cash Flow ($B)
                  </button>
                  <button
                    onClick={() => setActiveMetricTab('roe')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeMetricTab === 'roe'
                        ? 'bg-brand-amber text-dark-950 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    ROE & Net Margins (%)
                  </button>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {activeMetricTab === 'revenue' ? (
                    <BarChart data={detailCompany.six_year_financials}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2d1e15' : '#e8dcce'} />
                      <XAxis dataKey="year" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} unit="%" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1c120c' : '#fdfaf5', 
                          borderColor: theme === 'dark' ? '#453022' : '#dcceb9',
                          borderRadius: '12px',
                          color: theme === 'dark' ? '#fff' : '#24160d',
                          fontSize: '12px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="revenue_growth" fill="#d97706" name="Revenue Growth (%)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="net_income_growth" fill="#e05a36" name="Net Income Growth (%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : activeMetricTab === 'cash_flow' ? (
                    <LineChart data={detailCompany.six_year_financials}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2d1e15' : '#e8dcce'} />
                      <XAxis dataKey="year" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} unit="$B" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1c120c' : '#fdfaf5', 
                          borderColor: theme === 'dark' ? '#453022' : '#dcceb9',
                          borderRadius: '12px',
                          color: theme === 'dark' ? '#fff' : '#24160d',
                          fontSize: '12px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cash_flow" stroke="#10b981" strokeWidth={3} name="Operating Cash Flow ($B)" dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="order_book" stroke="#d97706" strokeWidth={2} name="Order Book / Backlog ($B)" strokeDasharray="4 4" />
                    </LineChart>
                  ) : (
                    <BarChart data={detailCompany.six_year_financials}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#2d1e15' : '#e8dcce'} />
                      <XAxis dataKey="year" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} unit="%" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1c120c' : '#fdfaf5', 
                          borderColor: theme === 'dark' ? '#453022' : '#dcceb9',
                          borderRadius: '12px',
                          color: theme === 'dark' ? '#fff' : '#24160d',
                          fontSize: '12px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="roe" fill="#10b981" name="Return on Equity (%)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="debt_growth" fill="#f43f5e" name="Debt Leverage (%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </MotionSection>
        )}

        {/* SECTION 3: 2019-2024 DOWNFALLS, PUMPS & STRATEGIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Downfalls Box */}
          <MotionSection direction="left" delay={0.2}>
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-4 shadow-lg">
              <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-heading font-bold text-base pb-3 border-b border-rose-500/20">
                <TrendingDown className="w-5 h-5" />
                <span>6-Year Crisis Downfalls & Shocks (2019 – 2024)</span>
              </div>
              {downfalls.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 font-medium">No major downfall reported in 6-year scope.</p>
              ) : (
                downfalls.map((df, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-500/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-rose-800 dark:text-rose-300 text-sm">{df.title}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold">{df.period}</span>
                    </div>
                    <div className="text-rose-900 dark:text-rose-200 font-semibold">{df.move_data}</div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium"><strong className="text-slate-900 dark:text-white">Why it occurred:</strong> {df.reason_behind_move}</p>
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-dark-900/80 border border-rose-500/20 text-slate-800 dark:text-slate-200 font-medium">
                      <strong className="text-brand-amber">Emergency Action Deployed:</strong> {df.strategy_implemented}
                    </div>
                  </div>
                ))
              )}
            </div>
          </MotionSection>

          {/* Pumps & Rebounds Box */}
          <MotionSection direction="right" delay={0.2}>
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-lg">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-heading font-bold text-base pb-3 border-b border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
                <span>6-Year Operational Pumps & Catalysts (2019 – 2024)</span>
              </div>
              {pumps.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 font-medium">No major pump catalyst reported.</p>
              ) : (
                pumps.map((pm, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{pm.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">{pm.period}</span>
                    </div>
                    <div className="text-emerald-900 dark:text-emerald-200 font-semibold">{pm.move_data}</div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium"><strong className="text-slate-900 dark:text-white">Growth Engine:</strong> {pm.reason_behind_move}</p>
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-dark-900/80 border border-emerald-500/20 text-slate-800 dark:text-slate-200 font-medium">
                      <strong className="text-emerald-600 dark:text-emerald-400">Execution Strategy:</strong> {pm.strategy_implemented}
                    </div>
                  </div>
                ))
              )}
            </div>
          </MotionSection>
        </div>

        {/* SECTION 4: 2019-2024 MILESTONES & TURNING POINTS TIMELINE */}
        {detailCompany.business_info?.major_corporate_events && (
          <MotionSection direction="up" delay={0.25}>
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/90 dark:border-slate-800/80">
                <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white flex items-center">
                  <Calendar className="w-4 h-4 text-brand-amber mr-2" />
                  <span>2019–2024 Corporate Turning Points & Milestones</span>
                </h4>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Strictly 6-Year Scope</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {detailCompany.business_info.major_corporate_events.map((ev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/95 dark:bg-dark-950/90 border border-slate-200/90 dark:border-slate-800/80 space-y-1.5 shadow-sm">
                    <span className="text-xs font-mono font-bold text-brand-caramel dark:text-brand-amber px-2 py-0.5 rounded bg-brand-amber/15 border border-brand-amber/35">
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
            <div className="p-5 rounded-2xl bg-white/95 dark:bg-dark-900/90 border border-slate-200/90 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-brand-caramel dark:text-brand-amber uppercase tracking-wider flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Active 6-Year Projects</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {detailCompany.business_info?.major_projects?.map((p, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-brand-amber font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 dark:bg-dark-900/90 border border-slate-200/90 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Strategic Alliances & Partners</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {detailCompany.business_info?.collaborations?.map((c, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 dark:bg-dark-900/90 border border-slate-200/90 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-brand-terracotta uppercase tracking-wider flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Target Sectors & Capital Deployment</span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {detailCompany.business_info?.investment_sectors?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-brand-caramel dark:text-brand-amber text-[10px] font-mono font-semibold border border-amber-500/25">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-amber/20 via-brand-caramel/20 to-brand-terracotta/20 border border-brand-amber/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-amber via-brand-caramel to-brand-terracotta text-white font-bold text-xs shadow-glow-amber flex items-center space-x-2 transition-all w-fit"
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
  // VIEW 1: ENTERPRISE DIRECTORY (REFERENCE-INSPIRED STYLING)
  // =========================================================================
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* =========================================================================
          1. HERO HEADER WITH COOL AIRPLANE ANIMATION & MILESTONE ROLLOUT BANNER
          ========================================================================= */}
      <MotionSection direction="down" duration={0.4}>
        <div className="relative pt-2 pb-6">
          
          {/* Top Row: Editorial Headline on Left + Animated Vintage Airplane with Ribbon Banner on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Bold Headline & Pill Search Bar */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ICLAS CORPORATE FORENSICS & RECOVERY MATRIX</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-heading font-black text-slate-900 dark:text-white leading-[1.12] tracking-tight">
                Unlock 6-Year Corporate <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-700 via-emerald-700 to-amber-700 dark:from-teal-300 dark:via-emerald-400 dark:to-amber-400 bg-clip-text text-transparent">
                  Turnaround Intelligence
                </span> <br className="hidden sm:inline" />
                & Crisis Forensics.
              </h1>

              {/* Reference-Style Pill Search & CTA Input Bar */}
              <div className="relative max-w-xl flex items-center p-1.5 rounded-full bg-white/95 dark:bg-dark-900/90 border border-slate-300/90 dark:border-slate-700/90 shadow-lg backdrop-blur-md focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/15 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-4 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search 11 benchmark titans, downfalls, recovery rates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium pr-2"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const el = document.getElementById('comparative-matrix-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#fcd4cc] dark:bg-rose-900/80 hover:bg-[#fabcb0] dark:hover:bg-rose-800 text-[#852a21] dark:text-rose-100 font-heading font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
                >
                  <span>Explore Dossiers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>

            </div>

            {/* Right Column: Animated Airplane + Ribbon Banner + Editorial Summary */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-4">
              
              {/* Airplane & Ribbon Banner SVG Graphic */}
              <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center lg:justify-end animate-plane-hover">
                <div className="relative flex items-center">
                  
                  {/* Stylized Twin-Propeller Light Airplane SVG */}
                  <div className="relative z-10 w-28 h-16 filter drop-shadow-md">
                    <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      {/* Body */}
                      <path d="M15 35 Q30 22 75 24 Q105 25 110 35 Q105 45 75 46 Q30 48 15 35 Z" fill="#6ee7b7" stroke="#047857" strokeWidth="2" />
                      {/* Wings */}
                      <path d="M50 35 L40 8 Q55 6 70 8 L62 35 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
                      <path d="M52 35 L44 58 Q58 60 68 58 L63 35 Z" fill="#34d399" stroke="#047857" strokeWidth="1.5" />
                      {/* Cockpit Glass */}
                      <path d="M68 25 Q78 25 88 29 L82 34 L66 34 Z" fill="#065f46" />
                      {/* Tail Fin */}
                      <path d="M18 35 L5 16 Q14 14 24 16 L22 35 Z" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
                      {/* Propeller Hub */}
                      <rect x="110" y="31" width="4" height="8" rx="2" fill="#047857" />
                      <line x1="112" y1="18" x2="112" y2="52" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" className="animate-spin-slow origin-center" />
                      {/* Wheels */}
                      <circle cx="58" cy="50" r="4" fill="#065f46" />
                      <circle cx="20" cy="40" r="2.5" fill="#065f46" />
                    </svg>
                  </div>

                  {/* Trailing Ribbon Banner (Waving keyframe animation) */}
                  <div className="relative -ml-4 z-0 animate-banner-flutter">
                    <div className="px-4 py-2 rounded-r-xl rounded-l-sm bg-gradient-to-r from-teal-100 via-emerald-100 to-[#d8f3dc] dark:from-emerald-950 dark:via-teal-950 dark:to-dark-900 border-y-2 border-r-2 border-emerald-600/60 dark:border-emerald-500/50 shadow-md">
                      <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-emerald-900 dark:text-emerald-300 uppercase">
                        6-YEAR SCOPE 2019-2024
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Sub-description matching reference styling */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-normal">
                The deeper the longitudinal corporate forensics, the higher the survival velocity and turnaround probability we engineer.
              </p>

            </div>

          </div>

          {/* =========================================================================
              ROLL-OUT PROGRESS TIMELINE BANNER (Direct Reference Illustration)
              ========================================================================= */}
          <div className="mt-12 pt-4 relative">
            <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#e8f7f2] via-[#f0fbf7] to-[#e4f3ed] dark:from-[#11241f] dark:via-[#162e27] dark:to-[#0f1f1a] border border-emerald-300/70 dark:border-emerald-800/60 p-6 sm:p-8 overflow-hidden shadow-sm">
              
              {/* Background Foliage Tree Accents (Matching Reference Illustration) */}
              <div className="absolute right-4 bottom-2 flex items-end space-x-2 pointer-events-none opacity-80">
                {/* Yellow Autumn Tree */}
                <div className="flex flex-col items-center">
                  <div className="w-8 sm:w-10 h-14 sm:h-18 rounded-full bg-gradient-to-t from-amber-400 to-yellow-300 shadow-sm" />
                  <div className="w-1.5 h-6 bg-amber-800 rounded-sm" />
                </div>
                {/* Purple Tree */}
                <div className="flex flex-col items-center -ml-2">
                  <div className="w-10 sm:w-12 h-16 sm:h-20 rounded-full bg-gradient-to-t from-purple-700 to-purple-500 shadow-sm" />
                  <div className="w-1.5 h-7 bg-purple-950 rounded-sm" />
                </div>
              </div>

              {/* Milestone Pin Headers */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
                
                {/* Left Pin: Active Members / Titans */}
                <div className="flex items-center space-x-2.5">
                  <div className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white font-mono font-bold text-xs shadow-sm flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Dossiers Tracked: 11 MNCs</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
                    Complete 6-Year Balance Sheet Forensics
                  </span>
                </div>

                {/* Right Pin: Goal */}
                <div className="px-3.5 py-1.5 rounded-lg bg-[#f8d7da] dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-mono font-bold text-xs shadow-sm flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Target: 2026 Resilience Goal</span>
                </div>

              </div>

              {/* Unfurling Teal Carpet Track with Progress Cylindrical Roll */}
              <div className="relative w-full h-14 sm:h-16 flex items-center my-2">
                
                {/* Rolled Out Teal Track */}
                <div className="w-3/4 sm:w-4/5 h-10 sm:h-12 bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 rounded-l-xl flex items-center px-4 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-white/10 opacity-30 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <span className="relative z-10 text-[11px] sm:text-xs font-mono font-bold text-white tracking-wider flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                    <span>6-YEAR LONGITUDINAL CRISIS MATRIX // 100% AUDITED</span>
                  </span>
                </div>

                {/* Cylindrical Roll End (Carpet Roll Cylinder) */}
                <div className="w-6 sm:w-8 h-12 sm:h-14 -ml-1 rounded-r-lg bg-teal-400 border-2 border-teal-800 shadow-md flex items-center justify-center">
                  <div className="w-2.5 sm:w-3.5 h-8 sm:h-10 rounded-full bg-teal-900/60" />
                </div>

                {/* Unrolled Track Guide */}
                <div className="flex-1 h-3 bg-emerald-200/60 dark:bg-emerald-950/60 border-t border-b border-emerald-400/40 rounded-r-xl" />

              </div>

              {/* Collaborative Figures Footnote */}
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-900 dark:text-emerald-300 pt-2 font-semibold">
                <span>● 120+ Micro Crisis Indicators</span>
                <span>● 8 Industry Sectors</span>
                <span>● 94.8% Vector Cosine Accuracy</span>
              </div>

            </div>
          </div>

        </div>
      </MotionSection>


      {/* =========================================================================
          2. COMPARATIVE RATES & FORENSICS CARD (DIRECT REFERENCE DESIGN)
          ========================================================================= */}
      <MotionSection direction="up" delay={0.1}>
        <div id="comparative-matrix-card" className="card-curl rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Top Controls Bar: Checkbox & Radio Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800/80">
            
            {/* Left label */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Comparative 6-Year Turnaround Playbooks</span>
            </div>

            {/* Right Controls: Auto-Pay / Auto-Triage Checkbox + Fixed/Variable Radio Tabs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
              
              {/* Checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={includeAutoTriage}
                  onChange={(e) => setIncludeAutoTriage(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span>Include Triage Playbooks</span>
              </label>

              {/* Radio Selector Tabs */}
              <div className="flex items-center space-x-3 bg-slate-100 dark:bg-dark-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold">
                <button
                  onClick={() => setRateFilterCategory('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rateFilterCategory === 'all'
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All 11 Titans
                </button>
                <button
                  onClick={() => setRateFilterCategory('mnc')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rateFilterCategory === 'mnc'
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Benchmark MNCs
                </button>
                <button
                  onClick={() => setRateFilterCategory('growth')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    rateFilterCategory === 'growth'
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Turnaround Surges
                </button>
              </div>

            </div>

          </div>

          {/* 2-Column Split: Editorial Title & Action on Left, Clean Striped Table on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
            
            {/* Left Column: Editorial Serif Title & Pill Button */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-block border-b-2 border-slate-900 dark:border-white pb-1">
                <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                  Recovery Rates & Metrics
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                Check out the recovery rates & margins negotiated across 6 years.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Compare historical liquidity squeezes, pandemic shocks, and resulting cash flow buffers engineered by top corporate leadership teams.
              </p>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, translateY: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const el = document.getElementById('companies-grid-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 rounded-full bg-[#fcd4cc] dark:bg-rose-900/80 hover:bg-[#fabcb0] dark:hover:bg-rose-800 text-[#852a21] dark:text-rose-100 font-heading font-bold text-sm shadow-sm transition-all inline-flex items-center space-x-2"
                >
                  <span>Explore Company Dossiers</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

            </div>

            {/* Right Column: Clean Striped Data Table matching the Reference Design */}
            <div className="lg:col-span-7 overflow-x-auto">
              <div className="min-w-[480px]">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="col-span-5 font-semibold">Company / Sector</div>
                  <div className="col-span-4 font-semibold">Crisis Period</div>
                  <div className="col-span-3 font-semibold text-right">Recovery Rate</div>
                </div>

                {/* Striped Interactive Data Rows */}
                <div className="space-y-1.5 pt-2">
                  {filteredRatesData.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleOpenCompanyPage(item.id)}
                      onMouseEnter={() => setHoveredRowId(item.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                      className={`grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                        hoveredRowId === item.id
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-slate-900 dark:text-white border border-teal-200 dark:border-teal-800/60 shadow-sm'
                          : 'bg-slate-50/80 dark:bg-dark-950/60 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      {/* Company Name & Sector */}
                      <div className="col-span-5 flex items-center space-x-2.5">
                        <CompanyLogo
                          companyId={item.id}
                          ticker={item.ticker}
                          className="w-7 h-7 shadow-xs flex-shrink-0"
                          size={28}
                        />
                        <div className="truncate">
                          <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {item.sector}
                          </span>
                        </div>
                      </div>

                      {/* Crisis Window */}
                      <div className="col-span-4 text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                        {item.crisisWindow}
                      </div>

                      {/* Recovery Rate */}
                      <div className="col-span-3 text-right">
                        <span className="font-mono font-bold text-xs sm:text-sm text-teal-700 dark:text-teal-400">
                          {item.rateMetric}
                        </span>
                        {includeAutoTriage && (
                          <span className="block text-[10px] text-slate-400 font-mono truncate">
                            {item.metricLabel}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </MotionSection>


      {/* =========================================================================
          3. SECTOR FILTER TABS & DIRECTORY GRID (6-YEAR SCOPE)
          ========================================================================= */}
      <div id="companies-grid-directory" className="space-y-6 pt-4">
        
        {/* Sector Tabs Bar */}
        <MotionSection direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/90 dark:border-slate-800/80">
            
            <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
              {SECTORS.map((s) => {
                const isSelected = sector === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'bg-teal-600 text-white font-bold shadow-md'
                        : 'bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-2 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Scope: <strong>2019 – 2024 (6 Years)</strong></span>
              <span>•</span>
              <span><strong>{filteredCompanies.length}</strong> Dossiers</span>
            </div>

          </div>
        </MotionSection>

        {/* Directory Grid */}
        {loadingList ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Loading 6-year corporate intelligence dossiers...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800/80 space-y-3">
            <ShieldAlert className="w-10 h-10 text-teal-600 mx-auto" />
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
                  className="glass-panel p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 hover:border-teal-500/60 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between group space-y-4"
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
                          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
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
                    <div className="flex items-center justify-between text-[11px] font-mono py-1 px-2.5 rounded-lg bg-teal-500/10 border border-teal-500/25 text-teal-800 dark:text-teal-300 font-bold mb-3">
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
                  <div className="pt-3 border-t border-slate-200/90 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                      <span>Rev Growth: <strong className="text-teal-600 dark:text-teal-400">{c.financial_summary?.latest_revenue_growth}%</strong></span>
                      <span>ROE: <strong className="text-emerald-600 dark:text-emerald-400">{c.financial_summary?.latest_roe}%</strong></span>
                      <span>Cash Flow: <strong className="text-amber-600 dark:text-amber-400">${c.financial_summary?.latest_cash_flow}B</strong></span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCompanyPage(c.id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500/15 to-emerald-500/15 hover:from-teal-600 hover:to-emerald-600 hover:text-white text-teal-800 dark:text-teal-300 border border-teal-500/35 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm group-hover:shadow-md"
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

    </div>
  );
}
