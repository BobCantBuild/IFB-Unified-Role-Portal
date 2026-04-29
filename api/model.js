const path = require('path');
const fs   = require('fs');

let modelData = null;

function loadData() {
  if (modelData) return modelData;
  const filePath = path.join(process.cwd(), 'data', 'model-data.json');
  const raw      = fs.readFileSync(filePath, 'utf-8');
  modelData      = JSON.parse(raw);
  return modelData;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = (req.query.q || '').trim().toLowerCase();
  if (!query || query.length < 2) {
    return res.status(400).json({ ok: false, error: 'Query too short.' });
  }

  try {
    const data    = loadData();
    const results = data.filter(m =>
      m.model.toLowerCase().includes(query)
    );

    if (!results.length) {
      return res.status(200).json({ ok: true, found: false, results: [] });
    }

    return res.status(200).json({ ok: true, found: true, results });
  } catch (err) {
    console.error('[model] error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};