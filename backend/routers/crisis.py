from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from pydantic import BaseModel
from services.similarity_engine import similarity_engine

router = APIRouter(prefix="/api/crisis", tags=["Crisis Matching"])

class CrisisSearchRequest(BaseModel):
    query: str
    sector: Optional[str] = "All"
    min_threshold: Optional[float] = 40.0

@router.get("/search")
def search_crisis_condition(
    q: str = Query(..., description="Problem or crisis condition description"),
    sector: str = Query("All", description="Sector filter (e.g. Technology, FinTech, Retail, Real Estate, Automobile, Healthcare, Media, All)"),
    threshold: float = Query(40.0, description="Minimum similarity threshold percentage")
):
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    results = similarity_engine.search_similar_cases(query=q, sector_filter=sector, threshold=threshold / 100.0)
    filtered = [r for r in results if r["similarity_score"] >= threshold]
    
    return {
        "query": q,
        "sector_filter": sector,
        "results_count": len(filtered),
        "matches": filtered
    }

@router.post("/search")
def search_crisis_condition_post(body: CrisisSearchRequest):
    if not body.query or not body.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    results = similarity_engine.search_similar_cases(
        query=body.query,
        sector_filter=body.sector or "All",
        threshold=(body.min_threshold or 40.0) / 100.0
    )
    filtered = [r for r in results if r["similarity_score"] >= (body.min_threshold or 40.0)]
    
    return {
        "query": body.query,
        "sector_filter": body.sector,
        "results_count": len(filtered),
        "matches": filtered
    }

@router.get("/strategy/{company_id}")
def get_strategy_steps(company_id: str):
    strategy_data = similarity_engine.get_strategy_steps(company_id)
    if not strategy_data:
        raise HTTPException(status_code=404, detail=f"No strategy steps found for company {company_id}")
    return strategy_data

@router.get("/sample-queries")
def get_sample_queries():
    return [
        {
            "category": "Cash & Debt Distress",
            "query": "High debt, declining cash flow, and 90 days runway remaining",
            "matched_intent": "Liquidity crisis / Debt restructuring"
        },
        {
            "category": "Customer Churn & Pricing",
            "query": "Pricing change backlash and severe customer churn",
            "matched_intent": "Value proposition pivot & retention moat"
        },
        {
            "category": "Retail & Showrooming",
            "query": "Online competitors undercutting prices and physical store losses",
            "matched_intent": "Omnichannel price matching & store monetization"
        },
        {
            "category": "Over-Diversification",
            "query": "Over-diversification into non-core products and massive annual losses",
            "matched_intent": "Asset divestment & modular standardization"
        },
        {
            "category": "Production & Scale Bottlenecks",
            "query": "Manufacturing bottlenecks, extreme capital burn, and delayed deliveries",
            "matched_intent": "De-automation & agile execution"
        },
        {
            "category": "Macro & Interest Rate Shocks",
            "query": "Interest rate spike causing inventory write-downs and balance sheet illiquidity",
            "matched_intent": "Asset liquidation & partner distribution"
        }
    ]
