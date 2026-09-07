import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about', label: 'About', icon: Sparkles },
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'search-condition', label: 'Search Condition', icon: Search },
  { id: 'strategy-steps', label: 'Strategy Steps', icon: ListOrdered },
  { id: 'startup-intel', label: 'Startup Intel', icon: ShieldCheck },
  { id: 'investors-startups', label: 'Investors & Startups', icon: Briefcase },
  { id: 'graph-analysis', label: 'Graph Analysis', icon: TrendingUp },
  { id: 'market-dashboard', label: 'Market Dashboard', icon: Activity },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedPersona,
  setSelectedPersona,
  theme,
  toggleTheme
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for dynamic glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full h-16 transition-[background-color,border-color,box-shadow] duration-200 ${
        isScrolled
          ? 'bg-[#fdfaf5]/90 dark:bg-dark-950/90 backdrop-blur-xl border-b border-[#dcceb9]/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl'
          : 'bg-[#fdfaf5] dark:bg-[#120c08] border-b border-[#dcceb9] dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Left: Logo & Brand Indicator */}
        <div
          onClick={() => setActiveTab('about')}
          className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 p-0.5 shadow-glow-amber transition-transform group-hover:scale-105 duration-200">
            <div className="w-full h-full bg-[#fdfaf5] dark:bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <span className="text-base sm:text-lg font-heading font-extrabold tracking-tight bg-gradient-to-r from-[#24160d] via-amber-900 to-amber-600 dark:from-white dark:via-amber-100 dark:to-amber-400 bg-clip-text text-transparent">
            ICLAS
          </span>
        </div>

        {/* Center: Full Navigation Items */}
        <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none mx-2 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex-shrink-0 flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-glow-amber font-bold'
                    : 'text-[#5a3e2b] dark:text-slate-300 hover:text-[#24160d] dark:hover:text-white hover:bg-amber-500/10 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-[#84654f] dark:text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 sm:left-3 sm:right-3 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Theme Toggle */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Persona Switcher Buttons */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#eee3d5] dark:bg-dark-900 p-0.5 rounded-lg border border-[#dcceb9] dark:border-slate-800">
            {['Entrepreneur', 'Investor', 'Researcher'].map((persona) => {
              const isSelected = selectedPersona === persona;
              return (
                <button
                  key={persona}
                  onClick={() => setSelectedPersona(persona)}
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
              onClick={toggleTheme}
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

      </div>
    </header>
  );
}
