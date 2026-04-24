const Redis = require('ioredis');

let redisClient = null;

function getRedis() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });
    redisClient.on('error', e => console.error('[Redis Error]', e.message));
  }
  return redisClient;
}

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

async function getRunStatus(runId) {
  if (!runId) return { status: 'MISSING' };
  try {
    const r = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const json = await r.json();
    return { status: json?.data?.status || 'UNKNOWN' };
  } catch (e) {
    console.error('[Apify] getRunStatus error:', e.message);
    return { status: 'ERROR' };
  }
}

async function getRunItems(runId) {
  if (!runId) return [];
  try {
    const r = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`,
      { signal: AbortSignal.timeout(8000) }
    );
    const items = await r.json();
    console.log(`[Apify] runId ${runId} → ${items?.length ?? 0} items`);
    if (items?.length) {
      console.log('[Apify] First item sample:', JSON.stringify(items[0]).slice(0, 400));
    }
    return Array.isArray(items) ? items : [];
  } catch (e) {
    console.error('[Apify] getRunItems error:', e.message);
    return [];
  }
}

function mapLinkedIn(items) {
  return items.slice(0, 3).map(p => ({
    platform: 'linkedin',
    text: (
      p.text || p.postText || p.content || p.description || p.commentary || 'View post on LinkedIn'
    ).replace(/<[^>]+>/g, '').trim().slice(0, 150),
    url:
      p.postUrl || p.url || p.shareUrl || p.permalinkUrl ||
      'https://www.linkedin.com/company/ifb-industries-ltd',
    likes:    p.likes    || p.reactions    || p.likeCount    || p.totalReactions || 0,
    comments: p.comments || p.commentsCount || p.commentCount || 0,
    time:     p.date     || p.postedAt     || p.publishedAt  || p.createdAt      || null,
  }));
}

function mapInstagram(items) {
  let posts = [];

  if (!items.length) return posts;

  const first = items[0];

  if (first.latestPosts?.length)           posts = first.latestPosts.slice(0, 3);
  else if (first.topPosts?.length)         posts = first.topPosts.slice(0, 3);
  else if (first.caption || first.shortCode) posts = items.slice(0, 3);
  else {
    for (const item of items) {
      const found = item.latestPosts || item.topPosts || item.posts || [];
      if (found.length) { posts = found.slice(0, 3); break; }
    }
  }

  return posts.map(p => ({
    platform: 'instagram',
    text: (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
    url:
      p.url ||
      (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : null) ||
      'https://www.instagram.com/ifbappliances',
    likes:    p.likesCount    || p.likes    || 0,
    comments: p.commentsCount || p.comments || 0,
    time:     p.timestamp     || p.takenAt  || null,
  }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const redis = getRedis();

  try {
    const runsRaw = await redis.get('ifb_social_runs');
    if (!runsRaw) {
      return res.status(400).json({
        ok: false,
        message: 'No runs found. Call /api/social-cron first.',
      });
    }

    const runs = JSON.parse(runsRaw);
    const { li: liRunId, ig: igRunId } = runs;

    const [liStatus, igStatus] = await Promise.all([
      getRunStatus(liRunId),
      getRunStatus(igRunId),
    ]);

    console.log(`[Collect] LI: ${liStatus.status} | IG: ${igStatus.status}`);

    const PENDING = ['RUNNING', 'READY', 'ABORTING'];
    if (PENDING.includes(liStatus.status) || PENDING.includes(igStatus.status)) {
      return res.status(200).json({
        ok: false,
        message: 'Actors still running. Try again in 1-2 minutes.',
        liStatus: liStatus.status,
        igStatus: igStatus.status,
      });
    }

    const [liItems, igItems] = await Promise.all([
      getRunItems(liRunId),
      getRunItems(igRunId),
    ]);

    const linkedin  = mapLinkedIn(liItems);
    const instagram = mapInstagram(igItems);

    const result = {
      linkedin,
      instagram,
      updatedAt: new Date().toISOString(),
    };

    // Save to Redis cache for 24 hours
    await redis.set('ifb_social_v2', JSON.stringify(result), 'EX', 86400);

    return res.status(200).json({
      ok: true,
      updatedAt:      result.updatedAt,
      linkedinCount:  linkedin.length,
      instagramCount: instagram.length,
      liStatus:       liStatus.status,
      igStatus:       igStatus.status,
    });

  } catch (err) {
    console.error('[Collect] Error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};