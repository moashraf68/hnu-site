/* =========================================================================
 * أسرة طلاب من أجل مصر — جامعة حلوان الأهلية
 * Modular Bundle: Generated from src/
 * Total Modules: 10
 * Generated: 2026-10-24T15:04:04.844Z
 * ========================================================================= */


/* >>> MODULE: 01_utils.js <<< */
/**
 * 01_utils.js - Utilities, formatters, audio and video helpers
 * Part of HNU Students For Egypt Platform
 */

/* أسرة طلاب من أجل مصر — Client-side router + views. كل البيانات من config.js */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = CONFIG, app = $("#app");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
let lang = localStorage.getItem("lang") === "en" ? "en" : "ar";
const t = o => (o && o[lang]) || "", S = k => STR[lang][k];
const ph = s => /\[|\]/.test(s || "");           // نص Placeholder؟
const USER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z"/></svg>';
const ICONS = { facebook: "M14 8V6c0-1 .5-1.5 1.5-1.5H17V1h-3c-3 0-4.5 2-4.5 4.5V8H7v3.5h2.5V23H14V11.5h3L17.5 8z", instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z", linkedin: "M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 9h4v12H2zm7 0h4v2c1-2 6-3 6 2v8h-4v-7c0-2-2-2-2 0v7H9z", tiktok: "M16 2h-3v13a3 3 0 1 1-3-3v-3a6 6 0 1 0 6 6V9c1 1 3 2 5 2V8c-3 0-5-3-5-6z" };

/* ---------- Templates ---------- */
const fixPath = s => (s && !s.startsWith("http") && !s.startsWith("/") ? "/" + s : s);
const person = (p, title, cls = "") => {
  const hasBio = p.bioKey && C.bios && C.bios[p.bioKey];
  const imgEl = `<img class="av${hasBio ? ' bio-trigger' : ''}" src="${fixPath(p.photo)}" alt="${p.name}" width="160" height="160" loading="lazy" data-fb='${USER}' data-fbc="av ph"${hasBio ? ` data-bio="${p.bioKey}" title="${lang === 'ar' ? 'اضغط لعرض السيرة الذاتية' : 'Click to view profile'}" style="cursor:pointer"` : ''}>`;
  const wrapEl = hasBio
    ? `<button type="button" class="av-bio-btn" data-bio="${p.bioKey}" aria-label="${lang === 'ar' ? 'سيرة ذاتية: ' + p.name : 'Profile: ' + p.name}" style="background:none;border:none;padding:0;cursor:pointer;position:relative;display:inline-block">${imgEl}<span style="position:absolute;bottom:4px;right:4px;background:linear-gradient(135deg,var(--c1),#7a4a28);color:#fff;border-radius:50%;width:26px;height:26px;font-size:.85rem;display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.4);border:2px solid #fff;pointer-events:none" title="${lang === 'ar' ? 'السيرة الذاتية' : 'Biography'}" aria-hidden="true">📜</span></button>`
    : `<div class="avslot">${imgEl}</div>`;
  return `<figure class="person ${cls}"${hasBio ? ` data-bio="${p.bioKey}" style="cursor:pointer"` : ''}>${wrapEl}<figcaption><b>${p.name}</b><small>${title}</small></figcaption></figure>`;
};
const arrow = '<span class="arr" aria-hidden="true">→</span>';
const list = a => a.map(x => `<li>${t(x)}</li>`).join("");

function getVideoEmbedUrl(url) {
  if (!url) return '';
  url = url.trim();
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

function getVideoBadge(url) {
  if (!url) return '🎥 فيديو';
  if (/facebook\.com|fb\.watch/i.test(url)) return '🎥 فيسبوك';
  if (/tiktok\.com/i.test(url)) return '🎥 تيك توك';
  if (/instagram\.com/i.test(url)) return '🎥 إنستغرام';
  if (/youtu\.be|youtube\.com/i.test(url)) return '🎥 يوتيوب';
  if (/vimeo\.com/i.test(url)) return '🎥 فيميو';
  if (url.startsWith('data:video') || /\.(mp4|webm|mov|ogg)/i.test(url)) return '🎥 كليب مباشر';
  return '🎥 فيديو';
}

function renderVideoPlayer(url, title = "", extraStyle = "") {
  if (!url) return '';
  url = url.trim();

  // 1. Direct video (file upload / base64 / mp4 / webm / mov / ogg)
  if (url.startsWith('data:video') || /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) {
    return `<video src="${url}" controls playsinline preload="metadata" title="${title || 'فيديو الأسرة'}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;background:#000;${extraStyle}"></video>`;
  }

  // 2. YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?rel=0" title="${title || 'فيديو يوتيوب'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 3. Facebook Video / Reel
  if (/facebook\.com|fb\.watch/i.test(url)) {
    const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=false`;
    return `<iframe src="${fbEmbed}" title="${title || 'فيديو فيسبوك'}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 4. Instagram Reel / Post
  const igMatch = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/i);
  if (igMatch && igMatch[1]) {
    return `<iframe src="https://www.instagram.com/reel/${igMatch[1]}/embed" title="${title || 'فيديو إنستغرام'}" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 5. TikTok
  const ttMatch = url.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|v\/)(\d+)/i);
  if (ttMatch && ttMatch[1]) {
    return `<iframe src="https://www.tiktok.com/embed/v2/${ttMatch[1]}" title="${title || 'فيديو تيك توك'}" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 6. Vimeo
  const vimMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimMatch && vimMatch[1]) {
    return `<iframe src="https://player.vimeo.com/video/${vimMatch[1]}" title="${title || 'فيديو فيميو'}" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 7. Google Drive
  const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#&]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return `<iframe src="https://drive.google.com/file/d/${gdriveMatch[1]}/preview" title="${title || 'فيديو درايف'}" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
  }

  // 8. Generic iframe
  return `<iframe src="${url}" title="${title || 'فيديو'}" allowfullscreen style="width:100%;height:100%;border:none;border-radius:14px;${extraStyle}"></iframe>`;
}

function getGalleryItems() {
  try {
    const v = localStorage.getItem("cf_gallery");
    if (v) {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return C.gallery.map((url, i) => ({
    id: 'def-' + i,
    url: url,
    type: 'IMAGE',
    title: 'لحظات من أنشطة الأسرة ' + (i + 1)
  }));
}

function saveGalleryItems(items) {
  try { localStorage.setItem("cf_gallery", JSON.stringify(items)); } catch {}
}


/* >>> MODULE: 02_landing.js <<< */
/**
 * 02_landing.js - Public Landing Page Views (Hero, About, Leaders, Committees)
 * Part of HNU Students For Egypt Platform
 */

function homeView() {
  const A = C.about, L = C.leadership;
  return `
<section id="home" class="hero"><div class="wrap hero-in">
  <div class="hero-tx"><h1><span>${S("h1a")}</span> <em>${S("h1b")}</em></h1>
    <p class="sub">${S("sub")}</p><p class="slogan">${S("slogan")}</p>
    <div class="row"><a href="/register" data-link class="btn">${S("join")}</a><a href="/#about" data-link class="btn ghost">${S("know")}</a></div></div>
  <picture class="hero-logo"><source srcset="/assets/images/logo.webp" type="image/webp"><img src="/assets/images/logo.png" alt="الشعار الرسمي لأسرة طلاب من أجل مصر" width="420" height="415" fetchpriority="high"></picture>
</div></section>

<section id="about" class="sec"><div class="wrap"><h2 class="rv">${S("n_about")}</h2>
  <p class="lead rv">${t(A.lead)}</p>
  <div class="grid3">
    <div class="card rv"><h3>${S("vis")}</h3><p>${t(A.vision)}</p></div>
    <div class="card rv"><h3>${S("mis")}</h3><p>${t(A.mission)}</p></div>
    <div class="card rv"><h3>${S("val")}</h3><ul class="vals">${list(A.values)}</ul></div>
  </div>
  <div class="counters">${C.counters.map(c => `<div class="rv"><b data-n="${c.n}" data-p="${c.plus ? "+" : ""}">${c.n}${c.plus ? "+" : ""}</b><span>${t(c)}</span></div>`).join("")}</div>
</div></section>

<section id="leaders" class="sec alt"><div class="wrap"><h2 class="rv">${S("n_lead")}</h2>
  ${L.supervisor ? `<div class="org rv" style="justify-content:center;margin-bottom:18px">${person(L.supervisor, t(L.supervisor.title), "lg")}</div>` : ""}
  <div class="org rv">${person(L.bigBrother, t(L.bigBrother.title), "lg")}<div class="line" aria-hidden="true"></div>${person(L.viceBigBrother, t(L.viceBigBrother.title), "lg")}</div>
  ${L.headOfCommittees ? `<div class="org rv" style="justify-content:center;margin-top:28px">${person(L.headOfCommittees, t(L.headOfCommittees.title), "lg")}</div>` : ""}
</div></section>

<section id="events" class="sec"><div class="wrap"><h2 class="rv">${S("n_ev")}</h2><p class="subh rv">${S("ev_sub")}</p>
  <div class="grid3">${C.events.map(e => `<article class="card ev rv"><div class="evimg"><img src="${e.img}" alt="${t(e.title)}" width="600" height="400" loading="lazy" data-fb="${e.icon}" data-fbc="fbimg"></div><div class="evb"><small>${t(e.date)}</small><h3>${t(e.title)}</h3><p>${t(e.desc)}</p></div></article>`).join("")}</div>
</div></section>

<section id="gallery" class="sec alt"><div class="wrap"><h2 class="rv">${S("n_gal")}</h2><p class="subh rv">${S("gal_sub")}</p>
  <div class="gal">${getGalleryItems().map((g, i) => {
    if (g.type === "VIDEO") {
      return `<div class="gi rv" style="position:relative;background:#000;overflow:hidden">
        ${renderVideoPlayer(g.url, g.title)}
        <span style="position:absolute;top:10px;left:10px;background:rgba(200,16,46,.9);color:#fff;padding:2px 10px;border-radius:8px;font-size:.75rem;font-weight:700;pointer-events:none;z-index:2">${getVideoBadge(g.url)}</span>
        ${g.title ? `<span style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.85));color:#fff;padding:14px 14px 6px;font-size:.82rem;font-weight:600;pointer-events:none;text-align:right;z-index:2">${g.title}</span>` : ''}
      </div>`;
    } else {
      const imgUrl = g.url || g;
      const title = g.title || `${S("gimg")} ${i + 1}`;
      return `<button type="button" class="gi rv" data-g="${i}" aria-label="${title}" style="position:relative;overflow:hidden">
        <img src="${imgUrl}" alt="${title}" width="400" height="300" loading="lazy" data-fb="🖼" data-fbc="fbimg">
        ${g.title ? `<span style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.8));color:#fff;padding:12px 14px 6px;font-size:.82rem;font-weight:600;pointer-events:none;text-align:right">${g.title}</span>` : ''}
      </button>`;
    }
  }).join("")}</div>
</div></section>

<section id="join" class="sec dark"><div class="wrap narrow cta"><h2 class="rv">${S("join_t")}</h2><p class="rv">${S("join_d")}</p>
  <ol class="steps">${STR[lang].s.map(x => `<li>${x}</li>`).join("")}</ol>
  <a href="/register" data-link class="btn big">${S("join")}</a>
</div></section>

<section id="contact" class="sec"><div class="wrap narrow">
  <h2 class="rv">${S("sug_t")}</h2><p class="subh rv">${S("sug_sub")}</p>
  <form class="form rv" id="cform" novalidate>
    <label>${S("f_name")}<input name="name" autocomplete="name" required></label>
    <label>${S("f_email")}<input name="email" type="email" autocomplete="email" required></label>
    <label>${S("f_act")}<input name="activity" required></label>
    <label>${S("f_aud")}<input name="audience"></label>
    <label>${S("f_msg")}<textarea name="message" rows="4" required></textarea></label>
    <button class="btn" type="submit">${S("send")}</button><p class="msg" role="status" aria-live="polite"></p>
  </form>
</div></section>`;
}

function committeesView() {
  return `<section class="sec pg"><div class="wrap"><h1 class="h2 rv">${S("n_com")}</h1><p class="subh rv">${S("com_sub")}</p>
  <div class="cgrid">${C.committeeOrder.map((k, i) => { const c = C.committees[k]; return `<a class="ccard rv" style="--d:${i * 70}ms" href="/committees/${k}" data-link>
    <span class="cico" aria-hidden="true">${c.icon}</span><span class="ccode">${c.code}</span><span class="car">${t(c)}</span><span class="cen">${lang === "ar" ? c.en : c.ar}</span>
    <span class="cint">${t(c.intro)}</span><span class="ccta">${S("view_com")} ${arrow}</span></a>`; }).join("")}</div></div></section>`;
}

function committeeView(k) {
  const c = C.committees[k], H = "Head";
  const soc = Object.entries(c.links || {}).filter(([, u]) => u).map(([n, u]) => `<a class="btn ghost" href="${u}" target="_blank" rel="noopener noreferrer"><span style="text-transform:capitalize">${n}</span></a>`).join("");
  return `<article class="cd">
  <section class="cdhero"><div class="wrap"><a href="/committees" data-link class="back">${arrow} ${S("back")}</a>
    <span class="cico big" aria-hidden="true">${c.icon}</span><h1>${c.code} <small>${t(c)}</small></h1><p class="en">${lang === "ar" ? c.en : c.ar}</p><p class="intro">${t(c.desc)}</p></div></section>
  <div class="wrap cdbody">
    <section class="card rv"><h2>${S("role")}</h2><p>${t(c.role)}</p></section>
    <div class="two"><section class="card rv"><h2>${S("resp")}</h2><ul class="tick">${list(c.tasks)}</ul></section>
    <section class="card rv"><h2>${S("gain")}</h2><ul class="tick">${list(c.gains)}</ul></section></div>
    <section class="card rv"><h2>${S("lead")}</h2><div class="heads" dir="ltr">${person(c.head, c.head && c.head.title ? t(c.head.title) : H, "lg")}${(c.vices || []).map(v => person(v, v.title ? t(v.title) : "Vice Head", "lg")).join("")}</div></section>
    ${soc ? `<section class="card rv"><h2>${S("soc")}</h2><div class="row">${soc}</div></section>` : ""}
    <a href="/committees" data-link class="btn back2">${arrow} ${S("back")}</a>
  </div></article>`;
}
const notFound = () => `<section class="sec pg"><div class="wrap narrow cta"><h1 class="h2">404</h1><h2>${S("nf_t")}</h2><p>${S("nf_d")}</p><a href="/" data-link class="btn">${S("home")}</a></div></section>`;


/* >>> MODULE: 03_state.js <<< */
/**
 * 03_state.js - Global State, Store accessors, Metric calculations
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Central Family Portal & Admin ---------- */
let curAuthMode = "login", curAtab = "overview", studentSearchQuery = "", evalSearchQuery = "", selectedEvalStudentId = "", openedEventArchiveId = "", regPhotoBase64 = "", isEditingProfile = false, editPhotoBase64 = "";
let memberSortBy = "score_desc", memberFilterCom = "all", memberFilterCollege = "all", memberFilterTier = "all", memberViewMode = "table", biFilterCom = "all", studentSearchTimer = null;
const getStore = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const setStore = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const INIT_EVENTS_ARCHIVE = [
  {
    id: "ev-init-1",
    title: "ملتقى استقبال الطلاب الجدد والتعريف باللجان",
    date: "10/10/2026",
    time: "11:00 ص",
    totalAttendees: 4,
    attendees: [
      { studentId: "std-1", studentName: "أحمد محمود سالم", nid: "30501121400111", college: "حاسبات", year: "الفرقة الأولى", committee: "oc", phone: "01012345678", photo: "/assets/images/logo.png", time: "11:05 ص" },
      { studentId: "std-2", studentName: "سارة إبراهيم حسن", nid: "30502121400222", college: "هندسة", year: "الفرقة الثانية", committee: "hr", phone: "01123456789", photo: "/assets/images/logo.png", time: "11:12 ص" },
      { studentId: "std-3", studentName: "كريم عبد الرحمن علي", nid: "30503121400333", college: "فنون", year: "الفرقة الأولى", committee: "media", phone: "01234567890", photo: "/assets/images/logo.png", time: "11:20 ص" },
      { studentId: "std-4", studentName: "نورهان طارق يوسف", nid: "30504121400444", college: "بيزنس", year: "الفرقة الثالثة", committee: "pr", phone: "01545678901", photo: "/assets/images/logo.png", time: "11:35 ص" }
    ]
  },
  {
    id: "ev-init-2",
    title: "إفطار رمضان الجماعي 2026 — جامعة حلوان الأهلية",
    date: "25/03/2026",
    time: "05:30 م",
    totalAttendees: 3,
    attendees: [
      { studentId: "std-5", studentName: "يوسف خالد مصطفى", nid: "30405121400555", college: "طب بشري", year: "الفرقة الثانية", committee: "oc", phone: "01098765432", photo: "/assets/images/logo.png", time: "05:45 م" },
      { studentId: "std-6", studentName: "منة الله شريف", nid: "30406121400666", college: "علاج طبيعي", year: "الفرقة الأولى", committee: "hr", phone: "01187654321", photo: "/assets/images/logo.png", time: "05:52 م" },
      { studentId: "std-7", studentName: "عمر هاني زكي", nid: "30407121400777", college: "طب أسنان", year: "الفرقة الثانية", committee: "pr", phone: "01276543210", photo: "/assets/images/logo.png", time: "06:05 م" }
    ]
  }
];

const DEFAULT_USERS = [];

function getUsers() {
  const users = getStore("cf_users_v4", null);
  if (!users || !Array.isArray(users)) {
    return [];
  }
  return users.filter(u => u.nid !== '12121212121212');
}
function saveUsers(u) {
  const cleanList = Array.isArray(u) ? u.filter(x => x && x.nid !== '12121212121212') : [];
  setStore("cf_users_v4", cleanList);
}

const COLLEGES = [
  "هندسة",
  "حاسبات",
  "فنون",
  "بيزنس",
  "علوم",
  "علوم صحية",
  "طب أسنان",
  "طب بشري",
  "علاج طبيعي",
  "لغات وترجمة",
  "حقوق"
];

const COMMITTEES_MAP = {
  oc: "التنظيم (OC)",
  hr: "الموارد البشرية (HR)",
  media: "الميديا (Media)",
  pr: "العلاقات العامة (PR)"
};

const YEARS = ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "خريج"];

function getComName(code) {
  if (lang === "en") {
    const enMap = {
      oc: "Operations Committee (OC)",
      hr: "Human Resources (HR)",
      media: "Media Committee",
      pr: "Public Relations (PR)"
    };
    return enMap[code] || code;
  }
  return COMMITTEES_MAP[code] || code;
}

function getCollegeName(c) {
  if (lang === "en") {
    const enColleges = {
      "هندسة": "Faculty of Engineering",
      "حاسبات": "Faculty of Computers & AI",
      "فنون": "Faculty of Applied Arts",
      "بيزنس": "Faculty of Business",
      "علوم": "Faculty of Science",
      "علوم صحية": "Applied Health Sciences",
      "طب أسنان": "Faculty of Dentistry",
      "طب بشري": "Faculty of Medicine",
      "علاج طبيعي": "Faculty of Physical Therapy",
      "لغات وترجمة": "Languages & Translation",
      "حقوق": "Faculty of Law"
    };
    return enColleges[c] || c;
  }
  return c;
}

function getYearName(y) {
  if (lang === "en") {
    const enYears = {
      "الفرقة الأولى": "First Year",
      "الفرقة الثانية": "Second Year",
      "الفرقة الثالثة": "Third Year",
      "الفرقة الرابعة": "Fourth Year",
      "خريج": "Graduate"
    };
    return enYears[y] || y;
  }
  return y;
}

const INIT_SUGS = [];

function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

let loginAttempts = 0;
let lockoutTimer = null;
let lockoutSecondsRemaining = 0;

function maskNid(id) { return id && id.length >= 10 ? id.slice(0, 4) + "******" + id.slice(-4) : id; }
function getScoreBadge(s) {
  if (s >= 8) return `<span class="ebadge high">${s} / 10 (ممتاز)</span>`;
  if (s >= 5) return `<span class="ebadge med">${s} / 10 (جيد)</span>`;
  return `<span class="ebadge low">${s} / 10 (بحاجة لتطوير)</span>`;
}

function portalView() {
  const isAr = lang === "ar";
  const role = localStorage.getItem("cf_role");
  const userId = localStorage.getItem("cf_user_id");
  const users = getUsers();
  const curUser = users.find(u => u.id === userId) || getStore("cf_cur_user", null);

  if ((role === "ADMIN" || role === "SUPER_ADMIN") && curUser) return adminView(curUser, users);
  if (role === "STUDENT" && curUser) return studentView(curUser);

  const isReg = curAuthMode === "register";

  return `<section class="portal-sec"><div class="wrap">
    <div class="portal-card" style="${isReg ? 'max-width:640px' : 'max-width:520px'}">
      <div class="portal-head">
        <div class="pico">${isReg ? '📝' : '🔐'}</div>
        <h1>${isReg ? (isAr ? 'إنشاء حساب جديد بالأسرة' : 'Create Family Account') : S("portal_t")}</h1>
        <p>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</p>
      </div>

      <div class="portal-tabs">
        <button type="button" class="ptab-btn ${!isReg ? 'active' : ''}" id="btn-show-login">🔐 ${isAr ? 'تسجيل الدخول' : 'Sign In'}</button>
        <button type="button" class="ptab-btn ${isReg ? 'active' : ''}" id="btn-show-register">📝 ${isAr ? 'إنشاء حساب جديد' : 'Register Account'}</button>
      </div>

      ${isReg ? registerFormHtml() : loginFormHtml()}
    </div>
  </div></section>`;
}

function loginFormHtml() {
  const isAr = lang === "ar";
  return `
    <div class="portal-note">
      <b>${isAr ? 'تسجيل الدخول الموحد للطلاب والإدارة:' : 'Unified Login for Students & Admins:'}</b><br>
      ${isAr ? 'أدخل رقمك القومي (14 رقماً) وكلمة المرور للدخول لحسابك مباشرة؛ النظام يتعرف على رتبتك وصلاحياتك تلقائياً دون الحاجة لتحديدها.' : 'Enter your 14-digit National ID and password to access your account. The system automatically detects your role.'}
    </div>

    <form class="form" id="unified-login-form">
      <label>${isAr ? 'الرقم القومي (14 رقماً)' : 'National ID (14 digits)'}
        <input name="nid" placeholder="${isAr ? 'أدخل الرقم القومي (14 رقماً)...' : 'Enter your 14-digit National ID...'}" required autocomplete="username">
      </label>
      <label>${isAr ? 'كلمة المرور' : 'Password'}
        <div class="pw-wrap">
          <input name="pw" type="password" placeholder="${isAr ? 'أدخل كلمة المرور الخاصة بك...' : 'Enter your password...'}" required autocomplete="current-password">
          <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
        </div>
      </label>
      <button class="btn big" type="submit" style="width:100%;margin-top:10px">${isAr ? 'تسجيل الدخول' : 'Sign In'}</button>
      <p class="msg" id="login-msg" role="status" aria-live="polite"></p>
    </form>

    <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--bei);font-size:.95rem">
      ${isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"} 
      <button type="button" class="btn ghost sm" id="btn-show-register-sub" style="margin-inline-start:8px;font-size:.85rem;padding:6px 14px">
        ${isAr ? 'إنشاء حساب جديد والانضمام' : 'Register New Account'}
      </button>
    </div>
  `;
}

function registerFormHtml() {
  const isAr = lang === "ar";
  return `
    <div class="portal-note" style="border-color:var(--g)">
      <b>${isAr ? 'انضم للأسرة وأنشئ حسابك الرسمي:' : 'Join the Family & Create Your Official Account:'}</b><br>
      ${isAr ? 'يرجى استيفاء بياناتك بدقة. التسجيل متاح لطلاب الكليات المعتمدة، وسيتم فتح بوابة عضويتك وتفعيل ملفك فوراً.' : 'Please enter your details accurately. Available for approved faculties. Your membership portal will be activated immediately.'}
    </div>

    <form class="form" id="unified-register-form">
      <label>${isAr ? 'الاسم بالكامل (ثلاثي أو رباعي)' : 'Full Name (3 or 4 names)'}
        <input name="fullName" placeholder="${isAr ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'}" required>
      </label>
      <label>${isAr ? 'الرقم القومي (14 رقماً بالضبط)' : 'National ID (Exactly 14 digits)'}
        <input name="nid" pattern="[0-9]{14}" placeholder="${isAr ? 'أدخل 14 رقماً باللغة الإنجليزية...' : 'Enter 14 digits...'}" required>
      </label>

      <div class="form-row">
        <label>${isAr ? 'كلمة المرور (6 أحرف أو أكثر)' : 'Password (6+ characters)'}
          <div class="pw-wrap">
            <input name="pw" type="password" minlength="6" placeholder="${isAr ? 'اختر كلمة مرور قوية...' : 'Choose a strong password...'}" required>
            <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
          </div>
        </label>
        <label>${isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
          <div class="pw-wrap">
            <input name="pwConfirm" type="password" minlength="6" placeholder="${isAr ? 'أعد كتابة كلمة المرور...' : 'Re-enter your password...'}" required>
            <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
          </div>
        </label>
      </div>

      <div class="form-row">
        <label>${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
          <input name="phone" type="tel" placeholder="01XXXXXXXXX" required>
        </label>
        <label>${isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
          <input name="email" type="email" placeholder="student@example.com">
        </label>
      </div>

      <div class="form-row">
        <label>${isAr ? 'الكلية' : 'Faculty'}
          <select name="college" required>
            <option value="">${isAr ? 'اختر كليتك...' : 'Select your faculty...'}</option>
            ${COLLEGES.map(c => `<option value="${c}">${getCollegeName(c)}</option>`).join('')}
          </select>
        </label>
        <label>${isAr ? 'الفرقة الدراسية' : 'Academic Year'}
          <select name="year" required>
            <option value="">${isAr ? 'اختر الفرقة...' : 'Select your year...'}</option>
            ${YEARS.map(y => `<option value="${y}">${getYearName(y)}</option>`).join('')}
          </select>
        </label>
      </div>

      <label>${isAr ? 'اللجنة التي ترغب بالانضمام إليها' : 'Committee You Wish to Join'}
        <select name="com" required>
          <option value="">${isAr ? 'اختر لجنتك (إحدى اللجان الأربع)...' : 'Choose your committee (one of four)...'}</option>
          ${Object.entries(COMMITTEES_MAP).map(([k, v]) => `<option value="${k}">${getComName(k)}</option>`).join('')}
        </select>
      </label>

      <div class="photo-uploader">
        <div class="photo-preview" id="photo-preview-box">👤</div>
        <div>
          <label style="cursor:pointer;font-weight:700;color:var(--c1);display:block;margin-bottom:4px">
            ${isAr ? 'الصورة الشخصية (مطلوبة لملف العضوية)' : 'Profile Photo (Required)'}
          </label>
          <input type="file" id="photo-file-input" accept="image/*" style="font-size:.85rem;border:none;padding:0;min-height:unset">
          <small style="color:var(--c2);display:block;margin-top:4px">
            ${isAr ? 'ستظهر صورتك في بطاقة عضويتك وسجل الحضور.' : 'Your photo will be displayed on your membership card.'}
          </small>
        </div>
      </div>

      <button class="btn big" type="submit" style="width:100%;margin-top:14px">
        ${isAr ? 'إنشاء الحساب والانضمام للأسرة' : 'Register & Join Family'}
      </button>
      <p class="msg" id="reg-msg" role="status" aria-live="polite"></p>
    </form>

    <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--bei);font-size:.95rem">
      ${isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'} 
      <button type="button" class="btn ghost sm" id="btn-show-login-sub" style="margin-inline-start:8px;font-size:.85rem;padding:6px 14px">
        ${isAr ? 'تسجيل الدخول' : 'Sign In'}
      </button>
    </div>
  `;
}


/* >>> MODULE: 04_admin.js <<< */
/**
 * 04_admin.js - Admin Dashboard Views (Power BI, Members Directory, QR Session)
 * Part of HNU Students For Egypt Platform
 */

function renderMobileAttendeeCards(attendees, isAr) {
  if (!attendees || attendees.length === 0) {
    return `<div class="att-mobile-cards" style="padding:18px;text-align:center;color:var(--c2);background:var(--bei);border-radius:14px;font-size:.88rem">${isAr ? 'لم يقم أي طالب بتسجيل الحضور في هذه الفعالية بعد.' : 'No attendees recorded yet.'}</div>`;
  }
  return `
    <div class="att-mobile-cards" style="margin-top:10px">
      ${attendees.map((att, i) => `
        <div style="background:#fff;border:1.5px solid var(--bei);border-radius:14px;padding:12px 14px;box-shadow:0 2px 10px rgba(59,38,22,.04);display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0">
              <button type="button" class="av-zoom-btn" data-photo="${att.photo || '/assets/images/logo.png'}" data-name="${att.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff;flex-shrink:0">
                  <img src="${att.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${att.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                </div>
              </button>
              <div style="min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:.76rem;font-weight:800;color:var(--c1);background:var(--bei);border-radius:999px;padding:1px 7px;flex-shrink:0">${i + 1}</span>
                  <b style="font-size:.92rem;color:var(--c1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${att.studentName}</b>
                </div>
                <div style="font-size:.78rem;color:var(--c2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  ${getCollegeName(att.college || '—')}${att.year ? ' • ' + getYearName(att.year) : ''}
                </div>
              </div>
            </div>
            ${att.phone ? `
              <a href="tel:${att.phone}" class="btn sm" style="padding:6px 12px;min-height:32px;height:32px;border-radius:999px;font-size:.78rem;flex-shrink:0;text-decoration:none" title="اتصال">
                📞 <span style="font-size:.74rem">${isAr ? 'اتصال' : 'Call'}</span>
              </a>
            ` : ''}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:6px;border-top:1px dashed var(--bei);font-size:.76rem;color:var(--c2)">
            <span class="sbadge" style="background:var(--bei);color:var(--c1);font-size:.74rem;padding:2px 8px">${getComName(att.committee)}</span>
            <span>⏰ <code>${att.time || att.scannedAt || '—'}</code></span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function adminView(curUser, rawUsers) {
  const users = (rawUsers || []).filter(u => u && u.nid !== '12121212121212');
  const isAr = lang === "ar";
  const isSuperAdmin = curUser && (curUser.role === 'SUPER_ADMIN' || curUser.isSuperAdmin === true);
  const sugs = getStore("cf_sugs", INIT_SUGS);
  const galleryItems = getGalleryItems();
  const activeQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
  const deletedArchiveIds = getStore("cf_deleted_archive_ids", []);
  const rawArchive = getStore("cf_events_archive", null);
  const eventsArchive = (Array.isArray(rawArchive) ? rawArchive : INIT_EVENTS_ARCHIVE).filter(e => !deletedArchiveIds.includes(e.id));
  const evaluableMembers = users.filter(u => u.role !== "ADMIN" && u.role !== "SUPER_ADMIN");
  const filteredStudents = users.filter(s => !studentSearchQuery || s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || s.college.includes(studentSearchQuery) || (s.com && s.com.includes(studentSearchQuery)));
  const filteredEvalMembers = evaluableMembers.filter(s => !evalSearchQuery || s.name.toLowerCase().includes(evalSearchQuery.toLowerCase()) || (s.nid && s.nid.includes(evalSearchQuery)) || (s.college && s.college.includes(evalSearchQuery)));
  const selectedMember = evaluableMembers.find(s => s.id === selectedEvalStudentId) || filteredEvalMembers[0] || evaluableMembers[0];
  const attendances = getStore("cf_attendance", []);
  const activeEventAttendees = attendances.filter(a => a.event === activeQr.title);

  return `<div class="admin-wrap">
    <div class="admin-bar">
      <div class="admin-bar-user">
        <button type="button" class="av-zoom-btn" data-photo="${curUser.photo || '/assets/images/logo.png'}" data-name="${curUser.name}" title="${isAr ? 'عرض صورتك الشخصية' : 'View profile photo'}">
          <div class="admin-av">
            <img src="${curUser.photo || '/assets/images/logo.png'}" alt="${curUser.name}" onerror="this.onerror=null;this.parentElement.textContent='👑'">
          </div>
        </button>
        <div>
          <h2>${curUser.name}</h2>
          <p>${curUser.title} — ${getCollegeName(curUser.college)}</p>
        </div>
      </div>
      <div class="admin-bar-actions">
        <button type="button" class="btn sm" id="logout-btn" style="height:38px;padding:0 18px;font-size:.85rem;background:#C8102E;color:#fff;border-color:transparent;font-weight:700">🚪 ${isAr ? 'تسجيل الخروج' : 'Logout'}</button>
      </div>
    </div>

    <div class="admin-subnav">
      <button type="button" class="asub-btn ${curAtab === 'overview' ? 'active' : ''}" data-atab="overview">📊 ${isAr ? 'الإحصائيات العامة' : 'General Stats'}</button>
      <button type="button" class="asub-btn ${curAtab === 'students' ? 'active' : ''}" data-atab="students">👥 ${isAr ? 'إدارة الأعضاء والطلاب' : 'Members Directory'} (${users.length})</button>
      <button type="button" class="asub-btn ${curAtab === 'evals' ? 'active' : ''}" data-atab="evals">⭐ ${isAr ? 'نظام تقييم الأداء' : 'Evaluations'} (${evaluableMembers.length})</button>
      <button type="button" class="asub-btn ${curAtab === 'qr' ? 'active' : ''}" data-atab="qr">📱 ${isAr ? 'نظام الـ QR والحضور' : 'QR Attendance'} ${activeQr.active ? '🟢' : ''}</button>
      <button type="button" class="asub-btn ${curAtab === 'sugs' ? 'active' : ''}" data-atab="sugs">💡 ${isAr ? 'صندوق الاقتراحات' : 'Suggestions'} (${sugs.filter(x => !x.done).length})</button>
      ${isSuperAdmin ? `
        <button type="button" class="asub-btn ${curAtab === 'gallery' ? 'active' : ''}" data-atab="gallery">🖼️ ${isAr ? 'إدارة الميديا والمعرض' : 'Media Gallery'} (${galleryItems.length})</button>
      ` : ''}
    </div>

    ${curAtab === 'overview' ? (() => {
      // --- Computed analytics data ---
      const totalMembers = users.length;
      const memberOnly = users.filter(u => u.role === 'STUDENT');
      const highPerf = memberOnly.filter(u => (u.score||0) >= 8).length;
      const medPerf  = memberOnly.filter(u => (u.score||0) >= 5 && (u.score||0) < 8).length;
      const lowPerf  = memberOnly.filter(u => (u.score||0) < 5).length;
      const avgScore = memberOnly.length ? (memberOnly.reduce((a,u)=>a+(u.score||0),0)/memberOnly.length).toFixed(1) : '—';
      const totalEvents = eventsArchive.length + (activeQr.active ? 1 : 0);

      // Committee breakdown
      const comBreakdown = Object.entries(COMMITTEES_MAP).map(([k,v]) => ({
        key: k, label: v.split(' ')[0],
        count: users.filter(u=>u.com===k).length,
        score: users.filter(u=>u.com===k&&u.role==='STUDENT').length ?
          (users.filter(u=>u.com===k&&u.role==='STUDENT').reduce((a,u)=>a+(u.score||0),0)/users.filter(u=>u.com===k&&u.role==='STUDENT').length).toFixed(1) : '0'
      }));
      const maxComCount = Math.max(...comBreakdown.map(c=>c.count), 1);

      // College breakdown
      const colBreakdown = COLLEGES.map(c => ({
        name: c, count: users.filter(u=>u.college===c).length
      })).filter(c=>c.count>0).sort((a,b)=>b.count-a.count).slice(0,6);
      const maxColCount = Math.max(...colBreakdown.map(c=>c.count), 1);

      // Year breakdown
      const yearBreakdown = YEARS.map(y => ({
        name: y.replace('الفرقة ',''), count: users.filter(u=>u.year===y).length
      })).filter(y=>y.count>0);

      // Top performers
      const topMembers = [...memberOnly].sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,3);
      const attendedIds = new Set(attendances.map(a=>a.studentId||a.user_id));
      const topAttendees = memberOnly.filter(u=>attendedIds.has(u.id)).length;

      return `
      <div class="dash-stats">
        <div class="dstat"><div class="dstat-val">${totalMembers}</div><div class="dstat-lbl">${isAr?'إجمالي الأعضاء المسجلين':'Total Registered Members'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:#137333">${highPerf}</div><div class="dstat-lbl">${isAr?'أعضاء ممتازون (8+/10)':'High Performers (8+/10)'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:var(--g2)">${avgScore}</div><div class="dstat-lbl">${isAr?'متوسط تقييم الأداء العام':'Average Performance Score'}</div></div>
        <div class="dstat"><div class="dstat-val">${attendances.length}</div><div class="dstat-lbl">${isAr?'تسجيلات حضور بالـ QR':'QR Attendance Records'}</div></div>
        <div class="dstat"><div class="dstat-val">${totalEvents}</div><div class="dstat-lbl">${isAr?'إجمالي الفعاليات المسجلة':'Total Events Recorded'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:${activeQr.active?'#137333':'var(--c2)'}">${activeQr.active?(isAr?'نشطة':'Active'):(isAr?'متوقفة':'Inactive')}</div><div class="dstat-lbl">${isAr?'حالة جلسة الحضور الحالية':'Current QR Session Status'}</div></div>
      </div>

      <!-- BI Grid Row 1: Committee Distribution + Score Distribution -->
      <div class="bi-grid">
        <div class="bi-card">
          <div class="bi-card-head">
            <h4>📊 ${isAr?'توزيع الأعضاء على اللجان':'Members per Committee'}</h4>
            <span class="sbadge act">${users.length} ${isAr?'عضو':'Members'}</span>
          </div>
          <div class="bi-bars-list">
            ${comBreakdown.map(c=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span>${c.label}</span>
                  <span style="color:var(--g2)">${c.count} ${isAr?'عضو':'members'} • متوسط ${c.score}/10</span>
                </div>
                <div class="bi-bar-track">
                  <div class="bi-bar-fill" style="width:${c.count?Math.round(c.count/maxComCount*100):0}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🎯 ${isAr?'توزيع مستويات الأداء':'Performance Tier Distribution'}</h4>
            <span class="sbadge pen">${memberOnly.length} ${isAr?'عضو قابل للتقييم':'Evaluable'}</span>
          </div>
          <div class="bi-bars-list" style="margin-bottom:18px">
            ${[
              {label: isAr?'ممتاز (8-10)':'Excellent (8-10)', count: highPerf, color:'#137333', bg:'#e6f4ea'},
              {label: isAr?'جيد (5-7.9)':'Good (5-7.9)', count: medPerf, color:'#b45309', bg:'#fef7e0'},
              {label: isAr?'يحتاج دعم (0-4.9)':'Needs Support (0-4.9)', count: lowPerf, color:'#c5221f', bg:'#fce8e6'}
            ].map(t=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span style="color:${t.color};font-weight:800">${t.label}</span>
                  <span>${t.count} ${isAr?'عضو':'members'} (${memberOnly.length?Math.round(t.count/memberOnly.length*100):0}%)</span>
                </div>
                <div class="bi-bar-track" style="height:14px">
                  <div class="bi-bar-fill" style="width:${memberOnly.length?Math.round(t.count/memberOnly.length*100):0}%;background:${t.color}"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <!-- Mini donut-style visual -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
            ${[
              {label:isAr?'ممتاز':'Excellent', pct: memberOnly.length?Math.round(highPerf/memberOnly.length*100):0, color:'#137333'},
              {label:isAr?'جيد':'Good', pct: memberOnly.length?Math.round(medPerf/memberOnly.length*100):0, color:'#F59E0B'},
              {label:isAr?'يحتاج دعم':'Needs Support', pct: memberOnly.length?Math.round(lowPerf/memberOnly.length*100):0, color:'#c5221f'}
            ].map(t=>`
              <div style="flex:1;min-width:80px;background:#F9F7F4;border-radius:12px;padding:10px;text-align:center;border:2px solid ${t.color}20">
                <div style="font-size:1.5rem;font-weight:900;color:${t.color}">${t.pct}%</div>
                <div style="font-size:.72rem;color:var(--c2);font-weight:700;margin-top:2px">${t.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- BI Grid Row 2: College + Year breakdown -->
      <div class="bi-grid">
        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🏛️ ${isAr?'توزيع الأعضاء على الكليات (Top 6)':'Members by Faculty (Top 6)'}</h4>
          </div>
          <div class="bi-bars-list">
            ${colBreakdown.map((c,i)=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span style="font-size:.82rem">${c.name}</span>
                  <span style="color:var(--g2)">${c.count}</span>
                </div>
                <div class="bi-bar-track">
                  <div class="bi-bar-fill" style="width:${Math.round(c.count/maxColCount*100)}%;background:hsl(${30+i*25},70%,${40+i*5}%)"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🎓 ${isAr?'توزيع الأعضاء على الفرق الدراسية':'Members by Academic Year'}</h4>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px">
            ${yearBreakdown.map((y,i)=>`
              <div style="background:#F9F7F4;border-radius:14px;padding:12px;text-align:center;border:2px solid var(--bei)">
                <div style="font-size:1.6rem;font-weight:900;color:var(--c1)">${y.count}</div>
                <div style="font-size:.72rem;color:var(--c2);font-weight:700;margin-top:2px">${y.name}</div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:20px;border-top:1px solid var(--bei);padding-top:14px">
            <h4 style="color:var(--c1);font-size:.95rem;margin-bottom:10px">📅 ${isAr?'الحضور في الفعاليات':'Events Attendance'}</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div style="background:var(--bei);border-radius:12px;padding:12px;text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:var(--c1)">${eventsArchive.length}</div>
                <div style="font-size:.75rem;color:var(--c2);font-weight:700">${isAr?'فعاليات مؤرشفة':'Archived Events'}</div>
              </div>
              <div style="background:var(--bei);border-radius:12px;padding:12px;text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:${activeQr.active?'#137333':'var(--c2)'}">${activeQr.active?'1':'0'}</div>
                <div style="font-size:.75rem;color:var(--c2);font-weight:700">${isAr?'جلسة نشطة الآن':'Active Session'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Podium: Top 3 Performers -->
      ${topMembers.length >= 1 ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>🏆 ${isAr?'لوحة شرف أفضل المتميزين':'Honor Board — Top Performers'}</h3>
          <span class="sbadge act">${isAr?'مرتب تنازلياً بالتقييم':'Sorted by Score'}</span>
        </div>
        <div class="bi-podium">
          ${topMembers[1] ? `
          <div class="bi-podium-step second">
            <div style="font-size:.75rem;color:#64748B;font-weight:700;margin-bottom:6px">2nd</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[1].photo||'/assets/images/logo.png'}" data-name="${topMembers[1].name}">
              <div style="width:56px;height:56px;border-radius:50%;overflow:hidden;border:3px solid #94A3B8;background:#fff;margin-bottom:8px">
                <img src="${topMembers[1].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥈</div>
            <div style="font-weight:800;color:var(--c1);font-size:.88rem;text-align:center;max-width:120px;word-break:break-word">${topMembers[1].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[1].com)}</div>
            <div style="font-size:1.3rem;font-weight:900;color:#64748B;margin-top:6px">${topMembers[1].score||0}/10</div>
          </div>` : '<div></div>'}

          ${topMembers[0] ? `
          <div class="bi-podium-step first">
            <div style="font-size:.75rem;color:#F59E0B;font-weight:800;margin-bottom:6px">1st ⭐</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[0].photo||'/assets/images/logo.png'}" data-name="${topMembers[0].name}">
              <div style="width:70px;height:70px;border-radius:50%;overflow:hidden;border:3.5px solid #F59E0B;background:#fff;margin-bottom:8px;box-shadow:0 0 0 4px rgba(245,158,11,.2)">
                <img src="${topMembers[0].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥇</div>
            <div style="font-weight:900;color:var(--c1);font-size:.95rem;text-align:center;max-width:130px;word-break:break-word">${topMembers[0].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[0].com)}</div>
            <div style="font-size:1.6rem;font-weight:900;color:#F59E0B;margin-top:6px">${topMembers[0].score||0}/10</div>
          </div>` : '<div></div>'}

          ${topMembers[2] ? `
          <div class="bi-podium-step third">
            <div style="font-size:.75rem;color:#B45309;font-weight:700;margin-bottom:6px">3rd</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[2].photo||'/assets/images/logo.png'}" data-name="${topMembers[2].name}">
              <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:3px solid #B45309;background:#fff;margin-bottom:8px">
                <img src="${topMembers[2].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥉</div>
            <div style="font-weight:800;color:var(--c1);font-size:.88rem;text-align:center;max-width:120px;word-break:break-word">${topMembers[2].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[2].com)}</div>
            <div style="font-size:1.3rem;font-weight:900;color:#B45309;margin-top:6px">${topMembers[2].score||0}/10</div>
          </div>` : '<div></div>'}
        </div>
      </div>
      ` : ''}
    `})() : ''}

    ${curAtab === 'students' ? (() => {
      // -- Sort & filter logic --
      let displayList = [...users];

      // Filter by committee
      if (memberFilterCom !== 'all') displayList = displayList.filter(s => s.com === memberFilterCom);
      // Filter by college
      if (memberFilterCollege !== 'all') displayList = displayList.filter(s => s.college === memberFilterCollege);
      // Filter by tier
      if (memberFilterTier === 'high') displayList = displayList.filter(s => (s.score||0) >= 8);
      else if (memberFilterTier === 'med') displayList = displayList.filter(s => (s.score||0) >= 5 && (s.score||0) < 8);
      else if (memberFilterTier === 'low') displayList = displayList.filter(s => s.role === 'STUDENT' && (s.score||0) < 5);
      else if (memberFilterTier === 'admins') displayList = displayList.filter(s => s.role === 'ADMIN' || s.role === 'SUPER_ADMIN');

      // Search
      if (studentSearchQuery) displayList = displayList.filter(s =>
        s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        (s.college && s.college.includes(studentSearchQuery)) ||
        (s.com && s.com.includes(studentSearchQuery)) ||
        (s.nid && s.nid.includes(studentSearchQuery))
      );

      // Sort
      if (memberSortBy === 'score_desc') displayList.sort((a,b)=>(b.score||0)-(a.score||0));
      else if (memberSortBy === 'score_asc') displayList.sort((a,b)=>(a.score||0)-(b.score||0));
      else if (memberSortBy === 'name_asc') displayList.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
      else if (memberSortBy === 'name_desc') displayList.sort((a,b)=>b.name.localeCompare(a.name,'ar'));
      else if (memberSortBy === 'newest') displayList.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
      else if (memberSortBy === 'oldest') displayList.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0));

      const renderMemberRow = (s, idx) => `
        <tr>
          <td>${idx+1}</td>
          <td>
            <button type="button" class="av-zoom-btn" data-photo="${s.photo||'/assets/images/logo.png'}" data-name="${s.name}" style="background:none;border:none;cursor:pointer;padding:0">
              <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff;transition:transform .15s" title="${isAr?'اضغط لعرض الصورة':'Click to view photo'}">
                <img src="${s.photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
          </td>
          <td><b>${s.name}</b></td>
          <td><code>${maskNid(s.nid)}</code></td>
          <td>${getCollegeName(s.college)}</td>
          <td>${getYearName(s.year)}</td>
          <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(s.com)}</span></td>
          <td><span class="sbadge ${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'act':'pen'}">${s.role==='SUPER_ADMIN'?(isAr?'المشرف العام 👑':'Super Admin'):(s.role==='ADMIN'?(isAr?'أدمن':'Admin'):(isAr?'عضو':'Member'))}</span></td>
          <td>${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'—':getScoreBadge(s.score||0)}</td>
          <td style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm" data-eval-std="${s.id}" style="padding:4px 8px;font-size:.78rem">${isAr?'تقييم':'Evaluate'}</button>`:''}
            ${isSuperAdmin&&s.id!==curUser.id&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm ghost" data-toggle-admin="${s.id}" style="padding:4px 8px;font-size:.78rem;border-color:var(--g)">${s.role==='ADMIN'?(isAr?'سحب الأدمن':'Demote'):(isAr?'تعيين أدمن 👑':'Make Admin')}</button>`:(s.id===curUser.id?`<span style="font-size:.78rem;color:var(--g2);font-weight:700">${isAr?'حسابك':'You'}</span>`:'')}
            ${isSuperAdmin&&s.role!=='SUPER_ADMIN'&&s.id!==curUser.id?`<button type="button" class="btn sm ghost" data-delete-student="${s.id}" data-student-name="${s.name}" data-student-nid="${s.nid}" style="padding:4px 8px;font-size:.78rem;color:var(--red);border-color:var(--red)">🗑️</button>`:''}
          </td>
        </tr>`;

      const renderMemberCard = (s, idx) => `
        <div class="member-card">
          <div class="member-card-header">
            <button type="button" class="av-zoom-btn" data-photo="${s.photo||'/assets/images/logo.png'}" data-name="${s.name}">
              <div style="width:56px;height:56px;border-radius:50%;overflow:hidden;border:2.5px solid var(--g);background:#fff;flex-shrink:0">
                <img src="${s.photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div style="flex:1;min-width:0">
              <div style="font-weight:800;color:var(--c1);font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
              <div style="font-size:.78rem;color:var(--c2);margin-top:2px">${getCollegeName(s.college)} — ${getYearName(s.year)}</div>
              <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;align-items:center">
                <span class="sbadge" style="background:var(--bei);color:var(--c1);font-size:.72rem">${getComName(s.com)}</span>
                <span class="sbadge ${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'act':'pen'}" style="font-size:.72rem">${s.role==='SUPER_ADMIN'?'Super Admin 👑':(s.role==='ADMIN'?'Admin':'Member')}</span>
              </div>
            </div>
          </div>
          <div class="member-card-body">
            <div style="display:flex;justify-content:space-between;font-size:.78rem">
              <span><b>${isAr?'الرقم القومي:':'NID:'}</b> <code>${maskNid(s.nid)}</code></span>
              ${s.phone?`<span><b>${isAr?'الهاتف:':'Phone:'}</b> ${s.phone}</span>`:''}
            </div>
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<div style="margin-top:8px">${getScoreBadge(s.score||0)}</div>`:''}
            ${s.notes?`<div style="font-size:.78rem;color:var(--c2);background:var(--bei);border-radius:8px;padding:6px 10px;margin-top:6px;line-height:1.5;white-space:normal"><b>💬 ${isAr?'ملاحظات:':'Notes:'}</b> ${s.notes.slice(0,80)}${s.notes.length>80?'...':''}</div>`:''}
          </div>
          <div class="member-card-actions">
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm" data-eval-std="${s.id}" style="padding:4px 12px;font-size:.78rem">${isAr?'تقييم':'Evaluate'}</button>`:''}
            ${isSuperAdmin&&s.id!==curUser.id&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm ghost" data-toggle-admin="${s.id}" style="padding:4px 10px;font-size:.78rem;border-color:var(--g)">${s.role==='ADMIN'?(isAr?'سحب الأدمن':'Demote'):(isAr?'تعيين أدمن 👑':'Make Admin')}</button>`:''}
            ${isSuperAdmin&&s.role!=='SUPER_ADMIN'&&s.id!==curUser.id?`<button type="button" class="btn sm ghost" data-delete-student="${s.id}" data-student-name="${s.name}" data-student-nid="${s.nid}" style="padding:4px 8px;font-size:.78rem;color:var(--red);border-color:var(--red)">🗑️</button>`:''}
          </div>
        </div>`;

      return `
      <div class="admin-card">
        <!-- Toolbar -->
        <div class="dir-toolbar">
          <div class="dir-filters">
            <input type="search" class="search-inp" id="student-search" placeholder="${isAr?'بحث بالاسم أو الكلية أو اللجنة...':'Search...'}" value="${studentSearchQuery}" style="min-width:200px">
            <select class="dir-select" id="dir-sort-select">
              <option value="score_desc" ${memberSortBy==='score_desc'?'selected':''}>⬇ ${isAr?'التقييم الأعلى':'Highest Score'}</option>
              <option value="score_asc" ${memberSortBy==='score_asc'?'selected':''}>⬆ ${isAr?'التقييم الأدنى':'Lowest Score'}</option>
              <option value="name_asc" ${memberSortBy==='name_asc'?'selected':''}>أ—ي ${isAr?'الاسم (أبجدي)':'Name A-Z'}</option>
              <option value="name_desc" ${memberSortBy==='name_desc'?'selected':''}>ي—أ ${isAr?'الاسم (عكسي)':'Name Z-A'}</option>
              <option value="newest" ${memberSortBy==='newest'?'selected':''}>🆕 ${isAr?'الأحدث تسجيلاً':'Newest First'}</option>
              <option value="oldest" ${memberSortBy==='oldest'?'selected':''}>📅 ${isAr?'الأقدم تسجيلاً':'Oldest First'}</option>
            </select>
            <select class="dir-select" id="dir-com-filter">
              <option value="all" ${memberFilterCom==='all'?'selected':''}>🏢 ${isAr?'كل اللجان':'All Committees'}</option>
              ${Object.entries(COMMITTEES_MAP).map(([k,v])=>`<option value="${k}" ${memberFilterCom===k?'selected':''}>${v.split(' ')[0]}</option>`).join('')}
            </select>
            <select class="dir-select" id="dir-tier-filter">
              <option value="all" ${memberFilterTier==='all'?'selected':''}>🎯 ${isAr?'كل المستويات':'All Tiers'}</option>
              <option value="high" ${memberFilterTier==='high'?'selected':''}>🟢 ${isAr?'ممتاز (8+)':'Excellent (8+)'}</option>
              <option value="med" ${memberFilterTier==='med'?'selected':''}>🟡 ${isAr?'جيد (5-7.9)':'Good (5-7.9)'}</option>
              <option value="low" ${memberFilterTier==='low'?'selected':''}>🔴 ${isAr?'يحتاج دعم (<5)':'Needs Support (<5)'}</option>
              <option value="admins" ${memberFilterTier==='admins'?'selected':''}>👑 ${isAr?'الأدمن فقط':'Admins Only'}</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:.82rem;color:var(--c2);font-weight:700">${displayList.length} / ${users.length}</span>
            <div class="view-switcher">
              <button type="button" class="view-btn ${memberViewMode==='table'?'active':''}" data-view-mode="table">☰ ${isAr?'جدول':'Table'}</button>
              <button type="button" class="view-btn ${memberViewMode==='cards'?'active':''}" data-view-mode="cards">⊞ ${isAr?'بطاقات':'Cards'}</button>
            </div>
            <button type="button" class="btn sm" id="btn-sync-cloud-now" style="padding:6px 14px;font-size:.82rem;background:#22c55e;border-color:#22c55e;color:#fff">🔄</button>
            <button type="button" class="btn sm" id="btn-export-students-csv" style="padding:6px 14px;font-size:.82rem">📥 CSV</button>
            <button type="button" class="btn sm ghost" id="btn-print-students" style="padding:6px 14px;font-size:.82rem">🖨️</button>
          </div>
        </div>

        ${memberViewMode === 'table' ? `
        <div class="tbl-wrap">
          <table class="atbl">
            <thead>
              <tr>
                <th>#</th>
                <th>${isAr?'الصورة':'Photo'}</th>
                <th>${isAr?'الاسم':'Name'}</th>
                <th>${isAr?'الرقم القومي':'NID'}</th>
                <th>${isAr?'الكلية':'Faculty'}</th>
                <th>${isAr?'الفرقة':'Year'}</th>
                <th>${isAr?'اللجنة':'Committee'}</th>
                <th>${isAr?'الصلاحية':'Role'}</th>
                <th>${isAr?'التقييم':'Score'}</th>
                <th>${isAr?'إجراءات':'Actions'}</th>
              </tr>
            </thead>
            <tbody>${displayList.map((s,i)=>renderMemberRow(s,i)).join('')}</tbody>
          </table>
        </div>
        ` : `
        <div class="members-cards-grid">
          ${displayList.map((s,i)=>renderMemberCard(s,i)).join('')}
        </div>
        `}
      </div>`;
    })() : ''}

    ${curAtab === 'evals' ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <div>
            <h3>⭐ ${isAr ? 'نظام تقييم أداء الأعضاء والطلاب' : 'Member Performance Evaluation System'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'التقييم متاح للأعضاء فقط (المشرفون والإدارة غير متاح تقييمهم حفاظاً على الصلاحيات).' : 'Evaluations are strictly for members. Admins are excluded.'}
            </p>
          </div>
          <span class="sbadge act">${evaluableMembers.length} ${isAr ? 'عضو مؤهل للتقييم' : 'Evaluable Members'}</span>
        </div>

        <!-- Search Bar by Name or National ID -->
        <div style="background:var(--bei);padding:14px 18px;border-radius:16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <label style="display:block;font-size:.85rem;font-weight:700;color:var(--c1);margin-bottom:4px">
              🔍 ${isAr ? 'ابحث عن العضو بالاسم أو الرقم القومي (14 رقماً):' : 'Search Member by Name or National ID:'}
            </label>
            <input type="search" class="search-inp" id="eval-search-inp" placeholder="${isAr ? 'اكتب اسم العضو أو الرقم القومي...' : 'Type member name or National ID...'}" value="${evalSearchQuery}" style="width:100%;background:#fff;border-color:var(--g)">
          </div>
          ${evalSearchQuery ? `
            <button type="button" class="btn sm ghost" id="btn-clear-eval-search" style="margin-top:18px;font-size:.8rem;padding:6px 14px">
              ✕ ${isAr ? 'مسح البحث' : 'Clear'}
            </button>
          ` : ''}
        </div>

        ${selectedMember ? `
          <!-- Active Evaluation Card -->
          <div style="background:#fff;border:2px solid var(--g);border-radius:20px;padding:22px;box-shadow:var(--sh);margin-bottom:24px">
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-bottom:1.5px solid var(--bei);padding-bottom:16px;margin-bottom:18px">
              <button type="button" class="av-zoom-btn" data-photo="${selectedMember.photo || '/assets/images/logo.png'}" data-name="${selectedMember.name}" title="${isAr ? 'اضغط لتكبير صورة العضو' : 'Click to view photo'}" style="flex-shrink:0">
                <div class="admin-av" style="width:64px;height:64px">
                  <img src="${selectedMember.photo || '/assets/images/logo.png'}" alt="${selectedMember.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                </div>
              </button>
              <div style="flex:1;min-width:200px">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                  <h3 style="color:var(--c1);margin:0;font-size:1.25rem">${selectedMember.name}</h3>
                  ${getScoreBadge(selectedMember.score !== undefined ? selectedMember.score : 0)}
                </div>
                <p style="color:var(--c2);font-size:.88rem;margin:4px 0 0">
                  🆔 <code>${selectedMember.nid}</code> • 🏛️ ${getCollegeName(selectedMember.college)} — ${getYearName(selectedMember.year)} • 📌 ${getComName(selectedMember.com)}
                </p>
                ${selectedMember.phone ? `<p style="font-size:.82rem;color:var(--g2);font-weight:700;margin:2px 0 0" dir="ltr">📞 ${selectedMember.phone}</p>` : ''}
              </div>
            </div>

            <form class="form" id="new-eval-form" style="max-width:680px">
              <input type="hidden" name="studentId" value="${selectedMember.id}">
              <div class="form-row">
                <label>${isAr ? 'درجة التقييم الحالية (من 0 إلى 10)' : 'Evaluation Score (0 to 10)'}
                  <input name="score" type="number" min="0" max="10" step="0.1" value="${selectedMember.score !== undefined ? selectedMember.score : 9.0}" required style="font-weight:800;font-size:1.15rem;color:var(--c1)">
                </label>
                <div style="display:flex;flex-direction:column;justify-content:center;font-size:.82rem;color:var(--c2);line-height:1.5;background:var(--bei);padding:10px 14px;border-radius:12px">
                  <span>🟢 8.0 - 10: ممتاز (High Performer)</span>
                  <span>🟡 5.0 - 7.9: جيد ومقبول (Good)</span>
                  <span>🔴 0 - 4.9: بحاجة لتطوير ومتابعة (Needs Support)</span>
                </div>
              </div>

              <label>${isAr ? 'ملاحظات الأداء وتوجيهات التطوير' : 'Performance Notes & Feedback'}
                <textarea name="notes" rows="3" placeholder="${isAr ? 'مستوى الالتزام، التفاعل في المهام، وروح الفريق...' : 'Commitment level, task execution, team spirit...'}">${selectedMember.notes || ''}</textarea>
              </label>

              <button class="btn btn-success" type="submit" style="min-height:44px;padding:10px 28px;font-size:.92rem;justify-self:start">
                💾 ${isAr ? `حفظ وتحديث تقييم (${selectedMember.name})` : 'Save Evaluation'}
              </button>
              <p class="msg" id="eval-msg" role="status" aria-live="polite"></p>
            </form>
          </div>
        ` : `
          <div style="padding:28px;text-align:center;color:var(--c2);background:var(--bei);border-radius:16px;margin-bottom:20px">
            ${isAr ? 'لا يوجد أعضاء مطابقين للبحث الحالي.' : 'No members found matching your search.'}
          </div>
        `}

        <!-- Members Grid with Photo Avatars -->
        <div>
          <h4 style="color:var(--c1);margin-bottom:12px;font-size:1.05rem">
            👥 ${isAr ? 'اختر عضواً من القائمة للتقييم:' : 'Select Member from Directory:'} (${filteredEvalMembers.length})
          </h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
            ${filteredEvalMembers.map(s => `
              <div class="eval-member-card" data-select-eval-std="${s.id}" style="display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid ${s.id === (selectedMember && selectedMember.id) ? 'var(--g)' : 'var(--bei)'};border-radius:14px;padding:12px;cursor:pointer;transition:.2s;box-shadow:${s.id === (selectedMember && selectedMember.id) ? '0 0 12px rgba(242,168,29,.35)' : 'none'}">
                <button type="button" class="av-zoom-btn" data-photo="${s.photo || '/assets/images/logo.png'}" data-name="${s.name}" title="${isAr ? 'اضغط لتكبير صورة العضو' : 'Click to view photo'}" style="flex-shrink:0">
                  <div style="width:46px;height:46px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff">
                    <img src="${s.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                  </div>
                </button>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:700;color:var(--c1);font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
                  <div style="font-size:.78rem;color:var(--c2)"><code>${s.nid}</code></div>
                  <div style="font-size:.78rem;color:var(--g2);font-weight:600">${getCollegeName(s.college)} • ${getComName(s.com)}</div>
                </div>
                <div>
                  ${getScoreBadge(s.score !== undefined ? s.score : 0)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${curAtab === 'qr' ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <div>
            <h3>📱 ${isAr ? 'نظام الحضور ورفع كود الـ QR' : 'QR Attendance System'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'رفع وتفعيل كود الـ QR للفعاليات، وحفظ أرشيف الحضور فور إنهاء الفعالية.' : 'Publish event QR codes and manage attendance archives.'}
            </p>
          </div>
          <span class="sbadge ${activeQr.active ? 'act' : 'pen'}">
            ${activeQr.active ? (isAr ? '● الفعالية والـ QR نشط حالياً للطلاب' : '● Live Event QR Active') : (isAr ? '○ لا توجد فعالية نشطة حالياً' : '○ No Active Event')}
          </span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:start">
          <div style="background:var(--bei);padding:22px;border-radius:18px;border:2px dashed var(--g2)">
            <h4 style="color:var(--c1);margin-bottom:12px">${isAr ? 'بدء جلسة حضور جديدة' : 'Start New Attendance Session'}</h4>
            <form class="form" id="admin-upload-qr-form">
              <label>${isAr ? 'عنوان الاجتماع / الفعالية' : 'Meeting / Event Title'}
                <input name="eventTitle" placeholder="${isAr ? 'مثال: اجتماع أكتوبر 2026' : 'e.g. October Meeting 2026'}" required value="${activeQr.title || ''}">
              </label>
              <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
                <button class="btn btn-success" type="submit" style="flex:1">${activeQr.active ? (isAr ? '🔄 تحديث عنوان الجلسة' : '🔄 Update Session') : (isAr ? '🚀 بدء جلسة الحضور' : '🚀 Start Attendance Session')}</button>
                ${activeQr.active ? `
                  <button type="button" class="btn btn-danger" id="btn-stop-qr" style="flex:1">${isAr ? 'إنهاء الجلسة 🛑' : 'End Session 🛑'}</button>
                ` : ''}
              </div>
              <p class="msg" id="admin-qr-msg" role="status" aria-live="polite"></p>
            </form>
            ${activeQr.active ? `
              <div style="margin-top:18px;border-top:1.5px solid var(--g);padding-top:16px">
                <h4 style="color:var(--c1);margin-bottom:8px">📷 ${isAr ? 'مسح QR الأعضاء بالكاميرا' : 'Scan Member QR Codes'}</h4>
                <p style="font-size:.83rem;color:var(--c2);margin-bottom:10px">${isAr ? 'اضغط لفتح الكاميرا ووجّهها نحو QR العضو لتسجيل حضوره فوراً.' : 'Open camera and point at each member\'s personal QR to record attendance.'}</p>
                <button type="button" class="btn btn-success" id="btn-open-qr-scanner" style="width:100%;margin-bottom:8px">📷 ${isAr ? 'فتح الكاميرا للمسح' : 'Open Camera to Scan'}</button>
                <div id="qr-scanner-wrap" style="display:none;border-radius:14px;overflow:hidden;position:relative;background:#000;aspect-ratio:4/3;margin-top:10px">
                  <video id="qr-video" style="width:100%;height:100%;object-fit:cover" playsinline muted autoplay></video>
                  <canvas id="qr-canvas" style="display:none"></canvas>
                  <div style="position:absolute;inset:0;pointer-events:none">
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:170px;height:170px;border:3px solid #22c55e;border-radius:12px;box-shadow:0 0 0 9999px rgba(0,0,0,.45)"></div>
                  </div>
                  <button type="button" id="btn-close-qr-scanner" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:.82rem;cursor:pointer">✕ ${isAr ? 'إغلاق' : 'Close'}</button>
                  <div id="qr-scan-status" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:5px 14px;border-radius:999px;font-size:.82rem;font-weight:700;white-space:nowrap;max-width:90%"></div>
                </div>
                <p class="msg" id="admin-scan-msg" role="status" aria-live="polite" style="margin-top:8px"></p>
              </div>
            ` : ''}
          </div>

          <div>
            ${activeQr.active ? `
              <div class="qr-active-banner">
                <h4 style="color:var(--c1);margin-bottom:6px">🟢 ${isAr ? 'جلسة الحضور النشطة الآن:' : 'Currently Active Session:'}</h4>
                <p style="font-weight:700;color:var(--g2);font-size:1.05rem">${activeQr.title}</p>
                <p style="font-size:.83rem;color:var(--c2);margin-top:6px;line-height:1.5">📌 ${isAr ? 'كل عضو يرى QR خاص بيانات في بوابته. وجّه الكاميرا أعلاه نحو QR العضو لتسجيل حضوره.' : 'Each member sees their own personal QR in their portal. Scan it with the camera above to record attendance.'}</p>
                <p style="font-size:.8rem;color:var(--c2);margin-top:4px">${isAr ? 'بدأت: ' + (activeQr.createdAt || 'الآن') : 'Started: ' + (activeQr.createdAt || 'Now')}</p>
                <button type="button" class="btn btn-danger sm" id="btn-stop-qr-2" style="margin-top:12px">${isAr ? 'إنهاء الجلسة وأرشفة الحضور' : 'End Session & Archive'}</button>
              </div>
            ` : `
              <div style="padding:28px 20px;text-align:center;background:#fff;border:2px dashed var(--bei);border-radius:18px;color:var(--c2)">
                <div style="font-size:2.4rem;margin-bottom:8px">📴</div>
                <h4>${isAr ? 'لا توجد جلسة حضور نشطة' : 'No Active Attendance Session'}</h4>
                <p style="font-size:.88rem;margin-top:6px">${isAr ? 'اكتب اسم الاجتماع وابدأ الجلسة — كل عضو سيجد QR خاص به في بوابته تلقائياً.' : 'Type the meeting name and start the session — each member will find their own personal QR in their portal.'}</p>
              </div>
            `}
          </div>
        </div>

        <!-- 1. Live Active Attendance (ONLY shown when QR is active) -->
        ${activeQr.active ? `
          <div style="margin-top:28px;border-top:1.5px solid var(--bei);padding-top:20px;animation:up .3s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
              <h4>🔴 ${isAr ? `الحضور اللحظي في الفعالية النشطة حالياً (${activeEventAttendees.length} طالب)` : `Live Attendance for Active Event (${activeEventAttendees.length})`}</h4>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" class="btn sm" id="btn-print-attendance" style="padding:6px 14px;font-size:.82rem">
                  🖨️ ${isAr ? 'طباعة تقرير الحضور اللحظي' : 'Print Live Report'}
                </button>
                <button type="button" class="btn sm ghost" id="btn-export-attendance-csv" style="padding:6px 14px;font-size:.82rem">
                  📥 ${isAr ? 'تصدير (CSV)' : 'Export CSV'}
                </button>
              </div>
            </div>
            <div class="tbl-wrap att-desktop-table" style="margin-top:12px">
              <table class="atbl">
                <thead><tr><th>#</th><th>${isAr ? 'الطالب' : 'Student'}</th><th>${isAr ? 'الكلية' : 'Faculty'}</th><th>${isAr ? 'اللجنة' : 'Committee'}</th><th>${isAr ? 'رقم الهاتف' : 'Phone'}</th><th>${isAr ? 'وقت التسجيل' : 'Scan Time'}</th></tr></thead>
                <tbody>
                  ${activeEventAttendees.length === 0 ? `<tr><td colspan="6" style="text-align:center;color:var(--c2)">${isAr ? 'لم يقم أي طالب بتسجيل الحضور في هذه الفعالية بعد.' : 'No attendees recorded yet.'}</td></tr>` : activeEventAttendees.map((a, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <button type="button" class="av-zoom-btn" data-photo="${a.photo || '/assets/images/logo.png'}" data-name="${a.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                            <div style="width:30px;height:30px;border-radius:50%;overflow:hidden;border:1.5px solid var(--g);background:#fff">
                              <img src="${a.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${a.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                            </div>
                          </button>
                          <b>${a.studentName}</b>
                        </div>
                      </td>
                      <td>${getCollegeName(a.college || '—')}</td>
                      <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(a.committee)}</span></td>
                      <td><a href="tel:${a.phone}" style="color:var(--c1);font-weight:700" dir="ltr">📞 ${a.phone || '—'}</a></td>
                      <td><code>${a.time} - ${a.date}</code></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ${renderMobileAttendeeCards(activeEventAttendees, isAr)}
          </div>
        ` : ''}

        <!-- 2. Permanent Memory / Archive of All Events & Attendance Lists -->
        <div style="margin-top:28px;border-top:1.5px solid var(--bei);padding-top:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
            <div>
              <h4 style="color:var(--c1);margin:0;font-size:1.15rem">📂 ${isAr ? 'حافظة وأرشيف الفعاليات وسجلات الحضور السابقة' : 'Past Events Attendance Archive'}</h4>
              <p style="color:var(--c2);font-size:.85rem;margin:3px 0 0">
                ${isAr ? 'تضم جميع الفعاليات التي تم إدارتها بالـ QR مع أسماء وكليات وأرقام هواتف الطلاب المشاركين، وإمكانية تصديرها وطباعتها.' : 'Complete archive of all QR events with student names, faculties, phone numbers, CSV export, and print.'}
              </p>
            </div>
            <span class="sbadge act">${eventsArchive.length} ${isAr ? 'فعالية مؤرشفة' : 'Archived Events'}</span>
          </div>

          <div style="display:grid;gap:14px;margin-top:14px">
            ${eventsArchive.length === 0 ? `
              <div style="padding:24px;text-align:center;color:var(--c2);background:var(--bei);border-radius:14px">
                ${isAr ? 'لا توجد فعاليات مؤرشفة حتى الآن.' : 'No archived events yet.'}
              </div>
            ` : eventsArchive.map(ev => `
              <div class="archived-ev-card" style="background:#fff;border:1.5px solid var(--bei);border-radius:16px;padding:16px 20px;box-shadow:var(--sh);transition:.2s">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                  <div>
                    <h4 style="color:var(--c1);font-size:1.08rem;margin:0 0 4px">🗓️ ${ev.title}</h4>
                    <p style="color:var(--c2);font-size:.85rem;margin:0">
                      📅 ${ev.date} • ⏰ ${ev.time} • <span class="sbadge act" style="margin-inline-start:6px">👥 ${ev.totalAttendees || (ev.attendees ? ev.attendees.length : 0)} ${isAr ? 'طالب مسجل' : 'Attendees'}</span>
                    </p>
                  </div>
                  <div class="archived-ev-actions" style="display:flex;gap:8px;flex-wrap:wrap">
                    <button type="button" class="btn sm" data-toggle-event-archive="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      📋 ${openedEventArchiveId === ev.id ? (isAr ? 'إخفاء الكشف ✕' : 'Hide') : (isAr ? 'عرض كشف الحضور 👁️' : 'View Attendees')}
                    </button>
                    <button type="button" class="btn sm ghost" data-export-event-csv="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      📥 ${isAr ? 'تصدير ملف (CSV)' : 'Export CSV'}
                    </button>
                    <button type="button" class="btn sm ghost" data-print-event="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      🖨️ ${isAr ? 'طباعة كشف' : 'Print Sheet'}
                    </button>
                    <button type="button" class="btn sm ghost" data-delete-event="${ev.id}" style="padding:6px 10px;font-size:.82rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'حذف من الأرشيف' : 'Delete'}">
                      🗑️
                    </button>
                  </div>
                </div>

                ${openedEventArchiveId === ev.id ? `
                  <div style="margin-top:16px;border-top:1.5px dashed var(--g);padding-top:14px;animation:up .3s ease">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                      <h5 style="color:var(--c1);margin:0">👥 ${isAr ? 'كشف تفصيلي بأسماء وكليات وأرقام هواتف الطلاب المسجلين:' : 'Attendees Details & Phone Numbers:'}</h5>
                    </div>
                    <div class="tbl-wrap att-desktop-table">
                      <table class="atbl">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
                            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
                            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
                            <th>${isAr ? 'الفرقة' : 'Year'}</th>
                            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
                            <th>${isAr ? 'رقم الهاتف' : 'Phone'}</th>
                            <th>${isAr ? 'وقت التسجيل' : 'Scan Time'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${ev.attendees && ev.attendees.length > 0 ? ev.attendees.map((att, i) => `
                            <tr>
                              <td>${i + 1}</td>
                              <td>
                                <div style="display:flex;align-items:center;gap:8px">
                                  <button type="button" class="av-zoom-btn" data-photo="${att.photo || '/assets/images/logo.png'}" data-name="${att.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                                    <div style="width:30px;height:30px;border-radius:50%;overflow:hidden;border:1.5px solid var(--g);background:#fff">
                                      <img src="${att.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${att.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                                    </div>
                                  </button>
                                  <b>${att.studentName}</b>
                                </div>
                              </td>
                              <td><code>${att.nid || '—'}</code></td>
                              <td>${getCollegeName(att.college || '—')}</td>
                              <td>${getYearName(att.year || '—')}</td>
                              <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(att.committee)}</span></td>
                              <td><a href="tel:${att.phone}" style="color:var(--c1);font-weight:700" dir="ltr">📞 ${att.phone || '—'}</a></td>
                              <td><code>${att.time || att.scannedAt || '—'}</code></td>
                            </tr>
                          `).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--c2)">${isAr ? 'لا يوجد حضور مسجل في هذه الفعالية.' : 'No attendees recorded.'}</td></tr>`}
                        </tbody>
                      </table>
                    </div>
                    ${renderMobileAttendeeCards(ev.attendees, isAr)}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${curAtab === 'sugs' ? `
      <div class="admin-card">
        <div class="admin-card-head" style="gap:12px;flex-wrap:wrap">
          <div>
            <h3>💡 ${isAr ? 'الاقتراحات والأفكار الواردة من الموقع' : 'Submitted Ideas & Suggestions'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'كافة المقترحات والأفكار محفوظة سحابياً في قاعدة البيانات ويمكنك إدارتها ومسح القديم منها.' : 'All submitted suggestions are saved in the cloud database.'}
            </p>
          </div>
          <button type="button" class="btn sm ghost" id="btn-sync-sugs-now" style="font-size:.82rem;padding:6px 14px;border-color:var(--g);color:var(--g)">
            🔄 ${isAr ? 'تحديث المقترحات' : 'Refresh Suggestions'}
          </button>
        </div>
        <div style="margin-top:14px">
          ${sugs.length === 0 ? `
            <div style="text-align:center;padding:36px 20px;color:var(--c2);background:var(--bei);border-radius:14px">
              <div style="font-size:2rem;margin-bottom:8px">📭</div>
              <b>${isAr ? 'صندوق الاقتراحات فارغ حالياً' : 'Suggestion box is currently empty'}</b>
              <p style="font-size:.85rem;margin:4px 0 0">${isAr ? 'أي مقترح يرسله زوار الموقع سيظهر هنا فورياً.' : 'New ideas submitted from the website will appear here in real-time.'}</p>
            </div>
          ` : sugs.map(sg => `
            <div class="sug-item ${sg.done ? 'done' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
                <h4>${sg.act}</h4>
                <button type="button" class="btn sm ghost" data-delete-sug="${sg.id}" style="padding:4px 10px;font-size:.78rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'مسح المقترح نهائياً من قاعدة البيانات' : 'Delete Suggestion Permanently'}">
                  🗑️ ${isAr ? 'مسح' : 'Delete'}
                </button>
              </div>
              <div class="sug-meta">${isAr ? 'المرسل: ' + sg.name + (sg.email ? ' (' + sg.email + ')' : '') + (sg.aud ? ' • الفئة المستهدفة: ' + sg.aud : '') + ' • التاريخ: ' + sg.date : 'From: ' + sg.name + (sg.email ? ' (' + sg.email + ')' : '') + ' • Date: ' + sg.date}</div>
              <div class="sug-txt">${sg.msg}</div>
              <div style="margin-top:10px">
                <button type="button" class="btn sm ghost" data-toggle-sug="${sg.id}" style="font-size:.8rem;padding:4px 14px">
                  ${sg.done ? (isAr ? '✓ تمت مراجعتها' : '✓ Reviewed') : (isAr ? 'تمييز كمقروءة ومكتملة' : 'Mark as Reviewed')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${curAtab === 'gallery' && isSuperAdmin ? `
      <div class="admin-card">
        <div class="admin-card-head" style="gap:12px;flex-wrap:wrap">
          <div>
            <h3>🖼️ ${isAr ? 'إدارة ميديا ومعرض الأسرة (خاص بالمشرف العام)' : 'Media & Gallery Management (Super Admin)'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'أضف صور وفيديوهات جديدة لتظهر في معرض الموقع وبوابة الأعضاء، أو احذف ما تريده من المعرض.' : 'Add new photos and videos to the live gallery or delete existing ones.'}
            </p>
          </div>
          <button type="button" class="btn sm ghost" id="btn-sync-gallery-now" style="font-size:.82rem;padding:6px 14px;border-color:var(--g);color:var(--g)">
            🔄 ${isAr ? 'تحديث المعرض' : 'Refresh Gallery'}
          </button>
        </div>

        <!-- Add Media Form -->
        <form id="admin-add-gallery-form" class="form" style="margin-top:20px;background:var(--bei);padding:18px;border-radius:14px;border:1px solid rgba(242,168,29,.2)">
          <h4 style="margin:0 0 12px;color:var(--c1)">➕ ${isAr ? 'إضافة وسائط جديدة للمعرض' : 'Add New Media to Gallery'}</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px">
            <div>
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'نوع الوسائط' : 'Media Type'}</label>
              <select id="gallery-media-type" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
                <option value="IMAGE">📷 ${isAr ? 'صورة (رفع من الجهاز)' : 'Image (Upload from Device)'}</option>
                <option value="VIDEO">🎥 ${isAr ? 'فيديو (رابط يوتيوب أو مباشر)' : 'Video (YouTube or Direct Link)'}</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'عنوان أو وصف مختصر (اختياري)' : 'Title / Caption (Optional)'}</label>
              <input type="text" id="gallery-media-title" class="form-input" placeholder="${isAr ? 'مثال: افتتاح ملتقى الأسرة 2026' : 'e.g. Annual Family Conference 2026'}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
            </div>
          </div>

          <!-- Photo Upload Section -->
          <div id="gallery-file-wrap" style="margin-top:14px">
            <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'اختر صورة من جهازك' : 'Choose Image File'}</label>
            <input type="file" id="gallery-file-input" accept="image/*" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px dashed var(--g)">
            <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'يتم ضغط وتصغير الصورة تلقائياً لسرعة التحميل وحفظها سحابياً.' : 'Images are automatically optimized and stored in the cloud.'}</p>
            <div id="gallery-preview-container" style="display:none;margin-top:10px;text-align:center">
              <img id="gallery-preview-img" src="" alt="Preview" style="max-height:180px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);border:2px solid var(--g)">
            </div>
          </div>

          <!-- Video Section -->
          <div id="gallery-video-wrap" style="display:none;margin-top:14px">
            <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
              <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:.86rem;font-weight:700;background:#fff;padding:8px 14px;border-radius:8px;border:1.5px solid var(--bdr)">
                <input type="radio" name="video_source_mode" value="file" checked id="vmode-file">
                📁 ${isAr ? 'رفع ملف فيديو من الجهاز' : 'Upload Video File'}
              </label>
              <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:.86rem;font-weight:700;background:#fff;padding:8px 14px;border-radius:8px;border:1.5px solid var(--bdr)">
                <input type="radio" name="video_source_mode" value="url" id="vmode-url">
                🔗 ${isAr ? 'رابط من أي منصة (فيس، تيك توك، يوتيوب، إلخ)' : 'Video Link (FB, TikTok, YT, etc.)'}
              </label>
            </div>

            <!-- 1. Video File Input -->
            <div id="video-file-subwrap">
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'اختر ملف فيديو من جهازك (MP4 / WebM / إلخ)' : 'Choose Video File'}</label>
              <input type="file" id="gallery-video-file-input" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px dashed var(--g)">
              <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'الحد الأقصى للرفع المباشر للكليبات هو 4.2 ميجابايت. للفيديوهات الأكبر حجماً، يُفضّل وضع رابط الفيديو وسيعمل فوراً بدون حد للحجم.' : 'Direct upload limit is 4.2MB. For larger videos, use the video link option.'}</p>
              <div id="gallery-video-preview-container" style="display:none;margin-top:10px;text-align:center">
                <video id="gallery-video-preview-el" controls style="max-height:180px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);border:2px solid var(--g)"></video>
              </div>
            </div>

            <!-- 2. Video URL Input -->
            <div id="video-url-subwrap" style="display:none">
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'رابط الفيديو من فيسبوك، تيك توك، إنستغرام، يوتيوب، درايف، أو رابط مباشر' : 'Video URL (Facebook, TikTok, Instagram, YouTube, etc.)'}</label>
              <input type="url" id="gallery-video-url" class="form-input" placeholder="${isAr ? 'مثال: https://www.facebook.com/... أو https://www.tiktok.com/... أو https://youtu.be/...' : 'e.g. Facebook, TikTok, Instagram, or YouTube URL'}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
              <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'يدعم تلقائياً فيديوهات وريلز فيسبوك، تيك توك، إنستغرام، يوتيوب، وروابط الـ MP4 المباشرة بدون أي حد للحجم.' : 'Supports Facebook Reels/Videos, TikTok, Instagram, YouTube, and direct video links.'}</p>
            </div>
          </div>

          <div style="margin-top:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <button type="submit" id="gallery-submit-btn" class="btn" style="padding:10px 24px">
              🚀 ${isAr ? 'إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'}
            </button>
            <span id="gallery-form-msg" style="font-size:.88rem;font-weight:700"></span>
          </div>
        </form>

        <!-- Current Gallery Items -->
        <h4 style="margin:28px 0 14px;color:var(--c1)">📂 ${isAr ? 'العناصر الحالية في المعرض' : 'Current Gallery Items'} (${galleryItems.length})</h4>
        ${galleryItems.length === 0 ? `
          <div style="text-align:center;padding:36px 20px;color:var(--c2);background:var(--bei);border-radius:14px">
            <div style="font-size:2rem;margin-bottom:8px">🖼️</div>
            <b>${isAr ? 'المعرض فارغ حالياً' : 'The gallery is currently empty'}</b>
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:16px">
            ${galleryItems.map(item => `
              <div style="background:var(--card);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.06);display:flex;flex-direction:column">
                <div style="position:relative;aspect-ratio:16/10;background:#000;overflow:hidden">
                  ${item.type === 'VIDEO' ? `
                    ${renderVideoPlayer(item.url, item.title)}
                    <span style="position:absolute;top:8px;left:8px;background:rgba(200,16,46,.9);color:#fff;padding:2px 8px;border-radius:6px;font-size:.72rem;font-weight:700;z-index:2">${getVideoBadge(item.url)}</span>
                  ` : `
                    <img src="${item.url}" alt="${item.title || 'Gallery Image'}" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                    <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.65);color:#fff;padding:2px 8px;border-radius:6px;font-size:.72rem;font-weight:700">📷 صورة</span>
                  `}
                </div>
                <div style="padding:12px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <h5 style="margin:0 0 6px;font-size:.9rem;line-height:1.4">${item.title || (isAr ? 'بدون عنوان' : 'Untitled')}</h5>
                    <div style="font-size:.75rem;color:var(--c2)">${item.createdAt || ''}</div>
                  </div>
                  <div style="margin-top:12px;display:flex;justify-content:flex-end">
                    <button type="button" class="btn sm ghost" data-delete-gallery-item="${item.id || item.url}" data-item-url="${item.url}" style="padding:4px 10px;font-size:.78rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'حذف هذا العنصر من المعرض وقاعدة البيانات' : 'Delete item permanently'}">
                      🗑️ ${isAr ? 'حذف من المعرض' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    ` : ''}
  </div>`;
}


/* >>> MODULE: 05_portal.js <<< */
/**
 * 05_portal.js - Student Member Portal Views & Authentication Forms
 * Part of HNU Students For Egypt Platform
 */

function studentView(curUser) {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
  const allAttendances = getStore("cf_attendance", []);
  const myAttendances = allAttendances.filter(a => a.studentId === curUser.id || a.nid === curUser.nid);
  const alreadyAttended = activeQr.active && myAttendances.some(a => a.event === activeQr.title);

  return `<section class="portal-sec"><div class="wrap">
    <!-- Top Member Header -->
    <div class="admin-bar">
      <div class="admin-bar-user">
        <button type="button" class="av-zoom-btn" data-photo="${curUser.photo || '/assets/images/logo.png'}" data-name="${curUser.name}" title="${isAr ? 'عرض صورتك الشخصية' : 'View profile photo'}">
          <div class="admin-av">
            <img src="${curUser.photo || '/assets/images/logo.png'}" alt="${curUser.name}" onerror="this.onerror=null;this.parentElement.textContent='🎓'">
          </div>
        </button>
        <div>
          <h2>${isAr ? 'أهلاً بك يا ' + curUser.name : 'Welcome, ' + curUser.name}</h2>
          <p>${getCollegeName(curUser.college)} — ${getYearName(curUser.year)} • ${getComName(curUser.com)}</p>
        </div>
      </div>
      <div class="admin-bar-actions">
        <button type="button" class="btn sm ghost" id="btn-toggle-edit-profile" style="height:38px;padding:0 16px;font-size:.85rem;font-weight:700">
          ✏️ ${isAr ? 'تعديل الملف' : 'Edit Profile'}
        </button>
        <button type="button" class="btn sm" id="logout-btn" style="height:38px;padding:0 18px;font-size:.85rem;background:#C8102E;color:#fff;border-color:transparent;font-weight:700">
          🚪 ${isAr ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>

    <!-- Edit Profile Inline Card (if toggled) -->
    ${isEditingProfile ? `
      <div class="admin-card" id="edit-profile-card" style="border:2px solid var(--g);background:#fff;margin-bottom:24px">
        <div class="admin-card-head">
          <h3>✏️ ${isAr ? 'تعديل بيانات الحساب الشخصي' : 'Edit Account Details'}</h3>
          <button type="button" class="btn sm ghost" id="btn-close-edit-profile">${isAr ? 'إلغاء' : 'Cancel'}</button>
        </div>
        <form class="form" id="edit-profile-form">
          <div class="form-row">
            <label>${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
              <input name="phone" type="tel" value="${curUser.phone || ''}" required>
            </label>
            <label>${isAr ? 'البريد الإلكتروني' : 'Email'}
              <input name="email" type="email" value="${curUser.email || ''}">
            </label>
          </div>

          <div class="form-row">
            <label>${isAr ? 'كلمة المرور الجديدة (اتركها فارغة إذا لم ترغب بتغييرها)' : 'New Password (Optional)'}
              <div class="pw-wrap">
                <input name="newPw" type="password" minlength="6" placeholder="******">
                <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
              </div>
            </label>
            <label>${isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              <div class="pw-wrap">
                <input name="newPwConfirm" type="password" minlength="6" placeholder="******">
                <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
              </div>
            </label>
          </div>

          <div class="photo-uploader">
            <div class="photo-preview" id="edit-photo-preview-box">
              <img src="${editPhotoBase64 || curUser.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="">
            </div>
            <div>
              <label style="cursor:pointer;font-weight:700;color:var(--c1);display:block;margin-bottom:4px">
                ${isAr ? 'تغيير الصورة الشخصية' : 'Change Profile Photo'}
              </label>
              <input type="file" id="edit-photo-file-input" accept="image/*" style="font-size:.85rem;border:none;padding:0;min-height:unset">
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn big" type="submit" style="flex:1">
              ${isAr ? 'حفظ التعديلات في الحساب' : 'Save Profile Changes'}
            </button>
          </div>
          <p class="msg" id="edit-prof-msg" role="status" aria-live="polite"></p>
        </form>
      </div>
    ` : ''}

    <!-- 1. Attendance QR Code Section (ONLY APPEARS WHEN ADMIN STARTS SESSION!) -->
    ${activeQr.active ? `
      <div class="admin-card" style="margin-bottom:24px;border:2.5px solid var(--g2);background:#fff;box-shadow:0 12px 36px rgba(59,38,22,.08)">
        <div class="admin-card-head" style="align-items:center">
          <div>
            <h3>📱 ${isAr ? 'كود تسجيل الحضور الرسمي' : 'Official Attendance QR Code'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:3px 0 0">
              ${isAr ? `جلسة حضور نشطة الآن: <b>${activeQr.title}</b> — أرِ هذا الكود لكاميرا الأدمن لتسجيل حضورك.` : `Live session: <b>${activeQr.title}</b> — Show this QR to the admin to scan.`}
            </p>
          </div>
          <span class="sbadge act" style="font-size:.85rem;padding:4px 14px">
            ${isAr ? '● جلسة حضور نشطة الآن' : '● Live Session Active'}
          </span>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 10px">
          ${alreadyAttended ? `
            <div style="padding:24px 28px;background:#e6f4ea;color:#137333;font-weight:700;border-radius:18px;border:2px solid #a8dab5;margin:8px 0;max-width:440px;width:100%">
              <div style="font-size:2.8rem;margin-bottom:8px">✅</div>
              <div style="font-size:1.15rem;margin-bottom:4px">${isAr ? `تم تسجيل حضورك في "${activeQr.title}" بنجاح!` : `Your attendance for "${activeQr.title}" has been recorded!`}</div>
              <p style="font-size:.85rem;color:#1e4620;margin:0;font-weight:500">${isAr ? 'تم توثيق حضورك رسمياً في كشف الفعالية وقاعدة البيانات.' : 'Your attendance is officially recorded in family database.'}</p>
            </div>
          ` : `
            <!-- Personal QR Canvas (generated client-side only during active session) -->
            <div style="background:#fff;padding:16px;border-radius:20px;border:3px solid var(--g2);box-shadow:0 10px 28px rgba(59,38,22,.12);display:inline-block">
              <canvas id="member-qr-canvas" style="display:block;margin:0 auto;width:210px;height:210px;border-radius:10px"></canvas>
            </div>

            <div style="margin-top:14px">
              <h4 style="color:var(--c1);font-size:1.15rem;margin:0 0 4px">${curUser.name}</h4>
              <p style="margin:0;font-size:.9rem;color:var(--c2)">
                <span class="sbadge act" style="font-size:.8rem;padding:2px 10px">${getComName(curUser.com)}</span>
                • <b>${getCollegeName(curUser.college)}</b> (${getYearName(curUser.year)})
              </p>
            </div>

            <div style="margin-top:14px;width:100%;max-width:440px">
              <div style="padding:12px 20px;background:#fff3cd;color:#856404;font-weight:700;border-radius:14px;border:1.5px solid #ffeeba;font-size:.9rem">
                ⏳ ${isAr ? 'في انتظار مسح الأدمن للـ QR الخاص بك...' : 'Waiting for admin to scan your QR...'}
              </div>
            </div>
          `}
        </div>
      </div>
    ` : `
      <div class="admin-card" style="margin-bottom:24px;border:2px dashed var(--bei);background:var(--bg);text-align:center;padding:34px 20px;border-radius:20px">
        <div style="font-size:2.8rem;margin-bottom:8px">📴</div>
        <h3 style="color:var(--c1);font-size:1.2rem;margin:0 0 6px">${isAr ? 'لا توجد جلسة حضور نشطة حالياً' : 'No Active Attendance Session'}</h3>
        <p style="color:var(--c2);font-size:.9rem;max-width:480px;margin:0 auto;line-height:1.7">
          ${isAr ? 'سيظهر كود الـ QR الخاص بك هنا تلقائياً فور بدء الأدمن لجلسة تسجيل الحضور في أي اجتماع أو فعالية.' : 'Your personal attendance QR code will appear here automatically when the admin starts an attendance session.'}
        </p>
        <span class="sbadge pen" style="margin-top:16px;display:inline-block;padding:5px 16px;font-size:.85rem">
          ${isAr ? '○ في انتظار بدء جلسة الحضور' : '○ Standby for Live Session'}
        </span>
      </div>
    `}

    <!-- 2. Two Main Cards: Membership Info & Events Attended (NO EVALUATION SHOWN!) -->
    <div class="two" style="margin-bottom:24px">
      <div class="card">
        <h3>📋 ${isAr ? 'بيانات العضوية الرسمية' : 'Official Membership Info'}</h3>
        <p><b>${isAr ? 'اللجنة:' : 'Committee:'}</b> ${getComName(curUser.com)}</p>
        <p><b>${isAr ? 'الكلية:' : 'Faculty:'}</b> ${getCollegeName(curUser.college)}</p>
        <p><b>${isAr ? 'الفرقة الدراسية:' : 'Year:'}</b> ${getYearName(curUser.year)}</p>
        <p><b>${isAr ? 'الحالة:' : 'Status:'}</b> <span class="sbadge act">${curUser.status || (isAr ? 'نشط' : 'Active')}</span></p>
        <p><b>${isAr ? 'الرقم القومي:' : 'National ID:'}</b> <code>${maskNid(curUser.nid)}</code></p>
        <p><b>${isAr ? 'رقم الهاتف:' : 'Phone:'}</b> ${curUser.phone || '—'}</p>
        ${(curUser.score !== undefined && curUser.score !== null && curUser.score > 0) || curUser.notes ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1.5px solid var(--bei)">
            ${curUser.score !== undefined && curUser.score !== null ? `<p><b>⭐ ${isAr ? 'تقييم أدائك:' : 'Your Score:'}</b> ${getScoreBadge(curUser.score || 0)}</p>` : ''}
            ${curUser.notes ? `<p style="margin-top:8px"><b>💬 ${isAr ? 'ملاحظات الإدارة:' : 'Admin Notes:'}</b><br><span style="color:var(--c2);font-size:.9rem;line-height:1.6;display:block;margin-top:4px;padding:10px 14px;background:var(--bei);border-radius:10px;white-space:pre-wrap">${curUser.notes}</span></p>` : ''}
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3>🎯 ${isAr ? 'الفعاليات التي شاركت فيها' : 'Events Participated In'}</h3>
        <p style="margin-bottom:12px">
          <b>${isAr ? 'إجمالي الفعاليات المسجلة:' : 'Total Events Attended:'}</b> 
          <span style="color:var(--g2);font-weight:800;font-size:1.1rem">${myAttendances.length} ${isAr ? 'فعاليات' : 'events'}</span>
        </p>
        ${myAttendances.length === 0 ? `
          <div style="padding:16px;background:rgba(242,168,29,.08);border-radius:12px;font-size:.88rem;color:var(--c2)">
            ${isAr ? 'لم تسجل حضوراً في أي فعالية بعد. فور بدء أي فعالية سيظهر كود الـ QR أعلاه لتسجيل حضورك مباشرة.' : 'You have not attended any events yet. When an event begins, the QR will appear above.'}
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${myAttendances.map(a => `
              <div style="padding:10px 14px;background:#fff;border:1.5px solid var(--bei);border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
                <div>
                  <b style="color:var(--c1)">${a.event}</b>
                  <div style="font-size:.8rem;color:var(--c2)">${a.date} • ${a.time}</div>
                </div>
                <span class="sbadge act">${isAr ? '✓ تم الحضور' : '✓ Attended'}</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- 3. Family Events Showcase -->
    <div class="admin-card" style="margin-bottom:24px">
      <div class="admin-card-head">
        <h3>🎉 ${isAr ? 'أحدث فعاليات وأنشطة الأسرة' : 'Family Events & Activities'}</h3>
        <a href="/#events" data-link class="btn ghost sm">${isAr ? 'عرض الكل' : 'View All'}</a>
      </div>
      <div class="dash-events-grid">
        ${C.events.map(ev => `
          <div class="dash-ev-card">
            <img src="${ev.img}" alt="${t(ev.title)}" class="dash-ev-img" loading="lazy">
            <div class="dash-ev-body">
              <small>${t(ev.date)}</small>
              <h4>${t(ev.title)}</h4>
              <p>${t(ev.desc).slice(0, 110)}...</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 4. Family Gallery Showcase -->
    <div class="admin-card" style="margin-bottom:24px">
      <div class="admin-card-head">
        <h3>📸 ${isAr ? 'لحظات من أنشطة وميديا الأسرة' : 'Gallery & Moments'}</h3>
        <a href="/#gallery" data-link class="btn ghost sm">${isAr ? 'المعرض الكامل' : 'Full Gallery'}</a>
      </div>
      <div class="dash-gal-grid">
        ${getGalleryItems().filter(x => x.type !== 'VIDEO').slice(0, 8).map((g, i) => `
          <img src="${g.url || g}" alt="${g.title || 'Gallery ' + (i + 1)}" class="dash-gal-thumb" data-g="${i}" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
        `).join('')}
      </div>
    </div>
  </div></section>`;
}


/* >>> MODULE: 06_router.js <<< */
/**
 * 06_router.js - Client-side Router (render), Observers & Lightbox
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Router + transitions ---------- */
function resolve() {
  const p = location.pathname.replace(/\/+$/, "") || "/", m = p.match(/^\/committees(?:\/([\w-]+))?$/);
  if (p === "/") return { html: homeView(), title: STR[lang].h1a + " " + S("h1b"), nav: "home" };
  if (m && !m[1]) return { html: committeesView(), title: S("n_com"), nav: "committees" };
  if (m && C.committees[m[1]]) return { html: committeeView(m[1]), title: `${C.committees[m[1]].code} — ${t(C.committees[m[1]])}`, nav: "committees" };
  if (p === "/portal" || p === "/login" || p === "/admin" || p === "/register") {
    if (p === "/register") curAuthMode = "register";
    else if (p === "/login") curAuthMode = "login";
    return { html: portalView(), title: curAuthMode === "register" ? "إنشاء حساب جديد" : S("portal_t"), nav: "portal" };
  }
  return { html: notFound(), title: "404", nav: "" };
}

const BRAND = " | أسرة طلاب من أجل مصر — جامعة حلوان الأهلية";
function render(scroll) {
  const r = resolve(); app.innerHTML = r.html; document.title = r.title === "404" || r.nav === "home" ? "أسرة طلاب من أجل مصر — جامعة حلوان الأهلية" : r.title + BRAND;
  setActive(r.nav); observe();
  
  // Trigger member QR code generation if canvas is present in DOM
  const memberCanvas = document.getElementById('member-qr-canvas');
  if (memberCanvas) {
    const userId = localStorage.getItem('cf_user_id');
    const user = getStore('cf_cur_user', null) || getUsers().find(u => u.id === userId);
    if (user) {
      setTimeout(() => generateMemberQr(user), 60);
    }
  }

  if (scroll === "keep") return;
  const el = location.hash && $(location.hash.replace(/[^#\w-]/g, ""));
  if (el) el.scrollIntoView({ behavior: reduce.matches ? "instant" : "smooth" });
  else scrollTo({ top: 0, behavior: reduce.matches ? "instant" : "smooth" });
  app.focus({ preventScroll: true });
}
function transition(fn) {
  if (!reduce.matches && document.startViewTransition) document.startViewTransition(fn);
  else if (!reduce.matches) {
    app.classList.add("out");
    setTimeout(() => {
      fn();
      app.classList.remove("out");
      app.classList.add("inn");
      setTimeout(() => app.classList.remove("inn"), 300);
    }, 180);
  } else fn();
}
function go(url) {
  const u = new URL(url, location.origin);
  if (u.pathname === location.pathname && (location.pathname === "/" || !u.hash)) {
    history.pushState(null, "", u.pathname + u.hash);
    const el = u.hash && $(u.hash);
    if (el) el.scrollIntoView({ behavior: reduce.matches ? "instant" : "smooth" });
    else scrollTo({ top: 0, behavior: reduce.matches ? "instant" : "smooth" });
    return;
  }
  history.pushState(null, "", u.pathname + u.hash);
  transition(() => render());
}

document.addEventListener("click", e => {
  const a = e.target.closest("a[data-link]");
  if (a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    closeMenu();
    go(a.getAttribute("href"));
    return;
  }
  const g = e.target.closest("[data-g]");
  if (g) openLb(+g.dataset.g, g);
});
addEventListener("popstate", () => transition(() => render()));

/* ---------- Nav, language, static texts ---------- */
const burger = $("#burger"), menu = $("#menu");
function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
burger.onclick = () => burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
function setActive(k) { $$("[data-nav]").forEach(a => a.dataset.nav === k ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")); }

function statics() {
  const d = document.documentElement; d.lang = lang; d.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-i]").forEach(e => e.textContent = S(e.dataset.i));
  $$("[data-join]").forEach(a => a.href = C.joinUrl);
  $("#lang").textContent = S("lang"); $("#lang").setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
  burger.setAttribute("aria-label", S("menu")); $(".lb-x").setAttribute("aria-label", S("close")); $(".lb-n.prev").setAttribute("aria-label", S("prev")); $(".lb-n.next").setAttribute("aria-label", S("next"));
  $("#soc").innerHTML = Object.entries(C.social).map(([k, u]) => {
    const svg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg>`;
    return u ? `<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${svg}</a>` : `<span class="off" role="img" aria-label="${k} — ${S("soon")}" title="${S("soon")}">${svg}</span>`;
  }).join("");

  const navLoginBtn = $(".nav-login");
  if (navLoginBtn) {
    const role = localStorage.getItem("cf_role");
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      navLoginBtn.textContent = lang === "ar" ? "👑 لوحة الإدارة" : "👑 Admin Panel";
      navLoginBtn.href = "/admin";
    } else if (role === "STUDENT") {
      navLoginBtn.textContent = lang === "ar" ? "🎓 لوحة العضو" : "🎓 Member Portal";
      navLoginBtn.href = "/portal";
    } else {
      navLoginBtn.textContent = lang === "ar" ? "🔐 تسجيل الدخول" : "🔐 Sign In";
      navLoginBtn.href = "/portal";
    }
  }
}
$("#lang").onclick = () => { lang = lang === "ar" ? "en" : "ar"; localStorage.setItem("lang", lang); const y = scrollY; statics(); render("keep"); scrollTo(0, y); };

/* ---------- Image fallbacks ---------- */
addEventListener("error", e => {
  const i = e.target;
  if (i.tagName !== "IMG" || !i.dataset.fb) return;
  const d = document.createElement("div");
  d.className = i.dataset.fbc;
  d.innerHTML = i.dataset.fb;
  d.setAttribute("role", "img");
  d.setAttribute("aria-label", i.alt || "");
  d.dataset.broken = 1;
  i.replaceWith(d);
}, true);

/* ---------- Reveal, counters, scroll-spy ---------- */
let io, spy;
function observe() {
  io && io.disconnect(); spy && spy.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    const b = $("b[data-n]", e.target);
    if (b) count(b);
    io.unobserve(e.target);
  }), { threshold: .12 });
  $$(".rv").forEach(el => io.observe(el));
  if (reduce.matches) $$(".rv").forEach(el => el.classList.add("in"));
  if ($("#home")) {
    spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive({ home: "home", about: "about", leaders: "leaders", events: "events", gallery: "gallery" }[e.target.id] || "")), { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach(s => spy.observe(s));
  }
}
function count(b) {
  const n = +b.dataset.n, p = b.dataset.p;
  if (reduce.matches) return;
  const t0 = performance.now();
  (function f(now) {
    const k = Math.min((now - t0) / 1100, 1);
    b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + (k === 1 ? p : "");
    k < 1 && requestAnimationFrame(f);
  })(t0);
}

/* ---------- Lightbox ---------- */
const lb = $("#lb"), lbi = $("#lb-img"); let cur = 0, opener = null;
const okImgs = () => $$(".gi").filter(g => g.querySelector("img"));
function showLb(i) { const a = okImgs(); if (!a.length) return; cur = (i + a.length) % a.length; const im = a[cur].querySelector("img"); lbi.src = im.currentSrc || im.src; lbi.alt = im.alt; }
function openLb(i, el) {
  const a = okImgs(), idx = a.indexOf(el);
  if (idx < 0) return;
  opener = el;
  $$(".lb-n", lb).forEach(btn => btn.style.display = "");
  if (lbi) lbi.style.cssText = "";
  const tEl = document.getElementById("lb-title");
  if (tEl) tEl.style.display = "none";
  const openTabBtn = document.getElementById("lb-open-tab");
  if (openTabBtn) openTabBtn.style.display = "none";
  showLb(idx);
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add("show"));
  document.body.style.overflow = "hidden";
  $(".lb-x").focus();
}
function openMemberPhoto(photo, name) {
  if (!lb || !lbi) return;
  opener = document.activeElement;
  lbi.src = photo;
  lbi.alt = name || "";
  lbi.onerror = () => { lbi.src = '/assets/images/logo.png'; };
  // Cinematic large display (up to 880px / 84vh) with native aspect ratio
  lbi.style.cssText = "max-width:min(94vw, 880px);max-height:84vh;width:auto;height:auto;border-radius:18px;object-fit:contain;border:3.5px solid var(--g);box-shadow:0 24px 80px rgba(0,0,0,.92);background:rgba(20,10,4,.96);image-rendering:-webkit-optimize-contrast";
  // Hide prev/next gallery buttons
  $$(".lb-n", lb).forEach(btn => btn.style.display = "none");
  const tEl = document.getElementById("lb-title");
  if (tEl) {
    if (name) {
      tEl.textContent = name;
      tEl.style.display = "block";
    } else {
      tEl.style.display = "none";
    }
  }
  const openTabBtn = document.getElementById("lb-open-tab");
  if (openTabBtn) {
    openTabBtn.href = photo;
    openTabBtn.style.display = "grid";
  }
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add("show"));
  document.body.style.overflow = "hidden";
  const closeBtn = $(".lb-x");
  if (closeBtn) closeBtn.focus();
}
function closeLb() {
  lb.classList.remove("show");
  setTimeout(() => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lbi) {
      lbi.style.cssText = "";
      lbi.onerror = null;
    }
    $$(".lb-n", lb).forEach(btn => btn.style.display = "");
    const tEl = document.getElementById("lb-title");
    if (tEl) tEl.style.display = "none";
    const openTabBtn = document.getElementById("lb-open-tab");
    if (openTabBtn) openTabBtn.style.display = "none";
    opener && opener.focus();
  }, reduce.matches ? 0 : 200);
}
lb.addEventListener("click", e => { const a = e.target.dataset.lb; if (a === "x" || e.target === lb) closeLb(); else if (a === "n") showLb(cur + 1); else if (a === "p") showLb(cur - 1); });
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  else if (e.key === "ArrowRight") showLb(cur + (lang === "ar" ? -1 : 1));
  else if (e.key === "ArrowLeft") showLb(cur + (lang === "ar" ? 1 : -1));
  else if (e.key === "Tab") { const f = $$("button", lb), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
});

/* ---------- Contact form ---------- */
app.addEventListener("submit", async ev => {
  const f = ev.target.closest("#cform");
  if (!f) return;
  ev.preventDefault();
  const m = $(".msg", f);
  let ok = true;
  m.className = "msg";
  $$("[required]", f).forEach(x => {
    const v = x.value.trim(), bad = !v || (x.type === "email" && !/^\S+@\S+\.\S+$/.test(v));
    x.classList.toggle("err", bad);
    x.setAttribute("aria-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { m.textContent = S("err"); m.classList.add("bad"); return $(".err", f).focus(); }
  const formData = new FormData(f);
  const payload = {
    name: (formData.get("name") || "").trim(),
    email: (formData.get("email") || "").trim(),
    activity: (formData.get("activity") || "").trim(),
    audience: (formData.get("audience") || "").trim(),
    message: (formData.get("message") || "").trim()
  };
  const submitBtn = f.querySelector("button[type=submit]");
  if (submitBtn) { submitBtn.disabled = true; }
  try {
    const r = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok || !data.success) throw new Error(data.error || "Fail");
    m.textContent = lang === "ar" ? "✅ تم إرسال فكرتك بنجاح وحفظها في قاعدة البيانات! شكراً لمشاركتك." : "✅ Idea submitted and saved to database successfully! Thank you.";
    f.reset();
    syncSuggestionsWithCloud();
  } catch (err) {
    m.textContent = lang === "ar" ? "⚠️ تعذر إرسال المقترح، يرجى المحاولة مرة أخرى." : S("fail");
    m.classList.add("bad");
  } finally {
    if (submitBtn) { submitBtn.disabled = false; }
  }
});


/* >>> MODULE: 07_reports.js <<< */
/**
 * 07_reports.js - Export to CSV, Print Reports, Photo Lightbox
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Print & Export Helpers ---------- */
function printAttendanceReport() {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "الفعالية" });
  const attendances = getStore("cf_attendance", []);
  const eventTitle = activeQr.title || (attendances[0] ? attendances[0].event : (isAr ? "فعالية الأسرة" : "Family Event"));
  const filtered = attendances.filter(a => a.event === eventTitle);

  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'تقرير حضور فعالية — ' + eventTitle : 'Attendance Report — ' + eventTitle}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 28px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 14px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; font-weight: bold; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; padding-top: 14px; border-top: 1px dashed #ccc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'تقرير الحضور الرسمي المعتمد للفعالية: ' + eventTitle : 'Official Event Attendance Report: ' + eventTitle}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'اسم الفعالية: ' : 'Event: '}<b>${eventTitle}</b></div>
        <div>${isAr ? 'إجمالي الحضور: ' : 'Total Attendees: '}<b>${filtered.length} ${isAr ? 'طالب' : 'students'}</b></div>
        <div>${isAr ? 'تاريخ التقرير: ' : 'Report Date: '}<b>${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'وقت الحضور' : 'Time'}</th>
            <th>${isAr ? 'تاريخ الحضور' : 'Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `<tr><td colspan="5" style="text-align:center">${isAr ? 'لا يوجد حضور مسجل لهذه الفعالية بعد.' : 'No attendance recorded yet.'}</td></tr>` : filtered.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${a.studentName}</b></td>
              <td>${getCollegeName(a.college || '—')}</td>
              <td>${a.time}</td>
              <td>${a.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <div>${isAr ? 'مسؤول التنظيم: ' : 'OC Head: '}<b>محمد أشرف (Vice Head of OC)</b></div>
        <div>${isAr ? 'اعتماد رائد الأسرة: ' : 'Supervisor Approval: '}<b>د. محمد حلمي</b></div>
      </div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}

function exportAttendanceCSV() {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "الفعالية" });
  const attendances = getStore("cf_attendance", []);
  let csv = "\uFEFFم,اسم الطالب,الكلية,الفعالية,وقت الحضور,تاريخ الحضور\n";
  attendances.forEach((a, i) => {
    csv += `"${i + 1}","${a.studentName}","${getCollegeName(a.college || '')}","${a.event}","${a.time}","${a.date}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `تقرير_حضور_${(activeQr.title || 'فعالية').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printStudentsDirectory() {
  const isAr = lang === "ar";
  const users = getUsers();
  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'كشف أعضاء أسرة طلاب من أجل مصر' : 'Students For Egypt — Members Directory'}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 24px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 12px; margin-bottom: 18px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; }
        tr:nth-child(even) { background: #fafafa; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'الكشف الرسمي المعتمد لبيانات الأعضاء المسجلين' : 'Official Registered Members Directory'}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'إجمالي الأعضاء: ' : 'Total Members: '}<b>${users.length}</b></div>
        <div>${isAr ? 'تاريخ الاستخراج: ' : 'Date: '}<b>${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'الاسم' : 'Name'}</th>
            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'الفرقة' : 'Year'}</th>
            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
            <th>${isAr ? 'الهاتف' : 'Phone'}</th>
            <th>${isAr ? 'الصلاحية' : 'Role'}</th>
            <th>${isAr ? 'تاريخ الانضمام' : 'Join Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${u.name}</b></td>
              <td><code>${u.nid}</code></td>
              <td>${getCollegeName(u.college)}</td>
              <td>${getYearName(u.year)}</td>
              <td>${getComName(u.com)}</td>
              <td>${u.phone || '—'}</td>
              <td>${u.role === 'ADMIN' ? (isAr ? 'أدمن 👑' : 'Admin 👑') : (isAr ? 'عضو' : 'Member')}</td>
              <td>${u.createdAt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}

function exportStudentsCSV() {
  const users = getUsers();
  let csv = "\uFEFFالاسم,الرقم القومي,الكلية,الفرقة الدراسية,اللجنة,رقم الهاتف,البريد الإلكتروني,الرتبة,الحالة,تقييم الأداء,تاريخ التسجيل\n";
  users.forEach(u => {
    csv += `"${u.name}","'${u.nid}","${getCollegeName(u.college)}","${getYearName(u.year)}","${getComName(u.com)}","'${u.phone || ''}","${u.email || ''}","${u.role === 'ADMIN' ? 'أدمن / مشرف' : 'عضو'}","${u.status}","${u.score || 0}","${u.createdAt}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `اعضاء_اسرة_طلاب_من_اجل_مصر_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportArchivedEventCSV(eventId) {
  const isAr = lang === "ar";
  const archive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
  const ev = archive.find(x => x.id === eventId);
  if (!ev) return;
  let csv = "\uFEFFم,اسم الطالب,الرقم القومي,الكلية,الفرقة,اللجنة,رقم الهاتف,وقت الحضور,الفعالية,التاريخ\n";
  (ev.attendees || []).forEach((a, i) => {
    csv += `"${i + 1}","${a.studentName}","'${a.nid || ''}","${getCollegeName(a.college || '')}","${getYearName(a.year || '')}","${getComName(a.committee || '')}","'${a.phone || ''}","${a.time || ''}","${ev.title}","${ev.date}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `كشف_حضور_${ev.title.replace(/\s+/g, '_')}_${ev.date.replace(/[\/\\]/g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printArchivedEventSheet(eventId) {
  const isAr = lang === "ar";
  const archive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
  const ev = archive.find(x => x.id === eventId);
  if (!ev) return;
  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'كشف حضور فعالية معتمدة' : 'Archived Event Attendance Sheet'} — ${ev.title}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 24px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 12px; margin-bottom: 18px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; flex-wrap: wrap; gap: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; padding-top: 14px; border-top: 1px dashed #ccc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'سجل حضور رسمي معتمد — حافظة الفعاليات' : 'Official Archived Event Attendance Record'}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'اسم الفعالية: ' : 'Event: '}<b>${ev.title}</b></div>
        <div>${isAr ? 'تاريخ الانعقاد: ' : 'Date: '}<b>${ev.date} ${ev.time ? `(${ev.time})` : ''}</b></div>
        <div>${isAr ? 'عدد الحضور المسجل: ' : 'Total Attendees: '}<b>${(ev.attendees || []).length} ${isAr ? 'طالب' : 'students'}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'الفرقة' : 'Year'}</th>
            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
            <th>${isAr ? 'رقم الهاتف' : 'Phone'}</th>
            <th>${isAr ? 'وقت التسجيل' : 'Time'}</th>
          </tr>
        </thead>
        <tbody>
          ${(ev.attendees || []).length === 0 ? `<tr><td colspan="8" style="text-align:center">${isAr ? 'لا يوجد حضور مسجل في هذه الفعالية.' : 'No attendees recorded.'}</td></tr>` : ev.attendees.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${a.studentName}</b></td>
              <td><code>${a.nid || '—'}</code></td>
              <td>${getCollegeName(a.college || '—')}</td>
              <td>${getYearName(a.year || '—')}</td>
              <td>${getComName(a.committee || '—')}</td>
              <td dir="ltr" style="text-align:right">${a.phone || '—'}</td>
              <td>${a.time || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <div>${isAr ? 'مسؤول التنظيم: ' : 'OC Head: '}<b>محمد أشرف (Vice Head of OC)</b></div>
        <div>${isAr ? 'اعتماد رائد الأسرة: ' : 'Supervisor Approval: '}<b>د. محمد حلمي</b></div>
      </div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}


/* >>> MODULE: 08_events.js <<< */
/**
 * 08_events.js - Delegated Event Listeners & Interactive UI Wiring
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Portal & Admin event handlers ---------- */
app.addEventListener("click", async e => {
  if (e.target.closest("#btn-show-register") || e.target.closest("#btn-show-register-sub")) {
    curAuthMode = "register";
    history.replaceState(null, "", "/register");
    render("keep");
    return;
  }
  if (e.target.closest("#btn-show-login") || e.target.closest("#btn-show-login-sub")) {
    curAuthMode = "login";
    history.replaceState(null, "", "/login");
    render("keep");
    return;
  }

  // Profile Edit Toggles
  if (e.target.closest("#btn-toggle-edit-profile")) {
    isEditingProfile = !isEditingProfile;
    render("keep");
    return;
  }
  if (e.target.closest("#btn-close-edit-profile")) {
    isEditingProfile = false;
    render("keep");
    return;
  }

  // Admin Print & Export buttons
  // Directory view mode switcher
  const viewModeBtn = e.target.closest("[data-view-mode]");
  if (viewModeBtn) {
    memberViewMode = viewModeBtn.dataset.viewMode;
    render("keep");
    return;
  }

  if (e.target.closest("#btn-print-attendance")) {
    printAttendanceReport();
    return;
  }
  if (e.target.closest("#btn-export-attendance-csv")) {
    exportAttendanceCSV();
    return;
  }
  if (e.target.closest("#btn-print-students")) {
    printStudentsDirectory();
    return;
  }
  if (e.target.closest("#btn-export-students-csv")) {
    exportStudentsCSV();
    return;
  }

  // Photo zoom for admin & members — show member photo in lightbox
  const avZoom = e.target.closest(".av-zoom-btn");
  if (avZoom) {
    e.preventDefault();
    e.stopPropagation();
    const photo = avZoom.dataset.photo || avZoom.querySelector("img")?.src;
    const name = avZoom.dataset.name || avZoom.querySelector("img")?.alt || "";
    if (photo) {
      openMemberPhoto(photo, name);
    }
    return;
  }

  // Bio modal — leader / head profile card click
  const bioBtnEl = e.target.closest(".av-bio-btn, [data-bio]");
  if (bioBtnEl && !e.target.closest("#bio-modal")) {
    e.preventDefault();
    const bioKey = bioBtnEl.dataset.bio;
    if (bioKey) openBioModal(bioKey);
    return;
  }
  // Close bio modal
  if (e.target.closest("#bio-modal-x") || e.target === document.getElementById("bio-modal")) {
    closeBioModal();
    return;
  }

  // QR Scanner buttons
  if (e.target.closest("#btn-open-qr-scanner")) {
    await startQrScanner();
    return;
  }
  if (e.target.closest("#btn-close-qr-scanner")) {
    stopQrScanner();
    return;
  }

  const atab = e.target.closest("[data-atab]");
  if (atab) { curAtab = atab.dataset.atab; render("keep"); return; }

  const pwBtn = e.target.closest(".pw-toggle-btn");
  if (pwBtn) {
    const inp = pwBtn.parentElement.querySelector("input");
    if (inp) {
      if (inp.type === "password") {
        inp.type = "text";
        pwBtn.textContent = "🙈";
      } else {
        inp.type = "password";
        pwBtn.textContent = "👁️";
      }
    }
    return;
  }

  if (e.target.closest("#logout-btn")) {
    const isAr = lang === "ar";
    if (confirm(isAr ? "هل أنت متأكد من رغبتك في تسجيل الخروج من الحساب؟" : "Are you sure you want to log out?")) {
      localStorage.removeItem("cf_role");
      localStorage.removeItem("cf_user_id");
      localStorage.removeItem("cf_user_name");
      isEditingProfile = false;
      curAuthMode = "login";
      go("/portal");
    }
    return;
  }

  // Admin stops QR → archive attendees then clear
  if (e.target.closest("#btn-stop-qr") || e.target.closest("#btn-stop-qr-2")) {
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل تريد إنهاء الفعالية الحالية وإيقاف الـ QR وأرشفة سجلات الحضور؟" : "End event, stop QR and archive attendance records?")) return;
    const stopBtn = e.target.closest("#btn-stop-qr") || e.target.closest("#btn-stop-qr-2");
    if (stopBtn) { stopBtn.disabled = true; stopBtn.textContent = isAr ? '⏳ جاري الإنهاء...' : 'Stopping...'; }

    const activeQr = getStore("cf_active_qr", {});
    const attendances = getStore("cf_attendance", []);
    const eventsArchive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);

    let enrichedAttendees = [];
    if (activeQr.title) {
      const users = getUsers();
      enrichedAttendees = attendances
        .filter(a => a.event === activeQr.title)
        .map(a => {
          const u = users.find(x => x.id === a.studentId) || {};
          return {
            studentId: a.studentId,
            studentName: a.studentName || u.name || "—",
            college: a.college || u.college || "—",
            committee: a.committee || u.com || "—",
            year: a.year || u.year || "—",
            phone: a.phone || u.phone || "—",
            nid: a.nid || u.nid || "—",
            photo: a.photo || u.photo || "",
            time: a.time,
            date: a.date
          };
        });
    }

    const archivePayload = activeQr.title ? {
      title: activeQr.title,
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      attendees: enrichedAttendees
    } : null;

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'STOP_QR',
          requesterId: curUser?.id,
          requesterNid: curUser?.nid,
          archiveData: archivePayload
        })
      });
    } catch (err) {}

    if (archivePayload) {
      eventsArchive.unshift({
        id: "ev-" + Date.now(),
        title: archivePayload.title,
        date: archivePayload.date,
        time: archivePayload.time,
        totalAttendees: enrichedAttendees.length,
        attendees: enrichedAttendees
      });
      setStore("cf_events_archive", eventsArchive);
    }
    setStore("cf_attendance", []);
    setStore("cf_active_qr", { active: false, title: "", image: "" });
    render("keep");
    return;
  }

  // Student registers attendance for active QR
  if (e.target.closest("#btn-student-record-att")) {
    const btn = e.target.closest("#btn-student-record-att");
    const userId = localStorage.getItem("cf_user_id");
    const users = getUsers();
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === userId);
    const activeQr = getStore("cf_active_qr", { active: false });
    const isAr = lang === "ar";
    if (!curUser || !activeQr.active) return;

    btn.disabled = true;
    btn.textContent = isAr ? '⏳ جاري توثيق الحضور في السيرفر...' : 'Recording attendance...';

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: curUser.id,
          eventTitle: activeQr.title
        })
      });
      const data = await res.json();
      if (data.success) {
        let attendances = getStore("cf_attendance", []);
        attendances.unshift({
          id: "att-" + Date.now(),
          studentId: curUser.id,
          studentName: curUser.name,
          college: curUser.college,
          committee: curUser.com,
          year: curUser.year,
          phone: curUser.phone || "—",
          nid: curUser.nid || "—",
          photo: curUser.photo || "",
          event: activeQr.title,
          time: new Date().toLocaleTimeString('ar-EG'),
          date: new Date().toLocaleDateString('ar-EG')
        });
        setStore("cf_attendance", attendances);
        await syncAttendanceWithCloud();
        render("keep");
      } else {
        alert(data.error || (isAr ? 'فشل تسجيل الحضور.' : 'Failed to record attendance.'));
        btn.disabled = false;
        btn.textContent = isAr ? 'تسجيل حضوري الآن في الفعالية ✅' : 'Record My Attendance Now ✅';
      }
    } catch (err) {
      alert(isAr ? 'حدث خطأ أثناء الاتصال بالسيرفر.' : 'Connection error.');
      btn.disabled = false;
      btn.textContent = isAr ? 'تسجيل حضوري الآن في الفعالية ✅' : 'Record My Attendance Now ✅';
    }
    return;
  }

  const toggleSug = e.target.closest("[data-toggle-sug]");
  if (toggleSug) {
    const id = toggleSug.dataset.toggleSug;
    const sugs = getStore("cf_sugs", []);
    const item = sugs.find(x => x.id === id);
    if (item) {
      item.done = !item.done;
      setStore("cf_sugs", sugs);
      render("keep");
      try {
        await fetch('/api/suggestions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (err) {
        console.warn('Suggestion status update notice:', err);
      }
    }
    return;
  }

  const delSug = e.target.closest("[data-delete-sug]");
  if (delSug) {
    const id = delSug.dataset.deleteSug;
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل أنت متأكد من رغبتك في مسح هذا المقترح نهائياً من قاعدة البيانات؟" : "Are you sure you want to permanently delete this suggestion?")) {
      return;
    }
    delSug.disabled = true;
    delSug.textContent = isAr ? 'جاري المسح...' : 'Deleting...';
    try {
      const res = await fetch(`/api/suggestions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        let sugs = getStore("cf_sugs", []).filter(x => x.id !== id);
        setStore("cf_sugs", sugs);
        render("keep");
      } else {
        alert(data.error || (isAr ? "فشل مسح المقترح." : "Failed to delete suggestion."));
        delSug.disabled = false;
        delSug.textContent = isAr ? 'مسح' : 'Delete';
      }
    } catch (e) {
      alert(isAr ? "حدث خطأ في الاتصال بالخادم." : "Connection failed.");
      delSug.disabled = false;
      delSug.textContent = isAr ? 'مسح' : 'Delete';
    }
    return;
  }

  if (e.target.closest("#btn-sync-sugs-now")) {
    const btn = e.target.closest("#btn-sync-sugs-now");
    const isAr = lang === "ar";
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري التحديث...' : 'Syncing...';
    await syncSuggestionsWithCloud();
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث' : '✓ Synced';
    render("keep");
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث المقترحات' : 'Refresh Suggestions';
    }, 2000);
    return;
  }

  const delGalleryItem = e.target.closest("[data-delete-gallery-item]");
  if (delGalleryItem) {
    const id = delGalleryItem.dataset.deleteGalleryItem;
    const itemUrl = delGalleryItem.dataset.itemUrl;
    const isAr = lang === "ar";
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      alert(isAr ? "عذراً، صلاحية حذف عناصر المعرض مقتصرة حصرياً على المشرف العام (محمد أشرف)." : "Unauthorized: Super Admin only.");
      return;
    }
    if (!confirm(isAr ? "هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً من المعرض وقاعدة البيانات؟" : "Are you sure you want to permanently delete this item from the gallery and database?")) {
      return;
    }
    delGalleryItem.disabled = true;
    delGalleryItem.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';
    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          url: itemUrl,
          requesterId: curUser.id,
          requesterNid: curUser.nid
        })
      });
      const data = await res.json();
      if (data.success) {
        let gal = getGalleryItems().filter(x => x.id !== id && x.url !== itemUrl && x.url !== id);
        saveGalleryItems(gal);
        render("keep");
      } else {
        alert(data.error || (isAr ? "فشل حذف العنصر." : "Failed to delete item."));
        delGalleryItem.disabled = false;
        delGalleryItem.textContent = isAr ? 'حذف من المعرض' : 'Delete';
      }
    } catch (e) {
      alert(isAr ? "حدث خطأ في الاتصال بالخادم." : "Connection failed.");
      delGalleryItem.disabled = false;
      delGalleryItem.textContent = isAr ? 'حذف من المعرض' : 'Delete';
    }
    return;
  }

  if (e.target.closest("#btn-sync-gallery-now")) {
    const btn = e.target.closest("#btn-sync-gallery-now");
    const isAr = lang === "ar";
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري التحديث...' : 'Syncing...';
    await syncGalleryWithCloud();
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث' : '✓ Synced';
    render("keep");
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث المعرض' : 'Refresh Gallery';
    }, 2000);
    return;
  }

  const evalStd = e.target.closest("[data-eval-std]");
  if (evalStd) {
    selectedEvalStudentId = evalStd.dataset.evalStd;
    curAtab = "evals";
    render("keep");
    return;
  }

  const toggleAdmin = e.target.closest("[data-toggle-admin]");
  if (toggleAdmin) {
    const sid = toggleAdmin.dataset.toggleAdmin;
    const users = getUsers();
    const s = users.find(u => u.id === sid);
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === curUserId);
    const isAr = lang === "ar";

    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      alert(isAr ? 'عذراً، صلاحية تعيين وسحب الأدمن مقتصرة حصرياً على المشرف العام (محمد أشرف).' : 'Only the Super Admin can promote or demote admins.');
      return;
    }

    if (s) {
      const newRole = s.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
      toggleAdmin.disabled = true;
      toggleAdmin.textContent = isAr ? 'جاري التحديث...' : 'Updating...';

      try {
        const res = await fetch('/api/students', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: s.id,
            role: newRole,
            requesterId: curUser.id,
            requesterNid: curUser.nid
          })
        });
        const data = await res.json();
        if (data.success) {
          s.role = newRole;
          saveUsers(users);
          render("keep");
        } else {
          alert(data.error || (isAr ? 'فشل تحديث الصلاحية في قاعدة البيانات.' : 'Failed to update role in cloud.'));
          toggleAdmin.disabled = false;
        }
      } catch (err) {
        alert(isAr ? 'تعذر الاتصال بالخادم.' : 'Connection failed.');
        toggleAdmin.disabled = false;
      }
    }
    return;
  }

  // Live cloud sync button
  if (e.target.closest("#btn-sync-cloud-now")) {
    const isAr = lang === "ar";
    const btn = e.target.closest("#btn-sync-cloud-now");
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري المزامنة...' : 'Syncing...';
    await syncWithCloud(true);
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث بنجاح' : '✓ Synced';
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث فوري من قاعدة البيانات' : 'Sync Live';
    }, 2000);
    return;
  }

  // Delete Member Permanently
  const delStd = e.target.closest("[data-delete-student]");
  if (delStd) {
    const sid = delStd.dataset.deleteStudent;
    const sname = delStd.dataset.studentName || 'هذا العضو';
    const snid = delStd.dataset.studentNid || '';
    const isAr = lang === "ar";

    if (!confirm(isAr 
      ? `⚠️ تحذير نهائي:\nهل أنت متأكد من رغبتك في حذف العضو (${sname}) نهائياً؟\nسيتم مسح حسابه وسجلات حضوره وتقييماته من قاعدة البيانات بالكامل كأنه لم يدخل إطلاقاً.` 
      : `⚠️ Are you sure you want to permanently erase member (${sname})? All data will be deleted.`)) {
      return;
    }

    delStd.disabled = true;
    delStd.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';

    // 1. Delete from PostgreSQL Cloud Database
    try {
      const curUserId = localStorage.getItem("cf_user_id");
      const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
      const res = await fetch(`/api/students?id=${encodeURIComponent(sid)}&nid=${encodeURIComponent(snid)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sid,
          nid: snid,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || (isAr ? 'فشل حذف العضو من قاعدة البيانات.' : 'Failed to delete member from cloud.'));
        delStd.disabled = false;
        delStd.textContent = isAr ? 'حذف' : 'Delete';
        return;
      }
    } catch (err) {
      console.warn('Cloud delete notice:', err);
    }

    // 2. Erase from local storage
    let currentUsers = getUsers().filter(u => u.id !== sid && u.nid !== snid);
    saveUsers(currentUsers);

    // 3. Erase from attendance records
    let currentAtts = getStore("cf_attendance", []).filter(a => a.studentId !== sid && a.nid !== snid);
    setStore("cf_attendance", currentAtts);

    // 4. Erase from archived events attendees
    let currentArchive = getStore("cf_events_archive", []);
    currentArchive.forEach(ev => {
      if (ev.attendees) {
        ev.attendees = ev.attendees.filter(a => a.studentId !== sid && a.nid !== snid);
        ev.totalAttendees = ev.attendees.length;
      }
    });
    setStore("cf_events_archive", currentArchive);

    alert(isAr ? `✅ تم حذف العضو (${sname}) وكافة بياناته نهائياً من قاعدة البيانات.` : `✅ Member and all records deleted permanently.`);
    render("keep");
    return;
  }

  // Clear eval search
  if (e.target.closest("#btn-clear-eval-search")) {
    evalSearchQuery = "";
    selectedEvalStudentId = "";
    render("keep");
    return;
  }

  // Select eval member from grid
  const selectEvalStd = e.target.closest("[data-select-eval-std]");
  if (selectEvalStd) {
    selectedEvalStudentId = selectEvalStd.dataset.selectEvalStd;
    render("keep");
    return;
  }

  // Toggle event archive expand/collapse
  const toggleEventArchive = e.target.closest("[data-toggle-event-archive]");
  if (toggleEventArchive) {
    const eid = toggleEventArchive.dataset.toggleEventArchive;
    openedEventArchiveId = openedEventArchiveId === eid ? "" : eid;
    render("keep");
    return;
  }

  // Export archived event CSV
  const exportEventCsv = e.target.closest("[data-export-event-csv]");
  if (exportEventCsv) {
    exportArchivedEventCSV(exportEventCsv.dataset.exportEventCsv);
    return;
  }

  // Print archived event sheet
  const printEvent = e.target.closest("[data-print-event]");
  if (printEvent) {
    printArchivedEventSheet(printEvent.dataset.printEvent);
    return;
  }

  // Delete archived event
  const deleteEvent = e.target.closest("[data-delete-event]");
  if (deleteEvent) {
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل تريد حذف كشف هذه الفعالية نهائياً من الأرشيف السحابي؟" : "Permanently delete this event from archive?")) return;
    const eid = deleteEvent.dataset.deleteEvent;
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);

    deleteEvent.disabled = true;
    deleteEvent.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';

    // 1. Add to deleted IDs set in localStorage
    let deletedIds = getStore("cf_deleted_archive_ids", []);
    if (!deletedIds.includes(eid)) {
      deletedIds.push(eid);
      setStore("cf_deleted_archive_ids", deletedIds);
    }

    // 2. Call backend DELETE to erase permanently from PostgreSQL events_archive
    try {
      await fetch('/api/attendance', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archiveId: eid,
          id: eid,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
    } catch (err) {
      console.warn('Archive delete error:', err);
    }

    // 3. Update local store
    const archive = getStore("cf_events_archive", []);
    const updated = archive.filter(ev => ev.id !== eid);
    setStore("cf_events_archive", updated);
    if (openedEventArchiveId === eid) openedEventArchiveId = "";
    render("keep");
    return;
  }
});

function compressAndResizeImage(file, maxDim, callback, quality = 0.90) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let w = img.width, h = img.height;
      if (w > h) {
        if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
      } else {
        if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function() { callback("/assets/images/logo.png"); };
    img.src = e.target.result;
  };
  reader.onerror = function() { callback("/assets/images/logo.png"); };
  reader.readAsDataURL(file);
}

// Profile photo upload preview in register & edit form
app.addEventListener("change", e => {
  if (e.target.id === "photo-file-input") {
    const file = e.target.files && e.target.files[0];
    if (file) {
      compressAndResizeImage(file, 1080, base64 => {
        regPhotoBase64 = base64;
        const box = $("#photo-preview-box");
        if (box) box.innerHTML = `<img src="${regPhotoBase64}" alt="Preview" style="width:100%;height:100%;object-fit:cover">`;
      }, 0.90);
    }
  }

  if (e.target.id === "edit-photo-file-input") {
    const file = e.target.files && e.target.files[0];
    if (file) {
      compressAndResizeImage(file, 1080, base64 => {
        editPhotoBase64 = base64;
        const box = $("#edit-photo-preview-box");
        if (box) box.innerHTML = `<img src="${editPhotoBase64}" alt="Preview" style="width:100%;height:100%;object-fit:cover">`;
      }, 0.90);
    }
  }

  if (e.target.id === "gallery-media-type") {
    const val = e.target.value;
    const fileWrap = $("#gallery-file-wrap");
    const vidWrap = $("#gallery-video-wrap");
    if (fileWrap && vidWrap) {
      fileWrap.style.display = val === "IMAGE" ? "block" : "none";
      vidWrap.style.display = val === "VIDEO" ? "block" : "none";
    }
  }

  if (e.target.id === "gallery-file-input") {
    const file = e.target.files && e.target.files[0];
    const prevCont = $("#gallery-preview-container");
    const prevImg = $("#gallery-preview-img");
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (prevImg) prevImg.src = ev.target.result;
        if (prevCont) prevCont.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      if (prevCont) prevCont.style.display = "none";
    }
  }

  if (e.target.name === "video_source_mode") {
    const isFile = e.target.value === "file";
    const fileSub = $("#video-file-subwrap");
    const urlSub = $("#video-url-subwrap");
    if (fileSub && urlSub) {
      fileSub.style.display = isFile ? "block" : "none";
      urlSub.style.display = isFile ? "none" : "block";
    }
  }

  if (e.target.id === "gallery-video-file-input") {
    const file = e.target.files && e.target.files[0];
    const prevCont = $("#gallery-video-preview-container");
    const prevVid = $("#gallery-video-preview-el");
    const msgEl = $("#gallery-form-msg");
    if (file) {
      const maxBytes = 4.2 * 1024 * 1024;
      if (file.size > maxBytes) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        if (msgEl) {
          msgEl.innerHTML = lang === "ar"
            ? `⚠️ حجم ملف الفيديو (${sizeMB} ميجا) يتجاوز الحد المسموح للرفع المباشر (4.2 ميجا).<br>💡 يُرجى اختيار <b>(رابط من أي منصة)</b> ووضع رابط الفيديو من فيسبوك أو يوتيوب أو تيك توك وسيعمل بأعلى جودة وبدون أي حد للحجم!`
            : `⚠️ Video size (${sizeMB}MB) exceeds 4.2MB limit. Please use the video link option.`;
          msgEl.style.color = 'var(--red)';
        }
        e.target.value = '';
        if (prevCont) prevCont.style.display = "none";
        return;
      }
      if (msgEl) msgEl.textContent = '';
      const objUrl = URL.createObjectURL(file);
      if (prevVid) prevVid.src = objUrl;
      if (prevCont) prevCont.style.display = "block";
    } else {
      if (prevCont) prevCont.style.display = "none";
    }
  }
});

// Form Submissions
app.addEventListener("submit", async e => {
  // 1. Unified Login Form
  const loginForm = e.target.closest("#unified-login-form");
  if (loginForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const msg = $("#login-msg");
    const submitBtn = loginForm.querySelector("button[type=submit]");

    if (lockoutSecondsRemaining > 0) {
      msg.className = "msg bad";
      msg.textContent = isAr 
        ? `⚠️ تم قفل محاولات تسجيل الدخول مؤقتاً لحماية حسابك. يرجى الانتظار (${lockoutSecondsRemaining}) ثانية.`
        : `⚠️ Too many failed attempts. Please wait (${lockoutSecondsRemaining})s before retrying.`;
      return;
    }

    let nid = loginForm.nid.value.trim();
    const pw = loginForm.pw.value.trim();
    nid = nid.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `<span class="spinner"></span> ${isAr ? 'جاري التحقق من الهوية والصلاحيات...' : 'Authenticating...'}`;
    }
    msg.className = "msg";
    msg.textContent = isAr ? "جاري تسجيل الدخول..." : "Signing in...";

    let authenticatedUser = null;
    let serverError = "";

    // 1. Try Remote Cloud Database API first
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nid, pw })
      });
      const data = await res.json();
      if (data.success && data.user) {
        authenticatedUser = data.user;
      } else if (data.error) {
        serverError = data.error;
      }
    } catch (apiErr) {
      console.warn('Remote auth notice:', apiErr);
    }

    // 2. Fallback to local verified users if offline or network failure
    if (!authenticatedUser) {
      const users = getUsers();
      authenticatedUser = users.find(u => u.nid === nid && u.pw === pw);
    }

    if (authenticatedUser) {
      loginAttempts = 0;
      msg.className = "msg";
      msg.textContent = isAr ? "✅ تم التحقق بنجاح! جاري الدخول للوحة التحكم..." : "✅ Authenticated! Redirecting...";
      
      // Update local storage with current verified user
      const users = getUsers();
      const existingIdx = users.findIndex(u => u.nid === authenticatedUser.nid);
      if (existingIdx >= 0) users[existingIdx] = { ...users[existingIdx], ...authenticatedUser };
      else users.unshift(authenticatedUser);
      saveUsers(users);

      setStore("cf_cur_user", authenticatedUser);
      localStorage.setItem("cf_role", authenticatedUser.role);
      localStorage.setItem("cf_user_id", authenticatedUser.id);
      localStorage.setItem("cf_user_name", authenticatedUser.name);
      setTimeout(() => {
        const isAdmin = authenticatedUser.role === "ADMIN" || authenticatedUser.role === "SUPER_ADMIN" || authenticatedUser.isSuperAdmin;
        history.replaceState(null, "", isAdmin ? "/admin" : "/portal");
        render();
      }, 350);
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        submitBtn.textContent = isAr ? 'تسجيل الدخول' : 'Sign In';
      }
      loginAttempts++;
      if (loginAttempts >= 5) {
        lockoutSecondsRemaining = 60;
        if (submitBtn) submitBtn.disabled = true;
        msg.className = "msg bad";
        msg.textContent = isAr 
          ? `🔒 تم قفل محاولات الدخول مؤقتاً لمدة 60 ثانية لحماية الحساب من التخمين.`
          : `🔒 Temporarily locked for 60 seconds due to repeated failed attempts.`;

        clearInterval(lockoutTimer);
        lockoutTimer = setInterval(() => {
          lockoutSecondsRemaining--;
          if (lockoutSecondsRemaining <= 0) {
            clearInterval(lockoutTimer);
            loginAttempts = 0;
            if (submitBtn) submitBtn.disabled = false;
            msg.className = "msg";
            msg.textContent = isAr ? "يمكنك الآن المحاولة مجدداً." : "You can try logging in now.";
          } else {
            msg.textContent = isAr 
              ? `🔒 متبقي (${lockoutSecondsRemaining}) ثانية لفك القفل المؤقت...`
              : `🔒 Locked. (${lockoutSecondsRemaining})s remaining...`;
          }
        }, 1000);
      } else {
        const remaining = 5 - loginAttempts;
        msg.className = "msg bad";
        msg.textContent = (serverError ? serverError + " " : (isAr ? "الرقم القومي أو كلمة المرور غير صحيحة. " : "Invalid National ID or password. ")) + (isAr 
          ? `(محاولات متبقية قبل القفل: ${remaining})`
          : `(${remaining} attempts left)`);
      }
    }
    return;
  }

  // 2. Register Form
  const regForm = e.target.closest("#unified-register-form");
  if (regForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const fullName = regForm.fullName.value.trim();
    const nid = regForm.nid.value.trim();
    const pw = regForm.pw.value.trim();
    const pwConfirm = regForm.pwConfirm.value.trim();
    const phone = regForm.phone.value.trim();
    const email = (regForm.email && regForm.email.value.trim()) || "";
    const college = regForm.college.value;
    const year = regForm.year.value;
    const com = regForm.com.value;
    const msg = $("#reg-msg");
    const submitBtn = regForm.querySelector("button[type=submit]");

    if (pw !== pwConfirm) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "كلمة المرور وتأكيدها غير متطابقين." : "Passwords do not match.";
      return;
    }
    if (!/^[0-9]{14}$/.test(nid)) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "الرقم القومي يجب أن يتكون من 14 رقماً بالضبط." : "National ID must be exactly 14 digits.";
      return;
    }

    const users = getUsers();
    if (users.some(u => u.nid === nid)) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "الرقم القومي هذا مسجل بالفعل. يرجى تسجيل الدخول مباشرة." : "This National ID is already registered. Please sign in.";
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `<span class="spinner"></span> ${isAr ? 'جاري إنشاء الحساب وتفعيل العضوية...' : 'Creating account...'}`;
    }

    let newUser = {
      id: "std-" + Date.now(),
      name: sanitize(fullName),
      nid: sanitize(nid),
      pw: pw,
      phone: sanitize(phone),
      email: sanitize(email),
      college: sanitize(college),
      year: sanitize(year),
      com: sanitize(com),
      photo: regPhotoBase64 || "/assets/images/logo.png",
      role: "STUDENT",
      score: 9.0,
      status: "نشط",
      createdAt: new Date().toLocaleDateString('ar-EG')
    };

    // Save to PostgreSQL Cloud Database
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUser.name,
          nid: newUser.nid,
          pw: newUser.pw,
          phone: newUser.phone,
          email: newUser.email,
          college: newUser.college,
          year: newUser.year,
          com: newUser.com,
          photo: newUser.photo
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        newUser = { ...newUser, ...data.user };
      }
    } catch (cloudErr) {
      console.warn('Cloud registration sync notice:', cloudErr);
    }

    users.push(newUser);
    saveUsers(users);

    msg.className = "msg";
    msg.textContent = isAr ? "✅ تم إنشاء الحساب بنجاح! جاري تحويلك لبوابتك..." : "✅ Account created successfully! Redirecting...";
    localStorage.setItem("cf_role", "STUDENT");
    localStorage.setItem("cf_user_id", newUser.id);
    localStorage.setItem("cf_user_name", newUser.name);
    setTimeout(() => {
      history.replaceState(null, "", "/portal");
      render();
    }, 400);
    return;
  }

  // 3. Admin Upload QR Form — starts attendance session (no image needed)
  const qrForm = e.target.closest("#admin-upload-qr-form");
  if (qrForm) {
    e.preventDefault();
    const title = (qrForm.eventTitle.value || "").trim();
    const msg = $("#admin-qr-msg");
    const submitBtn = qrForm.querySelector("button[type=submit]");
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    const isAr = lang === "ar";

    if (!title) {
      if (msg) { msg.className = "msg bad"; msg.textContent = isAr ? "يرجى كتابة عنوان الاجتماع/الفعالية." : "Please enter a meeting/event title."; }
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? "⏳ جاري البدء..." : "Starting..."; }
    if (msg) { msg.className = "msg"; msg.textContent = ""; }

    fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SET_ACTIVE_QR',
        title: title,
        image: '',
        requesterId: curUser?.id,
        requesterNid: curUser?.nid
      })
    }).then(r => r.json()).then(data => {
      if (data.success) {
        setStore("cf_active_qr", {
          active: true,
          title: title,
          image: '',
          createdAt: new Date().toLocaleTimeString('ar-EG')
        });
        if (msg) { msg.className = "msg"; msg.textContent = isAr ? "✅ تم بدء جلسة الحضور! QR خاص يظهر الآن لكل عضو في بوابته 🚀" : "✅ Attendance session started! Each member now sees their personal QR."; }
        setTimeout(() => render("keep"), 400);
      } else {
        if (msg) { msg.className = "msg bad"; msg.textContent = data.error || (isAr ? "فشل بدء الجلسة." : "Failed to start session."); }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? "🚀 بدء جلسة الحضور" : "🚀 Start Session"; }
      }
    }).catch(() => {
      if (msg) { msg.className = "msg bad"; msg.textContent = isAr ? "حدث خطأ في الاتصال بالسيرفر." : "Connection error."; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? "🚀 بدء جلسة الحضور" : "🚀 Start Session"; }
    });
    return;
  }

  // 4. Admin Evaluation Form
  const evalForm = e.target.closest("#new-eval-form");
  if (evalForm) {
    e.preventDefault();
    const sid = evalForm.studentId.value;
    const score = parseFloat(evalForm.score.value);
    const notes = evalForm.notes.value.trim();
    const users = getUsers();
    const s = users.find(u => u.id === sid);
    const isAr = lang === "ar";
    const m = $("#eval-msg");
    const submitBtn = evalForm.querySelector("button[type=submit]");
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === curUserId);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isAr ? "جاري الحفظ في السيرفر..." : "Saving to database...";
    }

    try {
      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sid,
          score: score,
          notes: notes,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
      const data = await res.json();
      if (data.success) {
        if (s) {
          s.score = score;
          s.notes = notes;
          saveUsers(users);
        }
        if (m) {
          m.className = "msg";
          m.textContent = isAr ? `✅ تم حفظ وتحديث تقييم العضو (${s ? s.name : ''}) في قاعدة البيانات بنجاح (${score} / 10) 🌟` : `Evaluation updated in database (${score} / 10) 🌟`;
        }
        await syncWithCloud(true);
      } else {
        if (m) {
          m.className = "msg bad";
          m.textContent = data.error || (isAr ? "⚠️ فشل حفظ التقييم في قاعدة البيانات." : "Failed to save evaluation.");
        }
      }
    } catch (err) {
      if (m) {
        m.className = "msg bad";
        m.textContent = isAr ? "⚠️ حدث خطأ في الاتصال بالسيرفر." : "Connection failed.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isAr ? "اعتماد وحفظ التقييم" : "Save Evaluation";
      }
    }
    return;
  }

  // 5. Edit Profile Form
  const editProfForm = e.target.closest("#edit-profile-form");
  if (editProfForm) {
    e.preventDefault();
    const userId = localStorage.getItem("cf_user_id");
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    const msg = $("#edit-prof-msg");
    if (!user) return;

    const phone = editProfForm.phone.value.trim();
    const email = editProfForm.email.value.trim();
    const newPw = editProfForm.newPw.value.trim();
    const newPwConfirm = editProfForm.newPwConfirm.value.trim();

    if (newPw) {
      if (newPw !== newPwConfirm) {
        msg.className = "msg bad";
        msg.textContent = lang === "ar" ? "كلمة المرور الجديدة وتأكيدها غير متطابقين." : "New passwords do not match.";
        return;
      }
      if (newPw.length < 6) {
        msg.className = "msg bad";
        msg.textContent = lang === "ar" ? "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل." : "Password must be at least 6 characters.";
        return;
      }
      user.pw = newPw;
    }

    user.phone = sanitize(phone);
    user.email = sanitize(email);
    if (editPhotoBase64) {
      user.photo = editPhotoBase64;
    }

    saveUsers(users);
    setStore("cf_cur_user", user);
    msg.className = "msg";
    msg.textContent = lang === "ar" ? "⏳ جاري حفظ التعديلات على السيرفر..." : "⏳ Saving to server...";

    // Sync photo + profile to cloud DB
    try {
      const patchBody = { id: user.id, phone: user.phone, email: user.email, requesterId: user.id, requesterNid: user.nid };
      if (editPhotoBase64) patchBody.photo = editPhotoBase64;
      await fetch('/api/students', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patchBody) });
    } catch (_) {}

    msg.className = "msg";
    msg.textContent = lang === "ar" ? "✅ تم تحديث بياناتك بنجاح على السيرفر!" : "✅ Profile updated on server!";
    setTimeout(() => {
      isEditingProfile = false;
      editPhotoBase64 = "";
      render("keep");
    }, 600);
    return;
  }

  // 6. Admin Add Gallery Media Form
  const galForm = e.target.closest("#admin-add-gallery-form");
  if (galForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const msgEl = $("#gallery-form-msg");
    const submitBtn = $("#gallery-submit-btn");
    const mediaType = ($("#gallery-media-type") || {}).value || "IMAGE";
    const title = (($("#gallery-media-title") || {}).value || "").trim();

    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      if (msgEl) {
        msgEl.textContent = isAr ? '⚠️ غير مصرح: هذه الميزة للمشرف العام فقط.' : '⚠️ Unauthorized: Super Admin only.';
        msgEl.style.color = 'var(--red)';
      }
      return;
    }

    if (mediaType === "IMAGE") {
      const fileInput = $("#gallery-file-input");
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        if (msgEl) {
          msgEl.textContent = isAr ? '⚠️ برجاء اختيار ملف صورة أولاً.' : '⚠️ Please select an image file first.';
          msgEl.style.color = 'var(--red)';
        }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري الضغط والرفع للسحابة...' : '⏳ Uploading...'; }
      if (msgEl) msgEl.textContent = '';

      compressAndResizeImage(file, 1200, async (base64) => {
        try {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: base64,
              type: 'IMAGE',
              title: title,
              requesterId: curUser.id,
              requesterNid: curUser.nid
            })
          });
          const data = await res.json();
          if (data.success) {
            const currentGal = getGalleryItems();
            const newItem = data.item ? {
              id: data.item.id,
              url: data.item.url,
              type: data.item.type || 'IMAGE',
              title: data.item.title || title,
              createdAt: data.item.created_at ? new Date(data.item.created_at).toISOString().slice(0, 10) : ''
            } : {
              id: 'gal-' + Date.now(),
              url: base64,
              type: 'IMAGE',
              title: title,
              createdAt: new Date().toISOString().slice(0, 10)
            };
            saveGalleryItems([newItem, ...currentGal.filter(x => x.id !== newItem.id)]);
            render('keep');
          } else {
            if (msgEl) {
              msgEl.textContent = data.error || (isAr ? '❌ حدث خطأ أثناء الرفع.' : '❌ Upload failed.');
              msgEl.style.color = 'var(--red)';
            }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
          }
        } catch (err) {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر الاتصال بالخادم.' : '❌ Server error.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        }
      });
    } else {
      // VIDEO: either file upload or link from any platform
      const isFileMode = $("#vmode-file") ? $("#vmode-file").checked : true;

      const saveVideoToCloud = async (finalUrl) => {
        try {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: finalUrl,
              type: 'VIDEO',
              title: title,
              requesterId: curUser.id,
              requesterNid: curUser.nid
            })
          });
          const data = await res.json();
          if (data.success) {
            const currentGal = getGalleryItems();
            const newItem = data.item ? {
              id: data.item.id,
              url: data.item.url,
              type: data.item.type || 'VIDEO',
              title: data.item.title || title,
              createdAt: data.item.created_at ? new Date(data.item.created_at).toISOString().slice(0, 10) : ''
            } : {
              id: 'gal-' + Date.now(),
              url: finalUrl,
              type: 'VIDEO',
              title: title,
              createdAt: new Date().toISOString().slice(0, 10)
            };
            saveGalleryItems([newItem, ...currentGal.filter(x => x.id !== newItem.id)]);
            render('keep');
          } else {
            if (msgEl) {
              msgEl.textContent = data.error || (isAr ? '❌ حدث خطأ أثناء الحفظ.' : '❌ Save failed.');
              msgEl.style.color = 'var(--red)';
            }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
          }
        } catch (err) {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر الاتصال بالخادم.' : '❌ Server error.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        }
      };

      if (isFileMode) {
        const vidFileInput = $("#gallery-video-file-input");
        const file = vidFileInput && vidFileInput.files && vidFileInput.files[0];
        if (!file) {
          if (msgEl) {
            msgEl.textContent = isAr ? '⚠️ برجاء اختيار ملف فيديو من جهازك أولاً.' : '⚠️ Please select a video file first.';
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (file.size > 4.2 * 1024 * 1024) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          if (msgEl) {
            msgEl.innerHTML = isAr 
              ? `⚠️ حجم ملف الفيديو (${sizeMB} ميجا) يتجاوز الحد المسموح للرفع المباشر (4.2 ميجا). يُرجى اختيار (رابط من أي منصة) لوضع رابطه من فيسبوك أو يوتيوب أو تيك توك بدون أي حد للحجم.`
              : `⚠️ Video size (${sizeMB}MB) exceeds 4.2MB limit.`;
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري تحويل ورفع ملف الفيديو للسحابة...' : '⏳ Uploading video...'; }
        if (msgEl) msgEl.textContent = '';

        const reader = new FileReader();
        reader.onload = async rev => {
          await saveVideoToCloud(rev.target.result);
        };
        reader.onerror = () => {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر قراءة ملف الفيديو.' : '❌ Failed to read video file.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        };
        reader.readAsDataURL(file);
      } else {
        // Video URL Mode (Facebook, TikTok, Instagram, YouTube, Vimeo, Drive, direct video)
        const vidInput = $("#gallery-video-url");
        const videoUrl = vidInput ? vidInput.value.trim() : '';
        if (!videoUrl) {
          if (msgEl) {
            msgEl.textContent = isAr ? '⚠️ برجاء كتابة رابط الفيديو من فيسبوك، تيك توك، يوتيوب، أو أي منصة.' : '⚠️ Please enter video URL.';
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري الحفظ في السحابة...' : '⏳ Saving...'; }
        if (msgEl) msgEl.textContent = '';

        await saveVideoToCloud(videoUrl);
      }
    }
    return;
  }
});

app.addEventListener("input", e => {
  const evalSearch = e.target.closest("#eval-search-inp");
  if (evalSearch) {
    evalSearchQuery = evalSearch.value;
    const curPos = evalSearch.selectionStart;
    render("keep");
    const newInp = document.getElementById("eval-search-inp");
    if (newInp) {
      newInp.focus();
      try { newInp.setSelectionRange(curPos, curPos); } catch {}
    }
    return;
  }

  const search = e.target.closest("#student-search");
  if (search) {
    studentSearchQuery = search.value.trim();
    render("keep");
    const newInp = document.getElementById("student-search");
    if (newInp) {
      newInp.focus();
      try { newInp.setSelectionRange(search.selectionStart, search.selectionStart); } catch {}
    }
    return;
  }
});

// Directory sort/filter/view controls
app.addEventListener("change", e => {
  if (e.target.id === "dir-sort-select") {
    memberSortBy = e.target.value;
    render("keep");
    return;
  }
  if (e.target.id === "dir-com-filter") {
    memberFilterCom = e.target.value;
    render("keep");
    return;
  }
  if (e.target.id === "dir-tier-filter") {
    memberFilterTier = e.target.value;
    render("keep");
    return;
  }
});

async function syncSuggestionsWithCloud() {
  try {
    const res = await fetch('/api/suggestions?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.suggestions)) {
      const localSugs = getStore("cf_sugs", []);
      const changed = JSON.stringify(data.suggestions) !== JSON.stringify(localSugs);
      if (changed) {
        setStore("cf_sugs", data.suggestions);
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {}
}

async function syncGalleryWithCloud() {
  try {
    const res = await fetch('/api/gallery?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.items)) {
      const local = getStore("cf_gallery", []);
      const changed = JSON.stringify(data.items) !== JSON.stringify(local);
      if (changed) {
        setStore("cf_gallery", data.items);
        const curPath = location.pathname;
        if (curPath === '/' || curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {}
}

async function syncAttendanceWithCloud() {
  try {
    const res = await fetch('/api/attendance?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success) {
      let changed = false;

      // 1. Sync Active QR Code
      if (data.activeQr) {
        const localQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
        const qrChanged = localQr.active !== data.activeQr.active ||
                          localQr.title !== data.activeQr.title ||
                          localQr.image !== data.activeQr.image;
        if (qrChanged) {
          setStore("cf_active_qr", data.activeQr);
          changed = true;
        }
      }

      // 2. Sync Live Attendances (API returns `attendees`, not `attendances`)
      const cloudAtts = data.attendees || data.attendances || null;
      if (Array.isArray(cloudAtts)) {
        const localAtts = getStore("cf_attendance", []);
        if (JSON.stringify(cloudAtts) !== JSON.stringify(localAtts)) {
          setStore("cf_attendance", cloudAtts);
          changed = true;
        }
      }

      // 3. Sync Archived Events (API returns `archives`, not `archivedEvents`)
      const cloudArchives = data.archives || data.archivedEvents || null;
      if (Array.isArray(cloudArchives)) {
        const deletedIds = getStore("cf_deleted_archive_ids", []);
        const filteredArch = cloudArchives.filter(e => !deletedIds.includes(e.id));
        const localArch = getStore("cf_events_archive", []);
        if (JSON.stringify(filteredArch) !== JSON.stringify(localArch)) {
          setStore("cf_events_archive", filteredArch);
          changed = true;
        }
      }

      if (changed) {
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
          // Re-generate member QR after re-render if student is viewing portal
          if (curPath === '/portal' && localStorage.getItem('cf_role') === 'STUDENT') {
            const userId = localStorage.getItem('cf_user_id');
            const user = getUsers().find(u => u.id === userId) || getStore('cf_cur_user', null);
            const aqr = getStore('cf_active_qr', { active: false, title: '' });
            if (user && aqr.active) setTimeout(() => generateMemberQr(user, aqr.title), 150);
          }
        }
      }
    }
  } catch (err) {}
}

async function syncWithCloud(forceRender) {
  try {
    const res = await fetch('/api/students?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.students)) {
      const localUsers = getUsers();

      // 1. Build authoritative user list from cloud
      let updatedList = data.students;

      const changed = JSON.stringify(updatedList.map(u => ({ id: u.id, nid: u.nid, role: u.role, score: u.score, notes: u.notes }))) !==
                      JSON.stringify(localUsers.map(u => ({ id: u.id, nid: u.nid, role: u.role, score: u.score, notes: u.notes })));

      if (changed || forceRender) {
        saveUsers(updatedList);
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {
    // Graceful offline fallback
  }

  syncSuggestionsWithCloud();
  syncGalleryWithCloud();
  syncAttendanceWithCloud();
}

/* ---------- Bio Modal (Leader / Head Profile) ---------- */
let bioModalOpener = null;

function openBioModal(bioKey) {
  const bios = (typeof CONFIG !== 'undefined' && CONFIG.bios) || (typeof C !== 'undefined' && C.bios) || {};
  const bio = bios[bioKey];
  if (!bio) return;

  const modal = document.getElementById('bio-modal');
  if (!modal) return;

  const isAr = lang === 'ar';

  // Fill content
  const photoEl = document.getElementById('bio-modal-photo');
  if (photoEl) { photoEl.src = bio.photo || '/assets/images/logo.png'; photoEl.alt = bio.name?.[isAr ? 'ar' : 'en'] || ''; }

  const nameEl = document.getElementById('bio-modal-name');
  if (nameEl) nameEl.textContent = bio.name?.[isAr ? 'ar' : 'en'] || '';

  const titleEl = document.getElementById('bio-modal-title-el');
  if (titleEl) titleEl.textContent = bio.title?.[isAr ? 'ar' : 'en'] || '';

  const tagsEl = document.getElementById('bio-modal-tags');
  if (tagsEl) {
    const tags = bio.tags?.[isAr ? 'ar' : 'en'] || [];
    tagsEl.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
  }

  const quoteEl = document.getElementById('bio-modal-quote');
  const quoteWrap = document.getElementById('bio-modal-quote-wrap');
  const quoteText = bio.quote?.[isAr ? 'ar' : 'en'] || '';
  if (quoteWrap) {
    if (quoteText && quoteText !== '«»' && quoteText !== '""') {
      quoteWrap.style.display = 'block';
      if (quoteEl) quoteEl.textContent = quoteText;
    } else {
      quoteWrap.style.display = 'none';
    }
  }

  const aboutLabel = document.getElementById('bio-about-label');
  if (aboutLabel) aboutLabel.textContent = isAr ? 'نبذة شخصية' : 'About';

  const aboutEl = document.getElementById('bio-modal-about');
  if (aboutEl) aboutEl.textContent = bio.about?.[isAr ? 'ar' : 'en'] || (isAr ? 'سيتم إضافة السيرة الذاتية قريباً.' : 'Bio coming soon.');

  const achLabel = document.getElementById('bio-ach-label');
  if (achLabel) achLabel.textContent = isAr ? 'الإنجازات والمسيرة' : 'Achievements & Journey';

  const achEl = document.getElementById('bio-modal-ach');
  if (achEl) {
    const achs = bio.achievements?.[isAr ? 'ar' : 'en'] || [];
    achEl.innerHTML = achs.length > 0
      ? achs.map(a => `<li>${a}</li>`).join('')
      : `<li>${isAr ? 'قريباً — سيتم إضافة الإنجازات' : 'Coming soon'}</li>`;
  }

  bioModalOpener = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { modal.style.opacity = '1'; modal.classList.add('show'); });
  });

  const closeBtn = document.getElementById('bio-modal-x');
  if (closeBtn) closeBtn.focus();
}

function closeBioModal() {
  const modal = document.getElementById('bio-modal');
  if (!modal) return;
  modal.style.opacity = '0';
  modal.classList.remove('show');
  setTimeout(() => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (bioModalOpener && typeof bioModalOpener.focus === 'function') bioModalOpener.focus();
  }, 250);
}

// Global exposure for inline onclick attributes
window.openBioModal = openBioModal;
window.closeBioModal = closeBioModal;

// Document-level listener ensures modal clicks work even when outside #app
document.addEventListener('click', e => {
  if (e.target.closest('#bio-modal-x') || e.target.closest('[data-bio-close]') || e.target === document.getElementById('bio-modal')) {
    closeBioModal();
  }
});

// Keyboard: Escape closes bio modal
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('bio-modal');
    if (modal && !modal.hidden) closeBioModal();
  }
});


/* >>> MODULE: 09_scanner.js <<< */
/**
 * 09_scanner.js - Member QR Generator & Camera Scanner Engine
 * Part of HNU Students For Egypt Platform
 */

/* ---------- QR Member Code Generator ---------- */
let qrScannerActive = false, qrScanStream = null, qrScanAnim = null;

function generateMemberQr(curUser) {
  const canvas = document.getElementById('member-qr-canvas');
  if (!canvas || !curUser) return;

  const activeQr = getStore('cf_active_qr', { active: false });
  if (!activeQr.active) return;

  const payload = JSON.stringify({
    sid: curUser.id,
    nid: curUser.nid,
    name: curUser.name
  });

  if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
    QRCode.toCanvas(canvas, payload, {
      width: 210,
      margin: 1,
      color: { dark: '#3B2616', light: '#FFFFFF' }
    }, (err) => {
      if (err) console.error('QR generate error:', err);
    });
  } else {
    setTimeout(() => generateMemberQr(curUser), 100);
  }
}

function stopQrScanner() {
  qrScannerActive = false;
  if (qrScanAnim) { cancelAnimationFrame(qrScanAnim); qrScanAnim = null; }
  if (qrScanStream) { qrScanStream.getTracks().forEach(t => t.stop()); qrScanStream = null; }
  const wrap = document.getElementById('qr-scanner-wrap');
  if (wrap) wrap.style.display = 'none';
}

async function startQrScanner() {
  const wrap = document.getElementById('qr-scanner-wrap');
  const video = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  const statusEl = document.getElementById('qr-scan-status');
  const msgEl = document.getElementById('admin-scan-msg');
  if (!wrap || !video || !canvas) return;

  try {
    qrScanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
    video.srcObject = qrScanStream;
    await video.play();
    wrap.style.display = 'block';
    qrScannerActive = true;
    if (statusEl) statusEl.textContent = lang === 'ar' ? '🔍 وجّه الكاميرا نحو QR العضو...' : '🔍 Point camera at member QR...';

    const ctx = canvas.getContext('2d');
    let lastScanned = '', lastScannedTime = 0;

    function scanFrame() {
      if (!qrScannerActive) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (typeof jsQR !== 'undefined') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
          if (code && code.data) {
            const now = Date.now();
            if (code.data !== lastScanned || now - lastScannedTime > 4000) {
              lastScanned = code.data;
              lastScannedTime = now;
              handleScannedMemberQr(code.data, statusEl, msgEl);
            }
          }
        }
      }
      qrScanAnim = requestAnimationFrame(scanFrame);
    }
    qrScanAnim = requestAnimationFrame(scanFrame);
  } catch (err) {
    if (msgEl) { msgEl.className = 'msg bad'; msgEl.textContent = lang === 'ar' ? '❌ يرجى السماح بالوصول للكاميرا من إعدادات المتصفح.' : '❌ Please allow camera access in browser settings.'; }
  }
}

