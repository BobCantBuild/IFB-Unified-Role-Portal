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

async function startActor(actorId, input, webhookUrl) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}&webhookUrl=${encodeURIComponent(webhookUrl)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );
  const json = await res.json();
  console.log(`Actor ${actorId} started. RunId:`, json.data?.id);
  return json.data?.id;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const redis = getRedis();

  // ?debug=1
  if (req.query.debug === '1') {
    const cached = await redis.get('ifb_social_v2');
    return res.status(200).json(cached ? JSON.parse(cached) : { empty: true });
  }

  // ?clear=1
  if (req.query.clear === '1') {
    await redis.del('ifb_social_v2');
    return res.status(200).json({ ok: true, message: 'Cache cleared.' });
  }

  try {
    const host    = `https://${req.headers.host}`;
    const webhook = `${host}/api/social-webhook`;

    // Fire both actors — don't wait
    const [liRunId, igRunId] = await Promise.all([
startActor('mrThmKLmkxJPehxCg', {
  company_name: 'ifb-industries-ltd',
  limit: 3,
  sort: 'recent',
}, webhook),
startActor('apimaestro~linkedin-company-posts', {
  startUrls: [{ url: 'https://www.linkedin.com/company/ifb-industries-ltd/' }],
  maxResults: 3,
}, webhook),
    ]);

    // Store pending run IDs in Redis so webhook knows what to collect
    await redis.set('ifb_social_runs', JSON.stringify({
      li: liRunId,
      ig: igRunId,
      startedAt: new Date().toISOString(),
    }), 'EX', 300); // expires in 5 min

    return res.status(200).json({
      ok: true,
      message: 'Actors started. Webhook will update cache when done.',
      liRunId,
      igRunId,
    });
  } catch (err) {
    console.error('Cron error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};