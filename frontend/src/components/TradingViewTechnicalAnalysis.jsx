import React, { useMemo } from 'react';
import { ExternalLink, TrendingUp, Gauge } from 'lucide-react';

/**
 * Official TradingView Technical Analysis Gauge Widget
 * Displays live oscillator & moving average buy/neutral/sell ratings in real-time
 */
export default function TradingViewTechnicalAnalysis({ ticker = 'AAPL', exchange = 'NASDAQ', height = 430 }) {
  const symbol = useMemo(() => {
    const nyseTickers = ['WMT', 'JPM', 'WFC', 'BABA', 'T', 'TGT', 'F', 'GE', 'DIS', 'BA', 'KO', 'BBY', 'SQ', 'UBER', 'SNAP'];
    const exch = exchange || (nyseTickers.includes(ticker.toUpperCase()) ? 'NYSE' : 'NASDAQ');
    return `${exch}:${ticker.toUpperCase()}`;
  }, [ticker, exchange]);

  const widgetConfig = useMemo(() => {
    const config = {
      interval: "1D",
      width: "100%",
      isTransparent: true,
      height: height,
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark"
    };
    return encodeURIComponent(JSON.stringify(config));
  }, [symbol, height]);

  const embedUrl = `https://s.tradingview.com/embed-widget/technical-analysis/?locale=en#${widgetConfig}`;

  return (
    <div className="bg-[#101020] rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-3.5 bg-[#0c0c16] border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-cyan-400" />
          <h4 className="font-extrabold text-white">TradingView Technical Analysis Gauge</h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono">
            Live Oscillators
          </span>
        </div>

        <a
          href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/technicals/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-400 font-mono text-[11px] flex items-center gap-1 transition"
        >
          <span>TradingView Ideas</span>
          <ExternalLink size={11} />
        </a>
      </div>

      <div className="relative w-full bg-[#0c0c16] p-2" style={{ height }}>
        <iframe
          key={symbol}
          title={`TradingView Technical Analysis ${symbol}`}
          src={embedUrl}
          className="w-full h-full border-0"
          allowTransparency={true}
          scrolling="no"
        />
      </div>

      <div className="p-2.5 px-4 bg-[#0c0c16] border-t border-white/10 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span>Evaluates 26 technical indicators: RSI, Stochastic, CCI, MACD, ADX, Momentum, Moving Averages</span>
        <span className="text-emerald-400 font-bold">Real-time Stream</span>
      </div>
    </div>
  );
}
