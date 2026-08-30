import json
import os
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List

router = APIRouter(prefix="/api/companies", tags=["Company Intelligence"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "companies_data.json")

def load_companies():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/")
def get_all_companies(sector: Optional[str] = Query("All", description="Sector filter")):
    companies = load_companies()
    if sector and sector != "All":
        companies = [c for c in companies if c.get("sector", "").lower() == sector.lower()]
    
    # Return summarized company cards
    summaries = []
    for c in companies:
        crisis = c.get("crisis_info", {})
        summaries.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "ticker": c.get("ticker"),
            "sector": c.get("sector"),
            "logo_color": c.get("logo_color"),
            "market_cap": c.get("market_cap"),
            "founded_year": c.get("founded_year"),
            "founder": c.get("leadership", {}).get("founder"),
            "current_ceo": c.get("leadership", {}).get("current_ceo"),
            "crisis_title": crisis.get("crisis_title"),
            "strategy_used": crisis.get("strategy_used"),
            "recovery_status": crisis.get("recovery_status"),
            "financial_summary": {
                "latest_revenue_growth": c.get("six_year_financials", [{}])[-1].get("revenue_growth", 0),
                "latest_roe": c.get("six_year_financials", [{}])[-1].get("roe", 0),
                "latest_cash_flow": c.get("six_year_financials", [{}])[-1].get("cash_flow", 0)
            }
        })
    
    return {
        "sector_filter": sector,
        "total_companies": len(summaries),
        "companies": summaries
    }

@router.get("/sectors")
def get_available_sectors():
    return [
        "All",
        "Technology",
        "Retail",
        "FinTech",
        "Real Estate",
        "Automobile",
        "Healthcare",
        "Media"
    ]

@router.get("/{company_id}")
def get_company_detail(company_id: str):
    companies = load_companies()
    for c in companies:
        if c.get("id") == company_id:
            return c
    raise HTTPException(status_code=404, detail=f"Company '{company_id}' not found")
