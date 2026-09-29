import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Overview from './pages/Overview';
import SearchCondition from './pages/SearchCondition';
import StrategySteps from './pages/StrategySteps';
import Companies from './pages/Companies';
import StartupIntel from './pages/StartupIntel';
import InvestorsStartups from './pages/InvestorsStartups';
import GraphAnalysis from './pages/GraphAnalysis';
import MarketDashboard from './pages/MarketDashboard';
import LandingPage from './pages/LandingPage';
import OmniQuery from './components/OmniQuery';

const VALID_TABS = [
  'about',
  'overview',
  'companies',
  'search-condition',
  'strategy-steps',
  'startup-intel',
  'investors-startups',
  'graph-analysis',
  'market-dashboard',
  'landing'
];

function parsePath(pathStr, searchStr) {
  const clean = (pathStr || '').replace(/^\//, '');
  if (!clean) return { tab: 'landing', companyId: null };

  const tab = VALID_TABS.includes(clean) ? clean : 'about';
  
  let companyId = null;
  if (searchStr) {
    const params = new URLSearchParams(searchStr);
    if (params.get('company')) companyId = params.get('company');
    if (params.get('id')) companyId = params.get('id');
  }

  return { tab, companyId };
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const parsed = parsePath(window.location.pathname, window.location.search);
    return parsed.tab;
  });

  const [selectedCompanyId, setSelectedCompanyIdState] = useState(() => {
    const parsed = parsePath(window.location.pathname, window.location.search);
    return parsed.companyId || 'apple';
  });

  const [selectedPersona, setSelectedPersona] = useState('Entrepreneur');

  // Enhanced Navigation with HTML5 History & URL Sync
  const navigateTo = (tab, companyId = null, push = true) => {
    const targetCompanyId = companyId || selectedCompanyId;
    setActiveTabState(tab);
    if (companyId) {
      setSelectedCompanyIdState(companyId);
    }

    const path = `/${tab}`;
    const search = targetCompanyId && (tab === 'companies' || tab === 'strategy-steps')
      ? `?company=${targetCompanyId}`
      : '';
    const fullPath = path + search;

    if (push) {
      window.history.pushState({ tab, companyId: targetCompanyId }, '', fullPath);
    } else {
      window.history.replaceState({ tab, companyId: targetCompanyId }, '', fullPath);
    }

    window.scrollTo(0, 0);
  };

  const setActiveTab = (tab) => {
    navigateTo(tab);
  };

  const setSelectedCompanyId = (id) => {
    setSelectedCompanyIdState(id);
    if (activeTab === 'companies' || activeTab === 'strategy-steps') {
      window.history.replaceState({ tab: activeTab, companyId: id }, '', `/${activeTab}?company=${id}`);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('about');
    }
  };

  // Popstate Listener (Handles Browser Back / Forward buttons & mouse back keys)
  useEffect(() => {
    // Prevent browser smooth-scroll restoration jitter on reload
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = (e) => {
      if (e.state && e.state.tab) {
        setActiveTabState(e.state.tab);
        if (e.state.companyId) {
          setSelectedCompanyIdState(e.state.companyId);
        }
      } else {
        const parsed = parsePath(window.location.pathname, window.location.search);
        setActiveTabState(parsed.tab);
        if (parsed.companyId) {
          setSelectedCompanyIdState(parsed.companyId);
        }
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);

    // Initial state sync
    if (!window.history.state) {
      const initial = parsePath(window.location.pathname, window.location.search);
      const search = initial.companyId ? `?company=${initial.companyId}` : '';
      window.history.replaceState(
        { tab: initial.tab, companyId: initial.companyId || 'apple' },
        '',
        `/${initial.tab}${search}`
      );
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (activeTab === 'landing') {
    return <LandingPage onNavigate={(tab) => navigateTo(tab)} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-indigo-500/25 selection:text-indigo-200 transition-colors duration-300">
      {/* Dynamic Ambient Background Aura Lighting (GPU-accelerated) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] animate-ambient-float will-change-transform" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[90px] animate-ambient-float will-change-transform" style={{ animationDelay: '-4s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[90px] animate-ambient-float will-change-transform" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Top Fixed Navigation & Persona Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
      />

      {/* Main Content Area with Fixed-Anchor Page Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {activeTab === 'about' && (
              <About
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                selectedPersona={selectedPersona}
              />
            )}

            {activeTab === 'overview' && (
              <Overview
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                selectedPersona={selectedPersona}
              />
            )}

            {activeTab === 'search-condition' && (
              <SearchCondition
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
              />
            )}

            {activeTab === 'strategy-steps' && (
              <StrategySteps
                selectedCompanyId={selectedCompanyId}
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
              />
            )}

            {activeTab === 'companies' && (
              <Companies
                setActiveTab={setActiveTab}
                selectedCompanyId={selectedCompanyId}
                setSelectedCompanyId={setSelectedCompanyId}
              />
            )}

            {activeTab === 'startup-intel' && (
              <StartupIntel
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
              />
            )}

            {activeTab === 'investors-startups' && (
              <InvestorsStartups
                selectedPersona={selectedPersona}
              />
            )}

            {activeTab === 'graph-analysis' && (
              <GraphAnalysis 
              />
            )}

            {activeTab === 'market-dashboard' && (
              <MarketDashboard 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Global Footer */}
      <Footer setActiveTab={setActiveTab} />
      <OmniQuery onNavigate={setActiveTab} />
    </div>
  );
}
