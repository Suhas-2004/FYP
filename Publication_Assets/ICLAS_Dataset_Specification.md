# ICLAS Dataset Specification
## Full End-to-End Dataset Guide for Publication & Experimentation

---

## Project Module Map

| Module | Frontend Page | Backend Router | Dataset Needed |
|---|---|---|---|
| Crisis Intelligence | `SearchCondition.jsx`, `StrategySteps.jsx` | `crisis.js` | **DS-1: Corporate Crisis Cases** |
| Company Analysis | `Companies.jsx`, `GraphAnalysis.jsx` | `companies.js` | **DS-2: MNC Historical Data** |
| Startup Intelligence | `StartupIntel.jsx` | `startups.js` | **DS-3: Startup Profiles** |
| Investor Matchmaking | `InvestorsStartups.jsx` | `startups.js` | **DS-4: Investor Profiles** |
| Market Dashboard | `MarketDashboard.jsx` | `market.js` | **DS-5: Stock OHLCV Data** |
| Graph Analysis | `GraphAnalysis.jsx` | `overview.js` | **DS-6: Relationship Graph** |

---

## DS-1: Corporate Crisis Case Database
> Powers the TF-IDF similarity search engine (CrisisSimilarityEngine in similarityEngine.js).

### Collection Sources
- **SEC EDGAR** – 10-K, 10-Q filings (2000–2024)
- **Harvard Business Review** case archives
- **Wikipedia** corporate crisis pages (structured)
- **Bloomberg** case studies (manual)

