import React from "react";
import CardCourse from "./CardCourse";

import { User } from "@/types/user";
import { cookies } from "next/headers";
import { Course } from "@/types/course";
import Image from "next/image";
import Notifications from "./Notifications";
import { BookOpen } from "lucide-react";

const HomePage = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let myEnrolledCourses: Course[] | null = [];
  let user: User | null = null;

  const fetchMyEnrolledCourses = async () => {
    try {
      const res = await fetch(
        `${process.env.BACK_URL}/api/courses/my-courses`,
        {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        }
      );
      const data = await res.json();

      myEnrolledCourses = data.course;
      const resUser = await fetch(`${process.env.BACK_URL}/api/users/me`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      const userData = await resUser.json();
      user = userData.user;
    } catch (err) {
      console.log("err", err);
    }
  };
  await fetchMyEnrolledCourses();
  const courses: Course[] | null = [myEnrolledCourses[0]];

  return (
    <div className=" lg:custom-width rounded-xl  py-5 h-[93vh]  ">
      {/* My Courses */}
      <div className="container mx-auto px-8 py-4 ">
        <div className="w-full ">
          {myEnrolledCourses?.length > 0 ? (
            courses?.map((course: Course) => {
              const videoNumber = course?.sections.reduce((acc, section) => {
                return acc + (section.videos?.length || 0);
              }, 0);

              return (
                <div key={course?._id} className="w-full  h-full ">
                  <CardCourse
                    key={course?._id}
                    progresBar={
                      user?.progress.find((p) => p.course === course._id)
                        ?.percentage || 0
                    }
                    studentsNumber={course?.enrolledStudents.length}
                    numberOfVideo={videoNumber}
                    courseImg={course?.imageCover}
                    courseUrl={`/course/${course?._id}`}
                    courseName={course?.title}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              {/* الأيقونة الرئيسية */}
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-mainColor/10 to-mainColor/5 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-16 h-16 text-mainColor/60" />
                </div>
                {/* دائرة متحركة */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-mainColor/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-mainColor/30 rounded-full animate-bounce"></div>
              </div>

              {/* النص الرئيسي */}
              <div className="text-center mb-8 max-w-md">
                <h2 className="apply-fonts-normal text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  لم تشترك في أي كورس بعد
                </h2>
                <p className="apply-fonts-normal text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  ابدأ رحلتك التعليمية واكتشف مجموعة متنوعة من الكورسات المتاحة
                  لتطوير مهاراتك
                </p>
              </div>

              {/* الأزرار */}
              {/* <div className="flex flex-col justify-center sm:flex-row gap-4 w-full max-w-sm">
                <Link
                  href="/dashboard-user/courses"
                  className="apply-fonts-normal flex items-center justify-center gap-2 px-6 py-3 bg-mainColor text-white font-medium rounded-lg hover:bg-mainColorHoverLight transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  تصفح الكورسات
                </Link>

               
              </div> */}

              {/* عناصر تزيينية */}
              <div className="mt-12 grid grid-cols-3 gap-4 opacity-30">
                <div className="h-2 bg-mainColor/20 rounded-full animate-pulse"></div>
                <div
                  className="h-2 bg-mainColor/30 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="h-2 bg-mainColor/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

             
            </div>
          )}
        </div>
      </div>

      {/* Telegram & Notfications */}
      <div className="w-full container mx-auto px-8 py-4 ">
        <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 ">
          <div className="rounded-3xl overflow-scroll w-full border border-gray-500 p-4 sm:p-6 lg:p-8 text-white relative  h-[300px] sm:h-[350px] lg:h-[400px] mx-auto">
            <Notifications />
          </div>
          <div className="rounded-3xl w-full border border-gray-500 text-white relative overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px] mx-auto ">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Image Container */}
            <div className="w-full h-full flex items-center justify-center ">
              <Image
                src="/imgs/telgramAction.png"
                alt="Telegram"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1200}
                height={1200}
              />
            </div>

            {/* Absolute Button */}
            <div className="absolute bottom-9  right-9 flex justify-center">
              <a
                href={process.env.TELEGRAM_LINK ? process.env.TELEGRAM_LINK : "https://www.telegram.com/digtalustad/holder"}
                className="bg-white/10 backdrop-blur-none border border-white/30 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:bg-white/30 transition-all duration-300 font-medium text-center inline-flex items-center gap-2 text-sm sm:text-base"
                dir="rtl"
              >
                الإنضمام الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
