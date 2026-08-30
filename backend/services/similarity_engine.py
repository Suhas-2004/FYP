import json
import os
import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "companies_data.json")

class CrisisSimilarityEngine:
    def __init__(self):
        self.companies: List[Dict[str, Any]] = []
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=2500
        )
        self.corpus: List[str] = []
        self.tfidf_matrix = None
        self.load_data()

    def load_data(self):
        if not os.path.exists(DATA_PATH):
            self.companies = []
            return
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            self.companies = json.load(f)
        
        self.corpus = []
        for c in self.companies:
            crisis = c.get("crisis_info", {})
            title = crisis.get("crisis_title", "")
            summary = crisis.get("condition_summary", "")
            keywords = " ".join(crisis.get("condition_keywords", []))
            causes = " ".join(crisis.get("root_causes", []))
            strategy = crisis.get("strategy_summary", "")
            sector = c.get("sector", "")
            
            # Combine all rich textual cues for high-fidelity semantic matching
            doc = f"{title} {summary} {keywords} {causes} {strategy} {sector}"
            self.corpus.append(doc)
        
        if self.corpus:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)

    def search_similar_cases(self, query: str, sector_filter: str = "All", threshold: float = 0.2) -> List[Dict[str, Any]]:
        if not self.companies or not query.strip():
            return []
        
        # Clean query
        clean_query = query.strip()
        query_vec = self.vectorizer.transform([clean_query])
        
        # Cosine similarity
        cosine_sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Keyword booster
        query_words = set(re.findall(r'\b\w+\b', clean_query.lower()))
        
        results = []
        for idx, comp in enumerate(self.companies):
            if sector_filter != "All" and comp.get("sector", "").lower() != sector_filter.lower():
                continue
            
            raw_sim = float(cosine_sims[idx])
            crisis = comp.get("crisis_info", {})
            keywords = [k.lower() for k in crisis.get("condition_keywords", [])]
            
            # Boost score based on direct keyword intersections
            matched_kw_count = sum(1 for kw in keywords if any(qw in kw for qw in query_words))
            boost = min(0.35, matched_kw_count * 0.10)
            
            # Combined score mapped to realistic intuitive percentages (55% - 95%)
            combined_score = raw_sim * 0.75 + boost
            if combined_score > 0.05 or raw_sim > 0.05:
                # Normalizing score to look like human-readable confidence 60% - 94%
                normalized_score = min(96.0, max(52.0, (combined_score * 75) + 38.0))
                
                # Extract matched highlights
                matched_keywords = [kw for kw in crisis.get("condition_keywords", []) if any(qw in kw.lower() for qw in query_words)]
                if not matched_keywords:
                    matched_keywords = crisis.get("condition_keywords", [])[:3]

                results.append({
                    "company_id": comp.get("id"),
                    "company_name": comp.get("name"),
                    "ticker": comp.get("ticker"),
                    "sector": comp.get("sector"),
                    "logo_color": comp.get("logo_color"),
                    "crisis_title": crisis.get("crisis_title"),
                    "similar_condition": crisis.get("condition_summary"),
                    "matched_keywords": matched_keywords,
                    "similarity_score": round(normalized_score, 1),
                    "strategy_name": crisis.get("strategy_used"),
                    "strategy_category": crisis.get("strategy_category"),
                    "strategy_summary": crisis.get("strategy_summary"),
                    "root_causes": crisis.get("root_causes", []),
                    "recovery_outcome": crisis.get("recovery_outcome"),
                    "recovery_status": crisis.get("recovery_status"),
                    "recommended_steps_count": len(crisis.get("recommended_steps", []))
                })
        
        # Sort descending by similarity score
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results

    def get_strategy_steps(self, company_id: str) -> Dict[str, Any]:
        for comp in self.companies:
            if comp.get("id") == company_id:
                crisis = comp.get("crisis_info", {})
                return {
                    "company_id": comp.get("id"),
                    "company_name": comp.get("name"),
                    "ticker": comp.get("ticker"),
                    "sector": comp.get("sector"),
                    "logo_color": comp.get("logo_color"),
                    "crisis_title": crisis.get("crisis_title"),
                    "condition_summary": crisis.get("condition_summary"),
                    "strategy_name": crisis.get("strategy_used"),
                    "strategy_category": crisis.get("strategy_category"),
                    "strategy_summary": crisis.get("strategy_summary"),
                    "root_causes": crisis.get("root_causes", []),
                    "steps": crisis.get("recommended_steps", []),
                    "recovery_outcome": crisis.get("recovery_outcome"),
                    "recovery_status": crisis.get("recovery_status"),
                    "leadership": comp.get("leadership", {}),
                    "disclaimer": "These steps are structured case-based historical recommendations synthesized from real-world corporate turnaround playbooks. They represent strategic heuristics and should be tailored to specific startup constraints."
                }
        return {}

# Singleton instance
similarity_engine = CrisisSimilarityEngine()
