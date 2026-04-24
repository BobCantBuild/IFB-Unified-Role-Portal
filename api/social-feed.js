const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
    });
    redis.on('error', (e) => console.error('Redis error:', e.message));
  }
  return redis;
}

const CACHE_KEY = 'ifb_social_v3';
const CACHE_TTL = 86400;

// ── Parse RSS/Atom XML ──
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    items.push({
      title:   get('title'),
      link:    get('link'),
      pubDate: get('pubDate'),
      desc:    get('description'),
    });
  }
  return items;
}

async function fetchLinkedIn() {
  try {
    // LinkedIn company posts via rss2json (free tier, 10k/day)
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://www.linkedin.com/company/ifb-industries-ltd/`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const items = (json.items || []).slice(0, 3);
    return items.map((p) => ({
      platform: 'linkedin',
      text:     (p.title || p.description || 'View post on LinkedIn').replace(/<[^>]+>/g, '').slice(0, 150),
      url:      p.link || 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes:    0,
      comments: 0,
      time:     p.pubDate || null,
    }));
  } catch (e) {
    console.error('LinkedIn fetch error:', e.message);
    return [];
  }
}

async function fetchInstagram() {
  try {
    // Instagram via Picuki public RSS proxy
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://picuki.com/profile/ifbappliances`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const items = (json.items || []).slice(0, 3);
    return items.map((p) => ({
      platform: 'instagram',
      text:     (p.title || p.description || 'View post on Instagram').replace(/<[^>]+>/g, '').slice(0, 150),
      url:      p.link || 'https://www.instagram.com/ifbappliances',
      likes:    0,
      comments: 0,
      time:     p.pubDate || null,
    }));
  } catch (e) {
    console.error('Instagram fetch error:', e.message);
    return [];
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const r = getRedis();

  // Force refresh
  if (req.query.refresh === '1') {
    await r.del(CACHE_KEY);
  }

  try {
    // Check cache first
    let cached = null;
    try { cached = await r.get(CACHE_KEY); } catch (e) {}

    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // Fetch fresh
    const [linkedin, instagram] = await Promise.all([
      fetchLinkedIn(),
      fetchInstagram(),
    ]);

    const data = {
      linkedin,
      instagram,
      updatedAt: new Date().toISOString(),
    };

    try { await r.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL); } catch (e) {}

    return res.status(200).json({ source: 'fresh', data });

  } catch (err) {
    console.error('Social API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { linkedin: [], instagram: [], updatedAt: null },
    });
  }
};