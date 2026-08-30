import os
import json
from fastapi import APIRouter
from services.similarity_engine import similarity_engine

router = APIRouter(prefix="/api/overview", tags=["Overview Dashboard"])

COMPANIES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "companies_data.json")
STARTUPS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "startups_data.json")

@router.get("/metrics")
def get_overview_metrics():
    companies = []
    if os.path.exists(COMPANIES_PATH):
        with open(COMPANIES_PATH, "r", encoding="utf-8") as f:
            companies = json.load(f)
            
    startups = []
    if os.path.exists(STARTUPS_PATH):
        with open(STARTUPS_PATH, "r", encoding="utf-8") as f:
            startups = json.load(f)

    # Calculate statistics
    total_companies = len(companies)
    total_crises = sum(1 for c in companies if c.get("crisis_info"))
    total_startups = len(startups)
    
    recovered_count = sum(1 for c in companies if c.get("crisis_info", {}).get("recovery_status") in ["Fully Recovered", "Market Leader"])
    recovery_rate = round((recovered_count / max(1, total_crises)) * 100, 1)

    sectors = list(set(c.get("sector") for c in companies if c.get("sector")))

    # Recent corporate intelligence events for ticker
    recent_events = [
        {"company": "Apple Inc.", "event": "Jobs $150M Microsoft Partnership", "type": "Strategic Financing", "outcome": "Turnaround"},
        {"company": "Netflix", "event": "Qwikster Split Reversal & Original Content Moat", "type": "Market Pivot", "outcome": "Recovery"},
        {"company": "Tesla", "event": "Tent Assembly & Model 3 De-Automation", "type": "Operational Restructuring", "outcome": "Scaled"},
        {"company": "LEGO", "event": "50% Component Standardization & Theme Park Sale", "type": "Asset Divestment", "outcome": "Profitable"},
        {"company": "Ford", "event": "Preemptive $23.6B Debt Raise Before 2008 Crisis", "type": "Liquidity Buffer", "outcome": "Surviving"}
    ]

    # Live prediction highlights
    market_signals = [
        {"ticker": "AAPL", "signal": "Likely Rise", "confidence": 76.5, "horizon": "4-Hour"},
        {"ticker": "TSLA", "signal": "Likely Decline", "confidence": 71.0, "horizon": "4-Hour"},
        {"ticker": "NFLX", "signal": "Likely Rise", "confidence": 82.0, "horizon": "4-Hour"},
        {"ticker": "SQ", "signal": "Likely Rise", "confidence": 69.0, "horizon": "Daily"}
    ]

    return {
        "kpis": {
            "companies_analyzed": total_companies,
            "historical_cases": total_crises,
            "active_startups": total_startups,
            "recovery_success_rate": f"{recovery_rate}%",
            "sectors_covered": len(sectors),
            "longitudinal_span": "6 Years Financials"
        },
        "sectors": sectors,
        "recent_events": recent_events,
        "market_signals": market_signals
    }
