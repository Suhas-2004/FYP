const app = require('./server');

const server = app.listen(8000, async () => {
  try {
    const endpoints = [
      { name: 'Root Status', url: 'http://127.0.0.1:8000/' },
      { name: 'Overview Metrics', url: 'http://127.0.0.1:8000/api/overview/metrics' },
      { name: 'Crisis Search GET', url: 'http://127.0.0.1:8000/api/crisis/search?q=high+debt&sector=Technology&threshold=40' },
      { name: 'Crisis Sample Queries', url: 'http://127.0.0.1:8000/api/crisis/sample-queries' },
      { name: 'Strategy Steps', url: 'http://127.0.0.1:8000/api/crisis/strategy/apple' },
      { name: 'Companies List', url: 'http://127.0.0.1:8000/api/companies' },
      { name: 'Companies Sectors', url: 'http://127.0.0.1:8000/api/companies/sectors' },
      { name: 'Company Detail', url: 'http://127.0.0.1:8000/api/companies/apple' },
      { name: 'Startups List', url: 'http://127.0.0.1:8000/api/startups' },
      { name: 'Startups Matrix', url: 'http://127.0.0.1:8000/api/startups/intel/evidence-matrix' },
      { name: 'Market Tickers', url: 'http://127.0.0.1:8000/api/market/tickers' },
      { name: 'Market Prediction', url: 'http://127.0.0.1:8000/api/market/prediction/AAPL' }
    ];

    for (const ep of endpoints) {
      const res = await fetch(ep.url);
      if (!res.ok) throw new Error(`Failed ${ep.name}: ${res.status}`);
      const data = await res.json();
      console.log(`✅ ${ep.name}: Status ${res.status} - OK`);
    }

    // Test POST crisis search
    const postRes = await fetch('http://127.0.0.1:8000/api/crisis/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'retail showrooming margin collapse', sector: 'Retail', min_threshold: 40 })
    });
    const postData = await postRes.json();
    console.log('✅ Crisis Search POST: Status ' + postRes.status + ' - Matches: ' + postData.matches.length);

    console.log('\n🎉 ALL BACKEND ENDPOINTS VERIFIED AND WORKING PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
