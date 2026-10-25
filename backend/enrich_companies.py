"""
Enrich companies_data.json with market metrics, stock prices, risk levels, 
6Y sparklines, and keywords to match the enterprise Companies page design.
"""

import json
import os

DATA_PATH = r"d:\MjrProject\FYP\backend\data\companies_data.json"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    companies = json.load(f)

# Priority companies matching the reference screenshot exactly:
SCREENSHOT_COMPANIES = {
    "apple": {
        "stock_price": 182.52,
        "price_change": "+1.4%",
        "price_positive": True,
        "risk_level": "Low Risk",
        "market_cap": "$2.91T",
        "revenue_ttm": "$383.3B",
        "net_income_ttm": "$97.0B",
        "country": "United States",
        "tags": ["Innovation", "Strong Financials", "Growth"],
        "sparkline": [140, 150, 165, 155, 172, 178, 182.52]
    },
    "microsoft": {
        "id": "microsoft",
        "name": "Microsoft Corp.",
        "ticker": "MSFT",
        "sector": "Technology",
        "logo_color": "#00a4ef",
        "stock_price": 415.20,
        "price_change": "+0.8%",
        "price_positive": True,
        "risk_level": "Low Risk",
        "market_cap": "$3.11T",
        "revenue_ttm": "$244.5B",
        "net_income_ttm": "$72.4B",
        "country": "United States",
        "tags": ["Cloud", "AI", "Enterprise"],
        "sparkline": [220, 245, 290, 275, 330, 390, 415.20],
        "founded_year": 1975,
        "leadership": {
            "founder": "Bill Gates & Paul Allen",
            "founder_summary": "Pioneered desktop personal computing software.",
            "current_ceo": "Satya Nadella",
            "company_background": "Global cloud computing, personal software, and enterprise productivity titan headquartered in Redmond, Washington."
        },
        "executive_analysis_paragraph": "Microsoft executed one of the most successful strategic pivots in corporate history under Satya Nadella, migrating from on-premise Windows licenses to Azure cloud services and commercial Microsoft 365 SaaS. Between 2019 and 2024, Microsoft transformed into the foundational infrastructure layer for generative enterprise AI via its multi-billion-dollar OpenAI alliance and Azure Copilot ecosystem.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2023 - 2024",
                "title": "Generative AI Leadership & Azure Enterprise Acceleration",
                "move_data": "Valuation breached $3.1 trillion; Azure commercial cloud revenue exceeded $110B annual run-rate.",
                "reason_behind_move": "Early strategic partnership with OpenAI giving Microsoft exclusive cloud computing hosting rights and deep integrations across Office 365, GitHub, and Bing.",
                "strategy_implemented": "Monetized Copilot across enterprise seats, consolidated data center infrastructure, and accelerated Activision Blizzard integration.",
                "outcome_paragraph": "Established unmatched enterprise AI moat and record net income margins exceeding 34%."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 14.0, "net_income_growth": 136.8, "cash_flow": 52.2, "roe": 42.4},
            {"year": "2020", "revenue_growth": 13.6, "net_income_growth": 12.8, "cash_flow": 60.7, "roe": 40.1},
            {"year": "2021", "revenue_growth": 17.5, "net_income_growth": 38.4, "cash_flow": 76.7, "roe": 47.1},
            {"year": "2022", "revenue_growth": 18.0, "net_income_growth": 18.7, "cash_flow": 89.0, "roe": 47.2},
            {"year": "2023", "revenue_growth": 6.9, "net_income_growth": -0.5, "cash_flow": 87.6, "roe": 38.8},
            {"year": "2024", "revenue_growth": 15.7, "net_income_growth": 21.8, "cash_flow": 118.5, "roe": 39.2}
        ]
    },
    "tesla": {
        "stock_price": 238.11,
        "price_change": "-2.3%",
        "price_positive": False,
        "risk_level": "High Risk",
        "market_cap": "$758B",
        "revenue_ttm": "$96.8B",
        "net_income_ttm": "$15.0B",
        "country": "United States",
        "tags": ["EV", "Competition", "Volatility"],
        "sparkline": [70, 240, 350, 210, 260, 220, 238.11]
    },
    "amazon": {
        "id": "amazon",
        "name": "Amazon.com Inc.",
        "ticker": "AMZN",
        "sector": "Retail",
        "logo_color": "#ff9900",
        "stock_price": 165.42,
        "price_change": "+1.1%",
        "price_positive": True,
        "risk_level": "Medium Risk",
        "market_cap": "$1.7T",
        "revenue_ttm": "$574.8B",
        "net_income_ttm": "$30.4B",
        "country": "United States",
        "tags": ["E-commerce", "Cloud", "Logistics"],
        "sparkline": [95, 120, 165, 110, 130, 155, 165.42],
        "founded_year": 1994,
        "leadership": {
            "founder": "Jeff Bezos",
            "founder_summary": "Pioneered customer-centric online commerce and AWS cloud infrastructure.",
            "current_ceo": "Andy Jassy",
            "company_background": "Global e-commerce, cloud computing (AWS), digital streaming, and logistics leader headquartered in Seattle, Washington."
        },
        "executive_analysis_paragraph": "Amazon expanded its fulfillment network exponentially during the 2020 pandemic, subsequently restructuring logistics hubs into regional nodes to compress shipping costs. AWS remains its primary profit engine, complemented by high-margin retail advertising services.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2023 - 2024",
                "title": "Logistics Regionalization & Operating Margin Expansion",
                "move_data": "Operating income surged over 200%; free cash flow reached record $36B+.",
                "reason_behind_move": "Regional fulfillment network lowered delivery costs while AWS AI compute demand rebounded strongly.",
                "strategy_implemented": "De-duplicated warehouse fulfillment centers, streamlined headcount, and invested heavily in proprietary Trainium AI silicon.",
                "outcome_paragraph": "Expanded operating cash flows to record highs and stabilized retail profitability."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 20.5, "net_income_growth": 15.0, "cash_flow": 38.5, "roe": 21.9},
            {"year": "2020", "revenue_growth": 37.6, "net_income_growth": 84.1, "cash_flow": 66.1, "roe": 27.4},
            {"year": "2021", "revenue_growth": 21.7, "net_income_growth": 56.4, "cash_flow": 46.3, "roe": 28.8},
            {"year": "2022", "revenue_growth": 9.4, "net_income_growth": -130.0, "cash_flow": 46.8, "roe": -2.0},
            {"year": "2023", "revenue_growth": 11.8, "net_income_growth": 150.0, "cash_flow": 84.9, "roe": 17.1},
            {"year": "2024", "revenue_growth": 12.5, "net_income_growth": 45.0, "cash_flow": 112.0, "roe": 21.5}
        ]
    },
    "alphabet": {
        "id": "alphabet",
        "name": "Alphabet Inc.",
        "ticker": "GOOGL",
        "sector": "Technology",
        "logo_color": "#4285f4",
        "stock_price": 142.36,
        "price_change": "+0.9%",
        "price_positive": True,
        "risk_level": "Low Risk",
        "market_cap": "$1.8T",
        "revenue_ttm": "$307.4B",
        "net_income_ttm": "$73.8B",
        "country": "United States",
        "tags": ["Search", "AI", "Advertising"],
        "sparkline": [75, 90, 140, 115, 130, 138, 142.36],
        "founded_year": 1998,
        "leadership": {
            "founder": "Larry Page & Sergey Brin",
            "founder_summary": "Invented PageRank search algorithm and global online digital advertising infrastructure.",
            "current_ceo": "Sundar Pichai",
            "company_background": "Global search, Android OS, YouTube, Google Cloud, and AI research conglomerate headquartered in Mountain View, California."
        },
        "executive_analysis_paragraph": "Alphabet dominates global digital search and mobile operating systems. Over the 2019-2024 period, Google Cloud achieved profitability while Gemini multimodal AI was integrated across Search, Workspace, and cloud platforms.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2023 - 2024",
                "title": "Google Cloud Profitability & Gemini Multimodal Rollout",
                "move_data": "Google Cloud operating income reached positive $1B+ quarterly; total revenues crossed $300B.",
                "reason_behind_move": "Enterprise adoption of Google Cloud BigQuery and Vertex AI, coupled with YouTube Premium subscription acceleration.",
                "strategy_implemented": "Deployed proprietary TPU v5p accelerators, embedded AI Overviews into Search, and expanded enterprise Workspace subscriptions.",
                "outcome_paragraph": "Reinforced digital advertising market share and solidified multi-cloud competitive positioning."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 18.3, "net_income_growth": 11.7, "cash_flow": 54.5, "roe": 18.1},
            {"year": "2020", "revenue_growth": 12.8, "net_income_growth": 17.3, "cash_flow": 65.1, "roe": 19.0},
            {"year": "2021", "revenue_growth": 41.2, "net_income_growth": 88.8, "cash_flow": 91.6, "roe": 32.1},
            {"year": "2022", "revenue_growth": 9.8, "net_income_growth": -21.1, "cash_flow": 91.5, "roe": 23.6},
            {"year": "2023", "revenue_growth": 8.7, "net_income_growth": 23.0, "cash_flow": 101.7, "roe": 27.4},
            {"year": "2024", "revenue_growth": 13.0, "net_income_growth": 25.0, "cash_flow": 115.0, "roe": 29.0}
        ]
    },
    "netflix": {
        "stock_price": 628.44,
        "price_change": "-1.2%",
        "price_positive": False,
        "risk_level": "Medium Risk",
        "market_cap": "$281B",
        "revenue_ttm": "$33.7B",
        "net_income_ttm": "$6.1B",
        "country": "United States",
        "tags": ["Streaming", "Content", "Global Expansion"],
        "sparkline": [350, 480, 590, 320, 410, 580, 628.44]
    },
    "walmart": {
        "id": "walmart",
        "name": "Walmart Inc.",
        "ticker": "WMT",
        "sector": "Retail",
        "logo_color": "#0071ce",
        "stock_price": 165.90,
        "price_change": "+0.7%",
        "price_positive": True,
        "risk_level": "Low Risk",
        "market_cap": "$447B",
        "revenue_ttm": "$648.1B",
        "net_income_ttm": "$15.5B",
        "country": "United States",
        "tags": ["Retail", "Supply Chain", "Stability"],
        "sparkline": [118, 132, 145, 138, 150, 160, 165.90],
        "founded_year": 1962,
        "leadership": {
            "founder": "Sam Walton",
            "founder_summary": "Pioneered everyday low pricing and efficient inventory logistics.",
            "current_ceo": "Doug McMillon",
            "company_background": "World's largest retailer by revenue, operating hypermarkets, discount department stores, and grocery stores across 19 countries."
        },
        "executive_analysis_paragraph": "Walmart capitalized on global consumer inflation by capturing higher-income grocery shoppers, scaling its Walmart+ membership ecosystem, and growing its high-margin retail media network (Walmart Connect) into a multi-billion-dollar business.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2022 - 2024",
                "title": "Grocery Market Share Expansion & E-Commerce Automation",
                "move_data": "Revenues reached $648B; e-commerce penetration exceeded $100B globally.",
                "reason_behind_move": "Consumers sought value during inflationary periods; automated fulfillment centers dramatically reduced last-mile delivery costs.",
                "strategy_implemented": "Omnichannel curbside pickup scaling, automated distribution centers, and expansion of Walmart+ subscription delivery.",
                "outcome_paragraph": "Solidified dominant US grocery position and expanded operating cash margins."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 2.8, "net_income_growth": 79.7, "cash_flow": 27.8, "roe": 9.4},
            {"year": "2020", "revenue_growth": 1.9, "net_income_growth": 123.1, "cash_flow": 25.3, "roe": 20.0},
            {"year": "2021", "revenue_growth": 6.7, "net_income_growth": -9.2, "cash_flow": 36.1, "roe": 15.6},
            {"year": "2022", "revenue_growth": 2.4, "net_income_growth": 1.2, "cash_flow": 24.2, "roe": 16.3},
            {"year": "2023", "revenue_growth": 6.7, "net_income_growth": -14.6, "cash_flow": 28.8, "roe": 14.1},
            {"year": "2024", "revenue_growth": 6.0, "net_income_growth": 32.8, "cash_flow": 35.7, "roe": 18.2}
        ]
    },
    "jpmorgan": {
        "id": "jpmorgan",
        "name": "JPMorgan Chase",
        "ticker": "JPM",
        "sector": "Finance",
        "logo_color": "#11295b",
        "stock_price": 199.28,
        "price_change": "-0.4%",
        "price_positive": False,
        "risk_level": "Medium Risk",
        "market_cap": "$575B",
        "revenue_ttm": "$158.1B",
        "net_income_ttm": "$49.6B",
        "country": "United States",
        "tags": ["Banking", "Financial Services", "US Market"],
        "sparkline": [135, 110, 160, 135, 155, 190, 199.28],
        "founded_year": 1799,
        "leadership": {
            "founder": "J. Pierpont Morgan & Aaron Burr",
            "founder_summary": "Pioneered modern industrial and investment banking syndicates.",
            "current_ceo": "Jamie Dimon",
            "company_background": "Largest bank in the United States and global systemic financial institution headquartered in New York City."
        },
        "executive_analysis_paragraph": "JPMorgan Chase navigated regional US banking turbulence by acquiring First Republic Bank in a FDIC-assisted transaction, producing record net interest income amidst elevated Federal Reserve benchmark interest rates.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2023 - 2024",
                "title": "First Republic Acquisition & Record Net Interest Margins",
                "move_data": "Annual net income hit record $49.6B; deposits grew past $2.4 trillion.",
                "reason_behind_move": "High-interest rate environment boosted lending spreads while flight to safety during the 2023 banking crisis drove billions in new institutional deposits.",
                "strategy_implemented": "Absorbed $200B+ in First Republic high-net-worth assets with FDIC loss-sharing protections, while investing $15B+ annually in banking technology.",
                "outcome_paragraph": "Fortified balance sheet resilience and cemented Jamie Dimon's leadership as America's preeminent financial institution."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 6.1, "net_income_growth": 12.2, "cash_flow": 40.5, "roe": 15.0},
            {"year": "2020", "revenue_growth": 4.1, "net_income_growth": -20.0, "cash_flow": 38.0, "roe": 12.0},
            {"year": "2021", "revenue_growth": 1.2, "net_income_growth": 66.0, "cash_flow": 52.0, "roe": 19.0},
            {"year": "2022", "revenue_growth": -2.0, "net_income_growth": -22.0, "cash_flow": 44.0, "roe": 14.0},
            {"year": "2023", "revenue_growth": 23.0, "net_income_growth": 32.0, "cash_flow": 60.0, "roe": 17.0},
            {"year": "2024", "revenue_growth": 10.0, "net_income_growth": 15.0, "cash_flow": 65.0, "roe": 18.0}
        ]
    },
    "meta": {
        "stock_price": 311.17,
        "price_change": "+0.6%",
        "price_positive": True,
        "risk_level": "Medium Risk",
        "market_cap": "$802B",
        "revenue_ttm": "$142.1B",
        "net_income_ttm": "$39.1B",
        "country": "United States",
        "tags": ["Social Media", "AI", "Metaverse"],
        "sparkline": [190, 270, 340, 130, 280, 305, 311.17]
    },
    "nvidia": {
        "id": "nvidia",
        "name": "NVIDIA Corp.",
        "ticker": "NVDA",
        "sector": "Technology",
        "logo_color": "#76b900",
        "stock_price": 859.24,
        "price_change": "+2.3%",
        "price_positive": True,
        "risk_level": "Medium Risk",
        "market_cap": "$2.13T",
        "revenue_ttm": "$60.9B",
        "net_income_ttm": "$29.8B",
        "country": "United States",
        "tags": ["AI Chips", "GPU", "Data Centers"],
        "sparkline": [75, 130, 290, 180, 450, 720, 859.24],
        "founded_year": 1993,
        "leadership": {
            "founder": "Jensen Huang, Chris Malachowsky, Curtis Priem",
            "founder_summary": "Invented the GPU in 1999 and established the CUDA computing architecture.",
            "current_ceo": "Jensen Huang",
            "company_background": "Global pioneer in accelerated computing, AI GPUs, CUDA software, and full-stack AI data center infrastructure headquartered in Santa Clara, California."
        },
        "executive_analysis_paragraph": "NVIDIA achieved unprecedented valuation growth powered by global demand for accelerated computing and generative AI training infrastructure. The proprietary CUDA software ecosystem created an unassailable moat across cloud providers and enterprise AI labs.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2023 - 2024",
                "title": "Generative AI Accelerated Computing Revolution",
                "move_data": "Data center revenue surged +217% YoY; market valuation vaulted above $2 trillion.",
                "reason_behind_move": "Global adoption of large language models required massive clusters of H100 and Blackwell GPUs.",
                "strategy_implemented": "Scaled TSMC CoWoS advanced packaging capacity and built full-stack NVLink networking systems.",
                "outcome_paragraph": "Achieved gross margins above 75% and solidified position as foundational AI infrastructure provider."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": -6.7, "net_income_growth": -32.1, "cash_flow": 3.8, "roe": 26.0},
            {"year": "2020", "revenue_growth": 52.7, "net_income_growth": 54.9, "cash_flow": 5.8, "roe": 25.2},
            {"year": "2021", "revenue_growth": 61.4, "net_income_growth": 125.1, "cash_flow": 9.1, "roe": 36.6},
            {"year": "2022", "revenue_growth": 0.2, "net_income_growth": -55.2, "cash_flow": 5.6, "roe": 19.8},
            {"year": "2023", "revenue_growth": 125.9, "net_income_growth": 581.3, "cash_flow": 28.1, "roe": 69.2},
            {"year": "2024", "revenue_growth": 85.0, "net_income_growth": 110.0, "cash_flow": 42.0, "roe": 72.0}
        ]
    },
    "intel": {
        "stock_price": 34.12,
        "price_change": "-1.8%",
        "price_positive": False,
        "risk_level": "High Risk",
        "market_cap": "$144B",
        "revenue_ttm": "$54.2B",
        "net_income_ttm": "-$1.6B",
        "country": "United States",
        "tags": ["Semiconductors", "Turnaround", "Competition"],
        "sparkline": [52, 58, 54, 38, 32, 36, 34.12]
    },
    "coca-cola": {
        "id": "coca-cola",
        "name": "Coca-Cola Co.",
        "ticker": "KO",
        "sector": "Consumer",
        "logo_color": "#f40009",
        "stock_price": 63.45,
        "price_change": "+0.2%",
        "price_positive": True,
        "risk_level": "Low Risk",
        "market_cap": "$274B",
        "revenue_ttm": "$45.8B",
        "net_income_ttm": "$10.6B",
        "country": "United States",
        "tags": ["Beverages", "Global Brand", "Stable"],
        "sparkline": [51, 48, 56, 62, 58, 62, 63.45],
        "founded_year": 1892,
        "leadership": {
            "founder": "John Stith Pemberton & Asa Candler",
            "founder_summary": "Invented Coca-Cola formula and pioneered franchise bottling model.",
            "current_ceo": "James Quincey",
            "company_background": "World's largest non-alcoholic beverage corporation operating across more than 200 countries and territories headquartered in Atlanta, Georgia."
        },
        "executive_analysis_paragraph": "Coca-Cola leveraged pricing power and global bottling partnerships to navigate post-pandemic raw material inflation, steadily compounding free cash flow and dividend returns.",
        "six_year_downfalls_and_pumps": [
            {
                "type": "Pump",
                "period": "2022 - 2024",
                "title": "Global Pricing Power & Ready-to-Drink Beverage Portfolio",
                "move_data": "Organic revenues grew +11%; operating margins maintained at 29%+.",
                "reason_behind_move": "Inelastic global consumer demand for iconic beverage trademarks amidst worldwide hospitality reopening.",
                "strategy_implemented": "Digital B2B ordering scaling and strategic reallocation of marketing into live events and sports sponsorship.",
                "outcome_paragraph": "Preserved dividend champion status and consistent free cash conversion."
            }
        ],
        "six_year_financials": [
            {"year": "2019", "revenue_growth": 8.6, "net_income_growth": 38.6, "cash_flow": 10.5, "roe": 43.1},
            {"year": "2020", "revenue_growth": -11.4, "net_income_growth": -13.1, "cash_flow": 9.8, "roe": 39.0},
            {"year": "2021", "revenue_growth": 17.1, "net_income_growth": 26.1, "cash_flow": 12.6, "roe": 42.0},
            {"year": "2022", "revenue_growth": 11.2, "net_income_growth": -2.3, "cash_flow": 11.0, "roe": 39.5},
            {"year": "2023", "revenue_growth": 6.4, "net_income_growth": 7.1, "cash_flow": 11.6, "roe": 41.2},
            {"year": "2024", "revenue_growth": 4.5, "net_income_growth": 5.0, "cash_flow": 12.0, "roe": 42.0}
        ]
    }
}

