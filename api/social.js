// ── Main handler ──
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const r = getRedis();

  try {
    let cached = null;
    try { cached = await r.get(CACHE_KEY); }
    catch (e) { console.warn('Redis get failed:', e.message); }

    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // ✅ Cache is empty — trigger fresh fetch automatically
    console.log('Cache empty — triggering fresh social fetch...');
    const freshData = await fetchAndCacheSocial();
    return res.status(200).json({ source: 'fresh', data: freshData });

  } catch (err) {
    console.error('Social API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { linkedin: [], instagram: [], updatedAt: null },
    });
  }
};