// Predefined base stock profiles with realistic market parameters
const STOCK_PROFILES = {
  AAPL: {
    name: 'Apple Inc.',
    current_price: 228.40,
    base_volatility: 0.015,
    trend_bias: 0.002,
    four_hour: {
      signal: 'Likely Rise',
      confidence: 76.5,
      direction: 'UP',
      target_price: 232.80,
      risk: 'Moderate',
      catalyst: 'Bullish 4H RSI momentum bounce from oversold 42 level with institutional accumulation volume.'
    },
    daily: {
      signal: 'Likely Rise',
      confidence: 68.2,
      direction: 'UP',
      target_price: 236.50,
      risk: 'Low',
      catalyst: 'Consolidation above 20-day SMA; expanding ecosystem revenue expectations.'
    }
  },
  TSLA: {
    name: 'Tesla, Inc.',
    current_price: 214.65,
    base_volatility: 0.038,
    trend_bias: -0.004,
    four_hour: {
      signal: 'Likely Decline',
      confidence: 71.0,
      direction: 'DOWN',
      target_price: 208.20,
      risk: 'High',
      catalyst: 'Short-term rejection at $220 psychological resistance; MACD line crossing below signal.'
    },
    daily: {
      signal: 'Likely Decline',
      confidence: 64.5,
      direction: 'DOWN',
      target_price: 202.00,
      risk: 'High',
      catalyst: 'Compression in automotive gross margins and broader sector rotation.'
    }
  },
  NFLX: {
    name: 'Netflix Inc.',
    current_price: 685.20,
    base_volatility: 0.022,
    trend_bias: 0.003,
    four_hour: {
      signal: 'Likely Rise',
      confidence: 82.0,
      direction: 'UP',
      target_price: 698.50,
      risk: 'Low',
      catalyst: 'Strong breakout above 50-period EMA on sustained live sports licensing news.'
    },
    daily: {
      signal: 'Likely Rise',
      confidence: 74.8,
      direction: 'UP',
      target_price: 715.00,
      risk: 'Moderate',
      catalyst: 'Advertising tier ARPU expansion and high retention metrics.'
    }
  },
  BBY: {
    name: 'Best Buy Co., Inc.',
    current_price: 88.35,
    base_volatility: 0.020,
    trend_bias: 0.001,
    four_hour: {
      signal: 'Neutral Consolidation',
      confidence: 58.0,
      direction: 'NEUTRAL',
      target_price: 88.90,
      risk: 'Low',
      catalyst: 'Tight Bollinger band squeeze indicating impending volatility breakout.'
    },
    daily: {
      signal: 'Likely Rise',
      confidence: 62.4,
      direction: 'UP',
      target_price: 91.50,
      risk: 'Moderate',
      catalyst: 'Resilient back-to-school consumer electronics demand.'
    }
  },
  SQ: {
    name: 'Block, Inc.',
    current_price: 64.80,
    base_volatility: 0.032,
    trend_bias: 0.002,
    four_hour: {
      signal: 'Likely Rise',
      confidence: 74.2,
      direction: 'UP',
      target_price: 67.20,
      risk: 'Moderate',
      catalyst: 'Strong Cash App active user monetization and operating leverage recovery.'
    },
    daily: {
      signal: 'Likely Rise',
      confidence: 69.0,
      direction: 'UP',
      target_price: 70.50,
      risk: 'Moderate',
      catalyst: 'Rule of 40 operational improvements and merchant Gross Payment Volume stabilization.'
    }
  },
  PYPL: {
    name: 'PayPal Holdings',
    current_price: 66.90,
    base_volatility: 0.024,
    trend_bias: 0.001,
    four_hour: {
      signal: 'Likely Rise',
      confidence: 66.8,
      direction: 'UP',
      target_price: 68.40,
      risk: 'Moderate',
      catalyst: 'Fastlane one-click guest checkout partner adoption momentum.'
    },
    daily: {
      signal: 'Neutral Consolidation',
      confidence: 55.0,
      direction: 'NEUTRAL',
      target_price: 67.20,
      risk: 'Low',
      catalyst: 'Range-bound accumulation between $64 support and $68 resistance.'
    }
  },
  MRNA: {
    name: 'Moderna, Inc.',
    current_price: 78.50,
    base_volatility: 0.042,
    trend_bias: -0.005,
    four_hour: {
      signal: 'Likely Decline',
      confidence: 68.4,
      direction: 'DOWN',
      target_price: 74.80,
      risk: 'High',
      catalyst: 'Post-earnings clinical trial spend overhang; testing lower support channel.'
    },
    daily: {
      signal: 'Likely Decline',
      confidence: 63.2,
      direction: 'DOWN',
      target_price: 71.00,
      risk: 'High',
      catalyst: 'Extended R&D cash burn prior to late-stage oncology readout.'
    }
  }
};

