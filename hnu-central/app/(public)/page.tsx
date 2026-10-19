import Image from "next/image";
import Link from "next/link";
import { ABOUT, LEADERSHIP, COMMITTEES, EVENTS, GALLERY, SITE } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أسرة طلاب من أجل مصر — جامعة حلوان الأهلية",
};

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="wrap hero-in">
          <div className="hero-logo">
            <Image
              src="/assets/images/logo.png"
              alt="أسرة طلاب من أجل مصر"
              width={440}
              height={440}
              priority
            />
          </div>
          <div className="hero-tx">
            <h1>
              أسرة طلاب من أجل <em>مصر</em>
            </h1>
            <p className="sub">جامعة حلوان الأهلية — أبدأ بنا وشارك وابنِ الفرق</p>
            <p className="slogan">من أجل مصر.. نبدأ من الجامعة</p>
            <div className="row">
              <a
                href={SITE.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn big"
              >
                انضم لينا
              </a>
              <Link href="/about" className="btn big ghost">
                اعرف عنا أكتر
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="sec alt" id="about">
        <div className="wrap">
          <h2>عن الأسرة</h2>
          <p className="lead">{ABOUT.about.ar}</p>

          <div className="grid3 rv">
            <div className="card">
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>👁️</div>
              <h3>الرؤية</h3>
              <p>{ABOUT.vision.ar}</p>
            </div>
            <div className="card">
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</div>
              <h3>الرسالة</h3>
              <p>{ABOUT.mission.ar}</p>
            </div>
            <div className="card">
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>⭐</div>
              <h3>القيم</h3>
              <ul style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", marginTop: 8 }}>
                {ABOUT.values.ar.map((v) => (
                  <li key={v} className="pill pill-brown">{v}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Counters */}
          <div className="counters">
            {[
              { num: ABOUT.counters.members, label: "عضو", suffix: "+" },
              { num: ABOUT.counters.events, label: "فعالية", suffix: "+" },
              { num: ABOUT.counters.committees, label: "لجنة", suffix: "" },
              { num: ABOUT.counters.universities, label: "جامعة", suffix: "+" },
            ].map((c) => (
              <div key={c.label} className="counter-item rv">
                <span className="num">{c.num}{c.suffix}</span>
                <span className="label">{c.label}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about" className="btn">اعرف أكتر عن الأسرة</Link>
          </div>
        </div>
      </section>

      {/* ===== LEADERSHIP PREVIEW ===== */}
      <section className="sec" id="leaders">
        <div className="wrap">
          <h2>قيادة الأسرة</h2>
          <p className="subh">الفريق المسؤول عن قيادة الأسرة وتوجيهها</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center", marginTop: 36 }}>
            {LEADERSHIP.slice(0, 4).map((person) => (
              <div key={person.name} className="person rv" style={{ flex: "0 1 160px" }}>
                <Image
                  src={person.photo}
                  alt={person.name}
                  width={112}
                  height={112}
                  className="av"
                />
                <b>{person.name}</b>
                <small>{person.role.ar}</small>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/leadership" className="btn">عرض كل القيادة</Link>
          </div>
        </div>
      </section>

      {/* ===== COMMITTEES PREVIEW ===== */}
      <section className="sec alt" id="committees">
        <div className="wrap">
          <h2>اللجان</h2>
          <p className="subh">اختار اللجنة المناسبة ليك واستكشفها</p>

          <div className="cgrid" style={{ marginTop: 32 }}>
            {COMMITTEES.map((c) => (
              <Link key={c.slug} href={`/committees/${c.slug}`} className="ccard rv">
                <div className="cico">{c.icon}</div>
                <div className="ccode">{c.code}</div>
                <div className="car">{c.nameAr}</div>
                <div className="cen">{c.nameEn}</div>
                <p className="cint" style={{ marginTop: 10, fontSize: ".9rem", opacity: .8 }}>
                  {c.descAr.slice(0, 80)}...
                </p>
                <span className="ccta" style={{ marginTop: "auto", padding: "8px 20px", borderRadius: 999, background: "rgba(242,168,29,.2)", color: "var(--g3)", fontSize: ".9rem", fontWeight: 700 }}>
                  استكشف اللجنة →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/committees" className="btn">عرض كل اللجان</Link>
          </div>
        </div>
      </section>

      {/* ===== EVENTS PREVIEW ===== */}
      <section className="sec" id="events">
        <div className="wrap">
          <h2>الفعاليات</h2>
          <p className="subh">أبرز فعاليات الأسرة</p>

          <div className="grid3" style={{ marginTop: 32 }}>
            {EVENTS.map((ev) => (
              <div key={ev.id} className="card ev rv" style={{ padding: 0 }}>
                <div className="evimg">
                  <Image
                    src={ev.img}
                    alt={ev.titleAr}
                    width={400}
                    height={267}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="evb">
                  <small>{ev.icon} {ev.date}</small>
                  <h3 style={{ marginTop: 6, color: "var(--c1)", fontWeight: 800 }}>{ev.titleAr}</h3>
                  <p style={{ marginTop: 6, color: "var(--c2)", fontSize: ".95rem" }}>
                    {ev.descAr.slice(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/events" className="btn">عرض كل الفعاليات</Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="sec alt" id="gallery">
        <div className="wrap">
          <h2>الميديا</h2>
          <p className="subh">لحظات من أنشطتنا</p>

          <div className="gal" style={{ marginTop: 32 }}>
            {GALLERY.slice(0, 6).map((src, i) => (
              <div key={i} className="gi rv">
                <Image
                  src={src}
                  alt={`صورة من معرض الأسرة ${i + 1}`}
                  width={400}
                  height={250}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/media" className="btn">عرض كل الميديا</Link>
          </div>
        </div>
      </section>

      {/* ===== JOIN CTA ===== */}
      <section className="sec dark" id="join">
        <div className="wrap cta">
          <h2>جاهز تبقى جزء من الأسرة؟</h2>
          <p style={{ margin: "14px 0 24px", opacity: .85 }}>
            املا استمارة الانضمام وهنتواصل معاك في أقرب وقت ممكن.
          </p>

          <ol className="steps" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 30, counterReset: "s", listStyle: "none" }}>
            {["تقدم", "مقابلة", "قبول", "ابدأ"].map((s, i) => (
              <li key={s} style={{ counterIncrement: "s", background: "rgba(255,255,255,.08)", border: "1px solid var(--g)", borderRadius: 999, padding: "4px 18px", color: "var(--bg)" }}>
                <span style={{ color: "var(--g)", marginInlineEnd: 4 }}>{i + 1}.</span> {s}
              </li>
            ))}
          </ol>

          <div className="row" style={{ justifyContent: "center", gap: 12 }}>
            <a
              href={SITE.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn big"
            >
              انضم الآن
            </a>
            <Link href="/join" className="btn big ghost" style={{ borderColor: "var(--g3)", color: "var(--g3)" }}>
              اعرف أكتر
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SUGGEST ACTIVITY ===== */}
      <section className="sec" id="suggest">
        <div className="wrap narrow">
          <h2>اقترح فعالية أو نشاط</h2>
          <p className="subh">فكرتك مهمة — كل اقتراح بيوصلنا مباشرة</p>
          <SuggestForm />
        </div>
      </section>
    </>
  );
}

// Suggest form (client component inline)
function SuggestForm() {
  return (
    <form
      action="/api/suggest"
      method="POST"
      style={{ display: "grid", gap: 14, marginTop: 28 }}
    >
      <div className="form-2col">
        <div className="form-group">
          <label htmlFor="sug-name">اسمك</label>
          <input id="sug-name" name="name" type="text" required placeholder="الاسم الكامل" />
        </div>
        <div className="form-group">
          <label htmlFor="sug-email">إيميلك</label>
          <input id="sug-email" name="email" type="email" placeholder="اختياري" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="sug-act">اسم الفعالية / النشاط المقترح</label>
        <input id="sug-act" name="activityName" type="text" required placeholder="مثال: يوم رياضي، ورشة كتابة..." />
      </div>
      <div className="form-group">
        <label htmlFor="sug-aud">الجمهور المستهدف</label>
        <input id="sug-aud" name="audience" type="text" placeholder="مثال: طلاب الفرقة الأولى" />
      </div>
      <div className="form-group">
        <label htmlFor="sug-msg">وصف الفكرة بالتفصيل</label>
        <textarea id="sug-msg" name="description" required rows={4} placeholder="اشرح فكرتك..." style={{ resize: "vertical" }} />
      </div>
      <button type="submit" className="btn" style={{ justifySelf: "start" }}>
        أرسل الاقتراح
      </button>
    </form>
  );
}
