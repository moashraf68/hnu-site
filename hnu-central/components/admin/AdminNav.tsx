"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import type { User as UserType } from "@/lib/db";

interface AdminNavProps {
  user: UserType;
  children: React.ReactNode;
}

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "الطلاب والأعضاء", icon: Users },
  { href: "/admin/events", label: "إدارة الفعاليات", icon: Calendar },
  { href: "/admin/evaluations", label: "التقييمات", icon: Award },
  { href: "/admin/suggestions", label: "المقترحات والأفكار", icon: MessageSquare },
];

export default function AdminNav({ user, children }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
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
          borderBottom: "1px solid rgba(242,168,29,0.3)",
        }}
        className="lg:hidden"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src="/assets/images/logo.png"
            alt="شعار الإدارة"
            width={36}
            height={36}
            style={{ borderRadius: 8, background: "#fff" }}
          />
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--g3)" }}>
            Central Family Admin
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="تبديل القائمة الجانبية للإدارة"
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
            background: "rgba(0,0,0,0.6)",
            zIndex: 39,
          }}
          className="lg:hidden"
        />
      )}

      {/* Dark Sidebar */}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""}`}
        style={{
          background: "#24160c",
          borderInlineEnd: "2px solid rgba(242,168,29,0.3)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
        }}
      >
        {/* Brand Header */}
        <div
          className="sidebar-logo"
          style={{
            borderBottom: "1px solid rgba(242,168,29,0.2)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <Link href="/admin" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/images/logo.png"
              alt="شعار لوحة الإدارة"
              width={42}
              height={42}
              style={{
                borderRadius: "10px",
                border: "1.5px solid var(--g)",
              }}
            />
            <div>
              <div style={{ lineHeight: 1.2, color: "var(--g3)", fontWeight: 800 }}>
                Central Family Admin
              </div>
              <small
                style={{
                  color: "var(--g)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <ShieldAlert size={12} />
                <span>لوحة التحكم المركزية</span>
              </small>
            </div>
          </Link>
        </div>

        {/* Current Admin Tag */}
        <div
          style={{
            margin: "14px 12px",
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(242,168,29,0.1)",
            border: "1px solid rgba(242,168,29,0.25)",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--g3)", fontWeight: 700 }}>
            {user.role === "SUPER_ADMIN" ? "المدير العام (Super Admin)" : "مسؤول النظام (Admin)"}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#fff",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.fullName}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav" aria-label="قائمة لوحة الإدارة">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderRadius: "12px",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.94rem",
                  transition: "0.2s",
                  background: isActive ? "rgba(242,168,29,0.25)" : "transparent",
                  color: isActive ? "var(--g3)" : "rgba(255,255,255,0.75)",
                  borderInlineStart: isActive ? "4px solid var(--g)" : "4px solid transparent",
                }}
              >
                <Icon size={19} color={isActive ? "var(--g)" : "currentColor"} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div
            style={{
              margin: "18px 0 8px",
              borderTop: "1px solid rgba(242,168,29,0.15)",
              paddingTop: 12,
            }}
          >
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 16px",
                borderRadius: 12,
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.88rem",
              }}
            >
              <ExternalLink size={16} />
              <span>لوحة الطالب</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 16px",
                borderRadius: 12,
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.88rem",
              }}
            >
              <ExternalLink size={16} />
              <span>الموقع العام</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer" style={{ borderTop: "1px solid rgba(242,168,29,0.15)" }}>
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
              background: "rgba(200,16,46,0.2)",
              color: "#ff9999",
              border: "1px solid rgba(200,16,46,0.35)",
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontSize: "0.92rem",
              fontWeight: 700,
              transition: "0.2s",
            }}
          >
            <LogOut size={18} />
            <span>{isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        className="dash-main"
        style={{
          background: "#f4ede0",
          paddingTop: "calc(64px + 20px)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>{children}</div>
      </main>

      {/* Responsive helper */}
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
