// const PROXY_URL = "https://ifb-unified-role-portal.vercel.app/api/stock";
(function () {

  const PROXY_URL = "https://ifb-unified-role-portal.vercel.app/api/stock";
  // ↑↑↑ Your actual Vercel URL

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

  /* ── Time helpers — pure UTC, no browser timezone ── */
  function nowIST() {
    return new Date(Date.now() + 5.5 * 3600 * 1000);
  }
  function nowHHMM() {
    const t = nowIST();
    return String(t.getUTCHours()).padStart(2, "0") + ":" +
           String(t.getUTCMinutes()).padStart(2, "0");
  }
  function fullTimeLbl() {
    const t = nowIST();
    return String(t.getUTCHours()).padStart(2, "0") + ":" +
           String(t.getUTCMinutes()).padStart(2, "0") + ":" +
           String(t.getUTCSeconds()).padStart(2, "0");
  }
  /* Yahoo Unix UTC → IST HH:MM label */
  function tsToIST(unix) {
    const d = new Date(unix * 1000 + 5.5 * 3600 * 1000);
    return String(d.getUTCHours()).padStart(2, "0") + ":" +
           String(d.getUTCMinutes()).padStart(2, "0");
  }
  function isMarketOpen() {
    const t = nowIST();
    const d = t.getUTCDay();
    if (!d || d === 6) return false;
    const m = t.getUTCHours() * 60 + t.getUTCMinutes();
    return m >= 555 && m <= 930;
  }

  /* ── Format ── */
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

  /* ── DOM ── */
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

  /* ── Chart ── */
  const canvas  = document.getElementById("ifb-chart");
  let   chart   = null;
  const cData   = { labels: [], nse: [], bse: [] };
  const MAX_PTS = 60;

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
    const g1  = ctx.createLinearGradient(0, 0, 0, 165);
    g1.addColorStop(0, "rgba(0,111,143,0.38)");
    g1.addColorStop(1, "rgba(0,111,143,0.01)");
    const g2  = ctx.createLinearGradient(0, 0, 0, 165);
    g2.addColorStop(0, "rgba(26,135,84,0.22)");
    g2.addColorStop(1, "rgba(26,135,84,0.01)");

    chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: cData.labels,
        datasets: [
          { label: "NSE", data: cData.nse, borderColor: "#006f8f", borderWidth: 2,
            backgroundColor: g1, pointRadius: 0, pointHoverRadius: 4,
            tension: 0.4, fill: true, spanGaps: true },
          { label: "BSE", data: cData.bse, borderColor: "#1a8754", borderWidth: 1.5,
            backgroundColor: g2, pointRadius: 0, pointHoverRadius: 4,
            tension: 0.4, fill: true, spanGaps: true }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 250, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: true, position: "top",
            labels: { boxWidth: 10, font: { size: 10 }, color: "#547086", padding: 10 } },
          tooltip: { callbacks: {
            label: c => c.parsed.y == null ? null :
              ` ${c.dataset.label}: ₹${Number(c.parsed.y).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
          }}
        },
        scales: {
          x: {
            ticks: {
              font: { size: 9 }, color: "#7a9aaa", maxRotation: 0,
              callback: function(val, index) {
                const step = Math.max(1, Math.floor(cData.labels.length / 6));
                return index % step === 0 ? cData.labels[index] : "";
              }
            },
            grid: { color: "rgba(0,111,143,0.06)" }
          },
          y: {
            ticks: { maxTicksLimit: 5, font: { size: 9 }, color: "#7a9aaa",
              callback: v => "₹" + Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
            grid: { color: "rgba(0,111,143,0.06)" }
          }
        }
      }
    });
  }

  /* ── Seed: anchor to LAST available data, not current clock ── */
  let seeded = false;

  function seedHistory(raw) {
    const timestamps = raw.timestamp || [];
    const closes     = raw.indicators?.quote?.[0]?.close || [];
    if (!timestamps.length) return;

    /* Step 1: collect all non-null points for today */
    const allPts = [];
    for (let i = 0; i < timestamps.length; i++) {
      const val = closes[i];
      if (val != null && !isNaN(val)) {
        allPts.push({ ts: timestamps[i], label: tsToIST(timestamps[i]), price: parseFloat(val.toFixed(2)) });
      }
    }
    if (!allPts.length) return;

    /* Step 2: anchor to last available data point (works during market AND after close) */
    const lastTs    = allPts[allPts.length - 1].ts;
    const hrAgoTs   = lastTs - 3600;

    /* Step 3: keep only points within 1hr window ending at last data */
    const window1hr = allPts.filter(p => p.ts >= hrAgoTs && p.ts <= lastTs);
    if (!window1hr.length) return;

    const slice      = window1hr.slice(-MAX_PTS);
    cData.labels     = slice.map(p => p.label);
    cData.nse        = slice.map(p => p.price);
    cData.bse        = slice.map(p => p.price);
  }

  /* ── Push live tick ── */
  function pushTick(nseP, bseP) {
    const lbl     = nowHHMM();
    const lastLbl = cData.labels[cData.labels.length - 1];
    if (lastLbl === lbl && cData.labels.length > 0) {
      cData.nse[cData.nse.length - 1] = nseP;
      cData.bse[cData.bse.length - 1] = bseP;
    } else {
      if (cData.labels.length >= MAX_PTS) {
        cData.labels.shift(); cData.nse.shift(); cData.bse.shift();
      }
      cData.labels.push(lbl);
      cData.nse.push(nseP);
      cData.bse.push(bseP);
    }
    if (chart) {
      const range = getYRange();
      if (range) { chart.options.scales.y.min = range.min; chart.options.scales.y.max = range.max; }
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
      pct  : prev ? ((last - prev) / prev) * 100 : 0,
      _raw : res
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

      if (!seeded) {
        seedHistory(nse._raw);
        seeded = true;
        if (chart) {
          const range = getYRange();
          if (range) { chart.options.scales.y.min = range.min; chart.options.scales.y.max = range.max; }
          chart.update();
        }
      }

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

      pushTick(nse.last, bse.last);
      setText("s-upd", "Updated " + fullTimeLbl() + " IST");
      showErr("");

    } catch (err) {
      showErr("⚠ " + err.message);
      setText("s-upd", "Retrying…");
    }
  }

  /* ── Boot ── */
  initChart();
  tick();
  setInterval(tick, 10000);

})();