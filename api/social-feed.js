// LinkedIn & Instagram removed.
// This stub keeps /api/social alive so nothing crashes.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    source: 'disabled',
    data: { linkedin: [], instagram: [], updatedAt: new Date().toISOString() },
  });
};