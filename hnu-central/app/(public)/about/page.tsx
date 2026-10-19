import Image from "next/image";
import Link from "next/link";
import { ABOUT } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن الأسرة | طلاب من أجل مصر",
  description: "تعرف على رؤية ورسالة وقيم أسرة طلاب من أجل مصر في جامعة حلوان الأهلية",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div
        className="sec dark"
        style={{ paddingTop: "calc(var(--nav) + 48px)", textAlign: "center" }}
      >
        <div className="wrap">
          <h1 style={{ color: "var(--g3)", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800 }}>
            عن الأسرة
          </h1>
          <p style={{ maxWidth: 600, margin: "16px auto 0", opacity: .85, fontSize: "1.1rem" }}>
            {ABOUT.about.ar}
          </p>
        </div>
      </div>

      {/* Vision / Mission / Values */}
      <section className="sec">
        <div className="wrap">
          <div className="grid3">
            <div className="card rv">
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>👁️</div>
              <h3>الرؤية</h3>
              <p style={{ marginTop: 8, color: "var(--c2)" }}>{ABOUT.vision.ar}</p>
            </div>
            <div className="card rv" style={{ "--d": ".1s" } as React.CSSProperties}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎯</div>
              <h3>الرسالة</h3>
              <p style={{ marginTop: 8, color: "var(--c2)" }}>{ABOUT.mission.ar}</p>
            </div>
            <div className="card rv" style={{ "--d": ".2s" } as React.CSSProperties}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⭐</div>
              <h3>القيم</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", marginTop: 10 }}>
                {ABOUT.values.ar.map((v) => (
                  <span key={v} className="pill pill-brown">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="sec alt">
        <div className="wrap">
          <h2>أسرة بالأرقام</h2>
          <div className="counters" style={{ marginTop: 40 }}>
            {[
              { num: ABOUT.counters.members, label: "عضو في الأسرة", suffix: "+" },
              { num: ABOUT.counters.events, label: "فعالية وحدث", suffix: "+" },
              { num: ABOUT.counters.committees, label: "لجنة متخصصة", suffix: "" },
              { num: ABOUT.counters.universities, label: "جامعة تحت المظلة", suffix: "+" },
            ].map((c) => (
              <div key={c.label} className="counter-item rv">
                <span className="num">{c.num}{c.suffix}</span>
                <span className="label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="sec">
        <div className="wrap narrow">
          <h2>قصتنا</h2>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="bg-card rv">
              <h3 style={{ color: "var(--c1)", fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🏛️</span> من نحن؟
              </h3>
              <p style={{ color: "var(--c2)", lineHeight: 2 }}>
                أسرة طلاب من أجل مصر هي منظمة طلابية مركزية تضم جامعات مصرية عديدة،
                تعمل تحت إشراف هيئة الأمن القومي. تهدف إلى تأهيل الشباب الجامعي
                وإعدادهم للمشاركة الفعالة في بناء المجتمع، وإضافة قيمة حقيقية لمساراتهم المهنية.
              </p>
            </div>
            <div className="bg-card rv">
              <h3 style={{ color: "var(--c1)", fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🎓</span> ماذا نقدم؟
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingInlineStart: 0 }}>
                {[
                  "برامج تدريبية وتطوير المهارات القيادية والشخصية",
                  "تنظيم فعاليات واجتماعات رسمية ممثلة للجامعة",
                  "إضافة قيمة حقيقية للسيرة الذاتية (CV)",
                  "شبكة علاقات واسعة داخل وخارج الجامعة",
                  "فرص تطوعية وتمثيل الجامعة على المستوى الوطني",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "var(--c2)" }}>
                    <span style={{ color: "var(--g2)", marginTop: 4 }}>✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec dark">
        <div className="wrap cta">
          <h2>انضم إلى الأسرة</h2>
          <p style={{ margin: "14px 0 24px", opacity: .85 }}>
            كن جزءًا من حركة شبابية تصنع الفرق على مستوى الجامعة ومصر كلها.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/join" className="btn big">انضم الآن</Link>
            <Link href="/committees" className="btn big ghost" style={{ borderColor: "var(--g3)", color: "var(--g3)" }}>
              استكشف اللجان
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
