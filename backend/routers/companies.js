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
      },
      stock_price: c.stock_price || 120.0,
      stock_price_date: c.stock_price_date || "Oct 24, 2026",
      one_year_change: c.one_year_change || c.price_change || "+12.4%",
      price_change: c.price_change || c.one_year_change || "+12.4%",
      price_positive: c.price_positive !== undefined ? c.price_positive : true,
      risk_level: c.risk_level || "Medium Risk",
      revenue_ttm: c.revenue_ttm || c.market_cap || "$10B",
      net_income_ttm: c.net_income_ttm || "$1.5B",
      employees: c.employees || "120,000",
      country: c.country || "USA",
      subtitle: c.subtitle || `${c.name} ${c.ticker}`,
      headquarters: c.headquarters || "United States",
      website: c.website || "https://apple.com",
      gross_margin: c.gross_margin || "48.2%",
      operating_margin: c.operating_margin || "31.6%",
      net_margin: c.net_margin || "25.3%",
      eps: c.eps || 6.12,
      pe_ratio: c.pe_ratio || 28.4,
      wikipedia_summary: c.wikipedia_summary || c.executive_analysis_paragraph,
      tradingview_symbol: c.tradingview_symbol || `NASDAQ:${c.ticker || 'AAPL'}`,
      exchange: c.exchange || 'NASDAQ',
      wikipedia_url: c.wikipedia_url || `https://en.wikipedia.org/wiki/${encodeURIComponent(c.name)}`,
      ir_url: c.ir_url,
      sec_edgar_url: c.sec_edgar_url,
      yahoo_finance_url: c.yahoo_finance_url,
      google_finance_url: c.google_finance_url,
      tradingview_url: c.tradingview_url,
      headquarters_address: c.headquarters_address,
      financial_statements: c.financial_statements,
      market_data: c.market_data,
      failures_timeline: c.failures_timeline,
      impact_analysis: c.impact_analysis,
      major_successes: c.major_successes,
      past_solutions: c.past_solutions,
      revenue_breakdown: c.revenue_breakdown,
      is_startup_pitch: !!c.is_startup_pitch,
      pre_money_valuation: c.pre_money_valuation,
      post_money_valuation: c.post_money_valuation,
      target_raise: c.target_raise,
      dilution_pct: c.dilution_pct,
      valuation_multiple: c.valuation_multiple,
      shares_outstanding: c.shares_outstanding,
      turnaround_verdict: c.turnaround_verdict,
      tags: c.tags || [c.sector || "Enterprise", "Growth"],
      sparkline: c.sparkline || [100, 105, 110, 108, 115, 118, 120]
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
