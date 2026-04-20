export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();

  const exch   = (req.query.exch || "nse").toLowerCase();
  const symbol = exch === "bse" ? "IFBIND.BO" : "IFBIND.NS";

  const yahooURL =
    `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}` +
    `?interval=1m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`;

  try {
    const response = await fetch(yahooURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Yahoo returned " + response.status });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}