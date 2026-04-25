const Parser = require('rss-parser');

const parser = new Parser();

let cachedData    = null;
let cachedUntilMs = 0;
const CACHE_TTL   = 600; // 10 minutes

const CATEGORIES = [
  {
    key:   'business',
    label: 'Business & Finance',
    query: 'IFB+Industries+results+revenue+profit+financial+quarterly',
  },
  {
    key:   'launches',
    label: 'Product Launches',
    query: 'IFB+new+product+launch+appliances+washing+machine+microwave',
  },
  {
    key:   'company',
    label: 'Company & Leadership',
    query: 'IFB+Industries+CEO+MD+director+appointment+management+board',
  },
  {
    key:   'market',
    label: 'Market & Expansion',
    query: 'IFB+Industries+expansion+store+market+partnership+dealer',
  },
  {
    key:   'awards',
    label: 'Awards & Recognition',
    query: 'IFB+Industries+award+recognition+achievement+milestone',
  },
];

const MAX_AGE_DAYS = 30;

function isRecent(pubDateStr) {
  if (!pubDateStr) return false;
  try {
    const age = (Date.now() - new Date(pubDateStr).getTime()) / 86400000;
    return age >= 0 && age <= MAX_AGE_DAYS;
  } catch { return false; }
}

function stripSource(title) {
  return (title || '').replace(/\s+-\s+[^-]+$/, '').trim();
}

async function fetchCategory(cat) {
  const url = `https://news.google.com/rss/search?q=${cat.query}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const feed     = await parser.parseURL(url);
    const seen     = new Set();
    const articles = [];

    for (const item of feed.items || []) {
      const pubDate = item.pubDate || item.isoDate || '';
      if (!isRecent(pubDate)) continue;

      const title = stripSource(item.title);
      const key   = title.slice(0, 60).toLowerCase();
      if (!title || seen.has(key)) continue;
      seen.add(key);

      articles.push({
        title,
        link:   item.link || '',
        pubDate,
        source: item.source?.title || item.creator || 'Google News',
      });

      if (articles.length >= 5) break;
    }

    console.log(`[news] ${cat.key}: ${articles.length} articles`);
    return articles;
  } catch (e) {
    console.error(`[news] fetchCategory error [${cat.key}]:`, e.message);
    return [];
  }
}

async function fetchFreshData() {
  const results = await Promise.allSettled(CATEGORIES.map(fetchCategory));

  const categories = CATEGORIES.map((cat, i) => ({
    key:      cat.key,
    label:    cat.label,
    articles: results[i].status === 'fulfilled' ? results[i].value : [],
  }));

  const allArticles = categories
    .flatMap(c => c.articles.map(a => ({ ...a, category: c.label })))
    .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
    .slice(0, 20);

  return { categories, allArticles, updatedAt: new Date().toISOString() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const startTime = Date.now();

  try {
    if (req.query.refresh !== '1' && cachedData && Date.now() < cachedUntilMs) {
      return res.status(200).json({
        source: 'cache',
        cacheHitTime: Date.now() - startTime,
        data: cachedData,
      });
    }

    const data    = await fetchFreshData();
    cachedData    = data;
    cachedUntilMs = Date.now() + CACHE_TTL * 1000;

    return res.status(200).json({
      source:    'fresh',
      fetchTime: Date.now() - startTime,
      data,
    });
  } catch (err) {
    console.error('[news] Handler error:', err.message);
    return res.status(200).json({
      source: 'error',
      error:  err.message,
      data:   { categories: [], allArticles: [], updatedAt: new Date().toISOString() },
    });
  }
};