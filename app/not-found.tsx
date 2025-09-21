"use client";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center relative">
        {/* عناصر تزيينية في الخلفية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-mainColor/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/20">
          {/* الرقم 404 الكبير */}
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mainColor to-blue-600 dark:from-mainColor dark:to-blue-400 select-none">
              404
            </h1>
            {/* تأثير الضوء */}
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-mainColor/20 dark:text-mainColor/10 blur-sm select-none">
              404
            </div>
          </div>

          {/* الأيقونة التفاعلية */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-mainColor/20 to-blue-500/20 dark:from-mainColor/10 dark:to-blue-500/10 rounded-full backdrop-blur-sm border border-mainColor/30 dark:border-mainColor/20 group hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-mainColor to-blue-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* نقاط متحركة حول الأيقونة */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-mainColor/60 rounded-full animate-bounce"></div>
            <div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-1/2 -left-6 w-2 h-2 bg-purple-500/60 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* العنوان */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            عذراً، الصفحة غير موجودة
          </h2>

          {/* الوصف */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها قد انتقلت إلى مكان آخر أو لم تعد
            متاحة.
            <br />
            <span className="inline-flex items-center gap-1 mt-2">
              لا تقلق، سنساعدك في العودة إلى المسار الصحيح!
              <Compass
                className="w-5 h-5 text-mainColor animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </span>
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-mainColor to-mainColor hover:from-mainColorHoverLight hover:to-blue-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              الصفحة الرئيسية
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-700 border-2 border-mainColor text-mainColor dark:text-mainColor font-semibold rounded-full hover:bg-mainColor hover:text-white dark:hover:bg-mainColor dark:hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              العودة للخلف
            </button>
          </div>
        </div>

        {/* عناصر تزيينية متحركة */}
        <div className="absolute top-20 left-10 opacity-30">
          <div className="w-2 h-2 bg-mainColor rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-32 right-16 opacity-30">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1/3 right-8 opacity-30">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
