import React, { useState, useMemo } from 'react';
import { ExternalLink, Maximize2, RefreshCw, BarChart2, Activity } from 'lucide-react';

/**
 * Official TradingView Live Advanced Real-Time Chart Embed
 * Connects directly to real-time global financial market feeds (NASDAQ / NYSE)
 */
export default function TradingViewChart({ 
  ticker = 'AAPL', 
  exchange = 'NASDAQ', 
  height = 560,
  defaultInterval = 'D',
  companyName = 'Company'
}) {
  const [interval, setInterval] = useState(defaultInterval);
  const [key, setKey] = useState(0);

  // Normalize symbol for TradingView
  const symbol = useMemo(() => {
    const nyseTickers = ['WMT', 'JPM', 'WFC', 'BABA', 'T', 'TGT', 'F', 'GE', 'DIS', 'BA', 'KO', 'BBY', 'SQ', 'UBER', 'SNAP'];
    const exch = exchange || (nyseTickers.includes(ticker.toUpperCase()) ? 'NYSE' : 'NASDAQ');
    return `${exch}:${ticker.toUpperCase()}`;
  }, [ticker, exchange]);

  const embedUrl = useMemo(() => {
    const config = {
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    };
    return `https://s.tradingview.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
  }, [symbol, interval, ticker, key]);

  return (
    <div className="bg-[#101020] rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#0c0c16] border-b border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white font-mono">{symbol}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 font-medium">
              TradingView Live Feed
            </span>
          </div>

          {/* Timeframe intervals */}
          <div className="flex items-center gap-1 bg-[#141424] p-0.5 rounded-xl border border-white/10">
            {[
              { label: '1m', val: '1' },
              { label: '5m', val: '5' },
              { label: '1h', val: '60' },
              { label: '1D', val: 'D' },
              { label: '1W', val: 'W' },
              { label: '1M', val: 'M' }
            ].map(tf => (
              <button
                key={tf.val}
                onClick={() => setInterval(tf.val)}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold transition ${
                  interval === tf.val
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* External Real Websites Shortcuts */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setKey(k => k + 1)}
            className="p-1.5 rounded-lg bg-[#141424] text-slate-400 hover:text-white border border-white/10 transition"
            title="Reload Chart"
          >
            <RefreshCw size={13} />
          </button>

          <a
            href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#141424] hover:bg-[#1a1a2e] text-slate-300 hover:text-indigo-400 border border-white/10 font-medium text-[11px] flex items-center gap-1.5 transition"
          >
            <span>TradingView.com</span>
            <ExternalLink size={11} />
          </a>

          <a
            href={`https://finance.yahoo.com/quote/${ticker}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#141424] hover:bg-[#1a1a2e] text-slate-300 hover:text-emerald-400 border border-white/10 font-medium text-[11px] flex items-center gap-1.5 transition"
          >
            <span>Yahoo Finance</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Embedded Real-Time TradingView Frame */}
      <div className="relative w-full bg-[#0c0c16]" style={{ height }}>
        <iframe
          key={`${symbol}-${interval}-${key}`}
          title={`TradingView Chart ${symbol}`}
          src={embedUrl}
          className="w-full h-full border-0"
          allowTransparency={true}
          scrolling="no"
          allowFullScreen={true}
        />
      </div>

      {/* Footer Info Strip */}
      <div className="flex items-center justify-between p-2.5 px-4 bg-[#0c0c16] border-t border-white/10 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Real-time candlestick ticks streamed via TradingView</span>
          <span>•</span>
          <span className="text-slate-300 font-semibold">{companyName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Indicators: Volume, MA, RSI, MACD, Bollinger Bands</span>
        </div>
      </div>
    </div>
  );
}
