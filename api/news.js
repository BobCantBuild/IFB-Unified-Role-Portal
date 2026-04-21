const Redis = require('ioredis');

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
      tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });
    redis.on('error', (e) => console.error('Redis error:', e.message));
  }
  return redis;
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title =
      item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
      item.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link =
      item.match(/<link>(.*?)<\/link>/)?.[1] ||
      item.match(/<feedburner:origLink>(.*?)<\/feedburner:origLink>/)?.[1] || '';
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const source  = item.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'News';
    if (title && link) {
      items.push({
        title:   title.trim(),
        link:    link.trim(),
        pubDate: pubDate.trim(),
        source:  source.trim(),
      });
    }
  }
  return items.slice(0, 10);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

  const CACHE_KEY = 'ifb_news_v2';

  try {
    const r = getRedis();

    // ── Try cache first ──
    let cached = null;
    try {
      cached = await r.get(CACHE_KEY);
    } catch (e) {
      console.warn('Redis get failed, will fetch fresh:', e.message);
    }

    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    // ── Fetch Google News RSS ──
    const rssUrl =
      'https://news.google.com/rss/search?q=IFB+Industries+Limited&hl=en-IN&gl=IN&ceid=IN:en';

    const response = await fetch(rssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IFBPortal/1.0)' },
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);

    const xml      = await response.text();
    const articles = parseRSS(xml);

    if (articles.length === 0) throw new Error('No articles parsed from RSS feed');

    const data = { articles, updatedAt: new Date().toISOString() };

    // ── Cache it (fire and forget) ──
    r.set(CACHE_KEY, JSON.stringify(data), 'EX', 1800).catch((e) =>
      console.warn('Redis set failed:', e.message)
    );

    return res.status(200).json({ source: 'fresh', data });

  } catch (err) {
    console.error('News API error:', err.message);

    // Return safe fallback — frontend won't crash
    return res.status(200).json({
      source: 'error',
      data: {
        articles: [],
        error:      err.message,
        updatedAt:  new Date().toISOString(),
      },
    });
  }
};