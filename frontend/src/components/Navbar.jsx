import React from 'react';
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
  Users
} from 'lucide-react';
import SentinelAlerts from './SentinelAlerts';

const NAV_ITEMS = [
  { id: 'about', label: 'Dashboard', icon: Sparkles },
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'search-condition', label: 'Crisis Engine', icon: Search },
  { id: 'strategy-steps', label: 'Strategies', icon: ListOrdered },
  { id: 'startup-intel', label: 'Startup Intel', icon: ShieldCheck },
  { id: 'investors-startups', label: 'Deal Flow', icon: Briefcase },
  { id: 'graph-analysis', label: 'Network', icon: TrendingUp },
  { id: 'market-dashboard', label: 'Markets', icon: Activity },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedPersona,
  setSelectedPersona
}) {
  return (
    <header className="sticky top-0 z-50 w-full h-[70px] bg-[#0c0c10]/95 backdrop-blur-xl border-b border-white/10 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Logo & Brand Name */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('landing');
          }}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded grid place-items-center bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-[#0c0c10] rounded-sm flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-[15px] tracking-[.12em] text-white hidden sm:block" style={{fontFamily:"Orbitron,sans-serif"}}>
            ICLAS
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none mx-4">
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
                className={`relative flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-white/40'}`} />
                <span className="whitespace-nowrap tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Persona Switcher */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-omni-query'))}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-[10px] text-white/70 tracking-widest font-semibold uppercase"
            >
              <Search className="w-3.5 h-3.5" /> <span>Cmd+K</span>
            </button>
            <SentinelAlerts />
          </div>

          <div className="hidden lg:flex items-center space-x-1 bg-white/5 p-1 rounded-lg border border-white/10">
            {['Entrepreneur', 'Investor', 'Researcher'].map((persona) => {
              const isSelected = selectedPersona === persona;
              return (
                <button
                  key={persona}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPersona(persona);
                  }}
                  className={`px-3 py-1 rounded-[4px] text-[10px] uppercase tracking-wider font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-white/40 hover:text-white/80 border border-transparent'
                  }`}
                >
                  {persona}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
}
