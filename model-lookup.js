/* ═══════════════════════════════════════════════════════
   model-lookup.js  —  Pill Selector + Single Search Bar
   Supports: Front Load | Top Load | WDR
   (To add Dryer: add entry to TYPES + DESC_MAP)
═══════════════════════════════════════════════════════ */
(function () {

  /* ── Description maps ─────────────────────────────── */
  const FL_DESC  = {
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
  "Shirts/Blouses": "Casual shirts and blouses that do not need to be ironed after washing.",
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
  const TL_DESC  = {
  "Smart Sense": "Intelligent sensing program that automatically detects laundry load and optimises water level, wash time and rinse cycles for efficient washing.",
  "Smart Sense + Wash": "Program combination where Smart Sense and Wash LEDs glow together.",
  "Wash + Rinse + Spin": "Combination program for washing, rinsing and spinning.",
  "Only Wash": "Performs only washing operation.",
  "Aqua Save": "Saves water from the last rinse cycle for the next wash cycle.",
  "Express 30": "Washes small lightly soiled loads quickly.",
  "Heavy": "Used for heavy laundry items.",
  "Delicate": "Gentle wash for woollens/delicate garments.",
  "Mix/Daily": "Everyday clothes washing program with rhythms for stubborn dirt removal.",
  "Anti-Allergen": "Removes detergent residue using built-in rinses.",
  "Jeans": "Special wash for denim/jeans garments.",
  "Blankets (Curtains/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "StainFighter™": "Uses high water temperature to remove stains.",
  "My Cycle": "Saves preferred program settings for repeated use.",
  "Baby Wear": "Uses 40°C water and extra rinses for baby clothes.",
  "Tub Clean": "Cleans impurities, bacteria and odours from tub.",
  "Saree": "Program for machine washable sarees.",
  "Cotton": "For cotton garments like shirts, towels, uniforms, linens etc.",
  "Sportswear": "Dedicated program for washing sportswear and performance fabrics with gentle yet effective cleaning action.",
  "Silent": "Operates with reduced noise and smoother drum movement for quieter washing performance.",
  "Delay Wash": "Allows the user to delay the start of the wash cycle to a preferred later time.",
  "Power Wash": "Designed for heavily soiled clothes with enhanced washing intensity.",
  "Sports Wear": "Specially designed for sportswear and activewear fabrics.",
  "Hygiene": "Uses enhanced washing and rinsing performance to provide hygienic cleaning.",
  "Favourite": "Allows users to save and quickly access their preferred wash settings.",
  "Synthetic": "Suitable for synthetic fabrics such as polyester, nylon and blended garments.",
  "Bulky(Blankets/Jeans/Curtains)": "Special wash program for bulky garments like blankets, curtains and jeans.",
  "Bulky (Blankets/Jeans/Curtains)": "Special wash program for bulky garments like blankets, curtains and jeans using stronger wash movements.",
  "Blankets/Curtains/Bulky": "Designed for large and bulky laundry items with optimised water levels.",
  "Aqua Conserve": "Water-saving wash program that optimises water usage while maintaining effective washing performance.",
  "Favorite": "Stores customised wash settings for quick selection of frequently used washing preferences.",
  "Powered by Ai": "Detects the load, optimises water level and wash program automatically.",
  "Deep Clean": "AI-optimised deep cleaning with thousands of parameters for best wash results.",
  "Aqua Energie": "The technology that energises water to carry the detergent deep into the fabric.",
  "Aqua Spa Therapy": "An indulgent water treatment surrounds your clothes. Stubborn stains are shaken, loosened and rinsed away.",
  "Pentad Pulsator": "The new pulsator engine with a robust five vane design removes stubborn dirt.",
  "Triadic Pulsator": "Soft Scrub Pads gently scrub off stubborn dirt with powerful water jets.",
  "Tri Axial Cloth Movements": "Moves clothes on all three axes (X, Y, Z). Gently separates dirt from fabrics.",
  "Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash.",
  "4-Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash.",
  "3D Wash": "3D dynamic water jets and Tri Axial clothes rotation work together for a thorough wash.",
  "4D Wash": "Jets of water and showers from paddles ensure complete soaking of clothes.",
  "Crescent Moon Drum": "The crescent moon design of the drum allows the water to cushion the wash and protect the fabric.",
  "Intelligent Wash Programs": "Let your clothes enjoy the sensory pleasure of Deep Clean with IFB's intelligent wash programs.",
  "In-built Heater": "The in-built heater lets you select the water temperature for best wash results.",
  "Clean with Steam": "IFB's unique Power Steam™ with 2X steam for germ free, soft clothes.",
  "ActivMix": "Ensures thorough mixing of detergent and water for a better wash.",
  "Eco Inverter Motor": "Energy efficient motor consuming up to 40% less energy with minimal vibration.",
  "Soft Scrub Pads": "Gently scrubs off stubborn dirt.",
  "Swirl Jets": "Powerful water jets remove the dirt from every corner of the fabric.",
  "Centre Punch": "Gentle mechanical action squeezes the dirt out.",
  "Auto Tub Clean": "Automatically ensures tub hygiene after wash cycles.",
  "High-Low Voltage Protection": "Stops the program if voltage goes below 165V or rises above 270V.",
  "Program Memory Backup": "Remembers where to pick up from when power is restored after failure.",
  "Program Memory": "This system automatically balances the clothes inside to stabilise the spin cycle.",
  "Auto Imbalance System": "Automatically redistributes unbalanced clothes for a stable spin cycle.",
  "Child Lock": "Locks the machine settings to prevent children from accidentally changing them.",
  "Auto Softener Dispenser": "A special compartment where you can add softener before you start the wash.",
  "Auto Softner Dispenser": "A special compartment where you can add softener before you start the wash.",
  "Bleach Dispenser": "A special inlet to add bleach to the wash.",
  "Wheels": "Allow you to easily move the machine for cleaning or to change location.",
  "Lint Tower Filter": "Effectively captures fine fabric fibres floating inside the tub.",
  "Tower Filter": "The lint filter effectively captures fabric fibres floating inside the tub.",
  "Air Dry": "Fresh air enters through the exchange window to enable clean, hygienic drying.",
  "Air Dry Option": "Fresh air enters through the exchange window to enable clean, hygienic drying.",
  "Spray Rinse": "A jet sprays water evenly over your clothes for optimum washing and rinsing.",
  "Shower Rinse": "A jet sprays water evenly over your clothes for optimum washing and rinsing.",
  "Tub Dry": "Ensures tub hygiene after wash cycles.",
  "Soft Closing": "The door slowly slides and shuts softly when released.",
  "Soft Closing Lid": "The lid slowly slides and shuts softly when released.",
  "Drum Lamp (LED)": "LED Lamp provides light inside the drum for loading/unloading in darkness.",
  "Drum Lamp (LED Lamp)": "LED Lamp provides light inside the drum for loading/unloading in darkness.",
  "Delay Start": "Allows the user to delay the start of the wash cycle.",
  "Tub Clean Reminder": "Periodic reminder to clean the tub for hygiene and performance.",
  "Smart Diagnosis": "Built-in diagnostic assistance for easier troubleshooting.",
  "Rat Mesh": "Protective mesh helps reduce rat entry risk into the machine cabinet.",
  "Power Steam": "Steam-assisted cleaning for softer, fresher and more hygienic clothes.",
  "Hard Water Wash": "Optimised washing performance even in hard water conditions.",
  "Laundry Add": "Lets you add forgotten clothes during the early stage of the wash cycle.",
  "Self Diagnosis": "Displays fault information to simplify service troubleshooting.",
  "Auto Restart": "Resumes the cycle automatically after power returns.",
  "Time Delay": "Schedules washing to start later at a selected time.",
  "Extra Rinse": "Adds an extra rinse for better detergent removal.",
  "Pre Clean": "Helps loosen heavy dirt before the main wash.",
  "Hot Wash": "Uses heated water to improve stain removal and hygiene."
};
  const WDR_DESC = {
  "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
  "Cotton/Cotton Eco": "Cotton colour-fast garments. Shirts, pants, uniforms, bed and table linen, towels, night dresses, pyjamas, underwear, etc.",
  "Cotton/Cotton Eco/Uniform/Linen": "Cotton colour-fast garments. Shirts, pants, uniforms, bed and table linen, towels, night dresses, pyjamas, underwear, etc.",
  "Baby Wear": "High temperature and extra rinses for better rinse performance. Recommended for baby clothes, underwear, cloth diapers, pillows, bedsheets, etc.",
  "Anti Allergen": "Cotton and linen fabrics that come in direct contact with the skin.",
  "Express 15'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics.",
  "Express 15' / Express 30'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics.",
  "Refresh": "For removing odour and de-wrinkling the laundry. Cotton, synthetic and mixed fabrics.",
  "Wool": "Machine washable woollen garments only. Use appropriate detergent.",
  "Bulky/Bedding": "Machine washable curtains made of cotton and easy care fabrics. Washes large items such as blankets, bedding covers, sofa covers, pillow covers and bedspreads.",
  "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",
  "CradleWash": "Hand wash and delicate wash garments. Silk, lingerie, satin, synthetic or sheer fabrics.",
  "CradleWash®": "Hand wash and delicate wash garments. Silk, lingerie, satin, synthetic or sheer fabrics.",
  "PowerSteam": "Lightly soiled cotton, synthetic and mixed fabrics items. This cycle removes stains effectively.",
  "PowerSteam®": "Lightly soiled cotton, synthetic and mixed fabrics items. This cycle removes stains effectively.",
  "Active Wear/ Sports wear": "Sports wear such as singlets, leggings, jogging clothes and running wear.",
  "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",
  "Dark Wash": "Dark-coloured garments made of cotton and easy-care fabrics.",
  "Inner Wear": "Machine washable lingerie/inner wear.",
  "Shirts/Blouses": "Casual shirts that do not need to be ironed after washing.",
  "Shirts": "Casual shirts that do not need to be ironed after washing.",
  "Jeans": "Jeans or other coloured garments that don't bleed colours.",
  "Bamboo Wash": "Shirts, t-shirts, underwear, pajamas, towels, sleepwear, and light baby clothing etc. made of natural fiber blends. Gentle cycle with better natural fiber care. Use mild detergent. Do not use for highly soiled garments.",
  "Wash + Dry 2 Hr/Wash + Dry 4 Hr": "Use for lightly soiled laundry, fabrics like cotton, synthetics and easy care garments. Do not use for special garments such as silk, duvets, delicates, dark clothes, wool, curtains etc.",
  "Wash + Dry 2 Hr / Wash + Dry 4 Hr": "Use for lightly soiled laundry, fabrics like cotton, synthetics and easy care garments. Do not use for special garments such as silk, duvets, delicates, dark clothes, wool, curtains etc.",
  "Cupboard Dry/Eco Dry": "Use this program when you want to fold and put away the dried clothes. Can be used for everyday clothes such as cotton and mixed.",
  "Iron Dry": "Use this program to receive ready-to-iron cotton or linen fabrics, at the end of the cycle.",
  "Gentle Dry": "Use this program for easy care textiles and synthetic fabrics. It is suitable for easy care and mixed laundry clothes that require low temperatures for drying.",
  "Time Dry": "You can specify the drying time with this program. Set the time depending on the type of fabric, laundry load and moisture content.",
  "Aroma": "Use this program to remove bad odours from the laundry.",
  "Express 15 / Express 30": "Quick wash cycle for lightly soiled garments made of cotton, linen, synthetic or blended fabrics with selectable 15 or 30 minute duration.",
  "Cupboard Dry": "Drying program that dries clothes to a cupboard-ready condition suitable for direct folding and storage.",
  "Express 15": "Fast wash program designed for lightly soiled garments requiring quick cleaning in approximately 15 minutes.",
  "Express 15/Express 30": "Quick wash cycle for lightly soiled garments made of cotton, linen, synthetic or blended fabrics with selectable 15 or 30 minute duration.",
  "Power Steam": "Steam-assisted wash program that helps loosen stains, reduce wrinkles and improve fabric freshness while enhancing cleaning performance.",
  "Wash+Dry 4Hr": "Extended wash and dry cycle for mixed laundry loads requiring deeper washing and complete drying within approximately 4 hours.",
  "Wash+Dry 2Hr": "Quick wash and dry cycle suitable for lightly soiled cotton, synthetic and easy-care garments within approximately 2 hours."
};
  const DESC_MAP = { front: FL_DESC, top: TL_DESC, wdr: WDR_DESC };

  /* ── Machine types ────────────────────────────────── */
  const TYPES = [
    { id: 'front', label: 'Front Load', emoji: '🟢', ph: 'Search Front Load model… e.g. Senator Neo, Eva ZX' },
    { id: 'top',   label: 'Top Load',   emoji: '🔵', ph: 'Search Top Load model… e.g. TL-RBR, TL-R1WRS'    },
    { id: 'wdr',   label: 'WDR',        emoji: '🔴', ph: 'Search WDR model… e.g. Executive Plus ZXB'        },
  ];
  let activeType = 'front';

  /* ── DOM refs ─────────────────────────────────────── */
  const overlay   = document.getElementById('modelOverlay');
  const closeBtn  = document.getElementById('modelOverlayClose');
  const titleEl   = document.getElementById('modelOverlayTitle');
  const tabsEl    = document.getElementById('modelTabs');
  const bodyEl    = document.getElementById('modelTabBody');
  const pillWrap  = document.getElementById('mlPillWrap');
  const searchIn  = document.getElementById('mlSearchInput');
  const searchBtn = document.getElementById('mlSearchBtn');
  const suggestBx = document.getElementById('mlSuggestions');

  if (!pillWrap || !searchIn) {
    console.error('[ML] Required DOM elements missing. Check index.html.');
    return;
  }

  /* ── Pills ────────────────────────────────────────── */
  function renderPills() {
    pillWrap.innerHTML = TYPES.map(t =>
      `<button class="ml-pill${t.id === activeType ? ' active' : ''}" data-type="${t.id}">
         ${t.emoji} ${t.label}
       </button>`
    ).join('');
  }
  pillWrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-type]');
    if (!btn) return;
    activeType = btn.dataset.type;
    renderPills();
    searchIn.placeholder = TYPES.find(t => t.id === activeType).ph;
    searchIn.value = '';
    suggestHide();
    searchIn.focus();
  });
  renderPills();
  searchIn.placeholder = TYPES[0].ph;

  /* ── Tooltip ──────────────────────────────────────── */
  const tooltip = document.createElement('div');
  tooltip.id = 'mlInfoTooltip';
  tooltip.innerHTML = '<div class="ml-info-tooltip-title"></div><div class="ml-info-tooltip-body"></div>';
  document.body.appendChild(tooltip);
  let activeTipBtn = null;

  function showTooltip(btn, title, text) {
    tooltip.querySelector('.ml-info-tooltip-title').textContent = title;
    tooltip.querySelector('.ml-info-tooltip-body').textContent  = text;
    tooltip.classList.add('visible');
    const r = btn.getBoundingClientRect();
    const tw = tooltip.offsetWidth || 280, th = tooltip.offsetHeight || 80;
    let left = r.left + window.scrollX;
    let top  = r.bottom + window.scrollY + 6;
    if (left + tw > window.innerWidth - 12) left = window.innerWidth - tw - 12;
    if (left < 8) left = 8;
    if (top + th > window.innerHeight + window.scrollY - 12) top = r.top + window.scrollY - th - 6;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
    activeTipBtn = btn;
  }
  function hideTooltip() { tooltip.classList.remove('visible'); activeTipBtn = null; }
  document.addEventListener('click', e => {
    if (!e.target.closest('.ml-info-btn') && !e.target.closest('#mlInfoTooltip')) hideTooltip();
  });

  /* ── Helpers ──────────────────────────────────────── */
  function fmtCurrency(v) {
    if (!v && v !== 0) return '—';
    return '₹ ' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
  function infoBtn(name, dm) {
    if (!dm[name]) return '';
    return `<button class="ml-info-btn" data-name="${name.replace(/"/g,'&quot;')}" title="${name}">ⓘ</button>`;
  }
  function typeBadge(type) {
    const t = TYPES.find(x => x.id === type);
    const cls = { front:'ml-badge-front', top:'ml-badge-top', wdr:'ml-badge-wdr' };
    return t ? `<span class="ml-type-badge ${cls[type]||''}">${t.emoji} ${t.label}</span>` : '';
  }

  /* ── Tab renderers ────────────────────────────────── */
  function renderPrograms(d, dm) {
    if (!d.programs?.length) return '<p class="ml-empty">No program data.</p>';
    return `<div class="ml-chip-grid">${d.programs.map(p =>
      `<span class="ml-chip-wrap"><span class="ml-chip">${p}</span>${infoBtn(p,dm)}</span>`
    ).join('')}</div>`;
  }
  function renderFeatures(d, dm) {
    const kf = d.keyFeatures || {};
    const secs = [
      { title:'🔬 Advanced Wash Technology', key:'Advanced Wash Technology' },
      { title:'🛡️ Machine Care',              key:'Machine Care'            },
      { title:'🎯 User Convenience',          key:'User Convenience'        },
    ];
    const html = secs.map(s => {
      const items = kf[s.key] || [];
      if (!items.length) return '';
      return `<div class="ml-feature-section">
        <div class="ml-feature-title">${s.title}</div>
        <div class="ml-chip-grid">${items.map(i =>
          `<span class="ml-chip-wrap"><span class="ml-chip ml-chip-feat">${i}</span>${infoBtn(i,dm)}</span>`
        ).join('')}</div></div>`;
    }).join('');
    return html || '<p class="ml-empty">No feature data.</p>';
  }
  function renderNom(d) {
    const e = Object.entries(d.nomenclature || {});
    if (!e.length) return '<p class="ml-empty">No nomenclature data.</p>';
    return `<div class="ml-nom-grid">${e.map(([c,m]) =>
      `<div class="ml-nom-card"><div class="ml-nom-code">${c}</div><div class="ml-nom-arrow">→</div><div class="ml-nom-meaning">${m}</div></div>`
    ).join('')}</div>`;
  }
  function renderAMC(d) {
    const e = Object.entries(d.amcEw || {});
    if (!e.length) return '<p class="ml-empty">No AMC / EW data.</p>';
    return `<div class="ml-amc-table">
      <div class="ml-amc-header"><span>Plan</span><span>Value</span></div>
      ${e.map(([p,v]) => `<div class="ml-amc-row"><span class="ml-amc-plan">${p}</span><span class="ml-amc-val">${fmtCurrency(v)}</span></div>`).join('')}
    </div>`;
  }
  function renderTest(d) {
    const t = d.testMode || {};
    if (!Object.keys(t).length) return '<p class="ml-empty">No test mode data for this model.</p>';
    return `<div class="ml-testmode">${[
      { label:'1. Program Position', value: t.Program_Position || '—' },
      { label:'2. Press Button',     value: t.Test_Mode_Button || '—' },
      { label:'3. Display Shows',    value: t.Display_Shows    || '—' },
    ].map(s => `<div class="ml-testmode-step">
      <div class="ml-testmode-label">${s.label}</div>
      <div class="ml-testmode-value">${s.value}</div>
    </div>`).join('')}</div>`;
  }

  /* ── Info btn delegation ──────────────────────────── */
  let activeDM = {};
  bodyEl.addEventListener('click', e => {
    const b = e.target.closest('.ml-info-btn');
    if (!b) return;
    e.stopPropagation();
    if (activeTipBtn === b) { hideTooltip(); return; }
    const desc = activeDM[b.dataset.name];
    if (desc) showTooltip(b, b.dataset.name, desc);
  });

  /* ── Overlay ──────────────────────────────────────── */
  const TABS = [
    { id:'programs',     label:'📋 Programs'    },
    { id:'features',     label:'✨ Key Features' },
    { id:'nomenclature', label:'🔤 Nomenclature' },
    { id:'amc',          label:'💰 AMC / EW'     },
    { id:'testmode',     label:'🛠️ Test Mode'    },
  ];
  let curData = null, curTab = 'programs';

  function getRenderer(id, d, dm) {
    if (id==='programs')     return renderPrograms(d,dm);
    if (id==='features')     return renderFeatures(d,dm);
    if (id==='nomenclature') return renderNom(d);
    if (id==='amc')          return renderAMC(d);
    if (id==='testmode')     return renderTest(d);
    return '';
  }

  function openOverlay(obj) {
    curData  = obj;
    curTab   = 'programs';
    activeDM = DESC_MAP[obj.type] || {};
    titleEl.innerHTML = obj.model + ' ' + typeBadge(obj.type);
    tabsEl.innerHTML  = TABS.map(t =>
      `<button class="ml-tab${t.id===curTab?' active':''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');
    bodyEl.innerHTML = renderPrograms(obj, activeDM);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn || !curData) return;
    hideTooltip();
    curTab = btn.dataset.tab;
    tabsEl.querySelectorAll('.ml-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === curTab)
    );
    bodyEl.innerHTML = getRenderer(curTab, curData, activeDM);
  });

  function closeOverlay() {
    hideTooltip();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    curData = null;
  }
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { hideTooltip(); closeOverlay(); } });

  /* ── Search bar ───────────────────────────────────── */
  let sugList = [], sugTimer;

  function suggestShow() {
    if (!sugList.length) { suggestHide(); return; }
    suggestBx.innerHTML = sugList.slice(0,8).map((m,i) =>
      `<div class="ml-suggest-item" data-idx="${i}">${m.model}</div>`
    ).join('');
    suggestBx.style.display = 'block';
  }
  function suggestHide() { suggestBx.style.display = 'none'; sugList = []; }

  async function doFetch(q) {
    if (q.length < 2) { suggestHide(); return; }
    try {
      const r = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=' + activeType);
      if (!r.ok) { suggestHide(); return; }
      const d = await r.json();
      sugList = d.results || [];
      suggestShow();
    } catch { suggestHide(); }
  }

  async function doSearch() {
    const q = searchIn.value.trim();
    if (q.length < 2) return;
    suggestHide();
    try {
      const r = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=' + activeType);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      if (d.results?.length) {
        openOverlay(d.results[0]);
      } else {
        const t = TYPES.find(x => x.id === activeType);
        titleEl.textContent = 'No model found';
        tabsEl.innerHTML    = '';
        bodyEl.innerHTML    = `<p class="ml-empty">No ${t.label} results for "<strong>${q}</strong>".</p>`;
        overlay.classList.add('open');
      }
    } catch(err) { console.error('[ML]', err); }
  }

  suggestBx.addEventListener('mousedown', e => {
    e.preventDefault();
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const m = sugList[parseInt(item.dataset.idx)];
    if (m) { searchIn.value = m.model; suggestHide(); openOverlay(m); }
  });
  searchIn.addEventListener('input',   () => { clearTimeout(sugTimer); sugTimer = setTimeout(() => doFetch(searchIn.value.trim()), 280); });
  searchIn.addEventListener('keydown', e => { if (e.key==='Enter') { e.preventDefault(); doSearch(); } if (e.key==='Escape') suggestHide(); });
  searchIn.addEventListener('blur',    () => setTimeout(suggestHide, 150));
  searchBtn.addEventListener('click',  doSearch);

  console.log('[ML] model-lookup.js ready ✅');
})();
