const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'companies_data.json');

function loadCompanies() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (err) {
    console.error('Error reading companies data:', err);
    return [];
  }
}

router.get('/', (req, res) => {
  const sector = req.query.sector || 'All';
  let companies = loadCompanies();

  if (sector && sector !== 'All') {
    companies = companies.filter(
      c => (c.sector || '').toLowerCase() === sector.toLowerCase()
    );
  }

  // Return summarized company cards
  const summaries = companies.map(c => {
    const crisis = c.crisis_info || {};
    const financials = c.six_year_financials || [{}];
    const latestFin = financials[financials.length - 1] || {};
    const moves = c.six_year_downfalls_and_pumps || [];
    const downfalls = moves.filter(m => m.type === 'Downfall');
    const pumps = moves.filter(m => m.type === 'Pump' || m.type === 'Rebound');

    return {
      id: c.id,
      name: c.name,
      ticker: c.ticker,
      sector: c.sector,
      logo_color: c.logo_color,
      logo_url: c.logo_url,
      market_cap: c.market_cap,
      founded_year: c.founded_year,
      founder: c.leadership?.founder,
      current_ceo: c.leadership?.current_ceo,
      executive_analysis_paragraph: c.executive_analysis_paragraph,
      downfalls_count: downfalls.length,
      pumps_count: pumps.length,
      primary_downfall: downfalls[0]?.title || null,
      primary_pump: pumps[0]?.title || null,
      six_year_downfalls_and_pumps: moves,
      crisis_title: crisis.crisis_title,
      strategy_used: crisis.strategy_used,
      recovery_status: crisis.recovery_status,
      financial_summary: {
        latest_revenue_growth: latestFin.revenue_growth ?? 0,
        latest_roe: latestFin.roe ?? 0,
        latest_cash_flow: latestFin.cash_flow ?? 0,
        start_year: financials[0]?.year || '2019',
        end_year: latestFin.year || '2024'
      }
    };
  });

  res.json({
    sector_filter: sector,
    total_companies: summaries.length,
    companies: summaries
  });
});

router.get('/sectors', (req, res) => {
  res.json([
    'All',
    'Technology',
    'Retail',
    'FinTech',
    'Real Estate',
    'Automobile',
    'Healthcare',
    'Media'
  ]);
});

router.get('/:companyId', (req, res) => {
  const { companyId } = req.params;
  const companies = loadCompanies();
  const company = companies.find(c => c.id === companyId);

  if (!company) {
    return res.status(404).json({ detail: `Company '${companyId}' not found` });
  }

  res.json(company);
});

module.exports = router;
