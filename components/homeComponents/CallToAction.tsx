"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CallToAction = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className="my-24 flex flex-col items-center justify-center text-center p-6 sm:p-12"
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl  apply-fonts-bold text-white mb-8">
        ابدأ مسيرتك التعليمية اون لاين
      </h2>
      <button className=" bg-mainColor  hover:bg-mainColorHoverLight  text-white  font-semibold  py-4 px-16 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
        ابدأ الآن
      </button>
    </motion.div>
  );
};

export default CallToAction;