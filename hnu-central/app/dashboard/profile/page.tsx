"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { maskNationalId } from "@/lib/utils";
import { User, Phone, Mail, Lock, Camera, Check, AlertCircle, ShieldCheck } from "lucide-react";

interface UserProfile {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  college: string;
  academicYear: string;
  committeeId?: string;
  profilePhoto?: string;
  role: string;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setPhone(data.user.phone || "");
          setEmail(data.user.email || "");
          if (data.user.profilePhoto) {
            setPhotoPreview(data.user.profilePhoto);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileMsg({ type: "error", text: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" });
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setProfileMsg(null);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsUpdatingProfile(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone.trim());
      if (email.trim()) formData.append("email", email.trim());
      if (photoFile) formData.append("profilePhoto", photoFile);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error || "فشل تحديث البيانات." });
      } else {
        setProfileMsg({ type: "success", text: "تم حفظ التعديلات بنجاح!" });
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch {
      setProfileMsg({ type: "error", text: "حدث خطأ في الاتصال بالخادم." });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "كلمتا المرور غير متطابقتين" });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error || "فشل تغيير كلمة المرور." });
      } else {
        setPasswordMsg({ type: "success", text: "تم تغيير كلمة المرور بنجاح!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "حدث خطأ أثناء الاتصال بالخادم." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center" style={{ padding: "60px 20px" }}>
        <p style={{ color: "var(--c2)", fontWeight: 700 }}>جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
          الملف الشخصي
        </h1>
        <p style={{ color: "var(--c2)", fontSize: "0.95rem", marginTop: 4 }}>
          إدارة بياناتك الشخصية وتفاصيل الحساب وكلمة المرور
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* Left Card: Main Profile & Editable Fields */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "30px",
            border: "1.5px solid var(--bei)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c1)", marginBottom: 20 }}>
            البيانات الأساسية
          </h2>

          {profileMsg && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: 20,
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: profileMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1.5px solid ${profileMsg.type === "success" ? "#16a34a" : "var(--red)"}`,
                color: profileMsg.type === "success" ? "#166534" : "var(--red)",
              }}
            >
              {profileMsg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Photo Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 8 }}>
              <div
                style={{
                  position: "relative",
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid var(--g)",
                  flexShrink: 0,
                  background: "var(--bei)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt={user?.fullName || "الصورة الشخصية"}
                    width={84}
                    height={84}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={38} color="var(--c1)" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn sm ghost"
                  style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Camera size={16} />
                  <span>تحديث الصورة الشخصية</span>
                </button>
                <small style={{ display: "block", color: "var(--c2)", marginTop: 6, fontSize: "0.78rem" }}>
                  الحد الأقصى لحجم الملف: 5 ميجابايت
                </small>
              </div>
            </div>

            {/* Readonly info */}
            <div className="form-group">
              <label>الاسم بالكامل</label>
              <input
                type="text"
                value={user?.fullName || ""}
                disabled
                style={{ background: "#f8f8f8", color: "#666", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>رقم الهوية القومية (مشفر)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={user?.nationalId ? maskNationalId(user.nationalId) : "••••••••••••••"}
                  disabled
                  dir="ltr"
                  style={{ background: "#f8f8f8", color: "#666", cursor: "not-allowed", letterSpacing: "2px" }}
                />
                <ShieldCheck
                  size={18}
                  style={{ position: "absolute", insetInlineEnd: 12, top: "50%", transform: "translateY(-50%)", color: "#16a34a" }}
                />
              </div>
            </div>

            <div className="form-2col">
              <div className="form-group">
                <label>الكلية</label>
                <input
                  type="text"
                  value={user?.college || ""}
                  disabled
                  style={{ background: "#f8f8f8", color: "#666", cursor: "not-allowed" }}
                />
              </div>
              <div className="form-group">
                <label>الفرقة الدراسية</label>
                <input
                  type="text"
                  value={user?.academicYear || ""}
                  disabled
                  style={{ background: "#f8f8f8", color: "#666", cursor: "not-allowed" }}
                />
              </div>
            </div>

            {/* Editable fields */}
            <div className="form-group">
              <label htmlFor="phone">رقم التليفون / واتساب</label>
              <div style={{ position: "relative" }}>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Phone
                  size={16}
                  style={{ position: "absolute", insetInlineEnd: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c2)" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                <Mail
                  size={16}
                  style={{ position: "absolute", insetInlineEnd: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c2)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={isUpdatingProfile}
              style={{
                alignSelf: "flex-start",
                padding: "10px 28px",
                marginTop: 6,
                opacity: isUpdatingProfile ? 0.75 : 1,
              }}
            >
              {isUpdatingProfile ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </form>
        </div>

        {/* Right Card: Security & Change Password */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "30px",
            border: "1.5px solid var(--bei)",
            alignSelf: "start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Lock size={22} color="var(--c1)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--c1)", margin: 0 }}>
              تغيير كلمة المرور
            </h2>
          </div>

          {passwordMsg && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: 20,
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: passwordMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1.5px solid ${passwordMsg.type === "success" ? "#16a34a" : "var(--red)"}`,
                color: passwordMsg.type === "success" ? "#166534" : "var(--red)",
              }}
            >
              {passwordMsg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label htmlFor="cur-pass">كلمة المرور الحالية</label>
              <input
                id="cur-pass"
                type="password"
                required
                dir="ltr"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-pass">كلمة المرور الجديدة (8 أحرف فأكثر)</label>
              <input
                id="new-pass"
                type="password"
                required
                minLength={8}
                dir="ltr"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="conf-pass">تأكيد كلمة المرور الجديدة</label>
              <input
                id="conf-pass"
                type="password"
                required
                minLength={8}
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn sm"
              disabled={isChangingPassword}
              style={{
                marginTop: 6,
                opacity: isChangingPassword ? 0.75 : 1,
              }}
            >
              {isChangingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
