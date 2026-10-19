import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { CheckSquare, Calendar, Clock, QrCode, ArrowLeft } from "lucide-react";

interface AttendedItem {
  id: string;
  titleAr: string;
  eventDate: string;
  scannedAt: string;
  committeeId?: string;
}

export default async function AttendancePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let attendanceList: AttendedItem[] = [];

  try {
    const res = await sql<{
      id: string;
      title_ar: string;
      date: string;
      scanned_at: string;
      committee_id: string;
    }>`
      SELECT a.id, e.title_ar, e.date, a.scanned_at, e.committee_id
      FROM attendance a
      INNER JOIN events e ON e.id = a.event_id
      WHERE a.user_id = ${user.id}
      ORDER BY a.scanned_at DESC
    `;

    attendanceList = res.rows.map((row) => ({
      id: row.id,
      titleAr: row.title_ar,
      eventDate: new Date(row.date).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      scannedAt: new Date(row.scanned_at).toLocaleString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      }),
      committeeId: row.committee_id,
    }));
  } catch (err) {
    console.warn("[ATTENDANCE_FETCH_ERR]", err);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
            سجل الحضور الميداني
          </h1>
          <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
            الأرشيف الكامل للفعاليات والمناسبات التي قمت بحضورها وتأكيدها
          </p>
        </div>

        <Link
          href="/dashboard/events"
          className="btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
          }}
        >
          <QrCode size={18} />
          <span>تسجيل حضور جديد</span>
        </Link>
      </div>

      {/* Summary Card */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
          border: "1.5px solid var(--bei)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background: "rgba(22,163,74,0.12)",
            color: "#16a34a",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CheckSquare size={30} />
        </div>
        <div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
            {attendanceList.length}
          </div>
          <div style={{ color: "var(--c2)", fontSize: "0.9rem", fontWeight: 600, marginTop: 4 }}>
            إجمالي الفعاليات التي تم حضورها
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {attendanceList.length === 0 ? (
        <div
          className="card text-center"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "60px 20px",
            border: "2px dashed var(--bei)",
          }}
        >
          <div style={{ fontSize: "3.2rem", marginBottom: 12 }}>📋</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--c1)", marginBottom: 8 }}>
            لا يوجد سجل حضور مسجل بعد
          </h2>
          <p style={{ color: "var(--c2)", maxWidth: 480, margin: "0 auto 20px", fontSize: "0.95rem" }}>
            عند حضورك فعاليات الأسرة الميدانية، اطلب كود الفعالية أو امسح رمز الـ QR لتسجيل وتوثيق حضورك تلقائياً.
          </p>
          <Link href="/dashboard/events" className="btn sm">
            الانتقال لصفحة الفعاليات
          </Link>
        </div>
      ) : (
        <div className="card" style={{ background: "#fff", borderRadius: "22px", padding: 0, overflow: "hidden", border: "1.5px solid var(--bei)" }}>
          <div className="tbl-wrap">
            <table className="tbl" aria-label="جدول سجل الحضور">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>اسم الفعالية</th>
                  <th>تاريخ الفعالية</th>
                  <th>توقيت تسجيل الحضور</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: "var(--c2)" }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--c1)" }}>{item.titleAr}</div>
                      {item.committeeId && (
                        <span
                          className="pill"
                          style={{
                            background: "var(--bei)",
                            color: "var(--c1)",
                            fontSize: "0.75rem",
                            marginTop: 4,
                          }}
                        >
                          {item.committeeId}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--c2)", fontSize: "0.9rem" }}>
                        <Calendar size={14} />
                        <span>{item.eventDate}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--c2)", fontSize: "0.9rem" }}>
                        <Clock size={14} />
                        <span>{item.scannedAt}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 12px",
                          borderRadius: 999,
                          background: "#dcfce7",
                          color: "#166534",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                        }}
                      >
                        ✓ مؤكد
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
