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
      navLoginBtn.textContent = lang === "ar" ? "لوحة الإدارة" : "Admin Panel";
      navLoginBtn.href = "/admin";
    } else if (role === "STUDENT") {
      navLoginBtn.textContent = lang === "ar" ? "لوحة العضو" : "Member Portal";
      navLoginBtn.href = "/portal";
    } else {
      navLoginBtn.textContent = lang === "ar" ? "تسجيل الدخول" : "Sign In";
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
    m.textContent = lang === "ar" ? "تم إرسال فكرتك بنجاح وحفظها في قاعدة البيانات! شكراً لمشاركتك." : "Idea submitted and saved to database successfully! Thank you.";
    f.reset();
    syncSuggestionsWithCloud();
  } catch (err) {
    m.textContent = lang === "ar" ? "تعذر إرسال المقترح، يرجى المحاولة مرة أخرى." : S("fail");
    m.classList.add("bad");
  } finally {
    if (submitBtn) { submitBtn.disabled = false; }
  }
});
