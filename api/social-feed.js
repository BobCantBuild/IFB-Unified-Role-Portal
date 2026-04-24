const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) { if (times > 3) return null; return Math.min(times * 200, 1000); },
      tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
    });
    redis.on('error', e => console.error('Redis:', e.message));
  }
  return redis;
}

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const CACHE_KEY   = 'ifb_social_v4';
const CACHE_TTL   = 86400; // 24 hours

// ── Run actor and wait for result internally ──
async function runAndCollect(actorId, input) {
  try {
    // Start actor
    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: AbortSignal.timeout(8000) }
    );
    const runId = (await startRes.json()).data?.id;
    if (!runId) { console.error('No runId for', actorId); return []; }

    // Poll until done (max 3 min)
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 9000));
      const status = (await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`, { signal: AbortSignal.timeout(5000) }).then(r => r.json())).data?.status;
      console.log(`${actorId} [${i+1}]: ${status}`);
      if (status === 'SUCCEEDED') {
        const items = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`, { signal: AbortSignal.timeout(5000) }).then(r => r.json());
        console.log(`${actorId} items: ${items.length}`, JSON.stringify(items[0] || {}).slice(0, 300));
        return Array.isArray(items) ? items : [];
      }
      if (['FAILED','ABORTED','TIMED-OUT'].includes(status)) { console.error(`${actorId} failed: ${status}`); return []; }
    }
  } catch(e) { console.error(`runAndCollect error ${actorId}:`, e.message); }
  return [];
}

async function fetchFreshData() {
  const [liItems, igItems] = await Promise.all([

    // LinkedIn — actor specifically for company pages
    runAndCollect('curious_coder~linkedin-company-posts-scraper', {
      companyUrl: 'https://www.linkedin.com/company/ifb-industries-ltd/',
      maxResults: 5,
    }),

    // Instagram — working actor
    runAndCollect('dSCLg0C3YEZ83HzYX', {
      usernames: ['ifbappliances'],
      resultsLimit: 5,
    }),
  ]);

  // Map LinkedIn
  const linkedin = liItems.slice(0, 3).map(p => ({
    platform: 'linkedin',
    text:     (p.text || p.content || p.description || p.commentary || 'View post on LinkedIn').replace(/<[^>]+>/g,'').slice(0,150),
    url:      p.postUrl || p.url || p.shareUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
    likes:    p.likes || p.reactions || p.totalReactions || 0,
    comments: p.comments || p.commentsCount || 0,
    time:     p.date || p.postedAt || p.createdAt || null,
  }));

  // Map Instagram
  let igPosts = [];
  if (igItems.length > 0) {
    const f = igItems[0];
    if (f.latestPosts?.length)       igPosts = f.latestPosts.slice(0,3);
    else if (f.topPosts?.length)     igPosts = f.topPosts.slice(0,3);
    else if (f.caption || f.shortCode) igPosts = igItems.slice(0,3);
    else {
      for (const item of igItems) {
        const found = item.latestPosts || item.topPosts || item.posts || [];
        if (found.length) { igPosts = found.slice(0,3); break; }
      }
    }
  }
  const instagram = igPosts.map(p => ({
    platform: 'instagram',
    text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0,150),
    url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
    likes:    p.likesCount || p.likes || 0,
    comments: p.commentsCount || p.comments || 0,
    time:     p.timestamp || p.takenAt || null,
  }));

  return { linkedin, instagram, updatedAt: new Date().toISOString() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const r = getRedis();

  try {
    // Serve from cache unless ?refresh=1
    if (req.query.refresh !== '1') {
      try {
        const cached = await r.get(CACHE_KEY);
        if (cached) {
          return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
        }
      } catch(e) { console.warn('Redis get failed:', e.message); }
    }

    // Fetch fresh data — runs inline, user waits once per 24h
    const data = await fetchFreshData();
    try { await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL); } catch(e) {}

    return res.status(200).json({ source: 'fresh', data });

  } catch(err) {
    console.error('Handler error:', err.message);
    return res.status(200).json({ source: 'error', data: { linkedin: [], instagram: [], updatedAt: null } });
  }
};