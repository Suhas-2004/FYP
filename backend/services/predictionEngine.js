const fs = require('fs');
const path = require('path');

const STOCKS_DATA_PATH = path.join(__dirname, '..', 'data', 'stocks_data.json');

// Fallback static profiles for tickers not in the JSON file
const FALLBACK_PROFILES = {
  SQ: { name: 'Block, Inc.', current_price: 64.80, base_volatility: 0.032, trend_bias: 0.002,
    four_hour: { signal: 'Likely Rise', confidence: 74.2, direction: 'UP', target_price: 67.20, risk: 'Moderate', catalyst: 'Strong Cash App active user monetization.' },
    daily:     { signal: 'Likely Rise', confidence: 69.0, direction: 'UP', target_price: 70.50, risk: 'Moderate', catalyst: 'Operating leverage recovery.' }
  }
};

// Mulberry32 deterministic pseudo-random generator (kept for fallback use)
function createSeededRandom(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Derive a simple trend signal from real data
function deriveSignal(ohlcv) {
  if (!ohlcv || ohlcv.length < 20) return null;
  const recent = ohlcv.slice(-20);
  const latest = recent[recent.length - 1];
  const oldest = recent[0];
  const trend = (latest.close - oldest.close) / oldest.close;
  const rsi = latest.rsi_14 || 50;
  const aboveEma = latest.close > (latest.ema_50 || latest.close);

  let signal, direction, confidence;

  if (rsi > 65 || trend > 0.03) {
    signal = 'Likely Rise';
    direction = 'UP';
    confidence = Math.min(85, 60 + rsi * 0.3);
  } else if (rsi < 35 || trend < -0.03) {
    signal = 'Likely Decline';
    direction = 'DOWN';
    confidence = Math.min(82, 60 + (100 - rsi) * 0.3);
  } else {
    signal = 'Neutral Consolidation';
    direction = 'NEUTRAL';
    confidence = 55 + Math.abs(trend) * 100;
  }

  const risk = rsi > 70 ? 'High' : rsi < 30 ? 'High' : aboveEma ? 'Low' : 'Moderate';
  const targetPrice = direction === 'UP'
    ? Math.round(latest.close * 1.04 * 100) / 100
    : direction === 'DOWN'
      ? Math.round(latest.close * 0.96 * 100) / 100
      : Math.round(latest.close * 100) / 100;

  return {
    signal,
    confidence: Math.round(confidence * 10) / 10,
    direction,
    target_price: targetPrice,
    risk,
    catalyst: aboveEma
      ? `Price trading above EMA-50 (${latest.ema_50}). RSI at ${rsi} with ${direction === 'UP' ? 'bullish' : 'neutral'} momentum.`
      : `Price trading below EMA-50 (${latest.ema_50}). RSI at ${rsi} indicating ${rsi < 35 ? 'oversold conditions' : 'consolidation'}.`
  };
}

class StockPredictionEngine {
  constructor() {
    this._cache = null;
    this._cacheTime = 0;
  }

  // Load real data from stocks_data.json (cached for 5 minutes)
  _loadStocksData() {
    const now = Date.now();
    if (this._cache && (now - this._cacheTime) < 5 * 60 * 1000) {
      return this._cache;
    }
    try {
      if (fs.existsSync(STOCKS_DATA_PATH)) {
        const raw = fs.readFileSync(STOCKS_DATA_PATH, 'utf-8');
        this._cache = JSON.parse(raw);
        this._cacheTime = now;
        return this._cache;
      }
    } catch (err) {
      console.error('Failed to load stocks_data.json:', err.message);
    }
    return null;
  }

  getAvailableTickers() {
    const data = this._loadStocksData();
    if (data) {
      return Object.entries(data).map(([ticker, d]) => ({
        ticker,
        name: d.info?.name || ticker,
        price: d.current_price
      }));
    }
    // Fallback
    return Object.entries(FALLBACK_PROFILES).map(([ticker, d]) => ({
      ticker, name: d.name, price: d.current_price
    }));
  }

  getStockAnalysis(ticker, timeframe = '1D') {
    const sym = (ticker || 'AAPL').toUpperCase();
    const data = this._loadStocksData();
    const stockEntry = data?.[sym];

    // --- REAL DATA PATH ---
    if (stockEntry && stockEntry.ohlcv && stockEntry.ohlcv.length > 0) {
      const ohlcv = stockEntry.ohlcv;
      const latest = ohlcv[ohlcv.length - 1];
      const prev   = ohlcv[ohlcv.length - 2] || latest;

      const dayChange = Math.round((latest.close - prev.close) * 100) / 100;
      const dayChangePct = Math.round(((latest.close - prev.close) / prev.close) * 10000) / 100;

      const signal4h  = deriveSignal(ohlcv.slice(-10));
      const signalDay = deriveSignal(ohlcv.slice(-20));

      // Build chart_data from last 35 real OHLCV days
      const chartSlice = ohlcv.slice(-35);
      const chartData = chartSlice.map((row, i) => ({
        index: i + 1,
        date: row.date || `D-${35 - i}`,
        open: row.open, high: row.high, low: row.low, close: row.close,
        volume: row.volume,
        sma20: row.sma_20,
        ema50: row.ema_50,
        rsi: row.rsi_14,
        macd: row.macd,
        macd_signal: row.macd_signal,
        upper_band: row.bollinger_upper,
        lower_band: row.bollinger_lower
      }));

      return {
        ticker: sym,
        company_name: stockEntry.info?.name || sym,
        current_price: latest.close,
        day_change: dayChange,
        day_change_percent: dayChangePct,
        data_source: 'real', // flag so frontend can indicate live data
        collected_at: stockEntry.collected_at,
        technical_indicators: {
          rsi: latest.rsi_14,
          sma20: latest.sma_20,
          ema50: latest.ema_50,
          macd: latest.macd,
          macd_signal: latest.macd_signal,
          volatility_score: `${Math.round(((latest.high - latest.low) / latest.close) * 1000) / 10}%`
        },
        four_hour_prediction: signal4h,
        daily_prediction: signalDay,
        chart_data: chartData,
        disclaimer: 'Market analysis derived from real historical OHLCV data collected via Yahoo Finance. Technical signals are statistical estimates and do not constitute financial advice.'
      };
    }

    // --- FALLBACK PATH (static profiles or generated) ---
    console.warn(`[PredictionEngine] No real data for ${sym}, using fallback.`);
    const profile = FALLBACK_PROFILES[sym] || {
      name: sym, current_price: 100, base_volatility: 0.02, trend_bias: 0.001,
      four_hour: { signal: 'Neutral Consolidation', confidence: 55, direction: 'NEUTRAL', target_price: 100, risk: 'Low', catalyst: 'Insufficient data for signal generation.' },
      daily:     { signal: 'Neutral Consolidation', confidence: 55, direction: 'NEUTRAL', target_price: 100, risk: 'Low', catalyst: 'Insufficient data for signal generation.' }
    };

    const basePrice = profile.current_price;
    const seed = sym.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + 42;
    const rng  = createSeededRandom(seed);
    const numPoints = 35;
    const dataPoints = [];
    let price = basePrice * 0.88;
    const closes = [];

    for (let i = 0; i < numPoints; i++) {
      const randVal = rng();
      const drift = profile.trend_bias + (randVal - 0.48) * profile.base_volatility;
      const openP  = price;
      const closeP = Math.round(openP * (1 + drift) * 100) / 100;
      const highP  = Math.round(Math.max(openP, closeP) * (1 + rng() * 0.012) * 100) / 100;
      const lowP   = Math.round(Math.min(openP, closeP) * (1 - rng() * 0.012) * 100) / 100;
      const volume = Math.floor((15000000 + rng() * 30000000) * (1 + Math.abs(drift) * 10));

      closes.push(closeP);
      price = closeP;

      const slice20 = closes.slice(Math.max(0, closes.length - 20));
      const sma20   = Math.round((slice20.reduce((a, b) => a + b, 0) / slice20.length) * 100) / 100;
      const prevEma = closes.length < 5 ? sma20 : closes[closes.length - 5];
      const ema50   = Math.round((closeP * 0.15 + prevEma * 0.85) * 100) / 100;

      let rsi = 52.0;
      if (closes.length > 5) {
        const gains = [], losses = [];
        for (let k = 1; k < closes.length; k++) {
          const diff = closes[k] - closes[k-1];
          if (diff >= 0) gains.push(diff); else losses.push(-diff);
        }
        const ag = gains.slice(-5).reduce((a, b) => a + b, 0) / 5 || 0.001;
        const al = Math.max(0.001, losses.slice(-5).reduce((a, b) => a + b, 0) / 5);
        rsi = Math.round((100 - 100 / (1 + ag / al)) * 10) / 10;
      }

      const macd = Math.round((closeP - ema50) * 100) / 100;
      dataPoints.push({
        index: i + 1, date: `D-${numPoints - i}`,
        open: openP, high: highP, low: lowP, close: closeP, volume,
        sma20, ema50, rsi, macd, macd_signal: Math.round(macd * 0.82 * 100) / 100,
        upper_band: Math.round((sma20 + profile.base_volatility * sma20 * 2) * 100) / 100,
        lower_band: Math.round((sma20 - profile.base_volatility * sma20 * 2) * 100) / 100
      });
    }

    const latest = dataPoints[dataPoints.length - 1];
    const prev2  = dataPoints[dataPoints.length - 2];
    return {
      ticker: sym, company_name: profile.name,
      current_price: latest.close,
      day_change: Math.round((latest.close - prev2.close) * 100) / 100,
      day_change_percent: Math.round(((latest.close - prev2.close) / prev2.close) * 10000) / 100,
      data_source: 'simulated',
      technical_indicators: {
        rsi: latest.rsi, sma20: latest.sma20, ema50: latest.ema50,
        macd: latest.macd, macd_signal: latest.macd_signal,
        volatility_score: `${Math.round(profile.base_volatility * 1000) / 10}%`
      },
      four_hour_prediction: profile.four_hour,
      daily_prediction: profile.daily,
      chart_data: dataPoints,
      disclaimer: 'Market predictions are generated via algorithmic statistical modeling. These signals are probabilistic estimates and do not constitute financial advice.'
    };
  }
}

const predictionEngine = new StockPredictionEngine();
module.exports = { predictionEngine, StockPredictionEngine };
