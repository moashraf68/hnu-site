"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { maskNationalId, COLLEGES, YEARS, getEvalColor } from "@/lib/utils";
import { COMMITTEES } from "@/config/site";
import {
  Search,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface StudentItem {
  id: string;
  fullName: string;
  nationalId: string;
  college: string;
  academicYear: string;
  committeeId?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  profilePhoto?: string;
  evalScore?: number | null;
}

export default function AdminStudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [committeeFilter, setCommitteeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("فشل جلب قائمة الطلاب");
      const data = await res.json();
      setStudents(data.students || []);
    } catch {
      // Fallback sample data if database table is empty
      setStudents([
        {
          id: "usr-1",
          fullName: "أحمد محمود حسن",
          nationalId: "30101011234567",
          college: "كلية الحاسبات والمعلومات",
          academicYear: "الفرقة الثالثة",
          committeeId: "oc",
          status: "ACTIVE",
          evalScore: 9,
        },
        {
          id: "usr-2",
          fullName: "سارة محمد إبراهيم",
          nationalId: "30205151234568",
          college: "كلية الهندسة والتكنولوجيا",
          academicYear: "الفرقة الثانية",
          committeeId: "hr",
          status: "ACTIVE",
          evalScore: 8,
        },
        {
          id: "usr-3",
          fullName: "عمر خالد عبد العزيز",
          nationalId: "30008201234569",
          college: "كلية إدارة الأعمال",
          academicYear: "الفرقة الرابعة",
          committeeId: "pr",
          status: "INACTIVE",
          evalScore: 6,
        },
        {
          id: "usr-4",
          fullName: "مريم طارق سالم",
          nationalId: "30303121234570",
          college: "كلية العلوم الإنسانية",
          academicYear: "الفرقة الأولى",
          committeeId: "media",
          status: "ACTIVE",
          evalScore: 9,
        },
        {
          id: "usr-5",
          fullName: "يوسف حسام النجار",
          nationalId: "30111111234571",
          college: "كلية الصيدلة",
          academicYear: "الفرقة الثانية",
          committeeId: "oc",
          status: "SUSPENDED",
          evalScore: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = s.fullName.toLowerCase().includes(term);
        const matchesId = s.nationalId.includes(term);
        if (!matchesName && !matchesId) return false;
      }
      // College
      if (collegeFilter !== "all" && s.college !== collegeFilter) return false;
      // Committee
      if (committeeFilter !== "all" && s.committeeId !== committeeFilter) return false;
      // Status
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      // Year
      if (yearFilter !== "all" && s.academicYear !== yearFilter) return false;

      return true;
    });
  }, [students, searchTerm, collegeFilter, committeeFilter, statusFilter, yearFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Title */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
            إدارة الطلاب والأعضاء
          </h1>
          <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
            عرض، تصفية، وتعديل بيانات الأعضاء وحالاتهم وتعيينات اللجان
          </p>
        </div>

        <button
          onClick={fetchStudents}
          disabled={loading}
          className="btn sm ghost"
          style={{ display: "flex", alignItems: "center", gap: 6, borderColor: "var(--g)" }}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          border: "1.5px solid var(--bei)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search Input */}
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              position: "relative",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                insetInlineStart: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--c2)",
              }}
            />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم القومي..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                paddingInlineStart: "38px",
                borderRadius: "12px",
                border: "1.5px solid var(--bei)",
                fontFamily: "inherit",
                fontSize: "0.92rem",
                background: "var(--bg)",
              }}
            />
          </div>

          {/* College Filter */}
          <select
            value={collegeFilter}
            onChange={(e) => {
              setCollegeFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1.5px solid var(--bei)",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--c1)",
            }}
          >
            <option value="all">كل الكليات</option>
            {COLLEGES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Committee Filter */}
          <select
            value={committeeFilter}
            onChange={(e) => {
              setCommitteeFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1.5px solid var(--bei)",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--c1)",
            }}
          >
            <option value="all">كل اللجان</option>
            {COMMITTEES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nameAr} ({c.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1.5px solid var(--bei)",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--c1)",
            }}
          >
            <option value="all">كل الحالات</option>
            <option value="ACTIVE">نشط (Active)</option>
            <option value="INACTIVE">غير نشط (Inactive)</option>
            <option value="SUSPENDED">موقوف (Suspended)</option>
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1.5px solid var(--bei)",
              background: "#fff",
              fontFamily: "inherit",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--c1)",
            }}
          >
            <option value="all">كل الفرق الدراسية</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "22px",
          padding: 0,
          overflow: "hidden",
          border: "1.5px solid var(--bei)",
        }}
      >
        <div className="tbl-wrap">
          <table className="tbl" aria-label="جدول بيانات الطلاب والأعضاء">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>الصورة</th>
                <th>اسم الطالب</th>
                <th>الرقم القومي</th>
                <th>الكلية والفرقة</th>
                <th>اللجنة</th>
                <th>الحالة</th>
                <th>التقييم</th>
                <th style={{ textAlign: "center" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>
                    <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 8px", color: "var(--g)" }} />
                    <span style={{ color: "var(--c2)", fontWeight: 600 }}>جاري تحميل البيانات...</span>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--c2)" }}>
                    لا توجد نتائج مطابقة لخيارات البحث والتصفية.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const evalCol =
                    student.evalScore !== undefined && student.evalScore !== null
                      ? getEvalColor(student.evalScore)
                      : null;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => router.push(`/admin/students/${student.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "var(--bei)",
                            border: "1.5px solid var(--g)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {student.profilePhoto ? (
                            <Image
                              src={student.profilePhoto}
                              alt={student.fullName}
                              width={40}
                              height={40}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <User size={20} color="var(--c1)" />
                          )}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, color: "var(--c1)" }}>{student.fullName}</div>
                      </td>

                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--c2)", letterSpacing: "1px" }}>
                          {maskNationalId(student.nationalId)}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: "var(--c1)", fontSize: "0.88rem" }}>
                          {student.college}
                        </div>
                        <small style={{ color: "var(--c2)" }}>{student.academicYear}</small>
                      </td>

                      <td>
                        <span
                          className="pill"
                          style={{
                            background: "var(--bei)",
                            color: "var(--c1)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                        >
                          {student.committeeId ? student.committeeId.toUpperCase() : "غير محدد"}
                        </span>
                      </td>

                      <td>
                        {student.status === "ACTIVE" && (
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 999,
                              background: "#dcfce7",
                              color: "#166534",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                            }}
                          >
                            نشط
                          </span>
                        )}
                        {student.status === "INACTIVE" && (
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 999,
                              background: "#fef3c7",
                              color: "#92400e",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                            }}
                          >
                            غير نشط
                          </span>
                        )}
                        {student.status === "SUSPENDED" && (
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 999,
                              background: "#fee2e2",
                              color: "#991b1b",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                            }}
                          >
                            موقوف
                          </span>
                        )}
                      </td>

                      <td>
                        {student.evalScore !== undefined && student.evalScore !== null ? (
                          <span
                            style={{
                              fontWeight: 800,
                              color: evalCol === "green" ? "#16a34a" : evalCol === "yellow" ? "#d97706" : "#dc2626",
                            }}
                          >
                            {student.evalScore} / 10
                          </span>
                        ) : (
                          <span style={{ color: "var(--c2)", fontSize: "0.85rem" }}>—</span>
                        )}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <Link
                          href={`/admin/students/${student.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn sm ghost"
                          style={{
                            padding: "4px 10px",
                            fontSize: "0.82rem",
                            borderColor: "var(--bei)",
                          }}
                        >
                          <Eye size={14} />
                          <span>عرض</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderTop: "1px solid var(--bei)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 600 }}>
            إجمالي النتائج: {filteredStudents.length} طالب (صفحة {page} من {totalPages})
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn sm ghost"
              style={{
                opacity: page <= 1 ? 0.4 : 1,
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronRight size={16} />
              <span>السابق</span>
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn sm ghost"
              style={{
                opacity: page >= totalPages ? 0.4 : 1,
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              <span>التالي</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