async function handleScannedMemberQr(data, statusEl, msgEl) {
  try {
    let studentIdentifier = '';
    let studentName = '';
    try {
      const payload = JSON.parse(data);
      studentIdentifier = payload.sid || payload.nid || '';
      studentName = payload.name || '';
    } catch (_) {
      studentIdentifier = String(data).trim();
    }

    if (!studentIdentifier) return;

    const activeQr = getStore('cf_active_qr', { active: false, title: '' });
    if (!activeQr.active) {
      if (statusEl) statusEl.textContent = lang === 'ar' ? '⚠️ لا توجد جلسة نشطة' : '⚠️ No active session';
      if (msgEl) {
        msgEl.className = 'msg bad';
        msgEl.textContent = lang === 'ar' ? '⚠️ يرجى بدء جلسة حضور أولاً من النموذج بالأعلى قبل مسح الأعضاء.' : '⚠️ Please start an attendance session first before scanning.';
      }
      return;
    }

    if (statusEl) statusEl.textContent = lang === 'ar' ? '⏳ جاري تسجيل الحضور...' : '⏳ Recording attendance...';

    const curUserId = localStorage.getItem('cf_user_id');
    const curUser = getStore('cf_cur_user', null) || getUsers().find(u => u.id === curUserId);
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentIdentifier,
        eventTitle: activeQr.title,
        requesterId: curUser?.id,
        requesterNid: curUser?.nid
      })
    });
    const result = await res.json();
    if (result.success) {
      if (result.alreadyRecorded) {
        // Warning notification tone (440Hz alert)
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(440, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.16);
        } catch (_) {}

        const displayName = result.studentName || studentName || studentIdentifier;
        if (statusEl) statusEl.textContent = '⚠️ ' + (lang === 'ar' ? 'مسجل مسبقاً: ' + displayName : 'Already Recorded: ' + displayName);
        if (msgEl) {
          msgEl.className = 'msg';
          msgEl.style.color = '#b45309';
          msgEl.textContent = lang === 'ar'
            ? `⚠️ تنبيه: الطالب (${displayName}) مسجل حضوره بالفعل مسبقاً في هذه الفعالية!`
            : `⚠️ Notice: (${displayName}) was already recorded in this event!`;
        }
      } else {
        // Success audio notification chime (880Hz crystal bell)
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.14);
        } catch (_) {}

        if (navigator.vibrate) navigator.vibrate(100);

        const displayName = result.studentName || studentName || studentIdentifier;
        if (statusEl) statusEl.textContent = '✅ ' + (lang === 'ar' ? 'تم تسجيل: ' + displayName : 'Recorded: ' + displayName);
        if (msgEl) {
          msgEl.className = 'msg';
          msgEl.style.color = 'var(--g2)';
          msgEl.textContent = lang === 'ar' 
            ? `✅ تم تسجيل حضور الطالب (${displayName}) بنجاح وإضافته لكشف الحضور!` 
            : `✅ Attendance recorded for (${displayName}) and added to sheet!`;
        }

        // Immediately sync with database and update live sheet
        await syncAttendanceWithCloud();
        render('keep');
      }

      setTimeout(() => {
        if (msgEl) msgEl.textContent = '';
      }, 5000);
    } else {
      if (statusEl) statusEl.textContent = '⚠️ ' + (result.error || 'Error');
      if (msgEl) {
        msgEl.className = 'msg bad';
        msgEl.textContent = result.error || (lang === 'ar' ? 'فشل التسجيل.' : 'Recording failed.');
      }
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = '❌ ' + (lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
  }
}


/* >>> MODULE: 10_bootstrap.js <<< */
/**
 * 10_bootstrap.js - Application Bootstrap & Cloud Polling
 * Part of HNU Students For Egypt Platform
 */

statics(); render(); syncWithCloud();
// After first render, generate member QR if student is logged in
(function() {
  const role = localStorage.getItem('cf_role');
  if (role === 'STUDENT') {
    const userId = localStorage.getItem('cf_user_id');
    const user = getUsers().find(u => u.id === userId) || getStore('cf_cur_user', null);
    if (user) setTimeout(() => generateMemberQr(user), 150);
  }
})();
// Auto poll every 3 seconds for real-time live updates from database!
setInterval(() => { syncWithCloud(); }, 3000);

