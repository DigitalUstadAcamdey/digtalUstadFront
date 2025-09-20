"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Set the first item to be open by default

  const faqData = [
    {
      question: "هل أحتاج خبرة تقنية كبيرة للانضمام؟",
      answer:
        "لا. البرنامج مصمم خصيصًا للأساتذة المبتدئين في المجال الرقمي، وستتعلم خطوة بخطوة كيف تستعمل التطبيقات والأدوات بسهولة.",
    },
    {
      question: "هل البرنامج مناسب إذا لم يسبق لي التدريس عبر الإنترنت؟",
      answer:
        "نعم، Digital Ustad يرافقك من البداية لتتعلم كيفية بناء حضورك الرقمي وإنشاء دوراتك الخاصة حتى لو لم تكن لديك خبرة سابقة.",
    },
    {
      question: "هل المحتوى متاح مدى الحياة؟",
      answer:
        "نعم، عند انضمامك ستحصل على وصول دائم للدروس والتحديثات الجديدة دون أي رسوم إضافية",
    },
    {
      question: "ماذا لو لم أنجح رغم المحاولة؟",
      answer:
        "الفشل جزء من أي رحلة، لكن وجودك مع مجتمع الأساتذة، والمتابعة مع الخبراء، والدروس الموجهة، كلها عناصر تقلل من الأخطاء وتزيد من فرصك للنجاح. نحن لسنا من يحقق النجاح مكانك، لكننا الدليل الذي يرشدك حتى تصل.",
    },
    {
      question: "كم يستغرق الأمر حتى أنجح؟",
      answer:
        "هذه ليست وصفة سحرية. النجاح قد يستغرق أشهر أو حتى سنوات حسب التزامك وجهدك. نحن لا نضمن لك النتائج، لكننا نضمن أن نكون دليلك في الطريق ونوفر لك الخبرة التي تختصر عليك سنوات من التجربة العشوائية.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="my-24 px-4 text-white flex lg:flex-row xs:flex-col justify-between gap-8">
      <h2 className="lg:text-[74px] md:text-[60px] sm:text-[40px] xs:text-[28px] apply-fonts-medium text-center mb-16">
        الأسئلة الشائعة
      </h2>
      <div className="w-full flex-1 mx-auto flex flex-col gap-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-700 backdrop-filter backdrop-blur-sm shadow-xl"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-right p-6 flex gap-3 items-center cursor-pointer focus:outline-none"
            >
              <span className="text-3xl text-gray-400 font-light transition-transform duration-300">
                <Plus
                  className={`transition-transform duration-300 transform ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                />
              </span>
              <h3 className="lg:text-xl sm:text-lg xs:text-base font-bold apply-fonts-medium">
                {item.question}
              </h3>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0">
                    <p className="lg:text-lg sm:text-base xs:text-sm leading-relaxed apply-fonts-normal text-gray-300">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
