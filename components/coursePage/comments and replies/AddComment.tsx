"use client";
import { useLesson } from "@/store/lessonStore";
import showToast from "@/utils/showToast";
import { ChatBubbleOutlineOutlined, SendRounded } from "@mui/icons-material";
import axios from "axios";
import React, { FormEvent, useState } from "react";

interface Props {
  courseId: string;
}

const AddComment = ({ courseId }: Props) => {
  const { lesson, setLesson } = useLesson();
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handelAddComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}/lessons/${lesson?._id}`,
        { text },
        { withCredentials: true }
      );
      const newComment = res.data.comment;

      showToast("success", "تم إضافة التعليق بنجاح");
      setLesson({
        ...lesson,
        comments: [...(lesson?.comments || []), newComment],
      });
      setText("");
    } catch (error) {
      console.log(error);
      //@ts-expect-error:fix adding
      showToast("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-bodyDark dark:bg-opacity-100 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 border border-white/50 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#3D45EE] to-[#2E36C0] rounded-full flex items-center justify-center">
          <ChatBubbleOutlineOutlined className="text-white text-lg" />
        </div>
        <h3 className="apply-fonts-normal font-bold text-gray-800 dark:text-white">
          أضف تعليقك
        </h3>
      </div>

      <form onSubmit={handelAddComment} className="space-y-4">
        <div className="relative ">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="شاركنا رأيك في هذا الدرس..."
            className="w-full resize-none dark:bg-bodyDark apply-fonts-normal text-gray-700 dark:text-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-[#3D45EE] focus:outline-none transition-colors duration-200 min-h-[100px]"
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {text.length}/500
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={`apply-fonts-normal inline-flex items-center gap-2 rounded-xl py-3 px-6 font-medium transition-all duration-200 ${
              loading || !text.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#3D45EE] to-[#2E36C0] hover:from-[#2E36C0] hover:to-[#1E26A0] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                جاري النشر...
              </>
            ) : (
              <>
                <SendRounded className="text-lg" />
                نشر التعليق
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
