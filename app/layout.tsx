import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Ustad Academy | منصة التعليم الإلكتروني للأساتذة",
  description:
    "Digital Ustad Academy منصة تعليمية متميزة تهدف إلى تمكين الأساتذة من التعلم الرقمي عن طريق دورات متخصصة، محتوى عملي، واختبارات تقييمية دورية لتعزيز المهارات وضمان التفوق.",
  keywords: [
    "التعليم الإلكتروني",
    "دورات الأساتذة",
    "Digital Ustad Academy",
    "منصة تعليمية عربية",
    "تطوير المعلمين",
    "تعلم عن بعد",
    "استراتيجيات التعليم الرقمي",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl" className="dark">
      <body className={` antialiased dark:bg-bodyDark dark:text-white `}>
        {children}
      </body>
    </html>
  );
}
