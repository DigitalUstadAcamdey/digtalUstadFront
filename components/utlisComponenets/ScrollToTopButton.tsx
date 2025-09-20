"use client";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCustomWidth, setHasCustomWidth] = useState(false);

  useEffect(() => {
    // التحقق من وجود custom-width في العنصر الأب
    const checkCustomWidth = () => {
      const scrollElement = document.querySelector(".overflow-y-scroll");
      if (scrollElement) {
        const hasCustom = scrollElement.classList.contains("h-[93vh]");
        setHasCustomWidth(hasCustom);
      }
    };
    checkCustomWidth();
  }, []);

  // إظهار الزر عندما يتم التمرير لأسفل 300px
  useEffect(() => {
    const toggleVisibility = () => {
      // البحث عن العنصر الذي يحتوي على overflow-y-scroll
      const scrollElement = document.querySelector(".overflow-y-scroll");
      let scrollTop = 0;

      if (scrollElement && scrollElement.classList.contains("h-[93vh]")) {
        // التمرير داخل العنصر المحدد
        scrollTop = (scrollElement as HTMLElement).scrollTop;
      } else {
        // التمرير العادي للنافذة (للصفحات العادية)
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      }

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // إضافة event listener للعنصر المحدد فقط
    const scrollElement = document.querySelector(".overflow-y-scroll");

    if (scrollElement && scrollElement.classList.contains("h-[93vh]")) {
      // للصفحات المخصصة
      scrollElement.addEventListener("scroll", toggleVisibility);
    } else {
      // للصفحات العادية
      window.addEventListener("scroll", toggleVisibility);
    }

    return () => {
      const scrollEl = document.querySelector(".overflow-y-scroll");
      if (scrollEl && scrollEl.classList.contains("h-[93vh]")) {
        scrollEl.removeEventListener("scroll", toggleVisibility);
      } else {
        window.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []);

  // دالة الصعود إلى الأعلى
  const scrollToTop = () => {
    const scrollElement = document.querySelector(".overflow-y-scroll");

    if (scrollElement && scrollElement.classList.contains("h-[93vh]")) {
      scrollElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // التمرير العادي للنافذة
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 ${
            hasCustomWidth ? "lg:scroll-btn-custom" : "right-8"
          }  z-30 bg-mainColor hover:bg-mainColorHoverLight text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl active:scale-95 group`}
          aria-label="العودة إلى الأعلى"
        >
          <ChevronUp
            size={24}
            overflow-y-scroll
            className="transition-transform duration-200 group-hover:-translate-y-1"
          />

          {/* تأثير التوهج */}
          <div className="absolute inset-0 rounded-full bg-mainColor/40 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

          {/* حلقة خارجية متحركة */}
          <div className="absolute -inset-1 rounded-full border-2 border-mainColor/30 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
        </button>
      )}
    </>
  );
}
