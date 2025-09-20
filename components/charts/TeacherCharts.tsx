"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { colors } from "@/constants/colors";
import { TeacherData } from "@/types/dashboard";

// تحديد الوضع (افتراضيًا، يمكنك استخدام hook لتحديد ذلك)
const isDarkMode = false; // يمكنك تغيير هذا بناءً على حالة الثيم في مشروعك

// تحديد الألوان المستخدمة في المخططات للوضع الفاتح والداكن
const chartColors = {
  axis: isDarkMode ? colors.textSecondary : colors.courseTextSection,
  grid: isDarkMode ? colors.sidebarBgDark : colors.mediumGray,
  tooltipBg: isDarkMode ? colors.cardBgDark : "white",
  tooltipBorder: isDarkMode ? colors.sidebarBgDark : colors.mediumGray,
  line1: isDarkMode ? colors.primaryDark : colors.mainColor,
  line2: isDarkMode ? colors.courseIconDark : colors.courseIconsSection,
  bar: isDarkMode ? colors.progressBarDark : colors.progressBarCourseColor,
  starRating: {
    excellent: isDarkMode ? colors.successDark : colors.successColor,
    great: isDarkMode ? colors.courseStarDark : colors.courseStarColor,
    good: isDarkMode ? colors.starTextDark : colors.startTextColor,
    fair: isDarkMode ? colors.courseTextDark : colors.courseTextSection,
  },
};

interface TeacherChartsProps {
  data: TeacherData;
}

export const TeacherCharts: React.FC<TeacherChartsProps> = () => {
  // بيانات الأداء الشهري
  const monthlyPerformance = [
    { month: "يناير", students: 45, revenue: 15000, courses: 8 },
    { month: "فبراير", students: 67, revenue: 18500, courses: 9 },
    { month: "مارس", students: 89, revenue: 22000, courses: 10 },
    { month: "أبريل", students: 156, revenue: 25500, courses: 11 },
    { month: "مايو", students: 234, revenue: 28000, courses: 12 },
  ];

  // بيانات التقييمات
  const ratingsData = [
    { name: "ممتاز", value: 85, fill: chartColors.starRating.excellent },
    { name: "جيد جداً", value: 65, fill: chartColors.starRating.great },
    { name: "جيد", value: 45, fill: chartColors.starRating.good },
    { name: "مقبول", value: 25, fill: chartColors.starRating.fair },
  ];

  // بيانات معدل الإكمال
  const completionData = [
    { subject: "البرمجة", completion: 92 },
    { subject: "التصميم", completion: 88 },
    { subject: "التسويق", completion: 85 },
    { subject: "الإدارة", completion: 78 },
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* الأداء الشهري */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none">
        <h3 className="text-lg font-bold mb-4 text-[#2C2C2C] dark:text-textPrimary">
          الأداء الشهري
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyPerformance}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartColors.grid}
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: chartColors.axis }}
              axisLine={{ stroke: chartColors.axis, strokeWidth: 1 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: chartColors.axis }}
              axisLine={{ stroke: chartColors.axis, strokeWidth: 1 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: chartColors.axis }}
            />
            <Line
              type="monotone"
              dataKey="students"
              stroke={chartColors.line1}
              strokeWidth={3}
              dot={{ fill: chartColors.line1, r: 6 }}
              name="الطلاب"
            />
            <Line
              type="monotone"
              dataKey="courses"
              stroke={chartColors.line2}
              strokeWidth={3}
              dot={{ fill: chartColors.line2, r: 6 }}
              name="الدورات"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* التقييمات */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none">
          <h3 className="text-lg font-bold mb-4 text-[#2C2C2C] dark:text-textPrimary">
            التقييمات
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="90%"
              data={ratingsData}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  color: chartColors.axis,
                  fontSize: "14px",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: chartColors.axis }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* معدل الإكمال */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none">
          <h3 className="text-lg font-bold mb-4 text-[#2C2C2C] dark:text-textPrimary">
            معدل إكمال الدورات
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.grid}
                opacity={0.3}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: chartColors.axis }}
                axisLine={{ stroke: chartColors.axis, strokeWidth: 1 }}
              />
              <YAxis
                type="category"
                dataKey="subject"
                tick={{ fontSize: 12, fill: chartColors.axis }}
                axisLine={{ stroke: chartColors.axis, strokeWidth: 1 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "معدل الإكمال"]}
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: chartColors.axis }}
              />
              <Bar
                dataKey="completion"
                fill={chartColors.bar}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
