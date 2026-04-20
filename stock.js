// const PROXY_URL = "https://ifb-unified-role-portal.vercel.app/api/stock";

(function () {

  const PROXY_URL = "https://ifb-unified-role-portal.vercel.app/api/stock";
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
  function shortTimeLbl() {
    return nowIST().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  function fullTimeLbl() {
    return nowIST().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  function setText(id, val) {
    const el = document.getElementById(id); if (el) el.textContent = val;
  }
  function setChg(id, chg, pct) {
    const el = document.getElementById(id); if (!el) return;
    const sign = chg >= 0 ? "+" : "";
    el.textContent = `${sign}${chg.toFixed(2)} (${sign}${pct.toFixed(2)}%)`;
    el.className   = "s-exch-chg " + (chg > 0 ? "up" : chg < 0 ? "dn" : "");
  }
  function showErr(msg) {
    const el = document.getElementById("s-err"); if (!el) return;
    el.textContent = msg || ""; el.style.display = msg ? "inline" : "none";
  }

  /* ── Flash ── */
  let lastNSE = null, lastBSE = null;
  function setAndFlash(id, newVal, oldVal, displayText) {
    const el = document.getElementById(id); if (!el) return;
    el.textContent = displayText;
    if (oldVal !== null && newVal !== oldVal) {
      const cls = newVal > oldVal ? "flash-up" : "flash-dn";
      el.classList.remove("flash-up", "flash-dn");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 800);
      }));
    }
  }

  /* ── Chart — 1 hour rolling window ── */
  const canvas   = document.getElementById("ifb-chart");
  let   chart    = null;
  const INTERVAL = 10;           // seconds between ticks
  const WINDOW   = 60 * 60;     // 1 hour in seconds
  const MAX_PTS  = WINDOW / INTERVAL; // 360 points

  /* Pre-fill X axis with the past 1 hour of HH:MM labels */
  function buildInitialLabels() {
    const labels = [];
    const now    = nowIST();
    for (let i = MAX_PTS - 1; i >= 0; i--) {
      const t = new Date(now.getTime() - i * INTERVAL * 1000);
      labels.push(
        t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      );
    }
    return labels;
  }

  /* Init with empty data but full time axis already showing */
  const initialLabels = buildInitialLabels();
  const cData = {
    labels : initialLabels,
    nse    : new Array(MAX_PTS).fill(null),
    bse    : new Array(MAX_PTS).fill(null)
  };

  function getYRange() {
    const all = [...cData.nse, ...cData.bse].filter(v => v != null && !isNaN(v));
    if (all.length < 2) return null;
    const mn  = Math.min(...all);
    const mx  = Math.max(...all);
    const pad = Math.max((mx - mn) * 0.4, 3);
    return { min: Math.floor(mn - pad), max: Math.ceil(mx + pad) };
  }

  function initChart() {
    if (!window.Chart || !canvas || chart) return;
    const ctx = canvas.getContext("2d");

    const g1 = ctx.createLinearGradient(0, 0, 0, 165);
    g1.addColorStop(0, "rgba(0,111,143,0.38)");
    g1.addColorStop(1, "rgba(0,111,143,0.01)");

    const g2 = ctx.createLinearGradient(0, 0, 0, 165);
    g2.addColorStop(0, "rgba(26,135,84,0.22)");
    g2.addColorStop(1, "rgba(26,135,84,0.01)");

    chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: cData.labels,
        datasets: [
          {
            label: "NSE", data: cData.nse,
            borderColor: "#006f8f", borderWidth: 2,
            backgroundColor: g1, pointRadius: 0,
            pointHoverRadius: 4, tension: 0.4,
            fill: true, spanGaps: false
          },
          {
            label: "BSE", data: cData.bse,
            borderColor: "#1a8754", borderWidth: 1.5,
            backgroundColor: g2, pointRadius: 0,
            pointHoverRadius: 4, tension: 0.4,
            fill: true, spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true, position: "top",
            labels: { boxWidth: 10, font: { size: 10 }, color: "#547086", padding: 10 }
          },
          tooltip: {
            callbacks: {
              label: c => c.parsed.y == null ? null :
                ` ${c.dataset.label}: ₹${Number(c.parsed.y).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: { size: 9 }, color: "#7a9aaa",
              maxTicksLimit: 7,
              /* Show only every 6th label = ~1 per 10 mins on 1hr window */
              callback: function(val, index) {
                return index % 36 === 0 ? cData.labels[index] : "";
              }
            },
            grid: { color: "rgba(0,111,143,0.06)" }
          },
          y: {
            ticks: {
              maxTicksLimit: 5, font: { size: 9 }, color: "#7a9aaa",
              callback: v => "₹" + Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })
            },
            grid: { color: "rgba(0,111,143,0.06)" }
          }
        }
      }
    });
  }

  function pushChart(nseP, bseP) {
    /* Shift oldest off, push newest on — rolling 1hr window */
    cData.labels.shift(); cData.nse.shift(); cData.bse.shift();
    cData.labels.push(shortTimeLbl());
    cData.nse.push(nseP);
    cData.bse.push(bseP);

    if (chart) {
      const range = getYRange();
      if (range) {
        chart.options.scales.y.min = range.min;
        chart.options.scales.y.max = range.max;
      }
      chart.update("none");
    }
  }

  /* ── Fetch ── */
  async function fetchExch(exch) {
    const r = await fetch(PROXY_URL + "?exch=" + exch, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    if (j.error) throw new Error(j.error);
    const res = j?.chart?.result?.[0];
    if (!res) throw new Error("No data");
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

      setAndFlash("nse-price", nse.last, lastNSE, rupee(nse.last));
      setAndFlash("bse-price", bse.last, lastBSE, rupee(bse.last));
      lastNSE = nse.last; lastBSE = bse.last;

      setChg("nse-chg", nse.chg, nse.pct);
      setChg("bse-chg", bse.chg, bse.pct);
      setText("s-open", rupee(nse.open));
      setText("s-high", rupee(nse.high));
      setText("s-low",  rupee(nse.low));
      setText("s-prev", rupee(nse.prev));
      setText("s-vol",  shortVol(nse.vol));

      pushChart(nse.last, bse.last);
      setText("s-upd", "Updated " + fullTimeLbl() + " IST");
      showErr("");

    } catch (err) {
      showErr("⚠ " + err.message);
      setText("s-upd", "Retrying…");
    }
  }

  /* ── Boot — Chart.js preloaded from index.html ── */
  initChart();
  tick();
  setInterval(tick, 10000);

})();