import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building2,
  Search,
  ListOrdered,
  Briefcase,
  TrendingUp,
  Cpu,
  Database,
  Layers,
  Zap,
  Target,
  BarChart3,
  Compass,
  CheckCircle2,
  Terminal,
  Sliders,
  Play,
  RotateCcw,
  Users,
  Award,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Phone,
  FileText,
  PieChart,
  ArrowUpRight,
  Globe,
  Radio,
  Clock,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import GeoGlobe from '../components/earth-pulse/GeoGlobe';

// ============================================================================
// TITAN HISTORICAL CASE DATA FOR INTERACTIVE ENGINE
// ============================================================================
const TITAN_CASES = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    crisisYear: '1997',
    recoveryYear: '2001-2007',
    crisisFactor: '90 Days from Bankruptcy',
    dropDetail: '350+ fragmented hardware SKUs, $1B annual loss, cash reserves down to 3 months.',
    recoveryCatalyst: 'Steve Jobs 2x2 Matrix (slashed 70% of products), $150M Microsoft investment, iMac & iPod launches.',
    growthMultiple: 'From Near-Bankruptcy to $3T+ Market Cap (1,200x+)',
    color: 'from-amber-500 to-orange-600',
    logoColor: '#A2AAAD',
    tags: ['Tech & Hardware', 'SKU Simplification', 'Ecosystem Pivot']
  },
  {
    id: 'marvel',
    name: 'Marvel Entertainment',
    ticker: 'MVL',
    crisisYear: '1996',
    recoveryYear: '2002-2008',
    crisisFactor: 'Chapter 11 Bankruptcy',
    dropDetail: '$583M junk bond debt, comic speculator bubble burst, board proxy war.',
    recoveryCatalyst: 'Leveraged comic IP licensing (Spider-Man, X-Men), formed Marvel Studios with $525M non-recourse debt, leading to MCU.',
    growthMultiple: 'Acquired by Disney for $4.24B ($30B+ Box Office)',
    color: 'from-red-500 to-rose-600',
    logoColor: '#E23636',
    tags: ['Media & Entertainment', 'IP Licensing', 'Non-Recourse Financing']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    ticker: 'NFLX',
    crisisYear: '2011',
    recoveryYear: '2013-2016',
    crisisFactor: 'Qwikster Debacle & 75% Stock Crash',
    dropDetail: 'Lost 800,000 subscribers in 3 months; market cap dropped from $16B to $3B.',
    recoveryCatalyst: 'Absorbed public backlash, unbundled DVD by mail, and invested $100M into original programming (House of Cards).',
    growthMultiple: 'Streaming Supremacy ($250B+ Market Cap)',
    color: 'from-rose-500 to-red-700',
    logoColor: '#E50914',
    tags: ['Streaming & Tech', 'Aggressive Pivot', 'Original Content Engine']
  },
  {
    id: 'lego',
    name: 'The LEGO Group',
    ticker: 'LEGO',
    crisisYear: '2004',
    recoveryYear: '2006-2015',
    crisisFactor: '$800M Debt & Near Liquidation',
    dropDetail: '30% negative operational margins, overdiversification into theme parks and non-brick toys.',
    recoveryCatalyst: 'Divested LEGOLAND parks, halved brick piece variants from 12,000 to 6,000, engaged adult fans (AFOL) & film franchises.',
    growthMultiple: "World's #1 Most Profitable Toy Maker",
    color: 'from-amber-500 to-yellow-600',
    logoColor: '#D11013',
    tags: ['Consumer Goods', 'Core SKU Focus', 'Community Co-Creation']
  },
  {
    id: 'ibm',
    name: 'IBM',
    ticker: 'IBM',
    crisisYear: '1993',
    recoveryYear: '1995-2000',
    crisisFactor: '$8.1B Record Corporate Loss',
    dropDetail: 'Mainframe market disruption by personal computers; on the brink of corporate breakup.',
    recoveryCatalyst: 'Lou Gerstner kept the company unified, shifted focus from hardware to IT enterprise services & software.',
    growthMultiple: 'Global IT Services Powerhouse ($180B+ Rebound)',
    color: 'from-blue-600 to-indigo-700',
    logoColor: '#0530AD',
    tags: ['Enterprise Software', 'Unified Services Pivot', 'Cultural Overhaul']
  },
  {
    id: 'tesla',
    name: 'Tesla Motors',
    ticker: 'TSLA',
    crisisYear: '2008 & 2018',
    recoveryYear: '2010 / 2020',
    crisisFactor: 'Production Hell & Zero Cash Days',
    dropDetail: 'Hours away from payroll insolvency in Dec 2008; Model 3 ramp crisis burning $1B/quarter.',
    recoveryCatalyst: 'Secured Daimler/DOE loans, built tent manufacturing lines, vertical software integration, and hyper-automated gigafactories.',
    growthMultiple: 'World’s Most Valuable Carmaker ($1T+ Peak)',
    color: 'from-red-600 to-rose-700',
    logoColor: '#E82127',
    tags: ['Automotive & Energy', 'Vertical Integration', 'Emergency Financing']
  }
];

