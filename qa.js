/* qa.js — IFB Q&A Quiz Widget */
(function () {

 const QA_DATA = [{"id": 1, "category": "Dryer", "focus": "Program", "question": "In IFB Turbo Dry 5.5 kg dryers, what type of laundry is the 'Mixed Load' program designed for?", "options": ["Only silk sarees", "A mixture of different fabric types in one load", "Only woollen blankets", "Only baby clothes"], "answer": 1}, {"id": 2, "category": "Dryer", "focus": "Program", "question": "For Turbo Dry dryers, which items are best suited to the 'Cotton' program?", "options": ["Towels and flannel blankets", "Only synthetic sportswear", "Only innerwear and lingerie", "Only curtains"], "answer": 0}, {"id": 3, "category": "Dryer", "focus": "Program", "question": "The 'Synthetics' program on IFB Turbo Dry dryers is recommended for which type of fabrics?", "options": ["Heavy denim jeans", "Delicate fabrics prone to shrinkage such as lingerie and synthetics", "Woollen sweaters only", "Thick cotton rugs"], "answer": 1}, {"id": 4, "category": "Dryer", "focus": "Program options", "question": "On the Mixed Load program, which of these is a correct example of a drying level/time combination?", "options": ["Cupboard Dry 30 min only", "Iron Dry 90 min, Cupboard Dry 120 min", "Iron Dry 200 min, Cupboard Dry 240 min", "Only a 10-minute cool cycle"], "answer": 1}, {"id": 5, "category": "Dryer", "focus": "Program options", "question": "For the 'Synthetics' load, which time settings are typically available on Turbo Dry?", "options": ["Iron Dry 50 minutes, Cupboard Dry 70 minutes", "Iron Dry 10 minutes, Cupboard Dry 20 minutes", "Only Cupboard Dry 160 minutes", "Only Refresh 20 minutes"], "answer": 0}, {"id": 6, "category": "Dryer", "focus": "Safety feature", "question": "What is the function of the 'Safety Door Switch' in IFB Turbo Dry dryers?", "options": ["It keeps the door locked during the full cycle, even during emergencies", "It automatically stops the dryer when the door is opened", "It increases drum speed when the door is opened", "It switches on the interior drum light only"], "answer": 1}, {"id": 7, "category": "Dryer", "focus": "Safety feature", "question": "The 'Safety Reset' in Turbo Dry dryers is best described as:", "options": ["A button to select extra-dry level", "A temperature-activated cut-off that protects the dryer from overheating", "A child-lock that disables the control panel", "A function that adds extra water to cool the drum"], "answer": 1}, {"id": 8, "category": "Dryer", "focus": "Convenience feature", "question": "What does the 'Auto Cooldown' feature do at the end of a drying cycle?", "options": ["Adds more heat to remove wrinkles", "Stops airflow immediately when the timer ends", "Continues airflow to cool clothes and internal parts for safer handling", "Drains water from the washer section"], "answer": 2}, {"id": 9, "category": "Dryer", "focus": "Installation feature", "question": "Why is a 'Venting Kit' provided with IFB Turbo Dry dryers?", "options": ["To store extra lint from previous cycles", "To exhaust hot, moist air outside for efficient drying", "To convert the dryer into a washer-dryer", "To reduce power consumption by half"], "answer": 1}, {"id": 10, "category": "Dryer", "focus": "Installation feature", "question": "What is the purpose of the 'Wall Mounting Kit' supplied with Turbo Dry models?", "options": ["To increase drum capacity", "To safely mount the dryer on a wall and save floor space", "To fix the dryer permanently to the washer top", "To connect the dryer directly to the water inlet"], "answer": 1}, {"id": 11, "category": "WDR", "focus": "Nomenclature", "question": "In the model name 'IFB Executive Plus ZBG 11/7/3 kg', what do the numbers 11/7/3 indicate?", "options": ["11 programs, 7 spin speeds, 3 wash temperatures", "11 kg wash, 7 kg dry, 3 kg refresher capacity", "11-year motor warranty, 7-year product warranty, 3-year AMC", "11 kg dryer, 7 kg washer, 3 kg drum diameter"], "answer": 1}, {"id": 12, "category": "WDR", "focus": "Nomenclature", "question": "In 'IFB Executive Plus ZBG 11/7/3 kg', what does 'ZB' represent?", "options": ["Colour code for White", "Dryer series only", "PCM Black", "Program name"], "answer": 2}, {"id": 13, "category": "WDR", "focus": "Nomenclature", "question": "In 'IFB Executive Plus ZBG 11/7/3 kg', what does the letter 'G' at the end of 'ZBG' stand for?", "options": ["G Series Gold", "Glass door option", "Gas-heated dryer", "Global model variant"], "answer": 0}, {"id": 14, "category": "WDR", "focus": "Nomenclature", "question": "In the model naming table, 'Executive Plus' refers to which of the following?", "options": ["A wash program", "A machine care feature", "The model series or family name", "The AMC plan type"], "answer": 2}, {"id": 15, "category": "WDR", "focus": "Nomenclature", "question": "For washer-dryers like 'IFB Executive ZBN CMS 9/6/3 kg', what does 'CMS' indicate?", "options": ["Common Motor Software", "Colour code for Mocha Silver", "Cupboard-dry plus mixed-soil program", "Child-lock safety mode"], "answer": 0}, {"id": 16, "category": "WDR", "focus": "Nomenclature", "question": "In 'IFB Executive ZBN CMS 9/6/3 kg', what do the numbers 9 6 3 refer to?", "options": ["9 kg wash, 6 kg dry, 3 kg refresher capacity", "9 wash programs, 6 dry programs, 3 steam levels", "9-year total warranty, 6-year motor, 3-year panel", "9 kg drum, 6 kg heater, 3 kg door weight"], "answer": 0}, {"id": 17, "category": "TL", "focus": "Nomenclature", "question": "In top-load models like 'IFB TL \u2013 R1BRS 7 kg Aqua', what does 'TL' stand for?", "options": ["Turbo Load", "Top Load", "Twin Load", "Time-logic Load"], "answer": 1}, {"id": 18, "category": "TL", "focus": "Nomenclature", "question": "In 'IFB TL \u2013 R1BRS 7 kg Aqua', what does the letter 'R' in the code specify?", "options": ["Round door design", "Rear-mounted control panel", "Reduced spin speed", "Rapid-wash only model"], "answer": 0}, {"id": 19, "category": "TL", "focus": "Nomenclature", "question": "In 'IFB TL \u2013 R1BRS 7 kg Aqua', what does '7 kg Aqua' together describe?", "options": ["7 wash programs with Aqua Energie off", "Washing capacity of 7 kg with Aqua Energie feature", "7-litre water tank size with Aqua filter", "7-year warranty on Aqua parts"], "answer": 1}, {"id": 20, "category": "FL", "focus": "User Convenience", "question": "Which user convenience feature prevents children from accidentally changing the wash settings during a cycle?", "options": ["Child Lock", "Auto Softener Dispenser", "Wheels", "Air Dry Option"], "answer": 0}, {"id": 21, "category": "FL", "focus": "User Convenience", "question": "Which feature automatically releases fabric conditioner at the right time in the wash cycle?", "options": ["Auto Softener Dispenser", "Bleach Dispenser", "Lint Tower Filter", "Tub Dry"], "answer": 0}, {"id": 22, "category": "FL", "focus": "User Convenience", "question": "Which feature provides a dedicated compartment for adding bleach safely during a wash?", "options": ["Bleach Dispenser", "Shower Rinse", "Auto Tub Clean", "Child Lock"], "answer": 0}, {"id": 23, "category": "FL", "focus": "User Convenience", "question": "Which user convenience feature makes it easier to move the washing machine for cleaning or repositioning?", "options": ["Wheels", "Drum Lamp", "Soft Closing Lid", "Spray Rinse"], "answer": 0}, {"id": 24, "category": "FL", "focus": "User Convenience", "question": "Which feature helps remove more moisture from clothes at the end of the wash to reduce drying time?", "options": ["Air Dry Option", "Lint Tower Filter", "Auto Tub Clean", "Tub Dry"], "answer": 0}, {"id": 25, "category": "FL", "focus": "User Convenience", "question": "Which feature traps lint and fluff during the wash so they can be removed easily after the cycle?", "options": ["Lint Tower Filter", "Child Lock", "Soft Closing Lid", "Shower Rinse"], "answer": 0}, {"id": 26, "category": "FL", "focus": "User Convenience", "question": "Which feature automatically runs a cleaning cycle for the drum to reduce detergent residue and odour?", "options": ["Auto Tub Clean", "Bleach Dispenser", "Air Dry Option", "Wheels"], "answer": 0}, {"id": 27, "category": "FL", "focus": "User Convenience", "question": "Which user convenience feature prevents the top-load lid from slamming shut and makes closing smoother?", "options": ["Soft Closing Lid", "Child Lock", "Tub Dry", "Drum Lamp"], "answer": 0}, {"id": 28, "category": "FL", "focus": "User Convenience", "question": "A customer has small children who often press buttons while the machine is running. Which feature should you highlight as most helpful?", "options": ["Child Lock", "Auto Softener Dispenser", "Air Dry Option", "Lint Tower Filter"], "answer": 0}, {"id": 29, "category": "FL", "focus": "User Convenience", "question": "A customer wants to move the washing machine frequently for cleaning behind it. Which user convenience feature will be most relevant?", "options": ["Auto Tub Clean", "Wheels", "Soft Closing Lid", "Spray Rinse"], "answer": 1}, {"id": 30, "category": "TL", "focus": "Program", "question": "A customer loads everyday shirts, jeans, and casual wear together. Which program on IFB top-load machines is best suited for this mixed laundry?", "options": ["Blankets/Bulky", "Wool", "Baby Wear", "MixDaily"], "answer": 3}, {"id": 31, "category": "TL", "focus": "Program", "question": "A customer wants to wash a full load of cotton bedsheets and towels efficiently. Which program should you recommend on a TL washer?", "options": ["CradleWash", "Express 30", "Cotton / Cotton Eco", "Synthetic Daily"], "answer": 2}, {"id": 32, "category": "TL", "focus": "Program", "question": "A parent wants extra hygiene and thorough rinsing for their infant's clothes. Which TL program should you highlight?", "options": ["MixDaily", "Baby Wear", "Express 30", "Jeans"], "answer": 1}, {"id": 33, "category": "TL", "focus": "Program", "question": "A customer has lightly soiled gym wear and needs it ready quickly. Which top-load program is most appropriate?", "options": ["Woollens", "Cotton Eco", "Bulky / Blankets", "Express 30"], "answer": 3}, {"id": 34, "category": "TL", "focus": "Program", "question": "A customer complains of odour from the TL drum after many washes. Which program or feature should they run to maintain the machine?", "options": ["Smart Sense", "CradleWash", "Tub Clean / Auto Tub Clean", "StainFighter"], "answer": 2}, {"id": 35, "category": "TL", "focus": "Advanced Wash Technology", "question": "In IFB top-load machines, what is the main benefit of the Aqua Energie feature?", "options": ["It heats water faster using a special heater", "It converts hard water into soft water for better detergent action", "It reduces spin speed to protect clothes", "It adds extra steam at the end of the wash"], "answer": 1}, {"id": 36, "category": "TL", "focus": "Advanced Wash Technology", "question": "What does the Triadic or Pentad Pulsator system primarily do in IFB top-load washers?", "options": ["Adds detergent automatically based on load", "Uses multiple surfaces and rotations to gently scrub clothes and remove dirt", "Increases drum size for larger loads", "Only controls water temperature"], "answer": 1}, {"id": 37, "category": "TL", "focus": "Advanced Wash Technology", "question": "In top-load models, what is the key advantage of the 3D/4D Wash System?", "options": ["It only shortens the wash time", "It moves water and clothes in multiple directions for better soaking and cleaning", "It is used only for drying", "It disables spinning to protect delicate clothes"], "answer": 1}, {"id": 38, "category": "FL", "focus": "Advanced Wash Technology", "question": "In some IFB front-loads, how does Oxyjet help in washing performance?", "options": ["By using only cold water for all programs", "By injecting air and water at high pressure to loosen dirt and improve detergent penetration", "By stopping the drum periodically to save energy", "By drying clothes inside the washer"], "answer": 1}, {"id": 39, "category": "FL", "focus": "Advanced Wash Technology", "question": "For front-load machines, what is special about the CradleWash program from an advanced wash technology point of view?", "options": ["It uses very high spin to remove maximum water", "It uses gentle drum movements that mimic hand washing for delicate fabrics", "It mixes hot and cold water rapidly to shock clean stains", "It is designed only for blankets and bedding"], "answer": 1}, {"id": 40, "category": "FL", "focus": "Advanced Wash Technology", "question": "What is the purpose of air-bubble or bubble-based wash systems in IFB front-load machines?", "options": ["To create bubbles that lift dirt and help detergent reach deep into fabric fibres", "To dry clothes without using a separate dryer", "To reduce water usage to zero", "To only cool the drum after washing"], "answer": 0}, {"id": 41, "category": "WDR", "focus": "Advanced Wash Technology", "question": "In IFB washer-dryers, what is the main benefit of PowerSteam or steam-assisted wash programs?", "options": ["They only speed up spin cycles", "They help loosen tough stains, reduce wrinkles, and improve fabric freshness", "They are used only for drying clothes faster", "They replace detergents completely"], "answer": 1}, {"id": 42, "category": "WDR", "focus": "Advanced Wash Technology", "question": "On certain washer-dryers with AI Dos (auto detergent dosing), what does this technology do?", "options": ["Chooses the wash program automatically", "Only turns off the machine when voltage fluctuates", "Only adjusts spin speed", "Weighs the load and adds an appropriate amount of detergent from an internal tank"], "answer": 3}, {"id": 43, "category": "Dryer", "focus": "Advanced Wash Technology", "question": "In IFB dryers with sensor-based drying, what does the sensor primarily monitor?", "options": ["Colour of the clothes", "Detergent quantity in the wash", "Moisture level inside the drum to stop when the desired dryness is reached", "Voltage at the wall socket"], "answer": 2}, {"id": 44, "category": "Dryer", "focus": "Advanced Wash Technology", "question": "From a technology perspective, why is Auto Cooldown important at the end of a drying cycle?", "options": ["It overheats the clothes briefly to kill germs", "It only turns off the display panel", "It fills the drum with water to cool the heater", "It keeps tumbling with cool air to lower drum and fabric temperature, reducing heat damage and creasing"], "answer": 3}, {"id": 45, "category": "TL", "focus": "Advanced Wash Technology", "question": "In IFB top-load washers, what does the Aqua Spa Therapy feature mainly focus on?", "options": ["Extra-high spin speeds for faster drying", "Only reducing water consumption", "Gentle water flow and drum action to give premium fabric care and reduce wear on clothes", "Heating water to boiling temperature in every cycle"], "answer": 2}, {"id": 46, "category": "FL", "focus": "Advanced Wash Technology", "question": "On certain IFB front-load models, what is the key advantage of having a BLDC or Eco Inverter motor?", "options": ["It uses more power to speed up all programs", "It removes the need for a heater in hot wash programs", "It only increases the maximum spin RPM without other benefits", "It provides quieter operation, better energy efficiency, and more precise drum control"], "answer": 3}];
  const CAT_META = {
    "Dryer": { emoji: "\uD83D\uDFE0", color: "#f5a623" },
    "WDR":   { emoji: "\uD83D\uDD34", color: "#e05c5c" },
    "TL":    { emoji: "\uD83D\uDD35", color: "#4a90d9" },
    "FL":    { emoji: "\uD83D\uDFE2", color: "#3aaa6e" },
  };

  /* ── State ── */
  let questions  = [];
  let current    = 0;
  let advancing  = false;   // single hard lock — prevents any double-fire
  let advTimer   = null;

  const root = document.getElementById("qaWidget");
  if (!root) { console.error("[QA] #qaWidget not found"); return; }

  /* ── Shuffle ── */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function boot() {
    questions = shuffle(QA_DATA);
    current   = 0;
    advancing = false;
    clearTimeout(advTimer);
    renderQuestion(false);
  }

  function catBadge(cat) {
    const m = CAT_META[cat] || { emoji: "", color: "#888" };
    return '<span class="qa-cat-badge" style="background:' + m.color + '22;color:' + m.color + ';border-color:' + m.color + '55">' + m.emoji + ' ' + cat + '</span>';
  }

  function advance() {
    if (advancing) return;   // already going — ignore
    advancing = true;
    clearTimeout(advTimer);
    advTimer = setTimeout(function () {
      current++;
      if (current >= questions.length) {
        questions = shuffle(QA_DATA);
        current   = 0;
      }
      advancing = false;
      renderQuestion(true);
    }, 1500);
  }

  function renderQuestion(anim) {
    const q    = questions[current];
    const OPTS = ["A","B","C","D"];
    let selected  = null;
    let confirmed = false;

    const wrap = document.createElement("div");
    wrap.className = "qa-wrap" + (anim ? " qa-slide-in" : "");
    wrap.innerHTML =
      '<div class="qa-meta">' + catBadge(q.category) + '<span class="qa-focus">' + q.focus + '</span></div>' +
      '<div class="qa-question">' + q.question + '</div>' +
      '<div class="qa-options">' +
        q.options.map(function (opt, i) {
          return '<button class="qa-opt" data-idx="' + i + '">' +
            '<span class="qa-opt-letter">' + OPTS[i] + '</span>' +
            '<span class="qa-opt-text">'   + opt      + '</span>' +
            '</button>';
        }).join('') +
      '</div>' +
      '<div class="qa-actions"><button class="qa-submit-btn" id="qaSubmit" disabled>Submit</button></div>' +
      '<div class="qa-feedback" id="qaFeedback"></div>';

    /* swap DOM in one shot — no double innerHTML writes */
    root.innerHTML = "";
    root.appendChild(wrap);

    const optBtns   = wrap.querySelectorAll(".qa-opt");
    const submitBtn = wrap.querySelector("#qaSubmit");
    const fb        = wrap.querySelector("#qaFeedback");

    optBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirmed) return;
        optBtns.forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        selected = parseInt(btn.dataset.idx);
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener("click", function () {
      if (selected === null || confirmed || advancing) return;
      confirmed = true;
      submitBtn.disabled = true;

      const correct = q.answer;

      optBtns.forEach(function (btn) {
        const idx = parseInt(btn.dataset.idx);
        btn.style.pointerEvents = "none";   // block any further clicks
        if (idx === correct) btn.classList.add("correct");
        else if (idx === selected && selected !== correct) btn.classList.add("wrong");
      });

      if (selected === correct) {
        fb.innerHTML = '<span class="qa-fb-correct">\u2714 Correct!</span>';
        wrap.classList.add("qa-correct-flash");
        launchConfetti(root);
      } else {
        fb.innerHTML = '<span class="qa-fb-wrong">\u2718 Correct answer: <strong>' + OPTS[correct] + '. ' + q.options[correct] + '</strong></span>';
      }

      advance();
    });
  }

  /* ── Confetti ── */
  function launchConfetti(container) {
    const colors = ["#f5a623","#3aaa6e","#4a90d9","#e05c5c","#a855f7","#06b6d4"];
    const rect   = container.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 3;
    for (var i = 0; i < 32; i++) {
      (function () {
        var el    = document.createElement("div");
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size  = 7 + Math.random() * 7;
        var angle = Math.random() * 2 * Math.PI;
        var dist  = 60 + Math.random() * 100;
        var dx    = Math.cos(angle) * dist;
        var dy    = Math.sin(angle) * dist - 40;
        el.className = "qa-confetti-dot";
        el.style.cssText = [
          "position:fixed",
          "left:" + cx + "px",
          "top:"  + cy + "px",
          "width:" + size + "px",
          "height:" + size + "px",
          "border-radius:" + (Math.random() > 0.5 ? "50%" : "2px"),
          "background:" + color,
          "pointer-events:none",
          "z-index:99999",
          "transform:translate(-50%,-50%)",
          "--dx:" + dx + "px",
          "--dy:" + dy + "px",
          "animation:qa-dot-fly 0.85s ease-out forwards"
        ].join(";");
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 900);
      })();
    }
  }

  boot();
  console.log("[QA] ready — " + QA_DATA.length + " questions");
})();
