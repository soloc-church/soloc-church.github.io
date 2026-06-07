/* =====================================================================
   app.js  —  It reads CONFIG (from config.js) and renders the pages.
   ===================================================================== */

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const DAY = 86400000, WEEK = DAY*7;

function parseLocal(iso){ const [y,m,d]=iso.split("-").map(Number); return new Date(y, m-1, d); }
function midnight(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d,n){ const x=new Date(d); x.setDate(d.getDate()+n); return x; }
function isoLocal(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fmtDate(d){ return d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}); }
function fmtShort(d){ return d.toLocaleDateString(undefined,{month:"short",day:"numeric"}); }

function upcomingSunday(today){
  const t = midnight(today);
  return addDays(t, (7 - t.getDay()) % 7); // today if Sunday, else next Sunday
}
function weekIndex(date){ // 0,1,2... from rotation start; even=A, odd=B
  const start = midnight(parseLocal(CONFIG.rotationStartSunday));
  return Math.round((midnight(date) - start) / WEEK);
}
function teamFor(date){ const i = weekIndex(date); return ((i % 2)+2)%2 === 0 ? "A" : "B"; }

function assignmentsFor(date){
  const base = { ...CONFIG.teams[teamFor(date)] };
  const iso = isoLocal(date);
  if (CONFIG.overrides[iso]) Object.assign(base, CONFIG.overrides[iso]);
  return base;
}

function buildSchedule(){
  const start = upcomingSunday(new Date());
  const list = [];
  for (let i=0;i<CONFIG.weeksToShow;i++){
    const d = addDays(start, i*7);
    list.push({ date:d, team:teamFor(d), people:assignmentsFor(d) });
  }
  return list;
}

let SCHEDULE = buildSchedule();
let activeName = "";

/* ---- everyone's name list (for the finder) ---- */
function allNames(){
  const s = new Set();
  ["A","B"].forEach(t => Object.values(CONFIG.teams[t]).forEach(n => s.add(n)));
  Object.values(CONFIG.overrides).forEach(o => Object.values(o).forEach(n => { if(n && n!=="—") s.add(n); }));
  return [...s].sort((a,b)=>a.localeCompare(b));
}

/* ---------- render: this-sunday panel ---------- */
function renderNow(){
  const first = SCHEDULE[0];
  const today = midnight(new Date());
  const days = Math.round((midnight(first.date)-today)/DAY);
  const rel = days===0 ? "Today" : days===7 ? "Next Sunday" : "in "+days+" days";
  let cells = CONFIG.roles.map(r=>{
    const name = first.people[r] || "—";
    const hi = activeName && name===activeName ? " hi":"";
    return `<div class="now-cell${hi}"><div class="r">${r}</div><div class="n">${name}</div></div>`;
  }).join("");
  $("#nowPanel").innerHTML = `
    <div class="now-top">
      <div>
        <span class="onair"><span class="led"></span>On air · Team ${first.team}</span>
        <div class="now-date">${fmtDate(first.date)}</div>
      </div>
      <span class="now-rel">${rel}</span>
    </div>
    <div class="now-grid">${cells}</div>`;
}

/* ---------- render: full table ---------- */
function renderTable(){
  const thead = $("#schedTable thead");
  const tbody = $("#schedTable tbody");
  thead.innerHTML = "<tr><th>Date</th>"+CONFIG.roles.map(r=>`<th>${r}</th>`).join("")+"</tr>";
  tbody.innerHTML = SCHEDULE.map((w,i)=>{
    const live = i===0;
    const serves = activeName && CONFIG.roles.some(r=>w.people[r]===activeName);
    const dim = activeName && !serves;
    const cells = CONFIG.roles.map(r=>{
      const name = w.people[r] || "—";
      const match = activeName && name===activeName ? " match":"";
      return `<td data-label="${r}"><span class="nm${match}">${name}</span></td>`;
    }).join("");
    const livePill = live ? `<span class="live-pill"><span class="led"></span>This Sunday</span>` : "";
    return `<tr class="${live?'live':''} ${dim?'dim':''}">
        <td class="date" data-label="Date">${fmtShort(w.date)}<span class="wk">Team ${w.team} ${livePill}</span></td>
        ${cells}
      </tr>`;
  }).join("");
}

/* ---------- finder ---------- */
function renderFinder(){
  const sel = $("#nameFilter");
  sel.innerHTML = `<option value="">— everyone —</option>` +
    allNames().map(n=>`<option value="${n}">${n}</option>`).join("");
  sel.onchange = () => { activeName = sel.value; updateNextUp(); renderNow(); renderTable(); };
}
function updateNextUp(){
  const el = $("#nextUp");
  if(!activeName){ el.textContent=""; return; }
  const hit = SCHEDULE.find(w => CONFIG.roles.some(r=>w.people[r]===activeName));
  if(!hit){ el.textContent = "no upcoming shifts in this window"; return; }
  const role = CONFIG.roles.find(r=>hit.people[r]===activeName);
  el.textContent = `next up · ${fmtShort(hit.date)} · ${role}`;
}

