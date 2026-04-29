const path = require('path');
const fs   = require('fs');

let modelData = null;

function loadData() {
  if (modelData) return modelData;
  const filePath = path.join(process.cwd(), 'data', 'model-data.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('model-data.json not found at: ' + filePath);
  }
  const raw  = fs.readFileSync(filePath, 'utf-8');
  modelData  = JSON.parse(raw);
  console.log('[model] loaded', modelData.length, 'models');
  return modelData;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const query = (req.query.q || '').trim().toLowerCase();
  if (!query || query.length < 2) {
    return res.status(400).json({ ok: false, error: 'Query too short.' });
  }

  try {
    const data    = loadData();
    const results = data.filter(m =>
      m.model.toLowerCase().includes(query)
    );
    return res.status(200).json({ ok: true, found: results.length > 0, count: results.length, results });
  } catch (err) {
    console.error('[model] error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};