const STARTUP_POSTMORTEMS = [
  {
    name: 'Quibi',
    loss: '$1.75B Lost',
    reason: 'Format Arrogance & No Social Sharing',
    matchedTitan: 'Netflix (2011 Pivot)',
    lesson: 'Mobile-only short form failed; should have adapted to user social behaviors like Netflix pivot.'
  },
  {
    name: 'WeWork',
    loss: '$47B Valuation Crash',
    reason: 'Hyper-Lease Liabilities & Tech Pretension',
    matchedTitan: 'LEGO (2004 Asset Divestment)',
    lesson: 'Asset-heavy expansion required immediate non-core divestment like LEGO theme parks.'
  },
  {
    name: 'Theranos',
    loss: '$9B Vaporized',
    reason: 'Secretive Non-Working Tech & Fraud',
    matchedTitan: 'Apple (1997 Radical Focus)',
    lesson: 'Should have simplified down to 1 validated functional test instead of faking 200.'
  },
  {
    name: 'Fast',
    loss: '$120M Burned',
    reason: 'Sky-high Burn ($10M/mo) vs $600k ARR',
    matchedTitan: 'Tesla (2008 Emergency Survival)',
    lesson: 'Must aggressively slash overhead to reach unit profitability before cash expires.'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function About({
  setActiveTab,
  setSelectedCompanyId,
  selectedPersona,
  theme,
  toggleTheme
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms for sunny organic background pills
  const shape1Y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const shape2Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const shape3Rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const heroCardY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  // Sandbox Simulator State
  const [runwayMonths, setRunwayMonths] = useState(6);
  const [burnMultiple, setBurnMultiple] = useState(2.8);
  const [headwindSeverity, setHeadwindSeverity] = useState(70);
  const [skuComplexity, setSkuComplexity] = useState('High'); // Low | Med | High | Extreme
  const [matchedTitan, setMatchedTitan] = useState(TITAN_CASES[0]);

  // Compute live match
  useEffect(() => {
    let bestId = 'apple';
    let matchScore = 88;
    let reason = '';

    if (runwayMonths <= 4 && burnMultiple > 3.0) {
      bestId = 'tesla';
      matchScore = Math.min(96, Math.floor(75 + burnMultiple * 4 + (24 - runwayMonths)));
      reason = 'Emergency Cash Squeeze & Rapid Burn Squeeze (Resembles Tesla 2008 & 2018 Production Hell)';
    } else if (skuComplexity === 'High' || skuComplexity === 'Extreme') {
      if (runwayMonths <= 6) {
        bestId = 'apple';
        matchScore = Math.min(98, Math.floor(82 + (headwindSeverity / 10) + (10 - runwayMonths)));
        reason = 'Portfolio Fragmentation & Critical Cash Cliff (Resembles Apple 1997 Quadrant Reset)';
      } else {
        bestId = 'lego';
        matchScore = Math.min(94, Math.floor(78 + (headwindSeverity / 12) + burnMultiple * 2));
        reason = 'Operational Over-Diversification & Variant Debt (Resembles LEGO 2004 Core Brick Revival)';
      }
    } else if (headwindSeverity >= 65) {
      if (burnMultiple >= 2.5) {
        bestId = 'netflix';
        matchScore = Math.min(95, Math.floor(80 + (headwindSeverity / 8)));
        reason = 'Sudden Market Headwind & Customer Churn Backlash (Resembles Netflix 2011 Qwikster Pivot)';
      } else {
        bestId = 'ibm';
        matchScore = Math.min(92, Math.floor(76 + (headwindSeverity / 10)));
        reason = 'Legacy Market Shift & Margin Compression (Resembles IBM 1993 Enterprise Services Pivot)';
      }
    } else {
      bestId = 'marvel';
      matchScore = Math.min(93, Math.floor(75 + burnMultiple * 3 + (15 - runwayMonths)));
      reason = 'Collapsing Core Monetization Requiring IP / Asset Unbundling (Resembles Marvel 1996 Chapter 11 Turnaround)';
    }

    const titanData = TITAN_CASES.find(t => t.id === bestId) || TITAN_CASES[0];
    setMatchedTitan({
      ...titanData,
      score: matchScore,
      matchReason: reason
    });
  }, [runwayMonths, burnMultiple, headwindSeverity, skuComplexity]);

  const handleLaunchToCompany = (companyId) => {
    if (setSelectedCompanyId) {
      setSelectedCompanyId(companyId);
    }
    setActiveTab('strategy-steps');
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const FAQS = [
    {
      q: 'How does ICLAS apply 1990s and 2000s turnaround heuristics to modern AI & SaaS startups?',
      a: 'Corporate survival follows invariant mathematical laws: cash runway cliffs, portfolio SKU fragmentation, margin compression, and channel lockouts. ICLAS uses vector cosine similarity over 6-year longitudinal financial indicators (T-3 to T+3) to match current startup metrics with historical crisis archetypes.'
    },
    {
      q: 'What is Case-Based Reasoning (CBR) in corporate advisory?',
      a: 'CBR solves new problems by finding similar past cases, adapting their verified solutions, and evaluating the outcome. Rather than hallucinating generic advice, ICLAS retrieves empirically validated playbooks executed by Fortune 500 leadership teams.'
    },
    {
      q: 'Can I track live markets and company stocks alongside historical cases?',
      a: 'Yes! The Market Dashboard module features real-time TradingView technical charts, financial overview widgets, market quote comparisons, and live sentiment gauges to monitor macroeconomic shifts alongside historical turnarounds.'
    },
    {
      q: 'How are startup post-mortems integrated with titan turnarounds?',
      a: 'ICLAS maps catastrophic venture failures (e.g. Quibi, WeWork, Fast, Theranos) directly against titan counterparts that faced identical failure modes but successfully engineered turnaround playbooks to survive.'
    }
  ];

  return (
    <div ref={containerRef} className="space-y-16 sm:space-y-24 pb-24 overflow-x-hidden font-sans">
      
      {/* =========================================================================
          1. ULTRA ATTRACTIVE SUNNY GOLD HERO SECTION (Matches Reference Design)
          ========================================================================= */}
      <section className="relative w-screen min-h-[92vh] lg:min-h-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F6CA45] text-[#111111] -mt-8 mb-12 px-6 sm:px-12 lg:px-16 pt-8 pb-16 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Layered Organic Smooth Geometric Shapes in Background (Parallax Driven) */}
        <motion.div 
          style={{ y: shape1Y }}
          className="absolute -right-20 top-16 w-[420px] sm:w-[580px] h-[340px] sm:h-[460px] rounded-[100px] sm:rounded-[140px] bg-[#ECA91E]/60 pointer-events-none z-0"
        />
        <motion.div 
          style={{ y: shape2Y, rotate: shape3Rotate }}
          className="absolute -right-12 bottom-12 w-[340px] sm:w-[480px] h-[320px] sm:h-[420px] rounded-[90px] sm:rounded-[130px] bg-[#EDA81E]/80 pointer-events-none z-0"
        />
        
        {/* Floating Crisp White Circle (Reference Design Element) */}
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 sm:right-[32%] top-[46%] sm:top-[44%] w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-white shadow-xl pointer-events-none z-0"
        />

        {/* Floating Ambient Sparkle Pill */}
        <div className="absolute left-8 top-1/3 w-3 h-3 rounded-full bg-white/70 animate-ping pointer-events-none" />

        {/* -------------------------------------------------------------
            TOP BRAND & QUICK ACTION PILL BAR (Matches Reference Header)
            ------------------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-2">
          
          {/* Brand Monogram Badge */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('about')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#111111] text-[#F6CA45] flex items-center justify-center font-heading font-black text-xl sm:text-2xl shadow-xl tracking-tighter border-2 border-black/10">
              <span>IC</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-[#111111] tracking-tight">ICLAS</span>
              <span className="block text-[10px] font-mono font-semibold tracking-wider text-[#111111]/70 uppercase">Corporate Intelligence</span>
            </div>
          </motion.div>

          {/* Quick Pill Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Action Pill 1: Explore Playbooks */}
            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('strategy-steps')}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-[#111111] font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>EXPLORE PLAYBOOKS</span>
              <ArrowRight className="w-4 h-4 text-[#111111]" />
            </motion.button>

            {/* Action Pill 2: Simulate Crisis */}
            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById('crisis-simulator-sandbox');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-[#111111] font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>SIMULATE CRISIS</span>
              <ArrowRight className="w-4 h-4 text-[#111111]" />
            </motion.button>

            {/* Quick Menu / Dashboard Icon */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab('overview')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-black transition-colors"
              title="Open Navigation Overview"
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>

          </div>
        </div>

        {/* -------------------------------------------------------------
            HERO MAIN CONTENT AREA (Heading, Subtitle & Bento Action Cards)
            ------------------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-10 sm:py-16">
          <div className="max-w-4xl space-y-6">
            
            {/* Main Giant High-Impact Neo-Grotesque Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-heading font-black tracking-tight text-[#111111] leading-[1.02] sm:leading-[1.03]"
            >
              Where corporate crisis meets strategic survival<span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white ml-2 align-baseline shadow-md animate-pulse"></span>
            </motion.h1>

            {/* Clean, Elegant Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl md:text-2xl text-[#111111]/85 font-medium max-w-2xl leading-relaxed"
            >
              Specialists in corporate turnaround intelligence, connecting startup survival with historical titan heuristics & AI Case-Based Reasoning.
            </motion.p>
          </div>

          {/* -------------------------------------------------------------
              INTERACTIVE FLOATING ACTION BENTO CARDS (Matches Reference Design)
              ------------------------------------------------------------- */}
          <motion.div 
            style={{ y: heroCardY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl"
          >
            
            {/* Card 1: Founder Track / Apply Playbook */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('strategy-steps')}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl border border-black/5 transition-all flex flex-col justify-between group cursor-pointer min-h-[190px]"
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#EDA81E]">Founder Track</span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#111111] mt-1 group-hover:text-amber-700 transition-colors">
                  I want to explore playbooks
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1.5 font-normal leading-snug">
                  Find your 6-year turnaround roadmap & crisis telemetry.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <div className="w-9 h-9 rounded-full bg-[#111111] group-hover:bg-[#EDA81E] text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
                {/* Tactile Illustrated Vector Badge */}
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-sm">
                  📝
                </div>
              </div>
            </motion.div>

            {/* Card 2: Investor Track / Evaluate Risk */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('investors-startups')}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl border border-black/5 transition-all flex flex-col justify-between group cursor-pointer min-h-[190px]"
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#E05A36]">Investor Track</span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#111111] mt-1 group-hover:text-amber-700 transition-colors">
                  I want to evaluate risk
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1.5 font-normal leading-snug">
                  Analyze CBR cosine similarity, burn rate stress tests & post-mortems.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <div className="w-9 h-9 rounded-full bg-[#111111] group-hover:bg-[#E05A36] text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
                {/* Tactile Illustrated Vector Badge */}
                <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl shadow-sm">
                  🔍
                </div>
              </div>
            </motion.div>

            {/* Card 3: Macro Markets Track */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('market-dashboard')}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl border border-black/5 transition-all flex flex-col justify-between group cursor-pointer min-h-[190px]"
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#0891B2]">Macro Intel Track</span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#111111] mt-1 group-hover:text-amber-700 transition-colors">
                  I want live market data
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1.5 font-normal leading-snug">
                  Live TradingView charts, sentiment gauges & real-time quotes.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <div className="w-9 h-9 rounded-full bg-[#111111] group-hover:bg-[#0891B2] text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
                {/* Tactile Illustrated Vector Badge */}
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xl shadow-sm">
                  📈
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* -------------------------------------------------------------
            FLOATING LIVE STATUS / HOTLINE PILL (Bottom Right of Hero)
            ------------------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono font-semibold text-[#111111]/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM OPERATIONAL // 11 BENCHMARK CORPORATE TITANS LOADED</span>
          </div>

          {/* Floating Pill on Bottom Right */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('companies')}
            className="ml-auto bg-white text-[#111111] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-heading font-bold text-xs sm:text-sm shadow-2xl border border-black/5 flex items-center space-x-2.5 cursor-pointer hover:shadow-glow-amber transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span>⚡ LIVE INTEL // 6 TITAN PLAYBOOKS ACTIVE</span>
          </motion.div>
        </div>

      </section>

      {/* =========================================================================
          2. PLAYFUL LIVE CRISIS TICKER / MARQUEE RIBBON
          ========================================================================= */}
      <section className="w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#111111] py-4 overflow-hidden border-y border-amber-500/30 select-none -mt-8">
        <div className="animate-marquee-infinite flex items-center space-x-8 text-xs sm:text-sm font-mono font-bold text-[#F6CA45] uppercase tracking-widest whitespace-nowrap">
          <span>🔥 APPLE 1997: 90 DAYS TO CASH ZERO ➔ $3T REBOUND</span>
          <span className="text-white/40">•</span>
          <span>⚡ NETFLIX 2011: QWIKSTER 75% STOCK CRASH ➔ ORIGINAL STREAMING GIANT</span>
          <span className="text-white/40">•</span>
          <span>🧱 LEGO 2004: $800M LIQUIDATION CRISIS ➔ WORLD'S #1 TOYMAKER</span>
          <span className="text-white/40">•</span>
          <span>🛡️ MARVEL 1996: CHAPTER 11 BANKRUPTCY ➔ $30B+ MCU FRANCHISE</span>
          <span className="text-white/40">•</span>
          <span>🚀 TESLA 2008: ZERO-CASH PRODUCTION HELL ➔ $1T+ AUTO LEADER</span>
          <span className="text-white/40">•</span>
          <span>💻 IBM 1993: $8.1B HISTORIC LOSS ➔ ENTERPRISE SERVICES LEADER</span>
          <span className="text-white/40">•</span>
          <span>🔥 APPLE 1997: 90 DAYS TO CASH ZERO ➔ $3T REBOUND</span>
          <span className="text-white/40">•</span>
          <span>⚡ NETFLIX 2011: QWIKSTER 75% STOCK CRASH ➔ ORIGINAL STREAMING GIANT</span>
          <span className="text-white/40">•</span>
          <span>🧱 LEGO 2004: $800M LIQUIDATION CRISIS ➔ WORLD'S #1 TOYMAKER</span>
          <span className="text-white/40">•</span>
          <span>🛡️ MARVEL 1996: CHAPTER 11 BANKRUPTCY ➔ $30B+ MCU FRANCHISE</span>
          <span className="text-white/40">•</span>
          <span>🚀 TESLA 2008: ZERO-CASH PRODUCTION HELL ➔ $1T+ AUTO LEADER</span>
          <span className="text-white/40">•</span>
          <span>💻 IBM 1993: $8.1B HISTORIC LOSS ➔ ENTERPRISE SERVICES LEADER</span>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE 3D EARTH GLOBE & GLOBAL CRISIS GEOGRAPHY
          ========================================================================= */}
      <section className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="relative rounded-3xl border border-[#dcceb9] dark:border-slate-800/80 bg-gradient-to-br from-[#1b120c] via-[#120c08] to-[#24160d] text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
            
            {/* Ambient Warm Golden Atmosphere */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-600/20 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>GEOGRAPHIC TURNAROUND TELEMETRY</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-heading font-black text-white leading-tight">
                  Global Forensics of <br />
                  <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                    Legendary Corporate Turnarounds
                  </span>
                </h2>

                <p className="text-amber-100/80 text-sm sm:text-base leading-relaxed font-normal">
                  Corporate distress is not isolated to Silicon Valley. Explore how iconic enterprises across North America, Europe, and Asia executed radical pivots to survive financial cliffs.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#1c120c]/90 border border-[#3d2719]">
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase block">Silicon Valley</span>
                    <span className="text-sm font-bold text-white">Apple, Tesla, Netflix</span>
                    <span className="text-[10px] text-amber-200/70 block mt-0.5">Cupertino • Los Gatos • Austin</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1c120c]/90 border border-[#3d2719]">
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase block">Europe & East Coast</span>
                    <span className="text-sm font-bold text-white">LEGO, IBM, Marvel</span>
                    <span className="text-[10px] text-amber-200/70 block mt-0.5">Billund • Armonk • NYC</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('companies')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-heading font-bold text-xs shadow-glow-amber hover:shadow-xl transition-all flex items-center space-x-2"
                  >
                    <span>View All 11 Benchmark Titan Cases</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Interactive 3D Globe Viewport */}
              <div className="lg:col-span-6 h-[380px] sm:h-[440px] rounded-2xl overflow-hidden relative border border-[#3d2719] bg-[#0c0805]/90 flex items-center justify-center">
                <GeoGlobe />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  Interactive 3D WebGL Engine
                </div>
              </div>

            </div>
          </div>
        </MotionSection>
      </section>

      {/* =========================================================================
          4. INTERACTIVE CRISIS VECTOR SIMULATOR (Sandbox Survival Calculator)
          ========================================================================= */}
      <section id="crisis-simulator-sandbox" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="relative rounded-3xl border border-[#dcceb9] dark:border-slate-800/80 bg-gradient-to-br from-[#1a110a] via-[#120c08] to-[#1f140d] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
            
            {/* Ambient Holographic Ring */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/15 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative z-10">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#3d2719]">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-3">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>INTERACTIVE TELEMETRY SANDBOX</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white">
                    Simulate Your Startup's Crisis Vector
                  </h2>
                  <p className="text-amber-100/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
                    Adjust real-world startup distress parameters to see which corporate titan experienced the exact same crisis condition and how they engineered their turnaround.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-amber-200/80 bg-[#1c120c]/90 px-4 py-2 rounded-xl border border-[#3d2719] self-start md:self-auto shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Real-time Cosine Heuristic Model</span>
                </div>
              </div>

              {/* Sandbox Controls & Output Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                
                {/* Left: Interactive Sliders (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Slider 1: Cash Runway */}
                  <div className="p-5 rounded-2xl bg-[#1c120c]/95 border border-[#3d2719] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <label className="text-sm font-semibold text-amber-100">Cash Runway Remaining</label>
                      </div>
                      <span className={`text-base font-mono font-bold px-3 py-1 rounded-lg ${
                        runwayMonths <= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        runwayMonths <= 6 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {runwayMonths} {runwayMonths === 1 ? 'Month' : 'Months'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      step="1"
                      value={runwayMonths}
                      onChange={(e) => setRunwayMonths(Number(e.target.value))}
                      className="w-full h-2 bg-[#2d1e15] rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[11px] text-amber-200/60 font-mono">
                      <span className="text-red-400">1 Mo (Insolvency Cliff)</span>
                      <span>12 Mo</span>
                      <span className="text-emerald-400">24 Mo (Stable)</span>
                    </div>
                  </div>

                  {/* Slider 2: Burn Rate Multiple */}
                  <div className="p-5 rounded-2xl bg-[#1c120c]/95 border border-[#3d2719] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <label className="text-sm font-semibold text-amber-100">Burn Rate Multiple</label>
                      </div>
                      <span className="text-base font-mono font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {burnMultiple.toFixed(1)}x Operating Cost
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={burnMultiple}
                      onChange={(e) => setBurnMultiple(Number(e.target.value))}
                      className="w-full h-2 bg-[#2d1e15] rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[11px] text-amber-200/60 font-mono">
                      <span>1.0x (Lean)</span>
                      <span>2.5x (Growth)</span>
                      <span className="text-rose-400">5.0x (Hyper-Burn)</span>
                    </div>
                  </div>

                  {/* Slider 3: Market Headwind Severity */}
                  <div className="p-5 rounded-2xl bg-[#1c120c]/95 border border-[#3d2719] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <label className="text-sm font-semibold text-amber-100">Macro / Market Headwind Severity</label>
                      </div>
                      <span className="text-base font-mono font-bold px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40">
                        {headwindSeverity}% Shock
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={headwindSeverity}
                      onChange={(e) => setHeadwindSeverity(Number(e.target.value))}
                      className="w-full h-2 bg-[#2d1e15] rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[11px] text-amber-200/60 font-mono">
                      <span>0% (Favorable)</span>
                      <span>50% (Moderate Squeeze)</span>
                      <span className="text-red-400">100% (Category Crisis)</span>
                    </div>
                  </div>

                  {/* Selector: SKU & Product Complexity */}
                  <div className="p-5 rounded-2xl bg-[#1c120c]/95 border border-[#3d2719] space-y-3">
                    <label className="text-sm font-semibold text-amber-100 block">Product / Portfolio SKU Complexity</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Low', 'Medium', 'High', 'Extreme'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSkuComplexity(lvl)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                            skuComplexity === lvl
                              ? 'bg-amber-500/25 text-amber-300 border-amber-500 shadow-glow-amber font-bold'
                              : 'bg-[#28180f] text-amber-200/70 border-[#3d2719] hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Live Matched Titan HUD (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col">
                  {matchedTitan && (
                    <motion.div
                      key={matchedTitan.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex-1 p-6 sm:p-7 rounded-3xl bg-[#1c120c]/95 border-2 border-amber-500/50 shadow-glow-amber flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{matchedTitan.score}% VECTOR MATCH</span>
                          </div>
                          <span className="text-xs font-mono text-amber-200/70">Heuristic Cosine</span>
                        </div>

                        {/* Matched Titan Header */}
                        <div className="flex items-center space-x-4 pt-2">
                          <CompanyLogo
                            companyId={matchedTitan.id}
                            ticker={matchedTitan.ticker}
                            size={56}
                            className="w-14 h-14"
                          />
                          <div>
                            <h3 className="text-2xl font-heading font-black text-white flex items-center space-x-2">
                              <span>{matchedTitan.name}</span>
                            </h3>
                            <span className="text-xs font-mono text-amber-400">
                              Crisis Epoch: {matchedTitan.crisisYear} • Recovery: {matchedTitan.recoveryYear}
                            </span>
                          </div>
                        </div>

                        {/* Match Rationale */}
                        <div className="p-3.5 rounded-xl bg-[#120c08]/90 border border-[#3d2719] text-xs text-amber-100/90 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">Similarity Vector Diagnostic:</span>
                          <p className="leading-relaxed">{matchedTitan.matchReason}</p>
                        </div>

                        {/* Historical Drop vs Catalyst */}
                        <div className="space-y-2.5 text-xs">
                          <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50">
                            <span className="font-bold text-red-400 block mb-0.5">Historical Distress:</span>
                            <span className="text-slate-200">{matchedTitan.dropDetail}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50">
                            <span className="font-bold text-emerald-400 block mb-0.5">Proven Turnaround Strategy:</span>
                            <span className="text-slate-200">{matchedTitan.recoveryCatalyst}</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct CTA to Strategy Steps */}
                      <div className="pt-6 mt-4 border-t border-[#3d2719] space-y-2">
                        <button
                          onClick={() => handleLaunchToCompany(matchedTitan.id)}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs font-heading shadow-glow-amber transition-all flex items-center justify-center space-x-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Execute Full {matchedTitan.name} Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </MotionSection>
      </section>

      {/* =========================================================================
          5. 6-TITAN TURNAROUND PLAYBOOK GALLERY (Interactive Bento Grid)
          ========================================================================= */}
      <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>THE 6 PILLAR PLAYBOOKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#24160d] dark:text-white">
              Benchmark Corporate Turnarounds
            </h2>
            <p className="text-[#6c4f38] dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Every playbook is backed by 6-year empirical balance sheet records, executive decisions, and 3-stage turnaround roadmaps.
            </p>
          </div>
        </MotionSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TITAN_CASES.map((titan, idx) => (
            <motion.div
              key={titan.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#fdfaf5] dark:bg-[#1c120c]/90 border border-[#dcceb9] dark:border-[#382417] shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CompanyLogo
                    companyId={titan.id}
                    ticker={titan.ticker}
                    size={48}
                    className="w-12 h-12"
                  />
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                    {titan.crisisYear} Crisis
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-extrabold text-[#24160d] dark:text-white group-hover:text-amber-600 transition-colors">
                    {titan.name}
                  </h3>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">
                    {titan.crisisFactor}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-[#6c4f38] dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                    <span className="font-bold text-red-700 dark:text-red-400 block mb-0.5">Critical Drop:</span>
                    <p className="line-clamp-2">{titan.dropDetail}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Catalyst Execution:</span>
                    <p className="line-clamp-2">{titan.recoveryCatalyst}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {titan.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#ede3d4] dark:bg-[#2d1e15] text-[#6c4f38] dark:text-amber-200/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#dcceb9]/80 dark:border-[#382417] flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 truncate max-w-[170px]">
                  {titan.growthMultiple}
                </span>
                <button
                  onClick={() => handleLaunchToCompany(titan.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111111] dark:bg-amber-500 text-white dark:text-black text-xs font-bold font-heading hover:scale-105 transition-transform flex items-center space-x-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. VENTURE FAILURE POST-MORTEM & TURNAROUND MATRIX
          ========================================================================= */}
      <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#f8f3eb] dark:bg-dark-900/90 border border-[#dcceb9] dark:border-slate-800/80 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VENTURE FAILURE FORENSICS</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#24160d] dark:text-white">
                  Why Startups Fail vs How Titans Survived
                </h2>
                <p className="text-[#6c4f38] dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                  Examining catastrophic Silicon Valley startup implosions mapped against corporate turnaround heuristics.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('startup-intel')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-heading shadow-md transition-all flex items-center space-x-1.5 self-start md:self-auto"
              >
                <span>View Full Startup Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STARTUP_POSTMORTEMS.map((startup, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1c120c] border border-[#dcceb9] dark:border-[#382417] shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-[#24160d] dark:text-white">{startup.name}</h4>
                      <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded">
                        {startup.loss}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium">{startup.reason}</p>
                    <p className="text-[11px] text-[#6c4f38] dark:text-slate-400 leading-relaxed pt-1">{startup.lesson}</p>
                  </div>

                  <div className="pt-3 border-t border-[#ede3d4] dark:border-[#2d1e15]">
                    <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold block">Matched Playbook:</span>
                    <span className="text-xs font-bold text-[#24160d] dark:text-white">{startup.matchedTitan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      {/* =========================================================================
          7. THE 4 NEURAL PILLARS OF ICLAS ARCHITECTURE
          ========================================================================= */}
      <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL FOUNDATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#24160d] dark:text-white">
              The Four Neural Pillars of ICLAS
            </h2>
            <p className="text-[#6c4f38] dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Combining computational case reasoning, structured financial heuristics, and multi-sector crisis forensic taxonomies.
            </p>
          </div>
        </MotionSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Vector Cosine CBR Engine',
              desc: 'Transforms 12+ company crisis parameters into multidimensional vectors, matching cosine distances against verified historical recoveries.',
              icon: Cpu,
              color: 'text-amber-600 dark:text-amber-400',
              bg: 'bg-amber-500/10'
            },
            {
              title: '6-Year Longitudinal Telemetry',
              desc: 'Tracks balance sheet indicators from T-3 (onset of down-cycle) through T-0 (crisis inflection) to T+3 (sustainable recovery multiple).',
              icon: BarChart3,
              color: 'text-orange-600 dark:text-orange-400',
              bg: 'bg-orange-500/10'
            },
            {
              title: '3-Stage Turnaround Roadmap',
              desc: 'Generates progressive, time-phased tactical intervention steps: Stage 1 (Stabilize Cash), Stage 2 (Strategic Pivot), Stage 3 (Scale Moat).',
              icon: ListOrdered,
              color: 'text-amber-700 dark:text-amber-300',
              bg: 'bg-amber-600/10'
            },
            {
              title: 'Live Macroeconomic Hub',
              desc: 'Integrates real-time TradingView technical charts, financial quotes, and news sentiment to cross-reference macro volatility with strategy.',
              icon: Activity,
              color: 'text-cyan-600 dark:text-cyan-400',
              bg: 'bg-cyan-500/10'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#fdfaf5] dark:bg-[#1c120c]/80 border border-[#dcceb9] dark:border-[#382417] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl ${pillar.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <h3 className="text-lg font-heading font-extrabold text-[#24160d] dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#6c4f38] dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. FREQUENTLY ASKED QUESTIONS (Interactive Accordion)
          ========================================================================= */}
      <section className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 text-xs font-bold font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#24160d] dark:text-white">
              Questions About ICLAS Intelligence
            </h2>
          </div>
        </MotionSection>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#dcceb9] dark:border-[#382417] bg-[#fdfaf5] dark:bg-[#1c120c]/90 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between font-heading font-bold text-sm sm:text-base text-[#24160d] dark:text-white hover:text-amber-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-amber-600 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#6c4f38] dark:text-slate-300 leading-relaxed font-normal border-t border-[#dcceb9]/50 dark:border-[#382417]/50 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. FINAL SUNNY HIGH-ENERGY CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionSection direction="up" duration={0.6}>
          <div className="rounded-3xl bg-[#F6CA45] text-[#111111] p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            
            {/* Ambient Background Circles */}
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#ECA91E]/60 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#EDA81E]/60 pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#111111]/70">
                STARTUP SURVIVAL ENGINE // FULL ACCESS
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#111111] leading-tight">
                Ready to execute your corporate turnaround roadmap?
              </h2>
              <p className="text-sm sm:text-base text-[#111111]/85 font-medium leading-relaxed">
                Connect your company metrics with 11 corporate titans, explore 6-year empirical data, and test your cash runway in the live simulator.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('overview')}
                className="px-8 py-4 rounded-full bg-[#111111] text-white font-heading font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Launch ICLAS Engine</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('search-condition')}
                className="px-8 py-4 rounded-full bg-white text-[#111111] font-heading font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Find Matched Titan</span>
                <Search className="w-4 h-4" />
              </motion.button>
            </div>

          </div>
        </MotionSection>
      </section>

    </div>
  );
}
