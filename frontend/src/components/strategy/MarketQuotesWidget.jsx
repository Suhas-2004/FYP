"use client";

import React, { useEffect, useRef, memo, useState } from 'react';
import { DASHBOARD_CHARTS } from './search-data';

const SingleQuoteWidget = memo(({ name, symbols }) => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      symbolsGroups: [
        {
          name: name,
          originalName: name,
          symbols: symbols.map(s => ({ name: s, displayName: s }))
        }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: "dark",
      locale: "en"
    });
    container.current.appendChild(script);
  }, []); // Run exactly once per key mount

  return (
    <div className="w-full h-full relative">
      <div className="tradingview-widget-container w-full h-full absolute inset-0" ref={container}>
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
});

function MarketQuotesWidget() {
  const [activeTab, setActiveTab] = useState('Financial');

  const tabs = [
    { id: 'Financial', label: 'Financial', symbols: DASHBOARD_CHARTS.Financials },
    { id: 'Technology', label: 'Technology', symbols: DASHBOARD_CHARTS.Technology },
    { id: 'Services', label: 'Services', symbols: DASHBOARD_CHARTS.Services },
  ];

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col bg-[#131722] rounded-xl overflow-hidden border border-[#2A2E39]">
      {/* Tabs Header */}
      <div className="flex border-b border-[#2A2E39] px-4 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-[#787B86] hover:text-[#D1D4DC]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-amber" />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 w-full relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`w-full h-full absolute inset-0 ${
              activeTab === tab.id ? 'opacity-100 z-10' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <SingleQuoteWidget key={tab.id} name={tab.label} symbols={tab.symbols} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MarketQuotesWidget);
