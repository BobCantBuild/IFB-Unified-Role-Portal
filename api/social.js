import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const CACHE_KEY = 'ifb_social_cache';
const CACHE_TTL = 3600; // 1 hour in seconds

async function fetchLinkedIn() {
  try {
    const runRes = await fetch(`https://api.apify.com/v2/acts/apidojo~linkedin-company-posts-scraper/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyUrls: ['https://www.linkedin.com/company/ifb-industries-ltd'],
        maxResults: 3
      })
    });
    const run = await runRes.json();
    const runId = run.data?.id;
    if (!runId) return [];

    // Wait for run to finish (poll every 3s, max 30s)
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const status = await statusRes.json();
      if (status.data?.status === 'SUCCEEDED') {
        const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=3`);
        const items = await dataRes.json();
        return items.map(p => ({
          platform: 'linkedin',
          text: p.text?.slice(0, 150) || p.commentary?.slice(0, 150) || 'View post on LinkedIn',
          url: p.url || p.postUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
          likes: p.likeCount || p.totalReactionCount || 0,
          comments: p.commentCount || 0,
          time: p.postedAt || p.createdAt || null,
        }));
      }
      if (status.data?.status === 'FAILED') break;
    }
    return [];
  } catch (e) {
    console.error('LinkedIn fetch error:', e);
    return [];
  }
}

async function fetchInstagram() {
  try {
    const runRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: ['ifbappliances'],
        resultsLimit: 3
      })
    });
    const run = await runRes.json();
    const runId = run.data?.id;
    if (!runId) return [];

    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const status = await statusRes.json();
      if (status.data?.status === 'SUCCEEDED') {
        const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=3`);
        const items = await dataRes.json();
        return items.map(p => ({
          platform: 'instagram',
          text: p.caption?.slice(0, 150) || 'View post on Instagram',
          url: p.url || `https://www.instagram.com/ifbappliances`,
          likes: p.likesCount || 0,
          comments: p.commentsCount || 0,
          time: p.timestamp || null,
        }));
      }
      if (status.data?.status === 'FAILED') break;
    }
    return [];
  } catch (e) {
    console.error('Instagram fetch error:', e);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Check cache first
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // Fetch fresh data
    const [linkedin, instagram] = await Promise.all([fetchLinkedIn(), fetchInstagram()]);
    const data = { linkedin, instagram, updatedAt: new Date().toISOString() };

    // Save to cache
    await redis.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);

    return res.status(200).json({ source: 'fresh', data });
  } catch (err) {
    console.error('Social API error:', err);
    return res.status(500).json({ error: 'Failed to fetch social data' });
  }
}