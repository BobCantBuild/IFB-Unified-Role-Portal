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

// ✅ sort=date added — newest articles first from Google News
const RSS_QUERIES = [
  {
    label: 'product',
    url:   'https://news.google.com/rss/search?q=IFB+appliances+washing+machine+OR+microwave+OR+dishwasher&hl=en-IN&gl=IN&ceid=IN:en&sort=date',
  },
  {
    label: 'brand',
    url:   'https://news.google.com/rss/search?q=IFB+Industries+launch+OR+award+OR+service+OR+innovation&hl=en-IN&gl=IN&ceid=IN:en&sort=date',
  },
  {
    label: 'industry',
    url:   'https://news.google.com/rss/search?q=home+appliance+industry+India&hl=en-IN&gl=IN&ceid=IN:en&sort=date',
  },
];

// ✅ 7 days cutoff — wide enough to always find results
const CUTOFF_MS = 7 * 24 * 60 * 60 * 1000;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

  const CACHE_KEY = 'ifb_news_v3';

  // ?clear=1 — force refresh cache
  if (req.query.clear === '1') {
    try { await getRedis().del(CACHE_KEY); } catch (e) {}
    return res.status(200).json({ ok: true, message: 'News cache cleared.' });
  }

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

    const articles = [];
    const seenTitles = new Set();
    const cutoff = Date.now() - CUTOFF_MS;

    for (let i = 0; i < results.length; i++) {
      if (results[i].status !== 'fulfilled') continue;
      const parsed = parseRSS(results[i].value);

      // ✅ Pick newest non-excluded article from each feed
      for (const article of parsed) {
        const titleKey = article.title.slice(0, 60).toLowerCase();
        const pubTime  = article.pubDate ? new Date(article.pubDate).getTime() : 0;

        if (pubTime < cutoff)           continue; // too old
        if (isExcluded(article.title))  continue; // financial noise
        if (seenTitles.has(titleKey))   continue; // duplicate

        seenTitles.add(titleKey);
        articles.push(article);
        break; // 1 per feed
      }
    }

    // Fallback — if all feeds empty or excluded, relax the cutoff
    if (articles.length === 0) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].status !== 'fulfilled') continue;
        const parsed = parseRSS(results[i].value);
        for (const article of parsed) {
          const titleKey = article.title.slice(0, 60).toLowerCase();
          if (!isExcluded(article.title) && !seenTitles.has(titleKey)) {
            seenTitles.add(titleKey);
            articles.push(article);
            if (articles.length >= 3) break;
          }
        }
        if (articles.length >= 3) break;
      }
    }

    // ✅ Sort newest first before caching
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

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