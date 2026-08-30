const express = require('express');
const cors = require('cors');

const overviewRouter = require('./routers/overview');
const crisisRouter = require('./routers/crisis');
const companiesRouter = require('./routers/companies');
const startupsRouter = require('./routers/startups');
const marketRouter = require('./routers/market');

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routers
app.use('/api/overview', overviewRouter);
app.use('/api/crisis', crisisRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/startups', startupsRouter);
app.use('/api/market', marketRouter);

// Root Status Endpoint
app.get('/', (req, res) => {
  res.json({
    system: 'ICLAS - Intelligent Corporate & Leadership Advisory System (Node.js Backend)',
    status: 'operational',
    version: '1.0.0',
    endpoints: [
      '/api/overview/metrics',
      '/api/crisis/search',
      '/api/crisis/strategy/:companyId',
      '/api/crisis/sample-queries',
      '/api/companies',
      '/api/companies/sectors',
      '/api/companies/:companyId',
      '/api/startups',
      '/api/startups/:startupId',
      '/api/startups/submit',
      '/api/startups/contact',
      '/api/startups/intel/evidence-matrix',
      '/api/market/tickers',
      '/api/market/prediction/:ticker'
    ]
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ detail: 'Internal Server Error', error: err.message });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log('==========================================================');
    console.log(' ICLAS Node.js Express API Server Running');
    console.log(` Base API: http://${HOST}:${PORT}`);
    console.log(` Health Check: http://${HOST}:${PORT}/`);
    console.log('==========================================================');
  });
}

module.exports = app;