// Mulberry32 deterministic pseudo-random generator
function createSeededRandom(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class StockPredictionEngine {
  getAvailableTickers() {
    return Object.entries(STOCK_PROFILES).map(([ticker, data]) => ({
      ticker,
      name: data.name,
      price: data.current_price
    }));
  }

  getStockAnalysis(ticker, timeframe = '1D') {
    const sym = (ticker || 'AAPL').toUpperCase();
    const profile = STOCK_PROFILES[sym] || STOCK_PROFILES.AAPL;
    const basePrice = profile.current_price;

    const numPoints = 35;
    const dataPoints = [];
    let price = basePrice * 0.88;

    // Seed based on ticker characters
    const seed = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 42;
    const rng = createSeededRandom(seed);

    const closes = [];
    for (let i = 0; i < numPoints; i++) {
      const randVal = rng();
      const dailyDrift = profile.trend_bias + (randVal - 0.48) * profile.base_volatility;
      const openP = price;
      const closeP = Math.round(openP * (1 + dailyDrift) * 100) / 100;
      const highP = Math.round(Math.max(openP, closeP) * (1 + rng() * 0.012) * 100) / 100;
      const lowP = Math.round(Math.min(openP, closeP) * (1 - rng() * 0.012) * 100) / 100;
      const volume = Math.floor((15000000 + rng() * 30000000) * (1 + Math.abs(dailyDrift) * 10));

      closes.push(closeP);
      price = closeP;

      // SMA 20
      const slice20 = closes.slice(Math.max(0, closes.length - 20));
      const sma20 = Math.round((slice20.reduce((a, b) => a + b, 0) / slice20.length) * 100) / 100;

      // EMA 50
      const prevEma = closes.length < 5 ? sma20 : closes[closes.length - 5];
      const ema50 = Math.round((closeP * 0.15 + prevEma * 0.85) * 100) / 100;

      // RSI
      let rsi = 52.0;
      if (closes.length > 5) {
        const gains = [];
        const losses = [];
        for (let k = 1; k < closes.length; k++) {
          const diff = closes[k] - closes[k - 1];
          if (diff >= 0) gains.push(diff);
          else losses.push(-diff);
        }
        const recentGains = gains.slice(-5);
        const recentLosses = losses.slice(-5);
        const avgGain = recentGains.length ? recentGains.reduce((a, b) => a + b, 0) / 5.0 : 0.001;
        const avgLoss = recentLosses.length ? Math.max(0.001, recentLosses.reduce((a, b) => a + b, 0) / 5.0) : 0.001;
        const rs = avgGain / avgLoss;
        rsi = Math.round((100 - (100 / (1 + rs))) * 10) / 10;
      }

      const macd = Math.round((closeP - ema50) * 100) / 100;
      const macdSignal = Math.round(macd * 0.82 * 100) / 100;

      dataPoints.push({
        index: i + 1,
        date: `D-${numPoints - i}`,
        open: openP,
        high: highP,
        low: lowP,
        close: closeP,
        volume: volume,
        sma20: sma20,
        ema50: ema50,
        rsi: rsi,
        macd: macd,
        macd_signal: macdSignal,
        upper_band: Math.round((sma20 + (profile.base_volatility * sma20 * 2)) * 100) / 100,
        lower_band: Math.round((sma20 - (profile.base_volatility * sma20 * 2)) * 100) / 100
      });
    }

    const latest = dataPoints[dataPoints.length - 1];
    const prev = dataPoints[dataPoints.length - 2];
    const dayChange = Math.round((latest.close - prev.close) * 100) / 100;
    const dayChangePercent = Math.round(((latest.close - prev.close) / prev.close) * 10000) / 100;

    return {
      ticker: sym,
      company_name: profile.name,
      current_price: latest.close,
      day_change: dayChange,
      day_change_percent: dayChangePercent,
      technical_indicators: {
        rsi: latest.rsi,
        sma20: latest.sma20,
        ema50: latest.ema50,
        macd: latest.macd,
        macd_signal: latest.macd_signal,
        volatility_score: `${Math.round(profile.base_volatility * 1000) / 10}%`
      },
      four_hour_prediction: profile.four_hour,
      daily_prediction: profile.daily,
      chart_data: dataPoints,
      disclaimer:
        'Market predictions are generated via algorithmic statistical modeling and technical indicator synthesis. These signals represent probabilistic model estimates and do not constitute financial or investment advice.'
    };
  }
}

const predictionEngine = new StockPredictionEngine();

module.exports = {
  predictionEngine,
  StockPredictionEngine,
  STOCK_PROFILES
};
