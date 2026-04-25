const Parser = require('rss-parser');
const NodeCache = require('node-cache');

const parser = new Parser();

// ✅ In-memory cache with no external dependencies
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 300 }); // 30 min TTL, check every 5 min

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
const CACHE_TTL = 900; // 🔧 CHANGED: 15 minutes (was 30) - ensure fresh news
const MAX_ARTICLE_AGE_DAYS = 7; // 🔧 NEW: Only articles from last 7 days (not 40!)

function isArticleRecent(pubDateStr) {
  if (!pubDateStr) return false;
  
  try {
    const pubDate = new Date(pubDateStr);
    const now = new Date();
    const ageInMs = now.getTime() - pubDate.getTime();
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
    
    // Only keep articles from last 7 days
    return ageInDays <= MAX_ARTICLE_AGE_DAYS && ageInDays >= 0;
  } catch (e) {
    console.warn(`Failed to parse date: ${pubDateStr}`);
    return false; // If we can't parse, exclude it
  }
}

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
      const pubDate = item.pubDate || item.isoDate || '';
      
      // 🔧 NEW: Filter out old articles (older than 7 days)
      if (!isArticleRecent(pubDate)) {
        console.log(`[OLD] Skipping article from ${pubDate}: ${title.slice(0, 50)}...`);
        continue;
      }
      
      if (isExcluded(title))        continue;
      if (seenTitles.has(titleKey)) continue;
      seenTitles.add(titleKey);
      
      allArticles.push({
        title,
        link:    item.link || '',
        pubDate: pubDate,
        source:  item.source?.title || item.creator || 'Google News',
        daysOld: Math.floor((new Date().getTime() - new Date(pubDate).getTime()) / (1000 * 60 * 60 * 24)),
      });
    }
  }

  // ✅ Sort strictly by date — newest first
  allArticles.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da; // Newest first
  });

  // Log the articles we're returning
  console.log(`[NEWS] Found ${allArticles.length} fresh articles (within last ${MAX_ARTICLE_AGE_DAYS} days)`);
  allArticles.forEach((article, i) => {
    console.log(`[NEWS #${i+1}] ${article.daysOld} days old - ${article.title.slice(0, 60)}...`);
  });

  // ✅ Take top 3 newest only
  return allArticles.slice(0, 3);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const startTime = Date.now();

  try {
    // 🔧 Check cache first (now with node-cache - synchronous)
    if (req.query.refresh !== '1') {
      const cached = cache.get(CACHE_KEY);
      if (cached) {
        return res.status(200).json({
          source: 'cache',
          cacheHitTime: Date.now() - startTime,
          nextRefreshIn: '~15 minutes',
          cacheExpiresIn: CACHE_TTL,
          data: {
            articles: cached,
            updatedAt: new Date().toISOString(),
          },
        });
      }
    }

    // 🔧 Fetch fresh if no cache
    console.log('[NEWS] Fetching fresh news articles from RSS feeds...');
    const articles = await fetchFreshNews();
    
    // 🔧 Store in node-cache (no external API)
    cache.set(CACHE_KEY, articles); // Uses default TTL from NodeCache init

    return res.status(200).json({
      source: 'fresh',
      fetchTime: Date.now() - startTime,
      cacheExpiresIn: CACHE_TTL,
      articleCount: articles.length,
      oldestArticleAge: articles.length > 0 ? articles[articles.length - 1].daysOld : null,
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