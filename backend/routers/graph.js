const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const GRAPH_PATH = path.join(__dirname, '..', 'data', 'graph_data.json');

function loadGraph() {
  if (!fs.existsSync(GRAPH_PATH)) return { nodes: [], edges: [], meta: {} };
  try {
    return JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf-8'));
  } catch (err) {
    console.error('Error reading graph_data.json:', err);
    return { nodes: [], edges: [], meta: {} };
  }
}

// GET /api/graph - full graph (nodes + edges)
router.get('/', (req, res) => {
  const graph = loadGraph();
  res.json(graph);
});

// GET /api/graph/meta - metadata and legend only
router.get('/meta', (req, res) => {
  const graph = loadGraph();
  res.json(graph.meta || {});
});

// GET /api/graph/nodes - all nodes
router.get('/nodes', (req, res) => {
  const { sector, internal } = req.query;
  let nodes = loadGraph().nodes || [];
  if (sector && sector !== 'All') {
    nodes = nodes.filter(n => n.sector === sector);
  }
  if (internal === 'true') {
    nodes = nodes.filter(n => n.is_internal);
  }
  res.json({ count: nodes.length, nodes });
});

// GET /api/graph/edges - all edges, optionally filtered by relationship type
router.get('/edges', (req, res) => {
  const { relationship, nodeId } = req.query;
  let edges = loadGraph().edges || [];
  if (relationship && relationship !== 'All') {
    edges = edges.filter(e => e.relationship === relationship);
  }
  if (nodeId) {
    edges = edges.filter(e => e.source === nodeId || e.target === nodeId);
  }
  res.json({ count: edges.length, edges });
});

// GET /api/graph/node/:id - neighbours of a specific node
router.get('/node/:id', (req, res) => {
  const { id } = req.params;
  const graph = loadGraph();
  const node = graph.nodes?.find(n => n.id === id);
  if (!node) return res.status(404).json({ detail: `Node '${id}' not found` });

  const edges = (graph.edges || []).filter(e => e.source === id || e.target === id);
  const neighbourIds = new Set(edges.flatMap(e => [e.source, e.target]).filter(n => n !== id));
  const neighbours = (graph.nodes || []).filter(n => neighbourIds.has(n.id));

  res.json({ node, neighbours, edges, degree: edges.length });
});

module.exports = router;
