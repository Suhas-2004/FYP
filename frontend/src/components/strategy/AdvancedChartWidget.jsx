"use client";

import React, { useEffect, useRef, memo, useState } from 'react';
import { DASHBOARD_CHARTS, DEFAULT_SEARCH_STOCKS } from './search-data';
import { Plus, X } from 'lucide-react';

function AdvancedChartWidget() {
  const container = useRef(null);

  const [watchlist, setWatchlist] = useState([
    ...DASHBOARD_CHARTS.Financials.slice(0, 4),
    ...DASHBOARD_CHARTS.Technology.slice(0, 4),
    ...DASHBOARD_CHARTS.Services.slice(0, 4)
  ]);
  const [newSymbol, setNewSymbol] = useState('');

  const ALL_STOCKS = Object.values(DEFAULT_SEARCH_STOCKS).flat();
  const [showDropdown, setShowDropdown] = useState(false);

  const COMPANY_NAMES = {
    AAPL: "Apple Inc.", MSFT: "Microsoft Corp.", GOOGL: "Alphabet Inc.", AMZN: "Amazon.com", TSLA: "Tesla Inc.", 
    META: "Meta Platforms", NVDA: "NVIDIA Corp.", NFLX: "Netflix Inc.", ORCL: "Oracle Corp.", CRM: "Salesforce Inc.",
    ADBE: "Adobe Inc.", INTC: "Intel Corp.", AMD: "Advanced Micro Devices", PYPL: "PayPal Holdings", UBER: "Uber Technologies", 
    ZM: "Zoom Video", SPOT: "Spotify Technology", SQ: "Block Inc.", SHOP: "Shopify Inc.", ROKU: "Roku Inc.",
    SNOW: "Snowflake Inc.", PLTR: "Palantir Tech", COIN: "Coinbase Global", RBLX: "Roblox Corp.", DDOG: "Datadog Inc.", 
    CRWD: "CrowdStrike", NET: "Cloudflare", OKTA: "Okta Inc.", TWLO: "Twilio Inc.", DOCU: "DocuSign", 
    PTON: "Peloton", PINS: "Pinterest", SNAP: "Snap Inc.", LYFT: "Lyft Inc.", DASH: "DoorDash", 
    ABNB: "Airbnb", RIVN: "Rivian", LCID: "Lucid Group", NIO: "NIO Inc.",
    JPM: "JPMorgan Chase", WFC: "Wells Fargo", BAC: "Bank of America", HSBC: "HSBC Holdings", C: "Citigroup", MA: "Mastercard"
  };

  const filteredStocks = ALL_STOCKS.filter(
    s => s.toLowerCase().includes(newSymbol.toLowerCase()) && !watchlist.includes(s)
  );

  const handleAddSubmit = (e, explicitSymbol) => {
    if (e) e.preventDefault();
    const symbol = (explicitSymbol || newSymbol).trim().toUpperCase();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
      setNewSymbol('');
      setShowDropdown(false);
    }
  };

  const handleRemove = (symbolToRemove) => {
    setWatchlist(prev => prev.filter(s => s !== symbolToRemove));
  };

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous widget if re-rendered
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "symbol": "${watchlist[0] || 'JPM'}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(19, 23, 34, 1)",
        "gridColor": "rgba(42, 46, 57, 0.06)",
        "allow_symbol_change": true,
        "watchlist": ${JSON.stringify(watchlist)},
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);
  }, [watchlist]);

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col bg-[#131722] rounded-xl overflow-hidden border border-[#2A2E39]">
      <div className="px-4 py-3 border-b border-[#2A2E39] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold text-sm font-sans">Advanced Technical Analysis</h2>
          
          <div className="relative z-50">
            <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
              <input 
                type="text" 
                value={newSymbol}
                onChange={(e) => {
                  setNewSymbol(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Add Symbol (e.g. TSLA)" 
                className="bg-[#2A2E39] text-white text-xs px-3 py-1.5 rounded outline-none border border-transparent focus:border-brand-amber transition-colors w-40"
              />
              <button type="submit" className="bg-brand-amber hover:bg-brand-caramel text-white p-1.5 rounded transition-colors flex items-center justify-center">
                <Plus className="w-3 h-3" />
              </button>
            </form>

            {/* Dropdown Breakdown Section */}
            {showDropdown && newSymbol && filteredStocks.length > 0 && (
              <div className="absolute top-full mt-1 right-0 w-64 max-h-60 overflow-y-auto custom-scrollbar bg-[#1E222D] border border-[#2A2E39] rounded-md shadow-xl py-1">
                {filteredStocks.map(sym => (
                  <button
                    key={sym}
                    onClick={() => handleAddSubmit(undefined, sym)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#2A2E39] flex justify-between items-center transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-white">{sym}</span>
                    <span className="text-muted-foreground truncate ml-2 text-[10px]">{COMPANY_NAMES[sym] || 'Stock'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {watchlist.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchlist.map(sym => (
              <div key={sym} className="flex items-center gap-1.5 bg-[#2A2E39] px-2 py-1 rounded text-xs text-muted-foreground group hover:text-white transition-colors">
                <span className="font-medium tracking-wide">{sym}</span>
                <button 
                  onClick={() => handleRemove(sym)} 
                  className="opacity-50 group-hover:opacity-100 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative">
        <div className="tradingview-widget-container w-full h-full absolute inset-0" ref={container}>
          <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default memo(AdvancedChartWidget);
