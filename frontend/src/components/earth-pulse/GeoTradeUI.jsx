import React from 'react';
import { Activity, Globe2, Map, LineChart, PieChart, Radio, Settings2, MapPin } from 'lucide-react';

export default function GeoTradeUI() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6 overflow-hidden text-white font-sans">
      {/* Top Header Bar */}
      <header className="w-full flex justify-between items-start">
        <div className="flex gap-4 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-auto cursor-pointer">
            <Activity className="text-red-500 w-5 h-5 animate-pulse" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-white/60 tracking-wider">GEOTRADE</span>
              <span className="font-bold text-sm tracking-widest">TRADER v2.0</span>
            </div>
          </div>

          {/* GTI Score */}
          <div className="hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
            <span className="text-xs text-white/60">GLOBAL TENSION INDEX</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-orange-500">71.4</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">ELEVATED</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-full pointer-events-auto">
          {[
            { name: 'WEBSITE', icon: Globe2 },
            { name: 'EARTH PULSE', icon: Activity, active: true },
            { name: 'GEO MAP', icon: Map },
            { name: 'AI SIGNALS', icon: Radio },
            { name: 'PORTFOLIO', icon: PieChart },
          ].map((tab) => (
            <button 
              key={tab.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors ${
                tab.active 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-green-400 hover:bg-white/5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            LIVE
          </button>
        </nav>
      </header>

      {/* Main Center Overlay (Click Prompt) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 flex flex-col items-center gap-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 animate-bounce">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs md:text-sm font-medium tracking-wide">Click any country to view market impact {'>'}</span>
        </div>
      </div>

      {/* Bottom Area */}
      <footer className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-end">
          {/* Bottom Left Panel: Risk Level */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-48 pointer-events-auto">
            <h3 className="text-[10px] text-white/50 tracking-widest mb-3 font-semibold">RISK LEVEL</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'CRITICAL ≥80', color: 'bg-red-500', shadow: 'shadow-[0_0_10px_#EF4444]' },
                { label: 'HIGH ≥60', color: 'bg-orange-500', shadow: 'shadow-[0_0_10px_#F59E0B]' },
                { label: 'MEDIUM ≥35', color: 'bg-cyan-500', shadow: 'shadow-[0_0_10px_#06B6D4]' },
                { label: 'LOW <35', color: 'bg-emerald-500', shadow: 'shadow-[0_0_10px_#10B981]' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} ${item.shadow}`} />
                  <span className="text-xs font-mono">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right Panel: Arc Types */}
          <div className="flex flex-col items-end gap-4 pointer-events-auto">
            <button className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105">
              JOIN WAITLIST
            </button>

            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-56 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] text-white/50 tracking-widest font-semibold">ARC TYPES</h3>
                <button className="flex items-center gap-1.5 text-[10px] text-white/80 hover:text-white bg-white/5 px-2 py-1 rounded">
                  <Settings2 className="w-3 h-3" /> SIGNALS
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {[
                  { label: 'Military', color: 'bg-red-500' },
                  { label: 'Sanctions', color: 'bg-orange-500' },
                  { label: 'Trade', color: 'bg-amber-400' },
                  { label: 'Diplomatic', color: 'bg-cyan-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[11px] text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Ticker Bar */}
        <div className="w-full bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2.5 flex items-center gap-6 overflow-hidden pointer-events-auto text-xs font-mono whitespace-nowrap">
          <div className="flex items-center gap-2 text-orange-400 font-bold shrink-0">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              ))}
            </div>
            GTI 71
          </div>
          
          <div className="w-px h-4 bg-white/20 shrink-0" />
          
          <div className="flex items-center gap-8 animate-[ticker_30s_linear_infinite]">
            <span className="flex items-center gap-2 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Strait of Hormuz Naval Drills Escalating...
            </span>
            <span className="flex items-center gap-2 text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              ECB Emergency Statement Issued
            </span>
            <span className="flex items-center gap-2 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Rare Earth Export Bans Expected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
