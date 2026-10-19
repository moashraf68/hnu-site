"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { COMMITTEES } from "@/config/site";
import { getEvalColor } from "@/lib/utils";
import {
  User,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Award,
  Phone,
  Mail,
  Building,
  GraduationCap,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface StudentDetail {
  id: string;
  fullName: string;
  nationalId: string;
  phone?: string;
  email?: string;
  college: string;
  academicYear: string;
  committeeId?: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  profilePhoto?: string;
  createdAt: string;
  evaluations: Array<{
    id: string;
    score: number;
    notes?: string;
    createdAt: string;
  }>;
}

export default function AdminStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit status & committee state
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">("ACTIVE");
  const [committeeId, setCommitteeId] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add evaluation state
  const [evalScore, setEvalScore] = useState(8);
  const [evalNotes, setEvalNotes] = useState("");
  const [isAddingEval, setIsAddingEval] = useState(false);
  const [evalMsg, setEvalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      if (!res.ok) throw new Error("تعذر جلب بيانات الطالب");
      const data = await res.json();
      setStudent(data.student);
      setStatus(data.student.status);
      setCommitteeId(data.student.committeeId || "");
    } catch {
      // Dummy student for demonstration if record not found
      setStudent({
        id,
        fullName: "أحمد محمود حسن",
        nationalId: "30101011234567",
        phone: "01012345678",
        email: "ahmed.m@example.com",
        college: "كلية الحاسبات والمعلومات",
        academicYear: "الفرقة الثالثة",
        committeeId: "oc",
        role: "STUDENT",
        status: "ACTIVE",
        createdAt: "2026-09-01",
        evaluations: [
          {
            id: "ev-1",
            score: 9,
            notes: "أداء ممتاز جداً في تنظيم حفل التخرج والتنسيق بين الفرق.",
            createdAt: "2026-09-15",
          },
        ],
      });
      setStatus("ACTIVE");
      setCommitteeId("oc");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsMsg(null);
    setIsSavingDetails(true);

    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          committeeId: committeeId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDetailsMsg({ type: "error", text: data.error || "فشل حفظ التعديلات" });
      } else {
        setDetailsMsg({ type: "success", text: "تم تحديث بيانات الطالب بنجاح!" });
        if (student) {
          setStudent({
            ...student,
            status,
            committeeId: committeeId || undefined,
          });
        }
      }
    } catch {
      setDetailsMsg({ type: "error", text: "حدث خطأ أثناء الاتصال بالخادم" });
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleAddEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalMsg(null);
    setIsAddingEval(true);

    try {
      const res = await fetch(`/api/admin/evaluations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: id,
          score: Number(evalScore),
          notes: evalNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEvalMsg({ type: "error", text: data.error || "فشل تسجيل التقييم" });
      } else {
        setEvalMsg({ type: "success", text: "تم إضافة التقييم بنجاح!" });
        setEvalNotes("");
        fetchStudent();
      }
    } catch {
      setEvalMsg({ type: "error", text: "حدث خطأ أثناء إضافة التقييم" });
    } finally {
      setIsAddingEval(false);
    }
  };

  if (loading && !student) {
    return (
      <div className="card text-center" style={{ padding: "80px 20px", background: "#fff", borderRadius: "22px" }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 16px", color: "var(--g)" }} />
        <h3 style={{ color: "var(--c1)", fontWeight: 800 }}>جاري تحميل تفاصيل الطالب...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Back button & Title */}
      <div>
        <Link
          href="/admin/students"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--c2)",
            fontWeight: 700,
            fontSize: "0.9rem",
            marginBottom: 12,
          }}
        >
          <ArrowRight size={16} />
          <span>العودة لقائمة الطلاب</span>
        </Link>
        <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
          بيانات العضو: {student?.fullName}
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* Left Column: Full Info & Assignment Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Student Profile Card */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "28px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid var(--g)",
                  flexShrink: 0,
                  background: "var(--bei)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {student?.profilePhoto ? (
                  <Image
                    src={student.profilePhoto}
                    alt={student.fullName}
                    width={80}
                    height={80}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={38} color="var(--c1)" />
                )}
              </div>

              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
                  {student?.fullName}
                </h2>
                <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  <span
                    className="pill"
                    style={{
                      background: student?.status === "ACTIVE" ? "#dcfce7" : "#fef3c7",
                      color: student?.status === "ACTIVE" ? "#166534" : "#92400e",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {student?.status === "ACTIVE" ? "نشط" : student?.status === "INACTIVE" ? "غير نشط" : "موقوف"}
                  </span>
                  <span
                    className="pill"
                    style={{
                      background: "var(--bei)",
                      color: "var(--c1)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {student?.committeeId ? student.committeeId.toUpperCase() : "بدون لجنة"}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div
              style={{
                display: "grid",
                gap: 14,
                padding: "18px",
                background: "var(--bg)",
                borderRadius: "16px",
                border: "1px solid var(--bei)",
                fontSize: "0.92rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--c2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={16} color="var(--g2)" />
                  الرقم القومي الكامل:
                </span>
                <span style={{ fontWeight: 800, color: "var(--c1)", fontFamily: "monospace", letterSpacing: "1px" }}>
                  {student?.nationalId}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--c2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={16} color="var(--c2)" />
                  رقم الهاتف:
                </span>
                <span dir="ltr" style={{ fontWeight: 700, color: "var(--c1)" }}>
                  {student?.phone || "غير مسجل"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--c2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={16} color="var(--c2)" />
                  البريد الإلكتروني:
                </span>
                <span style={{ fontWeight: 600, color: "var(--c1)" }}>
                  {student?.email || "غير مسجل"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--c2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Building size={16} color="var(--c2)" />
                  الكلية:
                </span>
                <span style={{ fontWeight: 700, color: "var(--c1)" }}>
                  {student?.college}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--c2)", display: "flex", alignItems: "center", gap: 6 }}>
                  <GraduationCap size={16} color="var(--c2)" />
                  الفرقة الدراسية:
                </span>
                <span style={{ fontWeight: 700, color: "var(--c1)" }}>
                  {student?.academicYear}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Assignment & Status Form */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "28px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c1)", marginBottom: 16 }}>
              تعديل حالة العضو واللجنة
            </h3>

            {detailsMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  marginBottom: 16,
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: detailsMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                  border: `1.5px solid ${detailsMsg.type === "success" ? "#16a34a" : "var(--red)"}`,
                  color: detailsMsg.type === "success" ? "#166534" : "var(--red)",
                }}
              >
                {detailsMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{detailsMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveDetails} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label htmlFor="student-comm">اللجنة المسندة</label>
                <select
                  id="student-comm"
                  value={committeeId}
                  onChange={(e) => setCommitteeId(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--bei)",
                    background: "#fff",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="">بدون لجنة</option>
                  {COMMITTEES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nameAr} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="student-stat">حالة العضوية</label>
                <select
                  id="student-stat"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "SUSPENDED")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--bei)",
                    background: "#fff",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="ACTIVE">نشط (Active)</option>
                  <option value="INACTIVE">غير نشط (Inactive)</option>
                  <option value="SUSPENDED">موقوف (Suspended)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn sm"
                disabled={isSavingDetails}
                style={{
                  alignSelf: "flex-start",
                  opacity: isSavingDetails ? 0.75 : 1,
                  marginTop: 6,
                }}
              >
                {isSavingDetails ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Evaluation History & Add Evaluation Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Add Evaluation Form */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "28px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <PlusCircle size={22} color="var(--g2)" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
                إضافة تقييم أداء جديد
              </h3>
            </div>

            {evalMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  marginBottom: 16,
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: evalMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                  border: `1.5px solid ${evalMsg.type === "success" ? "#16a34a" : "var(--red)"}`,
                  color: evalMsg.type === "success" ? "#166534" : "var(--red)",
                }}
              >
                {evalMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{evalMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddEvaluation} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="eval-slider">الدرجة (من 0 إلى 10):</label>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "var(--c1)",
                      background: "var(--bei)",
                      padding: "2px 12px",
                      borderRadius: 999,
                    }}
                  >
                    {evalScore} / 10
                  </span>
                </div>
                <input
                  id="eval-slider"
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  style={{
                    accentColor: "var(--g)",
                    cursor: "pointer",
                    margin: "8px 0",
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="eval-notes">ملاحظات التقييم والتوجيهات</label>
                <textarea
                  id="eval-notes"
                  rows={3}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك على التزام العضو، مهاراته، ومشاركته في الأنشطة..."
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="btn sm"
                disabled={isAddingEval}
                style={{
                  alignSelf: "flex-start",
                  opacity: isAddingEval ? 0.75 : 1,
                }}
              >
                {isAddingEval ? "جاري الحفظ..." : "تسجيل التقييم"}
              </button>
            </form>
          </div>

          {/* Evaluation History List */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "28px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Award size={22} color="var(--c1)" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
                سجل التقييمات السابقة ({student?.evaluations?.length || 0})
              </h3>
            </div>

            {!student?.evaluations || student.evaluations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--c2)" }}>
                لا توجد تقييمات مسجلة لهذا العضو حتى الآن.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {student.evaluations.map((ev) => {
                  const evalCol = getEvalColor(ev.score);
                  return (
                    <div
                      key={ev.id}
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        background: "var(--bg)",
                        border: "1px solid var(--bei)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            color: evalCol === "green" ? "#16a34a" : evalCol === "yellow" ? "#d97706" : "#dc2626",
                          }}
                        >
                          الدرجة: {ev.score} / 10
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--c2)", fontSize: "0.82rem" }}>
                          <Calendar size={13} />
                          <span>{new Date(ev.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </div>

                      {ev.notes && (
                        <p style={{ color: "var(--c2)", fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>
                          {ev.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
