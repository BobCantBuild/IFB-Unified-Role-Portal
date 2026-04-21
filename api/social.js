const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null; // stop retrying
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
      console.error(`Actor start failed ${actorId}: ${startRes.status}`);
      return [];
    }

    const startJson = await startRes.json();
    const runId     = startJson.data?.id;
    if (!runId) { console.error('No runId:', JSON.stringify(startJson)); return []; }

    console.log(`Actor ${actorId} runId: ${runId}`);

    // Poll up to 45 seconds
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes  = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
        { signal: AbortSignal.timeout(4000) }
      );
      const statusJson = await statusRes.json();
      const status     = statusJson.data?.status;
      console.log(`[${actorId}] poll ${i + 1}/15: ${status}`);

      if (status === 'SUCCEEDED') {
        const dataRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`,
          { signal: AbortSignal.timeout(5000) }
        );
        const items = await dataRes.json();
        console.log(`[${actorId}] dataset items count: ${items.length}`);
        return items;
      }
      if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
        console.error(`[${actorId}] ended: ${status}`);
        break;
      }
    }
  } catch (e) {
    console.error(`runApifyActor [${actorId}] error:`, e.message);
  }
  return [];
}

async function fetchAndCacheSocial() {
  const r = getRedis();

  const [liRaw, igRaw] = await Promise.all([
    runApifyActor('WI0tj4Ieb5Kq458gB', {
      startUrls: [{ url: 'https://www.linkedin.com/company/ifb-industries-ltd/' }],
      maxResults: 3,
    }),
    runApifyActor('dSCLg0C3YEZ83HzYX', {
      usernames:    ['ifbappliances'],
      resultsLimit: 3,
    }),
  ]);

  // ── LinkedIn: posts are direct items in dataset ──
  const liPosts = liRaw.slice(0, 3).map((p) => ({
    platform: 'linkedin',
    text:     (p.text || p.commentary || p.description || p.content || 'View post on LinkedIn').slice(0, 150),
    url:      p.url || p.postUrl || p.linkedInUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
    likes:    p.likeCount || p.totalReactionCount || p.likes || 0,
    comments: p.commentCount || p.commentsCount || p.comments || 0,
    time:     p.postedAt || p.createdAt || p.date || null,
  }));

  // ── Instagram: actor returns 1 profile object, posts are inside latestPosts[] ──
  let igPosts = [];
  if (igRaw.length > 0) {
    const profile    = igRaw[0];                          // first (only) profile object
    const latestPosts = profile.latestPosts || [];        // nested posts array
    igPosts = latestPosts.slice(0, 3).map((p) => ({
      platform: 'instagram',
      text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
      url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
      likes:    p.likesCount || p.likes || 0,
      comments: p.commentsCount || p.comments || 0,
      time:     p.timestamp || p.takenAt || null,
    }));
  }

  console.log(`Mapped: ${liPosts.length} LI posts, ${igPosts.length} IG posts`);

  const data = {
    linkedin:  liPosts,
    instagram: igPosts,
    updatedAt: new Date().toISOString(),
  };

  await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);
  return data;
}

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

    return res.status(200).json({
      source: 'pending',
      data: {
        linkedin:  [],
        instagram: [],
        updatedAt: null,
        message:   'Visit /api/social-cron once to trigger first fetch',
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