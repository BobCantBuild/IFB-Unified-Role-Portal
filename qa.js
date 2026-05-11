/* ═══════════════════════════════════════════════════════
   qa.js  —  IFB Q&A Quiz Widget
   Right side panel, between Model Search and IFB News
═══════════════════════════════════════════════════════ */
(function () {

  const QA_DATA = [
  {
    "id": 1,
    "category": "Dryer",
    "focus": "Program → Load type",
    "question": "In IFB Turbo Dry 5.5 kg dryers, what type of laundry is the 'Mixed Load' program designed for?",
    "options": [
      "Only silk sarees",
      "A mixture of different fabric types in one load",
      "Only woollen blankets",
      "Only baby clothes"
    ],
    "answer": 1
  },
  {
    "id": 2,
    "category": "Dryer",
    "focus": "Program → Fabric",
    "question": "For Turbo Dry dryers, which items are best suited to the 'Cotton' program?",
    "options": [
      "Towels and flannel blankets",
      "Only synthetic sportswear",
      "Only innerwear and lingerie",
      "Only curtains"
    ],
    "answer": 0
  },
  {
    "id": 3,
    "category": "Dryer",
    "focus": "Program → Fabric",
    "question": "The 'Synthetics' program on IFB Turbo Dry dryers is recommended for which type of fabrics?",
    "options": [
      "Heavy denim jeans",
      "Delicate fabrics prone to shrinkage such as lingerie and synthetics",
      "Woollen sweaters only",
      "Thick cotton rugs"
    ],
    "answer": 1
  },
  {
    "id": 4,
    "category": "Dryer",
    "focus": "Program options",
    "question": "On the Mixed Load program, which of these is a correct example of a drying level/time combination?",
    "options": [
      "Cupboard Dry 30 min only",
      "Iron Dry 90 min, Cupboard Dry 120 min",
      "Iron Dry 200 min, Cupboard Dry 240 min",
      "Only a 10-minute cool cycle"
    ],
    "answer": 1
  },
  {
    "id": 5,
    "category": "Dryer",
    "focus": "Program options",
    "question": "For the 'Synthetics' load, which time settings are typically available on Turbo Dry?",
    "options": [
      "Iron Dry 50 minutes, Cupboard Dry 70 minutes",
      "Iron Dry 10 minutes, Cupboard Dry 20 minutes",
      "Only Cupboard Dry 160 minutes",
      "Only Refresh 20 minutes"
    ],
    "answer": 0
  },
  {
    "id": 6,
    "category": "Dryer",
    "focus": "Safety feature",
    "question": "What is the function of the 'Safety Door Switch' in IFB Turbo Dry dryers?",
    "options": [
      "It keeps the door locked during the full cycle, even during emergencies",
      "It automatically stops the dryer when the door is opened",
      "It increases drum speed when the door is opened",
      "It switches on the interior drum light only"
    ],
    "answer": 1
  },
  {
    "id": 7,
    "category": "Dryer",
    "focus": "Safety feature",
    "question": "The 'Safety Reset' in Turbo Dry dryers is best described as:",
    "options": [
      "A button to select extra-dry level",
      "A temperature-activated cut-off that protects the dryer from overheating",
      "A child-lock that disables the control panel",
      "A function that adds extra water to cool the drum"
    ],
    "answer": 1
  },
  {
    "id": 8,
    "category": "Dryer",
    "focus": "Convenience feature",
    "question": "What does the 'Auto Cooldown' feature do at the end of a drying cycle?",
    "options": [
      "Adds more heat to remove wrinkles",
      "Stops airflow immediately when the timer ends",
      "Continues airflow to cool clothes and internal parts for safer handling",
      "Drains water from the washer section"
    ],
    "answer": 2
  },
  {
    "id": 9,
    "category": "Dryer",
    "focus": "Installation feature",
    "question": "Why is a 'Venting Kit' provided with IFB Turbo Dry dryers?",
    "options": [
      "To store extra lint from previous cycles",
      "To exhaust hot, moist air outside for efficient drying",
      "To convert the dryer into a washer-dryer",
      "To reduce power consumption by half"
    ],
    "answer": 1
  },
  {
    "id": 10,
    "category": "Dryer",
    "focus": "Installation feature",
    "question": "What is the purpose of the 'Wall Mounting Kit' supplied with Turbo Dry models?",
    "options": [
      "To increase drum capacity",
      "To safely mount the dryer on a wall and save floor space",
      "To fix the dryer permanently to the washer top",
      "To connect the dryer directly to the water inlet"
    ],
    "answer": 1
  },
  {
    "id": 11,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In the model name 'IFB Executive Plus ZBG 11/7/3 kg', what do the numbers 11/7/3 indicate?",
    "options": [
      "11 programs, 7 spin speeds, 3 wash temperatures",
      "11 kg wash, 7 kg dry, 3 kg refresher capacity",
      "11-year motor warranty, 7-year product warranty, 3-year AMC",
      "11 kg dryer, 7 kg washer, 3 kg drum diameter"
    ],
    "answer": 1
  },
  {
    "id": 12,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In 'IFB Executive Plus ZBG 11/7/3 kg', what does 'ZB' represent?",
    "options": [
      "Colour code for White",
      "Dryer series only",
      "Black PCM",
      "Program name"
    ],
    "answer": 2
  },
  {
    "id": 13,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In 'IFB Executive Plus ZBG 11/7/3 kg', what does the letter 'G' at the end of 'ZBG' stand for?",
    "options": [
      "G Series Gold",
      "Glass door option",
      "Gas-heated dryer",
      "Global model variant"
    ],
    "answer": 0
  },
  {
    "id": 14,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In the model naming table, 'Executive Plus' refers to which of the following?",
    "options": [
      "A wash program",
      "A machine care feature",
      "The model series or family name",
      "The AMC plan type"
    ],
    "answer": 2
  },
  {
    "id": 15,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "For washer-dryers like 'IFB Executive ZBN CMS 9 6 3 kg', what does 'CMS' indicate?",
    "options": [
      "Common motor software",
      "Colour code for Mocha Silver",
      "Cupboard-dry plus mixed-soil program",
      "Child-lock safety mode"
    ],
    "answer": 0
  },
  {
    "id": 16,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In 'IFB Executive ZBN CMS 9 6 3 kg', what do the numbers 9 6 3 refer to?",
    "options": [
      "9 kg wash, 6 kg dry, 3 kg refresher capacity",
      "9 wash programs, 6 dry programs, 3 steam levels",
      "9-year total warranty, 6-year motor, 3-year panel",
      "9 kg Refresh, 6 kg Dry, 3 kg wash weight"
    ],
    "answer": 0
  },
  {
    "id": 17,
    "category": "WDR",
    "focus": "Nomenclature",
    "question": "In the nomenclature section, what does 'Neo Series' (suffix N in some model codes) usually convey?",
    "options": [
      "The machine is top-load",
      "The model belongs to a newer connected series",
      "The washer has no dryer function",
      "The dryer is gas powered"
    ],
    "answer": 1
  },
  {
    "id": 18,
    "category": "TL",
    "focus": "Nomenclature",
    "question": "In top-load models like 'IFB TL – R1BRS 7 kg Aqua', what does 'TL' stand for?",
    "options": [
      "Turbo Load",
      "Top Load",
      "Twin Load",
      "Time-logic Load"
    ],
    "answer": 1
  },
  {
    "id": 19,
    "category": "TL",
    "focus": "Nomenclature",
    "question": "In 'IFB TL – R1BRS 7 kg Aqua', what does the letter 'R' in the code specify?",
    "options": [
      "Round door design",
      "Rear-mounted control panel",
      "Reduced spin speed",
      "Rapid-wash only model"
    ],
    "answer": 0
  },
  {
    "id": 20,
    "category": "TL",
    "focus": "Nomenclature",
    "question": "In 'IFB TL – R1BRS 7 kg Aqua', what does '7 kg Aqua' together describe?",
    "options": [
      "7 wash programs with Aqua Energie off",
      "Washing capacity of 7 kg with Aqua Energie feature",
      "7-litre water tank size with Aqua filter",
      "7-year warranty on Aqua parts"
    ],
    "answer": 1
  }
];

  const CAT_META = {
    "Dryer": { emoji: "\uD83D\uDFE0", color: "#f5a623" },
    "WDR":   { emoji: "\uD83D\uDD34", color: "#e05c5c" },
    "TL":    { emoji: "\uD83D\uDD35", color: "#4a90d9" },
    "FL":    { emoji: "\uD83D\uDFE2", color: "#3aaa6e" },
  };

  /* ── State ── */
  let questions   = [];
  let current     = 0;
  let selected    = null;
  let confirmed   = false;
  let score       = 0;
  let filterCat   = "All";

  /* ── DOM ── */
  const root = document.getElementById("qaWidget");
  if (!root) { console.error("[QA] #qaWidget not found"); return; }

  /* ── Init ── */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(cat) {
    filterCat = cat;
    const pool = cat === "All" ? QA_DATA : QA_DATA.filter(q => q.category === cat);
    questions  = shuffle(pool);
    current    = 0;
    selected   = null;
    confirmed  = false;
    score      = 0;
    renderQuestion();
  }

  /* ── Render helpers ── */
  function catBadge(cat) {
    const m = CAT_META[cat] || { emoji: "⚪", color: "#888" };
    return `<span class="qa-cat-badge" style="background:${m.color}22;color:${m.color};border-color:${m.color}44">${m.emoji} ${cat}</span>`;
  }

  function renderHome() {
    const cats = ["All", ...Object.keys(CAT_META).filter(c => QA_DATA.some(q => q.category === c))];
    root.innerHTML = `
      <div class="qa-home">
        <div class="qa-home-title">IFB Product Quiz</div>
        <div class="qa-home-sub">Test your product knowledge</div>
        <div class="qa-home-stats">
          ${QA_DATA.map(q => q.category).filter((v,i,a)=>a.indexOf(v)===i).map(c => {
            const cnt = QA_DATA.filter(q=>q.category===c).length;
            const m   = CAT_META[c]||{};
            return `<div class="qa-stat-chip" style="border-color:${m.color||'#888'}44;color:${m.color||'#888'}">${m.emoji||''} ${c} <strong>${cnt}</strong></div>`;
          }).join('')}
        </div>
        <div class="qa-home-label">Choose category</div>
        <div class="qa-cat-btns">
          ${cats.map(c => `<button class="qa-cat-btn" data-cat="${c}">${c === "All" ? "All Questions (" + QA_DATA.length + ")" : ((CAT_META[c]||{}).emoji||'') + ' ' + c}</button>`).join('')}
        </div>
      </div>`;
    root.querySelectorAll(".qa-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => startQuiz(btn.dataset.cat));
    });
  }

  function renderQuestion() {
    if (current >= questions.length) { renderResult(); return; }
    const q   = questions[current];
    const tot = questions.length;
    const pct = Math.round((current / tot) * 100);
    const opts = ["A","B","C","D"];

    root.innerHTML = `
      <div class="qa-wrap">
        <div class="qa-topbar">
          <button class="qa-home-btn" id="qaHomeBtn">Home</button>
          <div class="qa-progress-bar"><div class="qa-progress-fill" style="width:${pct}%"></div></div>
          <span class="qa-counter">${current+1}/${tot}</span>
        </div>
        <div class="qa-meta">${catBadge(q.category)}<span class="qa-focus">${q.focus}</span></div>
        <div class="qa-question">${q.question}</div>
        <div class="qa-options" id="qaOptions">
          ${q.options.map((opt, i) => `
            <button class="qa-opt" data-idx="${i}">
              <span class="qa-opt-letter">${opts[i]}</span>
              <span class="qa-opt-text">${opt}</span>
            </button>`).join('')}
        </div>
        <div class="qa-actions">
          <button class="qa-submit-btn" id="qaSubmit" disabled>Submit</button>
        </div>
        <div class="qa-feedback" id="qaFeedback"></div>
        <div class="qa-score-row">Score: <strong id="qaScore">${score}</strong> / ${tot}</div>
      </div>`;

    document.getElementById("qaHomeBtn").addEventListener("click", renderHome);

    const optBtns = root.querySelectorAll(".qa-opt");
    const submitBtn = document.getElementById("qaSubmit");

    optBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirmed) return;
        optBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selected = parseInt(btn.dataset.idx);
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener("click", () => {
      if (selected === null || confirmed) return;
      confirmed = true;
      submitBtn.disabled = true;
      const correct = q.answer;
      optBtns.forEach(btn => {
        const idx = parseInt(btn.dataset.idx);
        if (idx === correct) btn.classList.add("correct");
        else if (idx === selected && selected !== correct) btn.classList.add("wrong");
      });
      const fb = document.getElementById("qaFeedback");
      if (selected === correct) {
        score++;
        document.getElementById("qaScore").textContent = score;
        fb.innerHTML = '<span class="qa-fb-correct">Correct!</span>';
      } else {
        fb.innerHTML = `<span class="qa-fb-wrong">Wrong. Correct answer: <strong>${opts[correct]}. ${q.options[correct]}</strong></span>`;
      }
      // auto-advance after 1.8s
      setTimeout(() => {
        current++;
        selected  = null;
        confirmed = false;
        renderQuestion();
      }, 1800);
    });
  }

  function renderResult() {
    const tot = questions.length;
    const pct = Math.round((score / tot) * 100);
    let grade, gradeClass;
    if (pct >= 80) { grade = "Excellent!"; gradeClass = "qa-grade-great"; }
    else if (pct >= 50) { grade = "Good effort!"; gradeClass = "qa-grade-ok"; }
    else { grade = "Keep practicing!"; gradeClass = "qa-grade-low"; }

    root.innerHTML = `
      <div class="qa-result">
        <div class="qa-result-title">Quiz Complete</div>
        <div class="qa-result-score">${score}<span>/${tot}</span></div>
        <div class="qa-result-pct">${pct}%</div>
        <div class="qa-result-grade ${gradeClass}">${grade}</div>
        <div class="qa-result-actions">
          <button class="qa-retry-btn" id="qaRetry">Retry Same</button>
          <button class="qa-home2-btn" id="qaHome2">Back to Home</button>
        </div>
      </div>`;
    document.getElementById("qaRetry").addEventListener("click", () => startQuiz(filterCat));
    document.getElementById("qaHome2").addEventListener("click", renderHome);
  }

  /* ── Boot ── */
  renderHome();
  console.log("[QA] quiz ready — " + QA_DATA.length + " questions");
})();
