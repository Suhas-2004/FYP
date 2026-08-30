import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Search, 
  ListOrdered, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

const TAB_METADATA = {
  about: { title: 'About ICLAS', icon: Sparkles, color: 'text-brand-cyan' },
  overview: { title: 'Overview Dashboard', icon: Layers, color: 'text-brand-cyan' },
  companies: { title: 'Companies Intelligence', icon: Building2, color: 'text-brand-indigo' },
  'search-condition': { title: 'Search Crisis Condition', icon: Search, color: 'text-brand-emerald' },
  'strategy-steps': { title: 'Strategy Steps Roadmap', icon: ListOrdered, color: 'text-brand-purple' },
  'startup-intel': { title: 'Startup Intel Evidence', icon: ShieldCheck, color: 'text-brand-rose' },
  'investors-startups': { title: 'Investors & Startups', icon: Briefcase, color: 'text-brand-amber' },
  'graph-analysis': { title: 'Graph Analysis & Stock AI', icon: TrendingUp, color: 'text-blue-500' },
};

const COMPANY_NAMES = {
  apple: 'Apple Inc.',
  marvel: 'Marvel Entertainment',
  netflix: 'Netflix',
  lego: 'The LEGO Group',
  ibm: 'IBM',
  tesla: 'Tesla Motors',
  ford: 'Ford Motor Co.',
  starbucks: 'Starbucks Corp.',
  bestbuy: 'Best Buy',
  general_motors: 'General Motors',
  nintendo: 'Nintendo'
};

export default function NavigationHeader({
  activeTab,
  setActiveTab,
  selectedCompanyId,
  goBack,
  canGoBack = true
}) {
  // If we are on the primary home/about page, we do not need the full back bar
  if (activeTab === 'about') {
    return null;
  }

  const currentMeta = TAB_METADATA[activeTab] || {
    title: activeTab,
    icon: Layers,
    color: 'text-brand-cyan'
  };
  const Icon = currentMeta.icon;
  const companyName = selectedCompanyId ? COMPANY_NAMES[selectedCompanyId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-dark-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm text-xs"
    >
      {/* Left: Back Button & Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-none py-0.5">
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.03, x: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={goBack}
          title="Go back to previous page (Alt + Left Arrow)"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-brand-cyan/10 hover:text-brand-cyan dark:hover:bg-brand-cyan/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold transition-all shadow-sm flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </motion.button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 flex-shrink-0" />

        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 flex-shrink-0 text-slate-500 dark:text-slate-400">
          
          {/* Home / About */}
          <button
            onClick={() => setActiveTab('about')}
            className="flex items-center space-x-1 hover:text-brand-cyan transition-colors font-medium"
            title="Return to About Landing Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          {/* Current Page */}
          <button
            onClick={() => setActiveTab(activeTab)}
            className={`flex items-center space-x-1 font-semibold ${
              companyName && (activeTab === 'companies' || activeTab === 'strategy-steps')
                ? 'hover:text-brand-cyan text-slate-600 dark:text-slate-300'
                : 'text-slate-900 dark:text-white pointer-events-none'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${currentMeta.color}`} />
            <span>{currentMeta.title}</span>
          </button>

          {/* Optional Sub-Detail (e.g. Selected Company) */}
          {companyName && (activeTab === 'companies' || activeTab === 'strategy-steps') && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-[11px] truncate max-w-[160px] sm:max-w-none">
                {companyName}
              </span>
            </>
          )}

        </nav>
      </div>

      {/* Right: Quick Portal Shortcuts */}
      <div className="hidden md:flex items-center space-x-2 text-[11px]">
        <button
          onClick={() => setActiveTab('about')}
          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-brand-cyan hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
        >
          About Platform
        </button>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <button
          onClick={() => setActiveTab('overview')}
          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-brand-cyan hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
        >
          Overview
        </button>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <button
          onClick={() => setActiveTab('companies')}
          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-brand-cyan hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
        >
          Companies
        </button>
      </div>

    </motion.div>
  );
}
