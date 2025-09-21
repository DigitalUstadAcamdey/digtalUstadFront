"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// 👇 مكوّن فرعي لكل عنصر
const FeatureItem = ({
  feature,
}: {
  feature: {
    type: string;
    title: string;
    description: string;
    imageSrc: string;
    altText: string;
  };
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      className={`flex items-center justify-between xs:gap-5 xs:flex-col w-full p-6 rounded-3xl  
        ${
          feature.type === "icon" && feature.altText === "أيقونة تيليجرام"
            ? "lg:flex-row"
            : "lg:flex-row-reverse"
        }`}
    >
      {feature.type === "teacher" && (
        <>
          {/* النص */}
          <div className="lg:w-1/2 xs:w-full lg:text-right xs:text-center lg:order-2 xs:order-2 px-4 py-2">
            <h2 className="lg:text-4xl sm:text-3xl xs:text-2xl mb-4 apply-fonts-bold leading-tight">
              {feature.title}
            </h2>
            <p className="lg:text-lg sm:text-base xs:text-sm leading-relaxed apply-fonts-normal text-gray-300">
              {feature.description}
            </p>
          </div>
          {/* الصورة */}
          <div className="lg:flex-1 bg-mainColor p-6 rounded-2xl lg:w-[500px] lg:h-[460px] sm:h-[330px] xs:h-[230px] xs:w-full">
            <Image
              src={feature.imageSrc}
              alt={feature.altText}
              width={450}
              height={450}
              className="object-contain w-full h-full"
            />
          </div>
        </>
      )}

      {feature.type === "icon" && (
        <>
          {/* الصورة */}
          <div
            className="border lg:flex-1 border-[#1C244C] lg:p-6 xs:p-12 rounded-2xl lg:w-[500px] lg:h-[460px] sm:h-[330px] xs:h-[230px] xs:w-full"
            style={{ boxShadow: "0px -10px 40px 0px #101636 inset" }}
          >
            <Image
              src={feature.imageSrc}
              alt={feature.altText}
              width={450}
              height={450}
              className="object-contain w-full h-full"
            />
          </div>
          {/* النص */}
          <div className="lg:w-1/2 xs:w-full px-4 py-2 text-center">
            <h2 className="lg:text-4xl sm:text-3xl xs:text-2xl mb-4 apply-fonts-bold leading-tight">
              {feature.title}
            </h2>
            <p className="lg:text-lg sm:text-base xs:text-sm leading-relaxed apply-fonts-normal text-gray-300">
              {feature.description}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      type: "teacher",
      title: "قسم خاص مع الأستاذ أيوب",
      description:
        "أستاذ ناجح يشاركك تجربته في التدريس الرقمي ويقدم لك استراتيجيات عملية تساعدك على تجنب الأخطاء والانطلاق بسرعة نحو النجاح.",
      imageSrc: "/imgs/profImg.webp",
      altText: "الأستاذ أيوب",
    },
    {
      type: "icon",
      title: "مجتمع خاص بالأساتذة",
      description: "شبكة من الأساتذة الطموحين لتبادل الخبرات",
      imageSrc: "/imgs/teleImg.webp",
      altText: "أيقونة تيليجرام",
    },
    {
      type: "icon",
      title: "تحديثات دائمة مدى الحياة",
      description: "محتوى جديد بشكل مستمر لمواكبة التطورات و الإتجاهات الحديثة",
      imageSrc: "/imgs/updates.webp",
      altText: "أيقونة تحديث",
    },
  ];

  return (
    <div className="my-24 flex flex-col items-center justify-center p-4 text-white">
      <div className="flex flex-col lg:gap-16 w-full">
        {features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
