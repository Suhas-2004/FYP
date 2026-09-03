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

const VALID_TABS = [
  'about',
  'overview',
  'companies',
  'search-condition',
  'strategy-steps',
  'startup-intel',
  'investors-startups',
  'graph-analysis',
  'market-dashboard'
];

function parseHash(hashStr) {
  const clean = (hashStr || '').replace(/^#\/?/, '');
  if (!clean) return { tab: 'about', companyId: null };

  const [tabPart, queryPart] = clean.split('?');
  const tab = VALID_TABS.includes(tabPart) ? tabPart : 'about';
  
  let companyId = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    if (params.get('company')) companyId = params.get('company');
    if (params.get('id')) companyId = params.get('id');
  }

  return { tab, companyId };
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const parsed = parseHash(window.location.hash);
    return parsed.tab;
  });

  const [selectedCompanyId, setSelectedCompanyIdState] = useState(() => {
    const parsed = parseHash(window.location.hash);
    return parsed.companyId || 'apple';
  });

  const [selectedPersona, setSelectedPersona] = useState('Entrepreneur');
  
  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('iclas_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('iclas_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Enhanced Navigation with HTML5 History & URL Hash Sync
  const navigateTo = (tab, companyId = null, push = true) => {
    const targetCompanyId = companyId || selectedCompanyId;
    setActiveTabState(tab);
    if (companyId) {
      setSelectedCompanyIdState(companyId);
    }

    const hash = targetCompanyId && (tab === 'companies' || tab === 'strategy-steps')
      ? `#${tab}?company=${targetCompanyId}`
      : `#${tab}`;

    if (push) {
      window.history.pushState({ tab, companyId: targetCompanyId }, '', hash);
    } else {
      window.history.replaceState({ tab, companyId: targetCompanyId }, '', hash);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab) => {
    navigateTo(tab);
  };

  const setSelectedCompanyId = (id) => {
    setSelectedCompanyIdState(id);
    if (activeTab === 'companies' || activeTab === 'strategy-steps') {
      window.history.replaceState({ tab: activeTab, companyId: id }, '', `#${activeTab}?company=${id}`);
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
    const handlePopState = (e) => {
      if (e.state && e.state.tab) {
        setActiveTabState(e.state.tab);
        if (e.state.companyId) {
          setSelectedCompanyIdState(e.state.companyId);
        }
      } else {
        const parsed = parseHash(window.location.hash);
        setActiveTabState(parsed.tab);
        if (parsed.companyId) {
          setSelectedCompanyIdState(parsed.companyId);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    // Initial state sync
    if (!window.history.state) {
      const initial = parseHash(window.location.hash);
      window.history.replaceState(
        { tab: initial.tab, companyId: initial.companyId || 'apple' },
        '',
        window.location.hash || '#about'
      );
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-brand-cyan/20 selection:text-brand-cyan transition-colors duration-300">
      {/* Dynamic Ambient Background Aura Lighting (Gridless) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-cyan/10 dark:bg-brand-cyan/[0.07] rounded-full blur-[120px] animate-ambient-float" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-brand-indigo/10 dark:bg-brand-indigo/[0.07] rounded-full blur-[130px] animate-ambient-float" style={{ animationDelay: '-4s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-brand-emerald/10 dark:bg-brand-emerald/[0.05] rounded-full blur-[140px] animate-ambient-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Top Fixed Navigation & Persona / Theme Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area with Animated Page Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'about' && (
              <About
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                selectedPersona={selectedPersona}
                theme={theme}
              />
            )}

            {activeTab === 'overview' && (
              <Overview
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                selectedPersona={selectedPersona}
                theme={theme}
              />
            )}

            {activeTab === 'search-condition' && (
              <SearchCondition
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                theme={theme}
              />
            )}

            {activeTab === 'strategy-steps' && (
              <StrategySteps
                selectedCompanyId={selectedCompanyId}
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                theme={theme}
              />
            )}

            {activeTab === 'companies' && (
              <Companies
                setActiveTab={setActiveTab}
                selectedCompanyId={selectedCompanyId}
                setSelectedCompanyId={setSelectedCompanyId}
                theme={theme}
              />
            )}

            {activeTab === 'startup-intel' && (
              <StartupIntel
                setActiveTab={setActiveTab}
                setSelectedCompanyId={setSelectedCompanyId}
                theme={theme}
              />
            )}

            {activeTab === 'investors-startups' && (
              <InvestorsStartups
                selectedPersona={selectedPersona}
                theme={theme}
              />
            )}

            {activeTab === 'graph-analysis' && (
              <GraphAnalysis 
                theme={theme}
              />
            )}

            {activeTab === 'market-dashboard' && (
              <MarketDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Global Footer */}
      <Footer setActiveTab={setActiveTab} theme={theme} />
    </div>
  );
}
