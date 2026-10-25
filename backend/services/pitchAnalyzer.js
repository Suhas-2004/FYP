const crypto = require('crypto');

function slugify(text) {
  return (text || 'startup')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function generateTicker(name) {
  const clean = (name || 'VENT').toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length >= 4) return clean.slice(0, 4);
  return (clean + 'VENT').slice(0, 4);
}

function parseRaiseAmount(str = '') {
  if (!str) return 3000000;
  const cleaned = String(str).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num) || num <= 0) return 3000000;
  const lower = String(str).toLowerCase();
  if (lower.includes('b')) return num * 1000000000;
  if (lower.includes('m')) return num * 1000000;
  if (lower.includes('k')) return num * 1000;
  if (num < 100) return num * 1000000; // e.g. "3.5" or "4" means $3.5M or $4M
  return num;
}

function getSectorMeta(industry = 'Technology') {
  const ind = (industry || '').toLowerCase();
  if (ind.includes('health') || ind.includes('bio')) {
    return { sector: 'Healthcare', multiple: 12.0, benchmarkTicker: 'NASDAQ:IBB', exchange: 'NASDAQ' };
  }
  if (ind.includes('fin')) {
    return { sector: 'FinTech', multiple: 9.5, benchmarkTicker: 'NYSE:XLF', exchange: 'NYSE' };
  }
  if (ind.includes('retail') || ind.includes('e-com')) {
    return { sector: 'Retail', multiple: 6.2, benchmarkTicker: 'NYSE:XRT', exchange: 'NYSE' };
  }
  if (ind.includes('auto')) {
    return { sector: 'Automobile', multiple: 7.5, benchmarkTicker: 'NASDAQ:TSLA', exchange: 'NASDAQ' };
  }
  if (ind.includes('real')) {
    return { sector: 'Real Estate', multiple: 5.8, benchmarkTicker: 'NYSE:XLRE', exchange: 'NYSE' };
  }
  if (ind.includes('media')) {
    return { sector: 'Media', multiple: 7.0, benchmarkTicker: 'NYSE:XLC', exchange: 'NYSE' };
  }
  return { sector: 'Technology', multiple: 10.5, benchmarkTicker: 'NASDAQ:QQQ', exchange: 'NASDAQ' };
}

/**
 * Analyzes raw startup pitch inputs and constructs structured enterprise-grade
 * profiles for both the Dealflow repository and the Global Companies intelligence database.
 */
