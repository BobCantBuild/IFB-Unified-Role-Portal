const Parser = require('rss-parser');
const parser = new Parser();

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ✅ NO cache — always fresh
  res.setHeader('Cache-Control', 'no-store');

  try {
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
    const articles = allArticles.slice(0, 3);

    return res.status(200).json({
      source: 'fresh',
      data: {
        articles,
        updatedAt: new Date().toISOString(),
      },
    });

  } catch (err) {
    console.error('News API error:', err.message);
    return res.status(200).json({
      source: 'error',
      data: { articles: [], updatedAt: new Date().toISOString() },
    });
  }
};