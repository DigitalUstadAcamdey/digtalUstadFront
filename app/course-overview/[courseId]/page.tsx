import { CoursePage } from "@/components/course-overview/CoursePage";
import NavBarCourse from "@/components/course-overview/NavBarCourse";
import { Course } from "@/types/course";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Home,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SideBarStudent from "@/components/dashboard-user/sideBar/SideBar";
import SideBarTeacher from "@/components/dashboard-teacher/sideBar/SideBar";
import SideBarAdmin from "@/components/dashboard-admin/sideBar/SideBar";
import { fetchUserServer } from "@/lib/fetchUserServer";
interface Props {
  params: Promise<{ courseId: string }>;
}
export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/ids`
  );
  const data = await res.json();
  // لنفترض أن data.courses هي مصفوفة من الدورات وكل دورة تحتوي على _id
  return data.courses.map((course: { _id: string }) => ({
    courseId: course._id,
  }));
}

const page = async ({ params }: Props) => {
  const user = await fetchUserServer();

  try {
    const courseId = (await params).courseId;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}`
    );

    if (!res.ok) {
      return (
        <div className={` py1 ${user ? "" : "container mx-auto"}`}>
          {user ? <></> : <NavBarCourse />}
          <div className=" flex gap-4  h-screen">
            {user ? (
              user.role === "student" ? (
                <SideBarStudent />
              ) : user.role === "teacher" ? (
                <SideBarTeacher />
              ) : user.role === "admin" ? (
                <SideBarAdmin />
              ) : null
            ) : (
              <></>
            )}
            <div className="flex-1 container mx-auto py-3">
              {res.status === 404 ? (
                <div className="h-[93vh] overflow-scroll flex items-center justify-center px-4 my-4">
                  <div className="max-w-md w-full">
                    {/* Error Icon */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 animate-pulse">
                        <AlertCircle
                          size={40}
                          className="text-red-500 dark:text-red-400"
                        />
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 apply-fonts-medium">
                        لم يتم العثور على الدورة
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 apply-fonts-normal leading-relaxed">
                        عذراً، الدورة المطلوبة غير متوفرة حالياً أو قد تم حذفها.
                        يمكنك تصفح الدورات الأخرى أو العودة للرئيسية.
                      </p>
                    </div>

                    {/* Course ID Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                          <BookOpen
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 apply-fonts-normal">
                            معرف الدورة
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 mt-1 break-all">
                            {courseId}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Link
                          href={`/course-overview/${courseId}`}
                          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl apply-fonts-normal group"
                        >
                          <RefreshCw
                            size={20}
                            className="group-hover:rotate-180 transition-transform duration-500"
                          />
                          <span>إعادة المحاولة</span>
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/"
                          className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal group"
                        >
                          <Home
                            size={18}
                            className="group-hover:scale-110 transition-transform duration-300"
                          />
                          <span>الرئيسية</span>
                        </Link>

                        <Link
                          href="/courses"
                          className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal group"
                        >
                          <Search
                            size={18}
                            className="group-hover:scale-110 transition-transform duration-300"
                          />
                          <span>تصفح الدورات</span>
                        </Link>
                      </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-900 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/60 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertCircle
                            size={14}
                            className="text-amber-600 dark:text-amber-300"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 apply-fonts-medium text-sm">
                            تحتاج مساعدة؟
                          </h3>
                          <p className="text-amber-700 dark:text-amber-300 text-xs apply-fonts-normal leading-relaxed">
                            إذا كنت تعتقد أن هذا خطأ، يمكنك التواصل مع فريق
                            الدعم أو المحاولة مرة أخرى لاحقاً.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[93vh] overflow-scroll flex items-center justify-center px-4 my-4">
                  <div className="max-w-md w-full text-center relative">
                    {/* Error Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 animate-bounce">
                      <AlertCircle
                        size={40}
                        className="text-red-500 dark:text-red-400"
                      />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 apply-fonts-medium">
                      خطأ في تحميل البيانات
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 apply-fonts-normal mb-8 leading-relaxed">
                      حدث خطأ أثناء محاولة تحميل الدورة. يرجى المحاولة مرة أخرى
                      أو العودة لاحقاً.
                    </p>

                    {/* Action Links */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Link
                          href="/"
                          className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl apply-fonts-normal group"
                        >
                          <ArrowLeft
                            size={20}
                            className="group-hover:-translate-x-1 transition-transform duration-300"
                          />
                          <span>العودة للرئيسية</span>
                        </Link>
                      </div>

                      <Link
                        href="/courses"
                        className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal"
                      >
                        <Search size={18} />
                        <span>استكشاف الدورات</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const data = await res.json();
    const course: Course = data.course ? data.course : null;

    if (!course) {
      return (
        <div className={` py1 ${user ? "" : "container mx-auto"}`}>
          {user ? <></> : <NavBarCourse />}
          <div className=" flex gap-4  h-screen">
            {user ? (
              user.role === "student" ? (
                <SideBarStudent />
              ) : user.role === "teacher" ? (
                <SideBarTeacher />
              ) : user.role === "admin" ? (
                <SideBarAdmin />
              ) : null
            ) : (
              <></>
            )}
            <div className="flex-1 container mx-auto py-3">
              <div className="h-[93vh] overflow-scroll flex items-center justify-center px-4 my-4">
                <div className="max-w-md w-full">
                  {/* Error Icon */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-pulse">
                      <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 apply-fonts-medium">
                      لم يتم العثور على الدورة
                    </h1>
                    <p className="text-gray-600 apply-fonts-normal leading-relaxed">
                      عذراً، الدورة المطلوبة غير متوفرة حالياً أو قد تم حذفها.
                      يمكنك تصفح الدورات الأخرى أو العودة للرئيسية.
                    </p>
                  </div>

                  {/* Course ID Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 apply-fonts-normal">
                          معرف الدورة
                        </p>
                        <p className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border mt-1 break-all">
                          {courseId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href={`/course-overview/${courseId}`}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl apply-fonts-normal group"
                      >
                        <RefreshCw
                          size={20}
                          className="group-hover:rotate-180 transition-transform duration-500"
                        />
                        <span>إعادة المحاولة</span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal group"
                      >
                        <Home
                          size={18}
                          className="group-hover:scale-110 transition-transform duration-300"
                        />
                        <span>الرئيسية</span>
                      </Link>

                      <Link
                        href="/courses"
                        className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal group"
                      >
                        <Search
                          size={18}
                          className="group-hover:scale-110 transition-transform duration-300"
                        />
                        <span>تصفح الدورات</span>
                      </Link>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-1 apply-fonts-medium text-sm">
                          تحتاج مساعدة؟
                        </h3>
                        <p className="text-amber-700 text-xs apply-fonts-normal leading-relaxed">
                          إذا كنت تعتقد أن هذا خطأ، يمكنك التواصل مع فريق الدعم
                          أو المحاولة مرة أخرى لاحقاً.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-10 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-10 animate-pulse"></div>
                  <div className="absolute bottom-20 right-10 w-12 h-12 bg-red-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={` py1 ${user ? "" : "container mx-auto"}`}>
        {user ? <></> : <NavBarCourse />}
        <div className=" flex gap-4  h-screen">
          {/* Sidebar */}
          {user ? (
            user.role === "student" ? (
              <SideBarStudent />
            ) : user.role === "teacher" ? (
              <SideBarTeacher />
            ) : user.role === "admin" ? (
              <SideBarAdmin />
            ) : null
          ) : (
            <></>
          )}

          {/* Main Content */}
          <div className="flex-1 container mx-auto py-3">
            <CoursePage course={course} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className={` py1 ${user ? "" : "container mx-auto"}`}>
        {user ? <></> : <NavBarCourse />}
        <div className=" flex gap-4  h-screen">
          {/* Sidebar */}
          {user ? (
            user.role === "student" ? (
              <SideBarStudent />
            ) : user.role === "teacher" ? (
              <SideBarTeacher />
            ) : user.role === "admin" ? (
              <SideBarAdmin />
            ) : null
          ) : (
            <></>
          )}
          <div className="flex-1 container mx-auto py-3">
            <div className="h-[93vh] flex items-center justify-center px-4  my-4">
              <div className="max-w-md w-full text-center relative">
                {/* Error Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-bounce">
                  <AlertCircle size={40} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 apply-fonts-medium">
                  خطأ في تحميل البيانات
                </h1>
                <p className="text-gray-600 apply-fonts-normal mb-8 leading-relaxed">
                  حدث خطأ أثناء محاولة تحميل الدورة. يرجى المحاولة مرة أخرى أو
                  العودة لاحقاً.
                </p>

                {/* Action Links */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl apply-fonts-normal group"
                    >
                      <ArrowLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform duration-300"
                      />
                      <span>العودة للرئيسية</span>
                    </Link>
                  </div>

                  <Link
                    href="/courses"
                    className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md apply-fonts-normal"
                  >
                    <Search size={18} />
                    <span>استكشاف الدورات</span>
                  </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-red-50 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gray-50 rounded-full opacity-30 animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default page;
