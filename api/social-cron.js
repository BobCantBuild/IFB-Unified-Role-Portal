const { fetchAndCacheSocial } = require('./social');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    console.log('Social cron started at', new Date().toISOString());
    const data = await fetchAndCacheSocial();
    console.log('Social cron done. LI posts:', data.linkedin.length, 'IG posts:', data.instagram.length);
    return res.status(200).json({ ok: true, updatedAt: data.updatedAt });
  } catch (err) {
    console.error('Social cron error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};