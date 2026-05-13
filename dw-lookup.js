/* dw-lookup.js — IFB Dishwasher model search & overlay
   Plugs into the same overlay infrastructure as model-lookup.js
   (modelOverlay, modelTabs, modelTabBody, modelOverlayTitle, modelOverlayClose)
*/
(function () {

  /* ── Data ── */
  const DW_MODELS = [{"model": "Neptune BI2", "type": "dw", "placeSettings": 14, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Delicate (40°C)", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Unique Spray Action", "Active Drying System", "In-built Water Softening Device (up to 700 PPM)", "Anti-Microbial Filters", "Self-Cleaning"], "Wash Options": ["Delay Start (24 hr)", "Tablet Detergent", "Half Load (Flexi)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Height Adjustable Upper Basket (2 levels)", "Removable Upper Basket", "Large Knife Holder", "Salt & Rinse Aid Indicators"]}, "waterConsumption": 12, "amcEw": {"AMC 1 Year": 4500, "AMC 2 Year": 8250, "Extended Warranty 1 Year": 1991, "Extended Warranty 2 Year": 3474}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune VX2 Plus", "type": "dw", "placeSettings": 16, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care 60°C", "Super 50'", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Turbo Drying Unit", "Auto Door Opening (Energy Save)", "In-built Water Softening Device (6-level, up to 700 PPM)", "Natural Ion Tech", "Height Adjustable Upper Basket (3 positions)", "Upper Cutlery Basket", "Multi-functional Rack System", "Favourite Program Save", "Save Power Mode", "Auto Restart"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load (Upper / Lower / Both)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Auto Door Opening", "Child Lock"], "User Convenience": ["Remaining Time Indicator", "Washing Step Indicators (Wash→Rinse→Dry→End)", "Salt & Rinse Aid Indicators", "Auto Door Opening", "Favourite Program Save", "Buzzer Sound Control (S0–S3)", "Save Power Mode (auto-off after 15 min)", "Natural Ion Tech", "Child Lock"]}, "waterConsumption": 9, "amcEw": {"AMC 1 Year": 3750, "AMC 2 Year": 6950, "Extended Warranty 1 Year": 2200, "Extended Warranty 2 Year": 3800}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune SX2", "type": "dw", "placeSettings": 16, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Turbo Drying Unit", "Auto Door Opening (Energy Save)", "In-built Water Softening Device (6-level, up to 900 PPM)", "Natural Ion Tech", "Height Adjustable Upper Basket (3 positions)", "Upper Cutlery Basket", "Multi-functional Rack System", "Favourite Program Save", "Save Power Mode", "Auto Restart"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load (Upper / Lower / Both)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Auto Door Opening", "Child Lock"], "User Convenience": ["Remaining Time Display", "Auto Door Opening (default ON)", "Auto-Resume After Power Cut", "Detergent & Salt Refill Indicator", "Delay Start (1–24 hrs)", "Child Lock", "Natural Drying"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 5700, "AMC 2 Year": 9650, "Extended Warranty 1 Year": 2700, "Extended Warranty 2 Year": 4500}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune VX1", "type": "dw", "placeSettings": 12, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Delicate (40°C)", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Active Drying Unit", "In-built Water Softening Device (6-level, up to 700 PPM)", "Anti-Microbial Filters", "Height Adjustable Upper Basket (2 levels)", "Four Folding Racks"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option", "Child Lock"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Height Adjustable Upper Basket (2 levels)", "Large Knife Holder", "Salt & Rinse Aid Indicators", "Child Lock"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 4700, "AMC 2 Year": 7950, "Extended Warranty 1 Year": 2200, "Extended Warranty 2 Year": 3800}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune FX1", "type": "dw", "placeSettings": 12, "programs": ["JETwash 14'", "Intensive (65°C)", "Auto (50°C–65°C)", "Hygiene (70°C)", "Daily (94 min)", "Quick 30' (Crockery)", "Eco 50°C"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Active Drying System", "Hygiene Program (70°C)", "In-built Water Softening Device (up to 700 PPM)", "Anti-Microbial Filters", "Self-Cleaning"], "Wash Options": ["Delay Start (24 hr)", "Tablet Detergent", "Half Load (Flexi)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Height Adjustable Upper Basket (Rail Stop Clip)", "Large Knife Holder", "Salt & Rinse Aid Indicators"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 4000, "AMC 2 Year": 6800, "Extended Warranty 1 Year": 1991, "Extended Warranty 2 Year": 3474}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune VX1 Plus", "type": "dw", "placeSettings": 15, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Turbo Drying Unit", "Auto Door Opening (Energy Save)", "In-built Water Softening Device (6-level, up to 700 PPM)", "Natural Ion Tech", "Height Adjustable Upper Basket (3 levels)", "Upper Cutlery Basket", "Favourite Program Save", "Save Power Mode", "Auto Restart"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load (Upper / Lower / Both)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Auto Door Opening", "Child Lock"], "User Convenience": ["Remaining Time Indicator", "Washing Step Indicators (Wash→Rinse→Dry→End)", "Salt & Rinse Aid Indicators", "Auto Door Opening", "Favourite Program Save", "Save Power Mode (auto-off after 15 min)", "Child Lock"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 3750, "AMC 2 Year": 6950, "Extended Warranty 1 Year": 2200, "Extended Warranty 2 Year": 3800}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune VX Plus", "type": "dw", "placeSettings": 15, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Delicate (40°C)", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Unique Triple Spray Action", "Active Drying System", "In-built Water Softening Device (up to 800 PPM)", "Anti-Microbial Filters", "Self-Cleaning"], "Wash Options": ["Delay Start (24 hr)", "Tablet Detergent", "Half Load (Flexi)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Height Adjustable Upper Basket (3 levels)", "Removable Upper Basket", "Large Knife Holder", "Salt & Rinse Aid Indicators"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 4400, "AMC 2 Year": 8100, "Extended Warranty 1 Year": 1991, "Extended Warranty 2 Year": 3474}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune WX", "type": "dw", "placeSettings": 12, "programs": ["Express (55 min)", "Mix Load (60°C)", "Crystal/Glass", "Heavily Soiled (60°C)", "Extra Heavily Soiled (70°C)", "Pots/Pans (70°C)", "Normal (Pre-Wash + 50°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Active Drying System", "In-built Water Softening Device (6-level, up to 800 PPM)", "Modular & Adjustable Baskets", "Double Spray Action"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Child Lock"], "User Convenience": ["Remaining Time Indicator", "Washing Step Indicators (Wash→Rinse→Dry→End)", "Salt & Rinse Aid Indicators", "Child Lock"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 3900, "AMC 2 Year": 7200, "Extended Warranty 1 Year": 2200, "Extended Warranty 2 Year": 3800}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune SX1", "type": "dw", "placeSettings": 15, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Active Drying System", "In-built Water Softening Device (6-level, up to 700 PPM)", "Natural Ion Tech", "Height Adjustable Upper Basket (3 levels)", "Upper Cutlery Basket", "Favourite Program Save", "Save Power Mode"], "Wash Options": ["Delay Start (1–24 hrs)", "Tablet Detergent", "Half Load (Upper / Lower / Both)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Child Lock"], "User Convenience": ["Remaining Time Indicator", "Washing Step Indicators (Wash→Rinse→Dry→End)", "Salt & Rinse Aid Indicators", "Favourite Program Save", "Save Power Mode (auto-off after 15 min)", "Child Lock"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 4450, "AMC 2 Year": 8200, "Extended Warranty 1 Year": 2200, "Extended Warranty 2 Year": 3800}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune FX", "type": "dw", "placeSettings": 12, "programs": ["JETwash 14'", "Intensive (65°C)", "Auto (50°C–65°C)", "Hygiene (70°C)", "Daily (94 min)", "Quick 30' (Crockery)", "Eco 50°C"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Active Drying System", "Hygiene Program (70°C)", "In-built Water Softening Device (up to 700 PPM)", "Anti-Microbial Filters", "Self-Cleaning"], "Wash Options": ["Delay Start (24 hr)", "Tablet Detergent", "Half Load (Flexi)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Large Knife Holder", "Salt & Rinse Aid Indicators"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 3900, "AMC 2 Year": 6800, "Extended Warranty 1 Year": 1991, "Extended Warranty 2 Year": 3474}, "nomenclature": {}, "testMode": {}}, {"model": "Neptune VX", "type": "dw", "placeSettings": 12, "programs": ["Pre-Wash", "Quick 30'", "Eco mode", "Easy Care (60°C)", "Super 50'", "Delicate (40°C)", "Auto Delicate (30–50°C)", "Auto Normal (50–60°C)", "Auto Intensive (60–70°C)"], "keyFeatures": {"Advanced Wash Technology": ["Hot Water Wash (up to 70°C)", "Intelligent Sensor", "Unique Spray Action", "Active Drying System", "In-built Water Softening Device (up to 700 PPM)", "Anti-Microbial Filters", "Self-Cleaning"], "Wash Options": ["Delay Start (24 hr)", "Tablet Detergent", "Half Load (Flexi)", "Extra Hygiene", "Extra Rinse", "Extra Drying", "Energy Save Option"], "User Convenience": ["Touch Controls", "Bottom LED Wash Cycle Indicator", "Digital Display (Program Time)", "Height Adjustable Upper Basket (2 levels)", "Removable Upper Basket", "Large Knife Holder", "Salt & Rinse Aid Indicators"]}, "waterConsumption": null, "amcEw": {"AMC 1 Year": 4600, "AMC 2 Year": 8500, "Extended Warranty 1 Year": 1991, "Extended Warranty 2 Year": 3474}, "nomenclature": {}, "testMode": {}}];
  const DW_DESC   = {"Pre-Wash": "A cold-water pre-rinse cycle designed to loosen and soften dried or stubborn food residue before the main wash. No detergent needed. Ideal for dishes that will be washed later in the day.", "Quick 30'": "30-minute fast wash program for lightly soiled, recently used dishes. Completes Main Wash → Rinse → Hot Rinse steps without drying. Use powder detergent only — combined tablets are not recommended for short programs.", "Eco mode": "Energy-efficient program that uses lower temperatures and optimised water consumption. Best for normally soiled mixed loads. Takes longer but saves power and water significantly.", "Easy Care (60°C)": "A gentle 60°C program designed for everyday mixed loads — crockery, glasses, and lightly soiled pots. Balances cleaning performance with fabric and item care.", "Easy Care 60°C": "A gentle 60°C program designed for everyday mixed loads — crockery, glasses, and lightly soiled pots. Balances cleaning performance with fabric and item care.", "Super 50'": "A 50-minute intensive wash program for heavily soiled dishes. Uses higher water pressure and temperature for deep cleaning in a shorter time.", "Delicate (40°C)": "Low-temperature 40°C program for fragile items such as fine china, crystal glasses, and delicate tableware. Gentle drum action reduces the risk of chipping or cracking.", "Auto Delicate (30–50°C)": "Sensor-driven program that automatically adjusts wash temperature between 30–50°C based on load soil level. Ideal for mixed delicate loads.", "Auto Normal (50–60°C)": "Automatic program for standard daily loads. Sensors detect soil level and adjust temperature between 50–60°C for optimal cleaning with minimal energy waste.", "Auto Intensive (60–70°C)": "Automatic high-temperature program for heavily soiled pots, pans, and bakeware. Adjusts between 60–70°C based on soil detection.", "JETwash 14'": "Ultra-fast 14-minute rinse-only program using high-pressure jet spray. Ideal for freshly used dishes to prevent food from drying. Not a full wash — no detergent required.", "Intensive (65°C)": "High-temperature 65°C program for stubborn grease and dried-on food on pots and baking trays. Longer cycle with multiple rinses for thorough cleaning.", "Auto (50°C–65°C)": "Smart auto program that uses sensors to determine the right wash temperature (50–65°C) based on how soiled the load is. Suitable for everyday mixed loads.", "Hygiene (70°C)": "Maximum temperature 70°C program for sanitising baby bottles, cutting boards, and heavily contaminated items. Meets hygiene standards for germ reduction.", "Daily (94 min)": "A 94-minute complete wash cycle for standard daily soiled loads. Balances thorough cleaning with reasonable time and energy use.", "Quick 30' (Crockery)": "Fast 30-minute program optimised specifically for crockery and plates. Similar to standard Quick 30 but tuned for flat dishware.", "Eco 50°C": "Energy-saving program at a fixed 50°C. Uses less water and electricity than standard programs. Best for lightly to normally soiled everyday loads.", "Express (55 min)": "55-minute complete wash and dry cycle for small, lightly soiled loads when you need dishes ready quickly.", "Mix Load (60°C)": "60°C program for mixed loads containing both delicate and heavily soiled items. Adjusts spray intensity per rack zone.", "Crystal/Glass": "Dedicated low-temperature program for crystal and glassware. Uses gentle spray action and cool rinse to prevent cloudiness and thermal shock.", "Heavily Soiled (60°C)": "60°C program for very dirty dishes with dried-on food. Extended wash time with high spray pressure for effective removal.", "Extra Heavily Soiled (70°C)": "70°C high-intensity program for the most stubborn grease and baked-on residue. Uses maximum spray power and extended rinse cycles.", "Pots/Pans (70°C)": "Dedicated 70°C program for cooking pots, pans, and bakeware with heavy grease. High-pressure bottom spray ensures thorough cleaning of larger items.", "Normal (Pre-Wash + 50°C)": "Two-phase program: starts with a cold pre-wash to loosen food, followed by a 50°C main wash. Good for normally soiled everyday loads.", "Hot Water Wash (up to 70°C)": "The machine heats water internally up to 70°C regardless of the inlet water temperature. Ensures consistent cleaning and hygiene across all programs.", "Intelligent Sensor": "Optical or turbidity sensor that measures how dirty the wash water is and automatically adjusts cycle time, temperature, and water usage for efficient cleaning.", "Unique Spray Action": "Specially designed spray arm geometry that ensures water reaches all parts of the load — including tall glasses, deep bowls, and cutlery — for consistent cleaning.", "Active Drying System": "Heated drying system that uses a heating element to actively dry dishes at the end of the wash cycle. Leaves dishes dry and ready to store.", "In-built Water Softening Device (up to 700 PPM)": "Built-in ion-exchange water softener that removes calcium and magnesium from hard water (up to 700 PPM). Prevents limescale build-up on dishes and the machine interior.", "Anti-Microbial Filters": "Filters treated with anti-microbial agents to prevent bacteria and mould growth. Reduces odour and keeps the filter system hygienic between cleans.", "Self-Cleaning": "The machine runs a self-clean rinse of the wash system and spray arms at the end of certain cycles to flush out food particles and detergent residue.", "Turbo Drying Unit": "Enhanced drying system that uses a dedicated fan and heating element to circulate hot air for faster and more complete drying compared to standard condensation drying.", "Auto Door Opening (Energy Save)": "At the end of the drying phase, the door automatically opens slightly to release steam and allow fresh air in — improving drying efficiency without extra energy use.", "In-built Water Softening Device (6-level, up to 700 PPM)": "Six-level adjustable water softener for hard water up to 700 PPM. User can set softening intensity (levels 1–6) to match local water hardness.", "Natural Ion Tech": "Uses natural mineral ions released inside the drum to help break down grease and improve rinse performance — reducing the need for rinse aid in some conditions.", "Height Adjustable Upper Basket (3 positions)": "The upper basket can be moved to 3 height positions to accommodate tall items in either the upper or lower rack as needed.", "Upper Cutlery Basket": "A third basket positioned in the upper zone, dedicated to cutlery and small utensils. Keeps cutlery separate from dishes for better spray coverage.", "Multi-functional Rack System": "Adjustable and foldable tines in the baskets allow different configurations to fit large pots, tall glasses, and awkwardly shaped items in the same load.", "Favourite Program Save": "Allows the user to save one preferred wash program setting so it can be recalled quickly without navigating through the full program menu each time.", "Save Power Mode": "When the machine is idle, it automatically reduces display brightness and enters a low-power standby state to minimise electricity consumption.", "Auto Restart": "If power is interrupted mid-cycle, the machine automatically resumes from where it stopped once power is restored — no need to restart manually.", "In-built Water Softening Device (6-level, up to 900 PPM)": "Six-level adjustable water softener handling very hard water up to 900 PPM. Suitable for regions with extremely hard water supply.", "Active Drying Unit": "Compact active drying component that uses residual heat and a controlled airflow to dry dishes effectively at the end of the wash cycle.", "Height Adjustable Upper Basket (2 levels)": "The upper basket adjusts between 2 height positions — raised for tall glasses in the upper rack or lowered for larger items in the lower rack.", "Four Folding Racks": "Four foldable tine rows in the lower basket that can be folded flat to accommodate large pots, woks, or baking trays.", "Hygiene Program (70°C)": "A dedicated sanitising program at 70°C that reduces bacteria and germs on dishes, baby items, and food prep utensils.", "Height Adjustable Upper Basket (Rail Stop Clip)": "Upper basket height is adjustable using a rail-stop clip mechanism — simple to operate and locks securely in position.", "Height Adjustable Upper Basket (3 levels)": "Three-level height adjustment for the upper basket providing maximum flexibility to fit different load combinations.", "Unique Triple Spray Action": "Three independent spray arms — upper, lower, and middle — each covering a different zone to ensure complete water coverage across the entire load.", "In-built Water Softening Device (up to 800 PPM)": "Built-in water softener handling hard water up to 800 PPM. Protects against limescale on heating elements and internal surfaces.", "Modular & Adjustable Baskets": "Both upper and lower baskets have modular tine configurations that can be rearranged to create custom loading layouts for different dish types and sizes.", "In-built Water Softening Device (6-level, up to 800 PPM)": "Six-level adjustable softener for water hardness up to 800 PPM with user-configurable intensity settings.", "Natural Drying System": "Condensation-based drying using residual heat from the final hot rinse. No separate heating element — energy efficient but takes slightly longer.", "Double Spray Action": "Two spray arms (upper and lower) operating simultaneously to ensure water coverage across both basket levels.", "Delay Start (24 hr)": "Set the machine to start up to 24 hours in advance. Useful for running the dishwasher overnight or during off-peak electricity hours.", "Tablet Detergent": "Program or setting optimised for use with all-in-one detergent tablets. Adjusts the pre-wash phase so the tablet dissolves at the right time.", "Half Load (Flexi)": "Run the machine with only one basket loaded (upper or lower) using reduced water and energy — flexible for smaller loads.", "Extra Hygiene": "Boosts the main wash temperature for enhanced germ reduction. Recommended for baby items, cutting boards, or items used during illness.", "Extra Rinse": "Adds an additional cold rinse cycle at the end of the wash — useful for people with detergent sensitivity or allergies.", "Extra Drying": "Extends the drying phase for items that retain moisture such as plastics and deep bowls.", "Energy Save Option": "Reduces wash temperature slightly to lower energy consumption. Best used for lightly soiled loads when hygiene is less critical.", "Delay Start (1–24 hrs)": "Flexible delay start from 1 to 24 hours. Set precise start times to align with your schedule or off-peak electricity tariffs.", "Half Load (Upper / Lower / Both)": "Three half-load options — upper basket only, lower basket only, or both — allowing flexible loading with proportionally reduced water and energy use.", "Auto Door Opening": "Door automatically opens a few centimetres at the end of drying to release steam and improve drying results through passive ventilation.", "Child Lock": "Locks all control panel buttons to prevent children from accidentally changing settings or starting a cycle while the machine is running.", "Half Load": "Wash a partial load using reduced water and energy. Ideal when you don't have a full load of dishes.", "Touch Controls": "Capacitive touch-sensitive control panel — no physical buttons. Easy to clean and provides a sleek, modern interface.", "Bottom LED Wash Cycle Indicator": "An LED light projected on the floor in front of the machine shows that a wash cycle is running — useful on fully integrated models where the display is hidden.", "Digital Display (Program Time)": "Digital screen showing the remaining program time so you always know how long is left in the current cycle.", "Removable Upper Basket": "The upper basket can be fully removed from the machine to make loading large items in the lower basket easier.", "Large Knife Holder": "Dedicated holder in the cutlery basket or door for safely storing large knives blade-down during the wash.", "Salt & Rinse Aid Indicators": "Dashboard indicators that alert you when the water softener salt or rinse aid reservoir needs refilling.", "Remaining Time Indicator": "Displays the time remaining in the current wash cycle on the control panel.", "Washing Step Indicators (Wash→Rinse→Dry→End)": "LED or display indicators showing which phase of the cycle is currently active — wash, rinse, drying, or end — at a glance.", "Buzzer Sound Control (S0–S3)": "Adjustable end-of-cycle buzzer volume with 4 levels (S0 = off, S1–S3 = increasing volume). Set to suit your environment.", "Save Power Mode (auto-off after 15 min)": "Display and controls automatically switch off after 15 minutes of inactivity to conserve power.", "Remaining Time Display": "Shows the exact remaining time of the running program on a digital or LED display.", "Auto Door Opening (default ON)": "Auto door opening is enabled by default — the door opens automatically at the end of drying without any user action needed.", "Auto-Resume After Power Cut": "If power is cut during a cycle, the machine stores the cycle state and automatically resumes from the same point when power returns.", "Detergent & Salt Refill Indicator": "Combined indicator that alerts you when both the detergent dispenser and the salt reservoir need to be refilled.", "Natural Drying": "Residual-heat condensation drying — uses the heat absorbed by dishes during the hot rinse to evaporate remaining moisture. Energy efficient."};

  /* ── Helpers ── */
  function fmtCurrency(v) {
    if (v == null || v === '') return '—';
    var n = parseFloat(v);
    if (isNaN(n)) return v;
    return '\u20B9' + n.toLocaleString('en-IN');
  }

  function descChip(name, color) {
    var desc = DW_DESC[name] || '';
    var tip  = desc ? ' title="' + desc.replace(/"/g,'&quot;') + '"' : '';
    return '<span class="ml-chip dw-chip' + (desc ? ' ml-chip-has-tip' : '') + '"' + tip + '>' + name + '</span>';
  }

  /* ── Tab renderers ── */
  function renderDWPrograms(d) {
    if (!d.programs || !d.programs.length) return '<p class="ml-empty">No program data.</p>';
    return '<div class="ml-chip-grid">' +
      d.programs.map(function(p){ return descChip(p, '#006f8f'); }).join('') +
      '</div>';
  }

  function renderDWFeatures(d) {
    var kf = d.keyFeatures || {};
    var sections = Object.keys(kf);
    if (!sections.length) return '<p class="ml-empty">No feature data.</p>';
    return sections.map(function(sec) {
      var items = kf[sec];
      if (!items || !items.length) return '';
      return '<div class="ml-section">' +
        '<div class="ml-section-title">' + sec + '</div>' +
        '<div class="ml-chip-grid">' +
          items.map(function(f){ return descChip(f); }).join('') +
        '</div></div>';
    }).join('');
  }

  function renderDWSpecs(d) {
    var rows = [];
    if (d.placeSettings)    rows.push(['Place Settings',   d.placeSettings + ' place settings']);
    if (d.waterConsumption) rows.push(['Water Consumption', d.waterConsumption + ' L per cycle']);
    if (!rows.length) return '<p class="ml-empty">No spec data.</p>';
    return '<div class="ml-amc-table">' +
      '<div class="ml-amc-header"><span>Specification</span><span>Value</span></div>' +
      rows.map(function(r){
        return '<div class="ml-amc-row">' +
          '<span class="ml-amc-plan">' + r[0] + '</span>' +
          '<span class="ml-amc-val">'  + r[1] + '</span>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  function renderDWAMC(d) {
    var e = Object.entries(d.amcEw || {});
    if (!e.length) return '<p class="ml-empty">No AMC / EW data.</p>';
    return '<div class="ml-amc-table">' +
      '<div class="ml-amc-header"><span>Plan</span><span>Value</span></div>' +
      e.map(function(pair){
        return '<div class="ml-amc-row">' +
          '<span class="ml-amc-plan">' + pair[0] + '</span>' +
          '<span class="ml-amc-val">'  + fmtCurrency(pair[1]) + '</span>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  /* ── Overlay ── */
  var DW_TABS = [
    { id: 'programs', label: 'Programs'       },
    { id: 'features', label: 'Key Features'   },
    { id: 'specs',    label: 'Specs'          },
    { id: 'amc',      label: 'AMC / EW'       },
  ];

  var curDW  = null;
  var curTab = 'programs';

  function renderDWTab(id, d) {
    if (id === 'programs') return renderDWPrograms(d);
    if (id === 'features') return renderDWFeatures(d);
    if (id === 'specs')    return renderDWSpecs(d);
    if (id === 'amc')      return renderDWAMC(d);
    return '';
  }

  function openDWOverlay(model) {
    var d = DW_MODELS.find(function(m){ return m.model === model; });
    if (!d) return;
    curDW  = d;
    curTab = 'programs';

    var overlay   = document.getElementById('modelOverlay');
    var titleEl   = document.getElementById('modelOverlayTitle');
    var tabsEl    = document.getElementById('modelTabs');
    var bodyEl    = document.getElementById('modelTabBody');
    var closeBtn  = document.getElementById('modelOverlayClose');
    if (!overlay) return;

    titleEl.textContent = d.model + (d.placeSettings ? '  |  ' + d.placeSettings + ' Place Settings' : '');

    /* build tabs */
    tabsEl.innerHTML = DW_TABS.map(function(t){
      return '<button class="ml-tab' + (t.id === curTab ? ' active' : '') + '" data-tab="' + t.id + '">' + t.label + '</button>';
    }).join('');

    tabsEl.querySelectorAll('.ml-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        curTab = btn.dataset.tab;
        tabsEl.querySelectorAll('.ml-tab').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        bodyEl.innerHTML = renderDWTab(curTab, curDW);
      });
    });

    bodyEl.innerHTML = renderDWTab(curTab, d);
    overlay.classList.add('open');

    closeBtn.onclick = function(){ overlay.classList.remove('open'); };
    overlay.onclick  = function(e){ if (e.target === overlay) overlay.classList.remove('open'); };
  }

  /* ── Search & Pill integration ── */
  var DW_PILL_ID = 'dw';

  function initDWPill() {
    var pillWrap = document.getElementById('mlPillWrap');
    if (!pillWrap) return;
    /* don't add duplicate */
    if (document.getElementById('dw-pill')) return;
    var pill = document.createElement('button');
    pill.id        = 'dw-pill';
    pill.className = 'ml-pill';
    pill.setAttribute('data-type', DW_PILL_ID);
    pill.innerHTML = '\uD83C\uDF7D\uFE0F Dishwasher';
    pill.addEventListener('click', function(){
      var allPills = document.querySelectorAll('.ml-pill');
      var wasActive = pill.classList.contains('active');
      /* deactivate all pills first */
      allPills.forEach(function(p){ p.classList.remove('active'); });
      var input   = document.getElementById('mlSearchInput');
      var suggest = document.getElementById('mlSuggestions');
      if (wasActive) {
        /* toggling off — clear input + suggestions */
        if (input)   input.value = '';
        if (suggest) suggest.style.display = 'none';
      } else {
        /* activating DW pill — clear input, wait for user to type */
        pill.classList.add('active');
        if (input)   { input.value = ''; input.focus(); }
        if (suggest) suggest.style.display = 'none';
      }
    });
    pillWrap.appendChild(pill);
  }

  function filterDWSuggestions(query, dwOnly) {
    var input   = document.getElementById('mlSearchInput');
    var suggest = document.getElementById('mlSuggestions');
    if (!suggest) return;
    var q = (query || '').toLowerCase();
    var results = DW_MODELS.filter(function(m){
      return !q || m.model.toLowerCase().includes(q);
    });
    if (!results.length) { suggest.style.display = 'none'; return; }
    suggest.innerHTML = results.map(function(m){
      return '<div class="ml-suggestion dw-suggestion" data-model="' + m.model + '">' +
        '\uD83C\uDF7D\uFE0F ' + m.model +
        (m.placeSettings ? ' <span class="ml-sug-sub">' + m.placeSettings + ' place settings</span>' : '') +
        '</div>';
    }).join('');
    suggest.style.display = 'block';
    suggest.querySelectorAll('.dw-suggestion').forEach(function(el){
      el.addEventListener('click', function(){
        input.value = el.dataset.model;
        suggest.style.display = 'none';
        openDWOverlay(el.dataset.model);
      });
    });
  }

  /* ── Hook into existing search input ── */
  function hookSearch() {
    var input = document.getElementById('mlSearchInput');
    var btn   = document.getElementById('mlSearchBtn');
    if (!input) return;

    input.addEventListener('input', function(){
      var dwPill = document.getElementById('dw-pill');
      if (dwPill && dwPill.classList.contains('active')) {
        var q = input.value.trim();
        if (q.length === 0) {
          var suggest = document.getElementById('mlSuggestions');
          if (suggest) suggest.style.display = 'none';
        } else {
          filterDWSuggestions(q, true);
        }
      }
    });

    /* Search button: if DW pill active and value matches a DW model, open overlay */
    if (btn) {
      btn.addEventListener('click', function(){
        var dwPill = document.getElementById('dw-pill');
        if (!dwPill || !dwPill.classList.contains('active')) return;
        var val = input.value.trim();
        var match = DW_MODELS.find(function(m){
          return m.model.toLowerCase() === val.toLowerCase();
        });
        if (match) openDWOverlay(match.model);
      });
    }
  }

  /* ── Boot ── */
  function boot() {
    initDWPill();
    hookSearch();
    console.log('[DW] ready — ' + DW_MODELS.length + ' dishwasher models');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
