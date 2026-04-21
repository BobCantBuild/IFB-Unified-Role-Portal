import { fetchAndCacheSocial } from './social.js';

export const config = {
  maxDuration: 60  // 60s allowed for cron on Hobby plan
};

export default async function handler(req, res) {
  // Only allow Vercel cron calls
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow unauthenticated for now during testing
  }

  try {
    const data = await fetchAndCacheSocial();
    return res.status(200).json({ ok: true, updatedAt: data.updatedAt });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}