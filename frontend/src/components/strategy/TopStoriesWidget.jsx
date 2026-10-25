"use client";

import React, { useEffect, useRef, useState, memo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink, 
  Globe, 
  Cpu, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

// Fallback TradingView Live Timeline Component
const TradingViewTimeline = memo(() => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      locale: "en"
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="tradingview-widget-container w-full h-full absolute inset-0" ref={container}>
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
});

function TopStoriesWidget() {
  const [viewMode, setViewMode] = useState('ai_intel'); // 'ai_intel' | 'live_wire'
  const [news, setNews] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [activeTickerInfo, setActiveTickerInfo] = useState(null);

  // Fetch initial tickers and news
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [tickersRes, headlinesRes] = await Promise.all([
          api.getNewsTickers().catch(() => []),
          api.getTopHeadlines({ limit: 30 }).catch(() => [])
        ]);
        setTickers(tickersRes);
        setNews(headlinesRes);
      } catch (err) {
        console.error('Failed to load news sentiment data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // When ticker or sentiment filter changes
  useEffect(() => {
    async function filterData() {
      setLoading(true);
      try {
        if (selectedTicker === 'ALL') {
          setActiveTickerInfo(null);
          const params = { limit: 35 };
          if (selectedSentiment !== 'ALL') params.sentiment = selectedSentiment;
          const res = await api.getTopHeadlines(params);
          setNews(res);
        } else {
          const sentimentData = await api.getNewsSentiment(selectedTicker);
          setActiveTickerInfo(sentimentData);
          let filtered = sentimentData.recent_articles || [];
          if (selectedSentiment !== 'ALL') {
            filtered = filtered.filter(a => a.sentiment_label.toLowerCase() === selectedSentiment.toLowerCase());
          }
          setNews(filtered);
        }
      } catch (err) {
        console.error('Error fetching filtered news:', err);
      } finally {
        setLoading(false);
      }
    }

    if (viewMode === 'ai_intel') {
      filterData();
    }
  }, [selectedTicker, selectedSentiment, viewMode]);

  const getSentimentBadge = (label, longS, shortS) => {
    if (label === 'Bullish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <TrendingUp size={11} className="text-emerald-400" />
          Bullish {longS ? `(${(longS * 100).toFixed(0)}%)` : ''}
        </span>
      );
    }
    if (label === 'Bearish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <TrendingDown size={11} className="text-rose-400" />
          Bearish {shortS ? `(${(shortS * 100).toFixed(0)}%)` : ''}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Minus size={11} className="text-amber-300" />
        Neutral
      </span>
    );
  };

  return (
    <div className="w-full h-full min-h-[480px] flex flex-col bg-[#0c1017] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[#111622] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cpu size={15} className="text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold text-sm tracking-tight">Financial News Sentiment Intel</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-brand-amber/15 text-brand-caramel dark:text-brand-amber border border-brand-amber/30">
                NAS-100 LLM CoT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">304k news articles analyzed with sentiment & LLM reasoning</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode('ai_intel')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'ai_intel'
                ? 'bg-brand-amber/20 text-brand-caramel dark:text-brand-amber border border-brand-amber/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} />
            AI Sentiment Feed
          </button>
          <button
            onClick={() => setViewMode('live_wire')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'live_wire'
                ? 'bg-brand-amber/20 text-brand-caramel dark:text-brand-amber border border-brand-amber/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe size={12} />
            Global Wire
          </button>
        </div>
      </div>

      {/* Render View */}
      {viewMode === 'live_wire' ? (
        <div className="flex-1 w-full relative">
          <TradingViewTimeline />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-[#090d13]">
          {/* Controls Bar: Ticker Selection + Sentiment Filter */}
          <div className="px-4 py-2.5 bg-[#0e131c] border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
            {/* Tickers scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar text-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Ticker:</span>
              <button
                onClick={() => setSelectedTicker('ALL')}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all whitespace-nowrap ${
                  selectedTicker === 'ALL'
                    ? 'bg-white/15 text-white font-bold border border-white/30'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                All (Top)
              </button>
              {tickers.map(t => (
                <button
                  key={t.ticker}
                  onClick={() => setSelectedTicker(t.ticker)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all whitespace-nowrap ${
                    selectedTicker === t.ticker
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {t.ticker}
                </button>
              ))}
            </div>

            {/* Sentiment Pills */}
            <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-lg border border-white/5 text-xs">
              {['ALL', 'Bullish', 'Bearish', 'Neutral'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSentiment(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedSentiment === s
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Active Ticker Intelligence Banner (if specific ticker is chosen) */}
          {activeTickerInfo && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white tracking-wide font-mono">{activeTickerInfo.company} ({activeTickerInfo.ticker})</span>
                <span className="text-slate-400">Total Analyzed: <strong className="text-slate-200">{activeTickerInfo.total_articles.toLocaleString()} articles</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Net Sentiment Score:</span>
                  <span className={`font-mono font-bold ${activeTickerInfo.sentiment_score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeTickerInfo.sentiment_score > 0 ? `+${activeTickerInfo.sentiment_score}` : activeTickerInfo.sentiment_score}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeTickerInfo.sentiment_label.includes('Bullish')
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : activeTickerInfo.sentiment_label.includes('Bearish')
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {activeTickerInfo.sentiment_label}
                </span>
              </div>
            </div>
          )}

          {/* News Cards Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-500">
                <RefreshCw size={22} className="animate-spin text-amber-400" />
                <span className="text-xs font-mono">Loading sentiment intelligence...</span>
              </div>
            ) : news.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-1 text-slate-500">
                <AlertCircle size={20} className="text-slate-400" />
                <span className="text-xs">No news matching the selected sentiment filter.</span>
              </div>
            ) : (
              news.map((item, idx) => (
                <div
                  key={item.hash || idx}
                  className="p-3.5 rounded-xl bg-[#111722]/80 hover:bg-[#161d2b] border border-white/5 hover:border-amber-500/30 transition-all duration-200 shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] font-bold text-amber-300 border border-white/10">
                        {item.ticker || selectedTicker}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{item.pub_date}</span>
                      {getSentimentBadge(item.sentiment_label, item.long_s, item.short_s)}
                    </div>

                    {item.rss_url && (
                      <a
                        href={item.rss_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                        title="Read original source"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {/* Headline Title */}
                  <h3 className="text-sm font-medium text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2 mb-2.5">
                    {item.title}
                  </h3>

                  {/* LLM Chain-of-Thought Reasoning Box */}
                  {item.reasoning && (
                    <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/15 flex items-start gap-2.5">
                      <Sparkles size={13} className="text-amber-400 mt-0.5 shrink-0" />
                      <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        <span className="font-semibold text-amber-400/90 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                          LLM Rationale:
                        </span>
                        {item.reasoning}
                      </div>
                    </div>
                  )}

                  {/* Micro metrics bar */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>Bullish: <strong className="text-emerald-400">{(item.long_s * 100).toFixed(0)}%</strong></span>
                      <span>Bearish: <strong className="text-rose-400">{(item.short_s * 100).toFixed(0)}%</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Relevance: <strong>{((item.relevance || 0.8) * 100).toFixed(0)}%</strong></span>
                      <span>Confidence: <strong>{((item.confidence || 0.8) * 100).toFixed(0)}%</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TopStoriesWidget);
