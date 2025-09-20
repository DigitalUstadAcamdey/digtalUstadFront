"use client";

import React from "react";
import { Play, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/constants/colors";

type Props = {
  notificationImg: string;
  notificationName: string;
  notificationDate: string;
  lessonNumber: number;
  courseId: string;
  isNew?: boolean;
};

const NotificationCard = ({
  notificationImg,
  notificationName,
  notificationDate,
  lessonNumber,
  courseId,
  isNew = false,
}: Props) => {
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "اليوم";
    } else if (diffDays === 2) {
      return "أمس";
    } else if (diffDays <= 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      return date.toLocaleDateString("en-SA");
    }
  };

  return (
    <div
      className={`w-full group relative rounded-xl transition-all duration-300 hover:shadow-lg dark:bg-cardBgDark dark:hover:border-primaryDark ${
        isNew
          ? "border-2 border-mainColor bg-blue-50 dark:border-primaryDark dark:bg-[#1a1c3d]"
          : "bg-white border-2 border-slate-200 dark:border-gray-700"
      }`}
    >
      {/* مؤشر جديد */}
      {isNew && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="w-3 h-3 bg-mainColor dark:bg-primaryDark rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="flex gap-4 items-center p-4">
        {/* صورة الكورس */}
        <Link
          href={`/course/${courseId}`}
          className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
        >
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={notificationImg}
              alt="صورة الكورس"
              width={120}
              height={80}
              className="w-28 h-20 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg"></div>
          </div>
        </Link>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="apply-fonts-medium text-base text-gray-800 line-clamp-2 leading-relaxed dark:text-textPrimary">
              {notificationName}
            </h3>
            {isNew && (
              <span className="text-xs bg-mainColor dark:bg-primaryDark text-white px-2 py-1 rounded-full flex-shrink-0">
                جديد
              </span>
            )}
          </div>

          {/* بيانات إضافية */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-textSecondary">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-mainColor/10 rounded-full dark:bg-primaryDark/30">
                <Play
                  size={12}
                  className="text-mainColor dark:text-primaryDark"
                />
              </div>
              <span className="">الدرس {lessonNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar
                size={12}
                className="text-gray-500 dark:text-gray-400"
              />
              <span className="">{formatDate(notificationDate)}</span>
            </div>
          </div>
        </div>

        {/* سهم الانتقال */}
        <Link
          href={`/course/${courseId}`}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-mainColor hover:bg-blue-50 rounded-full transition-colors duration-200 dark:text-gray-500 dark:hover:text-primaryDark dark:hover:bg-primaryDark/20"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationCard;
