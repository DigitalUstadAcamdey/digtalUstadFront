"use client";

import React from "react";
import { Trophy, Users } from "lucide-react";
import { colors } from "@/constants/colors";

interface TopCourseCardProps {
  course: {
    _id: string;
    title: string;
    price: number;
    studentsCount: number;
  };
  isAdmin?: boolean;
}

export const TopCourseCard: React.FC<TopCourseCardProps> = ({
  course,
  isAdmin = false,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-200 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-[#FDF0CD] dark:bg-[#FDF0CD]/20">
          <Trophy size={24} className="text-[#FFC700] dark:text-[#FFC700]" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#2C2C2C] dark:text-textPrimary">
            {isAdmin ? "الدورة الأكثر مبيعاً" : "دورتك الأفضل"}
          </h3>
          <p className="text-sm text-[#6E7485] dark:text-textSecondary">
            الأداء الأفضل هذا الشهر
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-lg mb-2 text-[#3D45EE] dark:text-primaryDark">
            {course.title}
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6E7485] dark:text-textSecondary">
              السعر:
            </span>
            <span className="font-bold text-[#45DA10] dark:text-successDark">
              {course.price.toLocaleString()} DZD
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-[#6E7485] dark:text-textSecondary">
              عدد الطلاب:
            </span>
            <div className="flex items-center gap-1">
              <Users
                size={16}
                className="text-[#3D45EE] dark:text-primaryDark"
              />
              <span className="font-bold text-[#3D45EE] dark:text-primaryDark">
                {course.studentsCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6E7485] dark:text-textSecondary">
              إجمالي الإيرادات
            </span>
            <span className="font-bold text-lg text-[#45DA10] dark:text-successDark">
              {course.price * course.studentsCount} DZD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
