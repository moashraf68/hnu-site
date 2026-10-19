import Image from "next/image";
import Link from "next/link";
import { LEADERSHIP } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "قيادة الأسرة | أسرة طلاب من أجل مصر",
  description: "تعرف على الفريق القيادي لأسرة طلاب من أجل مصر بجامعة حلوان الأهلية",
};

export default function LeadershipPage() {
  const supervisor = LEADERSHIP[0];
  const team = LEADERSHIP.slice(1);

  return (
    <>
      {/* ===== HERO HEADER ===== */}
      <section
        className="sec dark"
        style={{
          paddingTop: "calc(var(--nav) + 52px)",
          paddingBottom: "52px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--c1) 0%, #2a1b10 100%)",
        }}
      >
        <div className="wrap">
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
            الهيكل التنظيمي والقيادي
          </span>
          <h1
            style={{
              color: "var(--g3)",
              fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            قيادة الأسرة
          </h1>
          <p
            style={{
              maxWidth: 680,
              margin: "16px auto 0",
              color: "var(--bg)",
              opacity: 0.9,
              fontSize: "1.1rem",
              lineHeight: 1.8,
            }}
          >
            نخبة من القيادات الأكاديمية والطلابية المتميزة التي تقود مسيرة العمل والتميز في جامعة حلوان الأهلية
          </p>
        </div>
      </section>

      {/* ===== SUPERVISOR PROMINENT CARD ===== */}
      <section className="sec" style={{ background: "var(--bg)" }}>
        <div className="wrap narrow">
          <div
            className="card"
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #fdf9f0 100%)",
              border: "3px solid var(--g)",
              boxShadow: "0 18px 45px rgba(59,38,22,0.14), 0 0 35px rgba(242,168,29,0.25)",
              borderRadius: "28px",
              padding: "40px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -16,
                background: "var(--grad)",
                color: "var(--c1)",
                fontWeight: 800,
                fontSize: "0.9rem",
                padding: "6px 22px",
                borderRadius: 999,
                boxShadow: "0 4px 12px rgba(201,138,11,0.3)",
              }}
            >
              ⭐ الإشراف العام
            </div>

            <div style={{ marginTop: 8, marginBottom: 18 }}>
              <Image
                src={supervisor.photo}
                alt={supervisor.nameAr || supervisor.name}
                width={160}
                height={160}
                className="av"
                style={{
                  width: 160,
                  height: 160,
                  borderWidth: 4,
                  borderColor: "var(--g)",
                  boxShadow: "0 0 28px rgba(242,168,29,0.5), 0 8px 24px rgba(59,38,22,0.2)",
                }}
              />
            </div>

            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                fontWeight: 800,
                color: "var(--c1)",
                margin: 0,
              }}
            >
              {supervisor.nameAr || supervisor.name}
            </h2>

            <div style={{ margin: "10px 0 16px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 20px",
                  borderRadius: 999,
                  background: "var(--c1)",
                  color: "var(--g3)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                }}
              >
                {supervisor.role.ar}
              </span>
            </div>

            {supervisor.bio && (
              <p
                style={{
                  maxWidth: 580,
                  color: "var(--c2)",
                  fontSize: "1.05rem",
                  lineHeight: 1.9,
                  margin: "8px 0 0",
                }}
              >
                {supervisor.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== REST OF THE LEADERSHIP GRID ===== */}
      <section className="sec alt">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800 }}>
              فريق القيادة والتنظيم
            </h2>
            <p className="subh" style={{ margin: "10px auto 0", maxWidth: 600 }}>
              قادة الفرق واللجان الذين يعملون يداً بيد لخدمة طلاب الجامعة وتطوير الأنشطة
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "28px",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {team.map((member, idx) => (
              <div
                key={member.name + idx}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: "22px",
                  border: "2px solid var(--bei)",
                  background: "#fff",
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={member.photo}
                    alt={member.nameAr || member.name}
                    width={120}
                    height={120}
                    className="av"
                    style={{
                      width: 120,
                      height: 120,
                      borderWidth: 3,
                    }}
                  />
                </div>

                <b
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--c1)",
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {member.nameAr || member.name}
                </b>

                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 16px",
                    borderRadius: 999,
                    background: "var(--bei)",
                    color: "var(--c1)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    marginBottom: 12,
                  }}
                >
                  {member.role.ar}
                </span>

                {member.bio && (
                  <p
                    style={{
                      color: "var(--c2)",
                      fontSize: "0.92rem",
                      lineHeight: 1.7,
                      marginTop: 4,
                    }}
                  >
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 48 }}>
            <Link href="/join" className="btn big">
              انضم لفريق العمل معنا
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
