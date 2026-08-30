import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { MotionSection, StaggerContainer, StaggerItem } from '../components/MotionReveal';
import CompanyLogo from '../components/CompanyLogo';

const TICKERS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'TSLA', name: 'Tesla, Inc.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'BBY', name: 'Best Buy Co.' },
  { ticker: 'SQ', name: 'Block, Inc.' },
  { ticker: 'PYPL', name: 'PayPal Holdings' },
  { ticker: 'MRNA', name: 'Moderna, Inc.' },
];

export default function GraphAnalysis({ theme }) {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('price-indicators');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalysis() {
      setLoading(true);
      try {
        const data = await api.getStockPrediction(selectedTicker);
        setChartData(data);
      } catch (err) {
        console.error('Failed to load stock prediction:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [selectedTicker]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <MotionSection direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dual-Horizon Market Trend Forecasting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              Graph Analysis & Stock AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Algorithmic technical indicator decomposition, momentum tracking, and dual-timeframe (**4-Hour** vs **Daily**) directional forecast modeling.
            </p>
          </div>

          {/* Live Ticker Switcher */}
          <div className="flex overflow-x-auto pb-1 space-x-2 scrollbar-none">
            {TICKERS.map((t) => {
              const isSelected = selectedTicker === t.ticker;
              return (
                <button
                  key={t.ticker}
                  onClick={() => setSelectedTicker(t.ticker)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan'
                      : 'bg-white/90 dark:bg-dark-900/90 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 shadow-sm'
                  }`}
                >
                  {t.ticker}
                </button>
              );
            })}
          </div>
        </div>
      </MotionSection>

      {loading || !chartData ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Running technical indicator models and momentum regressions...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Asset Bar */}
          <MotionSection direction="scale" duration={0.35}>
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <CompanyLogo 
                  companyId={chartData.ticker?.toLowerCase()} 
                  ticker={chartData.ticker} 
                  className="w-14 h-14 shadow-md"
                  size={52}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">{chartData.company_name}</h2>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-dark-950 text-slate-800 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700">
                      NASDAQ: {chartData.ticker}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>RSI (14): <strong className="text-brand-cyan">{chartData.technical_indicators?.rsi}</strong></span>
                    <span>•</span>
                    <span>SMA-20: ${chartData.technical_indicators?.sma20}</span>
                    <span>•</span>
                    <span>MACD: {chartData.technical_indicators?.macd}</span>
                  </div>
                </div>
              </div>

              {/* Current Price & Day Change */}
              <div className="text-right">
                <div className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white font-mono">
                  ${chartData.current_price?.toFixed(2)}
                </div>
                <div className={`text-xs font-bold font-mono flex items-center justify-end space-x-1 mt-0.5 ${
                  chartData.day_change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {chartData.day_change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{chartData.day_change >= 0 ? '+' : ''}{chartData.day_change} ({chartData.day_change_percent}%)</span>
                </div>
              </div>
            </div>
          </MotionSection>

          {/* DUAL PREDICTION CARDS: 4-HOUR vs DAILY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. 4-Hour Prediction Card */}
            <MotionSection direction="left" delay={0.1}>
              <div className={`glass-panel p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-md ${
                chartData.four_hour_prediction?.signal?.includes('Rise')
                  ? 'border-emerald-500/50 shadow-glow-emerald bg-emerald-50/50 dark:bg-emerald-950/10'
                  : 'border-rose-500/50 shadow-glow-rose bg-rose-50/50 dark:bg-rose-950/10'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-white/90 dark:bg-dark-950 text-brand-cyan border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">4-Hour Horizon Prediction</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Intraday technical momentum signal</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-black uppercase px-3 py-1 rounded-full border ${
                      chartData.four_hour_prediction?.signal?.includes('Rise')
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
                    }`}>
                      {chartData.four_hour_prediction?.signal}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Model Confidence:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                        {chartData.four_hour_prediction?.confidence}%
                      </span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${chartData.four_hour_prediction?.confidence}%` }}
                          transition={{ duration: 0.8 }}
                          className="bg-brand-cyan h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-slate-200/80 dark:border-slate-800/60">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Short-Term Target Estimate:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                      ${chartData.four_hour_prediction?.target_price?.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-sm">
                    <span className="text-brand-cyan font-bold block text-[10px] uppercase font-mono">
                      Technical Rationale & Catalyst:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                      {chartData.four_hour_prediction?.catalyst}
                    </p>
                  </div>
                </div>
              </div>
            </MotionSection>

            {/* 2. Daily Prediction Card */}
            <MotionSection direction="right" delay={0.1}>
              <div className={`glass-panel p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-md ${
                chartData.daily_prediction?.signal?.includes('Rise')
                  ? 'border-emerald-500/50 shadow-glow-emerald bg-emerald-50/50 dark:bg-emerald-950/10'
                  : chartData.daily_prediction?.signal?.includes('Decline')
                  ? 'border-rose-500/50 shadow-glow-rose bg-rose-50/50 dark:bg-rose-950/10'
                  : 'border-slate-300/80 dark:border-slate-700 bg-white dark:bg-dark-900/40'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-white/90 dark:bg-dark-950 text-brand-indigo border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <Activity className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">Daily Horizon Prediction</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">24-to-48 Hour structural trend</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-black uppercase px-3 py-1 rounded-full border ${
                      chartData.daily_prediction?.signal?.includes('Rise')
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                        : chartData.daily_prediction?.signal?.includes('Decline')
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}>
                      {chartData.daily_prediction?.signal}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Model Confidence:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                        {chartData.daily_prediction?.confidence}%
                      </span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${chartData.daily_prediction?.confidence}%` }}
                          transition={{ duration: 0.8 }}
                          className="bg-brand-indigo h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-slate-200/80 dark:border-slate-800/60">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Daily Target Estimate:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                      ${chartData.daily_prediction?.target_price?.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-dark-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-sm">
                    <span className="text-brand-indigo font-bold block text-[10px] uppercase font-mono">
                      Macro & Trend Rationale:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                      {chartData.daily_prediction?.catalyst}
                    </p>
                  </div>
                </div>
              </div>
            </MotionSection>

          </div>

          {/* Interactive Chart Workspace */}
          <MotionSection direction="up" delay={0.15}>
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">Historical Price & Technical Indicator Overlay</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Moving averages (SMA20, EMA50) and trading volume distribution</p>
                </div>

                <div className="flex bg-slate-100/90 dark:bg-dark-950/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  <button
                    onClick={() => setChartType('price-indicators')}
                    className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                      chartType === 'price-indicators' ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Price + SMA/EMA
                  </button>
                  <button
                    onClick={() => setChartType('rsi-macd')}
                    className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                      chartType === 'rsi-macd' ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    RSI & MACD Oscillators
                  </button>
                </div>
              </div>

              {/* Main Interactive Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'price-indicators' ? (
                    <ComposedChart data={chartData.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="price" domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} unit="$" />
                      <YAxis yAxisId="volume" orientation="right" domain={[0, 'auto']} stroke="#475569" fontSize={10} hide />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                      <Legend />
                      <Area yAxisId="price" type="monotone" dataKey="close" name="Close Price ($)" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth={3} />
                      <Line yAxisId="price" type="monotone" dataKey="sma20" name="SMA-20 ($)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line yAxisId="price" type="monotone" dataKey="ema50" name="EMA-50 ($)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      <Bar yAxisId="volume" dataKey="volume" name="Volume" fill="rgba(100, 116, 139, 0.25)" />
                    </ComposedChart>
                  ) : (
                    <ComposedChart data={chartData.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="rsi" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="macd" orientation="right" stroke="#6366f1" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }} />
                      <Legend />
                      <Line yAxisId="rsi" type="monotone" dataKey="rsi" name="RSI (14)" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                      <Bar yAxisId="macd" dataKey="macd" name="MACD Histogram" fill="#6366f1" />
                      <Line yAxisId="macd" type="monotone" dataKey="macd_signal" name="Signal Line" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </MotionSection>

          {/* Model Estimate Disclaimer Notice */}
          <MotionSection direction="up" delay={0.2}>
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-dark-900/90 border border-slate-200/80 dark:border-slate-800/80 flex items-start space-x-3 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Predictive Model Estimate Disclaimer:
                </span>
                <p className="leading-relaxed">{chartData.disclaimer}</p>
              </div>
            </div>
          </MotionSection>

        </div>
      )}
    </div>
  );
}
