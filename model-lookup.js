(function () {

  /* ═══════════════════════════════════════════════
     PROGRAM DESCRIPTIONS — embedded from txt file
  ═══════════════════════════════════════════════ */
  const PROG_DESC = {
  "Cotton Normal": "Cotton colour-fast garments such as shirts, pants, uniforms, bed and table linen, towels, nightdresses, pyjamas, underwear, etc.",

  "Cotton Eco Plus": "An energy-efficient cotton wash for lightly to normally soiled cotton items. Achieves effective cleaning at lower temperatures, reducing electricity and water consumption.",

  "Cotton Eco": "A resource-saving wash variant for cotton items, optimising water levels and temperature to deliver clean results while minimising energy use.",

  "Cotton": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",

  "Cotton Whites": "A higher-temperature cotton wash specifically designed for white cotton fabrics, providing thorough cleaning and helping maintain brightness.",

  "Cotton Coloured": "Coloured cotton garments requiring gentle lower-temperature washing to preserve vibrancy and prevent colour run or fading.",

  "Cotton Rinse": "An additional standalone rinse cycle for cotton garments to guarantee complete removal of detergent and softener residues.",

  "Cotton/Cotton Eco": "Cotton colour-fast garments washed under a combined cotton or eco-friendly cotton setting. Switches between full-power and energy-saving modes based on load and soiling level.",

  "Cotton/Cotton Eco Plus": "Cotton garments washed under a combined standard or eco-plus setting, offering thorough cleaning or energy-efficient performance depending on the level of soiling.",

  "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments, with an eco variant option for lightly soiled loads — reduces energy and water consumption without compromising cleanliness.",

  "Cotton Normal/Cotton Eco Plus": "Standard cotton wash for colour-fast everyday garments, combined with an eco-plus option for lightly soiled loads to maximise energy and water efficiency.",

  "Synthetic Daily": "Daily wear garments that are made of polyester, acrylic, or polyamide.",

  "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",

  "Synthetic/Daily": "Daily wear garments made of polyester, acrylic, or polyamide. Gentle drum action and moderate temperatures protect synthetic fibres during the wash.",

  "CradleWash": "Hand wash only garments, as well as lingerie, delicate washable fabrics made of silk, satin, synthetic or sheer fabrics.",

  "Woolens": "Machine washable woollen garments only. Use appropriate detergent.",

  "Woollens": "Machine washable woollen garments only. Gentle drum action and cool temperatures preserve the natural properties of wool. Use a neutral wool wash detergent.",

  "Woollens 30": "A 30-minute gentle cycle for machine washable woollen garments. A neutral wool wash detergent is recommended.",

  "Wool": "Machine washable wool and wool-blend garments only. A neutral wool wash detergent is recommended.",

  "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",

  "Mix/Daily 60'": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean. Not recommended for silk/delicates, dark clothes, wool, duvets, or curtains.",

  "Mixed": "A versatile programme for a mixed load of cotton, synthetic, and easy-care fabrics with varying soiling levels. Balances wash performance and fabric care for everyday mixed laundry.",

  "Mixed Soiled": "Various types of cotton, synthetic or easy-care garments except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",

  "Mixed Soiled+": "Various types of cotton, synthetic or easy-care garments with heavier soiling, except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",

  "Mix Soiled 40": "Various types of cotton, synthetic or easy-care garments washed at 40°C — balances effective cleaning with energy efficiency.",

  "Express Wash": "Lightly soiled, coloured laundry made of cotton, linen, synthetic or blended fabrics.",

  "Express 30": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 30 minutes.",

  "Express 15": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 15 minutes — the fastest programme available.",

  "Express 15'/Express 30": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Available in a 15-minute or 30-minute cycle depending on load size and soiling level.",

  "Baby Wear": "Baby wear items such as baby clothes, underwear, cloth diapers, pillows, bed sheets, etc. High temperature wash and extra rinses to ensure better rinse performance and hygiene.",

  "Bulky/Bedding": "Machine washable cotton curtains and large items like blankets and bedding covers.",

  "Bulky": "Machine washable large oversized items like blankets and bedding covers. Low spin speed and gentle drum movement prevent damage to large bulky items during the wash.",

  "Hygiene": "A high-temperature sanitising programme that kills bacteria, viruses, and common household allergens. Ideal for underwear, gym wear, towels, and items used by allergy-prone individuals.",

  "Refresh": "For removing odour and de-wrinkling the laundry. Suitable for cotton, synthetic and mixed fabrics.",

  "Anti Allergen": "Cotton and linen fabrics that come in direct contact with the skin. Removes allergens through high-temperature wash with additional rinse cycles.",

  "Jeans": "Jeans or other coloured garments that don't bleed colours.",

  "Inner Wear": "Machine washable lingerie or innerwear.",

  "PowerSteam": "Recommended for effective stain removal. Lightly soiled cotton, synthetic and mixed fabrics.",

  "Shirts": "Casual shirts that do not need to be ironed after washing.",

  "Shirts/Blouses": "Casual shirts and blouses that do not need to be ironed after washing.",

  "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",

  "Fitness Wear": "Gym and athletic clothing including singlets, leggings, jogging clothes and running wear. Removes sweat and odour while preserving performance fabric properties.",

  "Dark Wash": "Dark-coloured cotton or easy-care fabric garments.",

  "Uniform": "Cotton colour-fast work uniforms, shirts, pants and school wear. Thorough wash with strong mechanical action for heavily soiled items.",

  "Linen": "Household linen items such as bed sheets, table linen, and towels. Effective stain removal with proper care for the fabric blend.",

  "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets, and table linen. Combines thorough cleaning performance with appropriate care for both uniform fabrics and household linen blends.",

  "Curtains": "Machine washable cotton curtains washed with gentle action and low spin speed to avoid distortion and creasing.",

  "Daily Wear": "A balanced programme for normally soiled everyday clothing such as casual shirts, trousers, and mixed fabrics — efficient use of water and energy.",

  "Quick 30": "A condensed 30-minute wash for small loads of lightly soiled clothes or recently worn garments.",

  "Quick Wash 30": "A condensed 30-minute wash for small loads of lightly soiled clothes or recently worn garments — delivers a fast, effective clean without a full cycle.",

  "Spin Dry/Drain": "A standalone water-extraction cycle that spins laundry at high speed to remove residual water, or drains remaining water from the drum — no washing involved.",

  "Additives/Rinse + Spin": "An extra rinse cycle followed by a full spin to thoroughly flush out detergent or fabric-softener residues — especially useful for people with sensitive skin.",

  "Tub Clean": "Run this programme to eliminate impurities, scaling, bacteria and unpleasant smell from the washing machine.",

  "Eco Wash": "An environment-conscious programme that uses lower water temperatures and reduced cycle time to minimise energy and water consumption while cleaning lightly soiled items effectively.",

  "Cotton Normal": "Cotton colour-fast garments such as shirts, pants, uniforms, bed and table linen, towels, nightdresses, pyjamas, underwear, etc.",

  "Cotton Eco Plus": "An energy-efficient cotton wash for lightly to normally soiled cotton items. Achieves effective cleaning at lower temperatures, reducing electricity and water consumption.",

  "Cotton Eco": "A resource-saving wash variant for cotton items, optimising water levels and temperature to deliver clean results while minimising energy use.",

  "Cotton": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",

  "Cotton Whites": "A higher-temperature cotton wash specifically designed for white cotton fabrics, providing thorough cleaning and helping maintain brightness.",

  "Cotton Coloured": "Coloured cotton garments requiring gentle lower-temperature washing to preserve vibrancy and prevent colour run or fading.",

  "Cotton Rinse": "An additional standalone rinse cycle for cotton garments to guarantee complete removal of detergent and softener residues.",

  "Cotton/Cotton Eco": "Cotton colour-fast garments washed under a combined cotton or eco-friendly cotton setting. Switches between full-power and energy-saving modes based on load and soiling level.",

  "Cotton/Cotton Eco Plus": "Cotton garments washed under a combined standard or eco-plus setting, offering thorough cleaning or energy-efficient performance depending on the level of soiling.",

  "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments, with an eco variant option for lightly soiled loads — reduces energy and water consumption without compromising cleanliness.",

  "Cotton Normal/Cotton Eco Plus": "Standard cotton wash for colour-fast everyday garments, combined with an eco-plus option for lightly soiled loads to maximise energy and water efficiency.",

  "Synthetic Daily": "Daily wear garments that are made of polyester, acrylic, or polyamide.",

  "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",

  "Synthetic/Daily": "Daily wear garments made of polyester, acrylic, or polyamide. Gentle drum action and moderate temperatures protect synthetic fibres during the wash.",

  "CradleWash": "Hand wash only garments, as well as lingerie, delicate washable fabrics made of silk, satin, synthetic or sheer fabrics.",

  "Woolens": "Machine washable woollen garments only. Use appropriate detergent.",

  "Woollens": "Machine washable woollen garments only. Gentle drum action and cool temperatures preserve the natural properties of wool. Use a neutral wool wash detergent.",

  "Woollens 30": "A 30-minute gentle cycle for machine washable woollen garments. A neutral wool wash detergent is recommended.",

  "Wool": "Machine washable wool and wool-blend garments only. A neutral wool wash detergent is recommended.",

  "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",

  "Mix/Daily 60'": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean. Not recommended for silk/delicates, dark clothes, wool, duvets, or curtains.",

  "Mixed": "A versatile programme for a mixed load of cotton, synthetic, and easy-care fabrics with varying soiling levels. Balances wash performance and fabric care for everyday mixed laundry.",

  "Mixed Soiled": "Various types of cotton, synthetic or easy-care garments except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",

  "Mixed Soiled+": "Various types of cotton, synthetic or easy-care garments with heavier soiling, except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",

  "Mix Soiled 40": "Various types of cotton, synthetic or easy-care garments washed at 40°C — balances effective cleaning with energy efficiency.",

  "Express Wash": "Lightly soiled, coloured laundry made of cotton, linen, synthetic or blended fabrics.",

  "Express 30": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 30 minutes.",

  "Express 15": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 15 minutes — the fastest programme available.",

  "Express 15'/Express 30": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Available in a 15-minute or 30-minute cycle depending on load size and soiling level.",

  "Baby Wear": "Baby wear items such as baby clothes, underwear, cloth diapers, pillows, bed sheets, etc. High temperature wash and extra rinses to ensure better rinse performance and hygiene.",

  "Bulky/Bedding": "Machine washable cotton curtains and large items like blankets and bedding covers.",

  "Bulky": "Machine washable large oversized items like blankets and bedding covers. Low spin speed and gentle drum movement prevent damage to large bulky items during the wash.",

  "Hygiene": "A high-temperature sanitising programme that kills bacteria, viruses, and common household allergens. Ideal for underwear, gym wear, towels, and items used by allergy-prone individuals.",

  "Refresh": "For removing odour and de-wrinkling the laundry. Suitable for cotton, synthetic and mixed fabrics.",

  "Anti Allergen": "Cotton and linen fabrics that come in direct contact with the skin. Removes allergens through high-temperature wash with additional rinse cycles.",

  "Jeans": "Jeans or other coloured garments that don't bleed colours.",

  "Inner Wear": "Machine washable lingerie or innerwear.",

  "PowerSteam": "Recommended for effective stain removal. Lightly soiled cotton, synthetic and mixed fabrics.",

  "Shirts": "Casual shirts that do not need to be ironed after washing.",

  "Shirts/Blouses": "Casual shirts and blouses that do not need to be ironed after washing.",

  "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",

  "Fitness Wear": "Gym and athletic clothing including singlets, leggings, jogging clothes and running wear. Removes sweat and odour while preserving performance fabric properties.",

  "Dark Wash": "Dark-coloured cotton or easy-care fabric garments.",

  "Uniform": "Cotton colour-fast work uniforms, shirts, pants and school wear. Thorough wash with strong mechanical action for heavily soiled items.",

  "Linen": "Household linen items such as bed sheets, table linen, and towels. Effective stain removal with proper care for the fabric blend.",

  "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets, and table linen. Combines thorough cleaning performance with appropriate care for both uniform fabrics and household linen blends.",

  "Curtains": "Machine washable cotton curtains washed with gentle action and low spin speed to avoid distortion and creasing.",

  "Daily Wear": "A balanced programme for normally soiled everyday clothing such as casual shirts, trousers, and mixed fabrics — efficient use of water and energy.",

  "Quick 30": "A condensed 30-minute wash for small loads of lightly soiled clothes or recently worn garments.",

  "Quick Wash 30": "A condensed 30-minute wash for small loads of lightly soiled clothes or recently worn garments — delivers a fast, effective clean without a full cycle.",

  "Spin Dry/Drain": "A standalone water-extraction cycle that spins laundry at high speed to remove residual water, or drains remaining water from the drum — no washing involved.",

  "Additives/Rinse + Spin": "An extra rinse cycle followed by a full spin to thoroughly flush out detergent or fabric-softener residues — especially useful for people with sensitive skin.",

  "Tub Clean": "Run this programme to eliminate impurities, scaling, bacteria and unpleasant smell from the washing machine.",

  "Eco Wash": "An environment-conscious programme that uses lower water temperatures and reduced cycle time to minimise energy and water consumption while cleaning lightly soiled items effectively."};

  /* ═══════════════════════════════════════════════
     DOM refs
  ═══════════════════════════════════════════════ */
  const input     = document.getElementById('modelSearchInput');
  const btn       = document.getElementById('modelSearchBtn');
  const overlay   = document.getElementById('modelOverlay');
  const closeBtn  = document.getElementById('modelOverlayClose');
  const titleEl   = document.getElementById('modelOverlayTitle');
  const tabsEl    = document.getElementById('modelTabs');
  const bodyEl    = document.getElementById('modelTabBody');
  const suggestEl = document.getElementById('modelSuggestions');

  if (!input) { console.warn('[ModelLookup] #modelSearchInput not found'); return; }

  /* ═══════════════════════════════════════════════
     Tooltip — single shared element
  ═══════════════════════════════════════════════ */
  const tooltip = document.createElement('div');
  tooltip.id        = 'mlInfoTooltip';
  tooltip.className = 'ml-info-tooltip';
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

    // keep within viewport
    if (left + tw > window.innerWidth - 12)  left = window.innerWidth - tw - 12;
    if (left < 8) left = 8;
    if (top + th > window.innerHeight + window.scrollY - 12) {
      top = r.top + window.scrollY - th - 6; // flip above
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
    activeInfoBtn = btn;
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    activeInfoBtn = null;
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.ml-info-btn') && !e.target.closest('#mlInfoTooltip')) {
      hideTooltip();
    }
  });

  /* ═══════════════════════════════════════════════
     Helpers
  ═══════════════════════════════════════════════ */
  function fmtCurrency(val) {
    if (!val && val !== 0) return '—';
    return '₹ ' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  /* ── info button HTML helper ── */
  function infoBtn(name, type) {
    const key  = type === 'program' ? name : name;
    const desc = PROG_DESC[name];
    if (!desc) return '';
    return `<button class="ml-info-btn" data-name="${name.replace(/"/g,'&quot;')}" data-type="${type}" title="What is ${name}?">ⓘ</button>`;
  }

  /* ═══════════════════════════════════════════════
     Tab renderers
  ═══════════════════════════════════════════════ */
  function renderPrograms(data) {
    if (!data.programs?.length) return '<p class="ml-empty">No program data available.</p>';
    return `<div class="ml-chip-grid">
      ${data.programs.map(p => `
        <span class="ml-chip-wrap">
          <span class="ml-chip">${p}</span>${infoBtn(p, 'program')}
        </span>`).join('')}
    </div>`;
  }

  function renderKeyFeatures(data) {
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
        <div class="ml-chip-grid">
          ${items.map(i => `
            <span class="ml-chip-wrap">
              <span class="ml-chip ml-chip-feat">${i}</span>${infoBtn(i, 'feature')}
            </span>`).join('')}
        </div>
      </div>`;
    }).join('');
    return html || '<p class="ml-empty">No feature data available.</p>';
  }

  function renderNomenclature(data) {
    const n = data.nomenclature || {};
    const entries = Object.entries(n);
    if (!entries.length) return '<p class="ml-empty">No nomenclature data available.</p>';
    return `<div class="ml-nom-grid">
      ${entries.map(([code, meaning]) => `
        <div class="ml-nom-card">
          <div class="ml-nom-code">${code}</div>
          <div class="ml-nom-arrow">→</div>
          <div class="ml-nom-meaning">${meaning}</div>
        </div>`).join('')}
    </div>`;
  }

  function renderAMC(data) {
    const a = data.amcEw || {};
    const entries = Object.entries(a);
    if (!entries.length) return '<p class="ml-empty">No AMC / EW data available.</p>';
    return `<div class="ml-amc-table">
      <div class="ml-amc-header"><span>Plan</span><span>Value</span></div>
      ${entries.map(([plan, val]) => `
        <div class="ml-amc-row">
          <span class="ml-amc-plan">${plan}</span>
          <span class="ml-amc-val">${fmtCurrency(val)}</span>
        </div>`).join('')}
    </div>`;
  }

  function renderTestMode(data) {
    const t = data.testMode || {};
    if (!Object.keys(t).length) return '<p class="ml-empty">No test mode data available.</p>';
    return `<div class="ml-testmode">
      ${[
        { label: '1. Program Position', value: t.Program_Position || '—' },
        { label: '2. Press Button',     value: t.Test_Mode_Button || '—' },
        { label: '3. Display Shows',    value: t.Display_Shows    || '—' },
      ].map(s => `
        <div class="ml-testmode-step">
          <div class="ml-testmode-label">${s.label}</div>
          <div class="ml-testmode-value">${s.value}</div>
        </div>`).join('')}
    </div>`;
  }

  /* ═══════════════════════════════════════════════
     Info button click — delegate on bodyEl
  ═══════════════════════════════════════════════ */
  bodyEl.addEventListener('click', e => {
    const b = e.target.closest('.ml-info-btn');
    if (!b) return;
    e.stopPropagation();
    if (activeInfoBtn === b) { hideTooltip(); return; }
    const name = b.dataset.name;
    const desc = PROG_DESC[name];
    if (desc) showTooltip(b, name, desc);
  });

  /* ═══════════════════════════════════════════════
     Tabs
  ═══════════════════════════════════════════════ */
  const TABS = [
    { id: 'programs',     label: '📋 Programs',    render: renderPrograms },
    { id: 'features',     label: '✨ Key Features', render: renderKeyFeatures },
    { id: 'nomenclature', label: '🔤 Nomenclature', render: renderNomenclature },
    { id: 'amc',          label: '💰 AMC / EW',     render: renderAMC },
    { id: 'testmode',     label: '🛠️ Test Mode',    render: renderTestMode },
  ];

  let currentData = null;
  let activeTab   = 'programs';
  let suggestions = [];
  let debounceTimer;

  function openOverlay(modelObj) {
    currentData = modelObj;
    activeTab   = 'programs';
    titleEl.textContent = modelObj.model;
    tabsEl.innerHTML = TABS.map(t =>
      `<button class="ml-tab ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');
    bodyEl.innerHTML = renderPrograms(modelObj);
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
    const tab = TABS.find(t => t.id === activeTab);
    bodyEl.innerHTML = tab ? tab.render(currentData) : '';
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

  /* ═══════════════════════════════════════════════
     Suggestions
  ═══════════════════════════════════════════════ */
  async function fetchSuggestions(q) {
    if (q.length < 2) { hideSuggestions(); return; }
    try {
      const res  = await fetch(`/api/model?q=${encodeURIComponent(q)}`);
      if (!res.ok) { hideSuggestions(); return; }
      const json = await res.json();
      suggestions = json.results || [];
      renderSuggestions();
    } catch { hideSuggestions(); }
  }

  function renderSuggestions() {
    if (!suggestions.length) { hideSuggestions(); return; }
    suggestEl.innerHTML = suggestions.slice(0, 8).map((m, i) =>
      `<div class="ml-suggest-item" data-idx="${i}">${m.model}</div>`
    ).join('');
    suggestEl.style.display = 'block';
  }

  function hideSuggestions() {
    if (suggestEl) suggestEl.style.display = 'none';
    suggestions = [];
  }

  suggestEl.addEventListener('click', e => {
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const model = suggestions[parseInt(item.dataset.idx)];
    if (model) { input.value = model.model; hideSuggestions(); openOverlay(model); }
  });

  /* ═══════════════════════════════════════════════
     Main search
  ═══════════════════════════════════════════════ */
  async function doSearch() {
    const q = input.value.trim();
    if (q.length < 2) return;
    hideSuggestions();
    try {
      const res  = await fetch(`/api/model?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (json.results?.length) {
        openOverlay(json.results[0]);
      } else {
        titleEl.textContent = 'No model found';
        tabsEl.innerHTML    = '';
        bodyEl.innerHTML    = `<p class="ml-empty">No results for "<strong>${q}</strong>".</p>`;
        overlay.classList.add('open');
      }
    } catch (err) {
      titleEl.textContent = 'Error';
      tabsEl.innerHTML    = '';
      bodyEl.innerHTML    = '<p class="ml-empty">Could not reach API. Check DevTools console.</p>';
      overlay.classList.add('open');
    }
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchSuggestions(input.value.trim()), 280);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    if (e.key === 'Escape') hideSuggestions();
  });
  btn.addEventListener('click', doSearch);
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !suggestEl?.contains(e.target)) hideSuggestions();
  });

})();
