import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
const CACHE_KEY = 'ifb_news_cache';
const CACHE_TTL = 1800; // 30 mins

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link = item.match(/<link>(.*?)<\/link>/)?.[1]
      || item.match(/<feedburner:origLink>(.*?)<\/feedburner:origLink>/)?.[1] || '';
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const source = item.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'News';
    items.push({ title: title.trim(), link: link.trim(), pubDate, source: source.trim() });
  }
  return items.slice(0, 10);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    const rssUrl = 'https://news.google.com/rss/search?q=IFB+Industries+Limited&hl=en-IN&gl=IN&ceid=IN:en';
    const response = await fetch(rssUrl);
    const xml = await response.text();
    const articles = parseRSS(xml);

    const data = { articles, updatedAt: new Date().toISOString() };
    await redis.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);

    return res.status(200).json({ source: 'fresh', data });
  } catch (err) {
    console.error('News API error:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}