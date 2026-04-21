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
      items.push({ title: title.trim(), link: link.trim(), pubDate: pubDate.trim(), source: source.trim() });
    }
  }
  return items;
}

// Keywords to EXCLUDE (financial/stock noise)
const EXCLUDE_KEYWORDS = [
  'share price', 'stock', 'nse', 'bse', 'sensex', 'nifty',
  'quarterly result', 'q1', 'q2', 'q3', 'q4', 'dividend',
  'market cap', 'revenue', 'profit', 'loss', 'earnings',
  'investor', 'trading', 'intraday', 'target price', 'buy rating',
];

function isExcluded(title) {
  const lower = title.toLowerCase();
  return EXCLUDE_KEYWORDS.some((kw) => lower.includes(kw));
}

// 3 different RSS queries — each targeting a different topic
const RSS_QUERIES = [
  {
    label:   'product',
    url:     'https://news.google.com/rss/search?q=IFB+appliances+washing+machine+OR+microwave+OR+dishwasher&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    label:   'brand',
    url:     'https://news.google.com/rss/search?q=IFB+Industries+launch+OR+award+OR+service+OR+innovation&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    label:   'industry',
    url:     'https://news.google.com/rss/search?q=home+appliance+industry+India+2025&hl=en-IN&gl=IN&ceid=IN:en',
  },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

  const CACHE_KEY = 'ifb_news_v3';

  try {
    const r = getRedis();

    // Try cache first
    let cached = null;
    try { cached = await r.get(CACHE_KEY); } catch (e) { console.warn('Redis get failed:', e.message); }
    if (cached) return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });

    // Fetch all 3 RSS feeds in parallel
    const results = await Promise.allSettled(
      RSS_QUERIES.map(({ url }) =>
        fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IFBPortal/1.0)' },
          signal: AbortSignal.timeout(5000),
        }).then((r) => r.text())
      )
    );

    // Pick best 1 article from each feed (skip excluded ones)
    const articles = [];
    const seenTitles = new Set();

    for (let i = 0; i < results.length; i++) {
      if (results[i].status !== 'fulfilled') continue;
      const parsed = parseRSS(results[i].value);

      // Pick first non-excluded, non-duplicate article from this feed
      for (const article of parsed) {
        const titleKey = article.title.slice(0, 60).toLowerCase();
        if (!isExcluded(article.title) && !seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          articles.push(article);
          break; // only 1 per feed
        }
      }
    }

    // If all feeds excluded, fall back to first 3 from original query
    if (articles.length === 0) {
      const fallbackRes = await fetch(
        'https://news.google.com/rss/search?q=IFB+Industries&hl=en-IN&gl=IN&ceid=IN:en',
        { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(4000) }
      );
      const fallbackXml = await fallbackRes.text();
      const fallback    = parseRSS(fallbackXml);
      articles.push(...fallback.slice(0, 3));
    }

    const data = { articles: articles.slice(0, 3), updatedAt: new Date().toISOString() };

    r.set(CACHE_KEY, JSON.stringify(data), 'EX', 1800).catch((e) =>
      console.warn('Redis set failed:', e.message)
    );

    return res.status(200).json({ source: 'fresh', data });

  } catch (err) {
    console.error('News API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { articles: [], error: err.message, updatedAt: new Date().toISOString() },
    });
  }
};