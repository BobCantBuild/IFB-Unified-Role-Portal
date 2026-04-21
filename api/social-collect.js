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
    const runsRaw = await redis.get('ifb_social_runs');
    if (!runsRaw) {
      return res.status(200).json({ ok: false, message: 'No pending runs. Trigger /api/social-cron first.' });
    }

    const runs = JSON.parse(runsRaw);
    console.log('Runs to collect:', runs);

    // Check statuses
    const [liData, igData] = await Promise.all([
      fetch(`https://api.apify.com/v2/actor-runs/${runs.li}?token=${APIFY_TOKEN}`)
        .then(r => r.json()),
      fetch(`https://api.apify.com/v2/actor-runs/${runs.ig}?token=${APIFY_TOKEN}`)
        .then(r => r.json()),
    ]);

    const liStatus = liData.data?.status;
    const igStatus = igData.data?.status;
    console.log('LI status:', liStatus, '| IG status:', igStatus);

    if (liStatus !== 'SUCCEEDED' && igStatus !== 'SUCCEEDED') {
      return res.status(200).json({
        ok: false,
        message: 'Still running. Wait more and try again.',
        liStatus,
        igStatus,
      });
    }

    const current = { linkedin: [], instagram: [], updatedAt: null };

    // ── Collect LinkedIn ──
    if (liStatus === 'SUCCEEDED') {
      const liItems = await fetch(
        `https://api.apify.com/v2/actor-runs/${runs.li}/dataset/items?token=${APIFY_TOKEN}&limit=10`
      ).then(r => r.json());

      console.log(`LI items: ${liItems.length} | sample:`, JSON.stringify(liItems[0] || {}).slice(0, 500));

      current.linkedin = liItems.slice(0, 3).map((p) => ({
        platform: 'linkedin',
        text:     (p.text || p.commentary || p.content || p.description || p.body || 'View post on LinkedIn').slice(0, 150),
        url:      p.url || p.postUrl || p.link || p.postLink || 'https://www.linkedin.com/company/ifb-industries-ltd',
        likes:    p.reactions || p.likeCount || p.totalReactionCount || p.likes || 0,
        comments: p.commentsCount || p.commentCount || p.comments || 0,
        time:     p.postedAt || p.createdAt || p.publishedAt || p.date || null,
      }));
    }

    // ── Collect Instagram ──
    if (igStatus === 'SUCCEEDED') {
      const igItems = await fetch(
        `https://api.apify.com/v2/actor-runs/${runs.ig}/dataset/items?token=${APIFY_TOKEN}&limit=20`
      ).then(r => r.json());

      console.log(`IG raw items: ${igItems.length} | first item keys:`, Object.keys(igItems[0] || {}).join(', '));

      let igPosts = [];

      if (igItems.length > 0) {
        const first = igItems[0];

        if (first.latestPosts && first.latestPosts.length > 0) {
          // Profile object with nested latestPosts
          igPosts = first.latestPosts.slice(0, 3);
        } else if (first.topPosts && first.topPosts.length > 0) {
          // Some versions return topPosts
          igPosts = first.topPosts.slice(0, 3);
        } else if (first.caption || first.shortCode || first.type === 'Image' || first.type === 'Video') {
          // Direct post items (not wrapped in profile)
          igPosts = igItems.slice(0, 3);
        } else {
          // Last resort — look inside every item for any posts array
          for (const item of igItems) {
            const found = item.latestPosts || item.topPosts || item.posts || [];
            if (found.length > 0) { igPosts = found.slice(0, 3); break; }
          }
        }
      }

      console.log(`IG posts to map: ${igPosts.length} | sample:`, JSON.stringify(igPosts[0] || {}).slice(0, 400));

      current.instagram = igPosts.map((p) => ({
        platform: 'instagram',
        text:     (p.caption || p.text || p.alt || p.accessibility_caption || 'View post on Instagram').slice(0, 150),
        url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : null) || 'https://www.instagram.com/ifbappliances',
        likes:    p.likesCount || p.likes || p.like_count || 0,
        comments: p.commentsCount || p.comments || p.comments_count || 0,
        time:     p.timestamp || p.takenAt || p.taken_at || p.date || null,
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