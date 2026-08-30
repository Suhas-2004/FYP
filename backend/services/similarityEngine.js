const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'companies_data.json');

const ENGLISH_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have',
  'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where',
  'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

class CrisisSimilarityEngine {
  constructor() {
    this.companies = [];
    this.corpus = [];
    this.vocabulary = new Map(); // term -> index
    this.idf = [];               // index -> idf value
    this.tfidfDocs = [];          // list of sparse or dense vectors
    this.loadData();
  }

  tokenize(text) {
    if (!text) return [];
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !ENGLISH_STOP_WORDS.has(w));
    
    // Unigrams + Bigrams
    const tokens = [...words];
    for (let i = 0; i < words.length - 1; i++) {
      tokens.push(`${words[i]} ${words[i + 1]}`);
    }
    return tokens;
  }

  loadData() {
    if (!fs.existsSync(DATA_PATH)) {
      this.companies = [];
      return;
    }

    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      this.companies = JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse companies data:', err);
      this.companies = [];
      return;
    }

    this.corpus = [];
    for (const c of this.companies) {
      const crisis = c.crisis_info || {};
      const title = crisis.crisis_title || '';
      const summary = crisis.condition_summary || '';
      const keywords = (crisis.condition_keywords || []).join(' ');
      const causes = (crisis.root_causes || []).join(' ');
      const strategy = crisis.strategy_summary || '';
      const sector = c.sector || '';
      const execParagraph = c.executive_analysis_paragraph || '';
      
      const movesText = (c.six_year_downfalls_and_pumps || []).map(m => 
        `${m.title || ''} ${m.reason_behind_move || ''} ${m.strategy_implemented || ''} ${m.move_data || ''}`
      ).join(' ');

      const doc = `${title} ${summary} ${keywords} ${causes} ${strategy} ${sector} ${execParagraph} ${movesText}`;
      this.corpus.push(doc);
    }

    this.fitTfidf();
  }

  fitTfidf() {
    const N = this.corpus.length;
    if (N === 0) return;

    // 1. Build Document Frequencies
    const dfMap = new Map(); // term -> count of documents containing term
    const docTokenCounts = [];

    for (let i = 0; i < N; i++) {
      const tokens = this.tokenize(this.corpus[i]);
      const termCounts = new Map();
      for (const t of tokens) {
        termCounts.set(t, (termCounts.get(t) || 0) + 1);
      }
      docTokenCounts.push(termCounts);

      for (const t of termCounts.keys()) {
        dfMap.set(t, (dfMap.get(t) || 0) + 1);
      }
    }

    // 2. Select top features / vocabulary (up to 2500)
    const sortedTerms = Array.from(dfMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2500);

    this.vocabulary = new Map();
    this.idf = new Array(sortedTerms.length);

    sortedTerms.forEach(([term, df], idx) => {
      this.vocabulary.set(term, idx);
      // Smooth IDF: ln((1 + N) / (1 + df)) + 1
      this.idf[idx] = Math.log((1 + N) / (1 + df)) + 1.0;
    });

    // 3. Compute L2-normalized TF-IDF vector for each document
    this.tfidfDocs = [];
    for (let i = 0; i < N; i++) {
      const termCounts = docTokenCounts[i];
      const vec = new Float64Array(sortedTerms.length);
      let normSq = 0;

      for (const [term, count] of termCounts.entries()) {
        const idx = this.vocabulary.get(term);
        if (idx !== undefined) {
          const tfidf = count * this.idf[idx];
          vec[idx] = tfidf;
          normSq += tfidf * tfidf;
        }
      }

      const norm = Math.sqrt(normSq);
      if (norm > 0) {
        for (let j = 0; j < vec.length; j++) {
          vec[j] /= norm;
        }
      }
      this.tfidfDocs.push(vec);
    }
  }

  vectorizeQuery(query) {
    const tokens = this.tokenize(query);
    const termCounts = new Map();
    for (const t of tokens) {
      termCounts.set(t, (termCounts.get(t) || 0) + 1);
    }

    const vec = new Float64Array(this.idf.length);
    let normSq = 0;
    for (const [term, count] of termCounts.entries()) {
      const idx = this.vocabulary.get(term);
      if (idx !== undefined) {
        const tfidf = count * this.idf[idx];
        vec[idx] = tfidf;
        normSq += tfidf * tfidf;
      }
    }

    const norm = Math.sqrt(normSq);
    if (norm > 0) {
      for (let j = 0; j < vec.length; j++) {
        vec[j] /= norm;
      }
    }
    return vec;
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
    }
    return dot;
  }

  searchSimilarCases(query, sectorFilter = 'All', threshold = 0.2) {
    if (!this.companies || this.companies.length === 0 || !query || !query.trim()) {
      return [];
    }

    const cleanQuery = query.trim();
    const queryVec = this.vectorizeQuery(cleanQuery);
    const queryWords = new Set(
      cleanQuery.toLowerCase().match(/\b\w+\b/g) || []
    );

    const results = [];
    for (let idx = 0; idx < this.companies.length; idx++) {
      const comp = this.companies[idx];
      if (
        sectorFilter &&
        sectorFilter !== 'All' &&
        (comp.sector || '').toLowerCase() !== sectorFilter.toLowerCase()
      ) {
        continue;
      }

      const rawSim = this.cosineSimilarity(queryVec, this.tfidfDocs[idx] || new Float64Array(0));
      const crisis = comp.crisis_info || {};
      const keywords = (crisis.condition_keywords || []).map(k => k.toLowerCase());

      // Keyword booster
      const matchedKwCount = keywords.filter(kw =>
        Array.from(queryWords).some(qw => kw.includes(qw))
      ).length;
      const boost = Math.min(0.35, matchedKwCount * 0.10);

      // Combined score mapped to realistic intuitive percentages (52% - 96%)
      const combinedScore = rawSim * 0.75 + boost;
      if (combinedScore > 0.05 || rawSim > 0.05) {
        const normalizedScore = Math.min(96.0, Math.max(52.0, combinedScore * 75 + 38.0));

        let matchedKeywords = (crisis.condition_keywords || []).filter(kw =>
          Array.from(queryWords).some(qw => kw.toLowerCase().includes(qw))
        );
        if (matchedKeywords.length === 0) {
          matchedKeywords = (crisis.condition_keywords || []).slice(0, 3);
        }

        results.push({
          company_id: comp.id,
          company_name: comp.name,
          ticker: comp.ticker,
          sector: comp.sector,
          logo_color: comp.logo_color,
          logo_url: comp.logo_url,
          crisis_title: crisis.crisis_title,
          similar_condition: crisis.condition_summary,
          matched_keywords: matchedKeywords,
          similarity_score: Math.round(normalizedScore * 10) / 10,
          strategy_name: crisis.strategy_used,
          strategy_category: crisis.strategy_category,
          strategy_summary: crisis.strategy_summary,
          root_causes: crisis.root_causes || [],
          recovery_outcome: crisis.recovery_outcome,
          recovery_status: crisis.recovery_status,
          recommended_steps_count: (crisis.recommended_steps || []).length
        });
      }
    }

    // Sort descending by similarity score
    results.sort((a, b) => b.similarity_score - a.similarity_score);
    return results;
  }

  getStrategySteps(companyId) {
    for (const comp of this.companies) {
      if (comp.id === companyId) {
        const crisis = comp.crisis_info || {};
        return {
          company_id: comp.id,
          company_name: comp.name,
          ticker: comp.ticker,
          sector: comp.sector,
          logo_color: comp.logo_color,
          logo_url: comp.logo_url,
          crisis_title: crisis.crisis_title,
          condition_summary: crisis.condition_summary,
          strategy_name: crisis.strategy_used,
          strategy_category: crisis.strategy_category,
          strategy_summary: crisis.strategy_summary,
          root_causes: crisis.root_causes || [],
          steps: crisis.recommended_steps || [],
          recovery_outcome: crisis.recovery_outcome,
          recovery_status: crisis.recovery_status,
          leadership: comp.leadership || {},
          disclaimer:
            'These steps are structured case-based historical recommendations synthesized from real-world corporate turnaround playbooks. They represent strategic heuristics and should be tailored to specific startup constraints.'
        };
      }
    }
    return null;
  }
}

const similarityEngine = new CrisisSimilarityEngine();

module.exports = {
  similarityEngine,
  CrisisSimilarityEngine
};
