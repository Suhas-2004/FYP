const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'startups_data.json');
const INQUIRIES_PATH = path.join(__dirname, '..', 'data', 'investor_inquiries.json');

function loadStartups() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (err) {
    console.error('Error reading startups data:', err);
    return [];
  }
}

function saveStartups(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving startups data:', err);
  }
}

router.get('/', (req, res) => {
  const industry = req.query.industry || 'All';
  const potential = req.query.potential || 'All';

  let startups = loadStartups();

  if (industry && industry !== 'All') {
    startups = startups.filter(
      s => (s.industry || '').toLowerCase() === industry.toLowerCase()
    );
  }

  if (potential && potential !== 'All') {
    startups = startups.filter(
      s => (s.potential_rating || '').toLowerCase() === potential.toLowerCase()
    );
  }

  res.json({
    count: startups.length,
    startups: startups
  });
});

router.get('/:startupId', (req, res) => {
  const { startupId } = req.params;
  const startups = loadStartups();
  const startup = startups.find(s => s.id === startupId);

  if (!startup) {
    return res.status(404).json({ detail: 'Startup not found' });
  }

  res.json(startup);
});

router.post('/submit', (req, res) => {
  const body = req.body || {};
  const startups = loadStartups();
  const hex = crypto.randomBytes(2).toString('hex');
  const newId = `startup-${startups.length + 1}-${hex}`;

  const rating =
    (body.problem_solved || '').length > 40 && (body.proposed_solution || '').length > 40
      ? 'High'
      : 'Medium';

  const newStartup = {
    id: newId,
    name: body.name || '',
    industry: body.industry || '',
    founder_name: body.founder_name || '',
    founder_title: body.founder_title || '',
    founder_email: body.founder_email || '',
    tagline: body.tagline || '',
    idea: body.idea || '',
    problem_solved: body.problem_solved || '',
    proposed_solution: body.proposed_solution || '',
    target_market: body.target_market || '',
    expected_usability: body.expected_usability || '',
    future_potential: body.future_potential || '',
    potential_rating: rating,
    business_model: body.business_model || '',
    funding_requirement: body.funding_requirement || '',
    expected_returns: body.expected_returns || '',
    supporting_info: body.supporting_info || '',
    submitted_at: new Date().toISOString().split('T')[0]
  };

  startups.unshift(newStartup);
  saveStartups(startups);

  res.json({
    status: 'success',
    message: 'Startup pitch registered successfully in ICLAS dealflow repository.',
    startup_id: newId,
    startup: newStartup
  });
});

router.post('/contact', (req, res) => {
  const body = req.body || {};
  const startups = loadStartups();
  const targetStartup = startups.find(s => s.id === body.startup_id);

  if (!targetStartup) {
    return res.status(404).json({ detail: 'Startup not found' });
  }

  let inquiries = [];
  if (fs.existsSync(INQUIRIES_PATH)) {
    try {
      inquiries = JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf-8'));
    } catch (err) {
      inquiries = [];
    }
  }

  const hex = crypto.randomBytes(4).toString('hex');
  const inquiryRecord = {
    inquiry_id: `inq-${hex}`,
    startup_id: body.startup_id,
    startup_name: targetStartup.name,
    startup_founder_email: targetStartup.founder_email,
    investor_name: body.investor_name || '',
    investor_org: body.investor_organization || '',
    investor_email: body.investor_email || '',
    proposed_ticket_size: body.proposed_ticket_size || '$250,000 - $500,000',
    message: body.message || '',
    timestamp: new Date().toISOString(),
    status: 'Dispatched to Startup Official Email'
  };

  inquiries.unshift(inquiryRecord);
  try {
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving inquiries:', err);
  }

  res.json({
    status: 'dispatched',
    message: `Official investor inquiry successfully dispatched to ${targetStartup.founder_email}.`,
    inquiry_details: inquiryRecord
  });
});

