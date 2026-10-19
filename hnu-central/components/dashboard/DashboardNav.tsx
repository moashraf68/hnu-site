"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LayoutDashboard,
  User,
  Calendar,
  CheckSquare,
  Award,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import type { User as UserType } from "@/lib/db";

interface DashboardNavProps {
  user: UserType;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "الملف الشخصي", icon: User },
  { href: "/dashboard/events", label: "الفعاليات", icon: Calendar },
  { href: "/dashboard/attendance", label: "سجل الحضور", icon: CheckSquare },
  { href: "/dashboard/evaluations", label: "التقييمات", icon: Award },
];

export default function DashboardNav({ user, children }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore error
    } finally {
      startTransition(() => {
        router.push("/login");
        router.refresh();
      });
    }
  };

  return (
    <div className="dash-layout" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Mobile Top Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          insetInline: 0,
          height: "64px",
          background: "var(--c1)",
          color: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 35,
          borderBottom: "1px solid rgba(242,168,29,0.25)",
        }}
        className="lg:hidden"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src="/assets/images/logo.png"
            alt="شعار الأسرة"
            width={36}
            height={36}
            style={{ borderRadius: 8, background: "#fff" }}
          />
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--g3)" }}>
            بوابة الأسرة المركزية
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="تبديل القائمة الجانبية"
          style={{
            background: "none",
            border: "none",
            color: "var(--g3)",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 39,
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""}`}
        style={{
          boxShadow: "4px 0 24px rgba(59,38,22,0.15)",
        }}
      >
        {/* Brand Header */}
        <div className="sidebar-logo">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/images/logo.png"
              alt="شعار الأسرة"
              width={42}
              height={42}
            />
            <div>
              <div style={{ lineHeight: 1.2 }}>بوابة الأسرة المركزية</div>
              <small
                style={{
                  color: "rgba(255,217,122,0.75)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                جامعة حلوان الأهلية
              </small>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Card in Sidebar */}
        <div
          style={{
            padding: "16px 14px",
            margin: "12px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "14px",
            border: "1px solid rgba(242,168,29,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--g)",
              flexShrink: 0,
              background: "var(--c2)",
              display: "grid",
              placeItems: "center",
            }}
          >
            {user.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.fullName}
                width={44}
                height={44}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "1.2rem" }}>👤</span>
            )}
          </div>
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.92rem",
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.fullName}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--g3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.college}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav" aria-label="قائمة لوحة التحكم">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "active" : ""}
                onClick={() => setMobileOpen(false)}
                style={{
                  position: "relative",
                  ...(isActive
                    ? {
                        background: "rgba(242,168,29,0.22)",
                        color: "var(--g3)",
                        borderInlineStart: "4px solid var(--g)",
                        fontWeight: 700,
                      }
                    : {}),
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div
            style={{
              margin: "16px 0 8px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 12,
            }}
          >
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px",
                borderRadius: 12,
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.88rem",
              }}
            >
              <ExternalLink size={16} />
              <span>الموقع الرئيسي</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer: Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            disabled={isPending}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: "12px",
              background: "rgba(200,16,46,0.15)",
              color: "#ff8585",
              border: "1px solid rgba(200,16,46,0.3)",
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontSize: "0.92rem",
              fontWeight: 700,
              transition: "0.2s",
            }}
          >
            <LogOut size={18} />
            <span>{isPending ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="dash-main"
        style={{
          paddingTop: "calc(64px + 20px)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
      </main>

      {/* Media query helper */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .dash-main {
            padding-top: 32px !important;
          }
          .lg\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
