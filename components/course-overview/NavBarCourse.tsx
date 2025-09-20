"use client";
import { useUserStore } from "@/store/userStore";
import {
  BookOutlined,
  HomeOutlined,
  NotificationsNoneOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBarCourse = () => {
  const { user } = useUserStore();
  const role =
    user?.role === "student"
      ? "user"
      : user?.role === "teacher"
      ? "teacher"
      : "admin";

  // قائمة الروابط للمستخدمين المسجلين
  const loggedInLinks = [
    {
      href: `/dashboard-${role}`,
      title: "الرئيسية",
      icon: HomeOutlined,
    },
    {
      href: `/dashboard-${role}/courses`,
      title: "الدورات",
      icon: BookOutlined,
    },
    {
      href: `/dashboard-${role}/notification`,
      title: "الإشعارات",
      icon: NotificationsNoneOutlined,
    },
  ];

  // قائمة الروابط للمستخدمين غير المسجلين
  const publicLinks = [
    {
      href: "/",
      title: "الرئيسية",
      icon: HomeOutlined,
    },
    {
      href: "/courses",
      title: "الدورات",
      icon: BookOutlined,
    },
  ];

  const links = user._id !== "" ? loggedInLinks : publicLinks;

  return (
    <div className="sticky top-3 z-20 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center  justify-between px-5 py-2 shadow-sm border border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 transition-colors duration-300">
      <div className="flex sm:gap-4 xs:gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full text-gray-800 hover:bg-mainColor/10 transition-colors duration-300 dark:text-gray-100 dark:hover:bg-blue-800/30`}
            >
              <Icon className="w-5 h-5" />
              <p className="apply-fonts-normal sm:block xs:hidden">
                {link.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavBarCourse;
