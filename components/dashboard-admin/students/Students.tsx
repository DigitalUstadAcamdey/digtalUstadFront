import React from "react";
import StudentCard from "./StudentCard";
import SearchUsers from "./SearchUsers";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { Users } from "lucide-react";

interface StudentsProps {
  searchParams: {
    filter?: string;
  };
}

const Students = async ({ searchParams }: StudentsProps) => {
  const { filter } = searchParams;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  const fetchAllUsers = async () => {
    try {
      if (filter) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/searchUsers?query=${filter}`,

          {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          }
        );
        const data = await res.json();
        return data.users.filter((user: User) => user.role === "student");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/users`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      const data = await res.json();
      return data.users.filter((user: User) => user.role === "student");
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error);
      return [];
    }
  };

  const users: User[] = await fetchAllUsers();

  return (
    <div className="rounded-xl px-4 py-5 h-[93vh] overflow-y-scroll ">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-mainColor rounded-xl p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="apply-fonts-normal text-3xl font-bold text-gray-800 dark:text-gray-100">
                الطلاب
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                إدارة حسابات الطلاب ({users?.length || 0} طالب)
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <SearchUsers />
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="apply-fonts-normal text-sm text-gray-500 dark:text-gray-400 mb-1">
                إجمالي الطلاب
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {users?.length || 0}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="apply-fonts-normal text-sm text-gray-500 dark:text-gray-400 mb-1">
                الطلاب النشطون
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {users?.filter((user) => user.active).length || 0}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="apply-fonts-normal text-sm text-gray-500 dark:text-gray-400 mb-1">
                الطلاب غير النشطين
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {users?.filter((user) => !user.active).length || 0}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {users?.length > 0 ? (
          <>
            {/* Desktop Table Header */}
            <div className="hidden md:block bg-mainColor dark:bg-gray-800 text-white dark:text-gray-100">
              <div className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-4">
                  <h3 className="apply-fonts-normal font-semibold text-lg">
                    معلومات الطالب
                  </h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="apply-fonts-normal font-semibold text-lg">
                    تاريخ الانضمام
                  </h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="apply-fonts-normal font-semibold text-lg">
                    الحالة
                  </h3>
                </div>
                <div className="col-span-3 text-center">
                  <h3 className="apply-fonts-normal font-semibold text-lg">
                    العمليات
                  </h3>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <StudentCard
                    studentImg={user.thumbnail || "/imgs/logoImg.png"}
                    studentName={user.username}
                    studentEmail={user.email}
                    studentJoinDate={user.createdAt?.split("T")[0]}
                    studentId={user._id}
                    studentStatus={user.active}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="apply-fonts-normal text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              لا توجد نتائج
            </h3>
            <p className="apply-fonts-normal text-gray-500 dark:text-gray-400 text-center max-w-md">
              {filter
                ? `لم يتم العثور على أي طلاب يطابقون "${filter}"`
                : "لا يوجد أي طلاب مسجلين في النظام حالياً"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
