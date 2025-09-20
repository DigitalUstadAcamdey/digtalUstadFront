import EditCourse from "@/components/dashboard-teacher/edit-course/EditCourse";
import ScrollToTopButton from "@/components/utlisComponenets/ScrollToTopButton";
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

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/ids`
  );
  const data = await res.json();
  return data.courses.map((course: { _id: string }) => ({
    courseId: course._id,
  }));
}

type PageProps = { params: Promise<{ courseId: string }> };

const page = async ({ params }: PageProps) => {
  const courseId = (await params).courseId;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return (
        <div className="py-3 container mx-auto">
          {res.status === 404 ? (
            <div className="min-h-[70vh] flex items-center justify-center px-4  my-4">
              <div className="max-w-md w-full">
                {/* Error Icon */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-pulse">
                    <AlertCircle size={40} className="text-red-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    لم يتم العثور على الدورة
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    عذراً، الدورة المطلوبة غير متوفرة حالياً أو قد تم حذفها.
                  </p>
                </div>

                {/* Course ID Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
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
                      href={`/edit-course/${courseId}`}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group"
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
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Home size={18} />
                      <span>الرئيسية</span>
                    </Link>

                    <Link
                      href="/courses"
                      className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Search size={18} />
                      <span>تصفح الدورات</span>
                    </Link>
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
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center px-4  my-4">
              <div className="max-w-md w-full text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-bounce">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  خطأ في تحميل البيانات
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  حدث خطأ أثناء محاولة تحميل الدورة. يرجى المحاولة مرة أخرى
                  لاحقاً.
                </p>

                <Link
                  href="/"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft size={20} />
                  <span>العودة للرئيسية</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    }

    const data = await res.json();
    const course = data.course ?? null;

    if (!course) {
      return (
        <div className="py-3 container mx-auto">
          <h1 className="text-xl font-bold text-center text-red-500">
            لم يتم العثور على الدورة
          </h1>
        </div>
      );
    }

    return (
      <div>
        <EditCourse courseFetcher={course} />
        <ScrollToTopButton />
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className="py-3 container mx-auto text-center">
        <AlertCircle size={40} className="mx-auto text-red-500" />
        <h1 className="text-xl font-bold mt-4">خطأ في تحميل البيانات</h1>
        <p className="text-gray-600 mt-2">يرجى المحاولة مرة أخرى لاحقاً.</p>
      </div>
    );
  }
};

export default page;
