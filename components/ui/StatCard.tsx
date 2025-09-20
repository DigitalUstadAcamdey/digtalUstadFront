"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { colors } from "@/constants/colors";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
  textColor?: string;
  trend?: number;
}
const colorMap = {
  [colors.lightOrange]: { bg: "bg-[#FFF3E0]", darkBg: "dark:bg-[#FFF3E0]/20" },
  [colors.courseIconsSection]: {
    text: "text-[#FF6636]",
    darkText: "dark:text-[#FF6636]",
  },
  [colors.lightBlue]: { bg: "bg-[#E3F2FD]", darkBg: "dark:bg-[#E3F2FD]/20" },
  [colors.mainColor]: {
    text: "text-[#3D45EE]",
    darkText: "dark:text-[#3E4FED]",
  },
  [colors.lightGreen]: { bg: "bg-[#E8F5E8]", darkBg: "dark:bg-[#E8F5E8]/20" },
  [colors.successColor]: {
    text: "text-[#45DA10]",
    darkText: "dark:text-[#45DA10]",
  },
  [colors.darkGray]: {
    text: "text-[#2C2C2C]",
    darkText: "dark:text-[#FFFFFF]",
  },
  [colors.courseTextSection]: {
    text: "text-[#6E7485]",
    darkText: "dark:text-[#D1D5E0]",
  },
  [colors.lightYellow]: { bg: "bg-[#FFFDE7]", darkBg: "dark:bg-[#FFFDE7]/20" },
  [colors.startTextColor]: {
    text: "text-[#FFB802]",
    darkText: "dark:text-[#FFD966]",
  },
};
export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  bgColor,
  iconColor,
  textColor = colors.darkGray,
  trend,
}) => {
  const bgClass = colorMap[bgColor]?.bg || "";
  const darkBgClass = colorMap[bgColor]?.darkBg || "";
  const iconTextClass = colorMap[iconColor]?.text || "";
  const darkIconClass = colorMap[iconColor]?.darkText || "";
  const titleTextClass = colorMap[colors.courseTextSection]?.text || "";
  const darkTitleClass = colorMap[colors.courseTextSection]?.darkText || "";
  const valueTextClass = colorMap[textColor]?.text || "text-slate-800";
  const darkValueClass = colorMap[textColor]?.darkText || "dark:text-gray-100";
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:bg-cardBgDark dark:border-gray-700 dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${darkBgClass}`}>
          <Icon size={24} className={`${iconTextClass} ${darkIconClass}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-[#45DA10] dark:text-[#45DA10]">
            <TrendingUp size={16} />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
      <h3
        className={`text-sm font-medium mb-2 ${titleTextClass} ${darkTitleClass}`}
      >
        {title}
      </h3>
      <p className={`text-2xl font-bold ${valueTextClass} ${darkValueClass}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};
