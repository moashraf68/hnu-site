import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hnu-site-chi.vercel.app'),
  title: "أسرة طلاب من أجل مصر — جامعة حلوان الأهلية",
  description: "أسرة طلاب من أجل مصر في جامعة حلوان الأهلية. أبدأ بنا من الجامعة.",
  keywords: ["طلاب من أجل مصر", "جامعة حلوان الأهلية", "Students For Egypt", "HNU"],
  openGraph: {
    title: "أسرة طلاب من أجل مصر",
    description: "من أجل مصر.. نبدأ من الجامعة",
    images: ["/assets/images/og-image.jpg"],
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Montserrat:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/images/favicon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B2616" />
      </head>
      <body>{children}</body>
    </html>
  );
}
