"use client";
import React from "react";
import {
  Users,
  BookOpen,
  UserCheck,
  GraduationCap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { TopCourseCard } from "@/components/ui/TopCourseCard";
import { AdminCharts } from "@/components/charts/AdminCharts";
import { colors } from "@/constants/colors";
import { AdminData } from "@/types/dashboard";

const HomePage = ({ data }: { data: AdminData }) => {
  return (
    <div className="lg:custom-width rounded-xl px-4 py-5 h-[94vh] overflow-y-scroll space-y-6">
      {/* العنوان والترحيب */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="opacity-90">إليك نظرة شاملة على أداء المنصة</p>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="إجمالي المستخدمين"
          value={data.users || 0}
          bgColor={colors.lightBlue}
          iconColor={colors.mainColor}
          trend={12}
        />
        <StatCard
          icon={BookOpen}
          title="عدد الدورات"
          value={data.courses || 0}
          bgColor={colors.lightOrange}
          iconColor={colors.courseIconsSection}
          trend={8}
        />
        <StatCard
          icon={UserCheck}
          title="إجمالي التسجيلات"
          value={data.totalEnrollments || 0}
          bgColor={colors.lightGreen}
          iconColor={colors.successColor}
          trend={15}
        />
        <StatCard
          icon={GraduationCap}
          title="عدد المعلمين"
          value={data.teachers || 0}
          bgColor={colors.lightPurple}
          iconColor={colors.mainColorHoverDark}
          trend={5}
        />
      </div>

      {/* صف الإيرادات والدورة الأفضل */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: colors.lightGreen }}
            >
              <DollarSign size={24} style={{ color: colors.successColor }} />
            </div>
            <div>
              <h3
                className="font-bold text-lg"
                style={{ color: colors.darkGray }}
              >
                إجمالي الإيرادات
              </h3>
              <p
                className="text-sm"
                style={{ color: colors.courseTextSection }}
              >
                الإيرادات الإجمالية للمنصة
              </p>
            </div>
          </div>
          <p
            className="text-3xl font-bold"
            style={{ color: colors.successColor }}
          >
            {data.totalRevenue || 0} DZD
          </p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp size={16} style={{ color: colors.successColor }} />
            <span className="text-sm" style={{ color: colors.successColor }}>
              +18% عن الشهر الماضي
            </span>
          </div>
        </div>

        <TopCourseCard course={data.topCourse || 0} isAdmin={true} />
      </div>

      {/* المخططات */}
      <AdminCharts data={data} />
    </div>
  );
};

export default HomePage;
