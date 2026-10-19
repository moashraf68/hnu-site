import Link from "next/link";
import { SITE } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انضم إلينا | أسرة طلاب من أجل مصر",
  description: "خطوات وشروط الانضمام إلى أسرة طلاب من أجل مصر بجامعة حلوان الأهلية",
};

export default function JoinPage() {
  const steps = [
    {
      step: 1,
      title: "التقديم الإلكتروني",
      desc: "املأ استمارة التسجيل ببياناتك الأكاديمية والشخصية واختر لجنتك المفضلة.",
      icon: "📝",
    },
    {
      step: 2,
      title: "المقابلة الشخصية (Interview)",
      desc: "حضور المقابلة الشخصية للتعرف على اهتماماتك وشغفك ومهاراتك وكيف يمكنك المساهمة.",
      icon: "🤝",
    },
    {
      step: 3,
      title: "إعلان القبول والتوجيه",
      desc: "استلام نتيجة القبول والدعوة لحضور جلسة الترحيب والإعداد (Onboarding).",
      icon: "🎉",
    },
    {
      step: 4,
      title: "انطلاق العمل والأنشطة",
      desc: "البدء الفعلي في مهام لجنتك والمشاركة في تنظيم فعاليات الجامعة وتمثيلها رسمياً.",
      icon: "🚀",
    },
  ];

  const benefits = [
    { title: "تطوير المهارات القيادية", desc: "فرص حقيقية لإدارة فرق عمل ومشاريع ميدانية وتحديات واقعية.", icon: "👑" },
    { title: "شهادات وتكريم رسمي", desc: "شهادات تقدير موثقة لدورك ومشاركاتك المتميزة في أنشطة الجامعة.", icon: "📜" },
    { title: "شبكة علاقات قوية", desc: "تواصل مباشر مع قيادات الجامعة، الطلاب المتميزين، ومؤسسات مختلفة.", icon: "🌐" },
    { title: "سيرة ذاتية احترافية", desc: "خبرة عملية مميزة تثري سيرتك الذاتية وتؤهلك لسوق العمل بثقة.", icon: "💼" },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="sec dark"
        style={{
          paddingTop: "calc(var(--nav) + 52px)",
          paddingBottom: "52px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--c1) 0%, #2b1c11 100%)",
        }}
      >
        <div className="wrap narrow">
          <span
            className="pill"
            style={{
              background: "rgba(242,168,29,0.18)",
              color: "var(--g3)",
              border: "1px solid rgba(242,168,29,0.35)",
              marginBottom: 16,
              fontSize: "0.95rem",
              padding: "4px 18px",
            }}
          >
            بوابة الانضمام
          </span>
          <h1
            style={{
              color: "var(--g3)",
              fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            انضم إلينا
          </h1>
          <p
            style={{
              maxWidth: 620,
              margin: "14px auto 0",
              color: "var(--bg)",
              opacity: 0.9,
              fontSize: "1.1rem",
              lineHeight: 1.8,
            }}
          >
            كن جزءاً من أكبر كيان طلابي بجامعة حلوان الأهلية وابدأ رحلة مليئة بالخبرات والتأثير الحقيقي
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <Link href="/register" className="btn big">
              سجل حسابك في البوابة الآن
            </Link>
            {SITE.joinUrl && (
              <a
                href={SITE.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn big ghost"
                style={{ borderColor: "var(--g3)", color: "var(--g3)" }}
              >
                استمارة التقديم الخارجية
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== JOINING STEPS ===== */}
      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)", fontWeight: 800 }}>
              مراحل الانضمام للأسرة
            </h2>
            <p className="subh" style={{ margin: "10px auto 0", maxWidth: 600 }}>
              أربع خطوات سهلة تبدأ بها رحلتك معنا داخل الجامعة
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {steps.map((item) => (
              <div
                key={item.step}
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "22px",
                  padding: "32px 24px",
                  border: "2px solid var(--bei)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: "2.4rem" }}>{item.icon}</span>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--grad)",
                      color: "var(--c1)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.step}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--c1)",
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "var(--c2)",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY JOIN US / BENEFITS ===== */}
      <section className="sec alt">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)", fontWeight: 800 }}>
              ماذا تستفيد من الانضمام؟
            </h2>
            <p className="subh" style={{ margin: "10px auto 0", maxWidth: 600 }}>
              تجربة جامعية استثنائية تصنع الفارق في شخصيتك ومستقبلك المهني
            </p>
          </div>

          <div className="grid3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "2px solid var(--bei)",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>{b.icon}</div>
                <h3 style={{ color: "var(--c1)", fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>
                  {b.title}
                </h3>
                <p style={{ color: "var(--c2)", fontSize: "0.93rem", lineHeight: 1.7 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Committees CTA */}
          <div
            className="card"
            style={{
              marginTop: 40,
              background: "linear-gradient(135deg, var(--c1) 0%, var(--c2) 100%)",
              color: "var(--bg)",
              padding: "36px",
              borderRadius: "24px",
              border: "2px solid var(--g)",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "var(--g3)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>
              لم تختر لجنتك بعد؟
            </h3>
            <p style={{ maxWidth: 620, margin: "0 auto 24px", opacity: 0.9, lineHeight: 1.8 }}>
              تعرف على اللجان الأربع (التنظيمية، الموارد البشرية، العلاقات العامة، والإعلام) واختر الأنسب لمهاراتك وشغفك.
            </p>
            <Link
              href="/committees"
              className="btn"
              style={{
                background: "var(--grad)",
                color: "var(--c1)",
                fontWeight: 800,
                padding: "12px 32px",
              }}
            >
              استكشف اللجان المتاحة →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="sec dark" style={{ textAlign: "center" }}>
        <div className="wrap narrow">
          <h2 style={{ color: "var(--g3)" }}>مستعد للانطلاق؟</h2>
          <p style={{ margin: "16px 0 28px", opacity: 0.88, fontSize: "1.1rem" }}>
            قم بإنشاء حسابك في بوابة الأسرة الآن لمتابعة طلبك والوصول لكافة فعاليات وخدمات الأسرة.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn big">
              إنشاء حساب جديد
            </Link>
            <Link
              href="/login"
              className="btn big ghost"
              style={{ borderColor: "var(--g3)", color: "var(--g3)" }}
            >
              لديك حساب بالفعل؟ تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
