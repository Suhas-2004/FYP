const express = require('express');
const { similarityEngine } = require('../services/similarityEngine');

const router = express.Router();

router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sector = req.query.sector || 'All';
  const threshold = parseFloat(req.query.threshold) || 40.0;

  if (!q || !q.trim()) {
    return res.status(400).json({ detail: 'Search query cannot be empty' });
  }

  const results = similarityEngine.searchSimilarCases(q, sector, threshold / 100.0);
  const filtered = results.filter(r => r.similarity_score >= threshold);

  res.json({
    query: q,
    sector_filter: sector,
    results_count: filtered.length,
    matches: filtered
  });
});

router.post('/search', (req, res) => {
  const { query, sector = 'All', min_threshold = 40.0 } = req.body || {};

  if (!query || !query.trim()) {
    return res.status(400).json({ detail: 'Search query cannot be empty' });
  }

  const results = similarityEngine.searchSimilarCases(query, sector || 'All', min_threshold / 100.0);
  const filtered = results.filter(r => r.similarity_score >= min_threshold);

  res.json({
    query: query,
    sector_filter: sector,
    results_count: filtered.length,
    matches: filtered
  });
});

router.get('/strategy/:companyId', (req, res) => {
  const { companyId } = req.params;
  const strategyData = similarityEngine.getStrategySteps(companyId);

  if (!strategyData) {
    return res.status(404).json({ detail: `No strategy steps found for company ${companyId}` });
  }

  res.json(strategyData);
});

router.get('/sample-queries', (req, res) => {
  res.json([
    {
      category: 'Cash & Debt Distress',
      query: 'High debt, declining cash flow, and 90 days runway remaining',
      matched_intent: 'Liquidity crisis / Debt restructuring'
    },
    {
      category: 'Customer Churn & Pricing',
      query: 'Pricing change backlash and severe customer churn',
      matched_intent: 'Value proposition pivot & retention moat'
    },
    {
      category: 'Retail & Showrooming',
      query: 'Online competitors undercutting prices and physical store losses',
      matched_intent: 'Omnichannel price matching & store monetization'
    },
    {
      category: 'Over-Diversification',
      query: 'Over-diversification into non-core products and massive annual losses',
      matched_intent: 'Asset divestment & modular standardization'
    },
    {
      category: 'Production & Scale Bottlenecks',
      query: 'Manufacturing bottlenecks, extreme capital burn, and delayed deliveries',
      matched_intent: 'De-automation & agile execution'
    },
    {
      category: 'Macro & Interest Rate Shocks',
      query: 'Interest rate spike causing inventory write-downs and balance sheet illiquidity',
      matched_intent: 'Asset liquidation & partner distribution'
    }
  ]);
});

module.exports = router;
