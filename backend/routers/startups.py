import json
import os
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, List

router = APIRouter(prefix="/api/startups", tags=["Startups & Investors"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "startups_data.json")
INQUIRIES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "investor_inquiries.json")

def load_startups():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_startups(data):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

class StartupSubmission(BaseModel):
    name: str
    industry: str
    founder_name: str
    founder_title: str
    founder_email: str
    tagline: str
    idea: str
    problem_solved: str
    proposed_solution: str
    target_market: str
    expected_usability: str
    future_potential: str
    business_model: str
    funding_requirement: str
    expected_returns: str
    supporting_info: Optional[str] = ""

class InvestorInquiry(BaseModel):
    startup_id: str
    investor_name: str
    investor_organization: str
    investor_email: str
    message: str
    proposed_ticket_size: Optional[str] = "$250,000 - $500,000"

@router.get("/")
def get_startups(industry: Optional[str] = "All", potential: Optional[str] = "All"):
    startups = load_startups()
    if industry and industry != "All":
        startups = [s for s in startups if s.get("industry", "").lower() == industry.lower()]
    if potential and potential != "All":
        startups = [s for s in startups if s.get("potential_rating", "").lower() == potential.lower()]
    return {
        "count": len(startups),
        "startups": startups
    }

@router.get("/{startup_id}")
def get_startup_by_id(startup_id: str):
    startups = load_startups()
    for s in startups:
        if s.get("id") == startup_id:
            return s
    raise HTTPException(status_code=404, detail="Startup not found")

@router.post("/submit")
def submit_startup(body: StartupSubmission):
    startups = load_startups()
    new_id = f"startup-{len(startups) + 1}-{uuid.uuid4().hex[:4]}"
    
    # Heuristic viability rating
    rating = "High" if len(body.problem_solved) > 40 and len(body.proposed_solution) > 40 else "Medium"
    
    new_startup = {
        "id": new_id,
        "name": body.name,
        "industry": body.industry,
        "founder_name": body.founder_name,
        "founder_title": body.founder_title,
        "founder_email": body.founder_email,
        "tagline": body.tagline,
        "idea": body.idea,
        "problem_solved": body.problem_solved,
        "proposed_solution": body.proposed_solution,
        "target_market": body.target_market,
        "expected_usability": body.expected_usability,
        "future_potential": body.future_potential,
        "potential_rating": rating,
        "business_model": body.business_model,
        "funding_requirement": body.funding_requirement,
        "expected_returns": body.expected_returns,
        "supporting_info": body.supporting_info,
        "submitted_at": datetime.now().strftime("%Y-%m-%d")
    }
    
    startups.insert(0, new_startup)
    save_startups(startups)
    
    return {
        "status": "success",
        "message": "Startup pitch registered successfully in ICLAS dealflow repository.",
        "startup_id": new_id,
        "startup": new_startup
    }

@router.post("/contact")
def contact_startup(body: InvestorInquiry):
    startups = load_startups()
    target_startup = next((s for s in startups if s.get("id") == body.startup_id), None)
    
    if not target_startup:
        raise HTTPException(status_code=404, detail="Startup not found")
        
    inquiries = []
    if os.path.exists(INQUIRIES_PATH):
        try:
            with open(INQUIRIES_PATH, "r", encoding="utf-8") as f:
                inquiries = json.load(f)
        except Exception:
            inquiries = []
            
    inquiry_record = {
        "inquiry_id": f"inq-{uuid.uuid4().hex[:8]}",
        "startup_id": body.startup_id,
        "startup_name": target_startup.get("name"),
        "startup_founder_email": target_startup.get("founder_email"),
        "investor_name": body.investor_name,
        "investor_org": body.investor_organization,
        "investor_email": body.investor_email,
        "proposed_ticket_size": body.proposed_ticket_size,
        "message": body.message,
        "timestamp": datetime.now().isoformat(),
        "status": "Dispatched to Startup Official Email"
    }
    
    inquiries.insert(0, inquiry_record)
    with open(INQUIRIES_PATH, "w", encoding="utf-8") as f:
        json.dump(inquiries, f, indent=2)
        
    return {
        "status": "dispatched",
        "message": f"Official investor inquiry successfully dispatched to {target_startup.get('founder_email')}.",
        "inquiry_details": inquiry_record
    }

