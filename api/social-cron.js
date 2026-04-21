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

async function startActor(actorId, input) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8000),
    }
  );
  const json = await res.json();
  const runId = json.data?.id;
  console.log(`Actor ${actorId} started. RunId: ${runId}`);
  return runId;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const redis = getRedis();

  // ?debug=1 — show cached data
  if (req.query.debug === '1') {
    const cached = await redis.get('ifb_social_v2');
    return res.status(200).json(cached ? JSON.parse(cached) : { empty: true });
  }

  // ?clear=1 — clear ONLY social cache, NOT run IDs
  if (req.query.clear === '1') {
    await redis.del('ifb_social_v2');
    return res.status(200).json({ ok: true, message: 'Social cache cleared.' });
  }

  try {
    const liRunId = await startActor('mrThmKLmkxJPehxCg', {
      company_name: 'ifb-industries-ltd',
      limit: 3,
      sort: 'recent',
    });

    const igRunId = await startActor('dSCLg0C3YEZ83HzYX', {
      usernames: ['ifbappliances'],
      resultsLimit: 3,
    });

    // Store run IDs — separate key, not cleared by ?clear=1
    await redis.set('ifb_social_runs', JSON.stringify({
      li: liRunId,
      ig: igRunId,
      startedAt: new Date().toISOString(),
    }), 'EX', 600);

    return res.status(200).json({
      ok: true,
      message: 'Actors started. Call /api/social-collect after 60 seconds.',
      liRunId,
      igRunId,
    });
  } catch (err) {
    console.error('Cron error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};