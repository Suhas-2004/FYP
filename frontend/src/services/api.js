const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Overview Dashboard
  getOverviewMetrics: () => fetchJson('/api/overview/metrics'),

  // Crisis Similarity Search
  searchCrisis: (query, sector = 'All', threshold = 40.0) => 
    fetchJson(`/api/crisis/search?q=${encodeURIComponent(query)}&sector=${encodeURIComponent(sector)}&threshold=${threshold}`),
  
  getSampleQueries: () => fetchJson('/api/crisis/sample-queries'),
  getStrategySteps: (companyId) => fetchJson(`/api/crisis/strategy/${companyId}`),

  // Companies Intelligence
  getCompanies: (sector = 'All') => fetchJson(`/api/companies?sector=${encodeURIComponent(sector)}`),
  getCompanySectors: () => fetchJson('/api/companies/sectors'),
  getCompanyDetail: (companyId) => fetchJson(`/api/companies/${companyId}`),

  // Startups & Investors
  getStartups: (industry = 'All', potential = 'All') => 
    fetchJson(`/api/startups?industry=${encodeURIComponent(industry)}&potential=${encodeURIComponent(potential)}`),
  getStartupDetail: (id) => fetchJson(`/api/startups/${id}`),
  submitStartup: (data) => fetchJson('/api/startups/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  contactStartup: (inquiryData) => fetchJson('/api/startups/contact', {
    method: 'POST',
    body: JSON.stringify(inquiryData),
  }),
  getEvidenceMatrix: () => fetchJson('/api/startups/intel/evidence-matrix'),
  getInvestors: (type = 'All', focus = 'All', stage = 'All') => 
    fetchJson(`/api/investors?type=${encodeURIComponent(type)}&focus=${encodeURIComponent(focus)}&stage=${encodeURIComponent(stage)}`),
  getInvestorDetail: (id) => fetchJson(`/api/investors/${id}`),
  getInvestorFilters: () => fetchJson('/api/investors/meta/filters'),

  // Stock Market & Predictions
  getTickers: () => fetchJson('/api/market/tickers'),
  getStockPrediction: (ticker, timeframe = '1D') => 
    fetchJson(`/api/market/prediction/${ticker}?timeframe=${timeframe}`),

  // Company Relationship Graph (DS-6)
  getGraph: () => fetchJson('/api/graph'),
  getGraphNode: (id) => fetchJson(`/api/graph/node/${id}`),
  getGraphEdges: (relationship = 'All') =>
    fetchJson(`/api/graph/edges?relationship=${encodeURIComponent(relationship)}`),

  // Investor Profiles (DS-4)
  getInvestors: (stage = 'All', type = 'All') =>
    fetchJson(`/api/investors?stage=${encodeURIComponent(stage)}&type=${encodeURIComponent(type)}`),
  getInvestorFilters: () => fetchJson('/api/investors/meta/filters'),

  // Financial News Sentiment (HuggingFace AlfonsoLozana/news)
  getNewsOverview: () => fetchJson('/api/news/overview'),
  getNewsTickers: () => fetchJson('/api/news/tickers'),
  getTopHeadlines: (params = {}) => {
    const q = new URLSearchParams();
    if (params.ticker) q.append('ticker', params.ticker);
    if (params.sentiment) q.append('sentiment', params.sentiment);
    if (params.limit) q.append('limit', params.limit);
    return fetchJson(`/api/news/top-headlines?${q.toString()}`);
  },
  getNewsSentiment: (ticker) => fetchJson(`/api/news/sentiment/${ticker}`),

  // Public-Web Research & Local AI (Phase 3)
  getResearchStatus: () => fetchJson('/api/research/status'),
  getResearchSources: () => fetchJson('/api/research/sources'),
  getResearchHardware: () => fetchJson('/api/research/hardware'),
  fetchPublicSource: (url, refresh = false) => fetchJson('/api/research/fetch', {
    method: 'POST',
    body: JSON.stringify({ url, refresh }),
  }),
  chatResearchLocal: (messages, model = null, temperature = 0.2) => fetchJson('/api/research/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, model, temperature }),
  }),
  synthesizeResearch: (url, query, model = null) => fetchJson('/api/research/synthesize', {
    method: 'POST',
    body: JSON.stringify({ url, query, model }),
  }),
};
