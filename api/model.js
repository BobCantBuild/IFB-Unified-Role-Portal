const path = require('path');
const fs   = require('fs');

let frontData = null;
let topData   = null;

function loadFront() {
  if (frontData) return frontData;
  const filePath = path.join(process.cwd(), 'data', 'model-data.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('model-data.json not found at: ' + filePath);
  }
  frontData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log('[model] front-load loaded:', frontData.length, 'models');
  return frontData;
}

function loadTop() {
  if (topData) return topData;
  const filePath = path.join(process.cwd(), 'data', 'topload-model-data.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('topload-model-data.json not found at: ' + filePath);
  }
  topData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log('[model] top-load loaded:', topData.length, 'models');
  return topData;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const query = (req.query.q    || '').trim().toLowerCase();
  const type  = (req.query.type || '').trim().toLowerCase(); // 'front' | 'top' | ''

  if (!query || query.length < 2) {
    return res.status(400).json({ ok: false, error: 'Query too short.' });
  }

  try {
    let pool = [];
    if (type === 'front')    pool = loadFront();
    else if (type === 'top') pool = loadTop();
    else                     pool = [...loadFront(), ...loadTop()];

    const results = pool.filter(m => m.model.toLowerCase().includes(query));
    return res.status(200).json({ ok: true, found: results.length > 0, count: results.length, results });
  } catch (err) {
    console.error('[model] error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};