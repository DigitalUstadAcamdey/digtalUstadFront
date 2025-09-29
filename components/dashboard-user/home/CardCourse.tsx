"use client";
import { Play } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  courseImg: string;
  courseName: string;
  studentsNumber: number;
  numberOfVideo: number;
  courseUrl: string;
  progresBar: number;
};

const CardCourse = ({ courseName, courseUrl, courseImg }: Props) => {
  const [currentLessonName, setCurrentLessonName] = useState(courseName);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(
    null
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(
    null
  );
  const yourCourseId = process.env.NEXT_PUBLIC_MY_COURSE_ID;

  useEffect(() => {
    const lesson = localStorage.getItem("currentLessonName");
    const lessonIndex = localStorage.getItem("currentLessonIndex");
    const lessonSection = localStorage.getItem("currentSectionIndex");

    if (lesson) setCurrentLessonName(lesson);
    if (lessonIndex) setCurrentLessonIndex(parseInt(lessonIndex) || 0);
    if (lessonSection) setCurrentSectionIndex(parseInt(lessonSection) || 0);
  }, [setCurrentLessonName]);

  return (
    <div className="rounded-3xl border border-gray-500   text-white relative  overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px] mx-auto ">
        <Image
          src={courseImg}
          alt={courseName}
          className="w-full h-full object-fill"
          loading="lazy"
          width={1200}
          height={1200}
        />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
      {/* Liquid Glass Container */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-6 lg:right-6 lg:left-auto lg:w-[350px]">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl lg:rounded-2xl"></div>

          <div className="relative z-10">
            {/* Course Information */}
            <div className="mb-3 sm:mb-4 text-right">
              <h2
                className="text-sm sm:text-base lg:text-lg font-medium text-white/80 mb-1 sm:mb-2 line-clamp-2"
                dir="rtl"
              >
                {courseName}
              </h2>
              <h3
                className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 line-clamp-2"
                dir="rtl"
              >
                {courseUrl ? currentLessonName : ""}
              </h3>
            </div>

            {/* Continue Watching Button */}
            <div className="flex justify-center ">
              <a
                href={`${
                  courseUrl
                    ? `${courseUrl}?section=${currentSectionIndex}&video=${currentLessonIndex}`
                    : `/course-overview/${yourCourseId}`
                }`}
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:bg-white/30 transition-all duration-300 font-medium text-center inline-flex items-center gap-2 text-sm sm:text-base"
                dir="rtl"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" />
                {courseUrl ? "متابعة المشاهدة" : "إشترك الأن"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCourse;
