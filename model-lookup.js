/* ══════════════════════════════════════════════════════
   model-lookup.js
   • Shared overlay (tabs, renderers, tooltip)
   • Front Load search bar
   • Exposes window.MLOverlay.open() for topload-lookup.js
══════════════════════════════════════════════════════ */
(function () {

  /* ─── FL descriptions ─── */
  const FL_DESC = {
    "Cotton Normal": "Cotton colour-fast garments such as shirts, pants, uniforms, bed and table linen, towels, nightdresses, pyjamas, underwear, etc.",
    "Cotton Eco Plus": "An energy-efficient cotton wash for lightly to normally soiled cotton items. Achieves effective cleaning at lower temperatures, reducing electricity and water consumption.",
    "Cotton Eco": "A resource-saving wash variant for cotton items, optimising water levels and temperature to deliver clean results while minimising energy use.",
    "Cotton": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
    "Cotton Whites": "A higher-temperature cotton wash specifically designed for white cotton fabrics, providing thorough cleaning and helping maintain brightness.",
    "Cotton Coloured": "Coloured cotton garments requiring gentle lower-temperature washing to preserve vibrancy and prevent colour run or fading.",
    "Cotton Rinse": "An additional standalone rinse cycle for cotton garments to guarantee complete removal of detergent and softener residues.",
    "Cotton/Cotton Eco": "Cotton colour-fast garments washed under a combined cotton or eco-friendly cotton setting.",
    "Cotton/Cotton Eco Plus": "Cotton garments washed under a combined standard or eco-plus setting.",
    "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments, with an eco variant option for lightly soiled loads.",
    "Cotton Normal/Cotton Eco Plus": "Standard cotton wash for colour-fast everyday garments, combined with an eco-plus option for lightly soiled loads.",
    "Synthetic Daily": "Daily wear garments that are made of polyester, acrylic, or polyamide.",
    "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",
    "Synthetic/Daily": "Daily wear garments made of polyester, acrylic, or polyamide. Gentle drum action and moderate temperatures protect synthetic fibres.",
    "CradleWash": "Hand wash only garments, as well as lingerie, delicate washable fabrics made of silk, satin, synthetic or sheer fabrics.",
    "Woolens": "Machine washable woollen garments only. Use appropriate detergent.",
    "Woollens": "Machine washable woollen garments only. Gentle drum action and cool temperatures preserve the natural properties of wool.",
    "Woollens 30": "A 30-minute gentle cycle for machine washable woollen garments.",
    "Wool": "Machine washable wool and wool-blend garments only. A neutral wool wash detergent is recommended.",
    "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
    "Mix/Daily 60'": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean.",
    "Mixed": "A versatile programme for a mixed load of cotton, synthetic, and easy-care fabrics.",
    "Mixed Soiled": "Various types of cotton, synthetic or easy-care garments except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",
    "Mixed Soiled+": "Various types of cotton, synthetic or easy-care garments with heavier soiling.",
    "Mix Soiled 40": "Various types of cotton, synthetic or easy-care garments washed at 40°C.",
    "Express Wash": "Lightly soiled, coloured laundry made of cotton, linen, synthetic or blended fabrics.",
    "Express 30": "Lightly soiled coloured laundry. Completed in 30 minutes.",
    "Express 15": "Lightly soiled coloured laundry. Completed in 15 minutes — the fastest programme available.",
    "Express 15'/Express 30": "Lightly soiled coloured laundry. Available in a 15-minute or 30-minute cycle.",
    "Baby Wear": "Baby wear items such as baby clothes, underwear, cloth diapers, pillows, bed sheets, etc. High temperature wash and extra rinses for hygiene.",
    "Bulky/Bedding": "Machine washable cotton curtains and large items like blankets and bedding covers.",
    "Bulky": "Machine washable large oversized items like blankets and bedding covers. Low spin speed and gentle drum movement prevent damage.",
    "Hygiene": "A high-temperature sanitising programme that kills bacteria, viruses, and common household allergens.",
    "Refresh": "For removing odour and de-wrinkling the laundry. Suitable for cotton, synthetic and mixed fabrics.",
    "Anti Allergen": "Cotton and linen fabrics that come in direct contact with the skin. Removes allergens through high-temperature wash.",
    "Jeans": "Jeans or other coloured garments that don't bleed colours.",
    "Inner Wear": "Machine washable lingerie or innerwear.",
    "PowerSteam": "Recommended for effective stain removal. Lightly soiled cotton, synthetic and mixed fabrics.",
    "Shirts": "Casual shirts that do not need to be ironed after washing.",
    "Shirts/Blouses": "Casual shirts and blistles that do not need to be ironed after washing.",
    "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",
    "Fitness Wear": "Gym and athletic clothing. Removes sweat and odour while preserving performance fabric properties.",
    "Dark Wash": "Dark-coloured cotton or easy-care fabric garments.",
    "Uniform": "Cotton colour-fast work uniforms, shirts, pants and school wear.",
    "Linen": "Household linen items such as bed sheets, table linen, and towels.",
    "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets, and table linen.",
    "Curtains": "Machine washable cotton curtains washed with gentle action and low spin speed.",
    "Daily Wear": "A balanced programme for normally soiled everyday clothing — efficient use of water and energy.",
    "Quick 30": "A condensed 30-minute wash for small loads of lightly soiled clothes.",
    "Quick Wash 30": "A condensed 30-minute wash for small loads of lightly soiled clothes.",
    "Spin Dry/Drain": "A standalone water-extraction cycle that spins laundry at high speed to remove residual water.",
    "Additives/Rinse + Spin": "An extra rinse cycle followed by a full spin to thoroughly flush out detergent or fabric-softener residues.",
    "Tub Clean": "Run this programme to eliminate impurities, scaling, bacteria and unpleasant smell from the washing machine.",
    "Eco Wash": "An environment-conscious programme that uses lower water temperatures and reduced cycle time."
  };

  /* ─── DOM ─── */
  const overlay   = document.getElementById('modelOverlay');
  const closeBtn  = document.getElementById('modelOverlayClose');
  const titleEl   = document.getElementById('modelOverlayTitle');
  const tabsEl    = document.getElementById('modelTabs');
  const bodyEl    = document.getElementById('modelTabBody');

  /* ─── Floating tooltip ─── */
  const tooltip = document.createElement('div');
  tooltip.id        = 'mlInfoTooltip';
  tooltip.innerHTML = '<div class="ml-info-tooltip-title"></div><div class="ml-info-tooltip-body"></div>';
  document.body.appendChild(tooltip);
  let activeInfoBtn = null;

  function showTooltip(btn, title, text) {
    tooltip.querySelector('.ml-info-tooltip-title').textContent = title;
    tooltip.querySelector('.ml-info-tooltip-body').textContent  = text;
    tooltip.classList.add('visible');
    const r  = btn.getBoundingClientRect();
    const tw = tooltip.offsetWidth  || 280;
    const th = tooltip.offsetHeight || 80;
    let left = r.left + window.scrollX;
    let top  = r.bottom + window.scrollY + 6;
    if (left + tw > window.innerWidth - 12) left = window.innerWidth - tw - 12;
    if (left < 8) left = 8;
    if (top + th > window.innerHeight + window.scrollY - 12) top = r.top + window.scrollY - th - 6;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
    activeInfoBtn = btn;
  }
  function hideTooltip() {
    tooltip.classList.remove('visible');
    activeInfoBtn = null;
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.ml-info-btn') && !e.target.closest('#mlInfoTooltip')) hideTooltip();
  });

  /* ─── Helpers ─── */
  function fmtCurrency(val) {
    if (!val && val !== 0) return '—';
    return '₹ ' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
  function infoBtn(name, descMap) {
    if (!descMap[name]) return '';
    return `<button class="ml-info-btn" data-name="${name.replace(/"/g,'&quot;')}" title="What is ${name}?">ⓘ</button>`;
  }
  function typeBadge(type) {
    const isTop = type === 'topload';
    return `<span class="ml-type-badge ${isTop ? 'ml-badge-top' : 'ml-badge-front'}">${isTop ? '🔵 Top Load' : '🟢 Front Load'}</span>`;
  }

  /* ─── Tab renderers ─── */
  function renderPrograms(data, descMap) {
    if (!data.programs?.length) return '<p class="ml-empty">No program data available.</p>';
    return `<div class="ml-chip-grid">${data.programs.map(p =>
      `<span class="ml-chip-wrap"><span class="ml-chip">${p}</span>${infoBtn(p, descMap)}</span>`
    ).join('')}</div>`;
  }
  function renderKeyFeatures(data, descMap) {
    const kf = data.keyFeatures || {};
    const sections = [
      { title: '🔬 Advanced Wash Technology', key: 'Advanced Wash Technology' },
      { title: '🛡️ Machine Care',              key: 'Machine Care' },
      { title: '🎯 User Convenience',           key: 'User Convenience' },
    ];
    const html = sections.map(s => {
      const items = kf[s.key] || [];
      if (!items.length) return '';
      return `<div class="ml-feature-section">
        <div class="ml-feature-title">${s.title}</div>
        <div class="ml-chip-grid">${items.map(i =>
          `<span class="ml-chip-wrap"><span class="ml-chip ml-chip-feat">${i}</span>${infoBtn(i, descMap)}</span>`
        ).join('')}</div>
      </div>`;
    }).join('');
    return html || '<p class="ml-empty">No feature data available.</p>';
  }
  function renderNomenclature(data) {
    const entries = Object.entries(data.nomenclature || {});
    if (!entries.length) return '<p class="ml-empty">No nomenclature data available.</p>';
    return `<div class="ml-nom-grid">${entries.map(([code, meaning]) =>
      `<div class="ml-nom-card">
        <div class="ml-nom-code">${code}</div>
        <div class="ml-nom-arrow">→</div>
        <div class="ml-nom-meaning">${meaning}</div>
      </div>`
    ).join('')}</div>`;
  }
  function renderAMC(data) {
    const entries = Object.entries(data.amcEw || {});
    if (!entries.length) return '<p class="ml-empty">No AMC / EW data available.</p>';
    return `<div class="ml-amc-table">
      <div class="ml-amc-header"><span>Plan</span><span>Value</span></div>
      ${entries.map(([plan, val]) =>
        `<div class="ml-amc-row"><span class="ml-amc-plan">${plan}</span><span class="ml-amc-val">${fmtCurrency(val)}</span></div>`
      ).join('')}
    </div>`;
  }
  function renderTestMode(data) {
    const t = data.testMode || {};
    if (!Object.keys(t).length) return '<p class="ml-empty">No test mode data available for this model.</p>';
    return `<div class="ml-testmode">
      ${[
        { label: '1. Program Position', value: t.Program_Position || '—' },
        { label: '2. Press Button',     value: t.Test_Mode_Button || '—' },
        { label: '3. Display Shows',    value: t.Display_Shows    || '—' },
      ].map(s =>
        `<div class="ml-testmode-step">
          <div class="ml-testmode-label">${s.label}</div>
          <div class="ml-testmode-value">${s.value}</div>
        </div>`
      ).join('')}
    </div>`;
  }

  /* ─── Info btn delegation ─── */
  let activeDescMap = {};
  bodyEl.addEventListener('click', e => {
    const b = e.target.closest('.ml-info-btn');
    if (!b) return;
    e.stopPropagation();
    if (activeInfoBtn === b) { hideTooltip(); return; }
    const desc = activeDescMap[b.dataset.name];
    if (desc) showTooltip(b, b.dataset.name, desc);
  });

  /* ─── Overlay open/close ─── */
  const TABS = [
    { id: 'programs',     label: '📋 Programs' },
    { id: 'features',     label: '✨ Key Features' },
    { id: 'nomenclature', label: '🔤 Nomenclature' },
    { id: 'amc',          label: '💰 AMC / EW' },
    { id: 'testmode',     label: '🛠️ Test Mode' },
  ];
  let currentData = null;
  let activeTab   = 'programs';

  function getRenderer(id, data, descMap) {
    if (id === 'programs')     return renderPrograms(data, descMap);
    if (id === 'features')     return renderKeyFeatures(data, descMap);
    if (id === 'nomenclature') return renderNomenclature(data);
    if (id === 'amc')          return renderAMC(data);
    if (id === 'testmode')     return renderTestMode(data);
    return '';
  }

  function openOverlay(modelObj) {
    currentData   = modelObj;
    activeTab     = 'programs';
    activeDescMap = modelObj.type === 'topload' ? (window._TL_DESC || {}) : FL_DESC;
    titleEl.innerHTML = modelObj.model + ' ' + typeBadge(modelObj.type);
    tabsEl.innerHTML  = TABS.map(t =>
      `<button class="ml-tab ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');
    bodyEl.innerHTML  = renderPrograms(modelObj, activeDescMap);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  tabsEl.addEventListener('click', e => {
    const tabBtn = e.target.closest('[data-tab]');
    if (!tabBtn || !currentData) return;
    hideTooltip();
    activeTab = tabBtn.dataset.tab;
    tabsEl.querySelectorAll('.ml-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === activeTab)
    );
    bodyEl.innerHTML = getRenderer(activeTab, currentData, activeDescMap);
  });

  function closeOverlay() {
    hideTooltip();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    currentData = null;
  }
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { hideTooltip(); closeOverlay(); } });

  /* ─── Expose overlay for topload-lookup.js ─── */
  window.MLOverlay = { open: openOverlay };

  /* ════════════════════════════════════════
     FRONT LOAD search bar
  ════════════════════════════════════════ */
  const flInput   = document.getElementById('flSearchInput');
  const flBtn     = document.getElementById('flSearchBtn');
  const flSuggest = document.getElementById('flSuggestions');

  if (!flInput) { console.warn('[FL] #flSearchInput not found'); return; }

  let flList = [], flTimer;

  function flShow() {
    if (!flList.length) { flHide(); return; }
    flSuggest.innerHTML = flList.slice(0, 8).map((m, i) =>
      `<div class="ml-suggest-item" data-idx="${i}">${m.model}</div>`
    ).join('');
    flSuggest.style.display = 'block';
  }
  function flHide() { flSuggest.style.display = 'none'; flList = []; }

  async function flFetch(q) {
    if (q.length < 2) { flHide(); return; }
    try {
      const res  = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=front');
      if (!res.ok) { flHide(); return; }
      const data = await res.json();
      flList = data.results || [];
      flShow();
    } catch { flHide(); }
  }

  async function flSearch() {
    const q = flInput.value.trim();
    if (q.length < 2) return;
    flHide();
    try {
      const res  = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=front');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.results?.length) {
        openOverlay(data.results[0]);
      } else {
        titleEl.textContent = 'No model found';
        tabsEl.innerHTML    = '';
        bodyEl.innerHTML    = `<p class="ml-empty">No Front Load results for "<strong>${q}</strong>".</p>`;
        overlay.classList.add('open');
      }
    } catch (err) {
      console.error('[FL]', err);
    }
  }

  /* ── Click on suggestion — mousedown prevents blur swallowing click ── */
  flSuggest.addEventListener('mousedown', e => {
    e.preventDefault();
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const m = flList[parseInt(item.dataset.idx)];
    if (m) { flInput.value = m.model; flHide(); openOverlay(m); }
  });

  flInput.addEventListener('input', () => {
    clearTimeout(flTimer);
    flTimer = setTimeout(() => flFetch(flInput.value.trim()), 280);
  });
  flInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); flSearch(); }
    if (e.key === 'Escape') flHide();
  });
  flInput.addEventListener('blur', () => setTimeout(flHide, 150));
  flBtn.addEventListener('click', flSearch);

})();