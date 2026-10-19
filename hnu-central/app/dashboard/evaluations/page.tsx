import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getEvalColor } from "@/lib/utils";
import { Award, TrendingUp, AlertCircle, Calendar, Star, FileText } from "lucide-react";

interface EvalRecord {
  id: string;
  score: number;
  notes?: string;
  createdAt: string;
}

export default async function EvaluationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let evaluations: EvalRecord[] = [];

  try {
    const res = await sql<{
      id: string;
      score: number;
      notes?: string;
      created_at: string;
    }>`
      SELECT id, score, notes, created_at
      FROM evaluations
      WHERE student_id = ${user.id}
      ORDER BY created_at DESC
    `;

    evaluations = res.rows.map((r) => ({
      id: r.id,
      score: Number(r.score),
      notes: r.notes,
      createdAt: new Date(r.created_at).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  } catch (err) {
    console.warn("[EVALS_FETCH_ERR]", err);
  }

  const scores = evaluations.map((e) => e.score);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const latestScore = scores.length > 0 ? scores[0] : null;

  const getColorConfig = (score: number) => {
    const c = getEvalColor(score);
    if (c === "green") {
      return { bg: "#f0fdf4", border: "#86efac", text: "#166534", label: "أداء متميز (ممتاز)" };
    }
    if (c === "yellow") {
      return { bg: "#fffbeb", border: "#fde68a", text: "#92400e", label: "أداء جيد (متوسط)" };
    }
    return { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", label: "يحتاج إلى تطوير" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
          تقييمات الأداء والمتابعة
        </h1>
        <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
          متابعة مستمرة لأدائك ومشاركتك في لجان وفعاليات أسرة طلاب من أجل مصر
        </p>
      </div>

      {/* Stats Summary */}
      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
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
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "rgba(242,168,29,0.18)",
              color: "var(--c1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Star size={26} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {latestScore !== null ? `${latestScore} / 10` : "—"}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>
              أحدث تقييم
            </div>
          </div>
        </div>

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
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "rgba(22,163,74,0.12)",
              color: "#16a34a",
              display: "grid",
              placeItems: "center",
            }}
          >
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {avgScore !== null ? `${avgScore} / 10` : "—"}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>
              متوسط التقييم العام
            </div>
          </div>
        </div>

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
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "rgba(59,38,22,0.08)",
              color: "var(--c1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1.1 }}>
              {evaluations.length}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>
              إجمالي التقييمات المسجلة
            </div>
          </div>
        </div>
      </div>

      {/* Evaluations List */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c1)", marginBottom: 16 }}>
          سجل التقييمات التفصيلي
        </h2>

        {evaluations.length === 0 ? (
          <div
            className="card text-center"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "60px 20px",
              border: "2px dashed var(--bei)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎯</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c1)", marginBottom: 8 }}>
              لم يتم تسجيل أي تقييم لأدائك حتى الآن
            </h3>
            <p style={{ color: "var(--c2)", maxWidth: 500, margin: "0 auto", fontSize: "0.92rem", lineHeight: 1.7 }}>
              تقوم لجنة الموارد البشرية (HR) وإدارة الأسرة بتقييم الأعضاء دورياً بعد الفعاليات والمشاركات الميدانية وورش العمل.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {evaluations.map((item) => {
              const cfg = getColorConfig(item.score);
              const percentage = Math.round((item.score / 10) * 100);

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "24px",
                    border: `1.5px solid ${cfg.border}`,
                    boxShadow: "0 4px 14px rgba(59,38,22,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: "var(--c1)",
                        }}
                      >
                        {item.score} <span style={{ fontSize: "0.95rem", color: "var(--c2)" }}>/ 10</span>
                      </span>

                      <span
                        style={{
                          padding: "4px 14px",
                          borderRadius: 999,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          background: cfg.bg,
                          color: cfg.text,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--c2)", fontSize: "0.85rem" }}>
                      <Calendar size={14} />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  {/* Progress visualization */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "var(--bei)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            cfg.text === "#166534"
                              ? "linear-gradient(90deg, #16a34a, #22c55e)"
                              : cfg.text === "#92400e"
                              ? "linear-gradient(90deg, #d97706, #f59e0b)"
                              : "linear-gradient(90deg, #dc2626, #ef4444)",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "var(--c2)",
                        marginTop: 4,
                      }}
                    >
                      <span>0</span>
                      <span>5 (متوسط)</span>
                      <span>10 (مثالي)</span>
                    </div>
                  </div>

                  {/* Notes / Feedback */}
                  {item.notes && (
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        background: "var(--bg)",
                        border: "1px solid var(--bei)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <FileText size={18} color="var(--c2)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--c1)", marginBottom: 2 }}>
                          ملاحظات وتوجيهات المقيم:
                        </div>
                        <p style={{ color: "var(--c2)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                          {item.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
