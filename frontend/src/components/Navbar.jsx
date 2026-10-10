import React from 'react';
import {
  Search,
  Activity,
} from 'lucide-react';
import SentinelAlerts from './SentinelAlerts';
import { FloatingDock } from "./ui/floating-dock";
import {
  IconHome,
  IconLayoutDashboard,
  IconChartHistogram,
  IconExchange,
  IconNewSection,
  IconTerminal2,
  IconBuildingSkyscraper,
  IconTrendingUp,
  IconRoute
} from "@tabler/icons-react";



export default function Navbar({
  activeTab,
  setActiveTab,
  selectedPersona,
  setSelectedPersona
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-[70px] bg-[#0c0c10]/70 backdrop-blur-xl border-b border-white/10 select-none shadow-sm">
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

        {/* Navigation handled by the Floating Dock */}
        <div className="flex-grow flex justify-center items-center pointer-events-auto">
          <FloatingDock
            desktopClassName="bg-transparent border-none shadow-none h-14"
            mobileClassName="translate-y-20"
            items={[
              {
                title: "Dashboard",
                icon: <IconLayoutDashboard className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('about'),
                active: activeTab === 'about'
              },
              {
                title: "Home",
                icon: <IconHome className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('overview'),
                active: activeTab === 'overview'
              },
              {
                title: "Market",
                icon: <IconChartHistogram className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('market-dashboard'),
                active: activeTab === 'market-dashboard'
              },
              {
                title: "Companies",
                icon: <IconBuildingSkyscraper className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('companies'),
                active: activeTab === 'companies'
              },
              {
                title: "AI Crisis Matcher",
                icon: <IconExchange className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('search-condition'),
                active: activeTab === 'search-condition'
              },
              {
                title: "Strategies",
                icon: <IconRoute className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('strategy-steps'),
                active: activeTab === 'strategy-steps'
              },
              {
                title: "Graph Analysis",
                icon: <IconTrendingUp className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('graph-analysis'),
                active: activeTab === 'graph-analysis'
              },
              {
                title: "Startup Intel",
                icon: <IconTerminal2 className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('startup-intel'),
                active: activeTab === 'startup-intel'
              },
              {
                title: "Dealflow",
                icon: <IconNewSection className="h-full w-full text-slate-300" />,
                onClick: () => setActiveTab('investors-startups'),
                active: activeTab === 'investors-startups'
              }
            ]}
          />
        </div>

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
