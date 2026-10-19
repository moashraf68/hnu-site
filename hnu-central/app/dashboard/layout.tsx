import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة تحكم الطالب | بوابة الأسرة المركزية",
  description: "لوحة التحكم الخاصة بأعضاء وطلاب أسرة طلاب من أجل مصر - جامعة حلوان الأهلية",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardNav user={user}>{children}</DashboardNav>;
}
