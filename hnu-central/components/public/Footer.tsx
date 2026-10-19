import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/config/site";

const FOOTER_LINKS = [
  { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
  { href: "/about", labelAr: "عن الأسرة", labelEn: "About" },
  { href: "/committees", labelAr: "اللجان", labelEn: "Committees" },
  { href: "/events", labelAr: "الفعاليات", labelEn: "Events" },
  { href: "/media", labelAr: "الميديا", labelEn: "Media" },
  { href: "/join", labelAr: "انضم لينا", labelEn: "Join Us" },
];

const SOCIAL_ICONS: Record<string, string> = {
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  instagram: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  tiktok: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z",
  youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
};

export default function Footer({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const t = (ar: string, en: string) => lang === "ar" ? ar : en;

  return (
    <footer>
      <div className="wrap foot">
        {/* Logo + brand */}
        <div>
          <Image
            src="/assets/images/logo.png"
            alt="أسرة طلاب من أجل مصر"
            width={96}
            height={96}
            className="flogo"
          />
          <p style={{ marginTop: 12, maxWidth: 200, fontSize: ".9rem", opacity: .8 }}>
            {t("من أجل مصر.. نبدأ من الجامعة", "For Egypt.. we start from the university")}
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer navigation">
          <h4>{t("روابط سريعة", "Quick Links")}</h4>
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {t(link.labelAr, link.labelEn)}
            </Link>
          ))}
        </nav>

        {/* Social */}
        <div>
          <h4>{t("تابعونا على", "Follow Us")}</h4>
          <div className="soc">
            {Object.entries(SITE.social).map(([key, url]) => {
              const path = SOCIAL_ICONS[key];
              if (!path) return null;
              return url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ) : null;
            })}
          </div>

          {/* Login link */}
          <div style={{ marginTop: 20 }}>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--g3)",
                fontWeight: 600,
                fontSize: ".9rem",
                opacity: .8,
                transition: ".2s",
              }}
            >
              🔐 {t("تسجيل الدخول — بوابة الأسرة المركزية", "Login — Central Family Portal")}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="copy">
          © 2026 {t("أسرة طلاب من أجل مصر — جامعة حلوان الأهلية", "Students For Egypt — Helwan National University")}
        </p>
      </div>
    </footer>
  );
}
