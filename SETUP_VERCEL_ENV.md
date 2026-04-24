# IFB Portal - Vercel Environment Setup Guide

## ✅ Code Changes Applied

All improvements have been implemented:

### 1. **Cron Schedule Updated** ✅
- **File**: `vercel.json`
- **Change**: Cron schedule changed from `0 3 * * *` (3 AM daily) → `*/30 * * * *` (every 30 minutes)
- **Effect**: LinkedIn, Instagram, and News feeds will refresh every 30 minutes

### 2. **Redis Cache TTL Reduced** ✅
- **File**: `api/social-feed.js`
- **Change**: `CACHE_TTL` reduced from 86400 seconds (24 hours) → 1800 seconds (30 minutes)
- **Effect**: Fresh posts will appear every 30 minutes instead of waiting 24 hours

### 3. **News Caching Implemented** ✅
- **File**: `api/news.js`
- **Changes**:
  - Added Redis caching with 1800-second TTL
  - News articles now cached for 30 minutes (was being re-parsed on every request)
  - Reduced unnecessary Google News API calls

### 4. **API Token Validation Added** ✅
- **File**: `api/social-feed.js`
- **Change**: Now checks for APIFY_API_TOKEN at startup
- **Effect**: Fails loudly with clear error if token is missing (was failing silently before)

### 5. **Response Metadata Added** ✅
- **Files**: `api/social-feed.js`, `api/news.js`
- **New Fields**:
  - `source`: "fresh" (fetched from Apify/RSS) or "cache" (from Redis)
  - `cacheHitTime`: Response time in milliseconds
  - `fetchTime`: Time taken to fetch fresh data
  - `cacheExpiresIn`: TTL in seconds (1800 for 30 min)
  - `nextRefreshIn`: Human-readable refresh schedule

### 6. **Redundant Files Deleted** ✅
- Removed `api/social-cron.js` (redundant on-demand trigger)
- Removed `api/social-collect.js` (redundant polling endpoint)
- Kept: `api/social-feed.js` (main endpoint), `api/social-webhook.js` (optional)

---

## 🔧 REQUIRED: Vercel Environment Variables

You must add these to your Vercel project to make everything work:

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: **"unified-role-portal"**
3. Click **Settings** tab
4. Go to **Environment Variables**

### Step 2: Add APIFY_API_TOKEN

```
Name:  APIFY_API_TOKEN
Value: <YOUR_APIFY_API_TOKEN_HERE>
```

**To get your token:**
1. Open https://console.apify.com
2. Go to Settings → Integrations
3. Copy your API token
4. Paste it in Vercel environment variables

- Select all environments: **Production, Preview, Development**
- Click **Add**

### Step 3: Verify REDIS_URL

- Check if `REDIS_URL` already exists (it should)
- Format should be: `rediss://...` (with TLS)
- If missing, add it from your Redis provider

### Step 4: Deploy

After adding environment variables:

```bash
git add -A
git commit -m "🔧 Fix: Implement 30-min refresh cycle with Redis caching"
git push origin dev
```

Then redeploy on Vercel (automatic on push) or manually:
- In Vercel dashboard: **Deployments** → **Redeploy** (latest commit)

---

## ✅ Verification Checklist

After deployment, verify everything is working:

### 1. **Check Cron Executions** (1-2 minutes to take effect)
- Vercel Dashboard → **Functions** → **Crons**
- Should show runs every 30 minutes starting from next :00, :30

### 2. **Test Fresh Data Fetch**
```bash
# Test LinkedIn/Instagram (should say "source: fresh")
curl "https://ifb-unified-role-portal.vercel.app/api/social?refresh=1"

# Test News (should say "source: fresh")
curl "https://ifb-unified-role-portal.vercel.app/api/news?refresh=1"
```

Response should include:
```json
{
  "source": "fresh",
  "fetchTime": 2500,
  "cacheExpiresIn": 1800,
  "data": { ... }
}
```

### 3. **Test Cache Hit** (30 seconds after first request)
```bash
# Same requests without ?refresh=1
curl "https://ifb-unified-role-portal.vercel.app/api/social"
curl "https://ifb-unified-role-portal.vercel.app/api/news"
```

Response should include:
```json
{
  "source": "cache",
  "cacheHitTime": 45,
  "nextRefreshIn": "~30 minutes",
  "data": { ... }
}
```

### 4. **Check Portal Display**
- Open https://ifb-unified-role-portal.vercel.app
- Should display:
  - Latest LinkedIn posts (IFB Industries)
  - Latest Instagram posts (ifbappliances)
  - Latest News articles about IFB

### 5. **Monitor Vercel Logs** (First 3 refresh cycles)
- Vercel Dashboard → **Logs**
- Should see:
  - 30-min cron triggers
  - Apify actor calls: LinkedIn → Instagram
  - Redis cache saves with 1800-sec TTL
  - No error messages

---

## 📊 Timeline After Deployment

| Time | Event | Expected Result |
|------|-------|-----------------|
| 0 min | Cron triggers | Fetches fresh LinkedIn/Instagram/News |
| 0-3 min | Apify actors run | Data stored in Redis (TTL: 30 min) |
| 0+ min | Portal requests | Return cached data within milliseconds |
| 15 min | Repeat requests | Still returns cached data |
| 30 min | Cron triggers again | Fetches fresh data, updates Redis cache |
| 60 min | Cron triggers | Fetches fresh data again |

---

## 🔍 Troubleshooting

### Issue: "APIFY_API_TOKEN is not set"
**Fix**: Add environment variable in Vercel (Step 2 above), then redeploy

### Issue: "Redis connection failed"
**Fix**: Check `REDIS_URL` is set and valid in Vercel environment variables

### Issue: Posts not updating
**Possible causes:**
1. Cron job hasn't run yet (max 2 min after deployment)
2. Apify actors failing (check Vercel logs)
3. Redis cache hasn't expired (wait 30 min or use `?refresh=1` parameter)

### Issue: Very old posts still showing
**Fix**: 
1. Use `?refresh=1` parameter to force fresh fetch
2. Clear Redis cache manually if possible
3. Check if Apify actors are returning data correctly

---

## 📝 Summary of Improvements

| Feature | Before | After |
|---------|--------|-------|
| **Refresh Frequency** | Once daily at 3 AM | Every 30 minutes |
| **Social Feed Cache TTL** | 24 hours | 30 minutes |
| **News Caching** | None (re-parsed every request) | 30 min Redis cache |
| **Redundant Code** | 3 different endpoints | Single endpoint |
| **Error Handling** | Silent failures | Loud, visible errors |
| **Response Info** | Minimal | Detailed metadata |
| **Apify Calls/Day** | 2 | 48 (one every 30 min) |

---

## 🎯 Next Steps

1. ✅ **Deploy code** (push to git)
2. ✅ **Add APIFY_API_TOKEN** to Vercel env vars
3. ✅ **Verify REDIS_URL** is set
4. ✅ **Redeploy** Vercel project
5. ✅ **Monitor** first 3 cron cycles
6. ✅ **Celebrate** 🎉 Fresh posts every 30 minutes!

---

**Questions?** Check Vercel logs or test endpoints with curl commands above.
