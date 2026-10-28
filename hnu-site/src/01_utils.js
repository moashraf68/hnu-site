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
    ? `<button type="button" class="av-bio-btn" data-bio="${p.bioKey}" aria-label="${lang === 'ar' ? 'سيرة ذاتية: ' + p.name : 'Profile: ' + p.name}" style="background:none;border:none;padding:0;cursor:pointer;position:relative;display:inline-block">${imgEl}<span style="position:absolute;bottom:4px;right:4px;background:linear-gradient(135deg,var(--c1),#7a4a28);color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.4);border:2px solid #fff;pointer-events:none" title="${lang === 'ar' ? 'السيرة الذاتية' : 'Biography'}" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></span></button>`
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
  if (!url) return 'فيديو';
  if (/facebook\.com|fb\.watch/i.test(url)) return 'فيسبوك';
  if (/tiktok\.com/i.test(url)) return 'تيك توك';
  if (/instagram\.com/i.test(url)) return 'إنستغرام';
  if (/youtu\.be|youtube\.com/i.test(url)) return 'يوتيوب';
  if (/vimeo\.com/i.test(url)) return 'فيميو';
  if (url.startsWith('data:video') || /\.(mp4|webm|mov|ogg)/i.test(url)) return 'كليب مباشر';
  return 'فيديو';
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
