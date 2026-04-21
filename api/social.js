const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
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
        signal:  AbortSignal.timeout(5000),
      }
    );
    const startJson = await startRes.json();
    const runId     = startJson.data?.id;
    if (!runId) { console.error('No runId returned for actor:', actorId); return []; }

    // Poll for up to 45 seconds (used by cron — not by user requests)
    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const statusRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
        { signal: AbortSignal.timeout(4000) }
      );
      const statusJson = await statusRes.json();
      const status     = statusJson.data?.status;

      if (status === 'SUCCEEDED') {
        const dataRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=3`,
          { signal: AbortSignal.timeout(4000) }
        );
        return await dataRes.json();
      }
      if (status === 'FAILED' || status === 'ABORTED') {
        console.error('Actor run failed:', actorId, status);
        break;
      }
    }
  } catch (e) {
    console.error('runApifyActor error:', actorId, e.message);
  }
  return [];
}

async function fetchAndCacheSocial() {
  const r = getRedis();

  const [liItems, igItems] = await Promise.all([
    runApifyActor('apidojo~linkedin-company-posts-scraper', {
      companyUrls: ['https://www.linkedin.com/company/ifb-industries-ltd'],
      maxResults:  3,
    }),
    runApifyActor('apify~instagram-profile-scraper', {
      usernames:    ['ifbappliances'],
      resultsLimit: 3,
    }),
  ]);

  const data = {
    linkedin: liItems.map((p) => ({
      platform: 'linkedin',
      text:     (p.text || p.commentary || 'View post on LinkedIn').slice(0, 150),
      url:      p.url || p.postUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes:    p.likeCount || p.totalReactionCount || 0,
      comments: p.commentCount || 0,
      time:     p.postedAt || p.createdAt || null,
    })),
    instagram: igItems.map((p) => ({
      platform: 'instagram',
      text:     (p.caption || 'View post on Instagram').slice(0, 150),
      url:      p.url || 'https://www.instagram.com/ifbappliances',
      likes:    p.likesCount || 0,
      comments: p.commentsCount || 0,
      time:     p.timestamp || null,
    })),
    updatedAt: new Date().toISOString(),
  };

  await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);
  return data;
}

// ── Main handler (serves cached data instantly) ──
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const r = getRedis();

  try {
    let cached = null;
    try {
      cached = await r.get(CACHE_KEY);
    } catch (e) {
      console.warn('Redis get failed:', e.message);
    }

    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // No cache yet — return pending state, cron will fill it
    return res.status(200).json({
      source: 'pending',
      data: {
        linkedin:  [],
        instagram: [],
        updatedAt: null,
        message:   'Posts loading — visit /api/social-cron once to trigger first fetch',
      },
    });

  } catch (err) {
    console.error('Social API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { linkedin: [], instagram: [], updatedAt: null },
    });
  }
};

// ── Exported for cron job ──
module.exports.fetchAndCacheSocial = fetchAndCacheSocial;