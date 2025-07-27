// ...existing code...
// Simple Node.js/Express proxy for OpenAI API
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();



const app = express();

// Basit test endpointi (CORS ve bağlantı testi için)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Global error handler to always set CORS headers
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});
// Her istekte header'ları logla
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Response Headers:', res.getHeaders());
  });
  next();
});
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  console.log("[API] POST /api/openai called. Body:", req.body);
  try {
    const { messages, model, max_tokens } = req.body;
    console.log("[API] Sending request to OpenAI...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model, messages, max_tokens })
    });
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.error('[API] OpenAI response is not valid JSON:', text);
      return res.status(502).json({ error: 'OpenAI response is not valid JSON', details: text });
    }
    console.log('[API] OpenAI API response:', json);
    res.status(response.status).json(json);
  } catch (err) {
    console.error("[API] OpenAI request failed:", err);
    res.status(500).json({ error: 'OpenAI request failed', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenAI proxy server running on port ${PORT}`);
});
