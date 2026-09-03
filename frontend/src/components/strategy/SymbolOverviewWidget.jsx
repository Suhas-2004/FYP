"use client";

import React, { useEffect, useRef, memo } from 'react';
import { DASHBOARD_CHARTS } from './search-data';

function SymbolOverviewWidget() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous widget if re-rendered
    container.current.innerHTML = '';

    const companyNames = {
      JPM: "JPMorgan Chase", WFC: "Wells Fargo", BAC: "Bank of America", HSBC: "HSBC Holdings", C: "Citigroup", MA: "Mastercard",
      AAPL: "Apple Inc.", GOOGL: "Alphabet Inc.", MSFT: "Microsoft Corp.", META: "Meta Platforms", ORCL: "Oracle Corp.", INTC: "Intel Corp.",
      AMZN: "Amazon.com", BABA: "Alibaba Group", T: "AT&T Inc.", WMT: "Walmart Inc.", V: "Visa Inc."
    };

    const tabs = [
      {
        title: "Financial",
        symbols: DASHBOARD_CHARTS.Financials.map(s => ({ s: s, d: companyNames[s] || s })),
        originalTitle: "Financial"
      },
      {
        title: "Technology",
        symbols: DASHBOARD_CHARTS.Technology.map(s => ({ s: s, d: companyNames[s] || s })),
        originalTitle: "Technology"
      },
      {
        title: "Services",
        symbols: DASHBOARD_CHARTS.Services.map(s => ({ s: s, d: companyNames[s] || s })),
        originalTitle: "Services"
      }
    ];

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "width": "100%",
        "height": "100%",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(0, 255, 136, 1)",
        "plotLineColorFalling": "rgba(255, 82, 82, 1)",
        "gridLineColor": "rgba(42, 46, 57, 0)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(0, 255, 136, 0.12)",
        "belowLineFillColorFalling": "rgba(255, 82, 82, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(0, 255, 136, 0)",
        "belowLineFillColorFallingBottom": "rgba(255, 82, 82, 0)",
        "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
        "tabs": ${JSON.stringify(tabs)}
      }`;
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col bg-[#131722] rounded-xl overflow-hidden border border-[#2A2E39]">
      <div className="px-4 py-3 border-b border-[#2A2E39]">
        <h2 className="text-white font-semibold text-sm font-sans">Market Overview</h2>
      </div>
      <div className="flex-1 w-full relative">
        <div className="tradingview-widget-container w-full h-full absolute inset-0" ref={container}>
          <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default memo(SymbolOverviewWidget);
