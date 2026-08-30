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

  // Stock Market & Predictions
  getTickers: () => fetchJson('/api/market/tickers'),
  getStockPrediction: (ticker, timeframe = '1D') => 
    fetchJson(`/api/market/prediction/${ticker}?timeframe=${timeframe}`),
};
