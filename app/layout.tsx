import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Ustad Academy | المنصة الأولى لتعليم الأساتذة عبر الإنترنت",
  description:
    "انضم إلى Digital Ustad Academy لتطوير مهاراتك في التعليم الرقمي عبر دورات تدريبية عملية، مجتمع داعم للأساتذة، وتحديثات مستمرة تساعدك على النجاح في التدريس الإلكتروني.",
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
