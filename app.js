/* ═══════════════════════════════════════════════════════
   IFB Unified Role Portal — app.js
   Add more roles below. Each role can inherit links
   from other roles using the "inherits" array.
═══════════════════════════════════════════════════════ */

const roleConfig = {

  service_executive: {
    label: "Service Executive",
    inherits: [],
    links: [
      { name: "FMOPT",      url: "https://ctc.ifbsupport.com/report/fmopt_report_report.php?x=date&y=parameter&data=parameter_value&op=max&" },
      { name: "SAP",        url: "http://ifbwdcc.ifbapps.com:8101/sap(bD1lbiZjPTUwMCZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?sap-client=500&sap-language=EN" },
      { name: "E-Training", url: "https://crmportal.ifbsupport.com/" },
      { name: "Fiorii",     url: "https://ifbwebdpprd.ifbserv.com:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=500&sap-language=EN" },
      { name: "CTC",        url: "https://ctc.ifbsupport.com/login.php?return=true&" }
    ]
  },

  // ── ADD MORE ROLES HERE ─────────────────────────────
  // Copy a block below, uncomment, and fill in details.
  //
  // bsm: {
  //   label: "BSM",
  //   inherits: ["service_executive"],   // gets SE links + its own
  //   links: [
  //     { name: "BSM Dashboard", url: "https://..." }
  //   ]
  // },
  //
  // rsm: {
  //   label: "RSM",
  //   inherits: ["bsm"],
  //   links: [
  //     { name: "RSM Report", url: "https://..." }
  //   ]
  // },
  //
  // branch_trainer: {
  //   label: "Branch Trainer",
  //   inherits: [],
  //   links: [
  //     { name: "Training Portal", url: "https://..." }
  //   ]
  // },
  //
  // field_trainer: {
  //   label: "Field Trainer",
  //   inherits: ["branch_trainer"],
  //   links: []
  // },
  //
  // sales_trainer: {
  //   label: "Sales Trainer",
  //   inherits: [],
  //   links: []
  // },
  //
  // sales_executive: {
  //   label: "Sales Executive",
  //   inherits: [],
  //   links: []
  // }
  // ───────────────────────────────────────────────────
};

/* ── State ── */
const state = { activeRoleId: Object.keys(roleConfig)[0] };

/* ── Elements ── */
const roleListEl    = document.getElementById("roleList");
const headingEl     = document.getElementById("activeRoleHeading");
const countEl       = document.getElementById("linkCount");
const gridEl        = document.getElementById("linkGrid");
const inheritanceEl = document.getElementById("inheritanceText");

/* ── Build role sidebar ── */
function buildRoleList() {
  roleListEl.innerHTML = "";
  Object.entries(roleConfig).forEach(([id, role]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-btn" + (state.activeRoleId === id ? " active" : "");
    btn.textContent = role.label;
    btn.addEventListener("click", () => {
      state.activeRoleId = id;
      buildRoleList();
      renderLinks();
    });
    roleListEl.appendChild(btn);
  });
}

/* ── Collect links recursively (inheritance) ── */
function collectLinks(roleId, visited = new Set()) {
  if (visited.has(roleId)) return [];
  const role = roleConfig[roleId];
  if (!role) return [];
  visited.add(roleId);
  let inherited = [];
  for (const parentId of (role.inherits || [])) {
    inherited = inherited.concat(collectLinks(parentId, visited));
  }
  const own = (role.links || []).map(l => ({ ...l, sourceRole: role.label }));
  return [...inherited, ...own];
}

function dedup(links) {
  const seen = new Set();
  return links.filter(l => {
    const k = l.name + "|" + l.url;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

/* ── Render link cards ── */
function renderLinks() {
  const role  = roleConfig[state.activeRoleId];
  if (!role) return;
  const links = dedup(collectLinks(state.activeRoleId));

  headingEl.textContent = role.label + " — Access Links";
  countEl.textContent   = links.length + " link" + (links.length === 1 ? "" : "s");

  if (role.inherits && role.inherits.length) {
    const parents = role.inherits.map(id => roleConfig[id]?.label).filter(Boolean).join(", ");
    inheritanceEl.textContent = "Includes inherited access from: " + parents;
  } else {
    inheritanceEl.textContent = "Direct role links only";
  }

  gridEl.innerHTML = "";
  if (!links.length) {
    gridEl.innerHTML = `<div class="empty-links">No links configured for this role yet.</div>`;
    return;
  }

  links.forEach(link => {
    const card = document.createElement("article");
    card.className = "link-card";

    const name = document.createElement("h3");
    name.textContent = link.name;

    const tag = document.createElement("span");
    tag.className = "source-tag";
    tag.textContent = link.sourceRole;

    const btn = document.createElement("a");
    btn.href = link.url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "open-btn";
    btn.textContent = "Open Portal →";

    card.appendChild(name);
    card.appendChild(tag);
    card.appendChild(btn);
    gridEl.appendChild(card);
  });
}

buildRoleList();
renderLinks();