function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function renderTicker(articles) {
  const el = document.getElementById('newsTicker');
  if (!el || !articles?.length) return;
  const items = articles.map(a =>
    `<a href="${a.link}" target="_blank" rel="noopener noreferrer">${a.title}</a>`
  ).join('<span class="ticker-divider">◆</span>');
  el.innerHTML = items + '<span style="padding:0 40px"></span>' + items;
}

function renderNewsList(articles) {
  const el = document.getElementById('newsList');
  if (!el) return;

  if (!articles?.length) {
    el.innerHTML = '<div class="feed-error">No recent news found.</div>';
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

async function loadSocialFeed(isAutoRefresh = false) {
  const btn       = document.getElementById('feedRefreshBtn');
  const updatedEl = document.getElementById('feedUpdated');

  if (!isAutoRefresh && btn) btn.classList.add('spinning');
  if (updatedEl) updatedEl.textContent = 'Refreshing...';

  try {
    const res  = await fetch(isAutoRefresh ? '/api/news?refresh=1' : '/api/news');
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const json = await res.json();
    const data = json.data;

    renderNewsList(data?.articles);
    renderTicker(data?.articles);

    if (data?.updatedAt && updatedEl) {
      updatedEl.textContent = 'Updated ' + timeAgo(data.updatedAt);
    }

  } catch (err) {
    console.error('[news] Error:', err.message);
    const el = document.getElementById('newsList');
    if (el) el.innerHTML = '<div class="feed-error">Could not load news. Retrying soon...</div>';
    if (updatedEl) updatedEl.textContent = 'Failed to load';
  } finally {
    if (!isAutoRefresh && btn) btn.classList.remove('spinning');
  }
}

document.addEventListener('DOMContentLoaded', () => loadSocialFeed(false));
setInterval(() => loadSocialFeed(true), 10 * 60 * 1000);