### Schema (per record)
```json
{
  "id": "KODAK-001",
  "company_name": "Kodak",
  "sector": "Technology / Manufacturing",
  "crisis_year_range": "2010-2012",
  "crisis_info": {
    "crisis_title": "Digital Disruption and Bankruptcy Filing",
    "condition_summary": "Kodak failed to pivot from film to digital photography despite inventing the digital camera internally.",
    "condition_keywords": ["digital disruption","revenue collapse","bankruptcy","film decline"],
    "root_causes": ["Failed to cannibalize own product line","Late digital market entry"],
    "strategy_summary": "Asset divestitures, patent portfolio liquidation, restructuring under Chapter 11.",
    "outcome": "Emerged from bankruptcy 2013 as B2B printing company."
  },
  "six_year_downfalls_and_pumps": [
    {
      "year": 2010, "title": "Digital Sales Collapse", "move_type": "downfall",
      "reason_behind_move": "Consumer cameras replaced by smartphones.",
      "strategy_implemented": "Emergency cost-cutting, 13000 layoffs",
      "revenue_impact_percent": -28.5, "move_data": "Revenue: $7.6B to $5.5B"
    }
  ],
  "executive_analysis_paragraph": "Kodak represents a canonical case of the innovator dilemma...",
  "similarity_tags": ["legacy disruption","digital transformation failure","patent monetization"]
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum for system to work | 30 companies |
| Recommended for paper | 80–100 companies |
| Ideal for production | 250+ companies |
| Sectors to cover | Tech, Retail, Finance, Healthcare, Manufacturing, Energy, Media |
| Failure types | Debt crisis, digital disruption, fraud, over-expansion, regulatory, macro |

---

## DS-2: MNC Historical Financial Data
> Powers Companies.jsx case study page and GraphAnalysis.jsx visualizations.

### Collection Sources
- **Macrotrends.net** – Free P&L, revenue, market cap
- **Yahoo Finance** via `yfinance` Python library (free)
- **Company Annual Reports** (PDFs)

### Schema (per company)
```json
{
  "id": "AAPL-001",
  "company_name": "Apple Inc.", "ticker": "AAPL", "sector": "Technology",
  "founded": 1976, "headquarters": "Cupertino, CA", "ceo": "Tim Cook", "employees": 164000,
  "financials": {
    "2018": { "revenue_bn": 265.6, "net_income_bn": 59.5, "market_cap_bn": 748, "pe_ratio": 18.4, "debt_to_equity": 0.87 },
    "2019": { "revenue_bn": 260.2, "net_income_bn": 55.3, "market_cap_bn": 1300, "pe_ratio": 23.1, "debt_to_equity": 0.97 },
    "2020": { "revenue_bn": 274.5, "net_income_bn": 57.4, "market_cap_bn": 2250, "pe_ratio": 35.1, "debt_to_equity": 1.73 },
    "2021": { "revenue_bn": 365.8, "net_income_bn": 94.7, "market_cap_bn": 2900, "pe_ratio": 29.8, "debt_to_equity": 1.98 },
    "2022": { "revenue_bn": 394.3, "net_income_bn": 99.8, "market_cap_bn": 2070, "pe_ratio": 23.4, "debt_to_equity": 1.76 },
    "2023": { "revenue_bn": 383.3, "net_income_bn": 97.0, "market_cap_bn": 3000, "pe_ratio": 30.5, "debt_to_equity": 1.80 }
  },
  "graph_links": ["MSFT","GOOGL","TSMC","QCOM"]
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum | 20 companies |
| Recommended for paper | 50 companies |
| Years of historical data | 2018–2024 (6 years) |
| KPIs per year | Revenue, Net Income, Market Cap, P/E, Debt/Equity, EPS, Gross Margin |

---

## DS-3: Startup Profiles Dataset
> Powers StartupIntel.jsx. Currently stored in backend/data/startups_data.json.

### Collection Sources
- **Crunchbase API** – `crunchbase.com`
- **AngelList / Wellfound** – Startup listings
- **Y Combinator** Alumni database
- **Manual entry** via ICLAS submission form (already built)

### Schema (per startup)
```json
{
  "id": "startup-001-a3f2",
  "name": "NeuroLend AI",
  "tagline": "Credit scoring for the unbanked using behavioural biometrics",
  "industry": "FinTech", "stage": "Seed", "founded_year": 2022,
  "location": "Bangalore, India", "team_size": 8,
  "problem_solved": "350 million adults in South Asia lack formal credit history.",
  "proposed_solution": "AI model trained on 47 behavioural biometric signals to generate real-time credit scores.",
  "target_market": "Tier 2/3 city first-time borrowers",
  "revenue_model": "SaaS licensing to NBFCs at 12 rupees per query",
  "traction": { "mrr_usd": 4200, "users": 3800, "pilot_partners": ["Ujjivan SFB","Kiva India"] },
  "funding_ask_usd": 500000, "equity_offered_percent": 8,
  "use_of_funds": "Model accuracy, regulatory sandbox, sales hiring",
  "potential_rating": "High", "submitted_at": "2024-11-15T10:30:00Z"
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum | 15 startups |
| Recommended for paper | 50 startups |
| Industries | FinTech, HealthTech, AgriTech, EdTech, ClimaTech, SaaS, DeepTech |
| Stages | Idea, Pre-Seed, Seed, Series A |
| Geography | India, USA, Europe, SEA |

---

## DS-4: Investor Profiles Dataset
> Powers InvestorsStartups.jsx matchmaking. Currently in backend/data/investor_inquiries.json.

### Collection Sources
- **Crunchbase Investors** – `crunchbase.com/hub/investors`
- **AngelList** investor pages
- **SEBI-registered Angel Networks** (India)
- **LinkedIn** (manual profiles)

### Schema (per investor)
```json
{
  "id": "inv-001",
  "name": "Vikram Anand", "type": "Angel Investor", "location": "Mumbai, India",
  "portfolio_companies": ["Zepto","Slice","Freo"],
  "investment_focus": ["FinTech","Consumer Tech","B2B SaaS"],
  "stage_preference": ["Pre-Seed","Seed"],
  "ticket_size_usd": { "min": 25000, "max": 150000 },
  "geography": ["India","SEA"],
  "past_exits": 3,
  "contact_email": "vikram@example.com"
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum | 10 investors |
| Recommended for paper | 30–40 investors |
| Types | Angel, VC Fund, Corporate VC, Family Office, Accelerator |

---

## DS-5: Stock Market OHLCV Dataset
> Powers GraphAnalysis.jsx and MarketDashboard.jsx. Currently uses HARDCODED static profiles in predictionEngine.js — needs real data.

### Free Collection Sources
| Source | How to Access | What You Get |
|---|---|---|
| Yahoo Finance | `pip install yfinance` | OHLCV, dividends, info |
| Alpha Vantage | Free API key at alphavantage.co | OHLCV + indicators |
| Polygon.io | Free tier (5 calls/min) | Minute/daily OHLCV |
| TradingView | Already in your app! | Live real-time charts |

### Python Collection Script
```python
import yfinance as yf, json

TICKERS = ['AAPL','TSLA','GOOGL','MSFT','META','AMZN','JPM','BAC',
           'NFLX','MRNA','SQ','PYPL','NVDA','V','MA','WFC','HSBC','BABA','T','WMT']

dataset = {}
for ticker in TICKERS:
    stock = yf.Ticker(ticker)
    hist = stock.history(period="2y", interval="1d")
    info = stock.info
    dataset[ticker] = {
        "info": {
            "name": info.get("longName"), "sector": info.get("sector"),
            "market_cap": info.get("marketCap"), "pe_ratio": info.get("trailingPE"),
            "52w_high": info.get("fiftyTwoWeekHigh"), "52w_low": info.get("fiftyTwoWeekLow"),
            "beta": info.get("beta")
        },
        "ohlcv": [
            { "date": str(row.name.date()), "open": round(row["Open"],2),
              "high": round(row["High"],2), "low": round(row["Low"],2),
              "close": round(row["Close"],2), "volume": int(row["Volume"]) }
            for _, row in hist.iterrows()
        ]
    }
    print(f"Collected {ticker}: {len(hist)} rows")

with open("backend/data/stocks_data.json","w") as f:
    json.dump(dataset, f, indent=2)
print("Done.")
```

### Schema (per OHLCV row)
```json
{
  "date": "2024-10-14", "open": 225.50, "high": 229.80, "low": 224.30,
  "close": 227.45, "volume": 54823100,
  "sma_20": 221.30, "ema_50": 218.70, "rsi_14": 61.4,
  "macd": 2.15, "macd_signal": 1.87,
  "bollinger_upper": 235.40, "bollinger_lower": 207.20, "atr_14": 3.45
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum | 10 tickers × 1 year |
| Recommended for paper | 20 tickers × 2 years (~10,000 rows) |
| For ML training | 20 tickers × 5 years (~26,000 rows) |
| Interval | Daily (1D) base + 1H for technical analysis |

---

## DS-6: Corporate Relationship Graph Dataset
> Powers GraphAnalysis.jsx — network graph showing connections between companies.

### Collection Sources
- **OpenCorporates API** – `api.opencorporates.com`
- **Wikidata SPARQL** – Corporate relationship queries
- **Manual domain knowledge** + Bloomberg supply chain data

### Schema
```json
{
  "nodes": [
    { "id": "AAPL", "label": "Apple Inc.", "sector": "Technology", "market_cap_bn": 3000, "size": 50 },
    { "id": "TSMC", "label": "TSMC", "sector": "Semiconductors", "market_cap_bn": 800, "size": 35 }
  ],
  "edges": [
    { "source": "AAPL", "target": "TSMC", "relationship": "supplier", "dependency": "critical", "weight": 0.9 },
    { "source": "AAPL", "target": "GOOGL", "relationship": "competitor", "dependency": "high", "weight": 0.7 }
  ]
}
```

### Required Size
| Metric | Target |
|---|---|
| Minimum | 20 nodes, 30 edges |
| Recommended for paper | 50 nodes, 100+ edges |
| Relationship types | supplier, competitor, partner, investor, acquiree |

---

## Summary: Complete Collection Plan

| # | Dataset | Records Needed | Collection Method | Time to Collect |
|---|---|---|---|---|
| DS-1 | Corporate Crisis Cases | 80–100 companies | SEC EDGAR + Manual | 2–3 weeks |
| DS-2 | MNC Historical Financials | 50 companies × 6 years | yfinance + Macrotrends | 1 week |
| DS-3 | Startup Profiles | 50 startups | Crunchbase + Manual | 1–2 weeks |
| DS-4 | Investor Profiles | 30–40 investors | Crunchbase + AngelList | 3–5 days |
| DS-5 | Stock OHLCV | 20 tickers × 2 years | yfinance script (automated) | **1 day** |
| DS-6 | Relationship Graph | 50 nodes, 100 edges | Wikidata + manual | 1 week |

---

## Future Experiment Datasets (Results Section of Paper)

### Experiment 1 — Crisis Retrieval Accuracy
- **What:** Test if the TF-IDF engine finds the correct company from a text description.
- **Dataset:** 30 labeled query-answer pairs (query → correct company match).
- **Metrics:** Precision@1, Precision@3, MRR (Mean Reciprocal Rank).

### Experiment 2 — Stock Price Prediction MAE
- **What:** ICLAS predicted prices vs actual Yahoo Finance closing prices.
- **Dataset:** DS-5 test split — last 6 months of each ticker.
- **Metrics:** MAE, RMSE, Directional Accuracy %.

### Experiment 3 — Startup-Investor Match Recall
- **What:** Does the system suggest relevant investors for a given startup?
- **Dataset:** 20 labeled startup profiles with known correct investor matches.
- **Metrics:** Recall@3, F1 Score, Precision.

### Experiment 4 — System Usability (SUS Survey)
- **What:** User experience evaluation across Entrepreneur/Investor/Analyst personas.
- **Dataset:** 30 participants, SUS questionnaire (10 questions each).
- **Metrics:** SUS Score 0–100 (above 68 = above average usability).

---

> **Priority Order:** DS-5 is fastest to collect (1 day, fully automated). DS-1 is most important for the core AI engine accuracy experiments. Start with DS-5 and DS-1 for your paper results section.
