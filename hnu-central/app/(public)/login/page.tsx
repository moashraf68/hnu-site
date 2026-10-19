"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanId = nationalId.trim();
    if (!cleanId || cleanId.length !== 14 || !/^\d{14}$/.test(cleanId)) {
      setError("رقم الهوية القومية يجب أن يتكون من 14 رقماً بالضبط");
      return;
    }

    if (!password) {
      setError("برجاء إدخال كلمة المرور");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nationalId: cleanId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول. تأكد من صحة البيانات.");
        return;
      }

      // Success redirect
      startTransition(() => {
        if (redirectParam) {
          router.push(redirectParam);
        } else if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      });
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم. برجاء المحاولة لاحقاً.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {/* Portal Branding */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/assets/images/logo.png"
            alt="شعار أسرة طلاب من أجل مصر"
            width={72}
            height={72}
            className="auth-logo"
            style={{
              margin: "0 auto 14px",
              borderRadius: "16px",
              border: "2px solid var(--g)",
              boxShadow: "0 6px 18px rgba(59,38,22,0.12)",
            }}
          />
          <h1 style={{ fontSize: "1.75rem", color: "var(--c1)", fontWeight: 800 }}>
            بوابة الأسرة المركزية
          </h1>
          <p className="sub" style={{ fontSize: "0.95rem", color: "var(--c2)", marginTop: 4 }}>
            أسرة طلاب من أجل مصر — جامعة حلوان الأهلية
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1.5px solid var(--red)",
              borderRadius: "12px",
              color: "var(--red)",
              fontSize: "0.92rem",
              fontWeight: 600,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="form-group">
            <label htmlFor="nationalId">
              رقم الهوية القومية (14 رقماً) <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id="nationalId"
              type="text"
              name="nationalId"
              inputMode="numeric"
              maxLength={14}
              required
              placeholder="الرقم القومي المكون من 14 رقم"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
              dir="ltr"
              style={{
                textAlign: "start",
                letterSpacing: "1px",
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              كلمة المرور <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className="btn big"
            disabled={isPending}
            style={{
              marginTop: 10,
              width: "100%",
              opacity: isPending ? 0.75 : 1,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* Links to Register & Home */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid var(--bei)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: "0.92rem",
          }}
        >
          <p style={{ color: "var(--c2)" }}>
            ليس لديك حساب بعد؟{" "}
            <Link href="/register" className="auth-link">
              سجل عضويتك الآن
            </Link>
          </p>

          <Link href="/" style={{ color: "var(--c2)", fontSize: "0.88rem" }}>
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-wrap">
          <div className="auth-card text-center" style={{ padding: 40 }}>
            <p style={{ color: "var(--c2)", fontWeight: 700 }}>جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
