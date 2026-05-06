/* ══════════════════════════════════════════════════════
   topload-lookup.js
   Top Load search bar (standalone)
   Requires: model-lookup.js loaded first (window.MLOverlay)
══════════════════════════════════════════════════════ */
(function () {

  /* ─── TL descriptions — exposed globally for overlay descMap ─── */
  window._TL_DESC = {
  "Smart Sense": "Intelligent sensing program that automatically detects laundry load and optimises water level, wash time and rinse cycles for efficient washing.",
  "Smart Sense + Wash": "Program combination where Smart Sense and Wash LEDs glow together.",
  "Wash + Rinse + Spin": "Combination program for washing, rinsing and spinning.",
  "Only Wash": "Performs only washing operation.",
  "Aqua Save": "Saves water from the last rinse cycle for the next wash cycle.",
  "Express 30": "Washes small lightly soiled loads quickly.",
  "Express 30’": "Washes small lightly soiled loads quickly.",
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
  "Delay Wash": "Allows the user to delay the start of the wash cycle to a preferred later time for added convenience and flexible scheduling.",
  "Power Wash": "Designed for heavily soiled clothes with enhanced washing intensity and stronger wash action for deep cleaning performance.",
  "Sports Wear": "Specially designed for sportswear and activewear fabrics to gently remove sweat, odour and dirt while protecting fabric quality.",
  "Hygiene": "Uses enhanced washing and rinsing performance to provide hygienic cleaning by reducing germs, allergens and detergent residue from garments.",
  "Favourite": "Allows users to save and quickly access their preferred wash settings for regular laundry loads.",
  "Synthetic": "Suitable for synthetic fabrics such as polyester, nylon and blended garments using controlled wash action to protect fabric texture.",
  "Bulky(Blankets/Jeans/Curtains)": "Suitable for synthetic fabrics such as polyester, nylon and blended garments using controlled wash action to protect fabric texture.",
  "Bulky (Blankets/Jeans/Curtains)": "Special wash program for bulky garments like blankets, curtains and jeans using stronger wash movements for effective cleaning.",
  "Blankets/Curtains/Bulky": "Designed for large and bulky laundry items with optimised water levels and wash movements for thorough cleaning.",
  "Aqua Conserve": "Water-saving wash program that optimises water usage while maintaining effective washing performance.",
  "Favorite": "Stores customised wash settings for quick selection of frequently used washing preferences.",
  "Powered by Ai": "The intuitive sensing logic in the machine— · Detects the Load · Optimises Water Level · Optimises Wash Program The Ai model, based on thousands of parameters, selects the optimised configuration suitable for the laundry. Thus it helps in reducing the washing time and water consumption while ensuring the best care for your clothes without any manual intervention",
  "Deep Clean": "The intuitive sensing logic in the machine— · Detects the Load · Optimises Water Level · Optimises Wash Program The Ai model, based on thousands of parameters, selects the optimised configuration suitable for the laundry. Thus it helps in reducing the washing time and water consumption while ensuring the best care for your clothes without any manual intervention",
  "Aqua Energie": "The technology that energises water to carry the detergent deep into the fabric.",
  "Aqua Spa Therapy": "An indulgent water treatment surrounds your clothes. Stubborn stains are shaken, loosened and rinsed away to give you 100% rejuvenated clothes.",
  "Pentad Pulsator": "The new pulsator engine, with a robust five vane design, removes stubborn dirt. Soft Scrub Pads gently dislodge dirt and stains, easily and quickly, for best-in-class washing",
  "Triadic Pulsator": "Soft Scrub Pads Gently scrubs off stubborn dirt. Swirl Jets Powerful water jets remove the dirt from every corner of the fabric. Centre Punch Gentle mechanical action squeezes the dirt out.",
  "Tri Axial Cloth Movements": "The new Pentad vanes actively engage with clothes in the drum, moving them on all three axes (X, Y, Z). Gently separates dirt from fabrics.",
  "Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash. Dirt is loosened from the fabric and washed away.",
  "4-Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash. Dirt is loosened from the fabric and washed away.",
  "3D Wash": "3D dynamic water jets and Tri Axial clothes rotation work together to— • Dissolve the detergent thoroughly • Loosen tough dirt • Wash the dirt away and rinse out all traces of detergent.",
  "4D Wash": "Jets of water and showers from paddles ensure complete soaking of clothes. Water mixed with detergent gets injected into your clothes with a spraying mechanism for the best wash.",
  "Crescent Moon Drum": "The crescent moon design of the drum allows the water to cushion the wash and protect the fabric.",
  "Intelligent Wash Programs": "Let your clothes enjoy the sensory pleasure of Deep Clean with IFB's intelligent wash programs.",
  "In-built Heater": "Get the best wash—the in-built heater lets you select the water temperature. Hot water cleans tough stains, activates the detergents enzymes for intense cleaning and removes allergens.",
  "In-built heater": "Get the best wash—the in-built heater lets you select the water temperature. Hot water cleans tough stains, activates the detergents enzymes for intense cleaning and removes allergens.",
  "Clean with Steam": "Choose Steam with any program and try IFB’s unique Power Steam™ with 2X steam for germ free, soft clothes!",
  "ActivMix": "The combination of falling water and rotating vanes ensures through mixing of detergent and water. A perfectly blended solution falls on the laundry giving you a better wash.",
  "Eco Inverter Motor": "The energy efficient eco inverter motor consumes upto 40% less energy, and is designed so the washer operates quietly with minimal vibration",
  "Soft Scrub Pads": "Gently scrubs off stubborn dirt.",
  "Swirl Jets": "Powerful water jets remove the dirt from every corner of the fabric.",
  "Centre Punch": "Gentle mechanical action squeezes the dirt out",
  "Auto Tub Clean": "Automatically ensures tub hygiene after wash cycles.",
  "High-Low Voltage Protection": "A microcontroller continuously monitors the voltage fluctuations and stops the program if it goes below 165± 10V or rises above 270± 10V. The program will resume once the voltage is within a safe range.",
  "Program Memory Backup": "The program remembers where to pick up from when power is restored after failure, thus saving on time, water, and energy, while adding longevity to the machine.",
  "Program Memory": "This system automatically balances the clothes inside to stabilise the spin cycle.",
  "Auto Imbalance System": "This system automatically determines the unbalanced clothes in the machines and redistributes them by taking additional water, making the machine extremely stable during the spin cycle.",
  "Child Lock": "Locks the machine settings—prevents children from accidentally changing them",
  "Auto Softener Dispenser": "(available in select models) A special compartment where you can add sofetener before you start the wash",
  "Auto Softner Dispenser": "(available in select models) A special compartment where you can add sofetener before you start the wash",
  "Bleach Dispenser": "A special inlet to add bleach to the wash.",
  "Wheels": "Allow you to easily move the machine. Just tilt the machine and move around as needed for cleaning or to change location.",
  "Lint Tower Filter": "Effectively captures fine fabric fibres floating inside the tub. This prevents them from getting onto other clothes.",
  "Tower Filter": "The lint filter effectively captures fabric fibres floating inside with IFB's intelligent wash programs. the tub and prevents them from catching onto other clothes.",
  "Air Dry": "Fresh air enters through the exchange window to enable clean, hygienic drying.",
  "Air Dry Option": "Fresh air enters through the exchange window to enable clean, hygienic drying.",
  "Spray Rinse": "A jet sprays water evenly over your clothes for optimum washing and rinsing",
  "Shower Rinse": "A jet sprays water evenly over your clothes for optimum washing and rinsing",
  "Tub Dry": "Ensures tub hygiene after wash cycles.",
  "Soft Closing": "The door slowly slides and shuts softly when released. Not banging it hard helps to prolong the life of the door.",
  "Soft Closing Lid": "The door slowly slides and shuts softly when released. Not banging it hard helps to prolong the life of the door.",
  "Drum Lamp (LED)": "LED Lamp provides light on the inner side of the drum thereby helping the user to load or unload the laundry when using the machine during night/darkness.",
  "Drum Lamp (LED Lamp)": "LED Lamp provides light on the inner side of the drum thereby helping the user to load or unload the laundry when using the machine during night/darkness.",
  "Delay Start": "Allows the user to delay the start of the wash cycle to a preferred later time for added convenience and flexible scheduling.",
  "Tub Clean Reminder": "Cleans impurities, bacteria and odours from tub.",
  "PreClean": "Performs a preliminary cleaning cycle before the main wash to loosen dirt and stains for better wash performance.",
  "Pre Clean": "Performs a preliminary cleaning cycle before the main wash to loosen dirt and stains for better wash performance.",
  "Auto Restart": "Automatically resumes the wash cycle from the point of interruption after power is restored.",
  "Buzzer": "Provides an audible alert or notification at the end of the wash cycle or during operation.",
  "Fresh Air Dry": "Fresh air comes in from the exchange window. This enables clean, hygienic drying",
  "Drum Hygiene": "Helps maintain drum cleanliness and hygiene by reducing bacteria, odours and detergent residue inside the tub.",
  "Spray Wash": "Uses directed water spray action to improve detergent penetration and washing efficiency for better cleaning performance.",
  "9 Swirl Wash": "Swirl technology that gently cares for your clothes",
  "9 Swirl wash": "Swirl technology that gently cares for your clothes"
  };

  /* ─── DOM ─── */
  const tlInput   = document.getElementById('tlSearchInput');
  const tlBtn     = document.getElementById('tlSearchBtn');
  const tlSuggest = document.getElementById('tlSuggestions');

  if (!tlInput) { console.warn('[TL] #tlSearchInput not found'); return; }

  /* ─── Overlay DOM refs (shared elements) ─── */
  const overlay = document.getElementById('modelOverlay');
  const titleEl = document.getElementById('modelOverlayTitle');
  const tabsEl  = document.getElementById('modelTabs');
  const bodyEl  = document.getElementById('modelTabBody');

  let tlList = [], tlTimer;

  function tlShow() {
    if (!tlList.length) { tlHide(); return; }
    tlSuggest.innerHTML = tlList.slice(0, 8).map((m, i) =>
      `<div class="ml-suggest-item" data-idx="${i}">${m.model}</div>`
    ).join('');
    tlSuggest.style.display = 'block';
  }
  function tlHide() { tlSuggest.style.display = 'none'; tlList = []; }

  async function tlFetch(q) {
    if (q.length < 2) { tlHide(); return; }
    try {
      const res  = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=top');
      if (!res.ok) { tlHide(); return; }
      const data = await res.json();
      tlList = data.results || [];
      tlShow();
    } catch { tlHide(); }
  }

  async function tlSearch() {
    const q = tlInput.value.trim();
    if (q.length < 2) return;
    tlHide();
    try {
      const res  = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=top');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.results?.length) {
        if (window.MLOverlay?.open) {
          window.MLOverlay.open(data.results[0]);
        } else {
          console.error('[TL] window.MLOverlay not ready — is model-lookup.js loaded first?');
        }
      } else {
        titleEl.textContent = 'No model found';
        tabsEl.innerHTML    = '';
        bodyEl.innerHTML    = `<p class="ml-empty">No Top Load results for "<strong>${q}</strong>".</p>`;
        overlay.classList.add('open');
      }
    } catch (err) {
      console.error('[TL] search error:', err);
    }
  }

  /* ── mousedown instead of click — prevents blur eating the event ── */
  tlSuggest.addEventListener('mousedown', e => {
    e.preventDefault();
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const m = tlList[parseInt(item.dataset.idx)];
    if (m && window.MLOverlay?.open) {
      tlInput.value = m.model;
      tlHide();
      window.MLOverlay.open(m);
    }
  });

  tlInput.addEventListener('input', () => {
    clearTimeout(tlTimer);
    tlTimer = setTimeout(() => tlFetch(tlInput.value.trim()), 280);
  });
  tlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); tlSearch(); }
    if (e.key === 'Escape') tlHide();
  });
  tlInput.addEventListener('blur', () => setTimeout(tlHide, 150));
  tlBtn.addEventListener('click', tlSearch);

  console.log('[TL] topload-lookup.js ready ✅');

})();