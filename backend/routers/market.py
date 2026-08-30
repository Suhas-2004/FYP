from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.prediction_engine import prediction_engine

router = APIRouter(prefix="/api/market", tags=["Market & Stock Prediction"])

@router.get("/tickers")
def get_tickers():
    return prediction_engine.get_available_tickers()

@router.get("/prediction/{ticker}")
def get_stock_prediction(
    ticker: str,
    timeframe: Optional[str] = Query("1D", description="Chart timeframe: 4H, 1D, 1W, 1M")
):
    try:
        data = prediction_engine.get_stock_analysis(ticker, timeframe=timeframe)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction engine error: {str(e)}")
