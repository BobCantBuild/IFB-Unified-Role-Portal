const { fetchAndCacheSocial } = require('./social');
const Redis = require('ioredis');

function getRedis() {
  return new Redis(process.env.REDIS_URL, {
    connectTimeout: 5000,
    maxRetriesPerRequest: 2,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const redis = getRedis();

  try {
    // ?debug=1 — show cached data
    if (req.query.debug === '1') {
      const cached = await redis.get('ifb_social_v2');
      return res.status(200).json(cached ? JSON.parse(cached) : { empty: true });
    }

    // ?clear=1 — delete cache key, force fresh fetch next cron
    if (req.query.clear === '1') {
      await redis.del('ifb_social_v2');
      return res.status(200).json({ ok: true, message: 'Cache cleared. Now hit /api/social-cron to refetch.' });
    }

    // Normal run — fetch and cache
    console.log('Social cron started:', new Date().toISOString());
    const data = await fetchAndCacheSocial();
    console.log('Done. LI:', data.linkedin.length, 'IG:', data.instagram.length);
    return res.status(200).json({
      ok: true,
      updatedAt: data.updatedAt,
      linkedinCount: data.linkedin.length,
      instagramCount: data.instagram.length,
    });

  } catch (err) {
    console.error('Cron error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};