router.get('/intel/evidence-matrix', (req, res) => {
  res.json([
    {
      id: 'matrix-1',
      startup_condition: 'High Debt & Liquidity Runway Depletion (<90 Days)',
      severity: 'Critical',
      historical_company: 'Apple Inc. (1997)',
      sector: 'Technology',
      turnaround_strategy: 'Portfolio Consolidation & Microsoft $150M Bridge',
      strategy_type: 'Business Restructuring',
      outcome: 'Turned cash flow positive within 12 months; $3.4T market cap today.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-2',
      startup_condition: 'Sudden Customer Churn & Pricing Backlash',
      severity: 'High',
      historical_company: 'Netflix Inc. (2011)',
      sector: 'Media',
      turnaround_strategy: 'Re-Unified Pricing & Original Content Moat',
      strategy_type: 'Market Pivot',
      outcome: 'Subscribers surged from 23M to 280M+; dominant global streaming moat.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-3',
      startup_condition: 'E-Commerce Competitor Price Undercutting & Margin Squeeze',
      severity: 'High',
      historical_company: 'Best Buy (2012)',
      sector: 'Retail',
      turnaround_strategy: 'Store-Within-A-Store Monetization & Algorithmic Price Match',
      strategy_type: 'Cost Optimization',
      outcome: 'Cut $1B in structural costs; stabilized 20%+ ROE and omnichannel dominance.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-4',
      startup_condition: 'Over-Diversification & Exploding CapEx Burn Rate',
      severity: 'Critical',
      historical_company: 'The LEGO Group (2004)',
      sector: 'Retail',
      turnaround_strategy: 'Divest Theme Parks & Slash SKU Variants by 50%',
      strategy_type: 'Business Restructuring',
      outcome: 'Reversed $300M loss in 1 year; highest profit margins in toy industry.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-5',
      startup_condition: 'Catastrophic Speculative Bubble Burst & Insolvency',
      severity: 'Critical',
      historical_company: 'Marvel Entertainment (1996)',
      sector: 'Media',
      turnaround_strategy: 'Toy Biz Merger, IP Collateral Loan & In-House Studio Pivot',
      strategy_type: 'Strategic Partnership',
      outcome: 'Generated $30B+ in box office; acquired by Disney for $4.24B.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-6',
      startup_condition: 'Hardware / Manufacturing Automation Bottleneck & Cash Drain',
      severity: 'High',
      historical_company: 'Tesla, Inc. (2018)',
      sector: 'Automobile',
      turnaround_strategy: 'De-Automation, Tent Assembly Line & Simplified BOM',
      strategy_type: 'Cost Optimization',
      outcome: "Scaled Model 3 to world's #1 best seller; $10B+ annual operating cash flow.",
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-7',
      startup_condition: 'Bloated Post-Scale Headcount & Post-Merger Margin Drag',
      severity: 'Moderate',
      historical_company: 'Block, Inc. (2023)',
      sector: 'FinTech',
      turnaround_strategy: 'Absolute 12,000 Headcount Cap & Rule of 40 Focus',
      strategy_type: 'Cost Optimization',
      outcome: 'Reached record quarterly gross profit of $2.25B with positive GAAP net income.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-8',
      startup_condition: 'Credit Market Freeze & Macroeconomic Liquidity Trap',
      severity: 'Critical',
      historical_company: 'Ford Motor Company (2008)',
      sector: 'Automobile',
      turnaround_strategy: "'The Way Forward' Preemptive $23.6B Asset Mortgage & One Ford",
      strategy_type: 'Business Restructuring',
      outcome: 'Surviving 2008 Great Financial Crisis without government bailout; gained massive market share.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-9',
      startup_condition: 'Vanity Metric Focus & High CAC Subsidies Attracting Zero LTV',
      severity: 'Moderate',
      historical_company: 'PayPal (2022)',
      sector: 'FinTech',
      turnaround_strategy: 'Kill Sign-Up Bounties & Focus on High-LTV Active Transactors',
      strategy_type: 'Market Pivot',
      outcome: 'Expanded transactions per active account by 14%; $5B+ free cash flow.',
      recovery_status: 'Fully Recovered'
    },
    {
      id: 'matrix-10',
      startup_condition: 'Rapid Interest Rate Shock & Illiquid Balance Sheet Inventory',
      severity: 'Critical',
      historical_company: 'Opendoor (2022)',
      sector: 'Real Estate',
      turnaround_strategy: 'Rapid Inventory Fire-Sale & Zillow Distribution Partnership',
      strategy_type: 'Business Restructuring',
      outcome: 'Reduced inventory debt by 70%; reached positive adjusted EBITDA.',
      recovery_status: 'Stabilized'
    }
  ]);
});

module.exports = router;
