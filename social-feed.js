// ═══════════════════════════════════════
//   IFB Social & News Feed — social-feed.js
// ═══════════════════════════════════════

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ── Fetch Google News RSS directly in browser via proxy ──
const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=IFB+appliances+washing+machine+OR+microwave+OR+refrigerator&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=IFB+Industries+launch+OR+award+OR+service+OR+innovation&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=home+appliance+India+new+product+2025&hl=en-IN&gl=IN&ceid=IN:en',
];

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

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item    = match[1];
    const title   = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link    = item.match(/<link>(.*?)<\/link>/)?.[1] || item.match(/<feedburner:origLink>(.*?)<\/feedburner:origLink>/)?.[1] || '';
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const source  = item.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'News';
    if (title && link) items.push({ title: title.trim(), link: link.trim(), pubDate: pubDate.trim(), source: source.trim() });
  }
  return items;
}

async function fetchFreshNews() {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map((url) =>
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
          .then((r) => r.json())
          .then((j) => j.contents)
      )
    );

    const articles = [];
    const seenTitles = new Set();

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const parsed = parseRSS(result.value);
      for (const article of parsed) {
        const key = article.title.slice(0, 60).toLowerCase();
        if (!isExcluded(article.title) && !seenTitles.has(key)) {
          seenTitles.add(key);
          articles.push(article);
          break; // 1 per feed
        }
      }
    }

    // Fallback if all excluded
    if (articles.length === 0) {
      const fallback = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent('https://news.google.com/rss/search?q=IFB+Industries&hl=en-IN&gl=IN&ceid=IN:en')}`
      ).then((r) => r.json()).then((j) => parseRSS(j.contents));
      articles.push(...fallback.slice(0, 3));
    }

    return articles.slice(0, 3);
  } catch (err) {
    console.error('RSS fetch error:', err);
    return [];
  }
}

function renderNewsList(articles) {
  const el = document.getElementById('newsList');
  if (!articles || articles.length === 0) {
    el.innerHTML = '<div class="feed-error">No news found at the moment.</div>';
    return;
  }
  el.innerHTML = articles.map(a => `
    <a class="news-card" href="${a.link}" target="_blank" rel="noopener noreferrer">
      <div class="news-source">${a.source || 'News'}</div>
      <div class="news-title">${a.title}</div>
      <div class="news-footer">
        <span class="news-time">${timeAgo(a.pubDate)}</span>
        <span class="news-read-more">Read →</span>
      </div>
    </a>
  `).join('');
}

function renderSocialList(posts, containerId) {
  const el = document.getElementById(containerId);
  if (!posts || posts.length === 0) {
    el.innerHTML = '<div class="feed-error">No posts available.</div>';
    return;
  }
  el.innerHTML = posts.map(p => `
    <a class="social-card" href="${p.url}" target="_blank" rel="noopener noreferrer">
      <div class="social-text">${p.text}</div>
      <div class="social-stats">
        <span class="social-stat">❤️ ${(p.likes || 0).toLocaleString()}</span>
        <span class="social-stat">💬 ${(p.comments || 0).toLocaleString()}</span>
        ${p.time ? `<span class="social-stat">${timeAgo(p.time)}</span>` : ''}
        <span class="social-view-link">View Post →</span>
      </div>
    </a>
  `).join('');
}

function renderTicker(articles) {
  const el = document.getElementById('newsTicker');
  if (!articles || articles.length === 0) return;
  const items = articles.map(a =>
    `<a href="${a.link}" target="_blank" rel="noopener noreferrer">📌 ${a.title}</a>`
  ).join('<span style="color:#334155;padding:0 8px">◆</span>');
  el.innerHTML = items + '<span style="padding:0 40px"></span>' + items;
}

async function loadSocialFeed() {
  const btn       = document.getElementById('feedRefreshBtn');
  const updatedEl = document.getElementById('feedUpdated');
  if (btn) btn.classList.add('spinning');
  updatedEl.textContent = 'Refreshing...';

  try {
    // News — fresh from RSS every time
    const [articles, socialRes] = await Promise.all([
      fetchFreshNews(),
      fetch('/api/social'),
    ]);

    renderNewsList(articles);
    renderTicker(articles);
    updatedEl.textContent = 'News live • ';

    if (socialRes.ok) {
      const socialJson = await socialRes.json();
      renderSocialList(socialJson.data?.linkedin,  'linkedinList');
      renderSocialList(socialJson.data?.instagram, 'instagramList');
      if (socialJson.data?.updatedAt) {
        updatedEl.textContent += 'Social updated ' + timeAgo(socialJson.data.updatedAt);
      }
    } else {
      document.getElementById('linkedinList').innerHTML  = '<div class="feed-error">Could not load posts.</div>';
      document.getElementById('instagramList').innerHTML = '<div class="feed-error">Could not load posts.</div>';
    }

  } catch (err) {
    console.error('Feed load error:', err);
    updatedEl.textContent = 'Failed to load';
  } finally {
    if (btn) btn.classList.remove('spinning');
  }
}

document.addEventListener('DOMContentLoaded', () => loadSocialFeed());
setInterval(loadSocialFeed, 60 * 60 * 1000);