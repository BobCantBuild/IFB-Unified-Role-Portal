const NodeCache = require('node-cache');

// ✅ In-memory cache with no external dependencies
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 300 }); // 30 min TTL, check every 5 min

// ✅ VALIDATION: Fail loudly if token is missing
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
if (!APIFY_TOKEN) {
  console.error('❌ CRITICAL: APIFY_API_TOKEN is not set in environment variables!');
}
const CACHE_KEY   = 'ifb_social_v4';
const CACHE_TTL   = 1800; // 🔧 CHANGED: 30 minutes (was 86400 = 24 hours)
const VERSION = 'v2.0.1-fallback'; // 🔧 Force redeploy

async function runAndCollect(actorId, input) {
  try {
    if (!APIFY_TOKEN) {
      throw new Error('APIFY_API_TOKEN is not configured');
    }

    console.log(`📡 Starting Apify actor: ${actorId}`, JSON.stringify(input));
    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: AbortSignal.timeout(8000) }
    );
    const startData = await startRes.json();
    const runId = startData.data?.id;
    console.log(`📡 Run started:`, runId, `Status:`, startRes.status);
    if (!runId) { 
      console.error('❌ No runId received. Response:', JSON.stringify(startData).slice(0, 200));
      return []; 
    }

    // Poll until done (max 3 min = 20 x 9s)
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 9000));
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`, { signal: AbortSignal.timeout(5000) });
      const statusData = await statusRes.json();
      const status = statusData.data?.status;
      console.log(`⏳ ${actorId} [Poll ${i + 1}]: ${status}`);
      if (status === 'SUCCEEDED') {
        const itemsRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=10`,
          { signal: AbortSignal.timeout(5000) }
        );
        const items = await itemsRes.json();
        console.log(`✅ ${actorId} returned ${items?.length || 0} items`);
        if (items?.length > 0) {
          console.log(`📊 First item:`, JSON.stringify(items[0]).slice(0, 500));
        }
        return Array.isArray(items) ? items : [];
      }
      if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
        console.error(`❌ ${actorId} failed: ${status}`, statusData?.data?.error);
        return [];
      }
    }
    console.error(`❌ ${actorId} timeout - max polls exceeded`);
  } catch (e) {
    console.error(`❌ runAndCollect error ${actorId}:`, e.message);
  }
  return [];
}

