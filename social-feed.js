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

function isFresh(dateStr) {
  if (!dateStr) return false;
  const diffH = (Date.now() - new Date(dateStr)) / 1000 / 3600;
  return diffH < 6; // "NEW" badge if posted in last 6 hours
}

function renderNewsList(articles) {
  const el = document.getElementById('newsList');
  if (!articles || articles.length === 0) {
    el.innerHTML = `
      <div class="feed-error">
        No recent IFB news in the last 48 hours.<br>
        <small style="color:#94a3b8">Check back later or
          <a href="https://news.google.com/search?q=IFB+appliances" target="_blank">search Google News</a>.
        </small>
      </div>`;
    return;
  }
  el.innerHTML = articles.map(a => `
    <a class="news-card" href="${a.link}" target="_blank" rel="noopener noreferrer">
      <div class="news-card-top">
        <span class="news-source">${a.source || 'News'}</span>
        ${isFresh(a.pubDate) ? '<span class="news-badge-new">NEW</span>' : ''}
      </div>
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
    const [newsRes, socialRes] = await Promise.all([
      fetch('/api/news'),
      fetch('/api/social')
    ]);

    if (newsRes.ok) {
      const newsJson = await newsRes.json();
      renderNewsList(newsJson.data?.articles);
      renderTicker(newsJson.data?.articles);
      if (newsJson.data?.updatedAt) {
        updatedEl.textContent = 'News: ' + timeAgo(newsJson.data.updatedAt);
      }
    } else {
      document.getElementById('newsList').innerHTML =
        '<div class="feed-error">Could not load news.</div>';
    }

    if (socialRes.ok) {
      const socialJson = await socialRes.json();
      renderSocialList(socialJson.data?.linkedin,  'linkedinList');
      renderSocialList(socialJson.data?.instagram, 'instagramList');
      if (socialJson.data?.updatedAt) {
        updatedEl.textContent += ' · Social: ' + timeAgo(socialJson.data.updatedAt);
      }
    } else {
      document.getElementById('linkedinList').innerHTML =
        '<div class="feed-error">Could not load posts.</div>';
      document.getElementById('instagramList').innerHTML =
        '<div class="feed-error">Could not load posts.</div>';
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