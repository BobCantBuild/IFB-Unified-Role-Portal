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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const redis = getRedis();

  try {
    // Get stored run IDs
    const runsRaw = await redis.get('ifb_social_runs');
    if (!runsRaw) {
      return res.status(200).json({ ok: false, message: 'No pending runs. Trigger /api/social-cron first.' });
    }

    const runs = JSON.parse(runsRaw);
    console.log('Collecting runs:', runs);

    // Check both run statuses
    const [liStatus, igStatus] = await Promise.all([
      fetch(`https://api.apify.com/v2/actor-runs/${runs.li}?token=${APIFY_TOKEN}`)
        .then(r => r.json()).then(j => j.data?.status),
      fetch(`https://api.apify.com/v2/actor-runs/${runs.ig}?token=${APIFY_TOKEN}`)
        .then(r => r.json()).then(j => j.data?.status),
    ]);

    console.log('LinkedIn run status:', liStatus, '| Instagram run status:', igStatus);

    if (liStatus !== 'SUCCEEDED' && igStatus !== 'SUCCEEDED') {
      return res.status(200).json({
        ok: false,
        message: 'Actors still running. Wait a bit more.',
        liStatus,
        igStatus,
      });
    }

    const cachedRaw = await redis.get(CACHE_KEY);
    const current   = cachedRaw ? JSON.parse(cachedRaw) : { linkedin: [], instagram: [], updatedAt: null };

// Collect LinkedIn if done
if (liStatus === 'SUCCEEDED') {
  const liItems = await fetch(
    `https://api.apify.com/v2/actor-runs/${runs.li}/dataset/items?token=${APIFY_TOKEN}&limit=10`
  ).then(r => r.json());

  console.log(`LinkedIn items: ${liItems.length}`, JSON.stringify(liItems[0] || {}).slice(0, 400));

current.linkedin = liItems.slice(0, 3).map((p) => ({
  platform: 'linkedin',
  text:     (p.text || p.commentary || p.content || p.description || 'View post on LinkedIn').slice(0, 150),
  url:      p.url || p.postUrl || p.link || 'https://www.linkedin.com/company/ifb-industries-ltd',
  likes:    p.reactions || p.likeCount || p.totalReactionCount || p.likes || 0,
  comments: p.commentsCount || p.commentCount || p.comments || 0,
  time:     p.postedAt || p.createdAt || p.publishedAt || p.date || null,
}));
}

    // Collect Instagram if done
    if (igStatus === 'SUCCEEDED') {
      const igItems = await fetch(
        `https://api.apify.com/v2/actor-runs/${runs.ig}/dataset/items?token=${APIFY_TOKEN}&limit=10`
      ).then(r => r.json());

      const latestPosts = (igItems[0] || {}).latestPosts || [];
      current.instagram = latestPosts.slice(0, 3).map((p) => ({
        platform: 'instagram',
        text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
        url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
        likes:    p.likesCount || p.likes || 0,
        comments: p.commentsCount || p.comments || 0,
        time:     p.timestamp || p.takenAt || null,
      }));
    }

    current.updatedAt = new Date().toISOString();
    await redis.set(CACHE_KEY, JSON.stringify(current), 'EX', CACHE_TTL);

    return res.status(200).json({
      ok: true,
      updatedAt: current.updatedAt,
      linkedinCount: current.linkedin.length,
      instagramCount: current.instagram.length,
      liStatus,
      igStatus,
    });

  } catch (err) {
    console.error('Collect error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};