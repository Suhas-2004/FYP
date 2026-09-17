const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'investors_data.json');

function loadInvestors() {
  if (!fs.existsSync(DATA_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (err) {
    console.error('Error reading investors_data.json:', err);
    return [];
  }
}

// GET /api/investors - list all investors with optional filters
router.get('/', (req, res) => {
  const { type = 'All', focus = 'All', stage = 'All', geography = 'All' } = req.query;

  let investors = loadInvestors();

  if (type && type !== 'All') {
    investors = investors.filter(i => i.type?.toLowerCase().includes(type.toLowerCase()));
  }
  if (focus && focus !== 'All') {
    investors = investors.filter(i =>
      (i.investment_focus || []).some(f => f.toLowerCase().includes(focus.toLowerCase()))
    );
  }
  if (stage && stage !== 'All') {
    investors = investors.filter(i =>
      (i.stage_preference || []).includes(stage)
    );
  }
  if (geography && geography !== 'All') {
    investors = investors.filter(i =>
      (i.geography || []).some(g => g.toLowerCase().includes(geography.toLowerCase()))
    );
  }

  res.json({ count: investors.length, investors });
});

// GET /api/investors/:id - single investor profile
router.get('/:id', (req, res) => {
  const investors = loadInvestors();
  const investor = investors.find(i => i.id === req.params.id);
  if (!investor) return res.status(404).json({ detail: 'Investor not found' });
  res.json(investor);
});

// GET /api/investors/meta/filters - unique filter values for frontend dropdowns
router.get('/meta/filters', (req, res) => {
  const investors = loadInvestors();
  const types = [...new Set(investors.map(i => i.type))].sort();
  const stages = [...new Set(investors.flatMap(i => i.stage_preference || []))];
  const stageOrder = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];
  const sortedStages = stageOrder.filter(s => stages.includes(s));
  const geos = [...new Set(investors.flatMap(i => i.geography || []))].sort();
  res.json({ types, stages: sortedStages, geographies: geos });
});

module.exports = router;
