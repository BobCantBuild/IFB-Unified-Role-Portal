(function () {

  const input     = document.getElementById('modelSearchInput');
  const btn       = document.getElementById('modelSearchBtn');
  const overlay   = document.getElementById('modelOverlay');
  const closeBtn  = document.getElementById('modelOverlayClose');
  const titleEl   = document.getElementById('modelOverlayTitle');
  const tabsEl    = document.getElementById('modelTabs');
  const bodyEl    = document.getElementById('modelTabBody');
  const suggestEl = document.getElementById('modelSuggestions');

  if (!input) { console.warn('[ModelLookup] #modelSearchInput not found'); return; }

  function fmtCurrency(val) {
    if (!val && val !== 0) return '—';
    return '₹ ' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function renderPrograms(data) {
    if (!data.programs?.length) return '<p class="ml-empty">No program data available.</p>';
    return `<div class="ml-chip-grid">
      ${data.programs.map(p => `<span class="ml-chip">${p}</span>`).join('')}
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
          ${items.map(i => `<span class="ml-chip ml-chip-feat">${i}</span>`).join('')}
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
      <div class="ml-amc-header">
        <span>Plan</span><span>Value</span>
      </div>
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
    const steps = [
      { label: '1. Program Position', value: t.Program_Position || '—' },
      { label: '2. Press Button',     value: t.Test_Mode_Button || '—' },
      { label: '3. Display Shows',    value: t.Display_Shows    || '—' },
    ];
    return `<div class="ml-testmode">
      ${steps.map(s => `
        <div class="ml-testmode-step">
          <div class="ml-testmode-label">${s.label}</div>
          <div class="ml-testmode-value">${s.value}</div>
        </div>`).join('')}
    </div>`;
  }

  const TABS = [
    { id: 'programs',     label: '📋 Programs',    render: renderPrograms },
    { id: 'features',     label: '✨ Key Features', render: renderKeyFeatures },
    { id: 'nomenclature', label: '🔤 Nomenclature', render: renderNomenclature },
    { id: 'amc',          label: '💰 AMC / EW',     render: renderAMC },
    { id: 'testmode',     label: '🛠️ Test Mode',    render: renderTestMode },
  ];

  let currentData  = null;
  let activeTab    = 'programs';
  let suggestions  = [];
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

  tabsEl?.addEventListener('click', e => {
    const tabBtn = e.target.closest('[data-tab]');
    if (!tabBtn || !currentData) return;
    activeTab = tabBtn.dataset.tab;
    tabsEl.querySelectorAll('.ml-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === activeTab)
    );
    const tab = TABS.find(t => t.id === activeTab);
    bodyEl.innerHTML = tab ? tab.render(currentData) : '';
  });

  function closeOverlay() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    currentData = null;
  }
  closeBtn?.addEventListener('click', closeOverlay);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });

  async function fetchSuggestions(q) {
    if (q.length < 2) { hideSuggestions(); return; }
    try {
      const res  = await fetch(`/api/model?q=${encodeURIComponent(q)}`);
      if (!res.ok) { console.warn('[ModelLookup] API:', res.status); hideSuggestions(); return; }
      const json = await res.json();
      suggestions = json.results || [];
      renderSuggestions();
    } catch (err) {
      console.warn('[ModelLookup] fetch error:', err.message);
      hideSuggestions();
    }
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

  suggestEl?.addEventListener('click', e => {
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const model = suggestions[parseInt(item.dataset.idx)];
    if (model) { input.value = model.model; hideSuggestions(); openOverlay(model); }
  });

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
        bodyEl.innerHTML    = `<p class="ml-empty">No results for "<strong>${q}</strong>". Try a different name.</p>`;
        tabsEl.innerHTML    = '';
        overlay.classList.add('open');
      }
    } catch (err) {
      console.error('[ModelLookup] error:', err);
      titleEl.textContent = 'Error';
      bodyEl.innerHTML    = '<p class="ml-empty">Could not reach API. Check DevTools console.</p>';
      tabsEl.innerHTML    = '';
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
  btn?.addEventListener('click', doSearch);
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !suggestEl?.contains(e.target)) hideSuggestions();
  });

})();