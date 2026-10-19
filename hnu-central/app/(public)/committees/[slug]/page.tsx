import Link from "next/link";
import { COMMITTEES } from "@/config/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = COMMITTEES.find((c) => c.slug === slug);
  if (!c) return { title: "لجنة غير موجودة" };
  return {
    title: `لجنة ${c.nameAr} | طلاب من أجل مصر`,
    description: c.descAr,
  };
}

export function generateStaticParams() {
  return COMMITTEES.map((c) => ({ slug: c.slug }));
}

export default async function CommitteeDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = COMMITTEES.find((committee) => committee.slug === slug);
  if (!c) notFound();

  return (
    <>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(160deg, var(--c2), var(--c1))",
          color: "var(--bg)",
          paddingTop: "calc(var(--nav) + 48px)",
          paddingBottom: 64,
          borderBottom: "4px solid var(--g)",
          textAlign: "center",
        }}
      >
        <div className="wrap">
          <Link
            href="/committees"
            style={{
              display: "inline-flex",
              gap: 8,
              color: "var(--g3)",
              marginBottom: 18,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(242,168,29,.5)",
              fontSize: ".9rem",
              fontWeight: 600,
              transition: ".2s",
            }}
          >
            ← العودة للجان
          </Link>
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>{c.icon}</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--g)", fontFamily: "Montserrat, sans-serif" }}>
            {c.code}
          </div>
          <h1 style={{ color: "var(--g)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginTop: 4 }}>
            <small style={{ display: "block", fontSize: ".45em", color: "var(--bg)", fontWeight: 600 }}>{c.nameEn}</small>
            {c.nameAr}
          </h1>
          <p style={{ maxWidth: 680, margin: "14px auto 0", fontSize: "1.05rem", opacity: .9 }}>
            {c.descAr}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="sec">
        <div className="wrap">
          <div style={{ display: "grid", gap: 24 }}>
            {/* Responsibilities + Gains */}
            <div style={{ display: "grid", gap: 20 }} className="two-cols">
              <div className="bg-card rv">
                <h2 style={{ textAlign: "start", fontSize: "1.4rem", marginBottom: 16 }}>
                  المهام الأساسية
                </h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {c.responsibilities.ar.map((r) => (
                    <li key={r} style={{ display: "flex", gap: 10, color: "var(--c2)" }}>
                      <span style={{ color: "var(--g2)" }}>✦</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rv">
                <h2 style={{ textAlign: "start", fontSize: "1.4rem", marginBottom: 16 }}>
                  ما ستكسبه
                </h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {c.gains.ar.map((g) => (
                    <li key={g} style={{ display: "flex", gap: 10, color: "var(--c2)" }}>
                      <span style={{ color: "var(--g2)" }}>✦</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Head */}
            {c.headName && (
              <div className="bg-card rv text-center">
                <h2 style={{ marginBottom: 24 }}>قيادة اللجنة</h2>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className="person">
                    <div
                      className="av"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        fontSize: "2.5rem",
                        background: "var(--bei)",
                      }}
                    >
                      👤
                    </div>
                    <b>{c.headName}</b>
                    <small>{c.headRole}</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="sec dark">
        <div className="wrap cta">
          <h2>جاهز تنضم للجنة {c.nameAr}؟</h2>
          <p style={{ margin: "14px 0 24px", opacity: .85 }}>
            قدم الآن وابدأ رحلتك مع الأسرة
          </p>
          <Link href="/join" className="btn big">قدم الآن</Link>
        </div>
      </section>

      <style>{`
        @media (min-width: 800px) { .two-cols { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </>
  );
}
