const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const BRIDGE_SCRIPT = path.join(__dirname, '..', 'services', 'research', 'bridge.py');

/**
 * Helper to invoke python research bridge using stdin JSON protocol
 */
function runBridgePayload(payload) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [BRIDGE_SCRIPT]);
    let stdout = '';
    let stderr = '';

    // Send payload via stdin
    const inputStr = JSON.stringify(payload);
    pythonProcess.stdin.write(inputStr);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0 && !stdout.trim()) {
        return reject(new Error(stderr || `Python bridge process exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        if (stdout.trim()) {
          resolve({ raw: stdout.trim() });
        } else {
          reject(new Error(`Failed to parse bridge output: ${stderr || err.message}`));
        }
      }
    });

    pythonProcess.on('error', (err) => {
      reject(err);
    });
  });
}

// 1. GET /api/research/status
// Returns runtime health, installed models, and guidance
router.get('/status', async (req, res) => {
  try {
    const result = await runBridgePayload({ action: 'check' });
    res.json({
      status: 'success',
      ...result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to inspect local research infrastructure',
      error: err.message
    });
  }
});

// 2. GET /api/research/sources
// Returns permitted domains and curated public feeds
router.get('/sources', async (req, res) => {
  try {
    const result = await runBridgePayload({ action: 'sources' });
    res.json({
      status: 'success',
      ...result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 3. GET /api/research/hardware
// Explains model size, quantization, RAM/VRAM requirements
router.get('/hardware', async (req, res) => {
  try {
    const result = await runBridgePayload({ action: 'hardware' });
    res.json({
      status: 'success',
      guidance: result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 4. POST /api/research/fetch
// Responsibly fetches an allowed public web page or RSS feed
router.post('/fetch', async (req, res) => {
  const { url, refresh } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await runBridgePayload({
      action: 'fetch',
      url,
      refresh: !!refresh
    });
    
    if (result.status === 'blocked') {
      return res.status(403).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 5. POST /api/research/chat
// Multi-turn conversation with local LLM without external API keys
router.post('/chat', async (req, res) => {
  const { messages, model, temperature } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const result = await runBridgePayload({
      action: 'chat',
      messages,
      model,
      temperature: temperature !== undefined ? Number(temperature) : 0.2
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 6. POST /api/research/synthesize
// End-to-end pipeline: Fetches public source and synthesizes intelligence with local AI
router.post('/synthesize', async (req, res) => {
  const { url, query, model } = req.body;
  if (!url || !query) {
    return res.status(400).json({ error: 'Both url and query are required' });
  }

  try {
    // Step 1: Collect source
    const fetchRes = await runBridgePayload({
      action: 'fetch',
      url,
      refresh: false
    });

    if (fetchRes.status === 'blocked' || fetchRes.status === 'error') {
      return res.status(fetchRes.status_code || 400).json({
        status: 'error',
        error: fetchRes.error,
        source: fetchRes
      });
    }

    // Step 2: Synthesize with local model
    const contextContent = (fetchRes.content || '').slice(0, 3000);
    const synthesisPrompt = `You are an expert corporate intelligence analyst at ICLAS.
Analyze the following retrieved public corporate intelligence and answer the user query concisely.

SOURCE TITLE: ${fetchRes.title}
SOURCE URL: ${fetchRes.url}

SOURCE CONTENT:
${contextContent}

USER QUERY:
${query}

Provide a structured, executive summary highlighting key findings, corporate risk factors, and actionable takeaways:`;

    const genRes = await runBridgePayload({
      action: 'generate',
      prompt: synthesisPrompt,
      model,
      temperature: 0.2
    });

    res.json({
      status: 'success',
      query,
      source: {
        title: fetchRes.title,
        url: fetchRes.url,
        domain: fetchRes.domain,
        cached: fetchRes.cached
      },
      synthesis: genRes.response,
      meta: {
        model: genRes.model,
        duration_sec: genRes.total_duration_sec,
        local_inference: true
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// 7. POST /api/research/refresh-companies
// Triggers the automated multi-source company scraper & dataset integrator
router.post('/refresh-companies', (req, res) => {
  const scraperScript = path.join(__dirname, '..', 'services', 'research', 'company_scraper.py');
  const pythonProcess = spawn('python', [scraperScript]);
  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (d) => { stdout += d.toString(); });
  pythonProcess.stderr.on('data', (d) => { stderr += d.toString(); });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Scraper failed',
        error: stderr
      });
    }
    res.json({
      status: 'success',
      message: 'Real-world company datasets successfully refreshed and integrated',
      output: stdout
    });
  });

  pythonProcess.on('error', (err) => {
    res.status(500).json({
      status: 'error',
      message: 'Failed to start scraper process',
      error: err.message
    });
  });
});

module.exports = router;

