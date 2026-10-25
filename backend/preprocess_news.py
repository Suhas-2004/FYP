import os
import json
import datetime
import pandas as pd
import numpy as np

def preprocess_news_dataset():
    parquet_path = os.path.join(os.path.dirname(__file__), '..', 'news', 'data', 'train-00000-of-00001.parquet')
    output_path = os.path.join(os.path.dirname(__file__), 'data', 'news_sentiment.json')
    
    print(f"Reading parquet from: {parquet_path}")
    if not os.path.exists(parquet_path):
        raise FileNotFoundError(f"Parquet file not found at {parquet_path}")
    
    df = pd.read_parquet(parquet_path)
    print(f"Total rows loaded: {len(df)}")
    
    # Clean data & fill NAs
    df['title'] = df['title'].fillna('').astype(str).str.strip()
    df['pub_date'] = df['pub_date'].fillna('').astype(str)
    df['reasoning'] = df['reasoning'].fillna('').astype(str).str.strip()
    df['rss_url'] = df['rss_url'].fillna('').astype(str)
    df['company'] = df['company'].fillna(df['ticker']).astype(str)
    df['long_s'] = pd.to_numeric(df['long_s'], errors='coerce').fillna(0.0)
    df['short_s'] = pd.to_numeric(df['short_s'], errors='coerce').fillna(0.0)
    df['confidence'] = pd.to_numeric(df['confidence'], errors='coerce').fillna(0.0)
    df['relevance'] = pd.to_numeric(df['relevance'], errors='coerce').fillna(0.0)
    
    # Determine sentiment label helper
    def get_sentiment_label(long_s, short_s):
        diff = long_s - short_s
        if diff >= 0.2:
            return "Bullish"
        elif diff <= -0.2:
            return "Bearish"
        else:
            return "Neutral"

    # Add sentiment diff & label
    df['net_sentiment'] = df['long_s'] - df['short_s']
    
    tickers_summary = {}
    all_tickers = sorted(df['ticker'].unique().tolist())
    
    total_articles = len(df)
    market_avg_long = float(df['long_s'].mean())
    market_avg_short = float(df['short_s'].mean())
    
    print(f"Processing {len(all_tickers)} tickers...")
    
    for ticker in all_tickers:
        tdf = df[df['ticker'] == ticker].copy()
        company_name = tdf['company'].iloc[0] if len(tdf) > 0 else ticker
        
        avg_long = float(tdf['long_s'].mean())
        avg_short = float(tdf['short_s'].mean())
        net_score = round((avg_long - avg_short) * 100, 2)
        
        if net_score >= 15:
            overall_label = "Strongly Bullish"
        elif net_score >= 5:
            overall_label = "Moderately Bullish"
        elif net_score <= -15:
            overall_label = "Strongly Bearish"
        elif net_score <= -5:
            overall_label = "Moderately Bearish"
        else:
            overall_label = "Neutral"
            
        # Yearly distribution
        tdf['year'] = tdf['pub_date'].str[:4]
        yearly_counts = tdf['year'].value_counts().to_dict()
        yearly_clean = {str(k): int(v) for k, v in sorted(yearly_counts.items()) if k.isdigit()}
        
        # Monthly timeline (aggregate recent sentiment trend)
        tdf['year_month'] = tdf['pub_date'].str[:7]
        monthly_grp = tdf.groupby('year_month').agg({
            'long_s': 'mean',
            'short_s': 'mean',
            'ticker': 'count'
        }).rename(columns={'ticker': 'count'}).reset_index()
        
        monthly_trend = []
        for _, row in monthly_grp.tail(24).iterrows():
            if str(row['year_month']).startswith('20'):
                monthly_trend.append({
                    "month": str(row['year_month']),
                    "bullish": round(float(row['long_s']), 3),
                    "bearish": round(float(row['short_s']), 3),
                    "articles": int(row['count'])
                })
        
        # High relevance recent articles
        # Sort by pub_date descending, relevance descending
        high_rel = tdf[tdf['relevance'] >= 0.5]
        if len(high_rel) < 20:
            high_rel = tdf
            
        recent_sorted = high_rel.sort_values(by=['pub_date', 'confidence', 'relevance'], ascending=[False, False, False]).head(25)
        
        articles = []
        for _, row in recent_sorted.iterrows():
            articles.append({
                "hash": str(row['hash']),
                "title": str(row['title']),
                "pub_date": str(row['pub_date']),
                "rss_url": str(row['rss_url']),
                "long_s": round(float(row['long_s']), 3),
                "short_s": round(float(row['short_s']), 3),
                "net_sentiment": round(float(row['net_sentiment']), 3),
                "confidence": round(float(row['confidence']), 3),
                "relevance": round(float(row['relevance']), 3),
                "sentiment_label": get_sentiment_label(row['long_s'], row['short_s']),
                "reasoning": str(row['reasoning'])
            })
            
        tickers_summary[ticker] = {
            "ticker": ticker,
            "company": company_name,
            "total_articles": len(tdf),
            "avg_long_s": round(avg_long, 4),
            "avg_short_s": round(avg_short, 4),
            "sentiment_score": net_score,
            "sentiment_label": overall_label,
            "avg_confidence": round(float(tdf['confidence'].mean()), 3),
            "avg_relevance": round(float(tdf['relevance'].mean()), 3),
            "yearly_counts": yearly_clean,
            "timeline": monthly_trend,
            "recent_articles": articles
        }
        
    # Top market-wide headlines
    market_top = df[(df['relevance'] >= 0.7) & (df['confidence'] >= 0.7)].sort_values(
        by=['pub_date', 'confidence', 'relevance'], ascending=[False, False, False]
    ).head(40)
    
    top_headlines = []
    for _, row in market_top.iterrows():
        top_headlines.append({
            "ticker": str(row['ticker']),
            "company": str(row['company']),
            "hash": str(row['hash']),
            "title": str(row['title']),
            "pub_date": str(row['pub_date']),
            "rss_url": str(row['rss_url']),
            "long_s": round(float(row['long_s']), 3),
            "short_s": round(float(row['short_s']), 3),
            "confidence": round(float(row['confidence']), 3),
            "relevance": round(float(row['relevance']), 3),
            "sentiment_label": get_sentiment_label(row['long_s'], row['short_s']),
            "reasoning": str(row['reasoning'])
        })
        
    output_data = {
        "meta": {
            "title": "NAS-100 Financial News Sentiment Dataset Summary",
            "source": "AlfonsoLozana/news",
            "total_articles": total_articles,
            "tickers_count": len(all_tickers),
            "tickers_list": all_tickers,
            "date_range": {
                "start": str(df['pub_date'].min()),
                "end": str(df['pub_date'].max())
            },
            "generated_at": datetime.datetime.utcnow().isoformat() + "Z"
        },
        "market_summary": {
            "avg_bullish": round(market_avg_long, 4),
            "avg_bearish": round(market_avg_short, 4),
            "overall_sentiment": round((market_avg_long - market_avg_short) * 100, 2),
            "total_articles": total_articles
        },
        "tickers": tickers_summary,
        "top_headlines": top_headlines
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Successfully generated {output_path} ({file_size_mb:.2f} MB)")

if __name__ == '__main__':
    preprocess_news_dataset()
