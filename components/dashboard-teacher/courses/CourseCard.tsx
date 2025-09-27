"use client";
import React, { useState } from "react";
import { useCoursesStore } from "@/store/coursesStore";
import { PeopleOutlineOutlined, PlayLesson } from "@mui/icons-material";
import { Rating } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import showToast from "@/utils/showToast";

type Props = {
  courseId: string;
  courseImg: string;
  courseName: string;
  courseDescription: string;
  students: number;
  numberOfVideo: number;
  coursePrice: number;
  courseRating: number;
};
const CourseCard = ({
  courseName,
  students,
  numberOfVideo,
  courseImg,
  coursePrice,
  courseRating,
  courseDescription,
  courseId,
}: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { courses, setCourses } = useCoursesStore();

  const handleDeleteCourse = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setCourses(
        courses.filter((course) => {
          return course._id !== courseId;
        })
      );
      showToast("success", "تم حذف الكورس بنجاح ");
    } catch (error) {
      //@ts-expect-error:fix agin
      showToast("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-3 drop-shadow-md border flex flex-col max-h-[80vh] justify-between px-3 py-4 rounded-lg bg-white dark:bg-[#1a1c3d] dark:border-gray-700 dark:shadow-none transition-colors duration-300">
        <Link href={`/course/${courseId}`}>
          <div className="w-full max-w-[705px] mx-auto aspect-[705/397] overflow-hidden rounded-xl">
            <Image
              src={courseImg}
              alt="Course Image"
              width={705}
              height={397}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="mt-3">
          <h1 className="apply-fonts-medium text-[16px] line-clamp-1 text-gray-800 dark:text-gray-100">
            {courseName}
          </h1>
        </div>
        <div className="">
          <h1 className="apply-fonts-normal text-[12px] line-clamp-1 text-courseTextSection dark:text-gray-400">
            {courseDescription}
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-between ">
          <div className="flex gap-1 items-center">
            <div className="text-mainColor dark:text-blue-400">
              <PlayLesson />
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {numberOfVideo}
              </p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="text-mainColor dark:text-blue-400">
              <PeopleOutlineOutlined />
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {students}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between my-2">
          <div className="py-1">
            <p
              className="font-medium text-gray-800 dark:text-gray-100"
              dir="ltr"
            >
              {coursePrice === 0 ? "مجانا" : coursePrice + "DA"}
            </p>
          </div>

          <div className="flex ">
            <Rating
              readOnly
              value={courseRating}
              precision={0.5}
              dir="ltr"
              className="text-courseIconsSection dark:text-yellow-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
          <button
            onClick={() => {
              setisOpen(!isOpen);
            }}
            className="xs:text-[12px] flex-1 xl:text-lg apply-fonts-normal bg-redColor hoverEle hover:bg-redColorHoverLight py-2 px-4 rounded-lg text-white dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
          >
            حذف
          </button>
          <Link
            href={`/edit-course/${courseId}`}
            className="text-center xs:text-[12px] flex-1 xl:text-lg apply-fonts-normal bg-mainColor hoverEle hover:bg-mainColorHoverLight py-2 px-4 rounded-lg text-white dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            تعديل
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full rounded-xl h-[100vh] px-4 my-3 z-10 bg-black/50 flex items-center justify-center dark:bg-black/80">
          <div className="py-2 apply-fonts-normal bg-white w-80 z-10 rounded-lg dark:bg-[#1a1c3d] transition-colors">
            <p className="text-center text-gray-800 dark:text-gray-200">
              هل أنت متأكد من حذف هذه الدورة
            </p>
            <div className="flex justify-center gap-4 mt-4 mb-2">
              <button
                onClick={() => {
                  setisOpen(false);
                }}
                className="apply-fonts-normal py-2 px-4 rounded-lg bg-mainColor hover:bg-mainColorHoverLight text-white hoverEle dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteCourse}
                className={`apply-fonts-normal py-2 px-4 rounded-lg ${
                  loading
                    ? "cursor-not-allowed bg-redColorHoverLight dark:bg-red-800"
                    : "bg-redColor hover:bg-redColorHoverLight dark:bg-red-700 dark:hover:bg-red-800"
                } text-white hoverEle transition-colors`}
              >
                {loading ? "جاري الحذف..." : "حذف الدورة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
