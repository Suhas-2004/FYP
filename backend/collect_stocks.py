"""
ICLAS Real-Time Stock Data Collector
Run this script to collect real OHLCV data for all tickers.
Output: backend/data/stocks_data.json

Usage:
    cd d:\\MjrProject\\FYP\\backend
    python collect_stocks.py
"""

import yfinance as yf
import json
import os
from datetime import datetime, timezone

# All tickers used in your ICLAS project
TICKERS = [
    'JPM', 'WFC', 'BAC', 'HSBC', 'AAPL', 'GOOGL', 'MSFT',
    'META', 'AMZN', 'BABA', 'T', 'WMT', 'TSLA', 'NFLX',
    'NVDA', 'MRNA', 'XYZ', 'PYPL', 'V', 'MA'  # XYZ = Block Inc. (formerly SQ)
]

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'data', 'stocks_data.json')


def collect_ticker(ticker: str) -> dict:
    """Collect 2 years of daily OHLCV + technical indicators for a ticker."""
    print(f"  Fetching {ticker}...")
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="2y", interval="1d")
        info = stock.info

        if hist.empty:
            print(f"  WARNING: No data returned for {ticker}")
            return None

        # Build OHLCV rows
        ohlcv = []
        closes = []
        for date, row in hist.iterrows():
            close = round(float(row['Close']), 2)
            closes.append(close)

            # SMA 20
            window = closes[-20:]
            sma_20 = round(sum(window) / len(window), 2)

            # EMA 50 (simplified)
            if len(closes) >= 2:
                prev_ema = ohlcv[-1]['ema_50'] if ohlcv else sma_20
                k = 2 / (50 + 1)
                ema_50 = round(close * k + prev_ema * (1 - k), 2)
            else:
                ema_50 = sma_20

            # RSI 14
            rsi = 50.0
            if len(closes) > 14:
                deltas = [closes[i] - closes[i-1] for i in range(1, len(closes))]
                gains = [d for d in deltas[-14:] if d > 0]
                losses = [-d for d in deltas[-14:] if d < 0]
                avg_gain = sum(gains) / 14 if gains else 0.001
                avg_loss = sum(losses) / 14 if losses else 0.001
                rs = avg_gain / avg_loss
                rsi = round(100 - (100 / (1 + rs)), 2)

            # MACD
            macd = round(close - ema_50, 2)
            macd_signal = round(macd * 0.82, 2)

            # Bollinger Bands
            std = (sum((c - sma_20)**2 for c in window) / len(window)) ** 0.5
            bollinger_upper = round(sma_20 + 2 * std, 2)
            bollinger_lower = round(sma_20 - 2 * std, 2)

            ohlcv.append({
                "date": str(date.date()),
                "open": round(float(row['Open']), 2),
                "high": round(float(row['High']), 2),
                "low": round(float(row['Low']), 2),
                "close": close,
                "volume": int(row['Volume']),
                "sma_20": sma_20,
                "ema_50": ema_50,
                "rsi_14": rsi,
                "macd": macd,
                "macd_signal": macd_signal,
                "bollinger_upper": bollinger_upper,
                "bollinger_lower": bollinger_lower,
            })

        latest = ohlcv[-1]
        prev = ohlcv[-2] if len(ohlcv) > 1 else ohlcv[-1]
        day_change = round(latest['close'] - prev['close'], 2)
        day_change_pct = round((day_change / prev['close']) * 100, 2)

        return {
            "ticker": ticker,
            "collected_at": datetime.now(timezone.utc).isoformat(),  # timezone-aware UTC
            "info": {
                "name": info.get("longName", ticker),
                "sector": info.get("sector", "Unknown"),
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE"),
                "52w_high": info.get("fiftyTwoWeekHigh"),
                "52w_low": info.get("fiftyTwoWeekLow"),
                "beta": info.get("beta"),
                "dividend_yield": info.get("dividendYield"),
            },
            "current_price": latest['close'],
            "day_change": day_change,
            "day_change_percent": day_change_pct,
            "ohlcv": ohlcv
        }

    except Exception as e:
        print(f"  ERROR collecting {ticker}: {e}")
        return None


def main():
    print("=" * 50)
    print("ICLAS Stock Data Collector")
    print(f"Collecting {len(TICKERS)} tickers...")
    print("=" * 50)

    dataset = {}
    failed = []

    for ticker in TICKERS:
        result = collect_ticker(ticker)
        if result:
            dataset[ticker] = result
            rows = len(result['ohlcv'])
            print(f"  OK {ticker} — {rows} days, latest close: ${result['current_price']}")
        else:
            failed.append(ticker)

    # Save to JSON
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(dataset, f, indent=2)

    print("\n" + "=" * 50)
    print(f"Saved {len(dataset)} tickers to: {OUTPUT_PATH}")
    if failed:
        print(f"Failed tickers: {failed}")
    print("=" * 50)


if __name__ == "__main__":
    main()
