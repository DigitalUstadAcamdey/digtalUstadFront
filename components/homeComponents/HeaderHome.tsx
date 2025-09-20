"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import showToast from "@/utils/showToast";
import DynamicVideoPlyr from "../utlisComponenets/DynamicVideoPlyr";

const HeaderHome = () => {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const yourContactUrl =
    process.env.NEXT_PUBLIC_MY_CONTACT_URL || "1as22dkslasd";
  useEffect(() => {
    if (searchParams.get("inactive") === "true") {
      showToast(
        "error",
        "الحساب غير مفعل حاليا، الرجاء التواصل مع الدعم لتفعيله"
      );
    }
  }, [searchParams]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content Section */}
        <div
          className={`space-y-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Badge */}

          <h1 className="textHeader apply-fonts-bold text-xl">ابدأ مسيرتك التعليمية اون لاين</h1>

          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-3xl apply-fonts-bold md:text-4xl lg:text-5xl font-bold  leading-tight">
              حوّل مهاراتك في التدريس إلى مسيرة ناجحة عبر الإنترنت
            </h1>

            <p className="text-lg apply-fonts-normal md:text-xl text-gray-600 leading-relaxed">
              Digital Ustad هو البرنامج المتكامل الذي يساعد الأساتذة على بناء
              حضور قوي على الإنترنت، جذب الطلاب، وبيع دوراتهم الخاصة بسهولة
              واحترافية
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={yourContactUrl}>
              <button className="border-2 border-transparent group bg-mainColor hover:bg-mainColorHoverLight text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                ابدأ رحلتك الآن
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href={yourContactUrl}>
              <button className="border-2 border-mainColor text-mainColor hover:bg-mainColorHoverLight hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                تعرف على المزيد
                <BookOpen className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Quick Stats */}
        </div>

        {/* Video Section */}
        <div className={`p-6 `}>
          <DynamicVideoPlyr videoId="d85519e0-1829-4f74-867c-c2b4e3fd9a49" />
        </div>
      </div>
      <style jsx>{`
        .textHeader {
          box-sizing: border-box;
          width: full;
          height: min-content;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 6px 16px 4px 16px;
          box-shadow: inset 0px 2px 6px 0px rgba(58, 110, 242, 0.41);
          background-color: #060a1e;
          overflow: hidden;
          align-content: center;
          flex-wrap: nowrap;
          gap: 10px;
          position: absolute;
          border-radius: 12px;
          border: 1px solid #1c244c;
        }
      `}</style>
    </div>
  );
};

export default HeaderHome;
