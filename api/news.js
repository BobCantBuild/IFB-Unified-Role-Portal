const Parser = require('rss-parser');
const Redis = require('ioredis');

const parser = new Parser();

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 2,
      retryStrategy(times) { if (times > 3) return null; return Math.min(times * 200, 1000); },
      tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
    });
    redis.on('error', e => console.error('Redis:', e.message));
  }
  return redis;
}

const EXCLUDE_KEYWORDS = [
  'share price', 'stock', 'nse', 'bse', 'sensex', 'nifty',
  'quarterly result', 'q1', 'q2', 'q3', 'q4', 'dividend',
  'market cap', 'revenue', 'profit', 'loss', 'earnings',
  'investor', 'trading', 'intraday', 'target price', 'buy rating',
];

function isExcluded(title = '') {
  return EXCLUDE_KEYWORDS.some(kw => title.toLowerCase().includes(kw));
}

const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=IFB+appliances&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=IFB+Industries&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=IFB+washing+machine+OR+microwave+OR+refrigerator&hl=en-IN&gl=IN&ceid=IN:en',
];

const CACHE_KEY = 'ifb_news_cache';
const CACHE_TTL = 1800; // 🔧 NEW: 30 minutes

async function fetchFreshNews() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(url => parser.parseURL(url))
  );

  // Collect ALL articles from all feeds
  const allArticles = [];
  const seenTitles = new Set();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const item of result.value.items) {
      const title   = item.title || '';
      const titleKey = title.slice(0, 60).toLowerCase();
      if (isExcluded(title))        continue;
      if (seenTitles.has(titleKey)) continue;
      seenTitles.add(titleKey);
      allArticles.push({
        title,
        link:    item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        source:  item.source?.title || item.creator || 'News',
      });
    }
  }

  // ✅ Sort strictly by date — newest first
  allArticles.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  // ✅ Take top 3 newest only
  return allArticles.slice(0, 3);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const startTime = Date.now();
  const r = getRedis();

  try {
    // 🔧 NEW: Check cache first
    if (req.query.refresh !== '1') {
      try {
        const cached = await r.get(CACHE_KEY);
        if (cached) {
          const articles = JSON.parse(cached);
          return res.status(200).json({
            source: 'cache',
            cacheHitTime: Date.now() - startTime,
            nextRefreshIn: '~30 minutes',
            data: {
              articles,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      } catch (e) {
        console.warn('Redis get failed:', e.message);
      }
    }

    // 🔧 NEW: Fetch fresh if no cache
    const articles = await fetchFreshNews();
    
    // 🔧 NEW: Store in Redis
    try {
      await r.set(CACHE_KEY, JSON.stringify(articles), 'EX', CACHE_TTL);
    } catch (e) {
      console.warn('Redis set failed:', e.message);
    }

    return res.status(200).json({
      source: 'fresh',
      fetchTime: Date.now() - startTime,
      cacheExpiresIn: CACHE_TTL,
      data: {
        articles,
        updatedAt: new Date().toISOString(),
      },
    });

  } catch (err) {
    console.error('News API error:', err.message);
    return res.status(200).json({
      source: 'error',
      error: err.message,
      data: { articles: [], updatedAt: new Date().toISOString() },
    });
  }
};