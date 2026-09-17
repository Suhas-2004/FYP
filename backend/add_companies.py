"""
Append 20 new corporate crisis case studies to companies_data.json.
Run: python add_companies.py
"""
import json, os

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'companies_data.json')

NEW_COMPANIES = [
  {
    "id": "kodak",
    "name": "Kodak",
    "ticker": "KODK",
    "sector": "Technology",
    "logo_color": "#f59e0b",
    "market_cap": "$0.5B",
    "founded_year": 1892,
    "leadership": {
      "founder": "George Eastman",
      "founder_summary": "Democratized photography by making cameras and film affordable for everyday consumers.",
      "current_ceo": "Jim Continenza",
      "company_background": "Headquartered in Rochester, NY. Once held 90% of US film market share before digital disruption."
    },
    "executive_analysis_paragraph": "Kodak invented the digital camera in 1975 but suppressed its commercialization to protect film revenues. By 2012, it had filed for Chapter 11 bankruptcy, having lost $30B in market cap over two decades. The core failure was an inability to cannibalize its own product line despite possessing the technology to do so. Post-bankruptcy, Kodak pivoted to commercial printing and pharmaceutical manufacturing, emerging as a lean B2B company with a fraction of its former workforce.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2008 - 2011",
        "title": "Accelerating Film Revenue Collapse",
        "move_data": "Revenue fell from $9.5B to $6.2B; net losses exceeded $1.5B annually; market cap dropped below $1B.",
        "reason_behind_move": "Smartphone cameras eliminated the consumer film and print market within 3 years. Kodak's digital camera division was unprofitable, unable to compete with Sony and Canon on margins.",
        "strategy_implemented": "Emergency patent licensing program, selling 1,100 patents to Apple, Google, and Samsung for $525M to fund operations.",
        "outcome_paragraph": "Patent sale proceeds delayed bankruptcy by 12 months but did not prevent Chapter 11 filing in January 2012."
      },
      {
        "type": "Rebound", "period": "2013 - 2019",
        "title": "Post-Bankruptcy B2B Printing Pivot",
        "move_data": "Emerged from bankruptcy with $800M in exit financing; reduced workforce from 63,000 to 6,000.",
        "reason_behind_move": "New management identified commercial printing and packaging as profitable niches unaffected by digital disruption.",
        "strategy_implemented": "Divested consumer businesses entirely, licensed Kodak brand to third parties, focused R&D on flexographic printing plates and enterprise software.",
        "outcome_paragraph": "Achieved operational profitability in the printing segment by 2019 with EBITDA margins above 12%."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": -3.1, "net_income_growth": -12.0, "debt_growth": 2.1, "cash_flow": 0.3, "roe": -8.4, "order_book": 1.2},
      {"year": "2020", "revenue_growth": -16.5, "net_income_growth": -45.0, "debt_growth": 5.2, "cash_flow": -0.1, "roe": -24.1, "order_book": 0.9},
      {"year": "2021", "revenue_growth": 4.2, "net_income_growth": 210.0, "debt_growth": -8.1, "cash_flow": 0.6, "roe": 15.2, "order_book": 1.1},
      {"year": "2022", "revenue_growth": -2.8, "net_income_growth": -31.0, "debt_growth": -4.5, "cash_flow": 0.4, "roe": -5.1, "order_book": 1.0},
      {"year": "2023", "revenue_growth": -5.1, "net_income_growth": -18.0, "debt_growth": -3.0, "cash_flow": 0.2, "roe": -3.8, "order_book": 0.9},
      {"year": "2024", "revenue_growth": 1.0, "net_income_growth": 5.0, "debt_growth": -2.0, "cash_flow": 0.3, "roe": 1.2, "order_book": 0.8}
    ],
    "crisis_info": {
      "crisis_title": "Digital Disruption and Film Market Collapse",
      "condition_summary": "Kodak invented digital photography but failed to pivot away from film revenues, leading to bankruptcy.",
      "condition_keywords": ["digital disruption", "innovator dilemma", "bankruptcy", "film collapse", "legacy business"],
      "root_causes": ["Protecting existing revenue cannibalized future growth", "Late digital market entry", "Consumer shift to smartphone cameras"],
      "strategy_summary": "Patent liquidation, post-bankruptcy restructuring, B2B printing pivot.",
      "outcome": "Emerged from bankruptcy 2013 as a niche commercial printing company."
    }
  },
  {
    "id": "nokia",
    "name": "Nokia",
    "ticker": "NOK",
    "sector": "Technology",
    "logo_color": "#3b82f6",
    "market_cap": "$21B",
    "founded_year": 1865,
    "leadership": {
      "founder": "Fredrik Idestam",
      "founder_summary": "Founded as a paper mill; pivoted through rubber and cables into becoming the world's dominant mobile phone maker.",
      "current_ceo": "Pekka Lundmark",
      "company_background": "Headquartered in Espoo, Finland. Held over 40% global mobile handset market share in the early 2000s."
    },
    "executive_analysis_paragraph": "Nokia held 40% global smartphone market share in 2007. By 2013, it had sold its entire mobile handset division to Microsoft for $7.2B — a fraction of its peak valuation. The company failed to recognize that the smartphone era required software-first thinking. Nokia's Symbian OS was technically inferior to iOS and Android but internal politics prevented its replacement. The subsequent Microsoft acquisition failed commercially, and Nokia pivoted to become a leading B2B telecom infrastructure provider under the Nokia Networks brand.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2007 - 2011",
        "title": "Smartphone OS Wars: Symbian Loses to iOS and Android",
        "move_data": "Market share fell from 40% to 15%; revenue dropped from €51B to €38B; share price fell 90% from peak.",
        "reason_behind_move": "Apple's iOS and Google's Android offered intuitive touchscreen app ecosystems. Nokia's Symbian OS lagged by 2-3 years in developer tooling and app availability.",
        "strategy_implemented": "Emergency partnership with Microsoft in 2011, adopting Windows Phone OS, replacing CEO with Stephen Elop (ex-Microsoft).",
        "outcome_paragraph": "Windows Phone failed to capture market share above 3%, accelerating Nokia's mobile division collapse."
      },
      {
        "type": "Rebound", "period": "2016 - 2024",
        "title": "5G Infrastructure Provider Transformation",
        "move_data": "Acquired Alcatel-Lucent for €15.6B; 5G network contracts worth €23B+ by 2023.",
        "reason_behind_move": "Global 5G infrastructure buildout created massive B2B demand for radio access networks (RAN) and core network software.",
        "strategy_implemented": "Divested handset brand, acquired Bell Labs, invested in patent licensing portfolio worth $1.5B/year in royalty revenues.",
        "outcome_paragraph": "Nokia became the world's second largest telecom infrastructure company by revenue alongside Ericsson and ahead of Huawei in Western markets."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": -3.5, "net_income_growth": -72.0, "debt_growth": 8.1, "cash_flow": 0.8, "roe": -2.1, "order_book": 18.2},
      {"year": "2020", "revenue_growth": -6.1, "net_income_growth": -380.0, "debt_growth": 12.3, "cash_flow": 0.3, "roe": -14.2, "order_book": 16.9},
      {"year": "2021", "revenue_growth": 2.1, "net_income_growth": 104.0, "debt_growth": -5.2, "cash_flow": 1.8, "roe": 8.4, "order_book": 19.1},
      {"year": "2022", "revenue_growth": 12.5, "net_income_growth": 142.0, "debt_growth": -8.4, "cash_flow": 2.1, "roe": 12.1, "order_book": 22.3},
      {"year": "2023", "revenue_growth": -8.2, "net_income_growth": -81.0, "debt_growth": -2.1, "cash_flow": 1.1, "roe": 2.3, "order_book": 20.1},
      {"year": "2024", "revenue_growth": 1.5, "net_income_growth": 50.0, "debt_growth": -3.0, "cash_flow": 1.4, "roe": 4.2, "order_book": 20.8}
    ],
    "crisis_info": {
      "crisis_title": "Mobile OS Disruption and Handset Division Collapse",
      "condition_summary": "Nokia lost smartphone market leadership due to slow OS transition from Symbian to touchscreen platforms.",
      "condition_keywords": ["smartphone disruption", "OS failure", "market share collapse", "Microsoft acquisition", "B2B pivot"],
      "root_causes": ["Symbian OS technical debt", "Software-first thinking gap", "Internal politics blocked Symbian replacement"],
      "strategy_summary": "Windows Phone partnership, handset sale to Microsoft, 5G infrastructure pivot via Alcatel-Lucent acquisition.",
      "outcome": "Became a leading 5G B2B infrastructure company after exiting the consumer handset market."
    }
  },
  {
    "id": "sears",
    "name": "Sears Holdings",
    "ticker": "SHLDQ",
    "sector": "Retail",
    "logo_color": "#dc2626",
    "market_cap": "$0.1B",
    "founded_year": 1886,
    "leadership": {
      "founder": "Richard Warren Sears",
      "founder_summary": "Pioneer of mail-order retail, creating the original omnichannel concept with the Sears catalogue.",
      "current_ceo": "Eddie Lampert (Bankrupt 2018)",
      "company_background": "Once the largest retailer in the world; owned Kenmore, Craftsman, and DieHard brands. Filed Chapter 11 in 2018."
    },
    "executive_analysis_paragraph": "Sears was the Amazon of the 20th century — a catalogue retailer that delivered to any address in America. Its decline was a 30-year failure to modernize, accelerated by hedge fund owner Eddie Lampert's strategy of milking the brand for cash instead of reinvesting in stores or digital capabilities. By 2018, Sears filed for bankruptcy with $11.3B in debt and 700 remaining stores (from a peak of 3,500). Its Kenmore and Craftsman brands were sold off, and only a skeleton of the company survived.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2012 - 2017",
        "title": "Systematic Store Closure and Brand Liquidation",
        "move_data": "Closed 1,800+ stores; revenue fell from $39B to $17B; stock dropped from $80 to $3.",
        "reason_behind_move": "Amazon and Walmart captured Sears' core value proposition. Lampert extracted cash through REIT spin-offs and brand sales instead of technology investment.",
        "strategy_implemented": "Shop Your Way loyalty program, real estate monetization via Seritage Growth Properties REIT spin-off.",
        "outcome_paragraph": "Loyalty program failed to drive traffic. REIT strategy benefited Lampert personally but stripped stores of lease control."
      },
      {
        "type": "Downfall", "period": "2018",
        "title": "Chapter 11 Bankruptcy Filing",
        "move_data": "Filed Chapter 11 with $11.3B debt; 68,000 employees affected; Craftsman sold to Stanley Black & Decker for $900M.",
        "reason_behind_move": "Pension obligations of $1.5B+ combined with decade-long revenue decline made the debt load unsustainable.",
        "strategy_implemented": "Lampert's ESL Investments submitted winning bankruptcy bid to rescue 425 stores as 'Transform Holdco'.",
        "outcome_paragraph": "Transformed entity operates under 20 stores as of 2024 — a 99% reduction from peak."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": -38.5, "net_income_growth": -15.0, "debt_growth": -42.0, "cash_flow": -1.2, "roe": -85.0, "order_book": 3.1},
      {"year": "2020", "revenue_growth": -52.0, "net_income_growth": -8.0, "debt_growth": -60.0, "cash_flow": -0.5, "roe": -120.0, "order_book": 1.5},
      {"year": "2021", "revenue_growth": -30.0, "net_income_growth": 5.0, "debt_growth": -40.0, "cash_flow": 0.1, "roe": -40.0, "order_book": 1.0},
      {"year": "2022", "revenue_growth": -20.0, "net_income_growth": -2.0, "debt_growth": -25.0, "cash_flow": -0.2, "roe": -35.0, "order_book": 0.8},
      {"year": "2023", "revenue_growth": -18.0, "net_income_growth": -3.0, "debt_growth": -15.0, "cash_flow": -0.1, "roe": -28.0, "order_book": 0.5},
      {"year": "2024", "revenue_growth": -10.0, "net_income_growth": 1.0, "debt_growth": -10.0, "cash_flow": 0.0, "roe": -12.0, "order_book": 0.3}
    ],
    "crisis_info": {
      "crisis_title": "Retail Apocalypse and Bankruptcy from E-commerce Disruption",
      "condition_summary": "Sears failed to invest in digital retail capabilities while Amazon and Walmart destroyed its core value proposition.",
      "condition_keywords": ["retail bankruptcy", "e-commerce disruption", "store closures", "brand liquidation", "debt crisis"],
      "root_causes": ["Underinvestment in digital commerce", "Hedge fund ownership prioritized cash extraction", "Massive pension obligations", "Brand dilution"],
      "strategy_summary": "REIT spin-off, brand sales, Shop Your Way loyalty program, eventual Chapter 11 filing.",
      "outcome": "Filed bankruptcy 2018; surviving entity operates fewer than 20 stores."
    }
  },
  {
    "id": "uber",
    "name": "Uber Technologies",
    "ticker": "UBER",
    "sector": "Technology",
    "logo_color": "#1c1c1c",
    "market_cap": "$155B",
    "founded_year": 2009,
    "leadership": {
      "founder": "Travis Kalanick & Garrett Camp",
      "founder_summary": "Disrupted the global taxi industry by building a two-sided marketplace for on-demand ride-hailing.",
      "current_ceo": "Dara Khosrowshahi",
      "company_background": "Headquartered in San Francisco. Operates in 72 countries. Lost $31B cumulatively before turning profitable in 2023."
    },
    "executive_analysis_paragraph": "Uber's story is one of regulatory combat, cultural crisis, and eventual financial discipline. Under Travis Kalanick, Uber pursued a 'growth at all costs' strategy that accumulated $31B in cumulative losses. The 2017 cultural crisis (harassment scandals, Waymo IP theft lawsuit, regulatory bans across Europe) forced Kalanick's resignation. Under Dara Khosrowshahi, Uber implemented disciplined unit economics, exited unwinnable markets (China, Southeast Asia, Russia), and pivoted Uber Eats into a $60B+ revenue contributor. Uber turned its first full-year GAAP profit in 2023.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2017 - 2019",
        "title": "Cultural Crisis, CEO Exit, and IPO Disappointment",
        "move_data": "IPO priced at $45 (below $120B private valuation); stock fell 8% on day one; cumulative losses hit $8.5B in 2019.",
        "reason_behind_move": "Systemic workplace culture issues exposed by Susan Fowler's blog post, combined with Waymo IP lawsuit and regulatory bans across London, Germany, and Denmark.",
        "strategy_implemented": "CEO replacement with Dara Khosrowshahi, cultural reset program, settlement of Waymo suit for $245M in equity.",
        "outcome_paragraph": "New leadership stabilized regulatory relationships but investor confidence remained low post-IPO."
      },
      {
        "type": "Pump", "period": "2021 - 2023",
        "title": "Delivery Supercycle and Path to GAAP Profitability",
        "move_data": "Uber Eats gross bookings reached $55B; first full-year GAAP profit of $1.89B in 2023; stock rose 150% in 2023.",
        "reason_behind_move": "Post-pandemic return of ride-hailing combined with lock-in of delivery habit formed during COVID. Driver supply recovery drove take-rate expansion.",
        "strategy_implemented": "Exited non-core markets (ATG self-driving unit sold to Aurora, Uber Elevate sold to Joby), reduced operating costs by $1B+, expanded Uber One membership.",
        "outcome_paragraph": "Achieved free cash flow positive status for first time in company history, validating the two-sided marketplace model at scale."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 26.0, "net_income_growth": -42.0, "debt_growth": 35.0, "cash_flow": -4.3, "roe": -55.0, "order_book": 65.0},
      {"year": "2020", "revenue_growth": -14.3, "net_income_growth": -40.0, "debt_growth": 18.0, "cash_flow": -2.1, "roe": -62.0, "order_book": 58.0},
      {"year": "2021", "revenue_growth": 56.7, "net_income_growth": 18.0, "debt_growth": 8.0, "cash_flow": -0.5, "roe": -45.0, "order_book": 90.4},
      {"year": "2022", "revenue_growth": 82.6, "net_income_growth": -62.0, "debt_growth": -2.0, "cash_flow": 0.7, "roe": -28.0, "order_book": 115.4},
      {"year": "2023", "revenue_growth": 17.1, "net_income_growth": 400.0, "debt_growth": -8.0, "cash_flow": 3.4, "roe": 14.2, "order_book": 137.0},
      {"year": "2024", "revenue_growth": 15.0, "net_income_growth": 22.0, "debt_growth": -5.0, "cash_flow": 4.8, "roe": 18.1, "order_book": 158.0}
    ],
    "crisis_info": {
      "crisis_title": "Cultural Crisis, Regulatory Bans, and Path to Profitability",
      "condition_summary": "Uber suffered cultural implosion under Kalanick, forcing CEO replacement before achieving profitability under disciplined leadership.",
      "condition_keywords": ["cultural crisis", "CEO exit", "regulatory bans", "IPO disappointment", "unit economics", "delivery pivot"],
      "root_causes": ["Growth at all costs culture", "Regulatory non-compliance strategy", "Underinvestment in workplace culture"],
      "strategy_summary": "CEO replacement, market exit discipline, delivery expansion, GAAP profitability achieved 2023.",
      "outcome": "First full-year GAAP profit in 2023; market cap exceeded $150B."
    }
  },
  {
    "id": "wework",
    "name": "WeWork",
    "ticker": "WE",
    "sector": "Real Estate",
    "logo_color": "#000000",
    "market_cap": "$0.05B",
    "founded_year": 2010,
    "leadership": {
      "founder": "Adam Neumann",
      "founder_summary": "Pioneered the coworking space concept with a 'community company' narrative that attracted $47B in SoftBank investment.",
      "current_ceo": "David Tolley (post-bankruptcy)",
      "company_background": "Headquartered in New York. Once valued at $47B; filed Chapter 11 bankruptcy in November 2023."
    },
    "executive_analysis_paragraph": "WeWork's collapse is the defining cautionary tale of startup overvaluation in the 2010s. SoftBank's Vision Fund injected $18.5B into WeWork, inflating its valuation to $47B — making it the most valuable US startup at the time. The S-1 filing in 2019 revealed massive losses ($1.9B on $1.8B revenue), self-dealing by CEO Adam Neumann (who had leased his own buildings back to WeWork), and governance failures. The IPO was pulled, Neumann received a $1.7B exit package, and the company filed for bankruptcy in 2023 with $18.65B in lease obligations it could not service.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2019",
        "title": "Failed IPO and CEO Removal",
        "move_data": "Valuation collapsed from $47B to $8B in 6 weeks; IPO withdrawn; 2,400 employees laid off immediately.",
        "reason_behind_move": "S-1 filing exposed $1.9B net loss, self-dealing transactions, and unsustainable lease obligations. Public market investors rejected the 'community company' narrative.",
        "strategy_implemented": "Neumann removed, SoftBank injected $9.5B rescue package, aggressive cost reduction and sublease renegotiations.",
        "outcome_paragraph": "SoftBank took effective control with 80% ownership stake; company survived but became a zombie business."
      },
      {
        "type": "Downfall", "period": "2023",
        "title": "Chapter 11 Bankruptcy Filing",
        "move_data": "Filed Chapter 11 with $18.65B lease liabilities; stock dropped to $0.84 from $14 post-SPAC listing.",
        "reason_behind_move": "Remote work adoption post-COVID permanently reduced corporate office demand, while WeWork's fixed long-term lease obligations became unserviceable.",
        "strategy_implemented": "Rejected hundreds of lease contracts via bankruptcy proceedings, reducing real estate footprint by 60%.",
        "outcome_paragraph": "Emerged from bankruptcy with ~300 locations globally versus 600+ pre-bankruptcy. Restructured with $450M in new financing."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 101.0, "net_income_growth": -82.0, "debt_growth": 245.0, "cash_flow": -3.5, "roe": -320.0, "order_book": 3.5},
      {"year": "2020", "revenue_growth": -16.4, "net_income_growth": -20.0, "debt_growth": 18.0, "cash_flow": -3.2, "roe": -280.0, "order_book": 3.2},
      {"year": "2021", "revenue_growth": 3.5, "net_income_growth": 12.0, "debt_growth": 5.0, "cash_flow": -2.4, "roe": -180.0, "order_book": 3.3},
      {"year": "2022", "revenue_growth": 29.0, "net_income_growth": 18.0, "debt_growth": -4.0, "cash_flow": -1.5, "roe": -95.0, "order_book": 3.9},
      {"year": "2023", "revenue_growth": -12.0, "net_income_growth": -45.0, "debt_growth": -65.0, "cash_flow": -0.8, "roe": -200.0, "order_book": 3.2},
      {"year": "2024", "revenue_growth": -25.0, "net_income_growth": 30.0, "debt_growth": -70.0, "cash_flow": -0.2, "roe": -45.0, "order_book": 2.4}
    ],
    "crisis_info": {
      "crisis_title": "IPO Collapse, Governance Scandal, and Chapter 11 Bankruptcy",
      "condition_summary": "WeWork's $47B valuation imploded when its S-1 revealed massive losses, self-dealing, and an unworkable business model.",
      "condition_keywords": ["startup overvaluation", "governance failure", "IPO collapse", "remote work", "lease obligations", "bankruptcy"],
      "root_causes": ["Self-dealing by founder", "Overexpansion via long-term fixed leases", "COVID remote work structural demand shift"],
      "strategy_summary": "CEO removal, SoftBank rescue, SPAC listing, eventual Chapter 11 bankruptcy, lease rejection, restructuring.",
      "outcome": "Emerged from bankruptcy 2024 with 300 locations; valuation under $100M."
    }
  },
  {
    "id": "peloton",
    "name": "Peloton Interactive",
    "ticker": "PTON",
    "sector": "Consumer Goods",
    "logo_color": "#e11d48",
    "market_cap": "$1.2B",
    "founded_year": 2012,
    "leadership": {
      "founder": "John Foley",
      "founder_summary": "Built connected fitness hardware subscription model, selling the treadmill and bike as a software-enabled service.",
      "current_ceo": "Chris Donahoe",
      "company_background": "Headquartered in New York. Peak valuation of $50B during COVID; lost 97% of market cap by 2023."
    },
    "executive_analysis_paragraph": "Peloton's collapse is a textbook demand forecasting failure. During COVID lockdowns, demand for home fitness equipment surged beyond all projections. Peloton responded by committing $400M to build its own manufacturing facility just as pandemic demand was peaking. When gyms reopened in 2021, demand collapsed faster than any analyst projected — leaving Peloton with 150,000 bikes in unsold inventory. The company was forced to halt production, take a $1.2B inventory write-down, and eventually outsource all manufacturing, abandoning the factory it had just committed to build.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2021",
        "title": "COVID Fitness Supercycle",
        "move_data": "Revenue grew 99% to $4B; subscriber base grew 134% to 2.33M; stock peaked at $171 (from $29 pre-COVID).",
        "reason_behind_move": "Global gym closures forced consumers into premium home fitness. Peloton was the category leader with the highest brand recognition.",
        "strategy_implemented": "Acquired Precor manufacturing for $420M, committed $400M to Ohio factory, aggressively hired 6,000 employees.",
        "outcome_paragraph": "Massive operational scaling locked in fixed cost base precisely as pandemic demand was at its peak."
      },
      {
        "type": "Downfall", "period": "2021 - 2023",
        "title": "Post-COVID Demand Collapse and Inventory Crisis",
        "move_data": "Revenue fell 30%; 150,000 bikes stuck in inventory; stock fell from $171 to $8; $1.2B inventory write-down; CEO resigned.",
        "reason_behind_move": "Gym reopening and consumer return to outdoor exercise eliminated pandemic-era demand overnight. Treadmill recall due to safety deaths cost $165M and reputational damage.",
        "strategy_implemented": "CEO replaced, factory plans abandoned, manufacturing outsourced to Rexon, launched equipment rental model, cut 4,800 jobs.",
        "outcome_paragraph": "Outsourcing decision stabilized gross margins above 40% and reduced cash burn below $150M per quarter by 2024."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 109.0, "net_income_growth": -40.0, "debt_growth": 12.0, "cash_flow": -0.3, "roe": -32.0, "order_book": 0.9},
      {"year": "2020", "revenue_growth": 99.6, "net_income_growth": -35.0, "debt_growth": 25.0, "cash_flow": -0.1, "roe": -35.0, "order_book": 1.8},
      {"year": "2021", "revenue_growth": 19.8, "net_income_growth": -180.0, "debt_growth": 42.0, "cash_flow": -1.2, "roe": -75.0, "order_book": 4.0},
      {"year": "2022", "revenue_growth": -28.6, "net_income_growth": -62.0, "debt_growth": 8.0, "cash_flow": -2.8, "roe": -195.0, "order_book": 3.8},
      {"year": "2023", "revenue_growth": -22.4, "net_income_growth": 28.0, "debt_growth": -12.0, "cash_flow": -0.6, "roe": -88.0, "order_book": 2.8},
      {"year": "2024", "revenue_growth": -5.0, "net_income_growth": 35.0, "debt_growth": -8.0, "cash_flow": -0.1, "roe": -25.0, "order_book": 2.7}
    ],
    "crisis_info": {
      "crisis_title": "Post-COVID Demand Collapse and Catastrophic Demand Forecasting Failure",
      "condition_summary": "Peloton over-invested in manufacturing at peak pandemic demand, then suffered catastrophic inventory crisis when gyms reopened.",
      "condition_keywords": ["demand forecasting failure", "inventory crisis", "post-covid collapse", "manufacturing overcommitment", "CEO resignation"],
      "root_causes": ["Mis-timed $400M factory commitment at demand peak", "Treadmill safety recall", "Gym reopening structural demand reversal"],
      "strategy_summary": "CEO replacement, factory abandonment, manufacturing outsourcing, equipment rental model launch.",
      "outcome": "Stabilized at $1.2B market cap; cash burn reduced; profitability pathway established."
    }
  },
  {
    "id": "zoom",
    "name": "Zoom Video Communications",
    "ticker": "ZM",
    "sector": "Technology",
    "logo_color": "#2D8CFF",
    "market_cap": "$17B",
    "founded_year": 2011,
    "leadership": {
      "founder": "Eric Yuan",
      "founder_summary": "Former Cisco WebEx engineer who built a simpler, more reliable video conferencing product.",
      "current_ceo": "Eric Yuan",
      "company_background": "Headquartered in San Jose, CA. Revenue grew 326% in 2021; market cap peaked at $159B; now trades at 90% below peak."
    },
    "executive_analysis_paragraph": "Zoom became the defining communication tool of the COVID-19 pandemic. Daily meeting participants grew from 10M to 300M in 90 days. Revenue grew 326% in FY2021. But this explosive growth masked a fundamental problem: Zoom's use case was largely a free-tier commodity for consumers, while enterprise competition from Microsoft Teams (bundled with Office 365) and Google Meet (bundled with Workspace) made paid conversion extremely difficult. As pandemic demand normalized, Zoom's stock fell 90% from its peak despite the company remaining solidly profitable with 20%+ free cash flow margins.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2021",
        "title": "COVID Communication Infrastructure Supercycle",
        "move_data": "Daily meeting participants: 10M to 300M; Revenue grew 326% to $4B; Stock reached $588 peak; Added to NASDAQ-100.",
        "reason_behind_move": "Global remote work mandates made Zoom the default synchronous communication layer for every organization worldwide overnight.",
        "strategy_implemented": "Launched Zoom Phone, Zoom Rooms, and Zoom Events to expand TAM beyond video meetings into UCaaS.",
        "outcome_paragraph": "Achieved $4B revenue and $1.4B free cash flow in FY2021 while remaining one of the few profitable high-growth SaaS companies."
      },
      {
        "type": "Downfall", "period": "2022 - 2023",
        "title": "Microsoft Teams Bundling War and Post-COVID Normalization",
        "move_data": "Stock fell from $588 to $60 (-90%); Revenue growth decelerated from 326% to 3%; Enterprise churn increased.",
        "reason_behind_move": "Microsoft Teams reached 300M daily active users, bundled free in every Office 365 subscription — eliminating Zoom's paid conversion in SMB and mid-market.",
        "strategy_implemented": "Launched Zoom AI Companion (LLM-powered meeting summaries), acquired Five9 (failed $15B deal blocked by regulators), expanded into Zoom Contact Center.",
        "outcome_paragraph": "Despite stock decline, Zoom maintained 20%+ FCF margins and $7B+ cash pile, enabling aggressive share buybacks."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 88.4, "net_income_growth": 180.0, "debt_growth": 0.0, "cash_flow": 0.1, "roe": 8.2, "order_book": 0.6},
      {"year": "2020", "revenue_growth": 326.0, "net_income_growth": 750.0, "debt_growth": 0.0, "cash_flow": 1.4, "roe": 42.5, "order_book": 4.1},
      {"year": "2021", "revenue_growth": 54.9, "net_income_growth": 120.0, "debt_growth": 0.0, "cash_flow": 1.6, "roe": 28.4, "order_book": 4.4},
      {"year": "2022", "revenue_growth": 7.0, "net_income_growth": -35.0, "debt_growth": 0.0, "cash_flow": 1.5, "roe": 12.1, "order_book": 4.4},
      {"year": "2023", "revenue_growth": 3.1, "net_income_growth": 15.0, "debt_growth": 0.0, "cash_flow": 1.6, "roe": 13.5, "order_book": 4.7},
      {"year": "2024", "revenue_growth": 2.0, "net_income_growth": 8.0, "debt_growth": 0.0, "cash_flow": 1.8, "roe": 14.0, "order_book": 4.8}
    ],
    "crisis_info": {
      "crisis_title": "Post-COVID Normalization and Microsoft Teams Competitive Destruction",
      "condition_summary": "Zoom's 90% stock collapse despite profitability demonstrates that market re-rating can happen even without fundamental deterioration when a competitor bundles your product.",
      "condition_keywords": ["competition bundling", "Microsoft Teams", "post-covid normalization", "stock collapse", "revenue deceleration"],
      "root_causes": ["Microsoft Teams free bundling eliminated Zoom's SMB market", "Zoom's core product became commoditized"],
      "strategy_summary": "AI Companion launch, Contact Center expansion, share buybacks using $7B cash pile.",
      "outcome": "Profitable but re-rated to 17x FCF from 100x; AI product expansion ongoing."
    }
  },
  {
    "id": "boeing",
    "name": "Boeing",
    "ticker": "BA",
    "sector": "Manufacturing",
    "logo_color": "#1d4ed8",
    "market_cap": "$100B",
    "founded_year": 1916,
    "leadership": {
      "founder": "William Boeing",
      "founder_summary": "Pioneer of commercial aviation, building the planes that connected the world.",
      "current_ceo": "Kelly Ortberg",
      "company_background": "Headquartered in Arlington, VA. The world's largest aerospace company. Suffered two fatal 737 MAX crashes."
    },
    "executive_analysis_paragraph": "Boeing's crisis began with the MCAS software failure that caused two 737 MAX crashes killing 346 people. The fundamental cause was a cultural shift from engineering excellence to financial engineering — prioritizing stock buybacks ($43B from 2013-2019) over safety R&D. The 737 MAX was grounded for 20 months (March 2019 – November 2020), costing Boeing $20B+ in compensation and lost orders. The COVID pandemic then decimated commercial aviation demand. By 2020, Boeing had posted its largest-ever annual loss of $11.9B. The crisis exposed systemic quality control failures that would resurface again in 2024 with door panel blowouts on Alaska Airlines flights.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2019 - 2020",
        "title": "737 MAX Grounding and COVID Demand Collapse",
        "move_data": "Stock fell 60%; Revenue dropped from $76B to $58B; Annual loss of $11.9B in 2020; 737 MAX grounded for 20 months.",
        "reason_behind_move": "Two MCAS-related crashes (Lion Air 2018, Ethiopian 2019) killed 346 people. Grounding eliminated $32B in 737 MAX deliveries while COVID cancelled 1,000+ aircraft orders.",
        "strategy_implemented": "MCAS software redesign, $25B debt issuance to maintain liquidity, cancelled 787 Dreamliner production in Everett.",
        "outcome_paragraph": "737 MAX ungrounding in November 2020 began slow recovery of delivery pipeline, but reputational damage with airlines persisted."
      },
      {
        "type": "Downfall", "period": "2024",
        "title": "Alaska Airlines Door Plug Blowout and Production Freeze",
        "move_data": "737 MAX 9 fleet grounded again; FAA capped production at 38/month; stock fell 30% in 2024; $5.5B quarterly loss.",
        "reason_behind_move": "Quality control failures at Spirit AeroSystems supplier resulted in mis-installed door bolts. FAA audit found systemic process failures at Renton factory.",
        "strategy_implemented": "Acquired Spirit AeroSystems for $4.7B to bring manufacturing quality in-house, comprehensive safety audit program.",
        "outcome_paragraph": "Machinists union 8-week strike further disrupted production schedule; cash burn exceeded $1B per month."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": -24.0, "net_income_growth": -220.0, "debt_growth": 85.0, "cash_flow": -1.9, "roe": -280.0, "order_book": 472.0},
      {"year": "2020", "revenue_growth": -24.0, "net_income_growth": -48.0, "debt_growth": 42.0, "cash_flow": -18.4, "roe": -410.0, "order_book": 409.0},
      {"year": "2021", "revenue_growth": 7.1, "net_income_growth": 30.0, "debt_growth": -5.0, "cash_flow": -4.4, "roe": -185.0, "order_book": 397.0},
      {"year": "2022", "revenue_growth": 6.9, "net_income_growth": 15.0, "debt_growth": -8.0, "cash_flow": -5.0, "roe": -142.0, "order_book": 414.0},
      {"year": "2023", "revenue_growth": 16.8, "net_income_growth": 20.0, "debt_growth": -5.0, "cash_flow": -4.0, "roe": -105.0, "order_book": 441.0},
      {"year": "2024", "revenue_growth": -15.0, "net_income_growth": -60.0, "debt_growth": 25.0, "cash_flow": -8.0, "roe": -180.0, "order_book": 520.0}
    ],
    "crisis_info": {
      "crisis_title": "737 MAX Safety Crisis and Systemic Quality Control Failures",
      "condition_summary": "Boeing's prioritization of financial returns over engineering safety culture caused two fatal crashes, a 20-month grounding, and $20B+ in losses.",
      "condition_keywords": ["safety crisis", "737 MAX grounding", "quality control failure", "regulatory penalty", "manufacturing defects"],
      "root_causes": ["Financial engineering over safety R&D", "MCAS software design flaw", "Supply chain quality failures"],
      "strategy_summary": "MCAS redesign, Spirit AeroSystems acquisition, FAA compliance program, leadership replacement.",
      "outcome": "Ongoing recovery; production capped by FAA; cash burn continued into 2024."
    }
  },
  {
    "id": "twitter",
    "name": "Twitter / X Corp",
    "ticker": "X",
    "sector": "Technology",
    "logo_color": "#000000",
    "market_cap": "$19B",
    "founded_year": 2006,
    "leadership": {
      "founder": "Jack Dorsey, Noah Glass, Biz Stone, Ev Williams",
      "founder_summary": "Created the defining short-form public conversation platform of the internet era.",
      "current_ceo": "Linda Yaccarino",
      "company_background": "Acquired by Elon Musk for $44B in October 2022. Rebranded to X in 2023."
    },
    "executive_analysis_paragraph": "Elon Musk's $44B acquisition of Twitter — funded with $13B in debt at 10%+ interest — created an immediate $1.3B/year interest burden. Musk laid off 75% of Twitter's 7,500 employees (including most of the trust & safety team), reinstated banned accounts, and introduced $8/month Twitter Blue verification. Advertisers fled en masse, with advertising revenue falling 50% within 6 months. The platform was renamed X in July 2023 and a new revenue strategy focused on subscriptions and payments was announced. Current estimated value: $19B — less than half the acquisition price.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2022 - 2023",
        "title": "Musk Acquisition, Mass Layoffs, and Advertiser Exodus",
        "move_data": "Advertising revenue fell 50%; 5,500 employees laid off; estimated value fell from $44B to $19B within 12 months.",
        "reason_behind_move": "Musk's reinstatement of banned accounts and reduced content moderation triggered advertiser brand safety concerns. Apple and major brands paused advertising.",
        "strategy_implemented": "Twitter Blue subscription at $8/month, API monetization (shutting free tier), X Payments financial services pivot.",
        "outcome_paragraph": "Subscription revenue partially offset ad revenue decline but could not compensate for the scale of advertiser withdrawal."
      },
      {
        "type": "Rebound", "period": "2024",
        "title": "X Stabilization and AI Integration",
        "move_data": "Advertiser return partial; Grok AI chatbot launched; X Money financial service beta; xAI valued at $50B separately.",
        "reason_behind_move": "Political environment post-2024 US election shifted advertiser sentiment. Musk's political influence increased brand appeal in certain segments.",
        "strategy_implemented": "Integrated Grok LLM into X Premium, launched X TV, expanded creator monetization program.",
        "outcome_paragraph": "Platform stabilized at ~250M daily active users; unclear path to $44B valuation recovery."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 14.0, "net_income_growth": -8.0, "debt_growth": 0.0, "cash_flow": 1.1, "roe": 5.2, "order_book": 3.5},
      {"year": "2020", "revenue_growth": 7.4, "net_income_growth": -225.0, "debt_growth": 0.0, "cash_flow": 0.6, "roe": -3.1, "order_book": 3.7},
      {"year": "2021", "revenue_growth": 37.0, "net_income_growth": 145.0, "debt_growth": 0.0, "cash_flow": 0.6, "roe": 6.8, "order_book": 5.1},
      {"year": "2022", "revenue_growth": -4.5, "net_income_growth": -320.0, "debt_growth": 180.0, "cash_flow": -0.2, "roe": -35.0, "order_book": 4.4},
      {"year": "2023", "revenue_growth": -30.0, "net_income_growth": -28.0, "debt_growth": -5.0, "cash_flow": -0.5, "roe": -48.0, "order_book": 3.0},
      {"year": "2024", "revenue_growth": 5.0, "net_income_growth": 12.0, "debt_growth": -8.0, "cash_flow": 0.2, "roe": -30.0, "order_book": 3.2}
    ],
    "crisis_info": {
      "crisis_title": "Leveraged Buyout, Mass Layoffs, and Advertiser Exodus",
      "condition_summary": "Musk's $44B Twitter acquisition at 10%+ debt interest created immediate financial stress amplified by 50% advertiser revenue collapse.",
      "condition_keywords": ["leveraged buyout", "advertiser exodus", "mass layoffs", "content moderation failure", "brand safety"],
      "root_causes": ["$13B debt at 10%+ interest", "Advertiser brand safety concerns from reduced moderation", "75% workforce reduction damaged product quality"],
      "strategy_summary": "Subscription model, API monetization, X Payments pivot, AI chatbot integration.",
      "outcome": "Platform valued at $19B vs $44B acquisition price; subscription growth partially offsetting ad revenue decline."
    }
  },
  {
    "id": "snapchat",
    "name": "Snap Inc.",
    "ticker": "SNAP",
    "sector": "Technology",
    "logo_color": "#FFFC00",
    "market_cap": "$17B",
    "founded_year": 2011,
    "leadership": {
      "founder": "Evan Spiegel & Bobby Murphy",
      "founder_summary": "Pioneered disappearing content and Stories format, later copied by Instagram, Facebook, and TikTok.",
      "current_ceo": "Evan Spiegel",
      "company_background": "Headquartered in Santa Monica, CA. Peaked at $130B market cap in 2021; currently trades 87% below peak."
    },
    "executive_analysis_paragraph": "Snap's crisis is a story of platform dependency and advertising market concentration. When Apple's iOS 14.5 App Tracking Transparency (ATT) update launched in April 2021, it eliminated Snap's ability to target ads based on cross-app behavioral data — the foundation of its $4B advertising business. Snap was more exposed than competitors because it lacked the first-party data ecosystem of Facebook or Google. Additionally, TikTok's algorithmic short-form video captured Snap's core Gen Z demographic. Revenue growth collapsed from 116% to 6% within 18 months, triggering 20% workforce cuts and a strategic pivot to Snap+ subscription.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2021",
        "title": "COVID Social Media Supercycle and AR Advertising Growth",
        "move_data": "Revenue grew 116% to $4.1B; DAUs reached 347M; Stock peaked at $83; raised $1B+ in equity offerings.",
        "reason_behind_move": "COVID lockdowns increased social media engagement. Snap's AR Lenses became a core feature for brand advertisers. Spotlight (short video) launched to compete with TikTok.",
        "strategy_implemented": "Doubled R&D investment in AR hardware (Spectacles), launched Spotlight, expanded Map and Commerce features.",
        "outcome_paragraph": "Reached 347M daily active users and established AR advertising as a premium brand marketing channel."
      },
      {
        "type": "Downfall", "period": "2021 - 2023",
        "title": "Apple ATT Privacy Update Destroys Ad Targeting",
        "move_data": "Stock fell from $83 to $8 (-90%); Q3 2022 revenue growth fell to 6%; Laid off 20% of workforce (1,300 employees).",
        "reason_behind_move": "iOS 14.5 ATT eliminated cross-app tracking. Snap's IDFA-dependent ad model was more exposed than Facebook due to lack of first-party data. Macro ad market contraction compounded the impact.",
        "strategy_implemented": "Launched Snap+ subscription ($3.99/month), rebuilt ad measurement on first-party signals, launched Snapchat+ AI chatbot, expanded Snap Map monetization.",
        "outcome_paragraph": "Snap+ reached 11M subscribers by 2024, demonstrating subscription viability but insufficient to replace ad revenue shortfall."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 45.0, "net_income_growth": 28.0, "debt_growth": 0.0, "cash_flow": -0.3, "roe": -42.0, "order_book": 1.7},
      {"year": "2020", "revenue_growth": 51.6, "net_income_growth": 18.0, "debt_growth": 0.0, "cash_flow": 0.1, "roe": -35.0, "order_book": 2.5},
      {"year": "2021", "revenue_growth": 116.6, "net_income_growth": 22.0, "debt_growth": 12.0, "cash_flow": 0.5, "roe": -25.0, "order_book": 4.1},
      {"year": "2022", "revenue_growth": 12.2, "net_income_growth": -48.0, "debt_growth": 8.0, "cash_flow": -0.4, "roe": -68.0, "order_book": 4.6},
      {"year": "2023", "revenue_growth": 16.4, "net_income_growth": 25.0, "debt_growth": -2.0, "cash_flow": 0.2, "roe": -42.0, "order_book": 4.6},
      {"year": "2024", "revenue_growth": 14.0, "net_income_growth": 18.0, "debt_growth": -5.0, "cash_flow": 0.4, "roe": -28.0, "order_book": 5.3}
    ],
    "crisis_info": {
      "crisis_title": "Apple ATT Privacy Update Destroys Ad Targeting Infrastructure",
      "condition_summary": "iOS 14.5 App Tracking Transparency eliminated Snap's IDFA-dependent ad model, collapsing revenue growth from 116% to 6%.",
      "condition_keywords": ["Apple ATT", "iOS privacy", "ad targeting collapse", "TikTok competition", "subscription pivot"],
      "root_causes": ["IDFA dependency with no first-party data fallback", "TikTok capturing Gen Z engagement", "Macro advertising downturn"],
      "strategy_summary": "Snap+ subscription launch, first-party signal ad rebuild, AR hardware investment, AI chatbot integration.",
      "outcome": "Stabilized revenue growth at 14%; Snap+ at 11M subscribers; stock 87% below peak."
    }
  },
  {
    "id": "alibaba",
    "name": "Alibaba Group",
    "ticker": "BABA",
    "sector": "Technology",
    "logo_color": "#FF6900",
    "market_cap": "$220B",
    "founded_year": 1999,
    "leadership": {
      "founder": "Jack Ma",
      "founder_summary": "Built China's dominant e-commerce and cloud computing ecosystem; founder exile became a cautionary tale of regulatory risk.",
      "current_ceo": "Eddie Wu",
      "company_background": "Headquartered in Hangzhou, China. Peak market cap of $850B; lost $630B in value during regulatory crackdown."
    },
    "executive_analysis_paragraph": "Alibaba's crisis was triggered by Jack Ma's October 2020 speech criticizing Chinese financial regulators, which led to the last-minute cancellation of Ant Group's $37B IPO (the largest in history) and a $2.8B antitrust fine in 2021. The Chinese government's 'Common Prosperity' campaign then subjected all Chinese tech giants to systemic regulatory tightening. Alibaba's stock fell from $310 to $58, wiping out $630B in market cap. Jack Ma retreated from public life. The company restructured into six independent business units in 2023, attempting to unlock shareholder value through potential spin-offs.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2020 - 2022",
        "title": "Ant Group IPO Cancellation and CCP Regulatory Crackdown",
        "move_data": "Stock fell from $310 to $70 (-77%); $2.8B antitrust fine imposed; Ant Group IPO ($37B) cancelled 48 hours before listing.",
        "reason_behind_move": "Jack Ma's public criticism of regulators triggered government retaliation. Broader 'Common Prosperity' campaign expanded to all platform companies.",
        "strategy_implemented": "Jack Ma retreated internationally; Alibaba paid antitrust fine, restructured compliance; Daniel Zhang replaced Ma as chairman.",
        "outcome_paragraph": "Regulatory uncertainty caused sustained multiple compression even as operating fundamentals remained strong."
      },
      {
        "type": "Rebound", "period": "2023 - 2024",
        "title": "Six-Division Restructuring and AI Cloud Growth",
        "move_data": "Split into 6 independent units; Cloud division grew 7% with AI product suite; $25B share buyback authorized.",
        "reason_behind_move": "Regulatory environment stabilized post-crackdown. AI cloud demand created new growth vector via Alibaba Cloud's Qwen LLM models.",
        "strategy_implemented": "Considered IPOs of Cainiao, Cloud division; invested $1B+ in Qwen AI model development; expanded international commerce (AliExpress, Lazada, Trendyol).",
        "outcome_paragraph": "International commerce segment grew 45% YoY while domestic market stabilized; restructuring narrative improved investor sentiment."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 51.0, "net_income_growth": -52.0, "debt_growth": 12.0, "cash_flow": 18.2, "roe": 18.4, "order_book": 56.2},
      {"year": "2020", "revenue_growth": 35.3, "net_income_growth": 71.0, "debt_growth": 8.0, "cash_flow": 24.5, "roe": 21.2, "order_book": 72.0},
      {"year": "2021", "revenue_growth": 40.7, "net_income_growth": -56.0, "debt_growth": 18.0, "cash_flow": 20.4, "roe": 8.5, "order_book": 109.5},
      {"year": "2022", "revenue_growth": 18.9, "net_income_growth": -60.0, "debt_growth": 5.0, "cash_flow": 15.8, "roe": 4.2, "order_book": 131.4},
      {"year": "2023", "revenue_growth": 14.3, "net_income_growth": 72.0, "debt_growth": -5.0, "cash_flow": 18.1, "roe": 7.8, "order_book": 130.4},
      {"year": "2024", "revenue_growth": 8.0, "net_income_growth": 15.0, "debt_growth": -8.0, "cash_flow": 20.0, "roe": 9.2, "order_book": 140.0}
    ],
    "crisis_info": {
      "crisis_title": "CCP Regulatory Crackdown and Ant Group IPO Cancellation",
      "condition_summary": "Jack Ma's criticism of regulators triggered government retaliation, cancelling Alibaba's $37B IPO and wiping $630B in market cap.",
      "condition_keywords": ["regulatory crackdown", "Ant Group IPO", "CCP intervention", "common prosperity", "antitrust fine"],
      "root_causes": ["Founder public criticism of government regulators", "Monopolistic platform practices", "Systemic political risk in China tech"],
      "strategy_summary": "Antitrust settlement, six-division restructuring, Jack Ma retreat, AI cloud investment, $25B buyback.",
      "outcome": "Stock stabilized at 70% below peak; restructuring ongoing; AI cloud growth emerging."
    }
  },
  {
    "id": "meta",
    "name": "Meta Platforms",
    "ticker": "META",
    "sector": "Technology",
    "logo_color": "#0866FF",
    "market_cap": "$1.35T",
    "founded_year": 2004,
    "leadership": {
      "founder": "Mark Zuckerberg",
      "founder_summary": "Built the world's largest social network; bet the company on the metaverse before pivoting to AI efficiency.",
      "current_ceo": "Mark Zuckerberg",
      "company_background": "Headquartered in Menlo Park, CA. Lost $800B in market cap in 2022; recovered to $1.35T by 2024."
    },
    "executive_analysis_paragraph": "Meta's 2022 crisis was triggered by three simultaneous shocks: Apple's ATT update collapsed its ad targeting infrastructure; TikTok captured its core 18-25 demographic; and Zuckerberg's $47B metaverse bet in Reality Labs generated zero commercial revenue. The stock fell 76% — the largest absolute dollar loss in US stock market history ($700B+ in one year). Zuckerberg declared 2023 the 'Year of Efficiency', cutting 21,000 employees (25% of workforce) and refocusing on AI advertising. The turnaround was extraordinary: Meta's stock rose 194% in 2023 and continued climbing in 2024.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2022",
        "title": "Metaverse Bet, ATT Privacy Impact, and 76% Stock Collapse",
        "move_data": "Stock fell from $384 to $88 (-77%); Reality Labs lost $13.7B; 11,000 employees laid off in November 2022.",
        "reason_behind_move": "ATT eliminated $10B+ in annual ad revenue; TikTok captured 1B+ users; Reality Labs burned $13.7B with no commercial product.",
        "strategy_implemented": "Launched Year of Efficiency, halved hiring, cancelled low-priority projects, Reels algorithm deployed to compete with TikTok.",
        "outcome_paragraph": "Cost restructuring reduced operating expense growth from 22% to negative territory, dramatically expanding margins."
      },
      {
        "type": "Pump", "period": "2023 - 2024",
        "title": "Year of Efficiency and AI Advertising Supercycle",
        "move_data": "Stock rose 194% in 2023; Revenue grew 16% to $134B; Operating income margin expanded to 35%; Free cash flow hit $44B.",
        "reason_behind_move": "Llama open-source AI models attracted developer ecosystem; AI-driven ad targeting rebuilt on first-party signals; Reels drove engagement growth 24% YoY.",
        "strategy_implemented": "Deployed Meta AI across WhatsApp, Instagram, Facebook; launched Threads to compete with X; invested $37B in AI infrastructure capex.",
        "outcome_paragraph": "Became the most profitable social media company in history with $44B FCF while maintaining revenue growth trajectory."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 26.6, "net_income_growth": -16.0, "debt_growth": 0.0, "cash_flow": 21.2, "roe": 19.8, "order_book": 70.7},
      {"year": "2020", "revenue_growth": 21.6, "net_income_growth": 57.9, "debt_growth": 0.0, "cash_flow": 23.6, "roe": 22.2, "order_book": 85.9},
      {"year": "2021", "revenue_growth": 37.2, "net_income_growth": 34.6, "debt_growth": 0.0, "cash_flow": 39.1, "roe": 31.5, "order_book": 117.9},
      {"year": "2022", "revenue_growth": -1.1, "net_income_growth": -41.1, "debt_growth": 12.0, "cash_flow": 18.9, "roe": 18.6, "order_book": 116.6},
      {"year": "2023", "revenue_growth": 15.7, "net_income_growth": 69.1, "debt_growth": -5.0, "cash_flow": 43.0, "roe": 28.1, "order_book": 134.9},
      {"year": "2024", "revenue_growth": 19.0, "net_income_growth": 52.0, "debt_growth": 8.0, "cash_flow": 52.0, "roe": 38.0, "order_book": 160.0}
    ],
    "crisis_info": {
      "crisis_title": "Metaverse Overinvestment and ATT Privacy Shock",
      "condition_summary": "Meta lost $700B+ in market cap in 2022 due to metaverse losses, ATT impact, and TikTok competition — then engineered one of history's greatest corporate turnarounds.",
      "condition_keywords": ["metaverse failure", "Apple ATT", "TikTok competition", "Year of Efficiency", "AI advertising"],
      "root_causes": ["$47B Reality Labs bet with no revenue", "ATT eliminated $10B ad revenue", "TikTok Gen Z migration"],
      "strategy_summary": "Year of Efficiency, 21,000 layoffs, Llama AI, Reels, first-party ad signal rebuild.",
      "outcome": "194% stock recovery in 2023; $44B FCF; metaverse investment continued at reduced scale."
    }
  },
  {
    "id": "disney",
    "name": "Walt Disney Company",
    "ticker": "DIS",
    "sector": "Media",
    "logo_color": "#1a1a2e",
    "market_cap": "$190B",
    "founded_year": 1923,
    "leadership": {
      "founder": "Walt Disney",
      "founder_summary": "Created the modern entertainment conglomerate, pioneering animated film, theme parks, and merchandise licensing.",
      "current_ceo": "Bob Iger",
      "company_background": "Headquartered in Burbank, CA. Owns Disney+, ESPN, ABC, Pixar, Marvel, Lucasfilm, and 12 theme parks globally."
    },
    "executive_analysis_paragraph": "Disney's crisis was dual-layered: COVID obliterated theme park and theatrical revenue simultaneously (both segments closed for 12-18 months), while Disney+ streaming launched profitably on paper but burned $4B/year in content spend chasing Netflix. Under Bob Chapek, Disney+ subscriber growth slowed dramatically in 2022 — triggering the board to fire Chapek and rehire Bob Iger in a remarkable reversal. Iger's return strategy focused on streaming profitability over growth, licensing ESPN to Amazon, and rightsizing content spend. Disney+ achieved its first profitable quarter in Q4 2024.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2020 - 2021",
        "title": "COVID Theme Park and Theater Shutdowns",
        "move_data": "Revenue fell from $69.6B to $65.4B; Parks revenue fell 37%; Net loss of $2.8B in 2020; Dividend suspended for first time since 1939.",
        "reason_behind_move": "COVID forced closure of all 12 theme parks globally for 12+ months and shuttered theatrical film releases.",
        "strategy_implemented": "Accelerated Disney+ streaming launch, Premier Access premium movie releases ($30 per title), park capacity management technology.",
        "outcome_paragraph": "Disney+ reached 130M subscribers in 18 months — the fastest streaming launch in history, masking underlying financial stress."
      },
      {
        "type": "Downfall", "period": "2022 - 2023",
        "title": "Streaming Losses, Subscriber Slowdown, and CEO Crisis",
        "move_data": "Disney+ lost $4B in FY2022; Subscriber growth missed guidance by 30%; Stock fell 44%; Chapek fired, Iger rehired.",
        "reason_behind_move": "Content spend reached $27B/year without proportional subscriber growth. Streaming market saturation and password sharing crackdown fears.",
        "strategy_implemented": "Iger implemented $5.5B cost reduction, eliminated 7,000 positions, launched ad-supported Disney+ tier, announced ESPN standalone streaming app.",
        "outcome_paragraph": "Streaming segment turned profitable in Q4 2024 — 2 years ahead of original guidance under Chapek's plan."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 17.0, "net_income_growth": -23.0, "debt_growth": 120.0, "cash_flow": 5.9, "roe": 12.1, "order_book": 69.6},
      {"year": "2020", "revenue_growth": -6.0, "net_income_growth": -108.0, "debt_growth": 25.0, "cash_flow": -2.5, "roe": -1.8, "order_book": 65.4},
      {"year": "2021", "revenue_growth": 3.1, "net_income_growth": 135.0, "debt_growth": -8.0, "cash_flow": 1.8, "roe": 4.2, "order_book": 67.4},
      {"year": "2022", "revenue_growth": 22.7, "net_income_growth": -48.0, "debt_growth": -5.0, "cash_flow": 1.2, "roe": 3.1, "order_book": 82.7},
      {"year": "2023", "revenue_growth": 6.7, "net_income_growth": 1000.0, "debt_growth": -8.0, "cash_flow": 4.9, "roe": 7.4, "order_book": 88.9},
      {"year": "2024", "revenue_growth": 3.0, "net_income_growth": 30.0, "debt_growth": -5.0, "cash_flow": 6.2, "roe": 8.5, "order_book": 91.4}
    ],
    "crisis_info": {
      "crisis_title": "COVID Theme Park Shutdown and Streaming Profitability Crisis",
      "condition_summary": "Disney's dual crisis of COVID park closures and Disney+ $4B annual losses forced CEO replacement and a strategic reset.",
      "condition_keywords": ["COVID shutdown", "streaming losses", "CEO crisis", "content spend", "parks recovery"],
      "root_causes": ["Theme parks closed 12-18 months", "Disney+ content spend $27B/year exceeded subscriber revenue", "Chapek's growth-over-profit strategy"],
      "strategy_summary": "Iger return, $5.5B cost reduction, streaming profitability focus, ESPN streaming pivot, park price increases.",
      "outcome": "Streaming profitable Q4 2024; parks recovered to record revenue; stock stabilized 40% below 2021 peak."
    }
  },
  {
    "id": "general_electric",
    "name": "General Electric",
    "ticker": "GE",
    "sector": "Manufacturing",
    "logo_color": "#0066B2",
    "market_cap": "$180B",
    "founded_year": 1892,
    "leadership": {
      "founder": "Thomas Edison, Charles Coffin",
      "founder_summary": "Pioneered electric power infrastructure and built one of history's most diversified industrial conglomerates.",
      "current_ceo": "H. Lawrence Culp Jr.",
      "company_background": "Once the world's most valuable company. Broke up into three independent companies (GE Aerospace, GE Vernova, GE HealthCare) by 2024."
    },
    "executive_analysis_paragraph": "GE's collapse from a $600B conglomerate to near-bankruptcy in a decade is one of the most studied failures in corporate history. The root cause was GE Capital — the financial services division that grew to represent 40% of profits but carried $500B in assets with minimal capital buffers. During the 2008 financial crisis, GE Capital's commercial paper market froze, requiring a $3B emergency investment from Warren Buffett at 10% preferred rate. Jack Welch's earnings management strategy (using GE Capital to smooth industrial earnings) unraveled under Jeff Immelt, who spent $50B on ill-timed acquisitions (Alstom power, Baker Hughes oil) while the Power division was devastated by a natural gas turbine market collapse.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2017 - 2019",
        "title": "Power Division Collapse and $200B Value Destruction",
        "move_data": "Stock fell from $32 to $7 (-78%); Dividend cut to penny; $22B goodwill impairment charge; SEC investigation launched.",
        "reason_behind_move": "GE Power's gas turbine market collapsed as renewable energy disrupted fossil fuel power generation economics. Alstom acquisition added $12B in debt for a shrinking business.",
        "strategy_implemented": "Immelt replaced by Flannery, then Culp; sold GE Capital, GE Healthcare, NBCU, GE Transportation to reduce $100B+ debt pile.",
        "outcome_paragraph": "Asset liquidation reduced debt from $130B to $35B over 4 years while preserving core Aerospace and Healthcare businesses."
      },
      {
        "type": "Pump", "period": "2021 - 2024",
        "title": "Breakup into Three Pure-Play Companies",
        "move_data": "Announced breakup into GE Aerospace, GE Vernova (energy), GE HealthCare; Combined market cap exceeded $180B by 2024.",
        "reason_behind_move": "Pure-play companies attract specialized investors at higher multiples than diversified conglomerates. Aviation recovery post-COVID drove GE Aerospace engine demand.",
        "strategy_implemented": "Spun off GE HealthCare in January 2023; spun off GE Vernova in April 2024; remaining entity renamed GE Aerospace.",
        "outcome_paragraph": "GE Aerospace's LEAP engine backlog reached record $166B as airlines replaced aging fleets post-COVID."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": -22.0, "net_income_growth": 120.0, "debt_growth": -18.0, "cash_flow": -2.4, "roe": -8.5, "order_book": 95.2},
      {"year": "2020", "revenue_growth": -16.4, "net_income_growth": -78.0, "debt_growth": -12.0, "cash_flow": -1.2, "roe": -2.8, "order_book": 79.6},
      {"year": "2021", "revenue_growth": 0.5, "net_income_growth": 210.0, "debt_growth": -20.0, "cash_flow": 2.6, "roe": 3.1, "order_book": 74.2},
      {"year": "2022", "revenue_growth": 5.1, "net_income_growth": -28.0, "debt_growth": -15.0, "cash_flow": 4.5, "roe": -1.8, "order_book": 76.5},
      {"year": "2023", "revenue_growth": 17.2, "net_income_growth": 420.0, "debt_growth": -25.0, "cash_flow": 5.8, "roe": 25.4, "order_book": 84.5},
      {"year": "2024", "revenue_growth": 22.0, "net_income_growth": 40.0, "debt_growth": -30.0, "cash_flow": 8.2, "roe": 32.0, "order_book": 102.0}
    ],
    "crisis_info": {
      "crisis_title": "Conglomerate Over-Diversification and GE Capital Systemic Risk",
      "condition_summary": "GE's $500B financial services arm created systemic risk that nearly bankrupted an industrial giant during 2008, accelerated by Power division collapse.",
      "condition_keywords": ["conglomerate breakdown", "GE Capital risk", "acquisition overreach", "power market collapse", "breakup strategy"],
      "root_causes": ["GE Capital $500B assets with insufficient capital", "Ill-timed $50B acquisitions at peak prices", "Gas turbine market structural decline"],
      "strategy_summary": "Asset liquidation ($100B+ debt reduction), breakup into three pure-play companies, aviation recovery.",
      "outcome": "GE Aerospace, GE Vernova, GE HealthCare combined exceed $180B market cap vs single $90B entity pre-breakup."
    }
  },
  {
    "id": "theranos",
    "name": "Theranos",
    "ticker": "PRIVATE",
    "sector": "Healthcare",
    "logo_color": "#dc2626",
    "market_cap": "$0",
    "founded_year": 2003,
    "leadership": {
      "founder": "Elizabeth Holmes",
      "founder_summary": "Claimed to revolutionize blood testing with a single drop of blood; convicted of fraud in 2022.",
      "current_ceo": "Dissolved (2018)",
      "company_background": "Private company headquartered in Palo Alto. Peak valuation of $9B. Dissolved after SEC fraud charges."
    },
    "executive_analysis_paragraph": "Theranos represents the most catastrophic case of Silicon Valley 'fake it till you make it' culture applied to medical diagnostics with life-threatening consequences. Elizabeth Holmes raised $945M from blue-chip investors (Rupert Murdoch, Walgreens, Safeway) by claiming her Edison device could run 200+ tests from a single blood drop. The technology never worked. The company was running patient tests on commercially available Siemens machines while publicly claiming proprietary technology. When Wall Street Journal journalist John Carreyrou exposed the fraud in 2015, Theranos collapsed. Holmes was convicted on 4 counts of fraud in 2022 and sentenced to 11 years in prison.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2013 - 2015",
        "title": "Peak Valuation and Walgreens/Safeway Partnerships",
        "move_data": "Valued at $9B; deployed 40 wellness centres in Walgreens and Safeway stores; Holmes named youngest self-made female billionaire.",
        "reason_behind_move": "Holmes's narrative of democratizing healthcare resonated with investors and the media. Board of generals and former secretaries of state provided false legitimacy.",
        "strategy_implemented": "Secured partnerships by misrepresenting technology capabilities; used commercial Siemens analysers for actual tests while claiming proprietary Edison devices.",
        "outcome_paragraph": "Patient results were unreliable — some patients received false cancer diagnoses or missed actual disease detection."
      },
      {
        "type": "Downfall", "period": "2015 - 2018",
        "title": "WSJ Exposé, CMS Shutdown, and Dissolution",
        "move_data": "CMS revoked laboratory certification; $6B wiped from investor capital; Holmes and COO Balwani indicted for fraud.",
        "reason_behind_move": "Wall Street Journal investigation confirmed technology did not work. CMS (Centers for Medicare & Medicaid) audit found patient safety violations.",
        "strategy_implemented": "No viable recovery strategy existed — technology was fraudulent.",
        "outcome_paragraph": "Theranos voided 1.5M blood test results; Holmes convicted January 2022, sentenced to 11.25 years in federal prison."
      }
    ],
    "six_year_financials": [
      {"year": "2013", "revenue_growth": 100.0, "net_income_growth": -10.0, "debt_growth": 40.0, "cash_flow": -0.1, "roe": -25.0, "order_book": 0.1},
      {"year": "2014", "revenue_growth": 80.0, "net_income_growth": -15.0, "debt_growth": 35.0, "cash_flow": -0.2, "roe": -30.0, "order_book": 0.1},
      {"year": "2015", "revenue_growth": -40.0, "net_income_growth": -100.0, "debt_growth": 0.0, "cash_flow": -0.4, "roe": -100.0, "order_book": 0.0},
      {"year": "2016", "revenue_growth": -90.0, "net_income_growth": -50.0, "debt_growth": 0.0, "cash_flow": -0.2, "roe": -200.0, "order_book": 0.0},
      {"year": "2017", "revenue_growth": -100.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0},
      {"year": "2018", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0}
    ],
    "crisis_info": {
      "crisis_title": "Medical Diagnostic Fraud and Investor Deception",
      "condition_summary": "Theranos raised $945M by fraudulently claiming proprietary blood testing technology that never worked, resulting in patient harm and criminal conviction.",
      "condition_keywords": ["startup fraud", "medical fraud", "investor deception", "whistleblower", "criminal conviction"],
      "root_causes": ["Technology was never viable", "Fraudulent misrepresentation to investors and regulators", "Board governance failure"],
      "strategy_summary": "No recovery possible — criminal fraud with no underlying technology.",
      "outcome": "Company dissolved 2018; Holmes convicted 2022; $945M in investor capital total loss."
    }
  },
  {
    "id": "rivian",
    "name": "Rivian Automotive",
    "ticker": "RIVN",
    "sector": "Automobile",
    "logo_color": "#00A651",
    "market_cap": "$13B",
    "founded_year": 2009,
    "leadership": {
      "founder": "Robert Scaringe",
      "founder_summary": "Built an EV startup focused on adventure and commercial vehicles, securing Amazon as an anchor customer and investor.",
      "current_ceo": "Robert Scaringe",
      "company_background": "Headquartered in Irvine, CA. IPO at $78B valuation in 2021; dropped 90% to $8B by 2023."
    },
    "executive_analysis_paragraph": "Rivian's crisis was a production execution failure at industrial scale. The company IPO'd at the third-largest valuation in US history ($78B) before producing its 100th vehicle, on the promise of revolutionary R1T and R1S vehicles and a 100,000-unit Amazon delivery van contract. Production bottlenecks from supply chain complexity (every component was custom-designed), wiring harness failures, and labour inefficiency meant Rivian produced only 24,000 vehicles in 2022 against a target of 50,000. Cash burn reached $1.7B per quarter. The company raised prices (then reversed course), was forced to cut 6% of staff, and nearly lost the Amazon delivery contract before ramping production to 57,000 in 2023.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2021",
        "title": "Record IPO and $78B Valuation",
        "move_data": "IPO raised $13.7B at $78B valuation; highest EV market cap after Tesla; Amazon 100,000 delivery van contract secured.",
        "reason_behind_move": "EV market enthusiasm at peak; Amazon anchor customer contract provided credibility; R1T won Motor Trend Truck of the Year.",
        "strategy_implemented": "Raised capital to fund Normal, IL factory capacity expansion to 150,000 units/year.",
        "outcome_paragraph": "Record IPO capital provided 3-4 year cash runway but created unrealistic production expectations."
      },
      {
        "type": "Downfall", "period": "2022 - 2023",
        "title": "Production Bottleneck and 90% Valuation Collapse",
        "move_data": "Produced 24,337 units vs 50,000 target; cash burn $6.4B in 2022; stock fell from $179 to $12; 6% workforce cut.",
        "reason_behind_move": "Custom component over-engineering created supply chain complexity impossible to scale. Price increase backlash damaged brand among reservation holders.",
        "strategy_implemented": "Volkswagen $5B strategic partnership for EV software and manufacturing, simplified R2 platform designed for mass production, Georgia second plant cancelled.",
        "outcome_paragraph": "VW partnership secured survival capital and technology sharing while Rivian redesigned R2 on a cost-optimized shared platform."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 15.0, "cash_flow": -0.4, "roe": -35.0, "order_book": 0.0},
      {"year": "2020", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 25.0, "cash_flow": -1.0, "roe": -42.0, "order_book": 0.0},
      {"year": "2021", "revenue_growth": 100.0, "net_income_growth": -20.0, "debt_growth": 180.0, "cash_flow": -4.0, "roe": -35.0, "order_book": 0.1},
      {"year": "2022", "revenue_growth": 8100.0, "net_income_growth": -80.0, "debt_growth": 35.0, "cash_flow": -6.4, "roe": -158.0, "order_book": 1.7},
      {"year": "2023", "revenue_growth": 167.4, "net_income_growth": 30.0, "debt_growth": -8.0, "cash_flow": -4.2, "roe": -95.0, "order_book": 4.4},
      {"year": "2024", "revenue_growth": 15.0, "net_income_growth": 22.0, "debt_growth": -5.0, "cash_flow": -2.5, "roe": -55.0, "order_book": 5.2}
    ],
    "crisis_info": {
      "crisis_title": "EV Production Execution Failure and 90% Valuation Collapse",
      "condition_summary": "Rivian's over-engineered custom components created manufacturing complexity that made scaling production impossible at target costs.",
      "condition_keywords": ["production bottleneck", "EV startup", "manufacturing scale", "cash burn", "custom component complexity"],
      "root_causes": ["Over-engineered custom components", "Underestimated manufacturing complexity", "Capital-intensive pre-revenue IPO"],
      "strategy_summary": "Volkswagen $5B partnership, simplified R2 platform, second factory cancellation, production efficiency focus.",
      "outcome": "Production reached 57,000 in 2023; VW partnership secured technology and capital; cash burn declining."
    }
  },
  {
    "id": "svb",
    "name": "Silicon Valley Bank",
    "ticker": "SIVB",
    "sector": "Finance",
    "logo_color": "#004080",
    "market_cap": "$0",
    "founded_year": 1983,
    "leadership": {
      "founder": "Bill Biggerstaff & Robert Medearis",
      "founder_summary": "Founded specifically to serve the tech startup and venture capital ecosystem in Silicon Valley.",
      "current_ceo": "Seized by FDIC (March 2023)",
      "company_background": "Headquartered in Santa Clara, CA. Served 50% of US venture-backed startups. Collapsed in 48 hours in March 2023."
    },
    "executive_analysis_paragraph": "SVB's collapse was the second largest bank failure in US history, triggered by a classical bank run amplified by social media and mobile banking. SVB had invested $91B of customer deposits into long-duration mortgage-backed securities (MBS) at near-zero rates in 2020-2021. When the Fed raised rates 500bps in 12 months, these securities lost $15B+ in value. When SVB announced a $2.25B equity raise to cover losses, Peter Thiel's Founders Fund advised portfolio companies to withdraw deposits within hours. $42B was withdrawn in 24 hours via mobile apps — the first social-media-driven bank run in history. FDIC seized the bank the next morning.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2021",
        "title": "Zero Rate Environment and Venture Capital Supercycle",
        "move_data": "Deposits grew from $60B to $190B in 2 years; deployed $91B into long-duration MBS at 1.5-2% yields.",
        "reason_behind_move": "Zero interest rates caused VC investment boom; startup cash flooded into SVB deposits. SVB invested at artificially suppressed rates.",
        "strategy_implemented": "Deployed surplus deposits into long-duration treasury and MBS portfolios to earn spread above Fed funds rate.",
        "outcome_paragraph": "Duration mismatch created massive mark-to-market losses as rates rose."
      },
      {
        "type": "Downfall", "period": "2023",
        "title": "Fed Rate Rise, $15B MBS Loss, and 48-Hour Bank Run",
        "move_data": "FDIC seizure March 10, 2023; $42B withdrawn in 24 hours; $175B in deposits at risk; stock fell 100% in 2 trading days.",
        "reason_behind_move": "Fed's 500bps rate increase caused MBS portfolio to lose $15B in value. $2.25B equity raise announcement triggered Founders Fund withdrawal cascade.",
        "strategy_implemented": "FDIC guaranteed all deposits (above $250K insurance limit) within 72 hours to prevent systemic contagion; HSBC acquired UK subsidiary for £1.",
        "outcome_paragraph": "FDIC resolution prevented wider banking contagion; $175B in deposits made whole; assets sold to First Citizens BancShares."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 20.5, "net_income_growth": 31.0, "debt_growth": 18.0, "cash_flow": 1.4, "roe": 14.2, "order_book": 71.0},
      {"year": "2020", "revenue_growth": 22.0, "net_income_growth": 5.0, "debt_growth": 82.0, "cash_flow": 1.8, "roe": 11.1, "order_book": 115.5},
      {"year": "2021", "revenue_growth": 61.0, "net_income_growth": 52.0, "debt_growth": 65.0, "cash_flow": 4.2, "roe": 16.2, "order_book": 209.0},
      {"year": "2022", "revenue_growth": 12.0, "net_income_growth": -34.0, "debt_growth": -10.0, "cash_flow": 1.9, "roe": 11.2, "order_book": 212.0},
      {"year": "2023", "revenue_growth": -100.0, "net_income_growth": -100.0, "debt_growth": -100.0, "cash_flow": 0.0, "roe": -100.0, "order_book": 0.0},
      {"year": "2024", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0}
    ],
    "crisis_info": {
      "crisis_title": "First Social-Media-Driven Bank Run and FDIC Seizure",
      "condition_summary": "SVB's duration mismatch between short-term deposits and long-duration MBS combined with a social-media-amplified bank run caused the second largest bank failure in US history.",
      "condition_keywords": ["bank run", "duration mismatch", "interest rate risk", "FDIC seizure", "SVB collapse", "social media bank run"],
      "root_causes": ["$91B in long-duration MBS bought at zero-rate peak", "500bps rate rise created $15B mark-to-market loss", "Social media accelerated deposit withdrawal at unprecedented speed"],
      "strategy_summary": "No recovery; FDIC seizure, HSBC UK subsidiary acquisition, First Citizens BancShares asset purchase.",
      "outcome": "Bank dissolved; $175B deposits made whole by FDIC; First Citizens acquired assets at discount."
    }
  },
  {
    "id": "intel",
    "name": "Intel Corporation",
    "ticker": "INTC",
    "sector": "Technology",
    "logo_color": "#0068B5",
    "market_cap": "$90B",
    "founded_year": 1968,
    "leadership": {
      "founder": "Robert Noyce & Gordon Moore",
      "founder_summary": "Pioneered semiconductor manufacturing and established Moore's Law as the defining framework of the computing era.",
      "current_ceo": "Lip-Bu Tan",
      "company_background": "Headquartered in Santa Clara, CA. Lost semiconductor manufacturing leadership to TSMC; market cap fell 70% from peak."
    },
    "executive_analysis_paragraph": "Intel's crisis is the story of how the world's greatest semiconductor manufacturer lost its manufacturing advantage in a decade. Under Paul Otellini, Intel declined to manufacture the first iPhone chip (ceded to Samsung/TSMC). Under Brian Krzanich, Intel missed the 10nm transition deadline by 4 years — TSMC shipped 7nm products while Intel was stuck on 14nm++++. AMD (fabless, using TSMC) delivered faster chips at lower costs. Intel's data center CPU market share fell from 99% to 80%, and it missed the GPU/AI accelerator market entirely, ceding that to NVIDIA. CEO Pat Gelsinger launched an ambitious $150B foundry strategy (Intel Foundry Services) to reclaim manufacturing leadership — but was forced to resign in December 2024 as losses mounted.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Downfall", "period": "2020 - 2022",
        "title": "7nm Process Delay and AMD Market Share Erosion",
        "move_data": "7nm chip delayed to 2023; AMD Ryzen/EPYC captured 20%+ server market share; Apple switched to TSMC M1 chips; stock fell 42%.",
        "reason_behind_move": "Intel's internal manufacturing process repeatedly missed density targets, while TSMC's open-access model allowed Apple and AMD to leap ahead.",
        "strategy_implemented": "Hired Pat Gelsinger as CEO, announced $150B foundry investment program (US and European fabs), outsourced some products to TSMC.",
        "outcome_paragraph": "Foundry strategy required 5+ year investment horizon before revenue generation, increasing near-term cash burn."
      },
      {
        "type": "Downfall", "period": "2024",
        "title": "Foundry Losses and CEO Departure",
        "move_data": "Intel Foundry lost $7B in 2024; stock fell 60% — worst year for any S&P 500 component; Gelsinger resigned December 2024.",
        "reason_behind_move": "Foundry business required $150B capex but had minimal external customers. AI data center boom benefited NVIDIA and AMD, not Intel.",
        "strategy_implemented": "Board considering breakup of manufacturing (foundry) and product (CPU) divisions; TSMC and Qualcomm exploring acquisition options.",
        "outcome_paragraph": "Survival as an independent company uncertain; foundry strategy placed entire company at risk without external customer wins."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 2.0, "net_income_growth": 18.9, "debt_growth": 5.0, "cash_flow": 22.9, "roe": 27.6, "order_book": 72.0},
      {"year": "2020", "revenue_growth": 8.2, "net_income_growth": -1.0, "debt_growth": 12.0, "cash_flow": 21.1, "roe": 25.0, "order_book": 77.9},
      {"year": "2021", "revenue_growth": 1.5, "net_income_growth": -5.0, "debt_growth": 18.0, "cash_flow": 16.6, "roe": 24.4, "order_book": 79.0},
      {"year": "2022", "revenue_growth": -20.3, "net_income_growth": -65.3, "debt_growth": 8.0, "cash_flow": 4.2, "roe": 6.0, "order_book": 63.1},
      {"year": "2023", "revenue_growth": -14.2, "net_income_growth": -78.0, "debt_growth": 5.0, "cash_flow": -14.3, "roe": 1.5, "order_book": 54.2},
      {"year": "2024", "revenue_growth": -3.0, "net_income_growth": -200.0, "debt_growth": 12.0, "cash_flow": -10.0, "roe": -12.0, "order_book": 53.1}
    ],
    "crisis_info": {
      "crisis_title": "Manufacturing Process Node Failure and AI Era Irrelevance",
      "condition_summary": "Intel lost semiconductor manufacturing leadership by missing multiple process node transitions, ceding CPU and AI chip markets to TSMC-enabled AMD and NVIDIA.",
      "condition_keywords": ["process node delay", "manufacturing leadership loss", "AMD competition", "TSMC", "AI miss", "foundry losses"],
      "root_causes": ["7nm process delayed 4 years vs competitors", "Declined to manufacture Apple iPhone chips", "Missed GPU/AI accelerator market"],
      "strategy_summary": "$150B foundry strategy, CEO replacement, potential company breakup under consideration.",
      "outcome": "Existential crisis; CEO resigned 2024; foundry strategy survival in question."
    }
  },
  {
    "id": "softbank",
    "name": "SoftBank Group",
    "ticker": "SFTBY",
    "sector": "Finance",
    "logo_color": "#CC0000",
    "market_cap": "$85B",
    "founded_year": 1981,
    "leadership": {
      "founder": "Masayoshi Son",
      "founder_summary": "Built Japan's largest telecom and the world's largest private technology investment vehicle through the Vision Fund.",
      "current_ceo": "Masayoshi Son",
      "company_background": "Headquartered in Tokyo. Invested $100B+ in tech startups via Vision Fund; suffered $32B in annual losses in FY2022."
    },
    "executive_analysis_paragraph": "SoftBank's Vision Fund strategy was to invest hundreds of millions into startups to force category leadership through capital, regardless of unit economics. This worked brilliantly for Alibaba (200,000x return) but catastrophically for WeWork, Katerra, and 30+ other portfolio companies. When interest rates rose in 2022, tech valuations collapsed, triggering $40B+ in mark-to-market Vision Fund losses. Masa Son suspended new investments, implemented $50B asset sales, and returned to his original thesis — making a $10B investment in ARM Holdings as AI infrastructure plays dominated the market.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2021",
        "title": "Vision Fund 2 and Tech Valuation Peak",
        "move_data": "Vision Fund 1 delivered $57B unrealized gains; Launched Vision Fund 2 ($40B); portfolio companies went public at peak valuations.",
        "reason_behind_move": "Zero interest rate environment inflated growth tech valuations. SoftBank's spray-and-pray investment model generated paper returns.",
        "strategy_implemented": "Accelerated IPOs of Coupang, DoorDash, Grab via SPACs and direct listings to monetize paper gains.",
        "outcome_paragraph": "Peak portfolio value exceeded $300B across 400+ companies."
      },
      {
        "type": "Downfall", "period": "2022 - 2023",
        "title": "Rate Rise Wipes $40B+ in Vision Fund Value",
        "move_data": "FY2022 annual loss of $32B (largest in Japanese corporate history); Vision Fund 2 unrealized losses of $25B+; SoftBank credit downgraded.",
        "reason_behind_move": "Fed rate rises 500bps deflated all growth tech multiples. WeWork, Didi, Oyo, and 20+ portfolio companies wrote down to near zero.",
        "strategy_implemented": "Suspended new Vision Fund investments, sold $50B in assets (T-Mobile stake, Alibaba stake), launched ARM IPO in September 2023.",
        "outcome_paragraph": "ARM IPO raised $4.9B at $54B valuation; SoftBank retained 90% stake worth $49B+ post-IPO."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 18.2, "net_income_growth": -68.0, "debt_growth": 12.0, "cash_flow": 18.2, "roe": 5.4, "order_book": 56.1},
      {"year": "2020", "revenue_growth": -2.8, "net_income_growth": 850.0, "debt_growth": 5.0, "cash_flow": 24.8, "roe": 25.2, "order_book": 45.9},
      {"year": "2021", "revenue_growth": 12.1, "net_income_growth": 35.0, "debt_growth": -8.0, "cash_flow": 36.5, "roe": 28.4, "order_book": 60.9},
      {"year": "2022", "revenue_growth": -6.2, "net_income_growth": -550.0, "debt_growth": 5.0, "cash_flow": -4.2, "roe": -42.0, "order_book": 59.8},
      {"year": "2023", "revenue_growth": 2.1, "net_income_growth": 108.0, "debt_growth": -12.0, "cash_flow": 8.4, "roe": 4.2, "order_book": 62.0},
      {"year": "2024", "revenue_growth": 8.0, "net_income_growth": 45.0, "debt_growth": -8.0, "cash_flow": 12.0, "roe": 8.5, "order_book": 68.0}
    ],
    "crisis_info": {
      "crisis_title": "Vision Fund Tech Overinvestment and $32B Annual Loss",
      "condition_summary": "SoftBank's capital-forcing investment strategy generated $40B+ in losses when rate rises collapsed growth tech valuations across its portfolio.",
      "condition_keywords": ["venture capital losses", "tech valuation collapse", "WeWork", "interest rate impact", "Vision Fund", "mark-to-market"],
      "root_causes": ["Concentration in unprofitable growth tech at zero-rate valuations", "WeWork, Katerra, and 20+ zero-revenue portfolio companies", "Japan credit exposure"],
      "strategy_summary": "$50B asset sales, investment pause, ARM IPO, return to infrastructure and AI thesis.",
      "outcome": "ARM IPO success; SoftBank stake worth $49B+; Vision Fund losses partially recovered."
    }
  },
  {
    "id": "ftx",
    "name": "FTX / Sam Bankman-Fried",
    "ticker": "FTT",
    "sector": "FinTech",
    "logo_color": "#02a4f5",
    "market_cap": "$0",
    "founded_year": 2019,
    "leadership": {
      "founder": "Sam Bankman-Fried",
      "founder_summary": "Built the world's second largest cryptocurrency exchange in 3 years before orchestrating the largest financial fraud since Madoff.",
      "current_ceo": "Dissolved (2022); John J. Ray III as restructuring CEO",
      "company_background": "Headquartered in Bahamas. Peak valuation of $32B in January 2022. Collapsed in November 2022 in 72 hours."
    },
    "executive_analysis_paragraph": "FTX's collapse was the crypto industry's Enron moment. SBF used $8B+ of customer deposits from FTX to fund speculative trading at Alameda Research (his hedge fund) — the most fundamental violation of a custodian's obligations. When CoinDesk reported Alameda's balance sheet was 40% comprised of FTT (FTX's own token), Binance's CZ announced he was liquidating his $500M FTT position. This triggered a bank run: $6B in withdrawals in 72 hours. FTX halted withdrawals, filed for bankruptcy, and SBF was extradited from the Bahamas. He was convicted on 7 counts of fraud and sentenced to 25 years in prison.",
    "six_year_downfalls_and_pumps": [
      {
        "type": "Pump", "period": "2020 - 2022",
        "title": "Crypto Exchange Dominance and $32B Valuation",
        "move_data": "Grew from $0 to $32B valuation in 3 years; processed $15B+ daily trading volume; sponsored Formula 1, NBA arena, celebrity campaigns.",
        "reason_behind_move": "Crypto bull market 2020-2021 drove massive exchange volume growth. FTX's innovative products (tokenized stocks, leveraged tokens) attracted sophisticated traders.",
        "strategy_implemented": "Aggressive marketing spend ($500M+), regulatory lobbying, acquisition of BlockFi and Voyager distressed assets, bailout positioning during crypto winter.",
        "outcome_paragraph": "SBF positioned FTX as the 'responsible' crypto exchange and himself as crypto's government liaison — masking fraud."
      },
      {
        "type": "Downfall", "period": "2022",
        "title": "CoinDesk Exposé, Binance Liquidation, and 72-Hour Collapse",
        "move_data": "Filed Chapter 11 with $9B shortfall; $8B customer funds missing; SBF arrested December 2022; 1 million creditors.",
        "reason_behind_move": "CoinDesk reported Alameda's FTT-heavy balance sheet. Binance's CZ public liquidation of FTT triggered $6B bank run. FTX froze withdrawals.",
        "strategy_implemented": "Attempted white knight acquisition by Binance (abandoned after due diligence); hired John Ray III (Enron restructuring specialist) as CEO.",
        "outcome_paragraph": "SBF convicted November 2023 on 7 fraud counts; sentenced to 25 years; $8B customer restitution process ongoing."
      }
    ],
    "six_year_financials": [
      {"year": "2019", "revenue_growth": 100.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0},
      {"year": "2020", "revenue_growth": 400.0, "net_income_growth": 0.0, "debt_growth": 5.0, "cash_flow": 0.1, "roe": 0.0, "order_book": 0.9},
      {"year": "2021", "revenue_growth": 1000.0, "net_income_growth": 0.0, "debt_growth": 25.0, "cash_flow": 1.1, "roe": 0.0, "order_book": 1.0},
      {"year": "2022", "revenue_growth": -100.0, "net_income_growth": -100.0, "debt_growth": -100.0, "cash_flow": -8.0, "roe": -100.0, "order_book": 0.0},
      {"year": "2023", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0},
      {"year": "2024", "revenue_growth": 0.0, "net_income_growth": 0.0, "debt_growth": 0.0, "cash_flow": 0.0, "roe": 0.0, "order_book": 0.0}
    ],
    "crisis_info": {
      "crisis_title": "Crypto Exchange Fraud and $8B Customer Fund Misappropriation",
      "condition_summary": "FTX used $8B in customer deposits to fund proprietary trading at Alameda Research, collapsing in 72 hours when CoinDesk exposed the balance sheet fraud.",
      "condition_keywords": ["crypto fraud", "customer fund misappropriation", "bank run", "Binance liquidation", "SBF conviction"],
      "root_causes": ["$8B customer funds diverted to Alameda trading", "FTT token circular balance sheet", "Absence of basic financial controls"],
      "strategy_summary": "No recovery possible — criminal fraud; Chapter 11 restructuring; customer restitution.",
      "outcome": "SBF convicted 25 years; $8B customer restitution approved; industry regulatory reform accelerated."
    }
  }
]

def main():
    # Load existing data
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        existing = json.load(f)

    existing_ids = {c.get('id','').lower() for c in existing}
    added = 0

    for company in NEW_COMPANIES:
        if company['id'] not in existing_ids:
            existing.append(company)
            added += 1
            print(f"  Added: {company['name']}")
        else:
            print(f"  Skipped (already exists): {company['name']}")

    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"\nDone. Added {added} companies. Total: {len(existing)}")

if __name__ == '__main__':
    main()
