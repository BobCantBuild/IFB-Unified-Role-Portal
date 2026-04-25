const Parser = require('rss-parser');

const parser = new Parser();

let cachedData    = null;
let cachedUntilMs = 0;
const CACHE_TTL   = 600;

const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=IFB+Industries&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=IFB+appliances&hl=en-IN&gl=IN&ceid=IN:en',
];

function stripSource(title) {
  return (title || '').replace(/\s+-\s+[^-]+$/, '').trim();
}

function isRecent(pubDateStr) {
  if (!pubDateStr) return false;
  try {
    const age = (Date.now() - new Date(pubDateStr).getTime()) / 86400000;
    return age >= 0 && age <= 30;
  } catch { return false; }
}

async function fetchFreshData() {
  const results = await Promise.allSettled(RSS_FEEDS.map(url => parser.parseURL(url)));

  const seen     = new Set();
  const articles = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const item of result.value.items || []) {
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
    }
  }

  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return { articles: articles.slice(0, 5), updatedAt: new Date().toISOString() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const startTime = Date.now();

  try {
    if (req.query.refresh !== '1' && cachedData && Date.now() < cachedUntilMs) {
      return res.status(200).json({ source: 'cache', cacheHitTime: Date.now() - startTime, data: cachedData });
    }

    const data    = await fetchFreshData();
    cachedData    = data;
    cachedUntilMs = Date.now() + CACHE_TTL * 1000;

    return res.status(200).json({ source: 'fresh', fetchTime: Date.now() - startTime, data });
  } catch (err) {
    console.error('[news] error:', err.message);
    return res.status(200).json({
      source: 'error',
      error:  err.message,
      data:   { articles: [], updatedAt: new Date().toISOString() },
    });
  }
};