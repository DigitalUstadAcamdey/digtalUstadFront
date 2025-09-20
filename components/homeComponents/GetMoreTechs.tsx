"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const WhatYouGet = () => {
  const { ref: refTitle, inView: inViewTitle } = useInView({
    triggerOnce: true,
  });
  const { ref: refLeftBox, inView: inViewLeftBox } = useInView({
    triggerOnce: true,
  });
  const { ref: refRightBox, inView: inViewRightBox } = useInView({
    triggerOnce: true,
  });

  return (
    <div className="my-24 flex flex-col items-center justify-center p-4 text-white">
      {/* Title Section */}
      <motion.h1
        ref={refTitle}
        initial="hidden"
        animate={inViewTitle ? "visible" : "hidden"}
        variants={fadeUp}
        className="lg:text-[74px] sm:text-[40px] xs:text-[40px] apply-fonts-medium text-center mb-12"
      >
        ماذا ستحصل عليه داخل البرنامج؟
      </motion.h1>

      <div className="flex lg:flex-row xs:flex-col items-stretch justify-center gap-8 w-full">
        {/* Left Box: Tools and Explanation */}
        <motion.div
          ref={refLeftBox}
          initial="hidden"
          animate={inViewLeftBox ? "visible" : "hidden"}
          variants={fadeLeft}
          style={{
            boxShadow: "0px -10px 40px 0px #101636 inset",
          }}
          className="lg:w-1/2 xs:w-full p-8 rounded-3xl border border-[#1C244C] bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm shadow-xl flex flex-col justify-between"
        >
          <div>
            <h2 className="sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 apply-fonts-medium text-center">
              شروحات استخدام أدوات التعليم
            </h2>
            <p className="sm:text-sm md:text-base lg:text-lg leading-relaxed apply-fonts-normal text-white text-center">
              تعلم خطوة بخطوة كيفية استخدام أهم التطبيقات والمنصات التي تحتاجها
              في التدريس عبر الإنترنت، من إنشاء الدروس وتصميم العروض إلى إدارة
              الطلاب والتسويق لدوراتك بسهولة.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 flex-1">
            <div className="relative w-1/4 aspect-w-1 aspect-h-1">
              <Image
                src="/imgs/canvaImg.webp"
                alt="Canva logo"
                loading="lazy"
                width={150}
                height={150}
              />
            </div>
            <div className="relative w-1/4 aspect-w-1 aspect-h-1">
              <Image
                src="/imgs/obsImgs.webp"
                alt="OBS Studio logo"
                loading="lazy"
                width={150}
                height={150}
              />
            </div>
            <div className="relative w-1/4 aspect-w-1 aspect-h-1">
              <Image
                src="/imgs/powerPointImg.webp"
                alt="PowerPoint logo"
                loading="lazy"
                width={150}
                height={150}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Box: Course Content */}
        <motion.div
          ref={refRightBox}
          initial="hidden"
          animate={inViewRightBox ? "visible" : "hidden"}
          variants={fadeRight}
          style={{
            boxShadow: "0px -10px 40px 0px #101636 inset",
          }}
          className="lg:w-1/2 xs:w-full p-8 rounded-3xl border border-[#1C244C] bg-3D45EE bg-opacity-20 backdrop-filter backdrop-blur-sm shadow-xl flex flex-col justify-start"
        >
          <h2 className="sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 apply-fonts-medium text-center">
            دورة كاملة في التعليم اون لاين
          </h2>
          <p className="sm:text-sm md:text-base lg:text-lg leading-relaxed apply-fonts-normal text-white text-center mb-6">
            محتوى تعليمي مبسط يشرح لك كيف تبدأ من الصفر وتبني حضورك الرقمي حتى
            تصل للاحتراف.
          </p>

          {/* List of features */}
          <div className="flex flex-col gap-6 mt-4">
            {[
              {
                title: "إنشاء علامتك كأستاذ",
                description: "انشاء و تصميم هوية بصرية متكاملة",
              },
              {
                title: "صناعة المحتوى على اليوتيوب",
                description: "تحديد تخصصك التدريسي و جمهورك المستهدف",
              },
              {
                title: "توصيل الفكرة و طرح المحتوى",
                description: "بثاقة عالية و ثبات و تمكن من التلاميد",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-[#1A243D] bg-opacity-50 p-4 rounded-xl"
              >
                <CheckCircle className="text-3D45EE text-2xl" />
                <div className="flex flex-col">
                  <h3 className="apply-fonts-medium sm:text-md md:text-lg lg:text-xl">
                    {item.title}
                  </h3>
                  <p className="apply-fonts-normal sm:text-sm md:text-base text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhatYouGet;