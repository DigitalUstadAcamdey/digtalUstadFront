"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const { ref: refBoxes, inView: inViewBoxes } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="my-44 flex flex-col items-center justify-center p-4 text-white">
      <motion.h1
        ref={refTitle}
        initial="hidden"
        animate={inViewTitle ? "visible" : "hidden"}
        variants={fadeUp}
        className="lg:text-[74px] sm:text-[40px] xs:text-[40px] apply-fonts-medium text-center mb-12"
      >
        هناك طريقان فقط
      </motion.h1>

      <div
        ref={refBoxes}
        className="flex lg:flex-row-reverse xs:flex-col items-stretch justify-center gap-8 w-full"
      >
        {/* Box 1: Traditional Way */}
        <motion.div
          initial="hidden"
          animate={inViewBoxes ? "visible" : "hidden"}
          variants={fadeLeft}
          style={{
            boxShadow: "0px -10px 40px 0px #101636 inset",
          }}
          className="lg:w-1/2 xs:w-full p-16 rounded-3xl border border-[#1C244C] bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm shadow-xl flex flex-col justify-start"
        >
          <h2 className="text-4xl  mb-4 text-center  apply-fonts-bold">
            الطريق التقليدي
          </h2>
          <p className="text-base leading-relaxed apply-fonts-normal text-gray-300">
            في التعليم التقليدي، يقضي الأستاذ سنوات طويلة في القسم برواتب محدودة
            لا تكافئ الجهد المبذول. نفس الروتين يتكرر يومًا بعد يوم، دون فرص
            حقيقية للتوسع أو تحقيق دخل إضافي. النتيجة هي مستقبل مهني غير مضمون
            وتعب بلا مقابل.
          </p>
        </motion.div>

        {/* Box 2: Digital Ustad */}
        <motion.div
          initial="hidden"
          animate={inViewBoxes ? "visible" : "hidden"}
          variants={fadeRight}
          className="lg:w-1/2 xs:w-full p-16 rounded-3xl border border-mainColor bg-mainColor bg-opacity-20 backdrop-filter backdrop-blur-sm shadow-xl flex flex-col justify-start"
        >
          <h2 className="text-4xl  mb-4 text-center font-bold">
            Digital Ustad
          </h2>
          <p className="text-base leading-relaxed apply-fonts-normal">
            مع Digital Ustad، يتحول التدريس إلى فرصة لبناء مسيرة رقمية مربحة.
            ستتعلم كيف تنشئ حضورًا قويًا على الإنترنت، تجذب طلابًا من مختلف
            الدول، وتبيع دوراتك الخاصة لتنشئ دخلًا مستدامًا. برنامج متكامل يفتح
            لك الطريق نحو الحرية المالية والاستقلالية المهنية.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhatYouGet;