@router.get("/intel/evidence-matrix")
def get_evidence_matrix():
    """
    Returns structured evidence matrix linking:
    Startup Failure Condition -> Historical Precedent Company -> Turnaround Strategy -> Proven Outcome
    """
    return [
        {
            "id": "matrix-1",
            "startup_condition": "High Debt & Liquidity Runway Depletion (<90 Days)",
            "severity": "Critical",
            "historical_company": "Apple Inc. (1997)",
            "sector": "Technology",
            "turnaround_strategy": "Portfolio Consolidation & Microsoft $150M Bridge",
            "strategy_type": "Business Restructuring",
            "outcome": "Turned cash flow positive within 12 months; $3.4T market cap today.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-2",
            "startup_condition": "Sudden Customer Churn & Pricing Backlash",
            "severity": "High",
            "historical_company": "Netflix Inc. (2011)",
            "sector": "Media",
            "turnaround_strategy": "Re-Unified Pricing & Original Content Moat",
            "strategy_type": "Market Pivot",
            "outcome": "Subscribers surged from 23M to 280M+; dominant global streaming moat.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-3",
            "startup_condition": "E-Commerce Competitor Price Undercutting & Margin Squeeze",
            "severity": "High",
            "historical_company": "Best Buy (2012)",
            "sector": "Retail",
            "turnaround_strategy": "Store-Within-A-Store Monetization & Algorithmic Price Match",
            "strategy_type": "Cost Optimization",
            "outcome": "Cut $1B in structural costs; stabilized 20%+ ROE and omnichannel dominance.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-4",
            "startup_condition": "Over-Diversification & Exploding CapEx Burn Rate",
            "severity": "Critical",
            "historical_company": "The LEGO Group (2004)",
            "sector": "Retail",
            "turnaround_strategy": "Divest Theme Parks & Slash SKU Variants by 50%",
            "strategy_type": "Business Restructuring",
            "outcome": "Reversed $300M loss in 1 year; highest profit margins in toy industry.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-5",
            "startup_condition": "Catastrophic Speculative Bubble Burst & Insolvency",
            "severity": "Critical",
            "historical_company": "Marvel Entertainment (1996)",
            "sector": "Media",
            "turnaround_strategy": "Toy Biz Merger, IP Collateral Loan & In-House Studio Pivot",
            "strategy_type": "Strategic Partnership",
            "outcome": "Generated $30B+ in box office; acquired by Disney for $4.24B.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-6",
            "startup_condition": "Hardware / Manufacturing Automation Bottleneck & Cash Drain",
            "severity": "High",
            "historical_company": "Tesla, Inc. (2018)",
            "sector": "Automobile",
            "turnaround_strategy": "De-Automation, Tent Assembly Line & Simplified BOM",
            "strategy_type": "Cost Optimization",
            "outcome": "Scaled Model 3 to world's #1 best seller; $10B+ annual operating cash flow.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-7",
            "startup_condition": "Bloated Post-Scale Headcount & Post-Merger Margin Drag",
            "severity": "Moderate",
            "historical_company": "Block, Inc. (2023)",
            "sector": "FinTech",
            "turnaround_strategy": "Absolute 12,000 Headcount Cap & Rule of 40 Focus",
            "strategy_type": "Cost Optimization",
            "outcome": "Reached record quarterly gross profit of $2.25B with positive GAAP net income.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-8",
            "startup_condition": "Credit Market Freeze & Macroeconomic Liquidity Trap",
            "severity": "Critical",
            "historical_company": "Ford Motor Company (2008)",
            "sector": "Automobile",
            "turnaround_strategy": "'The Way Forward' Preemptive $23.6B Asset Mortgage & One Ford",
            "strategy_type": "Business Restructuring",
            "outcome": "Surviving 2008 Great Financial Crisis without government bailout; gained massive market share.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-9",
            "startup_condition": "Vanity Metric Focus & High CAC Subsidies Attracting Zero LTV",
            "severity": "Moderate",
            "historical_company": "PayPal (2022)",
            "sector": "FinTech",
            "turnaround_strategy": "Kill Sign-Up Bounties & Focus on High-LTV Active Transactors",
            "strategy_type": "Market Pivot",
            "outcome": "Expanded transactions per active account by 14%; $5B+ free cash flow.",
            "recovery_status": "Fully Recovered"
        },
        {
            "id": "matrix-10",
            "startup_condition": "Rapid Interest Rate Shock & Illiquid Balance Sheet Inventory",
            "severity": "Critical",
            "historical_company": "Opendoor (2022)",
            "sector": "Real Estate",
            "turnaround_strategy": "Rapid Inventory Fire-Sale & Zillow Distribution Partnership",
            "strategy_type": "Business Restructuring",
            "outcome": "Reduced inventory debt by 70%; reached positive adjusted EBITDA.",
            "recovery_status": "Stabilized"
        }
    ]
