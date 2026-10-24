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
