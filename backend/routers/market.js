const express = require('express');
const { predictionEngine } = require('../services/predictionEngine');

const router = express.Router();

router.get('/tickers', (req, res) => {
  try {
    const tickers = predictionEngine.getAvailableTickers();
    res.json(tickers);
  } catch (err) {
    res.status(500).json({ detail: `Error fetching tickers: ${err.message}` });
  }
});

router.get('/prediction/:ticker', (req, res) => {
  const { ticker } = req.params;
  const timeframe = req.query.timeframe || '1D';

  try {
    const data = predictionEngine.getStockAnalysis(ticker, timeframe);
    res.json(data);
  } catch (err) {
    res.status(500).json({ detail: `Prediction engine error: ${err.message}` });
  }
});

router.get('/stream/:ticker', (req, res) => {
  const { ticker } = req.params;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  try {
    const analysis = predictionEngine.getStockAnalysis(ticker, '1M');
    if (!analysis || !analysis.chart_data || analysis.chart_data.length === 0) {
      res.write('event: error\ndata: {"message": "No data found"}\n\n');
      return res.end();
    }

    let latestCandle = { ...analysis.chart_data[analysis.chart_data.length - 1] };
    
    // Initial real fetch
    const fetchRealData = async () => {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m`);
        if (response.ok) {
          const json = await response.json();
          const meta = json.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice) {
            latestCandle.close = meta.regularMarketPrice;
            if (meta.regularMarketVolume) latestCandle.volume = meta.regularMarketVolume;
            if (latestCandle.close > latestCandle.high) latestCandle.high = latestCandle.close;
            if (latestCandle.close < latestCandle.low) latestCandle.low = latestCandle.close;
          }
        }
      } catch (err) {
        console.error('Error fetching live real data:', err.message);
      }
      res.write(`data: ${JSON.stringify(latestCandle)}\n\n`);
    };

    fetchRealData();
    // Poll every 5 seconds to avoid IP ban from Yahoo while still providing near real-time updates
    const intervalId = setInterval(fetchRealData, 5000);

    req.on('close', () => {
      clearInterval(intervalId);
    });
  } catch (err) {
    res.write(`event: error\ndata: {"message": "${err.message}"}\n\n`);
    res.end();
  }
});

module.exports = router;
