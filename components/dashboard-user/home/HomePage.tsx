import React from "react";
import CardCourse from "./CardCourse";

import { User } from "@/types/user";
import { cookies } from "next/headers";
import { Course } from "@/types/course";
import Image from "next/image";
import Notifications from "./Notifications";

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
          {myEnrolledCourses?.length > 0
            ? courses?.map((course: Course) => {
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
                      courseImg={"/imgs/courseDash.png"}
                      courseUrl={`/course/${course?._id}`}
                      courseName={course?.title}
                    />
                  </div>
                );
              })
            : courses?.map((course: Course) => {
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
                      courseImg={"/imgs/courseDash.png"}
                      courseUrl={``}
                      courseName={"ديجيتال أستاذ"}
                    />
                  </div>
                );
              })}
        </div>
      </div>

      {/* Telegram & Notfications */}
      <div className="w-full container mx-auto px-8 py-4 ">
        <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 ">
          <div className="rounded-3xl overflow-scroll w-full border border-gray-500 p-4 sm:p-6 lg:p-8 text-white relative  h-[300px] sm:h-[350px] lg:h-[400px] mx-auto">
            <Notifications />
          </div>
          <div className="rounded-3xl w-full border border-gray-500 text-white relative overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px] mx-auto ">
      

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
                href={
                  process.env.TELEGRAM_LINK
                    ? process.env.TELEGRAM_LINK
                    : "https://www.telegram.com/digtalustad/holder"
                }
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
