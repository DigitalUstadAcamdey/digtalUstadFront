"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
  BookOutlined,
  SettingsOutlined,
  NotificationsOutlined,
  SupportOutlined,
  PeopleOutlined,
  AdminPanelSettingsOutlined,
  LocalOfferOutlined,
  KeyboardArrowDownOutlined,
  PersonAddOutlined,
  LoginOutlined,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { useUserStore } from "@/store/userStore";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import showToast from "@/utils/showToast";

const NavBarHome = () => {
  const [menuToggle, setMenuToggle] = useState<boolean | null>(null);
  const [userMenuToggle, setUserMenuToggle] = useState<boolean | null>(null);
  const yourCourseId = process.env.NEXT_PUBLIC_MY_COURSE_ID || "1as22dkslasd";
  const yourContactUrl =
    process.env.NEXT_PUBLIC_MY_CONTACT_URL || "1as22dkslasd";

  const handleColseToggle = () => {
    setMenuToggle(false);
  };
  const handleColseAndOpenUserToggle = () => {
    setUserMenuToggle(!userMenuToggle);
  };
  const handleOpenToggle = () => {
    setMenuToggle(true);
  };

  const { user, fetchUser, loading } = useUserStore();

  const role = user.role === "student" ? "user" : user.role;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      showToast("success", "تم تسجيل الخروج بنجاح");
      setUserMenuToggle(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      showToast("error", "تم تسجيل الخروج بنجاح");
    }
  };

  // Menu items for different roles
  const getMenuItems = () => {
    const basePrefix = `/dashboard-${role}`;

    switch (user.role) {
      case "student":
        return [
          {
            href: basePrefix,
            label: "الرئيسية",
            icon: <HomeOutlined fontSize="small" />,
            color: "blue",
          },
          {
            href: `${basePrefix}/courses`,
            label: "دوراتي",
            icon: <BookOutlined fontSize="small" />,
            color: "green",
          },
          {
            href: `${basePrefix}/notification`,
            label: "الإشعارات",
            icon: <NotificationsOutlined fontSize="small" />,
            color: "orange",
          },
          {
            href: `${basePrefix}/settings`,
            label: "الإعدادات",
            icon: <SettingsOutlined fontSize="small" />,
            color: "gray",
          },
          {
            href: `${basePrefix}/support`,
            label: "الدعم",
            icon: <SupportOutlined fontSize="small" />,
            color: "purple",
          },
        ];

      case "teacher":
        return [
          {
            href: basePrefix,
            label: "الرئيسية",
            icon: <HomeOutlined fontSize="small" />,
            color: "blue",
          },
          {
            href: `${basePrefix}/courses`,
            label: "دوراتي",
            icon: <BookOutlined fontSize="small" />,
            color: "green",
          },
          {
            href: `${basePrefix}/notification`,
            label: "الإشعارات",
            icon: <NotificationsOutlined fontSize="small" />,
            color: "orange",
          },
          {
            href: `${basePrefix}/settings`,
            label: "الإعدادات",
            icon: <SettingsOutlined fontSize="small" />,
            color: "gray",
          },
        ];

      case "admin":
        return [
          {
            href: basePrefix,
            label: "الرئيسية",
            icon: <HomeOutlined fontSize="small" />,
            color: "blue",
          },
          {
            href: `${basePrefix}/courses`,
            label: "الدورات",
            icon: <BookOutlined fontSize="small" />,
            color: "green",
          },
          {
            href: `${basePrefix}/students`,
            label: "الطلاب",
            icon: <PeopleOutlined fontSize="small" />,
            color: "indigo",
          },
          {
            href: `${basePrefix}/administration`,
            label: "الإدارة",
            icon: <AdminPanelSettingsOutlined fontSize="small" />,
            color: "purple",
          },
          {
            href: `${basePrefix}/coupons`,
            label: "الكوبونات",
            icon: <LocalOfferOutlined fontSize="small" />,
            color: "emerald",
          },
          {
            href: `${basePrefix}/support`,
            label: "الدعم",
            icon: <SupportOutlined fontSize="small" />,
            color: "orange",
          },
          {
            href: `${basePrefix}/settings`,
            label: "الإعدادات",
            icon: <SettingsOutlined fontSize="small" />,
            color: "gray",
          },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Get color classes for different colors
  type Color =
    | "blue"
    | "green"
    | "orange"
    | "gray"
    | "purple"
    | "indigo"
    | "emerald";

  const getColorClasses = (color: Color): string => {
    const colorMap: Record<Color, string> = {
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50",
      green:
        "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50",
      orange:
        "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50",
      gray: "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300 dark:hover:bg-gray-900/50",
      purple:
        "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50",
      indigo:
        "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50",
      emerald:
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
    };
    return colorMap[color] ?? colorMap.gray;
  };

  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUser();
    };
    getUserInfo();
  }, [fetchUser]);

  return (
    <>
      <div className="sticky top-4 z-50 m-4">
        <div className="h-[80px] flex items-center justify-around bg-gray-300/60 dark:bg-gray-700/60 rounded-full px-6 container mx-auto w-full backdrop-blur-xl border border-gray-400/20 dark:border-gray-600/20 shadow-md">
          <Link
            href="/"
            className="flex items-center  flex-row-reverse md:gap-3 transition-colors duration-300 hover:text-mainColor dark:hover:text-primaryDark"
          >
            <Image
              src="/imgs/dashboard-user-imgs/logoDashUser.png"
              alt="logoImg"
              loading="lazy"
              width={150}
              height={150}
            />
            {/* <h1 className="md:text-xl xs:text-base font-semibold xs:hidden lg:block text-slate-800 dark:text-textPrimary">
            Sience Academie
          </h1> */}
          </Link>

          <nav className="md:flex xs:hidden apply-fonts-normal items-center justify-center gap-6 flex-grow">
            <Link
              href={`/course-overview/${yourCourseId}`}
              className="relative cursor-pointer text-slate-700 dark:text-textSecondary transition-colors duration-300 hover:text-mainColor dark:hover:text-primaryDark after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-0 after:bg-mainColor dark:after:bg-primaryDark after:transition-all after:duration-300 hover:after:w-full"
            >
              دورتنا
            </Link>
            <Link
              href={`/${yourContactUrl}`}
              className="relative text-slate-700 dark:text-textSecondary transition-colors duration-300 hover:text-mainColor dark:hover:text-primaryDark after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-0 after:bg-mainColor dark:after:bg-primaryDark after:transition-all after:duration-300 hover:after:w-full"
            >
              تواصل معنا
            </Link>
          </nav>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-t-transparent border-mainColor dark:border-primaryDark rounded-full animate-spin"></div>
            </div>
          ) : user._id !== "" ? (
            <div className="relative flex gap-2">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="flex items-center  gap-2 p-1 pr-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={handleColseAndOpenUserToggle}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                      <Image
                        src={user.thumbnail || "/imgs/personImg.png"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        alt={`img-${user._id}`}
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-textPrimary apply-fonts-medium leading-tight">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-textSecondary apply-fonts-normal">
                      {user.role === "student"
                        ? "طالب"
                        : user.role === "teacher"
                        ? "أستاذ"
                        : "مدير"}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuToggle ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <KeyboardArrowDownOutlined className="text-gray-600 dark:text-gray-400" />
                  </motion.div>
                </button>
              </motion.div>

              <button className="md:hidden" onClick={handleOpenToggle}>
                <MenuOutlined
                  fontSize="large"
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>

              <AnimatePresence>
                {userMenuToggle && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="absolute top-16 -left-8 w-64 bg-white dark:bg-cardBgDark rounded-2xl shadow-2xl dark:shadow-xl border border-gray-200 dark:border-gray-700 py-4 px-3 z-50"
                  >
                    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <Image
                              src={user.thumbnail || "/imgs/personImg.png"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              alt={`img-${user._id}`}
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 dark:text-textPrimary truncate apply-fonts-medium">
                            {user.username}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.role === "admin"
                                  ? "bg-red-500"
                                  : user.role === "teacher"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <p className="text-sm text-gray-600 dark:text-textSecondary apply-fonts-normal">
                              {user.role === "student"
                                ? "طالب"
                                : user.role === "teacher"
                                ? "أستاذ"
                                : "مدير النظام"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setUserMenuToggle(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md ${getColorClasses(
                              item.color as Color
                            )} apply-fonts-normal text-sm font-medium group`}
                          >
                            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-cardBgDark shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                              {item.icon}
                            </div>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: menuItems.length * 0.05 + 0.1,
                        duration: 0.3,
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-all duration-300 hover:scale-105 hover:shadow-md apply-fonts-normal text-sm font-medium group"
                      >
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-cardBgDark shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                          <LogoutOutlined fontSize="small" />
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          تسجيل الخروج
                        </span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex   items-center xs:gap-2 xs:flex-grow xs:justify-end md:flex-grow-0">
              <button className="md:hidden" onClick={handleOpenToggle}>
                <MenuOutlined
                  fontSize="large"
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
              <Link
                href="/login"
                className="xs:hidden md:block transition-all duration-300 bg-mainColor dark:bg-primaryDark hover:bg-mainColorHoverLight dark:hover:bg-primaryHoverDark text-white md:text-[18px] apply-fonts-normal py-2 px-5 rounded-3xl text-center"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="xs:hidden md:block transition-all duration-300 font-light text-slate-700 dark:text-textSecondary rounded-3xl py-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {menuToggle && (
          <motion.div
            className="w-full h-screen fixed  z-50 top-0 left-0 bg-black/80 text-white backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={handleColseToggle}
          >
            <motion.div
              className="bg-white/10 dark:bg-cardBgDark/20 backdrop-blur-md w-full h-full md:w-[60%] lg:w-[40%] absolute right-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-7 border-b border-white/20 dark:border-gray-700/50">
                <h2 className="text-xl font-bold apply-fonts-medium text-slate-800 dark:text-textPrimary">
                  القائمة
                </h2>
                <motion.button
                  onClick={handleColseToggle}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors duration-300"
                >
                  <CloseOutlined className="text-red-400" fontSize="large" />
                </motion.button>
              </div>
              <motion.nav
                className="flex flex-col items-center justify-start px-8 pt-12 apply-fonts-normal gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {[
                  { href: `/${yourCourseId}`, label: "دورتنا", icon: "📚" },
                  {
                    href: `/${yourContactUrl}`,
                    label: "تواصل معنا",
                    icon: "📞",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="w-full max-w-xs"
                  >
                    <Link
                      href={item.href || "/"}
                      onClick={handleColseToggle}
                      className="flex items-center justify-center gap-4 p-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-800/80 transition-all duration-300 group"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="text-lg font-medium group-hover:translate-x-2 transition-transform duration-300 text-slate-800 dark:text-textPrimary">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                {user._id !== "" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="w-full max-w-xs mt-6 pt-6 border-t border-white/20 dark:border-gray-700/50"
                  >
                    <div className="flex items-center gap-4 p-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 dark:border-gray-600">
                          <Image
                            src={user.thumbnail || "/imgs/personImg.png"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            alt={`img-${user._id}`}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-800 dark:text-textPrimary font-bold apply-fonts-medium">
                          {user.username}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm apply-fonts-normal">
                          {user.role === "student"
                            ? "طالب"
                            : user.role === "teacher"
                            ? "أستاذ"
                            : "مدير"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard-${role}`}
                      onClick={handleColseToggle}
                      className="flex items-center justify-center gap-3 w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-white dark:text-blue-400 border border-blue-400/30 transition-all duration-300 mb-3"
                    >
                      <HomeOutlined fontSize="small" />
                      <span className="apply-fonts-normal">لوحة التحكم</span>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="w-full max-w-xs mt-6 pt-6 border-t border-white/20 dark:border-gray-700/50 space-y-4"
                  >
                    <Link
                      href="/login"
                      onClick={handleColseToggle}
                      className="flex items-center justify-center gap-3 w-full p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-2xl text-white border border-blue-400/30 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                        <LoginOutlined
                          fontSize="small"
                          className="text-blue-300"
                        />
                      </div>
                      <span className="text-lg font-medium apply-fonts-normal group-hover:translate-x-2 transition-transform duration-300">
                        تسجيل الدخول
                      </span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={handleColseToggle}
                      className="flex items-center justify-center gap-3 w-full p-4 bg-green-500/20 hover:bg-green-500/30 rounded-2xl text-white border border-green-400/30 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                        <PersonAddOutlined
                          fontSize="small"
                          className="text-green-300"
                        />
                      </div>
                      <span className="text-lg font-medium apply-fonts-normal group-hover:translate-x-2 transition-transform duration-300">
                        إنشاء حساب
                      </span>
                    </Link>
                  </motion.div>
                )}
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBarHome;
