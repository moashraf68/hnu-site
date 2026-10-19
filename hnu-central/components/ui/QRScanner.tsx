"use client";

import { useState } from "react";
import { QrCode, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface QRScannerProps {
  onSuccess?: () => void;
}

export default function QRScanner({ onSuccess }: QRScannerProps) {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setResult({ type: "error", message: "برجاء إدخال رمز الفعالية أو قراءة كود QR" });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: cleanToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({
          type: "error",
          message: data.error || "تعذر تسجيل الحضور. تأكد من صحة الرمز وصلاحية الفعالية.",
        });
      } else {
        setResult({
          type: "success",
          message: data.message || "تم تسجيل حضورك بنجاح في الفعالية!",
        });
        setToken("");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch {
      setResult({
        type: "error",
        message: "حدث خطأ في الاتصال بالخادم. برجاء المحاولة لاحقاً.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        background: "#fff",
        borderRadius: "22px",
        padding: "24px",
        border: "2px solid var(--bei)",
        boxShadow: "0 6px 20px rgba(59,38,22,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "rgba(242,168,29,0.18)",
            color: "var(--c1)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <QrCode size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
            تسجيل الحضور السريع
          </h2>
          <small style={{ color: "var(--c2)", fontSize: "0.82rem" }}>
            أدخل رمز الـ QR الخاص بالفعالية لتأكيد حضورك فوراً
          </small>
        </div>
      </div>

      {result && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            marginBottom: 14,
            fontSize: "0.88rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: result.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1.5px solid ${result.type === "success" ? "#16a34a" : "var(--red)"}`,
            color: result.type === "success" ? "#166534" : "var(--red)",
          }}
        >
          {result.type === "success" ? (
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
          )}
          <span>{result.message}</span>
        </div>
      )}

      <form onSubmit={handleScanSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="رمز QR أو كود الفعالية (مثال: EVT-9382)"
          dir="ltr"
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "2px solid var(--bei)",
            background: "var(--bg)",
            fontFamily: "inherit",
            fontSize: "0.95rem",
          }}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn sm"
          style={{
            minWidth: "130px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            opacity: isSubmitting ? 0.75 : 1,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>جاري التحقق...</span>
            </>
          ) : (
            <>
              <QrCode size={16} />
              <span>تأكيد الحضور</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
