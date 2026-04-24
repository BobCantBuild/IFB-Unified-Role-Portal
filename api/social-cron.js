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

async function startActor(actorId, input) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(10000),
    }
  );

  const json = await res.json();
  const runId = json?.data?.id;

  if (!runId) {
    console.error(`[Apify] Failed to start actor ${actorId}:`, JSON.stringify(json));
    return null;
  }

  console.log(`[Apify] Actor ${actorId} started → runId: ${runId}`);
  return runId;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const redis = getRedis();

  // DEBUG: read cached result
  if (req.query.debug === '1') {
    try {
      const cached = await redis.get('ifb_social_v2');
      return res.status(200).json(cached ? JSON.parse(cached) : { empty: true });
    } catch (e) {
      return res.status(200).json({ error: e.message });
    }
  }

  // CLEAR: wipe cache + run state
  if (req.query.clear === '1') {
    try {
      await redis.del('ifb_social_v2');
      await redis.del('ifb_social_runs');
    } catch (e) {
      console.warn('[Redis] Clear failed:', e.message);
    }
    return res.status(200).json({ ok: true, message: 'Cache cleared.' });
  }

  // TRIGGER: start both actors
  try {
    // LinkedIn — automation-lab company posts scraper (no login, free tier)
    const liRunId = await startActor('automation-lab~linkedin-company-posts-scraper', {
      companyUrl: 'https://www.linkedin.com/company/ifb-industries-ltd/',
      maxPosts: 5,
    });

    // Instagram — working profile scraper
    const igRunId = await startActor('dSCLg0C3YEZ83HzYX', {
      usernames: ['ifbappliances'],
      resultsLimit: 5,
    });

    // Persist run IDs for social-collect to pick up (expires in 10 min)
    await redis.set(
      'ifb_social_runs',
      JSON.stringify({
        li: liRunId,
        ig: igRunId,
        startedAt: new Date().toISOString(),
      }),
      'EX', 600
    );

    return res.status(200).json({
      ok: true,
      message: 'Actors started. Call /api/social-collect after 5 minutes.',
      liRunId,
      igRunId,
    });
  } catch (err) {
    console.error('[Cron] Error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};