import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink
} from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import GeoGlobe from '../components/earth-pulse/GeoGlobe';

// ============================================================================
// 1. NEURAL PARTICLE CANVAS COMPONENT
// ============================================================================
function NeuralCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles = [];

    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    const baseColor = isDark ? '217, 119, 6' : '180, 83, 9'; // Amber / Caramel Gold
    const altColor = isDark ? '224, 90, 54' : '194, 65, 12'; // Terracotta / Copper

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        color: Math.random() > 0.3 ? baseColor : altColor,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    // Animation Loop
    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move particles
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on boundary
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse interaction
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 1.5;
          p1.x -= (dxMouse / distMouse) * force;
          p1.y -= (dyMouse / distMouse) * force;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.25 : 0.18);
            ctx.strokeStyle = `rgba(${p1.color}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw Particle Node
        ctx.fillStyle = `rgba(${p1.color}, ${p1.alpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
    />
  );
}

// ============================================================================
// 2. BENCHMARK TITANS DATA
// ============================================================================
const TITAN_CASES = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    crisisYear: '1997',
    recoveryYear: '2001-2007',
    crisisFactor: '90 Days from Insolvency',
    dropDetail: '-75% revenue decline, 3,000 redundancies, fragmented 20+ SKU portfolio.',
    recoveryCatalyst: 'The $150M Microsoft Lifeline, radical SKU simplification to 4 quadrants, and the iMac & iPod ecosystem pivot.',
    growthMultiple: '500x+ Value Expansion ($3T+ Peak)',
    color: 'from-amber-500 to-orange-600',
    logoColor: '#000000',
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

