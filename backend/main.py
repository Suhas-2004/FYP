from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.crisis import router as crisis_router
from routers.companies import router as companies_router
from routers.startups import router as startups_router
from routers.market import router as market_router
from routers.overview import router as overview_router

app = FastAPI(
    title="ICLAS - Intelligent Corporate & Leadership Advisory System API",
    description="Case-based corporate intelligence, turnaround decision support, startup-investor matchmaking, and market prediction platform.",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(overview_router)
app.include_router(crisis_router)
app.include_router(companies_router)
app.include_router(startups_router)
app.include_router(market_router)

@app.get("/")
def root():
    return {
        "system": "ICLAS - Intelligent Corporate & Leadership Advisory System",
        "status": "operational",
        "endpoints": [
            "/api/overview/metrics",
            "/api/crisis/search",
            "/api/crisis/strategy/{company_id}",
            "/api/companies",
            "/api/startups",
            "/api/startups/intel/evidence-matrix",
            "/api/market/tickers",
            "/api/market/prediction/{ticker}"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