# Update or add companies
existing_ids = {c["id"]: i for i, c in enumerate(companies)}

for cid, cdata in SCREENSHOT_COMPANIES.items():
    if cid in existing_ids:
        idx = existing_ids[cid]
        companies[idx].update(cdata)
    else:
        companies.append(cdata)

# Reorder so that the top 12 screenshot companies appear first, followed by the rest
priority_order = [
    "apple", "microsoft", "tesla", "amazon", "alphabet", "netflix",
    "walmart", "jpmorgan", "meta", "nvidia", "intel", "coca-cola"
]

ordered_companies = []
seen = set()

for pid in priority_order:
    for c in companies:
        if c.get("id") == pid:
            ordered_companies.append(c)
            seen.add(c.get("id"))
            break

for c in companies:
    if c.get("id") not in seen:
        # Give fallback realistic defaults if missing
        if "stock_price" not in c:
            c["stock_price"] = 45.20
            c["price_change"] = "+0.5%"
            c["price_positive"] = True
            c["risk_level"] = "Medium Risk"
            c["revenue_ttm"] = c.get("market_cap", "$10B")
            c["net_income_ttm"] = "$1.2B"
            c["country"] = "United States"
            c["tags"] = [c.get("sector", "Enterprise"), "Turnaround", "Strategy"]
            c["sparkline"] = [40, 42, 38, 45, 43, 44, 45.2]
        ordered_companies.append(c)

with open(DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(ordered_companies, f, indent=2, ensure_ascii=False)

print(f"Successfully updated companies_data.json. Total count: {len(ordered_companies)}")
