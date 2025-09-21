"use client";
import { useCourse } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import showToast from "@/utils/showToast";
import { Rating } from "@mui/material";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";

const AddReview = ({ courseId }: { courseId: string }) => {
  const [rating, setRating] = useState<number>();
  const [content, setContent] = useState<string>("");
  const { user } = useUserStore();
  const { course, setCourse } = useCourse();

  useEffect(() => {
    const getCourse = async (courseId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}`
      );
      const data = await res.json();
      setCourse(data.course);
    };
    getCourse(courseId);
  }, [courseId, setCourse]);

  // section reviews (Add & delete)
  const handelAddReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("error", "يجب تسجيل الدخول أولا");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/reviews/${courseId}`,
        {
          rating,
          content,
        },
        {
          withCredentials: true,
        }
      );
      const newReivew = res.data.review;
      showToast("success", "تم اضافة التعليق بنجاح");

      setContent("");
      setRating(0);

      setCourse({
        ...course,
        reviews: [...(course.reviews || []), newReivew],
      });
    } catch (error) {
      //@ts-expect-error:fix agin
      showToast("error", error.response.data.message);
    }
  };
  return (
    <form
      className="flex w-full flex-col lg:flex-row items-center gap-3 my-5"
      onSubmit={handelAddReview}
    >
      <div className="flex-grow w-full">
        <label className="relative block">
          {/* Icons and Rating on the right for RTL layout */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Rating
              dir="ltr"
              precision={0.5}
              value={rating}
              onChange={(_, newValue) => {
                //@ts-expect-error:fix agin
                setRating(newValue);
              }}
              className="text-yellow-500 dark:text-yellow-400"
            />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400">
            <MessageCircle className="w-5 h-5" />
          </div>

          <input
            type="text"
            placeholder="أضف رأيك..."
            onChange={(e) => {
              setContent(e.target.value);
            }}
            // Add padding to the right to make space for the icons
            className="w-full  text-slate-700 bg-slate-100 rounded-xl px-4 pr-12 py-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-400"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full lg:w-fit apply-fonts-normal rounded-lg py-3 px-6 bg-mainColor hover:bg-mainColorHoverLight text-white transition-colors duration-300 dark:bg-mainColor dark:hover:bg-mainColorHoverLight"
      >
        نشر
      </button>
    </form>
  );
};

export default AddReview;
