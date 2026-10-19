"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { EVENTS } from "@/config/site";

export default function EventsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [selectedCommittee, setSelectedCommittee] = useState<string>("all");

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredEvents = useMemo(() => {
    return EVENTS.filter((ev) => {
      // Determine if upcoming or past
      const isPast = ev.date < todayStr;
      if (filter === "upcoming" && isPast) return false;
      if (filter === "past" && !isPast) return false;

      // Committee filter
      if (selectedCommittee !== "all" && ev.committeeSlug !== selectedCommittee) {
        return false;
      }

      return true;
    });
  }, [filter, selectedCommittee, todayStr]);

  const committees = useMemo(() => {
    const map = new Map<string, string>();
    EVENTS.forEach((e) => {
      if (e.committeeSlug && e.committeeName) {
        map.set(e.committeeSlug, e.committeeName);
      }
    });
    return Array.from(map.entries());
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="sec dark"
        style={{
          paddingTop: "calc(var(--nav) + 48px)",
          paddingBottom: "48px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--c1) 0%, #2b1c11 100%)",
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
            أنشطة وفعاليات الأسرة
          </span>
          <h1
            style={{
              color: "var(--g3)",
              fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            الفعاليات
          </h1>
          <p
            style={{
              maxWidth: 640,
              margin: "14px auto 0",
              color: "var(--bg)",
              opacity: 0.9,
              fontSize: "1.08rem",
              lineHeight: 1.8,
            }}
          >
            استكشف الفعاليات، ورش العمل، والمناسبات التي تنظمها أسرة طلاب من أجل مصر
          </p>
        </div>
      </section>

      {/* ===== FILTER BAR & EVENTS ===== */}
      <section className="sec" style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="wrap">
          {/* Filter Tabs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 36,
              padding: "16px 20px",
              background: "#fff",
              borderRadius: "18px",
              border: "1px solid var(--bei)",
              boxShadow: "0 4px 16px rgba(59,38,22,0.06)",
            }}
          >
            {/* Status Tabs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setFilter("all")}
                className={`btn sm ${filter === "all" ? "" : "ghost"}`}
                style={{
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderColor: filter === "all" ? "transparent" : "var(--bei)",
                }}
              >
                جميع الفعاليات ({EVENTS.length})
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`btn sm ${filter === "upcoming" ? "" : "ghost"}`}
                style={{
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderColor: filter === "upcoming" ? "transparent" : "var(--bei)",
                }}
              >
                الفعاليات القادمة
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`btn sm ${filter === "past" ? "" : "ghost"}`}
                style={{
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderColor: filter === "past" ? "transparent" : "var(--bei)",
                }}
              >
                الفعاليات السابقة
              </button>
            </div>

            {/* Committee Filter */}
            {committees.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  htmlFor="comm-select"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--c2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  اللجنة المنظمة:
                </label>
                <select
                  id="comm-select"
                  value={selectedCommittee}
                  onChange={(e) => setSelectedCommittee(e.target.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid var(--bei)",
                    background: "#fff",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    color: "var(--c1)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <option value="all">كل اللجان</option>
                  {committees.map(([slug, name]) => (
                    <option key={slug} value={slug}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div
              className="card text-center"
              style={{
                padding: "60px 20px",
                borderRadius: "20px",
                background: "#fff",
                border: "2px dashed var(--bei)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>📅</div>
              <h3 style={{ color: "var(--c1)", fontWeight: 800 }}>لا توجد فعاليات مطابقة</h3>
              <p style={{ color: "var(--c2)", marginTop: 8 }}>
                جرب تغيير التبويب أو اختيار لجنة أخرى لعرض المزيد من الفعاليات.
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSelectedCommittee("all");
                }}
                className="btn sm"
                style={{ marginTop: 20 }}
              >
                عرض كل الفعاليات
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "28px",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {filteredEvents.map((ev) => {
                const isPast = ev.date < todayStr;
                return (
                  <article
                    key={ev.id}
                    className="card ev"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "#fff",
                      border: "2px solid var(--bei)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Event Image */}
                    <div className="evimg" style={{ position: "relative" }}>
                      <Image
                        src={ev.img}
                        alt={ev.titleAr}
                        width={500}
                        height={333}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {/* Date Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          insetInlineEnd: 14,
                          background: "rgba(59,38,22,0.88)",
                          backdropFilter: "blur(6px)",
                          color: "var(--g3)",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          border: "1px solid rgba(242,168,29,0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>{ev.icon || "📅"}</span>
                        <span>{ev.date}</span>
                      </div>
                    </div>

                    {/* Event Body */}
                    <div
                      className="evb"
                      style={{
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {/* Committee & Status Badges */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        {ev.committeeName && (
                          <span
                            className="pill"
                            style={{
                              background: "var(--bei)",
                              color: "var(--c1)",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            {ev.committeeName}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: isPast ? "var(--c2)" : "#166534",
                            background: isPast ? "rgba(0,0,0,0.05)" : "#dcfce7",
                            padding: "2px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {isPast ? "فعالية منتهية" : "فعالية مرتقبة"}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--c1)",
                          lineHeight: 1.4,
                          marginBottom: 10,
                        }}
                      >
                        {ev.titleAr}
                      </h2>

                      <p
                        style={{
                          color: "var(--c2)",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                          marginBottom: 18,
                          flex: 1,
                        }}
                      >
                        {ev.descAr}
                      </p>

                      <div
                        style={{
                          paddingTop: 14,
                          borderTop: "1px solid var(--bei)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--c2)",
                            fontWeight: 600,
                          }}
                        >
                          جامعة حلوان الأهلية
                        </span>
                        <Link
                          href="/login"
                          className="btn sm"
                          style={{
                            fontSize: "0.82rem",
                            padding: "5px 14px",
                          }}
                        >
                          تسجيل الحضور
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
