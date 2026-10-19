"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SITE } from "@/config/site";

const NAV_LINKS = [
  { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
  { href: "/about", labelAr: "عن الأسرة", labelEn: "About" },
  { href: "/leadership", labelAr: "قيادة الأسرة", labelEn: "Leadership" },
  { href: "/committees", labelAr: "اللجان", labelEn: "Committees" },
  { href: "/events", labelAr: "الفعاليات", labelEn: "Events" },
  { href: "/media", labelAr: "الميديا", labelEn: "Media" },
];

interface NavbarProps {
  lang?: "ar" | "en";
  currentPath?: string;
}

export default function Navbar({ lang = "ar", currentPath = "/" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ar" | "en">(lang);
  const [scrolled, setScrolled] = useState(false);

  const t = (ar: string, en: string) => currentLang === "ar" ? ar : en;

  useEffect(() => {
    const saved = localStorage.getItem("lang") as "ar" | "en" | null;
    if (saved) setCurrentLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className="nav"
      style={scrolled ? { boxShadow: "0 4px 24px rgba(59,38,22,.1)" } : {}}
    >
      <div className="wrap nav-in">
        {/* Brand */}
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <Image
            src="/assets/images/logo.png"
            alt="أسرة طلاب من أجل مصر"
            width={44}
            height={44}
            priority
          />
          <span>{t("من أجل مصر", "For Egypt")}</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={currentPath === link.href ? "page" : undefined}
            >
              {t(link.labelAr, link.labelEn)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav-act">
          {/* Lang toggle */}
          <button
            className="lang-btn"
            onClick={() => setCurrentLang(currentLang === "ar" ? "en" : "ar")}
            aria-label={currentLang === "ar" ? "Switch to English" : "التحويل إلى العربية"}
          >
            {currentLang === "ar" ? "EN" : "AR"}
          </button>

          {/* Login */}
          <Link href="/login" className="btn sm ghost" style={{ display: "none" }}>
            {t("تسجيل الدخول", "Login")}
          </Link>

          {/* Join (desktop) */}
          <a
            href={SITE.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-join btn"
          >
            {t("انضم لينا", "Join Us")}
          </a>

          {/* Burger */}
          <button
            className="burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t("القائمة", "Menu")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={currentPath === link.href ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {t(link.labelAr, link.labelEn)}
          </Link>
        ))}
        <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2" style={{ padding: "11px 14px", borderRadius: "12px", color: "var(--c2)", fontWeight: 600 }}>
          {t("تسجيل الدخول", "Login")}
        </Link>
        <a
          href={SITE.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="join-link"
          onClick={() => setMenuOpen(false)}
          style={{ padding: "11px 14px", borderRadius: "12px", display: "block" }}
        >
          {t("انضم لينا", "Join Us")}
        </a>
      </nav>
    </header>
  );
}
