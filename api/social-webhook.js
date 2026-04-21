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

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const CACHE_KEY   = 'ifb_social_v2';
const CACHE_TTL   = 3600;

async function getDatasetItems(runId) {
  const res = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`
  );
  return res.json();
}

module.exports = async function handler(req, res) {
  // Apify sends POST when actor finishes
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Webhook ready' });
  }

  const redis  = getRedis();
  const body   = req.body || {};
  const runId  = body.runId || body.resource?.id;
  const status = body.status || body.resource?.status;

  console.log('Webhook received. RunId:', runId, 'Status:', status);

  if (status !== 'SUCCEEDED' || !runId) {
    return res.status(200).json({ ok: false, message: `Skipped. Status: ${status}` });
  }

  try {
    // Get stored run IDs to identify which actor finished
    const runsRaw = await redis.get('ifb_social_runs');
    const runs    = runsRaw ? JSON.parse(runsRaw) : {};

    // Get current cache to merge
    const cachedRaw = await redis.get(CACHE_KEY);
    const current   = cachedRaw ? JSON.parse(cachedRaw) : { linkedin: [], instagram: [], updatedAt: null };

    const items = await getDatasetItems(runId);
    console.log(`RunId ${runId} returned ${items.length} items. Sample:`, JSON.stringify(items[0] || {}).slice(0, 400));

    if (runId === runs.li) {
      // LinkedIn run finished
      current.linkedin = items.slice(0, 3).map((p) => ({
        platform: 'linkedin',
        text:     (p.text || p.content || p.postContent || p.commentary || p.description || p.body || 'View post on LinkedIn').slice(0, 150),
        url:      p.url || p.postUrl || p.link || p.postLink || 'https://www.linkedin.com/company/ifb-industries-ltd',
        likes:    p.likesCount || p.likeCount || p.totalReactionCount || p.reactions || 0,
        comments: p.commentsCount || p.commentCount || p.comments || 0,
        time:     p.postedAt || p.publishedAt || p.createdAt || p.date || null,
      }));
      console.log('LinkedIn posts updated:', current.linkedin.length);
    } else if (runId === runs.ig) {
      // Instagram run finished
      const profile     = items[0] || {};
      const latestPosts = profile.latestPosts || [];
      current.instagram = latestPosts.slice(0, 3).map((p) => ({
        platform: 'instagram',
        text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
        url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
        likes:    p.likesCount || p.likes || 0,
        comments: p.commentsCount || p.comments || 0,
        time:     p.timestamp || p.takenAt || null,
      }));
      console.log('Instagram posts updated:', current.instagram.length);
    }

    current.updatedAt = new Date().toISOString();
    await redis.set(CACHE_KEY, JSON.stringify(current), 'EX', CACHE_TTL);

    return res.status(200).json({ ok: true, updatedAt: current.updatedAt });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};