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

// LinkedIn actor: WI0tj4Ieb5Kq458gB
// Instagram actor: dSCLg0C3YEZ83HzYX

async function runApifyActor(actorId, input) {
  try {
    console.log(`Starting actor ${actorId}...`);
    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(input),
        signal:  AbortSignal.timeout(8000),
      }
    );

    if (!startRes.ok) {
      console.error(`Actor start failed ${actorId}: ${startRes.status} ${await startRes.text()}`);
      return [];
    }

    const startJson = await startRes.json();
    const runId     = startJson.data?.id;
    if (!runId) {
      console.error('No runId returned:', JSON.stringify(startJson));
      return [];
    }

    console.log(`Actor ${actorId} started, runId: ${runId}`);

    // Poll until done — max 45 seconds
    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusRes  = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
        { signal: AbortSignal.timeout(4000) }
      );
      const statusJson = await statusRes.json();
      const status     = statusJson.data?.status;
      console.log(`Actor ${actorId} status [${i+1}/15]: ${status}`);

      if (status === 'SUCCEEDED') {
        const dataRes  = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=3`,
          { signal: AbortSignal.timeout(5000) }
        );
        const items = await dataRes.json();
        console.log(`Actor ${actorId} returned ${items.length} items`);
        return items;
      }

      if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        console.error(`Actor ${actorId} ended with status: ${status}`);
        break;
      }
    }
  } catch (e) {
    console.error(`runApifyActor error [${actorId}]:`, e.message);
  }
  return [];
}

async function fetchAndCacheSocial() {
  const r = getRedis();

  const [liItems, igItems] = await Promise.all([
    runApifyActor('WI0tj4Ieb5Kq458gB', {
      startUrls: [{ url: 'https://www.linkedin.com/company/ifb-industries-ltd/' }],
      maxResults: 3,
    }),
    runApifyActor('dSCLg0C3YEZ83HzYX', {
      usernames:    ['ifbappliances'],
      resultsLimit: 3,
    }),
  ]);

  const data = {
    linkedin: liItems.map((p) => ({
      platform: 'linkedin',
      text:     (p.text || p.commentary || p.description || 'View post on LinkedIn').slice(0, 150),
      url:      p.url || p.postUrl || p.linkedInUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes:    p.likeCount || p.totalReactionCount || p.likes || 0,
      comments: p.commentCount || p.comments || 0,
      time:     p.postedAt || p.createdAt || p.date || null,
    })),
    instagram: igItems.map((p) => ({
      platform: 'instagram',
      text:     (p.caption || p.text || p.description || 'View post on Instagram').slice(0, 150),
      url:      p.url || p.shortCode
                  ? `https://www.instagram.com/p/${p.shortCode}/`
                  : 'https://www.instagram.com/ifbappliances',
      likes:    p.likesCount || p.likes || 0,
      comments: p.commentsCount || p.comments || 0,
      time:     p.timestamp || p.takenAt || null,
    })),
    updatedAt: new Date().toISOString(),
  };

  console.log(`Cached: ${data.linkedin.length} LI posts, ${data.instagram.length} IG posts`);
  await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);
  return data;
}

// ── Main handler (serves from cache instantly) ──
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

    return res.status(200).json({
      source: 'pending',
      data: {
        linkedin:  [],
        instagram: [],
        updatedAt: null,
        message:   'Posts loading — visit /api/social-cron to trigger first fetch',
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

module.exports.fetchAndCacheSocial = fetchAndCacheSocial;