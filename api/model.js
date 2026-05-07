const path = require('path');
const fs   = require('fs');

let frontData = null, topData = null, wdrData = null, dryerData = null;

function load(key, filename) {
  const p = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(p)) throw new Error(filename + ' not found at: ' + p);
  const d = JSON.parse(fs.readFileSync(p, 'utf-8'));
  console.log('[model]', key + ':', d.length);
  return d;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const q    = (req.query.q    || '').trim().toLowerCase();
  const type = (req.query.type || '').trim().toLowerCase();

  if (!q || q.length < 2)
    return res.status(400).json({ ok: false, error: 'Query too short.' });

  try {
    if (!frontData)  frontData  = load('front', 'model-data.json');
    if (!topData)    topData    = load('top',   'topload-model-data.json');
    if (!wdrData)    wdrData    = load('wdr',   'wdr-model-data.json');
    if (!dryerData)  dryerData  = load('dryer', 'dryer-model-data.json');

    let pool = [];
    if      (type === 'front')  pool = frontData;
    else if (type === 'top')    pool = topData;
    else if (type === 'wdr')    pool = wdrData;
    else if (type === 'dryer')  pool = dryerData;
    else pool = [...frontData, ...topData, ...wdrData, ...dryerData];

    const results = pool.filter(m => m.model.toLowerCase().includes(q));
    return res.status(200).json({ ok: true, found: results.length > 0, count: results.length, results });
  } catch (err) {
    console.error('[model]', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