/* ---------- disciplines (home) ---------- */
function renderDisciplines(){
  $("#disciplineGrid").innerHTML = CONFIG.training.map((t,i)=>`
    <div class="card reveal" style="animation-delay:${.08*i+.1}s">
      <div class="idx">0${i+1}</div>
      <h3>${t.title}</h3>
      <p>${t.sub}</p>
    </div>`).join("");
}

/* ---------- training / handbook ---------- */
let topicIdx = 0;
function ytEmbed(url){
  if(!url) return null;
  let id="";
  const m1 = url.match(/[?&]v=([^&]+)/); const m2 = url.match(/youtu\.be\/([^?&]+)/);
  if(m1) id=m1[1]; else if(m2) id=m2[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
function renderToc(){
  $("#toc").innerHTML = CONFIG.training.map((t,i)=>
    `<button data-i="${i}" class="${i===topicIdx?'active':''}">${t.title}</button>`).join("");
  $$("#toc button").forEach(b=>b.onclick=()=>{ topicIdx=+b.dataset.i; renderTopic(); });
  const pick = $("#topicPick");
  pick.innerHTML = CONFIG.training.map((t,i)=>`<option value="${i}" ${i===topicIdx?'selected':''}>${t.title}</option>`).join("");
  pick.onchange = ()=>{ topicIdx=+pick.value; renderTopic(); };
}
function renderTopic(){
  const t = CONFIG.training[topicIdx];
  const embed = ytEmbed(t.video);
  const vid = embed
    ? `<div class="vid"><iframe src="${embed}" allowfullscreen loading="lazy"></iframe></div>`
    : `<div class="vid"><div class="ph"><svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9z"/></svg>Video coming soon</div></div>`;
  $("#topicBody").innerHTML = `
    <h3>${t.title}</h3>
    <p class="sub">${t.sub}</p>
    ${vid}
    <p>${t.intro}</p>
    <div class="block fund">
      <span class="lbl">Fundamentals</span>
      <ul>${t.fundamentals.map(f=>`<li>${f}</li>`).join("")}</ul>
    </div>
    <div class="block style">
      <span class="lbl">Then make it yours</span>
      <p class="muted" style="margin:10px 0 0">${t.style}</p>
    </div>`;
  $$("#toc button").forEach((b,i)=>b.classList.toggle("active", i===topicIdx));
}

/* ---------- theme ---------- */
const ICON_SUN  = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M21 12.8A8.5 8.5 0 1111.2 3 6.6 6.6 0 0021 12.8z"/></svg>';
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  $("#themeToggle").innerHTML = t==="light" ? ICON_MOON : ICON_SUN; // shows the theme you'd switch TO
  try{ localStorage.setItem("soloc-theme", t); }catch(e){}
}
function initTheme(){
  let t="dark";
  try{ const s=localStorage.getItem("soloc-theme"); if(s==="light"||s==="dark") t=s; }catch(e){}
  applyTheme(t);
  $("#themeToggle").addEventListener("click", ()=>{
    const cur=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";
    applyTheme(cur);
  });
}

/* ---------- router ---------- */
const ROUTES = ["home","schedule","training","about"];
function route(){
  let r = (location.hash||"#home").slice(1);
  if(!ROUTES.includes(r)) r="home";
  $$(".page").forEach(p=>p.classList.remove("show"));
  $("#page-"+r).classList.add("show");
  $$("[data-route]").forEach(a=>a.classList.toggle("active", a.dataset.route===r));
  window.scrollTo({top:0, behavior:"instant" in window ? "instant":"auto"});
}

/* ---------- boot ---------- */
function boot(){
  $("#brandName").textContent = CONFIG.team.name;
  $("#brandSub").textContent = CONFIG.team.suffix;
  $("#yr").textContent = new Date().getFullYear();
  initTheme();
  $("#statPeople").textContent = allNames().length;
  $("#statRoles").textContent = CONFIG.roles.length;
  $("#schedNote").innerHTML =
    "This schedule generates itself from the rotation in <code>CONFIG</code> and rolls forward every week — no Monday edits needed. " +
    "To change names, edit <code>js/config.js</code> (teams.A / teams.B). For a one-off swap, add a date to <code>overrides</code>.";

  renderDisciplines();
  renderNow();
  renderFinder();
  renderTable();
  renderToc();
  renderTopic();
  route();
  window.addEventListener("hashchange", route);
}
document.addEventListener("DOMContentLoaded", boot);