// ============================================================================
// 3. MAIN ABOUT PAGE COMPONENT
// ============================================================================
export default function About({
  setActiveTab,
  setSelectedCompanyId,
  selectedPersona,
  theme
}) {
  // Sandbox Simulator State
  const [runwayMonths, setRunwayMonths] = useState(6);
  const [burnMultiple, setBurnMultiple] = useState(2.8);
  const [headwindSeverity, setHeadwindSeverity] = useState(70);
  const [skuComplexity, setSkuComplexity] = useState('High'); // Low | Med | High | Extreme
  const [matchedTitan, setMatchedTitan] = useState(null);

  // Active persona preview in About
  const [previewPersona, setPreviewPersona] = useState(selectedPersona || 'Entrepreneur');

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

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      
      {/* =========================================================================
          HERO SECTION: Holographic Cyber Title & Interactive 3D Earth Background
          ========================================================================= */}
      <section className="relative w-screen min-h-[95vh] lg:min-h-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex flex-col justify-center items-center overflow-hidden bg-[#120c08] -mt-8 mb-16 py-12 sm:py-16">
        
        {/* Interactive 3D Full-Screen Fixed Globe Background (100% luminous & visible, GPU composited) */}
        <motion.div 
          className="absolute inset-0 pointer-events-auto z-0 opacity-100 flex items-center justify-center will-change-transform"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            transformOrigin: 'center center',
            transform: 'translateZ(0)'
          }}
        >
           <GeoGlobe />
        </motion.div>

        {/* Ambient Warm Golden Amber Atmosphere Orbs (GPU composited) */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow will-change-transform" />
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-orange-600/20 rounded-full blur-[90px] pointer-events-none animate-pulse-slow will-change-transform" style={{ animationDelay: '-3s' }} />
        <div className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] bg-amber-600/15 rounded-full blur-[80px] pointer-events-none animate-pulse-slow will-change-transform" style={{ animationDelay: '-1.5s' }} />

        {/* Seamless Bottom Section Transition Fade to Light Coffee / Dark Roast */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] bg-gradient-to-t from-[#120c08] to-transparent pointer-events-none" />

        {/* Hero Content Box */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center pointer-events-none">
          
          {/* Holographic Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#1c120c]/85 text-amber-200 border border-amber-500/40 shadow-[0_0_20px_rgba(217,119,6,0.35)] backdrop-blur-md text-xs font-mono mb-6 sm:mb-8 pointer-events-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
            </span>
            <span className="text-amber-400 font-bold tracking-wider">ICLAS AI ENGINE</span>
            <span className="text-amber-600">•</span>
            <span className="text-[#fdfaf5] font-medium">HISTORICAL CORPORATE INTELLIGENCE // ONLINE</span>
          </motion.div>

          {/* Main Giant Cyber Headline with Crisp Multi-Layer Text Shadows */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.1] max-w-4xl pointer-events-auto [text-shadow:_0_3px_16px_rgba(0,0,0,0.95),_0_0_30px_rgba(18,12,8,0.9)]"
          >
            Corporate Turnaround Intelligence, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent [text-shadow:_0_0_35px_rgba(217,119,6,0.8)] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Engineered for Startup Survival.
            </span>
          </motion.h1>

          {/* Subtitle Description with Highlight Badges and Crisp Legibility */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-[#fdfaf5] max-w-3xl leading-relaxed font-normal pointer-events-auto [text-shadow:_0_2px_12px_rgba(0,0,0,0.95),_0_0_20px_rgba(18,12,8,0.85)]"
          >
            <span className="font-bold text-amber-300 bg-[#28180f]/80 border border-amber-500/40 px-2 py-0.5 rounded-md backdrop-blur-sm mr-1.5 shadow-sm">ICLAS</span> 
            bridges the gap between historical corporate titans and early-stage ventures. Powered by 
            <span className="font-semibold text-orange-300 bg-[#28180f]/80 border border-orange-500/40 px-2 py-0.5 rounded-md backdrop-blur-sm mx-1.5 shadow-sm">Case-Based Reasoning (CBR)</span>, 
            longitudinal crisis forensics, and vector similarity models, we transform legendary corporate turnarounds into actionable survival playbooks.
          </motion.p>

          {/* Futuristic Interactive Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:gap-5 pointer-events-auto"
          >
            {/* Primary CTA: Launch Platform */}
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('overview')}
              className="relative group overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-heading font-bold text-base shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:shadow-[0_0_45px_rgba(217,119,6,0.8)] border border-amber-300/40 transition-all flex items-center space-x-3"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Activity className="w-5 h-5 text-white animate-pulse" />
              <span>Launch Intelligence Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary CTA: Simulate Crisis Match */}
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const el = document.getElementById('crisis-simulator-sandbox');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-4 rounded-2xl bg-[#1c120c]/80 hover:bg-[#28180f]/95 border border-amber-500/40 hover:border-amber-400 text-[#fdfaf5] font-heading font-semibold text-base shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all flex items-center space-x-2.5"
            >
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Try Crisis Simulator</span>
            </motion.button>

            {/* Tertiary CTA: Companies Intel */}
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('companies')}
              className="px-6 py-4 rounded-2xl bg-[#1c120c]/65 hover:bg-[#28180f]/90 border border-[#382417] hover:border-amber-500/60 text-amber-200 hover:text-white font-heading font-medium text-sm backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>11 Benchmark Titans</span>
            </motion.button>
          </motion.div>

          {/* Real-time Telemetry Stat Cards with Translucent Frosted Glass (Globe visible underneath) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl pointer-events-auto"
          >
            {[
              { label: 'Corporate Titans', val: '11 Benchmarks', sub: 'Longitudinal Data (T-3 to T+3)', icon: Building2, color: 'text-amber-400', glow: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(217,119,6,0.4)]' },
              { label: 'Decision Engine', val: 'Vector CBR', sub: 'Cosine Metric Similarity', icon: Cpu, color: 'text-orange-400', glow: 'hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(224,90,54,0.4)]' },
              { label: 'Turnaround Archetypes', val: '3 Stages', sub: 'Stabilize • Pivot • Scale', icon: ListOrdered, color: 'text-amber-300', glow: 'hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]' },
              { label: 'Forensic Depth', val: '6 Years', sub: 'Downfall to Peak Recovery', icon: TrendingUp, color: 'text-rose-400', glow: 'hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl bg-[#1c120c]/70 hover:bg-[#28180f]/90 border border-[#382417] backdrop-blur-md shadow-[0_8px_25px_rgb(0,0,0,0.5)] text-left transition-all hover:-translate-y-1 ${stat.glow}`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <div className="p-1 rounded-lg bg-white/5 border border-white/10">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-200/80 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-heading font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {stat.val}
                  </div>
                  <div className="text-[11px] text-amber-200/70 mt-1 font-normal truncate">
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          LIVE CRISIS CONDITION SIMULATOR & VECTOR MATCHER SANDBOX
          ========================================================================= */}
      <section id="crisis-simulator-sandbox" className="scroll-mt-24">
        <MotionSection direction="up" duration={0.6}>
          <div className="relative rounded-3xl border border-[#dcceb9] dark:border-slate-800/80 bg-gradient-to-br from-[#1a110a] via-[#120c08] to-[#1f140d] text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
            
            {/* Ambient Holographic Ring */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />

            <div className="relative z-10">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#3d2719]">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono mb-3">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>INTERACTIVE TELEMETRY SANDBOX</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white">
                    Simulate Your Startup's Crisis Vector
                  </h2>
                  <p className="text-amber-100/70 text-sm sm:text-base mt-2 max-w-2xl font-normal">
                    Adjust real-world startup distress parameters to see which corporate titan experienced the exact same crisis condition and how they engineered their turnaround.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-amber-200/80 bg-[#1c120c]/90 px-4 py-2 rounded-xl border border-[#3d2719] self-start md:self-auto">
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
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 scanline pointer-events-none opacity-20" />

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
                        <p className="text-[10px] text-center text-amber-200/60 font-mono">
                          Inspect 3-Stage Heuristics (Stabilize, Pivot, Scale)
                        </p>
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
          THE 4 NEURAL CORE PILLARS OF ICLAS
          ========================================================================= */}
      <section className="space-y-8">
        <MotionSection direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL FOUNDATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#24160d] dark:text-white">
              The Four Neural Pillars of ICLAS
            </h2>
            <p className="text-[#6c4f38] dark:text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              How our system decodes corporate crisis data, normalizes multidimensional balance sheet indicators, and produces structured turnaround playbooks.
            </p>
          </div>
        </MotionSection>

        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <StaggerItem>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] dark:bg-dark-900 border border-[#dcceb9] dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold tracking-wider">PILLAR 01</span>
                <h3 className="text-xl font-heading font-bold text-[#24160d] dark:text-white mt-1 mb-3">
                  Longitudinal Forensics (T-3 to T+3)
                </h3>
                <p className="text-[#6c4f38] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Tracks 6-year operational metrics spanning 3 years pre-crisis and 3 years post-recovery across balance sheet indicators, cash flow velocity, and product portfolio size.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#eee3d5] dark:border-slate-800 text-[11px] font-mono text-[#84654f] dark:text-slate-500 flex items-center justify-between">
                <span>10-K Forensic Modeling</span>
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </StaggerItem>

          {/* Pillar 2 */}
          <StaggerItem>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] dark:bg-dark-900 border border-[#dcceb9] dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-[11px] font-mono text-orange-700 dark:text-orange-400 font-bold tracking-wider">PILLAR 02</span>
                <h3 className="text-xl font-heading font-bold text-[#24160d] dark:text-white mt-1 mb-3">
                  Case-Based Reasoning (CBR)
                </h3>
                <p className="text-[#6c4f38] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Employs high-dimensional vector similarity algorithms (Cosine & Euclidean distance) to match real-time startup distress symptoms to benchmark corporate crises.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#eee3d5] dark:border-slate-800 text-[11px] font-mono text-[#84654f] dark:text-slate-500 flex items-center justify-between">
                <span>Vector Cosine Engine</span>
                <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </StaggerItem>

          {/* Pillar 3 */}
          <StaggerItem>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] dark:bg-dark-900 border border-[#dcceb9] dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-600/50 dark:hover:border-amber-400/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/15 border border-amber-600/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ListOrdered className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                </div>
                <span className="text-[11px] font-mono text-amber-700 dark:text-amber-300 font-bold tracking-wider">PILLAR 03</span>
                <h3 className="text-xl font-heading font-bold text-[#24160d] dark:text-white mt-1 mb-3">
                  3-Stage Strategy Synthesizer
                </h3>
                <p className="text-[#6c4f38] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Synthesizes structured strategic roadmaps partitioned into Phase 1 (Stabilization & Cash Runway), Phase 2 (Core Re-engineering & Pivot), and Phase 3 (Scale & Re-emergence).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#eee3d5] dark:border-slate-800 text-[11px] font-mono text-[#84654f] dark:text-slate-500 flex items-center justify-between">
                <span>Actionable Milestones</span>
                <CheckCircle2 className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </StaggerItem>

          {/* Pillar 4 */}
          <StaggerItem>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#fdfbf7] dark:bg-dark-900 border border-[#dcceb9] dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-bold tracking-wider">PILLAR 04</span>
                <h3 className="text-xl font-heading font-bold text-[#24160d] dark:text-white mt-1 mb-3">
                  Founder-Investor Nexus & Stock AI
                </h3>
                <p className="text-[#6c4f38] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Connects resilient ventures with crisis-hardened investors, backed by interactive stock trend forecasting and cross-industry correlation models.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#eee3d5] dark:border-slate-800 text-[11px] font-mono text-[#84654f] dark:text-slate-500 flex items-center justify-between">
                <span>Capital Alignment</span>
                <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </section>

      {/* =========================================================================
          BENCHMARK TITANS HALL OF FAME (6-YEAR TURNAROUND CASES)
          ========================================================================= */}
      <section className="space-y-8">
        <MotionSection direction="up" duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-caramel dark:text-brand-amber text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>BENCHMARK CORP DATASETS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
                Legendary Corporate Turnaround Cases
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-2xl font-normal">
                Explored through six years of rigorous financial data from near-death to global dominance.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('companies')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-900 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold font-heading self-start md:self-auto transition-all"
            >
              <span>View All 11 Companies</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </MotionSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TITAN_CASES.map((titan) => (
            <motion.div
              key={titan.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CompanyLogo
                      companyId={titan.id}
                      ticker={titan.ticker}
                      size={44}
                      className="w-11 h-11"
                    />
                    <div>
                      <h4 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                        {titan.name}
                      </h4>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {titan.ticker} • {titan.crisisYear} Crisis
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    {titan.crisisFactor}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {titan.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Recovery Strategy & Growth */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-950/70 border border-slate-200/60 dark:border-slate-800/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Turnaround Catalyst:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{titan.recoveryCatalyst}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-2">
                    <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{titan.growthMultiple}</span>
                  </div>
                </div>

              </div>

              {/* Inspect Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (setSelectedCompanyId) setSelectedCompanyId(titan.id);
                    setActiveTab('companies');
                  }}
                  className="text-xs font-bold text-brand-caramel dark:text-brand-amber hover:underline flex items-center space-x-1"
                >
                  <span>Explore 6-Year Financials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleLaunchToCompany(titan.id)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  View Strategy Steps
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MULTI-PERSONA HOLOGRAPHIC VIEWPORT
          ========================================================================= */}
      <section className="space-y-8">
        <MotionSection direction="up" duration={0.6}>
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/60 dark:from-dark-900 dark:via-dark-950 dark:to-dark-950 shadow-xl transition-colors duration-300">
            
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple dark:text-brand-purple text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>TAILORED FOR EVERY STAKEHOLDER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
                How ICLAS Serves Your Perspective
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal">
                Select your role to preview how the platform adapts its decision heuristics, data visualizers, and toolkits.
              </p>

              {/* Persona Switcher Tabs */}
              <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 dark:bg-dark-800 border border-slate-300/60 dark:border-slate-700 mt-4">
                {[
                  { id: 'Entrepreneur', label: 'Entrepreneurs & Founders', icon: Zap },
                  { id: 'Investor', label: 'Venture Capital & Angels', icon: Briefcase },
                  { id: 'Researcher', label: 'Academic Researchers', icon: Database },
                ].map((p) => {
                  const Icon = p.icon;
                  const isActive = previewPersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPreviewPersona(p.id)}
                      className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-white dark:bg-dark-900 text-brand-caramel dark:text-brand-amber shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-amber' : 'text-slate-400'}`} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Content Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={previewPersona}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
              >
                {previewPersona === 'Entrepreneur' && (
                  <>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-brand-caramel dark:text-brand-amber flex items-center justify-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Condition Matching</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Input your current runway, burn rate, and tech bottleneck to extract proven playbook heuristics that rescued titans in the same spot.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-brand-indigo flex items-center justify-center">
                        <ListOrdered className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">3-Phase Action Roadmap</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Receive a prioritized, phased turnaround roadmap: Stabilization (Cash preservation), Core Re-engineering, and Scaled Growth.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-brand-emerald flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Investor Credibility</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Show investors you have anchored your turnaround strategy in historical corporate data, elevating pitch deck authority.
                      </p>
                    </div>
                  </>
                )}

                {previewPersona === 'Investor' && (
                  <>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-brand-purple flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Downside Risk Forensics</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Stress-test portfolio startup burn rates against historical downturn benchmarks to evaluate turnaround plausibility.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Stock AI & Market Signals</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Access multi-timeframe predictive indicators and sector market movements to time liquidity and follow-on rounds.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-brand-emerald flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Direct Founder Discovery</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Discover vetted startups executing structured corporate playbooks with high recovery and scaling potential.
                      </p>
                    </div>
                  </>
                )}

                {previewPersona === 'Researcher' && (
                  <>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-brand-indigo flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Longitudinal Datasets</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Inspect clean 6-year operational metrics across 11 major global corporations spanning 8 sectors.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-brand-cyan flex items-center justify-center">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">CBR Heuristic Validation</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Evaluate the efficacy of Case-Based Reasoning algorithms applied to corporate distress scenarios.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Multi-Variable Graph Analysis</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        Plot multidimensional financial trajectories, correlate indicators, and export findings for academic publication.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </MotionSection>
      </section>

      {/* =========================================================================
          MODULE LAUNCHPAD COMMAND DECK
          ========================================================================= */}
      <section className="space-y-8">
        <MotionSection direction="up" duration={0.6}>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
              Launch Intelligence Modules
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              Jump directly into any analysis engine across the ICLAS platform.
            </p>
          </div>
        </MotionSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 'overview',
              title: 'Overview Dashboard',
              desc: 'Executive summary with aggregate turnaround metrics and recent intelligence updates.',
              icon: Layers,
              color: 'text-brand-amber',
              btn: 'Launch Overview',
            },
            {
              id: 'companies',
              title: '6-Year Company Intelligence',
              desc: 'Deep forensic breakdown of 11 corporations with balance sheet indicators and timelines.',
              icon: Building2,
              color: 'text-brand-caramel',
              btn: 'Explore Companies',
            },
            {
              id: 'search-condition',
              title: 'Search Crisis Condition',
              desc: 'Vector cosine query engine matching your specific distress symptoms to historical cases.',
              icon: Search,
              color: 'text-brand-amber',
              btn: 'Search Conditions',
            },
            {
              id: 'strategy-steps',
              title: 'Strategy Steps Roadmap',
              desc: 'Tactical 3-phase strategic turnaround roadmaps with implementation milestones.',
              icon: ListOrdered,
              color: 'text-brand-terracotta',
              btn: 'View Strategy Steps',
            },
            {
              id: 'startup-intel',
              title: 'Startup Intel (Vanished vs MNCs)',
              desc: 'Empirical post-mortems of vanished visionary startups mapped to the MNC playbooks that conquered the same crisis.',
              icon: ShieldCheck,
              color: 'text-brand-amber',
              btn: 'Inspect Vanished vs MNC Matrix',
            },
            {
              id: 'graph-analysis',
              title: 'Graph Analysis & Stock AI',
              desc: 'Interactive financial trajectory plotting, multidimensional graphs, and predictive signals.',
              icon: TrendingUp,
              color: 'text-brand-caramel',
              btn: 'Open Graph Analysis',
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -4 }}
                onClick={() => setActiveTab(mod.id)}
                className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-brand-amber/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${mod.color}`} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-amber group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-amber transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-brand-caramel dark:text-brand-amber flex items-center space-x-1">
                    <span>{mod.btn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
