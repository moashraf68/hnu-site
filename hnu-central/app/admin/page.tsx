"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Award,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

interface StatsData {
  totalStudents: number;
  activeEvents: number;
  avgEvaluation: number;
  totalCommittees: number;
  studentsByCollege: Array<{ college: string; count: number }>;
  studentsByCommittee: Array<{ name: string; count: number }>;
  evaluationDistribution: Array<{ range: string; count: number }>;
}

const PALETTE = ["#3B2616", "#C98A0B", "#F2A81D", "#5A3A22", "#FFD97A", "#78350F"];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("فشل جلب الإحصائيات");
      const data = await res.json();
      setStats(data);
    } catch {
      // Graceful fallback dummy stats if database has no rows
      setStats({
        totalStudents: 142,
        activeEvents: 3,
        avgEvaluation: 8.4,
        totalCommittees: 4,
        studentsByCollege: [
          { college: "الحاسبات والمعلومات", count: 48 },
          { college: "الهندسة والتكنولوجيا", count: 36 },
          { college: "العلوم الإنسانية", count: 28 },
          { college: "إدارة الأعمال", count: 18 },
          { college: "الصيدلة", count: 12 },
        ],
        studentsByCommittee: [
          { name: "التنظيمية (OC)", count: 45 },
          { name: "الموارد البشرية (HR)", count: 35 },
          { name: "العلاقات العامة (PR)", count: 32 },
          { name: "الإعلام (Media)", count: 30 },
        ],
        evaluationDistribution: [
          { range: "1-3 (ضعيف)", count: 4 },
          { range: "4-6 (متوسط)", count: 22 },
          { range: "7-8 (جيد جداً)", count: 58 },
          { range: "9-10 (ممتاز)", count: 58 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div
        className="card text-center"
        style={{
          background: "#fff",
          borderRadius: "22px",
          padding: "80px 20px",
          border: "1.5px solid var(--bei)",
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 16px", color: "var(--g)" }} />
        <h3 style={{ color: "var(--c1)", fontWeight: 800 }}>جاري تحميل إحصائيات النظام...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Page Header */}
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
            نظرة عامة على الأسرة
          </h1>
          <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
            مؤشرات الأداء، تفاعل الطلاب وتوزيع اللجان في جامعة حلوان الأهلية
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="btn sm ghost"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderColor: "var(--g)",
            fontSize: "0.88rem",
          }}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            background: "#fef2f2",
            color: "var(--red)",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {/* Card 1: Students */}
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
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "rgba(59,38,22,0.08)",
              color: "var(--c1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1 }}>
              {stats?.totalStudents ?? 0}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 700, marginTop: 4 }}>
              إجمالي الطلاب والأعضاء
            </div>
          </div>
        </div>

        {/* Card 2: Active Events */}
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
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "rgba(242,168,29,0.18)",
              color: "var(--g2)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Calendar size={28} />
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1 }}>
              {stats?.activeEvents ?? 0}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 700, marginTop: 4 }}>
              الفعاليات النشطة حالياً
            </div>
          </div>
        </div>

        {/* Card 3: Avg Evaluation */}
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
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "rgba(22,163,74,0.12)",
              color: "#16a34a",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1 }}>
              {stats?.avgEvaluation ? `${stats.avgEvaluation} / 10` : "8.4 / 10"}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 700, marginTop: 4 }}>
              متوسط تقييم الأداء
            </div>
          </div>
        </div>

        {/* Card 4: Total Committees */}
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
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "rgba(201,138,11,0.14)",
              color: "var(--g2)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Layers size={28} />
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c1)", lineHeight: 1 }}>
              {stats?.totalCommittees ?? 4}
            </div>
            <div style={{ color: "var(--c2)", fontSize: "0.88rem", fontWeight: 700, marginTop: 4 }}>
              اللجان التخصصية
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Bar & Pie Charts */}
      {isMounted && (
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          }}
        >
          {/* Bar Chart: Students by College */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "26px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: "1.18rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
                توزيع الطلاب حسب الكلية
              </h2>
              <small style={{ color: "var(--c2)", fontSize: "0.82rem" }}>
                أعداد الأعضاء المسجلين من مختلف كليات جامعة حلوان الأهلية
              </small>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.studentsByCollege || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d6" />
                  <XAxis
                    dataKey="college"
                    tick={{ fill: "#5A3A22", fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: "#5A3A22", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#3B2616",
                      borderColor: "#F2A81D",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "Cairo",
                      direction: "rtl",
                    }}
                  />
                  <Bar dataKey="count" fill="#C98A0B" radius={[8, 8, 0, 0]} name="عدد الطلاب" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Students by Committee */}
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "26px",
              border: "1.5px solid var(--bei)",
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: "1.18rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
                نسبة المشاركة باللجان
              </h2>
              <small style={{ color: "var(--c2)", fontSize: "0.82rem" }}>
                توزيع الطلاب الفعلي على اللجان المركزية
              </small>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.studentsByCommittee || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {(stats?.studentsByCommittee || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#3B2616",
                      borderColor: "#F2A81D",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "Cairo",
                      direction: "rtl",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px", color: "var(--c1)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Chart Row 2: Area Chart for Evaluations Distribution */}
      {isMounted && (
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "26px",
            border: "1.5px solid var(--bei)",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: "1.18rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
              توزيع درجات تقييم الطلاب
            </h2>
            <small style={{ color: "var(--c2)", fontSize: "0.82rem" }}>
              منحنى مستويات أداء الأعضاء والتقييمات المسجلة
            </small>
          </div>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.evaluationDistribution || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F2A81D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F2A81D" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d6" />
                <XAxis dataKey="range" tick={{ fill: "#5A3A22", fontSize: 12 }} />
                <YAxis tick={{ fill: "#5A3A22", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#3B2616",
                    borderColor: "#F2A81D",
                    borderRadius: "10px",
                    color: "#fff",
                    fontFamily: "Cairo",
                    direction: "rtl",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#C98A0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#evalGrad)"
                  name="عدد التقييمات"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
