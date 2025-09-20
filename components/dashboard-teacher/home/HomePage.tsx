"use client";
import React from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Eye,
  Calendar,
  Award,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { TopCourseCard } from "@/components/ui/TopCourseCard";
import { TeacherCharts } from "@/components/charts/TeacherCharts";
import { colors } from "@/constants/colors";
import { TeacherData } from "@/types/dashboard";

const HomePage = ({ data }: { data: TeacherData }) => {
  return (
    <div className="lg:custom-width rounded-xl px-4 py-5 h-[94vh] overflow-y-scroll space-y-6 bg-white dark:bg-bodyDark transition-colors duration-300">
      {/* العنوان والترحيب */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white dark:from-orange-800 dark:to-red-800">
        <h1 className="text-2xl font-bold mb-2">مرحباً أستاذ </h1>
        <p className="opacity-90">إليك نظرة على أداء دوراتك التعليمية</p>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={BookOpen}
          title="دوراتي"
          value={data.courses || 0}
          bgColor={colors.lightOrange}
          iconColor={colors.courseIconsSection}
        />
        <StatCard
          icon={Users}
          title="طلابي"
          value={data.totalEnrollments || 0}
          bgColor={colors.lightBlue}
          iconColor={colors.mainColor}
        />
        <StatCard
          icon={DollarSign}
          title="إيراداتي"
          value={`${data.totalRevenue} DZD` || `0 DZD`}
          bgColor={colors.lightGreen}
          iconColor={colors.successColor}
        />
      </div>

      {/* الدورة الأفضل والإنجازات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCourseCard course={data.topCourse} isAdmin={false} />

        {/* بطاقة الإنجازات */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[#FFFDE7] dark:bg-[#FFFDE7]/20">
              <Award size={24} className="text-[#FFB802] dark:text-[#FFD966]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2C2C2C] dark:text-textPrimary">
                إنجازاتك هذا الشهر
              </h3>
              <p className="text-sm text-[#6E7485] dark:text-textSecondary">
                احتفل بنجاحاتك
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E8F5E8] dark:bg-[#E8F5E8]/20">
              <Star size={20} className="text-[#45DA10] dark:text-[#45DA10]" />
              <span className="font-medium text-[#2C2C2C] dark:text-textPrimary">
                أفضل معلم هذا الشهر
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E3F2FD] dark:bg-[#E3F2FD]/20">
              <Eye size={20} className="text-[#3D45EE] dark:text-[#3E4FED]" />
              <span className="font-medium text-[#2C2C2C] dark:text-textPrimary">
                +500 مشاهدة جديدة
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FDF0CD] dark:bg-[#FDF0CD]/20">
              <Calendar
                size={20}
                className="text-[#FFB802] dark:text-[#FFD966]"
              />
              <span className="font-medium text-[#2C2C2C] dark:text-textPrimary">
                3 دورات تم إكمالها
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المخططات */}
      <TeacherCharts data={data} />
    </div>
  );
};

export default HomePage;
