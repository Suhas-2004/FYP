"use client";

import React, { useEffect, useRef, useState, memo } from 'react';
import { Search } from 'lucide-react';

const Gauge = ({ symbol, title }) => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1D",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": "${symbol}",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }`;
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="flex-1 min-w-[200px] h-full flex flex-col items-center">
      <div className="text-white/80 font-mono text-xs mb-2 tracking-widest">{title}</div>
      <div className="w-full flex-1 relative">
        <div className="tradingview-widget-container w-full h-full absolute inset-0">
          <div className="tradingview-widget-container__widget w-full h-full" ref={container}></div>
        </div>
      </div>
    </div>
  );
};

function MarketSentimentWidget() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("NASDAQ:AAPL");
  const [activeTitle, setActiveTitle] = useState("APPLE (AAPL)");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    const formattedSymbol = searchInput.toUpperCase();
    setActiveSymbol(formattedSymbol);
    setActiveTitle(formattedSymbol);
    setSearchInput("");
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col bg-transparent overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-terracotta shadow-[0_0_8px_#e05a36] animate-pulse"></span>
            Sentiment Gauges
          </h2>
          <span className="text-[10px] text-brand-amber border border-brand-amber/30 bg-brand-amber/10 px-2 py-0.5 rounded font-mono hidden sm:block">
            QUANTITATIVE
          </span>
        </div>
        
        <form onSubmit={handleSearch} className="relative group w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-amber/30 to-brand-terracotta/30 rounded blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-[#0A0F14] border border-white/10 rounded px-3 py-1.5 shadow-lg">
            <Search className="text-muted-foreground group-focus-within:text-brand-amber transition-colors mr-2" size={14} />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ticker (e.g., TSLA, MSFT)..."
              className="w-full bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-muted-foreground/50"
            />
          </div>
        </form>
      </div>
      
      <div className="flex-1 w-full p-4 flex gap-4 overflow-x-auto custom-scrollbar items-center">
        <Gauge symbol={activeSymbol} title={activeTitle} />
      </div>
    </div>
  );
}

export default memo(MarketSentimentWidget);
