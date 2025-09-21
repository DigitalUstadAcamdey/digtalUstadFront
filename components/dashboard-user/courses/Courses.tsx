import React from "react";
import CourseCard from "./CourseCard";
import SearchCourse from "./SearchCourse";

import { Course } from "@/types/course";
import { GraduationCap } from "lucide-react";
interface CoursesProps {
  searchParams: {
    filter?: string;
  };
}
const Courses = async ({ searchParams }: CoursesProps) => {
  const { filter } = searchParams;

  const fetchCourses = async () => {
    try {
      if (filter) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/searchCourses?query=${filter}`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();
        return data.courses;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses`,
        {
          cache: "no-store",
        } // please add page and limit
      );
      const data = await res.json();

      return data.courses;
    } catch (error) {
      console.log(error);
    }
  };
  const courses: Course[] = await fetchCourses();

  return (
    <>
      <div className="  lg:custom-width rounded-xl px-4 py-5  overflow-y-scroll relative h-[93vh]">
        <div className="mb-5 flex items-center gap-6">
          <h1 className="apply-fonts-normal text-2xl font-semibold ">
            الدورات
          </h1>
          <SearchCourse />
        </div>
        <div className="container mx-auto px-8 py-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
            <>
              {courses?.length > 0 ? (
                courses.map((course) => {
                  const videoNumber = course.sections.reduce((acc, section) => {
                    return acc + (section.videos?.length || 0);
                  }, 0);

                  return (
                    <div key={course._id} className=" max-w-[272px] ">
                      <CourseCard
                        courseId={course._id}
                        courseDescription={course.description}
                        courseImg={course.imageCover}
                        courseName={course.title}
                        coursePrice={course.price}
                        courseRating={course.avgRatings}
                        students={course.studentsCount}
                        numberOfVideo={videoNumber} // edit to all videos
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
                  {/* الرسم التوضيحي */}
                  <div className="relative mb-10">
                    <div className="w-40 h-40 bg-gradient-to-br from-mainColor/10 via-mainColor/5 to-transparent rounded-full flex items-center justify-center relative overflow-hidden">
                      <GraduationCap className="w-20 h-20 text-mainColor/70 z-10" />

                      {/* عناصر تزيينية متحركة */}
                      <div className="absolute top-8 right-8 w-4 h-4 bg-mainColor/30 rounded-full animate-bounce"></div>
                      <div className="absolute bottom-12 left-6 w-3 h-3 bg-mainColor/40 rounded-full animate-pulse"></div>
                      <div className="absolute top-16 left-12 w-2 h-2 bg-mainColor/50 rounded-full animate-ping"></div>
                    </div>

                    {/* خطوط تزيينية */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <div className="w-12 h-1 bg-mainColor/30 rounded-full animate-pulse"></div>
                      <div className="w-8 h-1 bg-mainColor/20 rounded-full animate-pulse delay-75"></div>
                      <div className="w-4 h-1 bg-mainColor/10 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>

                  {/* المحتوى النصي */}
                  <div className="text-center mb-10 max-w-lg">
                    <h2 className="apply-fonts-normal text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      لا توجد دورات متاحة
                    </h2>
                    <p className="apply-fonts-normal text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-2">
                      نعمل حالياً على إضافة محتوى تعليمي جديد ومميز
                    </p>
                    <p className="apply-fonts-normal text-gray-500 dark:text-gray-500 text-base">
                      تابعنا للحصول على آخر التحديثات حول الدورات الجديدة
                    </p>
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
