"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const WhyUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Adjust as needed
  });

  return (
    <div className="my-24 flex items-center justify-center p-4">
      <motion.section
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        className="max-w-4xl text-center text-white apply-fonts-normal" // Changed text color to white
      >
        <p className="lg:text-3xl  sm:text-xl xs:text-lg leading-relaxed">
          ليس مجرد برنامج تعليمي، بل هو منصة انطلاقتك نحو بناء مسيرتك الرقمية.
          يمنحك البرنامج منهجًا متكاملًا مصممًا خصيصًا للأساتذة الذين يرغبون في
          دخول عالم التدريس عبر الإنترنت، وبناء حضور شخصي قوي، وتحويل خبرتهم إلى
          مصدر دخل مستدام.
        </p>
      </motion.section>
    </div>
  );
};

export default WhyUs;
