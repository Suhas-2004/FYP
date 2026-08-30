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
  const data = [
    {
      id: 'vanished-better-place',
      startup_name: 'Better Place',
      startup_status: 'Defunct (Folded 2013)',
      founded_year: 2007,
      vanished_year: 2013,
      peak_valuation: '$2.25B',
      capital_burned: '$850M+',
      sector: 'Automobile',
      futuristic_idea: 'Automated 3-Minute EV Battery Swapping Grid',
      visionary_promise: 'Pioneered robotic drive-through battery swapping stations and switchable powertrains to eliminate EV range anxiety and charging wait times a decade before mass adoption.',
      fatal_crisis: 'Astronomical CapEx deployment burn rate without securing multi-OEM automaker commitments (only Renault built compatible cars). Built expensive swapping infrastructure in Israel & Denmark with fixed overhead before consumer EV adoption existed, depleting cash runway before unit economics matured.',
      crisis_category: 'CapEx Burn & Lack of Ecosystem Standardization',
      severity: 'Critical',
      matched_mnc_id: 'tesla',
      matched_mnc_name: 'Tesla, Inc. (2018)',
      matched_mnc_crisis_title: 'Model 3 "Production Hell" & EV Infrastructure Capital Burn (2018)',
      similarity_score: 96,
      shared_crisis_core: 'EV scaling capital burn & infrastructure dependency risk',
      mnc_strategy_category: 'Pragmatic De-Automation & Proprietary Supercharger Ecosystem',
      mnc_turnaround_strategy: 'Dismantled broken automated lines in favor of an agile Fremont tent line, established proprietary Supercharger network tied directly to car sales, and focused 100% of capital on positive Model 3 gross margins.',
      mnc_key_moves: [
        'Scrapped over-engineered robotic assembly cells and erected an agile manual tent assembly line (GA4)',
        'Built a proprietary high-speed Supercharger network attached directly to vehicle gross margin',
        'Simplified vehicle wiring harnesses and reduced Bill-of-Materials (BOM) parts count by 20%',
        'Secured local municipal support and low-cost debt for Shanghai Gigafactory expansion'
      ],
      mnc_outcome: "Scaled Model 3 to the world's #1 selling EV sedan; generated $10B+ annual operating cash flow with a $700B+ market cap.",
      current_mnc_market_cap: '$720B+',
      founder_heuristic: 'Heavy infrastructure networks without universal OEM standardization will bleed dry before consumer adoption catches up. Build high-margin standalone vehicles first and scale charging in tandem with vehicle volume.'
    },
    {
      id: 'vanished-pebble',
      startup_name: 'Pebble Technology',
      startup_status: 'Defunct (Acquired for parts 2016)',
      founded_year: 2012,
      vanished_year: 2016,
      peak_valuation: '$740M',
      capital_burned: '$68M+ (Sold for $23M)',
      sector: 'Technology',
      futuristic_idea: 'Pioneered the Modern Open E-Paper Smartwatch',
      visionary_promise: 'Created the first ubiquitous consumer smartwatch with 7-day battery life, sunlight-readable e-paper display, and an open hacker SDK years before Apple Watch or WearOS.',
      fatal_crisis: 'Supply chain delays and cash flow squeeze on new hardware generations (Pebble Time). When mega-cap tech giants entered the category with integrated ecosystem lock-in and subsidized hardware, Pebble faced retail inventory oversupply, channel margin erosion, and debt default.',
      crisis_category: 'Hardware Margin Squeeze & Giant Platform Entry',
      severity: 'Critical',
      matched_mnc_id: 'apple',
      matched_mnc_name: 'Apple Inc. (1997)',
      matched_mnc_crisis_title: 'Product Matrix Fragmentation & 90 Days of Cash Solvency Crisis (1997)',
      similarity_score: 94,
      shared_crisis_core: 'Hardware inventory glut, margin erosion & platform competition',
      mnc_strategy_category: 'Radical Product Pruning & Competitor Bridge Financing',
      mnc_turnaround_strategy: 'Steve Jobs eliminated 70% of hardware projects down to a 2x2 grid (Desktop/Portable x Consumer/Pro), negotiated a $150M bridge investment from Microsoft, and streamlined supply chain inventory days to near zero.',
      mnc_key_moves: [
        'Slashed 350+ fragmented hardware variants down to 4 core products (Desktop/Laptop x Pro/Consumer)',
        'Secured $150M non-voting bridge financing and 5-year Mac Office commitment from Microsoft',
        'Hired Tim Cook to ruthlessly eliminate warehouse inventory holding days from months to single-digit days',
        'Outsourced component manufacturing to contract specialists to eliminate fixed factory depreciation'
      ],
      mnc_outcome: 'Turned cash flow positive within 12 months, pioneering iMac, iPod, iPhone, and reaching a $3.4T market cap.',
      current_mnc_market_cap: '$3.42T',
      founder_heuristic: 'When capital-rich platform giants enter your niche, niche hardware features cannot compete against ecosystem integration. Consolidate your core product lines and protect cash margins relentlessly.'
    },
    {
      id: 'vanished-quibi',
      startup_name: 'Quibi',
      startup_status: 'Defunct (Folded in 6 Months 2020)',
      founded_year: 2018,
      vanished_year: 2020,
      peak_valuation: '$1.75B',
      capital_burned: '$1.75 Billion',
      sector: 'Media',
      futuristic_idea: 'Hollywood-Grade Mobile "Quick Bites" Video with Turnstyle',
      visionary_promise: 'Pioneered premium $100,000/minute episodic short-form content specifically for smartphones with proprietary Turnstyle tech seamlessly toggling between vertical and horizontal video.',
      fatal_crisis: 'Rigid paid subscription paywall ($4.99-$7.99/mo) launched right as COVID lockdowns eliminated mobile commutes. Banned screenshots and social clip sharing (blocking viral distribution), causing over 90% trial drop-off and zero organic word-of-mouth.',
      crisis_category: 'Subscriber Churn, Paywall Friction & Distribution Mismatch',
      severity: 'Critical',
      matched_mnc_id: 'netflix',
      matched_mnc_name: 'Netflix Inc. (2011 & 2022)',
      matched_mnc_crisis_title: 'Qwikster Price Backlash (2011) & Post-Pandemic Subscriber Cliff (2022)',
      similarity_score: 95,
      shared_crisis_core: 'Subscriber churn shock, pricing friction & content cost inflation',
      mnc_strategy_category: 'Proprietary Content Moats & Hybrid Monetization Architecture',
      mnc_turnaround_strategy: 'Created iconic proprietary studio IP (House of Cards, Stranger Things) to replace commoditized licensed media, rolled out paid-sharing guardrails, and launched an entry-level $6.99 ad-supported tier.',
      mnc_key_moves: [
        'Shifted budget from expensive non-exclusive licensing to proprietary in-house studio IP ownership',
        'Implemented algorithmic paid-sharing infrastructure to monetize 100M+ password borrowers without alienating users',
        'Launched a lower-cost ad-supported tier ($6.99/mo) in partnership with Microsoft advertising',
        'Amortized global content spend by scaling localized international megahits (Squid Game, Lupin)'
      ],
      mnc_outcome: 'Subscribers rebounded to 280M+ globally with $7B+ annual free cash flow and 28% operating margins.',
      current_mnc_market_cap: '$290B+',
      founder_heuristic: 'Never put high-friction paywalls on mobile content without viral social distribution mechanisms. If consumer behavior shifts, pivot the distribution and monetization model immediately.'
    },
    {
      id: 'vanished-convoy',
      startup_name: 'Convoy',
      startup_status: 'Defunct (Folded 2023, Assets to Flexport)',
      founded_year: 2015,
      vanished_year: 2023,
      peak_valuation: '$3.8B',
      capital_burned: '$900M+',
      sector: 'FinTech',
      futuristic_idea: 'Algorithmic Digital Freight Brokerage & Automated Dispatch',
      visionary_promise: 'The "Uber for Trucking" — algorithmic freight matching platform automating freight brokerages, batching drop-and-hook shipments, and eliminating empty trailer miles via machine learning dispatch.',
      fatal_crisis: 'Post-pandemic "freight recession" caused trucking spot rates to crash by 40% simultaneously with rapid interest rate hikes. High fixed engineering headcount, deep customer subsidy pricing, and venture debt leverage triggered a sudden liquidity freeze.',
      crisis_category: 'Cyclical Demand Collapse & High Fixed Tech Burn',
      severity: 'Critical',
      matched_mnc_id: 'block',
      matched_mnc_name: 'Block, Inc. (2022-2023)',
      matched_mnc_crisis_title: 'Post-Pandemic Operating Cost Explosion & BNPL Delinquency (2022-2023)',
      similarity_score: 93,
      shared_crisis_core: 'Fintech transaction margin compression & bloated tech payroll',
      mnc_strategy_category: 'Rigid Headcount Ceiling & Rule of 40 GAAP Discipline',
      mnc_turnaround_strategy: 'Jack Dorsey instituted a strict, non-negotiable 12,000 corporate employee cap, tightened BNPL underwriting loss rates below 1.2%, and prioritized GAAP operating profit over transaction volume.',
      mnc_key_moves: [
        'Enacted an absolute company-wide headcount cap of 12,000 to force structural operational leverage',
        'Realigned Cash App and Square roadmaps to prioritize Rule of 40 operating profitability',
        'Tightened automated credit underwriting rules on Afterpay BNPL to compress bad debt provisions',
        'Connected Cash App consumer balance routing directly into Square POS merchant rails to slash interchange fees'
      ],
      mnc_outcome: 'Achieved record quarterly gross profit of $2.25B with positive GAAP net income and accelerating free cash flow.',
      current_mnc_market_cap: '$42B+',
      founder_heuristic: 'Marketplace transaction volume cannot compensate for high fixed tech burn during cyclical industry downturns. Build counter-cyclical pricing cushions and enforce strict headcount limits.'
    },
    {
      id: 'vanished-fisker',
      startup_name: 'Fisker Inc. / Automotive',
      startup_status: 'Defunct (Chapter 11 Bankruptcy 2024)',
      founded_year: 2007,
      vanished_year: 2024,
      peak_valuation: '$2.9B',
      capital_burned: '$1.4B+',
      sector: 'Automobile',
      futuristic_idea: 'Luxury Solar-Roof Eco-EVs with Asset-Light Manufacturing',
      visionary_promise: 'Designed revolutionary luxury solar-roof electric vehicles (Karma & Ocean) with vegan recycled interiors and asset-light outsourced manufacturing via Magna Steyr.',
      fatal_crisis: 'Asset-light reliance on contract manufacturing caused crippling vehicle software bugs, delivery gridlocks, and NHTSA safety probes. Unsold Ocean inventory write-downs and cash burn depleted liquidity before hitting sustainable volume.',
      crisis_category: 'Manufacturing Software Failures & Asset-Light Quality Trap',
      severity: 'Critical',
      matched_mnc_id: 'ford',
      matched_mnc_name: 'Ford Motor Company (2008 & 2023)',
      matched_mnc_crisis_title: 'Pre-2008 Liquidity Freeze & Gen-1 EV Division Capital Drain (2023)',
      similarity_score: 95,
      shared_crisis_core: 'Automotive cash burn, warranty spikes & capital market freezes',
      mnc_strategy_category: 'Preemptive Liquidity Buffering & Commercial Hybrid Cash Cows',
      mnc_turnaround_strategy: 'Preemptively mortgaged all corporate assets for $23.6B in liquidity before the 2008 crash, and later shifted capital from loss-making pure BEVs to high-margin hybrid commercial fleets (Ford Pro).',
      mnc_key_moves: [
        'Mortgaged all corporate assets and logos in 2006 to build a $23.6B liquidity war chest before credit froze',
        'Scaled high-margin commercial fleet unit (Ford Pro) generating $6B+ annual EBIT to fund technological transitions',
        'Pivoted passenger vehicle rollout toward affordable hybrid powertrains rather than high-cost BEV battery packs',
        'Overhauled supplier quality verification gates to permanently compress legacy warranty recall costs'
      ],
      mnc_outcome: 'Ford survived the Great Financial Crisis without government bailout and stabilized automotive EBIT above $10B.',
      current_mnc_market_cap: '$44B+',
      founder_heuristic: 'Outsourcing core vehicle software and manufacturing leaves you powerless when quality defects strike. Maintain ironclad balance sheet liquidity and master core vehicle software in-house.'
    },
    {
      id: 'vanished-webvan',
      startup_name: 'Webvan',
      startup_status: 'Defunct (Folded in 18 Months 2001)',
      founded_year: 1996,
      vanished_year: 2001,
      peak_valuation: '$1.2B (IPO)',
      capital_burned: '$800M+',
      sector: 'Retail',
      futuristic_idea: 'Automated 30-Minute Robotic Grocery Delivery Infrastructure',
      visionary_promise: 'Pioneered automated online grocery e-commerce 20 years ahead of its time, deploying $30M automated robotic carousel distribution hubs and custom climate-controlled vans.',
      fatal_crisis: '"Get Big Fast" fatal expansion error. Committed $1B+ across 26 metropolitan markets before proving localized density or positive unit contribution margins in a single city, bleeding $30M+ per quarter on perishables.',
      crisis_category: 'Premature Geo-Expansion & Negative Unit Economics',
      severity: 'Critical',
      matched_mnc_id: 'bestbuy',
      matched_mnc_name: 'Best Buy Co., Inc. (2012)',
      matched_mnc_crisis_title: 'E-Commerce Showrooming & Crushing Online Margin Undercutting (2012)',
      similarity_score: 92,
      shared_crisis_core: 'Retail physical overhead, price competition & logistics cost burden',
      mnc_strategy_category: 'Store-Within-A-Store Real Estate & Omnichannel Ship-from-Store',
      mnc_turnaround_strategy: 'Hubert Joly eliminated the price gap via algorithmic price matching, converted physical floorspace into paid vendor showrooms (Apple, Samsung, Sony), and turned retail stores into local micro-fulfillment hubs.',
      mnc_key_moves: [
        'Instituted automated real-time online price matching to eliminate Amazon showrooming advantage',
        'Monetized physical retail square footage by leasing dedicated showcase mini-stores to Apple, Samsung, Sony',
        'Transformed 1,000+ existing retail locations into local pick-and-pack ship-from-store fulfillment centers',
        'Trained Geek Squad into trusted in-home tech advisors to drive recurring high-margin services revenue'
      ],
      mnc_outcome: 'Cut $1B in structural costs, grew digital sales 300%, and stabilized 20%+ return on equity.',
      current_mnc_market_cap: '$18B+',
      founder_heuristic: 'Never scale fixed infrastructure geographically before achieving positive contribution margin per order. Repurpose existing local physical assets to minimize warehouse CapEx.'
    },
    {
      id: 'vanished-jawbone',
      startup_name: 'Jawbone (Aliph)',
      startup_status: 'Defunct (Liquidated 2017)',
      founded_year: 1999,
      vanished_year: 2017,
      peak_valuation: '$3.2B',
      capital_burned: '$930M+',
      sector: 'Technology',
      futuristic_idea: 'Premium Wearable Biometrics & Intelligent Audio Ecosystems',
      visionary_promise: 'Pioneered luxury design in consumer hardware with Jambox Bluetooth speakers and UP fitness wristbands featuring sleep stage telemetry and continuous health data tracking.',
      fatal_crisis: 'Product reliability defects on UP wristbands caused massive customer return rates. Over-diversified into clinical medical devices while embroiled in multi-year patent litigation with Fitbit, burning through $900M+ in venture debt.',
      crisis_category: 'Product Quality Defects & Over-Diversification Burn',
      severity: 'Critical',
      matched_mnc_id: 'lego',
      matched_mnc_name: 'The LEGO Group (2004)',
      matched_mnc_crisis_title: 'Uncontrolled SKU Proliferation & $300M Operating Loss Crisis (2004)',
      similarity_score: 94,
      shared_crisis_core: 'Over-diversification, high defect/inventory costs & cash burn',
      mnc_strategy_category: 'Asset Divestment, 50% SKU Reduction & Stage-Gate ROI Discipline',
      mnc_turnaround_strategy: 'Jørgen Vig Knudstorp sold off 70% of Legoland theme parks to raise emergency cash, slashed unique plastic brick molds from 12,000 down to standard palettes, and enforced a 13.5% minimum return on sales on all sets.',
      mnc_key_moves: [
        'Divested 70% stake in Legoland theme parks to Merlin Entertainments to raise emergency liquidity',
        'Slashed unique component molds from 12,000+ by 50%, standardizing on reusable modular palettes',
        'Implemented strict stage-gate financial controls requiring every new product set to prove 13.5%+ return on sales',
        'Partnered with tier-1 global franchises (Star Wars, Harry Potter) to de-risk customer acquisition'
      ],
      mnc_outcome: 'Reversed $300M loss into record profits within 18 months, becoming the most profitable toy brand in history.',
      current_mnc_market_cap: 'Privately Held ($10B+ Est. Value)',
      founder_heuristic: 'Over-diversifying into new hardware verticals before standardizing your core manufacturing will multiply defect rates and bleed cash. Master one hero product and eliminate SKU bloat.'
    },
    {
      id: 'vanished-fast',
      startup_name: 'Fast (Fast AF, Inc.)',
      startup_status: 'Defunct (Collapsed 2022)',
      founded_year: 2019,
      vanished_year: 2022,
      peak_valuation: '$600M',
      capital_burned: '$125M+ (With ~$600k ARR)',
      sector: 'FinTech',
      futuristic_idea: 'Universal One-Click Passwordless Checkout Button',
      visionary_promise: 'Pioneered an open-web universal 1-click checkout button to eliminate password and credit card form friction across every independent e-commerce merchant.',
      fatal_crisis: 'Extreme $10M/month burn rate on vanity marketing stunts (NASCAR sponsorships, airport billboards) and bloated engineering payroll (400+ staff) with negligible $600k ARR. When 2022 macro funding froze, it ran out of cash in weeks.',
      crisis_category: 'Vanity Marketing Burn, Extreme CAC & Zero Unit Economics',
      severity: 'Critical',
      matched_mnc_id: 'paypal',
      matched_mnc_name: 'PayPal Holdings, Inc. (2022)',
      matched_mnc_crisis_title: 'Incentive User Churn, Mobile Wallet Competition & Margin Deceleration (2022)',
      similarity_score: 95,
      shared_crisis_core: 'Vanity user acquisition subsidies, CAC inflation & monetization friction',
      mnc_strategy_category: 'Kill Vanity Subsidies, Expand B2B Enterprise & Free Cash Flow Discipline',
      mnc_turnaround_strategy: 'Dan Schulman immediately terminated sign-up referral bonuses, abandoned low-quality vanity user targets, focused 100% of marketing on high-LTV active transactors, and expanded B2B unbranded checkout (Braintree).',
      mnc_key_moves: [
        'Eliminated vanity referral cash bounties that attracted bot and churn-heavy non-transacting users',
        'Reallocated engineering and sales capital to high-frequency active transactors and enterprise merchants',
        'Scaled unbranded checkout infrastructure (Braintree) across enterprise giants including Shopify and Amazon',
        'Cut $1.3B in annual operating expenses and deployed $5B+ annual free cash flow to share buybacks'
      ],
      mnc_outcome: 'Expanded transactions per active account by 14%, generating $5B+ annual free cash flow with sustained margins.',
      current_mnc_market_cap: '$70B+',
      founder_heuristic: 'Vanity growth metrics and high CAC marketing stunts mask zero product stickiness. Never scale headcount and sponsorship burn ahead of real customer LTV and organic repeat revenue.'
    },
    {
      id: 'vanished-solyndra',
      startup_name: 'Solyndra',
      startup_status: 'Defunct (Bankrupt 2011)',
      founded_year: 2005,
      vanished_year: 2011,
      peak_valuation: '$1.5B+',
      capital_burned: '$1.1B+ (DOE Loan Default)',
      sector: 'Retail',
      futuristic_idea: 'Cylindrical 360-Degree CIGS Thin-Film Solar Photovoltaics',
      visionary_promise: 'Pioneered cylindrical solar tubes that captured direct, diffuse, and reflected sunlight from 360 degrees, requiring zero expensive silicon and drastically reducing commercial rooftop installation labor.',
      fatal_crisis: 'Heavy capital investments in specialized robotic manufacturing plants coincided with an unprecedented 90% plunge in global polysilicon commodity prices ($400/kg down to $40/kg). Conventional flat Chinese silicon panels quickly undercut Solyndra by 70%.',
      crisis_category: 'Commodity Cost Disruption & Fixed CapEx Obsolescence',
      severity: 'Critical',
      matched_mnc_id: 'marvel',
      matched_mnc_name: 'Marvel Entertainment (1996)',
      matched_mnc_crisis_title: 'Speculative Comic Bubble Burst & Chapter 11 Debt Default (1996)',
      similarity_score: 91,
      shared_crisis_core: 'Core commodity market collapse & debt-saddled asset obsolescence',
      mnc_strategy_category: 'Downside Risk Offloading & High-Margin IP Studio Pivot',
      mnc_turnaround_strategy: 'Merged with Toy Biz for immediate physical cash flow, collateralized B-tier characters to secure a $525M non-recourse studio film facility from Merrill Lynch, and created the self-financed Marvel Cinematic Universe.',
      mnc_key_moves: [
        'Engineered a merger with Toy Biz to gain profitable manufacturing cash flow and distribution leverage',
        'Pledged comic character movie rights as non-recourse collateral to secure $525M film financing without balance-sheet risk',
        'Launched self-produced cinematic studio model starting with Iron Man (2008) to capture 100% of box office upside',
        'Negotiated a definitive $4.24B cash-and-stock buyout acquisition by The Walt Disney Company'
      ],
      mnc_outcome: 'Generated $30B+ in worldwide box office revenue, creating the most lucrative cinematic franchise in human history.',
      current_mnc_market_cap: 'Acquired by Disney for $4.24B',
      founder_heuristic: 'When underlying commodity or distribution dynamics shift against your proprietary architecture, transfer structural capital risks and pivot to high-leverage intellectual property.'
    },
    {
      id: 'vanished-katerra',
      startup_name: 'Katerra',
      startup_status: 'Defunct (Bankrupt 2021)',
      founded_year: 2015,
      vanished_year: 2021,
      peak_valuation: '$4.0B',
      capital_burned: '$3.0B+ (SoftBank Funded)',
      sector: 'Real Estate',
      futuristic_idea: 'Vertically Integrated Prefabricated Modular Construction',
      visionary_promise: 'Pioneered end-to-end tech-driven construction — software architectural design, mass-timber automated prefabrication, and on-site assembly to slash building timelines by 50%.',
      fatal_crisis: 'Misjudged complex municipal zoning codes, carried massive multi-state automated factory overhead, and suffered severe supply chain price shocks on building materials during lockdowns, resulting in hundreds of stalled building contracts and insolvency.',
      crisis_category: 'Heavy Asset Overhead, Zoning Friction & Material Cost Inflation',
      severity: 'Critical',
      matched_mnc_id: 'opendoor',
      matched_mnc_name: 'Opendoor Technologies Inc. (2022)',
      matched_mnc_crisis_title: 'The Historic 500bps Interest Rate Shock & Inventory Liquidation Crisis (2022)',
      similarity_score: 96,
      shared_crisis_core: 'Heavy physical real estate inventory holding costs & macro rate shocks',
      mnc_strategy_category: 'Rapid Inventory Fire-Sale & Asset-Light Distribution Partnership',
      mnc_turnaround_strategy: 'Liquidated 20,000+ homes within 90 days even at narrow discounts to eliminate high-interest holding debt, slashed corporate headcount by 50%, and partnered directly with Zillow for low-cost customer acquisition.',
      mnc_key_moves: [
        'Executed rapid price adjustments to liquidate 20,000+ homes in 90 days, cutting inventory debt by 70%',
        'Slashed corporate and operational fixed headcount by 50% to align with reduced real estate transaction velocity',
        'Signed nationwide distribution partnership with Zillow to capture high-intent home sellers without marketing spend',
        'Pivoted algorithmic underwriting spreads dynamically to insulate balance sheet against mortgage rate volatility'
      ],
      mnc_outcome: 'Reduced inventory debt by 70%, reached positive adjusted EBITDA, and secured balance sheet runway.',
      current_mnc_market_cap: '$1.4B+',
      founder_heuristic: 'Heavy asset businesses with high fixed holding costs will collapse during macro shocks if they refuse to liquidate stale inventory quickly. Cut losses early and outsource customer distribution.'
    },
    {
      id: 'vanished-rdio',
      startup_name: 'Rdio',
      startup_status: 'Defunct (Sold to Pandora 2015)',
      founded_year: 2010,
      vanished_year: 2015,
      peak_valuation: '$500M',
      capital_burned: '$125M+ (Sold for $75M)',
      sector: 'Media',
      futuristic_idea: 'Social-First Audiophile Music Streaming & Collaborative Playlists',
      visionary_promise: 'Built an acclaimed minimalist, social-first UI music streaming service with live friend activity feeds, collaborative playlists, and high-fidelity streaming by Skype co-founder Janus Friis.',
      fatal_crisis: 'Stuck with a pure $9.99/mo paid subscription model for too long while Spotify scaled massive user volume via its free ad-supported tier. Massive fixed minimum-guarantee record label royalties exhausted Rdio’s cash before reaching critical subscriber scale.',
      crisis_category: 'Lack of Freemium On-Ramp & High Minimum-Guarantee Licensing',
      severity: 'High',
      matched_mnc_id: 'netflix',
      matched_mnc_name: 'Netflix Inc. (2022 Ad-Tier Evolution)',
      matched_mnc_crisis_title: 'Slowing Core Growth, Market Saturation & Ad-Tier Evolution (2022)',
      similarity_score: 93,
      shared_crisis_core: 'Subscription price-elasticity barriers & content royalty burden',
      mnc_strategy_category: 'Hybrid Ad-Supported On-Ramp & Global Content Amortization',
      mnc_turnaround_strategy: 'Launched an ad-supported subscription tier ($6.99/mo) in partnership with Microsoft advertising, unlocking price-sensitive users, and produced localized foreign-language hits (Squid Game, Lupin) that scaled globally at low production costs.',
      mnc_key_moves: [
        'Launched a lower-cost ad-supported tier ($6.99/mo) to convert price-sensitive users and capture advertising revenue',
        'Shifted content production to international markets to lower cost per hour produced while expanding global TAM',
        'Enacted paid sharing technology across 100M+ borrower households to expand average revenue per member (ARM)',
        'Maintained strict $17B annual content spend ceiling while expanding operating margins above 26%'
      ],
      mnc_outcome: 'Grew ad-tier subscribers past 40M+ and expanded operating margins to historic highs of 28%+.',
      current_mnc_market_cap: '$290B+',
      founder_heuristic: 'Superior design cannot defeat a competitor with a frictionless free tier and superior distribution. Integrate hybrid monetization models before cash reserves drain.'
    },
    {
      id: 'vanished-theranos',
      startup_name: 'Theranos',
      startup_status: 'Defunct (Criminal Dissolution 2018)',
      founded_year: 2003,
      vanished_year: 2018,
      peak_valuation: '$9.0B',
      capital_burned: '$900M+ (Liquidated)',
      sector: 'Healthcare',
      futuristic_idea: 'Comprehensive Microfluidic Fingerprick Blood Diagnostic Testing',
      visionary_promise: 'Promised to run hundreds of clinical laboratory tests from just a few drops of blood drawn from a finger prick at a fraction of standard commercial lab costs.',
      fatal_crisis: 'Complete technological failure concealed behind extreme secrecy, fraudulent demonstrations, lack of peer-reviewed clinical validation, and falsified FDA regulatory documentation, leading to criminal fraud convictions and complete liquidation.',
      crisis_category: 'Scientific Invalidation, Unsubstantiated Hype & Regulatory Destruction',
      severity: 'Critical',
      matched_mnc_id: 'teladoc',
      matched_mnc_name: 'Teladoc Health, Inc. (2022)',
      matched_mnc_crisis_title: 'The $13.4B Goodwill Impairment & DTC Mental Health Advertising Inflation (2022)',
      similarity_score: 89,
      shared_crisis_core: 'HealthTech valuation hype deflation & clinical governance requirements',
      mnc_strategy_category: 'Clean Balance Sheet Impairment, Clinical Evidence & B2B Enterprise Pivot',
      mnc_turnaround_strategy: 'Wrote down unamortized Livongo goodwill immediately to clean the balance sheet, exited unprofitable direct-to-consumer advertising channels, and anchored growth in Fortune 500 employer integrated healthcare contracts with peer-reviewed clinical outcomes.',
      mnc_key_moves: [
        'Recognized a non-cash goodwill impairment charge of $13.4B to reset expectations and clean balance sheet',
        'Shifted sales focus away from high-CAC DTC consumer marketing toward long-term enterprise health plan contracts',
        'Published rigorous peer-reviewed clinical evidence demonstrating measurable reduction in chronic disease A1c levels',
        'Implemented strict corporate governance and clinical compliance oversight to guarantee stakeholder trust'
      ],
      mnc_outcome: 'Stabilized integrated virtual care revenue above $2.6B with positive adjusted EBITDA and zero balance sheet overhang.',
      current_mnc_market_cap: '$1.8B+',
      founder_heuristic: 'In heavily regulated sectors like healthcare and finance, marketing hype without verified empirical clinical data will inevitably invite catastrophic regulatory and legal destruction.'
    }
  ];

  res.json(data);
});

module.exports = router;

