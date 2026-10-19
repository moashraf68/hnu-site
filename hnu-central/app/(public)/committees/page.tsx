import Image from "next/image";
import Link from "next/link";
import { COMMITTEES } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اللجان | طلاب من أجل مصر",
  description: "تعرف على لجان أسرة طلاب من أجل مصر في جامعة حلوان الأهلية",
};

export default function CommitteesPage() {
  return (
    <>
      {/* Header */}
      <div
        className="sec dark"
        style={{ paddingTop: "calc(var(--nav) + 48px)", textAlign: "center" }}
      >
        <div className="wrap">
          <h1 style={{ color: "var(--g3)", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800 }}>
            اللجان
          </h1>
          <p style={{ maxWidth: 600, margin: "16px auto 0", opacity: .85, fontSize: "1.1rem" }}>
            اختار اللجنة المناسبة ليك واستكشف ما تقدمه وما هتكسبه
          </p>
        </div>
      </div>

      {/* Committees grid */}
      <section className="sec">
        <div className="wrap">
          <div className="cgrid">
            {COMMITTEES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/committees/${c.slug}`}
                className="ccard rv"
                style={{ "--d": `${i * .1}s` } as React.CSSProperties}
              >
                <div className="cico" style={{ fontSize: "2.4rem" }}>{c.icon}</div>
                <div className="ccode">{c.code}</div>
                <div className="car">{c.nameAr}</div>
                <div className="cen">{c.nameEn}</div>
                <p style={{
                  margin: "12px 0 auto",
                  fontSize: ".92rem",
                  opacity: .85,
                  lineHeight: 1.7,
                }}>
                  {c.descAr.slice(0, 90)}...
                </p>
                <div className="ccta" style={{
                  marginTop: 18,
                  background: "rgba(242,168,29,.2)",
                  color: "var(--g3)",
                  padding: "8px 20px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: ".9rem",
                }}>
                  استكشف اللجنة →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="sec alt">
        <div className="wrap cta">
          <h2>مش لاقي لجنتك؟</h2>
          <p className="lead">انضم لينا وهنساعدك تختار المكان المناسب ليك</p>
          <Link href="/join" className="btn big">انضم الآن</Link>
        </div>
      </section>
    </>
  );
}
