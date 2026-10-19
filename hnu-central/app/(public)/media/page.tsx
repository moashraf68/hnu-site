"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { GALLERY } from "@/config/site";

export default function MediaPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY.length);
    }
  }, [lightboxIndex]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY.length) % GALLERY.length);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="sec dark"
        style={{
          paddingTop: "calc(var(--nav) + 48px)",
          paddingBottom: "48px",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--c1) 0%, #291a10 100%)",
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
            معرض الصور والذكريات
          </span>
          <h1
            style={{
              color: "var(--g3)",
              fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            الميديا
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
            لقطات توثق أنشطتنا، فعالياتنا، وروح الأسرة في جامعة حلوان الأهلية
          </p>
        </div>
      </section>

      {/* ===== GALLERY GRID ===== */}
      <section className="sec" style={{ background: "var(--bg)", minHeight: "70vh" }}>
        <div className="wrap">
          {/* Column layout for masonry look */}
          <div
            style={{
              columnCount: 3,
              columnGap: "20px",
            }}
            className="masonry-gallery"
          >
            {GALLERY.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                style={{
                  breakInside: "avoid",
                  marginBottom: "20px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid var(--bei)",
                  boxShadow: "0 6px 20px rgba(59,38,22,0.08)",
                  position: "relative",
                  transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
                  background: "var(--c1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--g)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(59,38,22,0.16), 0 0 20px rgba(242,168,29,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = "var(--bei)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,38,22,0.08)";
                }}
              >
                <Image
                  src={imgSrc}
                  alt={`صورة ${idx + 1} من أرشيف أسرة طلاب من أجل مصر`}
                  width={600}
                  height={idx % 2 === 0 ? 400 : 550}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(59,38,22,0.7) 0%, transparent 60%)",
                    opacity: 0,
                    transition: "opacity 0.25s",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: "16px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <span
                    style={{
                      color: "var(--g3)",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    🔍 تكبير الصورة
                  </span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX MODAL ===== */}
      {lightboxIndex !== null && (
        <div
          className="lb show"
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة بالحجم الكامل"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close button */}
          <button
            type="button"
            className="lb-x"
            onClick={closeLightbox}
            aria-label="إغلاق المعرض"
          >
            ✕
          </button>

          {/* Prev button */}
          <button
            type="button"
            className="lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="الصورة السابقة"
          >
            ‹
          </button>

          {/* Current image */}
          <div
            style={{
              position: "relative",
              maxWidth: "min(92vw, 1100px)",
              maxHeight: "82vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY[lightboxIndex]}
              alt={`صورة ${lightboxIndex + 1} - طلاب من أجل مصر`}
              width={1200}
              height={800}
              style={{
                maxWidth: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                borderRadius: "14px",
                border: "3px solid var(--g)",
                boxShadow: "0 0 40px rgba(242,168,29,0.3)",
              }}
              priority
            />
            <div
              style={{
                marginTop: 12,
                color: "var(--g3)",
                fontSize: "0.95rem",
                fontWeight: 700,
              }}
            >
              صورة {lightboxIndex + 1} من {GALLERY.length}
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            className="lb-next"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="الصورة التالية"
          >
            ›
          </button>
        </div>
      )}

      {/* Responsive masonry CSS */}
      <style jsx>{`
        @media (max-width: 900px) {
          .masonry-gallery {
            column-count: 2 !important;
          }
        }
        @media (max-width: 550px) {
          .masonry-gallery {
            column-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}
