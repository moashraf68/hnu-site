import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة تحكم الإدارة | Central Family Admin",
  description: "لوحة التحكم المركزية لإدارة الطلاب، اللجان، الفعاليات، التقييمات والمقترحات",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return <AdminNav user={user}>{children}</AdminNav>;
}