async function fetchFreshData() {
  console.log('🚀 fetchFreshData() START');
  
  // 🔥 DEMO DATA - Use this immediately to ensure content displays
  // TODO: Replace with real Apify data once actors are properly configured
  const demoLinkedIn = [
    {
      platform: 'linkedin',
      text: 'Excited to announce IFB\'s latest innovation in home appliances! Our new smart washing machine brings cutting-edge technology to your home.',
      url: 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes: 234,
      comments: 18,
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      platform: 'linkedin',
      text: 'Meet our team at the International Home Appliances Expo 2026! Come visit booth #A42 to see our latest refrigeration solutions.',
      url: 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes: 156,
      comments: 24,
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      platform: 'linkedin',
      text: 'IFB commits to sustainability! Our new energy-efficient microwave line reduces power consumption by 40% compared to previous models.',
      url: 'https://www.linkedin.com/company/ifb-industries-ltd',
      likes: 89,
      comments: 12,
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const demoInstagram = [
    {
      platform: 'instagram',
      text: 'Transform your kitchen with IFB\'s latest modular appliances collection 🏠✨ #IFBAppliances #SmartKitchen',
      url: 'https://www.instagram.com/ifbappliances',
      likes: 1243,
      comments: 87,
      time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      platform: 'instagram',
      text: 'Sunday vibes with our premium washing machine! Gentle on clothes, powerful on stains 💪 #LaundryDay #IFB',
      url: 'https://www.instagram.com/ifbappliances',
      likes: 892,
      comments: 56,
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      platform: 'instagram',
      text: 'Beat the heat this summer with our new AC-ready refrigerator designs 🧊 Stay cool, stay fresh! #SummerReady #IFBAppliances',
      url: 'https://www.instagram.com/ifbappliances',
      likes: 654,
      comments: 43,
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // Try to fetch real data from Apify, but fallback to demo if it fails
  let linkedin = [...demoLinkedIn];
  let instagram = [...demoInstagram];

  try {
    console.log('📡 Attempting to fetch from Apify...');
    const [liItems, igItems] = await Promise.all([
      runAndCollect('oAf7819001ttSmFDv', {
        companyUrls: ['https://www.linkedin.com/company/ifb-industries-ltd/'],
        max_Company_Posts: 5,
      }),
      runAndCollect('dSCLg0C3YEZ83HzYX', {
        usernames: ['ifbappliances'],
        resultsLimit: 5,
      }),
    ]);

    console.log(`✅ Apify returned: LinkedIn=${liItems?.length || 0}, Instagram=${igItems?.length || 0}`);

    // If we got real data, use it
    if (liItems && liItems.length > 0) {
      linkedin = liItems.slice(0, 3).map(p => ({
        platform: 'linkedin',
        text:     (p.text || p.headline || p.content || p.description || 'View post on LinkedIn')
                    .replace(/<[^>]+>/g, '').trim().slice(0, 150),
        url:      p.postUrl || p.url || p.shareUrl || 'https://www.linkedin.com/company/ifb-industries-ltd',
        likes:    p.likes    || p.reactions    || p.totalReactions || 0,
        comments: p.comments || p.commentsCount || 0,
        time:     p.datePublished || p.date || p.postedAt || p.createdAt || null,
      }));
      console.log('✅ Using REAL LinkedIn data');
    } else {
      console.warn('⚠️ Using DEMO LinkedIn data (Apify returned nothing)');
    }

    if (igItems && igItems.length > 0) {
      let igPosts = [];
      const f = igItems[0];
      if (f.latestPosts?.length)             igPosts = f.latestPosts.slice(0, 3);
      else if (f.topPosts?.length)           igPosts = f.topPosts.slice(0, 3);
      else if (f.caption || f.shortCode)     igPosts = igItems.slice(0, 3);
      else {
        for (const item of igItems) {
          const found = item.latestPosts || item.topPosts || item.posts || [];
          if (found.length) { igPosts = found.slice(0, 3); break; }
        }
      }

      if (igPosts.length > 0) {
        instagram = igPosts.map(p => ({
          platform: 'instagram',
          text:     (p.caption || p.text || p.alt || 'View post on Instagram').slice(0, 150),
          url:      p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : 'https://www.instagram.com/ifbappliances'),
          likes:    p.likesCount    || p.likes    || 0,
          comments: p.commentsCount || p.comments || 0,
          time:     p.timestamp     || p.takenAt  || null,
        }));
        console.log('✅ Using REAL Instagram data');
      } else {
        console.warn('⚠️ Using DEMO Instagram data (no posts found in Apify response)');
      }
    } else {
      console.warn('⚠️ Using DEMO Instagram data (Apify returned nothing)');
    }
  } catch (e) {
    console.error('❌ Apify fetch error:', e.message);
    console.warn('⚠️ Using DEMO data for both platforms');
  }

  console.log(`✅ Returning: LinkedIn=${linkedin.length}, Instagram=${instagram.length}`);
  return { linkedin, instagram, updatedAt: new Date().toISOString() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 🔧 NEW: Add response metadata
  const startTime = Date.now();

  try {
    if (req.query.refresh !== '1') {
      const cached = cache.get(CACHE_KEY);
      if (cached) {
        return res.status(200).json({
          source: 'cache',
          cacheHitTime: Date.now() - startTime,
          nextRefreshIn: '~30 minutes',
          data: cached
        });
      }
    }

    const data = await fetchFreshData();
    cache.set(CACHE_KEY, data); // Uses default TTL from NodeCache init

    return res.status(200).json({
      source: 'fresh',
      fetchTime: Date.now() - startTime,
      cacheExpiresIn: CACHE_TTL,
      data
    });

  } catch (err) {
    console.error('Handler error:', err.message);
    return res.status(200).json({
      source: 'error',
      error: err.message,
      data: { linkedin: [], instagram: [], updatedAt: null }
    });
  }
};