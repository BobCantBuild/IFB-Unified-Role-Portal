// const PROXY_URL = "https://ifb-unified-role-portal.vercel.app/api/stock";



(function () {

  const PROXY_URL = "https://YOUR-PROJECT.vercel.app/api/stock";
  // ↑↑↑ Keep your actual Vercel URL here

  const widgetEl = document.getElementById("widget-stock");
  if (!widgetEl) return;

  widgetEl.innerHTML = `
    <div class="widget-header">
      <span class="widget-title">IFB Industries — Stock</span>
      <span class="s-badge" id="mkt-badge">—</span>
    </div>
    <div class="s-exch-row">
      <div class="s-exch-block">
        <span class="s-exch-lbl">NSE</span>
        <span class="s-exch-price" id="nse-price">—</span>
        <span class="s-exch-chg"   id="nse-chg"></span>
      </div>
      <div class="s-exch-sep"></div>
      <div class="s-exch-block">
        <span class="s-exch-lbl">BSE</span>
        <span class="s-exch-price" id="bse-price">—</span>
        <span class="s-exch-chg"   id="bse-chg"></span>
      </div>
    </div>
    <div class="s-ohlc">
      <div class="s-ohlc-cell"><span class="s-ok">Open</span><span class="s-ov"    id="s-open">—</span></div>
      <div class="s-ohlc-cell"><span class="s-ok">High</span><span class="s-ov hi" id="s-high">—</span></div>
      <div class="s-ohlc-cell"><span class="s-ok">Low</span> <span class="s-ov lo" id="s-low">—</span></div>
      <div class="s-ohlc-cell"><span class="s-ok">Prev</span><span class="s-ov"    id="s-prev">—</span></div>
      <div class="s-ohlc-cell"><span class="s-ok">Vol</span> <span class="s-ov"    id="s-vol">—</span></div>
    </div>
    <div class="s-chart-wrap">
      <canvas id="ifb-chart"></canvas>
    </div>
    <div class="s-foot">
      <span id="s-upd">Loading…</span>
      <span id="s-err" class="s-err-msg"></span>
    </div>
  `;

  /* ── Helpers ── */
  function nowIST() {
    const n = new Date();
    return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 19800000);
  }
  function isMarketOpen() {
    const t = nowIST(), d = t.getDay();
    if (!d || d === 6) return false;
    const m = t.getHours() * 60 + t.getMinutes();
    return m >= 555 && m <= 930;
  }
  function rupee(n) {
    if (n == null || isNaN(n)) return "—";
    return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function shortVol(n) {
    if (!n) return "—";
    if (n >= 1e7) return (n / 1e7).toFixed(2) + " Cr";
    if (n >= 1e5) return (n / 1e5).toFixed(2) + " L";
    return Number(n).toLocaleString("en-IN");
  }
  function timeLbl() {
    return nowIST().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  function setText(id, v) {
    const e = document.getElementById(id); if (e) e.textContent = v;
  }
  function setChg(id, chg, pct) {
    const el = document.getElementById(id); if (!el) return;
    const sign = chg >= 0 ? "+" : "";
    el.textContent = `${sign}${Number(chg).toFixed(2)} (${sign}${Number(pct).toFixed(2)}%)`;
    el.className   = "s-exch-chg " + (chg > 0 ? "up" : chg < 0 ? "dn" : "");
  }
  function showErr(msg) {
    const e = document.getElementById("s-err"); if (!e) return;
    e.textContent = msg || ""; e.style.display = msg ? "inline" : "none";
  }

  /* ── Flash animation on price change ── */
  let lastNSE = null, lastBSE = null;
  function flashPrice(id, newVal, oldVal) {
    const el = document.getElementById(id);
    if (!el || oldVal === null) return;
    if (newVal === oldVal) return;
    const cls = newVal > oldVal ? "flash-up" : "flash-dn";
    el.classList.remove("flash-up", "flash-dn");
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 800);
  }

  /* ── Chart ── */
  const canvas = document.getElementById("ifb-chart");
  let   chart  = null;
  const cData  = { labels: [], nse: [], bse: [] };

  function computeYRange() {
    const all = [...cData.nse, ...cData.bse].filter(v => v != null && !isNaN(v));
    if (all.length < 2) return null;
    const mn = Math.min(...all);
    const mx = Math.max(...all);
    const pad = Math.max((mx - mn) * 0.3, 2); // 30% padding or min ₹2
    return { min: Math.floor(mn - pad), max: Math.ceil(mx + pad) };
  }

  function initChart() {
    if (!window.Chart || !canvas || chart) return;
    const ctx = canvas.getContext("2d");

    const g1 = ctx.createLinearGradient(0, 0, 0, 160);
    g1.addColorStop(0, "rgba(0,111,143,0.35)");
    g1.addColorStop(1, "rgba(0,111,143,0.02)");

    const g2 = ctx.createLinearGradient(0, 0, 0, 160);
    g2.addColorStop(0, "rgba(26,135,84,0.22)");
    g2.addColorStop(1, "rgba(26,135,84,0.02)");

    chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: cData.labels,
        datasets: [
          {
            label: "NSE",
            data: cData.nse,
            borderColor: "#006f8f",
            borderWidth: 2,
            backgroundColor: g1,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
            fill: true
          },
          {
            label: "BSE",
            data: cData.bse,
            borderColor: "#1a8754",
            borderWidth: 1.5,
            backgroundColor: g2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true, position: "top",
            labels: { boxWidth: 10, font: { size: 10 }, color: "#547086", padding: 10 }
          },
          tooltip: {
            callbacks: {
              label: c => ` ${c.dataset.label}: ₹${Number(c.parsed.y).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
            }
          }
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 4, font: { size: 9 }, color: "#7a9aaa" },
            grid:  { color: "rgba(0,111,143,0.06)" }
          },
          y: {
            ticks: {
              font: { size: 9 }, color: "#7a9aaa", maxTicksLimit: 5,
              callback: v => "₹" + Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })
            },
            grid: { color: "rgba(0,111,143,0.06)" }
          }
        }
      }
    });
  }

  function pushChart(nseP, bseP) {
    if (cData.labels.length >= 300) {
      cData.labels.shift(); cData.nse.shift(); cData.bse.shift();
    }
    cData.labels.push(timeLbl());
    cData.nse.push(nseP);
    cData.bse.push(bseP);

    if (chart) {
      // Apply tight Y range based on actual data
      const range = computeYRange();
      if (range) {
        chart.options.scales.y.min = range.min;
        chart.options.scales.y.max = range.max;
      }
      chart.update("none");
    }
  }

  /* ── Fetch ── */
  async function fetchExch(exch) {
    const r   = await fetch(PROXY_URL + "?exch=" + exch, { cache: "no-store" });
    if (!r.ok) throw new Error("Proxy error " + r.status);
    const j   = await r.json();
    const res = j?.chart?.result?.[0];
    if (!res) throw new Error(j?.chart?.error?.description || "No data");
    const m    = res.meta;
    const prev = m.chartPreviousClose ?? m.regularMarketPrice;
    const last = m.regularMarketPrice;
    return {
      last, prev,
      open : m.regularMarketOpen ?? prev,
      high : m.regularMarketDayHigh,
      low  : m.regularMarketDayLow,
      vol  : m.regularMarketVolume,
      chg  : last - prev,
      pct  : prev ? ((last - prev) / prev) * 100 : 0
    };
  }

  /* ── Main tick ── */
  async function tick() {
    const open  = isMarketOpen();
    const badge = document.getElementById("mkt-badge");
    if (badge) {
      badge.textContent = open ? "● Live" : "● Closed";
      badge.className   = "s-badge " + (open ? "s-badge-live" : "s-badge-closed");
    }
    try {
      const [nse, bse] = await Promise.all([fetchExch("nse"), fetchExch("bse")]);

      /* Flash on change */
      flashPrice("nse-price", nse.last, lastNSE);
      flashPrice("bse-price", bse.last, lastBSE);
      lastNSE = nse.last;
      lastBSE = bse.last;

      setText("nse-price", rupee(nse.last));
      setText("bse-price", rupee(bse.last));
      setChg("nse-chg", nse.chg, nse.pct);
      setChg("bse-chg", bse.chg, bse.pct);
      setText("s-open", rupee(nse.open));
      setText("s-high", rupee(nse.high));
      setText("s-low",  rupee(nse.low));
      setText("s-prev", rupee(nse.prev));
      setText("s-vol",  shortVol(nse.vol));

      if (!chart && window.Chart) initChart();
      pushChart(nse.last, bse.last);

      setText("s-upd", "Updated " + timeLbl() + " IST");
      showErr("");

    } catch (err) {
      showErr("⚠ " + err.message);
      setText("s-upd", "Retrying…");
    }
  }

  /* ── Boot ── */
  const s   = document.createElement("script");
  s.src     = "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js";
  s.onload  = () => {
    initChart();
    tick();
    setInterval(tick, 5000); // every 5 seconds
  };
  document.head.appendChild(s);

})();