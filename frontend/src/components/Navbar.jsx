import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Search,
  ListOrdered,
  Building2,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Activity,
  Users,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

// ⚙️ ============================================================================
// NAVBAR ANIMATION SPEED CONFIGURATION (Change this number anytime!)
// ----------------------------------------------------------------------------
//  0.20 -> Very fast / Snappy
//  0.35 -> Balanced & Smooth (Default recommendation)
//  0.60 -> Moderately slow
//  0.90 -> Very slow & Cinematic
// ============================================================================
const ANIM_DURATION = 0.35; // in seconds

const NAV_ITEMS = [
  { id: 'about', label: 'About', icon: Sparkles },
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'search-condition', label: 'Search Condition', icon: Search },
  { id: 'strategy-steps', label: 'Strategy Steps', icon: ListOrdered },
  { id: 'startup-intel', label: 'Startup Intel', icon: ShieldCheck },
  { id: 'investors-startups', label: 'Investors & Startups', icon: Briefcase },
  { id: 'graph-analysis', label: 'Graph Analysis', icon: TrendingUp },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedPersona,
  setSelectedPersona,
  theme,
  toggleTheme
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const navRef = useRef(null);

  const isVisible = isHovered || isLocked;

  // Close when clicking outside if locked open
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsLocked(false);
        setIsHovered(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isVisible) setIsLocked(true);
      }}
      style={{ transitionDuration: `${ANIM_DURATION}s` }}
      className={`sticky top-0 z-50 w-full h-16 transition-all ease-in-out cursor-default select-none ${
        isVisible
          ? 'bg-[#fdfaf5]/95 dark:bg-dark-950/95 backdrop-blur-xl border-b border-[#dcceb9]/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl'
          : 'bg-[#fdfaf5]/40 dark:bg-dark-950/30 backdrop-blur-md border-b border-[#dcceb9]/50 dark:border-slate-800/50 shadow-sm'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* =========================================================================
            1. IDLE STATE: Colourless Bar Placeholder (Visible on page load when not hovered)
            ========================================================================= */}
        <AnimatePresence>
          {!isVisible && (
            <motion.div
              key="idle-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIM_DURATION, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 px-4 sm:px-6 flex items-center justify-between pointer-events-none"
            >
              {/* Left: Minimal Logo & Brand Indicator */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-[#fdfaf5] dark:bg-dark-950 rounded-[6px] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <span className="text-base font-heading font-extrabold tracking-tight bg-gradient-to-r from-amber-950 via-amber-800 to-amber-600 dark:from-amber-200 dark:to-amber-400 bg-clip-text text-transparent">
                  ICLAS
                </span>
              </div>

              {/* Center: Sleek Hover/Click Prompt Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#eee3d5]/70 dark:bg-dark-900/50 border border-[#dcceb9] dark:border-slate-800/70 backdrop-blur-md text-[11px] text-[#73533d] dark:text-slate-400 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-semibold">Hover or click to view navigation</span>
                <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-bounce" />
              </div>

              {/* Right: Active Persona Pill */}
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#eee3d5]/50 dark:bg-dark-900/40 border border-[#dcceb9] dark:border-slate-800/50 text-[11px] text-[#73533d] dark:text-slate-400">
                <Users className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-[#24160d] dark:text-slate-300">{selectedPersona}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            2. HOVERED/CLICKED STATE: Full Navigation Items (Fades in without moving page)
            ========================================================================= */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key="active-navbar-content"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: ANIM_DURATION, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center justify-between"
            >
              {/* Logo & Brand Name */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('about');
                }}
                className="flex items-center space-x-3 cursor-pointer group/logo flex-shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 p-0.5 shadow-glow-amber transition-transform group-hover/logo:scale-105 duration-200">
                  <div className="w-full h-full bg-[#fdfaf5] dark:bg-dark-950 rounded-[10px] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover/logo:scale-110 transition-transform duration-200" />
                  </div>
                </div>
                <div className="hidden xl:block">
                  <span className="text-lg font-heading font-extrabold tracking-tight bg-gradient-to-r from-[#24160d] via-amber-900 to-amber-600 dark:from-white dark:via-amber-100 dark:to-amber-400 bg-clip-text text-transparent">
                    ICLAS
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none mx-2 py-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(item.id);
                      }}
                      className={`relative flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'text-amber-900 dark:text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-glow-amber font-bold'
                          : 'text-[#5a3e2b] dark:text-slate-300 hover:text-[#24160d] dark:hover:text-white hover:bg-amber-500/10 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-[#84654f] dark:text-slate-400'}`} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Right Controls: Persona & Theme Switcher */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Persona Switcher Buttons */}
                <div className="hidden md:flex items-center space-x-1 bg-[#eee3d5] dark:bg-dark-900 p-0.5 rounded-lg border border-[#dcceb9] dark:border-slate-800">
                  {['Entrepreneur', 'Investor', 'Researcher'].map((persona) => {
                    const isSelected = selectedPersona === persona;
                    return (
                      <button
                        key={persona}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPersona(persona);
                        }}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#fdfaf5] dark:bg-dark-800 text-amber-800 dark:text-amber-400 shadow-sm font-bold border border-[#dcceb9]/60 dark:border-transparent'
                            : 'text-[#6c4f38] dark:text-slate-400 hover:text-[#24160d] dark:hover:text-slate-200'
                        }`}
                      >
                        {persona}
                      </button>
                    );
                  })}
                </div>

                {/* Theme Toggle */}
                {toggleTheme && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    title={`Switch to ${theme === 'dark' ? 'Light Coffee' : 'Dark Roast'} Theme`}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5a3e2b] dark:text-slate-300 hover:text-[#24160d] dark:hover:text-slate-100 hover:bg-amber-500/10 transition-all border border-[#dcceb9] dark:border-slate-800"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-amber-800" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
