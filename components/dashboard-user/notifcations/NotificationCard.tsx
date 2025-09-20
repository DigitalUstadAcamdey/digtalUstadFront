import { Play, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  // Format date for better display
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
      className={`w-full group relative bg-white border border-gray-200 hover:border-mainColor/30 rounded-xl transition-all duration-300 hover:shadow-md dark:bg-[#1a1c3d] dark:border-gray-700 dark:hover:border-blue-700 dark:shadow-none ${
        isNew
          ? "border-l-4 border-l-mainColor bg-blue-50/30 dark:bg-[#1a1c3d]"
          : ""
      }`}
    >
      {/* New indicator */}
      {isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="w-4 h-4 bg-mainColor rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="flex gap-4 items-start p-4">
        {/* Course Image */}
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg"></div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="apply-fonts-medium text-base text-gray-800 line-clamp-2 leading-relaxed dark:text-gray-100">
              {notificationName}
            </h3>
            {isNew && (
              <span className="text-xs bg-mainColor text-white px-2 py-1 rounded-full flex-shrink-0 dark:bg-blue-700">
                جديد
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-mainColor/10 rounded-full dark:bg-blue-900/30">
                <Play size={12} className="text-mainColor dark:text-blue-400" />
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

        {/* Action Arrow */}
        <Link
          href={`/course/${courseId}`}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-mainColor hover:bg-blue-50 rounded-full transition-colors duration-200 dark:text-gray-500 dark:hover:text-blue-500 dark:hover:bg-blue-900/30"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationCard;
