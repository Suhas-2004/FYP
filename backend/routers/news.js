const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'news_sentiment.json');

// Helper to safely load data
let cachedData = null;
let lastMtime = null;

function loadNewsData() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return null;
    }
    const stats = fs.statSync(DATA_PATH);
    if (!cachedData || lastMtime !== stats.mtimeMs) {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      cachedData = JSON.parse(raw);
      lastMtime = stats.mtimeMs;
    }
    return cachedData;
  } catch (err) {
    console.error('Error loading news sentiment data:', err.message);
    return null;
  }
}

// 1. Overview & Market Sentiment
router.get('/overview', (req, res) => {
  const data = loadNewsData();
  if (!data) {
    return res.status(500).json({ detail: 'News sentiment dataset not available' });
  }

  // Generate lightweight tickers summary
  const tickersSummary = Object.keys(data.tickers).map(ticker => {
    const t = data.tickers[ticker];
    return {
      ticker: t.ticker,
      company: t.company,
      total_articles: t.total_articles,
      sentiment_score: t.sentiment_score,
      sentiment_label: t.sentiment_label,
      avg_confidence: t.avg_confidence,
      avg_relevance: t.avg_relevance
    };
  });

  res.json({
    meta: data.meta,
    market_summary: data.market_summary,
    tickers: tickersSummary
  });
});

// 2. List all available tickers
router.get('/tickers', (req, res) => {
  const data = loadNewsData();
  if (!data) {
    return res.status(500).json({ detail: 'News sentiment dataset not available' });
  }

  const list = Object.keys(data.tickers).map(ticker => ({
    ticker,
    company: data.tickers[ticker].company,
    articles: data.tickers[ticker].total_articles,
    sentiment_label: data.tickers[ticker].sentiment_label,
    sentiment_score: data.tickers[ticker].sentiment_score
  }));

  res.json(list);
});

// 3. Top Headlines across all tickers
router.get('/top-headlines', (req, res) => {
  const data = loadNewsData();
  if (!data) {
    return res.status(500).json({ detail: 'News sentiment dataset not available' });
  }

  let headlines = data.top_headlines || [];
  const { ticker, sentiment, limit } = req.query;

  if (ticker) {
    const tUpper = ticker.toUpperCase();
    headlines = headlines.filter(h => h.ticker.toUpperCase() === tUpper);
  }

  if (sentiment) {
    const sLower = sentiment.toLowerCase();
    headlines = headlines.filter(h => h.sentiment_label.toLowerCase() === sLower);
  }

  const maxLimit = limit ? parseInt(limit, 10) : 25;
  res.json(headlines.slice(0, maxLimit));
});

// 4. Detailed sentiment profile for a specific ticker
router.get('/sentiment/:ticker', (req, res) => {
  const data = loadNewsData();
  if (!data) {
    return res.status(500).json({ detail: 'News sentiment dataset not available' });
  }

  const ticker = req.params.ticker.toUpperCase();
  const tickerData = data.tickers[ticker];

  if (!tickerData) {
    return res.status(404).json({
      detail: `Ticker '${ticker}' not found in news dataset. Available tickers: ${data.meta.tickers_list.join(', ')}`
    });
  }

  res.json(tickerData);
});

module.exports = router;
