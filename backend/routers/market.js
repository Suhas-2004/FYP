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

module.exports = router;
