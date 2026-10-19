"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import { COLLEGES, YEARS } from "@/lib/utils";
import { COMMITTEES } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    college: COLLEGES[0] as string,
    academicYear: YEARS[0] as string,
    committeeId: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "nationalId") {
      setFormData((prev) => ({ ...prev, nationalId: value.replace(/\D/g, "") }));
    } else if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: value.replace(/[^\d+]/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validations
    if (formData.fullName.trim().length < 5) {
      setError("الاسم كاملاً يجب أن يحتوي على 5 أحرف على الأقل");
      return;
    }

    if (formData.nationalId.length !== 14 || !/^\d{14}$/.test(formData.nationalId)) {
      setError("رقم الهوية القومية يجب أن يكون 14 رقماً بالضبط");
      return;
    }

    if (formData.password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف أو أرقام");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError("يرجى إدخال رقم هاتف صحيح");
      return;
    }

    if (!selectedFile) {
      setError("الصورة الشخصية مطلوبة لإكمال التسجيل");
      return;
    }

    const payload = new FormData();
    payload.append("fullName", formData.fullName.trim());
    payload.append("nationalId", formData.nationalId.trim());
    payload.append("password", formData.password);
    payload.append("confirmPassword", formData.confirmPassword);
    payload.append("phone", formData.phone.trim());
    if (formData.email.trim()) {
      payload.append("email", formData.email.trim());
    }
    payload.append("college", formData.college);
    payload.append("academicYear", formData.academicYear);
    if (formData.committeeId) {
      payload.append("committeeId", formData.committeeId);
    }
    payload.append("profilePhoto", selectedFile);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل إنشاء الحساب. تأكد من صحة البيانات.");
        return;
      }

      setSuccess("تم إنشاء حسابك بنجاح! جاري تحويلك إلى لوحة التحكم...");

      startTransition(() => {
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      });
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم. برجاء المحاولة لاحقاً.");
    }
  };

  return (
    <div className="auth-wrap" style={{ padding: "60px 16px" }}>
      <div className="auth-card" style={{ maxWidth: "640px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/assets/images/logo.png"
            alt="شعار أسرة طلاب من أجل مصر"
            width={68}
            height={68}
            className="auth-logo"
            style={{
              margin: "0 auto 12px",
              borderRadius: "14px",
              border: "2px solid var(--g)",
            }}
          />
          <h1 style={{ fontSize: "1.75rem", color: "var(--c1)", fontWeight: 800 }}>
            تسجيل عضو جديد
          </h1>
          <p className="sub" style={{ fontSize: "0.95rem", color: "var(--c2)", marginTop: 4 }}>
            انضم إلى بوابة الأسرة المركزية — جامعة حلوان الأهلية
          </p>
        </div>

        {/* Alerts */}
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

        {success && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              background: "#f0fdf4",
              border: "1.5px solid #16a34a",
              borderRadius: "12px",
              color: "#166534",
              fontSize: "0.92rem",
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile Photo Upload */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 8,
              padding: "16px",
              background: "var(--bg)",
              borderRadius: "16px",
              border: "1.5px dashed var(--bei)",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid var(--g)",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                marginBottom: 10,
                position: "relative",
              }}
            >
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="معاينة الصورة الشخصية"
                  width={90}
                  height={90}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "2rem" }}>👤</span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
              aria-label="اختيار صورة شخصية"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn sm ghost"
              style={{ fontSize: "0.85rem", borderColor: "var(--g)" }}
            >
              {photoPreview ? "تغيير الصورة الشخصية" : "اختر صورة شخصية (مطلوب)"}
            </button>
            <small style={{ color: "var(--c2)", marginTop: 6, fontSize: "0.8rem" }}>
              JPG, PNG أو WEBP (الحد الأقصى: 5 ميجابايت)
            </small>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              الاسم كاملاً (رباعي) <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="اكتب اسمك كاملاً كما هو في بطاقة الرقم القومي"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          {/* National ID */}
          <div className="form-group">
            <label htmlFor="nationalId">
              رقم الهوية القومية (14 رقماً) <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              id="nationalId"
              name="nationalId"
              type="text"
              inputMode="numeric"
              maxLength={14}
              required
              placeholder="14 رقماً"
              dir="ltr"
              value={formData.nationalId}
              onChange={handleInputChange}
            />
          </div>

          {/* Passwords row */}
          <div className="form-2col">
            <div className="form-group">
              <label htmlFor="password">
                كلمة المرور (8 أحرف فأكثر) <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                placeholder="••••••••"
                dir="ltr"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                تأكيد كلمة المرور <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                placeholder="••••••••"
                dir="ltr"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Contact Row: Phone & Email */}
          <div className="form-2col">
            <div className="form-group">
              <label htmlFor="phone">
                رقم التليفون / واتساب <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="010xxxxxxxx"
                dir="ltr"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@hnu.edu.eg"
                dir="ltr"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Academic Row: College & Year */}
          <div className="form-2col">
            <div className="form-group">
              <label htmlFor="college">
                الكلية <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <select
                id="college"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "2px solid var(--bei)",
                  background: "#fff",
                  fontFamily: "inherit",
                }}
              >
                {COLLEGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="academicYear">
                الفرقة الدراسية <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "2px solid var(--bei)",
                  background: "#fff",
                  fontFamily: "inherit",
                }}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Committee Preference */}
          <div className="form-group">
            <label htmlFor="committeeId">اللجنة المفضلة (اختياري)</label>
            <select
              id="committeeId"
              name="committeeId"
              value={formData.committeeId}
              onChange={handleInputChange}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid var(--bei)",
                background: "#fff",
                fontFamily: "inherit",
              }}
            >
              <option value="">-- لم أحدد بعد / بدون تفضيل --</option>
              {COMMITTEES.map((comm) => (
                <option key={comm.slug} value={comm.slug}>
                  {comm.icon} {comm.nameAr} ({comm.code})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn big"
            disabled={isPending}
            style={{
              marginTop: 12,
              width: "100%",
              opacity: isPending ? 0.75 : 1,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "جاري إنشاء الحساب وتأكيد البيانات..." : "تأكيد وإنشاء الحساب"}
          </button>
        </form>

        {/* Footer Link */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--bei)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: "0.92rem",
          }}
        >
          <p style={{ color: "var(--c2)" }}>
            لديك حساب بالفعل في البوابة؟{" "}
            <Link href="/login" className="auth-link">
              تسجيل الدخول
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
