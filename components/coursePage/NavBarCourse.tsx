"use client";
import { useUserStore } from "@/store/userStore";
import {
  Book,
  Home,
  Bell,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState} from "react";

const NavBarCourse = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { user } = useUserStore();

  const role =
    user?.role === "student"
      ? "user"
      : user?.role === "teacher"
      ? "teacher"
      : "admin";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside


  return (
    <>
    
     

      {/* Sidebar */}
      <div
        className={`sidebar-container sticky top-0 h-screen border-l bg-sideBarBgColo dark:bg-bodyDark shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "w-80" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Toggle Button - Inside sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-3 z-10 p-2 bg-slate-600 dark:bg-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-500 dark:hover:bg-slate-600 transition-colors duration-300"
          >
            {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Header */}
          <div
            className={`p-4 border-b border-gray-200 dark:border-slate-600 transition-all duration-300 ${
              isOpen ? "pt-16" : "pt-20"
            }`}
          >
            {isOpen ? (
              <Link href={`/`} className="flex items-center justify-center">
                <Image
                  src="/imgs/dashboard-user-imgs/logoDashUser.png"
                  alt="logoImg"
                  className="w-44"
                  width={150}
                  height={150}
                />
              </Link>
            ) : (
              <div className="flex justify-center">
               <Link href={`/`} className="flex items-center justify-center">
                <Image
                  src="/imgs/dashboard-user-imgs/logoDashUser.png"
                  alt="logoImg"
                  className="w-44"
                  width={150}
                  height={150}
                />
              </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-2">
            <Link
              href={`/dashboard-${role}`}
              onClick={() => !isOpen || setIsOpen(false)}
              className="flex items-center gap-4 p-3 text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 group relative"
              title={!isOpen ? "الرئيسية" : ""}
            >
              <Home
                size={20}
                className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 min-w-[20px]"
              />
              {isOpen && (
                <p className="apply-fonts-normal text-lg font-medium whitespace-nowrap">
                  الرئيسية
                </p>
              )}
            </Link>

            <Link
              href={`/dashboard-${role}/courses`}
              onClick={() => !isOpen || setIsOpen(false)}
              className="flex items-center gap-4 p-3 text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 group relative"
              title={!isOpen ? "الدورات" : ""}
            >
              <Book
                size={20}
                className="text-slate-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 min-w-[20px]"
              />
              {isOpen && (
                <p className="apply-fonts-normal text-lg font-medium whitespace-nowrap">
                  الدورات
                </p>
              )}
            </Link>

            <Link
              href={`/dashboard-${role}/notification`}
              onClick={() => !isOpen || setIsOpen(false)}
              className="flex items-center gap-4 p-3 text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 group relative"
              title={!isOpen ? "الاشعارات" : ""}
            >
              <Bell
                size={20}
                className="text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 min-w-[20px]"
              />
              {isOpen && (
                <p className="apply-fonts-normal text-lg font-medium whitespace-nowrap">
                  الاشعارات
                </p>
              )}
            </Link>
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-600">
              <div className="text-center text-sm text-gray-500 dark:text-slate-400">
                <p className="apply-fonts-normal">Digtal Ustad Academy</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBarCourse;
