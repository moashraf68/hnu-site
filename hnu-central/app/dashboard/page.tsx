import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { EVENTS } from "@/config/site";
import { getEvalColor } from "@/lib/utils";
import { Calendar, CheckCircle2, Award, Clock, ArrowLeft, QrCode } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let attendanceCount = 0;
  let latestEvalScore: number | null = null;
  let recentAttendance: Array<{ title: string; date: string; scannedAt: string }> = [];
  let upcomingEventsList: Array<{ id: string; title: string; date: string; img?: string }> = [];

  try {
    const attResult = await sql<{ count: string }>`
      SELECT COUNT(*) as count FROM attendance WHERE user_id = ${user.id}
    `;
    attendanceCount = parseInt(attResult.rows[0]?.count || "0", 10);

    const evalResult = await sql<{ score: number }>`
      SELECT score FROM evaluations WHERE student_id = ${user.id} ORDER BY created_at DESC LIMIT 1
    `;
    if (evalResult.rows.length > 0) {
      latestEvalScore = evalResult.rows[0].score;
    }

    const recAttResult = await sql<{ title_ar: string; date: string; scanned_at: string }>`
      SELECT e.title_ar, e.date, a.scanned_at
      FROM attendance a
      INNER JOIN events e ON e.id = a.event_id
      WHERE a.user_id = ${user.id}
      ORDER BY a.scanned_at DESC
      LIMIT 4
    `;
    recentAttendance = recAttResult.rows.map((r) => ({
      title: r.title_ar,
      date: new Date(r.date).toLocaleDateString("ar-EG"),
      scannedAt: new Date(r.scanned_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    }));
  } catch (err) {
    console.warn("[DASHBOARD_DB_FETCH_NOTE]", err);
  }

  // Fallback upcoming events from config
  upcomingEventsList = EVENTS.slice(0, 3).map((e) => ({
    id: e.id,
    title: e.titleAr,
    date: e.date,
    img: e.img,
  }));

  const evalColor = latestEvalScore !== null ? getEvalColor(latestEvalScore) : null;
  const evalBadgeBg =
    evalColor === "green" ? "#dcfce7" : evalColor === "yellow" ? "#fef3c7" : "#fee2e2";
  const evalBadgeText =
    evalColor === "green" ? "#166534" : evalColor === "yellow" ? "#92400e" : "#991b1b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ===== WELCOME HERO BANNER ===== */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, var(--c1) 0%, #2f1d0f 100%)",
          color: "var(--bg)",
          padding: "32px 28px",
          borderRadius: "24px",
          border: "2px solid rgba(242,168,29,0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "0 10px 30px rgba(59,38,22,0.14)",
        }}
      >
        <div>
          <span
            className="pill"
            style={{
              background: "rgba(242,168,29,0.2)",
              color: "var(--g3)",
              border: "1px solid rgba(242,168,29,0.3)",
              marginBottom: 10,
              fontSize: "0.85rem",
            }}
          >
            مرحباً بك في بوابتك الجامعية
          </span>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 800,
              margin: "6px 0 8px",
            }}
          >
            أهلاً، {user.fullName} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.98rem" }}>
            {user.college} — {user.academicYear}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/dashboard/events"
            className="btn"
            style={{
              background: "var(--grad)",
              color: "var(--c1)",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <QrCode size={18} />
            <span>تسجيل حضور فعالية</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="btn ghost"
            style={{
              borderColor: "var(--g3)",
              color: "var(--g3)",
            }}
          >
            تعديل بياناتي
          </Link>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {/* Stat 1: Upcoming Events */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border: "1.5px solid var(--bei)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              background: "rgba(242,168,29,0.14)",
              color: "var(--g2)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Calendar size={28} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {upcomingEventsList.length}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 600, marginTop: 4 }}>
              الفعاليات المتاحة
            </div>
          </div>
        </div>

        {/* Stat 2: Attendance */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border: "1.5px solid var(--bei)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              background: "rgba(22,163,74,0.12)",
              color: "#16a34a",
              display: "grid",
              placeItems: "center",
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {attendanceCount}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 600, marginTop: 4 }}>
              فعاليات تم حضورها
            </div>
          </div>
        </div>

        {/* Stat 3: Latest Evaluation */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border: "1.5px solid var(--bei)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              background: "rgba(59,38,22,0.08)",
              color: "var(--c1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {latestEvalScore !== null ? `${latestEvalScore} / 10` : "—"}
            </div>
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 600 }}>
                أحدث تقييم للأداء
              </span>
              {latestEvalScore !== null && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: evalBadgeBg,
                    color: evalBadgeText,
                    fontWeight: 700,
                  }}
                >
                  {latestEvalScore >= 7 ? "ممتاز" : latestEvalScore >= 4 ? "متوسط" : "يحتاج تحسين"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENT CONTENT GRID ===== */}
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* Left: Upcoming Events */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "26px",
            border: "1.5px solid var(--bei)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: "1px solid var(--bei)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
              أبرز الفعاليات المرتقبة
            </h2>
            <Link
              href="/dashboard/events"
              style={{
                fontSize: "0.88rem",
                color: "var(--g2)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>عرض الكل</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {upcomingEventsList.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px",
                  borderRadius: "14px",
                  background: "var(--bg)",
                  border: "1px solid var(--bei)",
                }}
              >
                {ev.img ? (
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={ev.img}
                      alt={ev.title}
                      width={58}
                      height={58}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "10px",
                      background: "var(--bei)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--c1)",
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={24} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--c1)",
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      color: "var(--c2)",
                      fontSize: "0.82rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    <Clock size={13} />
                    <span>{ev.date}</span>
                  </div>
                </div>

                <Link
                  href="/dashboard/events"
                  className="btn sm"
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 12px",
                  }}
                >
                  حضور
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Attendance */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "26px",
            border: "1.5px solid var(--bei)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: "1px solid var(--bei)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
              سجل الحضور الأخير
            </h2>
            <Link
              href="/dashboard/attendance"
              style={{
                fontSize: "0.88rem",
                color: "var(--g2)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>عرض السجل</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          {recentAttendance.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "36px 16px",
                color: "var(--c2)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎫</div>
              <div style={{ fontWeight: 700, color: "var(--c1)", marginBottom: 4 }}>
                لم تسجل حضور في أي فعالية بعد
              </div>
              <p style={{ fontSize: "0.88rem" }}>
                استخدم ماسح رمز الاستجابة السريعة (QR) عند حضور فعاليات الأسرة لتسجيل حضورك.
              </p>
              <Link href="/dashboard/events" className="btn sm" style={{ marginTop: 14 }}>
                استعراض الفعاليات الحالية
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentAttendance.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "var(--bg)",
                    border: "1px solid var(--bei)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#16a34a",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--c1)", fontSize: "0.92rem" }}>
                        {item.title}
                      </div>
                      <div style={{ color: "var(--c2)", fontSize: "0.8rem", marginTop: 2 }}>
                        {item.date}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#166534",
                      background: "#dcfce7",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  >
                    تم التسجيل {item.scannedAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
