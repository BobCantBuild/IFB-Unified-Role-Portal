const path = require('path');
const fs   = require('fs');

let frontData = null, topData = null, wdrData = null;

function loadFront() {
  if (frontData) return frontData;
  const p = path.join(process.cwd(), 'data', 'model-data.json');
  frontData = JSON.parse(fs.readFileSync(p, 'utf-8'));
  console.log('[model] front:', frontData.length); return frontData;
}
function loadTop() {
  if (topData) return topData;
  const p = path.join(process.cwd(), 'data', 'topload-model-data.json');
  topData = JSON.parse(fs.readFileSync(p, 'utf-8'));
  console.log('[model] top:', topData.length); return topData;
}
function loadWdr() {
  if (wdrData) return wdrData;
  const p = path.join(process.cwd(), 'data', 'wdr-model-data.json');
  wdrData = JSON.parse(fs.readFileSync(p, 'utf-8'));
  console.log('[model] wdr:', wdrData.length); return wdrData;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');
  const query = (req.query.q    || '').trim().toLowerCase();
  const type  = (req.query.type || '').trim().toLowerCase();
  if (!query || query.length < 2)
    return res.status(400).json({ ok: false, error: 'Query too short.' });
  try {
    let pool = [];
    if      (type === 'front') pool = loadFront();
    else if (type === 'top')   pool = loadTop();
    else if (type === 'wdr')   pool = loadWdr();
    else pool = [...loadFront(), ...loadTop(), ...loadWdr()];
    const results = pool.filter(m => m.model.toLowerCase().includes(query));
    return res.status(200).json({ ok: true, found: results.length > 0, count: results.length, results });
  } catch (err) {
    console.error('[model]', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};