function analyzeAndStructurePitch(body) {
  const name = (body.name || 'Untitled Venture').trim();
  const slug = slugify(name);
  const ticker = generateTicker(name);
  const sectorMeta = getSectorMeta(body.industry);

  // 1. Quantitative Valuation Benchmarking
  const targetRaise = parseRaiseAmount(body.funding_requirement);
  let targetRaiseStr = (body.funding_requirement || '').trim();
  if (!targetRaiseStr || !targetRaiseStr.startsWith('$')) {
    targetRaiseStr = `$${(targetRaise / 1000000).toFixed(1)}M`;
  }
  
  // Typical venture dilution: 16% - 20%
  const dilutionPct = 17.5;
  const impliedPostMoney = Math.round(targetRaise / (dilutionPct / 100));
  const impliedPreMoney = Math.round(impliedPostMoney - targetRaise);
  const preMoneyMillions = (impliedPreMoney / 1000000).toFixed(1);
  const postMoneyMillions = (impliedPostMoney / 1000000).toFixed(1);

  // Implied share price across 2,000,000 standard authorized founder shares
  const totalShares = 2000000;
  const impliedSharePrice = +(impliedPreMoney / totalShares).toFixed(2);

  // ARR derived from sector multiple
  const baseARR = Math.max(350000, Math.round(impliedPreMoney / sectorMeta.multiple));
  const arrStr = `$${(baseARR / 1000000).toFixed(1)}M ARR`;
  const burnStr = `-$${Math.round(baseARR * 0.45 / 1000)}K/yr Burn`;

  // 2. AI Pitch Doctor Scoring
  let pitchScore = 65;
  if ((body.problem_solved || '').length > 50) pitchScore += 10;
  if ((body.proposed_solution || '').toLowerCase().includes('ai') || 
      (body.proposed_solution || '').toLowerCase().includes('model') ||
      (body.proposed_solution || '').toLowerCase().includes('neural') ||
      (body.proposed_solution || '').toLowerCase().includes('quantum')) pitchScore += 10;
  if ((body.target_market || '').includes('$') || (body.target_market || '').includes('B')) pitchScore += 6;
  if ((body.business_model || '').length > 40) pitchScore += 5;
  pitchScore = Math.min(96, Math.max(72, pitchScore));

  const readinessTier = pitchScore >= 88 ? 'Institutional Grade' : pitchScore >= 78 ? 'Venture Ready' : 'Emerging Opportunity';
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // 3. Pro-Forma Multi-Year Financial Statements
  const y1 = Math.round(baseARR / 1000); // in thousands
  const y2 = Math.round(y1 * 2.4);
  const y3 = Math.round(y2 * 1.9);
  const y4 = Math.round(y3 * 1.6);
  const y5 = Math.round(y4 * 1.45);

  const formatK = (k) => k >= 1000 ? `$${(k / 1000).toFixed(1)}M` : `$${k}K`;

  const incomeStatement = [
    { metric: 'Revenue (ARR)', y2024: formatK(y1), y2025: formatK(y2), y2026: formatK(y3), y2027: formatK(y4), ttm: formatK(y2) },
    { metric: 'Cost of Goods Sold (COGS)', y2024: formatK(Math.round(y1 * 0.22)), y2025: formatK(Math.round(y2 * 0.21)), y2026: formatK(Math.round(y3 * 0.19)), y2027: formatK(Math.round(y4 * 0.18)), ttm: formatK(Math.round(y2 * 0.21)) },
    { metric: 'Gross Profit', y2024: formatK(Math.round(y1 * 0.78)), y2025: formatK(Math.round(y2 * 0.79)), y2026: formatK(Math.round(y3 * 0.81)), y2027: formatK(Math.round(y4 * 0.82)), ttm: formatK(Math.round(y2 * 0.79)) },
    { metric: 'Operating Expenses (R&D, S&M)', y2024: formatK(Math.round(y1 * 1.35)), y2025: formatK(Math.round(y2 * 0.95)), y2026: formatK(Math.round(y3 * 0.72)), y2027: formatK(Math.round(y4 * 0.58)), ttm: formatK(Math.round(y2 * 0.95)) },
    { metric: 'Operating Income (EBIT)', y2024: `-${formatK(Math.round(y1 * 0.57))}`, y2025: `-${formatK(Math.round(y2 * 0.16))}`, y2026: `+${formatK(Math.round(y3 * 0.09))}`, y2027: `+${formatK(Math.round(y4 * 0.24))}`, ttm: `-${formatK(Math.round(y2 * 0.16))}` }
  ];

  const balanceSheet = [
    { metric: 'Cash & Cash Equivalents', y2024: targetRaiseStr, y2025: formatK(Math.round(targetRaise / 1000 * 0.65)), y2026: formatK(Math.round(targetRaise / 1000 * 1.4)), y2027: formatK(Math.round(targetRaise / 1000 * 2.8)), ttm: targetRaiseStr },
    { metric: 'Accounts Receivable', y2024: formatK(Math.round(y1 * 0.12)), y2025: formatK(Math.round(y2 * 0.14)), y2026: formatK(Math.round(y3 * 0.15)), y2027: formatK(Math.round(y4 * 0.15)), ttm: formatK(Math.round(y2 * 0.14)) },
    { metric: 'Total Assets', y2024: formatK(Math.round(targetRaise / 1000 * 1.15)), y2025: formatK(Math.round(targetRaise / 1000 * 1.3)), y2026: formatK(Math.round(targetRaise / 1000 * 2.6)), y2027: formatK(Math.round(targetRaise / 1000 * 4.8)), ttm: formatK(Math.round(targetRaise / 1000 * 1.15)) },
    { metric: 'Total Debt & Liabilities', y2024: '$120K', y2025: '$280K', y2026: '$450K', y2027: '$820K', ttm: '$120K' },
    { metric: 'Stockholder Equity', y2024: `$${postMoneyMillions}M`, y2025: `$${(+postMoneyMillions * 1.25).toFixed(1)}M`, y2026: `$${(+postMoneyMillions * 1.8).toFixed(1)}M`, y2027: `$${(+postMoneyMillions * 2.7).toFixed(1)}M`, ttm: `$${postMoneyMillions}M` }
  ];

  const cashFlow = [
    { metric: 'Operating Cash Flow', y2024: `-${formatK(Math.round(y1 * 0.45))}`, y2025: `-${formatK(Math.round(y2 * 0.12))}`, y2026: `+${formatK(Math.round(y3 * 0.14))}`, y2027: `+${formatK(Math.round(y4 * 0.28))}`, ttm: `-${formatK(Math.round(y1 * 0.45))}` },
    { metric: 'Capital Expenditures (CapEx)', y2024: '$85K', y2025: '$190K', y2026: '$380K', y2027: '$640K', ttm: '$85K' },
    { metric: 'Free Cash Flow', y2024: `-${formatK(Math.round(y1 * 0.52))}`, y2025: `-${formatK(Math.round(y2 * 0.22))}`, y2026: `+${formatK(Math.round(y3 * 0.08))}`, y2027: `+${formatK(Math.round(y4 * 0.21))}`, ttm: `-${formatK(Math.round(y1 * 0.52))}` }
  ];

  // 4. Construct Full Company Intelligence Object (for companies_data.json)
  const companyRecord = {
    id: slug,
    name: name,
    ticker: ticker,
    is_startup_pitch: true,
    stage: `${targetRaiseStr} Pitch • ${readinessTier}`,
    sector: sectorMeta.sector,
    industry: body.industry || sectorMeta.sector,
    country: "USA",
    logo_color: "#3b82f6",
    logo_url: null,
    market_cap: `$${preMoneyMillions}M`,
    implied_valuation: `$${preMoneyMillions}M`,
    pre_money_valuation: `$${preMoneyMillions}M`,
    post_money_valuation: `$${postMoneyMillions}M`,
    target_raise: targetRaiseStr,
    dilution_pct: `${dilutionPct}%`,
    valuation_multiple: `${sectorMeta.multiple}x ARR`,
    revenue_ttm: arrStr,
    net_income_ttm: burnStr,
    employees: "12 - 25 Team",
    stock_price: impliedSharePrice,
    stock_price_date: todayStr,
    one_year_change: "+48.5% (Projected)",
    price_change: "+48.5%",
    price_positive: true,
    sparkline: [10, 14, 18, 24, 30, 38, Math.round(impliedSharePrice * 5)],
    founded_year: 2024,
    subtitle: `${name} (${ticker}) • ${body.tagline || 'Early-Stage Venture'}`,
    headquarters: "San Francisco, CA, USA",
    headquarters_address: "Silicon Valley Innovation Campus, 450 Townsend St, San Francisco, CA 94107",
    website: `https://${slug}.io`,
    wikipedia_url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
    ir_url: `https://${slug}.io/pitch-deck`,
    sec_edgar_url: `https://www.sec.gov/edgar/searchedgar/companysearch?search_text=${ticker}`,
    yahoo_finance_url: `https://finance.yahoo.com/quote/${sectorMeta.benchmarkTicker.split(':')[1]}`,
    google_finance_url: `https://www.google.com/finance/quote/${ticker}:PRIVATE`,
    tradingview_url: `https://www.tradingview.com/symbols/${sectorMeta.benchmarkTicker.replace(':', '-')}/`,
    tradingview_symbol: sectorMeta.benchmarkTicker,
    exchange: "Private (Venture Backed)",
    gross_margin: "78.4%",
    operating_margin: "-32.0% (Investment Phase)",
    net_margin: "-28.5%",
    eps: -0.42,
    pe_ratio: `${sectorMeta.multiple}x ARR Multiple`,
    dividend_yield: "0.00% (High Growth Reinvested)",
    leadership: {
      founder: body.founder_name || 'Venture Founder',
      founder_title: body.founder_title || 'Chief Executive Officer & Founder',
      founder_email: body.founder_email || 'founders@venture.ai',
      founder_summary: body.idea || body.tagline || `Pioneering innovator in ${sectorMeta.sector}.`,
      current_ceo: body.founder_name || 'Venture Founder',
      company_background: `${name} was founded to address critical friction in ${sectorMeta.sector}. ${body.problem_solved || ''} ${body.proposed_solution || ''}`
    },
    executive_analysis_paragraph: `${name} is an emerging high-growth ${sectorMeta.sector} venture pioneering proprietary solutions in ${body.target_market || 'global markets'}. The company's core technological architecture addresses a quantifiable market pain: ${body.problem_solved || 'market inefficiency'}. By deploying ${body.proposed_solution || 'automated intelligence'}, the startup targets an estimated addressable market of ${body.target_market || '$10B+ TAM'}. With a target funding round of ${targetRaiseStr} at an implied pre-money valuation of $${preMoneyMillions}M (${sectorMeta.multiple}x ARR benchmark), ${name} projects scalable unit economics with gross margins reaching 78%+ under its ${body.business_model || 'recurring SaaS'} model.`,
    wikipedia_summary: `${name} is a privately held ${sectorMeta.sector} technology company founded by ${body.founder_name || 'entrepreneurs'}. The venture develops ${body.tagline || 'specialized technology'} designed to solve ${body.problem_solved || 'critical industry bottlenecks'}. Headquartered in San Francisco, CA, ${name} has benchmarked an initial valuation of $${preMoneyMillions}M with institutional-grade readiness of ${pitchScore}/100.`,
    market_data: {
      open: +(impliedSharePrice * 0.95).toFixed(2),
      day_high: +(impliedSharePrice * 1.08).toFixed(2),
      day_low: +(impliedSharePrice * 0.92).toFixed(2),
      week52_high: +(impliedSharePrice * 1.25).toFixed(2),
      week52_low: +(impliedSharePrice * 0.75).toFixed(2),
      pe_ratio: `${sectorMeta.multiple}x (ARR Multiple)`,
      eps: -0.42,
      dividend_yield: "0.00% (High Growth)"
    },
    failures_timeline: [
      {
        year: "2024",
        title: "Early Customer Acquisition & Extended Enterprise Sales Cycle",
        severity: "HIGH",
        description: "Initial enterprise pilot procurement cycles required 6-9 months of security compliance verification, causing transient pipeline delay.",
        case_study_source: "Harvard Business Review / Startup Failure Modes Research"
      },
      {
        year: "2025 (Projected)",
        title: "Runway Burn Rate & Cloud Compute Scaling Friction",
        severity: "CRITICAL",
        description: "Rapid neural inference model scaling demands strict capital governance to preserve an 18-month cash runway before Series A.",
        case_study_source: "WSJ / Silicon Valley Bank Venture Debt Case Study"
      },
      {
        year: "2026 (Projected)",
        title: "Market Incumbent Feature Replication Threat",
        severity: "MEDIUM",
        description: "Legacy megacap competitors may launch adjacent commodity features, requiring rapid defensible IP and switching moat expansion.",
        case_study_source: "MIT Sloan Management Review / Enterprise Moat Analysis"
      }
    ],
    impact_analysis: {
      revenue_impact: "-14.5% (Pre-product market fit risk)",
      market_share_impact: "-6.2% (Initial channel friction)",
      drawdown: "-22.0% (Early-stage volatility band)",
      recovery_time: "6 - 9 Months (With disciplined triage)"
    },
    major_successes: [
      {
        title: "Proprietary Algorithmic & Defensible Architecture Moat",
        description: `Developed specialized domain-specific algorithms for ${sectorMeta.sector} that achieve high-conviction outcomes with 80%+ lower inference costs.`
      },
      {
        title: "High-Margin Capital-Efficient Revenue Architecture",
        description: `Established a sticky ${body.business_model || 'recurring software subscription'} model designed for >125% Net Revenue Retention at scale.`
      }
    ],
    past_solutions: [
      {
        title: "Enterprise Lighthouse Design Partner Co-Development",
        description: "Secured multi-year pilot commitments with leading industry customers, locking in upfront cash payments and eliminating churn risk."
      },
      {
        title: "Strict 18-Month Runway Governance & Milestone Tranches",
        description: "Engineered lean operational budgets with cloud compute credits, ensuring capital runway remains insulated against macroeconomic shocks."
      }
    ],
    financial_statements: {
      income_statement: incomeStatement,
      balance_sheet: balanceSheet,
      cash_flow: cashFlow
    },
    revenue_breakdown: [
      { name: "Core Enterprise Platform", percentage: 65, color: "#3b82f6" },
      { name: "Custom Integration & API Feeds", percentage: 20, color: "#06b6d4" },
      { name: "Milestone Usage & Royalties", percentage: 15, color: "#10b981" }
    ],
    crisis_info: {
      crisis_title: "Seed Runway Extension & Product-Market Validation Challenge",
      condition_summary: `High initial capital burn rate coupled with critical need to validate product retention across ${sectorMeta.sector} enterprise pilots.`,
      strategy_used: "Lean Milestone Engineering & Lighthouse Enterprise Co-Development",
      strategy_category: "Early-Stage Scaling & Turnaround Playbook",
      strategy_summary: `Implemented a phased 4-stage execution roadmap: locked in design partner accounts, capped discretionary burn to extend runway to 18 months, and established a scalable recurring distribution engine.`,
      root_causes: [
        "Premature marketing expenditure before retention stabilization.",
        "High initial compute and development infrastructure costs.",
        "Extended enterprise procurement decision cycles."
      ],
      recovery_outcome: `Projected to reach ${arrStr} with 78% gross margins and close oversubscribed institutional round within 12 months.`,
      recovery_status: "Venture Validated",
      recommended_steps: [
        {
          phase: "Phase 1: Immediate Triage & Runway Preservation",
          timeframe: "Day 1 - 30",
          action: "Audit all operational expenditures and cap discretionary SaaS burn to maintain minimum 18-month cash runway."
        },
        {
          phase: "Phase 2: Customer Retention & Moat Fortification",
          timeframe: "Day 31 - 90",
          action: "Onboard 5 design partner lighthouse accounts with multi-year upfront commitment structures to secure non-dilutive working capital."
        },
        {
          phase: "Phase 3: Automated Engine Deployment",
          timeframe: "Day 91 - 180",
          action: "Deploy automated API onboarding and self-serve workflows to lower customer acquisition costs by 45%."
        },
        {
          phase: "Phase 4: Institutional Series A Expansion",
          timeframe: "Day 181 - 365",
          action: "Leverage validated metrics (Net Revenue Retention > 125%, CAC Payback < 8 months) to raise institutional round at $30M+ valuation."
        }
      ]
    },
    pitch_details: {
      founder_name: body.founder_name,
      founder_title: body.founder_title,
      founder_email: body.founder_email,
      tagline: body.tagline,
      idea: body.idea,
      problem_solved: body.problem_solved,
      proposed_solution: body.proposed_solution,
      target_market: body.target_market,
      expected_usability: body.expected_usability,
      future_potential: body.future_potential,
      business_model: body.business_model,
      funding_requirement: targetRaiseStr,
      expected_returns: body.expected_returns,
      supporting_info: body.supporting_info,
      ai_pitch_score: pitchScore,
      readiness_tier: readinessTier,
      implied_pre_money: `$${preMoneyMillions}M`,
      implied_post_money: `$${postMoneyMillions}M`,
      submitted_at: todayStr
    }
  };

  // 5. Construct Dealflow Startup Record (for startups_data.json)
  const startupRecord = {
    id: `startup-${slug}`,
    company_id: slug,
    name: name,
    industry: sectorMeta.sector,
    founder_name: body.founder_name || 'Venture Founder',
    founder_title: body.founder_title || 'Chief Executive Officer',
    founder_email: body.founder_email || 'founders@venture.ai',
    tagline: body.tagline || 'Early-Stage Innovation Venture',
    idea: body.idea || body.proposed_solution || '',
    problem_solved: body.problem_solved || '',
    proposed_solution: body.proposed_solution || '',
    target_market: body.target_market || '',
    expected_usability: body.expected_usability || '',
    future_potential: body.future_potential || '',
    potential_rating: pitchScore >= 80 ? 'High' : 'Medium',
    business_model: body.business_model || '',
    funding_requirement: targetRaiseStr,
    expected_returns: body.expected_returns || '10x - 14x projected over a 5-year investment horizon',
    supporting_info: body.supporting_info || '',
    ai_pitch_score: pitchScore,
    readiness_tier: readinessTier,
    implied_valuation: `$${preMoneyMillions}M Pre-Money`,
    implied_post_money: `$${postMoneyMillions}M Post-Money`,
    target_raise_amount: targetRaise,
    dilution_pct: `${dilutionPct}%`,
    submitted_at: todayStr
  };

  // 6. Construct High-Impact News Headline (for news_sentiment.json)
  const newsItem = {
    title: `${name} Registers ${targetRaiseStr} Venture Pitch on ICLAS with ${pitchScore}/100 Institutional AI Readiness`,
    source: "TechCrunch VentureWire",
    url: `https://techcrunch.com/search/${encodeURIComponent(name)}`,
    published: new Date().toUTCString(),
    sentiment_score: 8.2,
    sentiment_label: "Bullish",
    category: "Funding & Pitch"
  };

  return {
    slug,
    ticker,
    companyRecord,
    startupRecord,
    newsItem
  };
}

module.exports = {
  analyzeAndStructurePitch,
  slugify,
  generateTicker
};
