const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });
    redis.on('error', (e) => console.error('Redis error:', e.message));
  }
  return redis;
}

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const CACHE_KEY   = 'ifb_social_v2';
const CACHE_TTL   = 3600;

async function runApifyActor(actorId, input) {
  try {
    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(input),
        signal:  AbortSignal.timeout(8000),
      }
    );
    if (!startRes.ok) return [];

    const startJson = await startRes.json();
    const runId     = startJson.data?.id;
    if (!runId) return [];

    for (let i = 0; i < 15; i++) {
      await new Promise((res) => setTimeout(res, 3000));
      const statusRes  = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
        { signal: AbortSignal.timeout(4000) }
      );
      const statusJson = await statusRes.json();
      const status     = statusJson.data?.status;

      if (status === 'SUCCEEDED') {
        const dataRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`,
          { signal: AbortSignal.timeout(5000) }
        );
        return await dataRes.json();
      }
      if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) break;
    }
  } catch (e) {
    console.error(`runApifyActor error:`, e.message);
  }
  return [];
}

async function fetchAndCacheSocial() {
  const r = getRedis();

  const [liRaw, igRaw] = await Promise.all([
    runApifyActor('A3cAPGpwBEG8RJwse', {
      profileUrls: ['https://www.linkedin.com/company/ifb-industries-ltd/'],
      maxPosts: 3,
    }),
    runApifyActor('dSCLg0C3YEZ83HzYX', {
      usernames:    ['ifbappliances'],
      resultsLimit: 3,
    }),
  ]);

  // ── Instagram ──
  let igPosts = [];
  if (igRaw.length > 0) {
    const latestPosts = igRaw[0].latestPosts || [];
    igPosts = latestPosts.slice(0, 3).map((p) => ({
      platform: 'instagram',
      text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
      url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
      likes:    p.likesCount || p.likes || 0,
      comments: p.commentsCount || p.comments || 0,
      time:     p.timestamp || p.takenAt || null,
    }));
  }

  // ── LinkedIn ──
  const liPosts = liRaw.slice(0, 3).map((p) => ({
    platform: 'linkedin',
    text:     (p.text || p.content || p.commentary || p.description || 'View post on LinkedIn').slice(0, 150),
    url:      p.postUrl || p.shareUrl || p.url || p.link || 'https://www.linkedin.com/company/ifb-industries-ltd',
    likes:    p.reactions || p.likeCount || p.totalReactionCount || p.likes || 0,
    comments: p.commentsCount || p.commentCount || p.comments || 0,
    time:     p.postedAt || p.createdAt || p.publishedAt || p.date || null,
  }));

  const data = {
    linkedin:  liPosts,
    instagram: igPosts,
    updatedAt: new Date().toISOString(),
  };

  try {
    await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);
  } catch (e) {
    console.warn('Redis set failed:', e.message);
  }

  return data;
}

// ── Main handler ──
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const r = getRedis();

  try {
    // Try Redis cache first
    let cached = null;
    try { cached = await r.get(CACHE_KEY); }
    catch (e) { console.warn('Redis get failed:', e.message); }

    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // Cache empty — return empty immediately, let cron fill it
    // Don't block the request waiting for Apify (takes 45+ seconds)
    return res.status(200).json({
      source: 'empty',
      data: { linkedin: [], instagram: [], updatedAt: null },
    });

  } catch (err) {
    console.error('Social API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { linkedin: [], instagram: [], updatedAt: null },
    });
  }
};

module.exports.fetchAndCacheSocial = fetchAndCacheSocial;