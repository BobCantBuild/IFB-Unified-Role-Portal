const { fetchAndCacheSocial } = require('./social');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Debug mode — add ?debug=1 to see raw data
  if (req.query.debug === '1') {
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });
    const cached = await redis.get('ifb_social_v2');
    return res.status(200).json(cached ? JSON.parse(cached) : { empty: true });
  }

  try {
    console.log('Social cron started at', new Date().toISOString());
    const data = await fetchAndCacheSocial();
    console.log('Done. LI:', data.linkedin.length, 'IG:', data.instagram.length);
    return res.status(200).json({ ok: true, updatedAt: data.updatedAt, linkedinCount: data.linkedin.length, instagramCount: data.instagram.length });
  } catch (err) {
    console.error('Social cron error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};