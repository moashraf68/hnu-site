import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { EVENTS } from "@/config/site";
import QRScanner from "@/components/ui/QRScanner";
import { Calendar, CheckCircle2, Clock, MapPin, Tag } from "lucide-react";

export default async function DashboardEventsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const attendedEventIds = new Set<string>();
  interface DbEvent {
    id: string;
    titleAr: string;
    titleEn?: string;
    descriptionAr?: string;
    date: string;
    committeeId?: string;
    qrToken?: string;
    img?: string;
  }
  let eventsList: DbEvent[] = [];

  try {
    const attRows = await sql<{ event_id: string }>`
      SELECT event_id FROM attendance WHERE user_id = ${user.id}
    `;
    attRows.rows.forEach((r) => attendedEventIds.add(r.event_id));

    const dbEvents = await sql<{
      id: string;
      title_ar: string;
      title_en: string;
      description_ar: string;
      date: string;
      committee_id: string;
      qr_token: string;
    }>`
      SELECT id, title_ar, title_en, description_ar, date, committee_id, qr_token
      FROM events
      WHERE is_active = true
      ORDER BY date DESC
    `;

    if (dbEvents.rows.length > 0) {
      eventsList = dbEvents.rows.map((e) => ({
        id: e.id,
        titleAr: e.title_ar,
        titleEn: e.title_en,
        descriptionAr: e.description_ar,
        date: new Date(e.date).toLocaleDateString("ar-EG"),
        committeeId: e.committee_id,
        qrToken: e.qr_token,
      }));
    }
  } catch (err) {
    console.warn("[EVENTS_PAGE_DB_NOTE]", err);
  }

  // Fallback to config events if DB has none
  if (eventsList.length === 0) {
    eventsList = EVENTS.map((e) => ({
      id: e.id,
      titleAr: e.titleAr,
      titleEn: e.titleEn,
      descriptionAr: e.descAr,
      date: e.date,
      committeeId: e.committeeName,
      img: e.img,
    }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
          فعاليات الأسرة وتأكيد الحضور
        </h1>
        <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
          استعرض الفعاليات النشطة وسجل حضورك الميداني باستخدام رمز الفعالية أو الـ QR
        </p>
      </div>

      {/* QR Scanner Component */}
      <QRScanner />

      {/* Events List */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
            قائمة الفعاليات ({eventsList.length})
          </h2>
          <span style={{ fontSize: "0.85rem", color: "var(--c2)", fontWeight: 600 }}>
            تم حضور {attendedEventIds.size} من {eventsList.length}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          }}
        >
          {eventsList.map((ev) => {
            const isAttended = attendedEventIds.has(ev.id);

            return (
              <div
                key={ev.id}
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  padding: 0,
                  border: isAttended ? "2px solid #86efac" : "2px solid var(--bei)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Event Image / Placeholder banner */}
                <div
                  style={{
                    height: 180,
                    position: "relative",
                    background: "linear-gradient(135deg, var(--c1) 0%, var(--c2) 100%)",
                  }}
                >
                  {ev.img ? (
                    <Image
                      src={ev.img}
                      alt={ev.titleAr}
                      width={400}
                      height={200}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--g3)",
                      }}
                    >
                      <Calendar size={48} opacity={0.6} />
                    </div>
                  )}

                  {/* Attendance status badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      insetInlineEnd: 12,
                    }}
                  >
                    {isAttended ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "#dcfce7",
                          color: "#166534",
                          border: "1px solid #86efac",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>تم الحضور</span>
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "rgba(59,38,22,0.85)",
                          backdropFilter: "blur(6px)",
                          color: "var(--g3)",
                          border: "1px solid rgba(242,168,29,0.3)",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: "0.82rem",
                        }}
                      >
                        <Clock size={14} />
                        <span>متاح للتسجيل</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {ev.committeeId && (
                    <span
                      className="pill"
                      style={{
                        alignSelf: "flex-start",
                        background: "var(--bei)",
                        color: "var(--c1)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      {ev.committeeId}
                    </span>
                  )}

                  <h3
                    style={{
                      fontSize: "1.18rem",
                      fontWeight: 800,
                      color: "var(--c1)",
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {ev.titleAr}
                  </h3>

                  {ev.descriptionAr && (
                    <p
                      style={{
                        color: "var(--c2)",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        marginBottom: 16,
                        flex: 1,
                      }}
                    >
                      {ev.descriptionAr}
                    </p>
                  )}

                  <div
                    style={{
                      paddingTop: 12,
                      borderTop: "1px solid var(--bei)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "var(--c2)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Calendar size={14} />
                      <span>{ev.date}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={14} />
                      <span>جامعة حلوان الأهلية</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
