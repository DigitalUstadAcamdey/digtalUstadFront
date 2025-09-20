"use client";
import { useLesson } from "@/store/lessonStore";
import showToast from "@/utils/showToast";
import { ReplyRounded, CloseRounded, SendRounded } from "@mui/icons-material";
import axios from "axios";
import React, { FormEvent, useState } from "react";

const AddReply = ({
  commentId,
  onClose,
}: {
  commentId: string;
  onClose: () => void;
}) => {
  const { lesson, setLesson } = useLesson();
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const addReply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comments/${commentId}/replies`,
        { text },
        { withCredentials: true }
      );
      const newReplies = res.data.comment.replies;
      setLesson({
        ...lesson,
        comments: lesson.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: newReplies }
            : comment
        ),
      });

      showToast("success", "تم إضافة الرد");

      setText("");
    } catch (error) {
      //@ts-expect-error : fix again
      showToast("error", error.response.data.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 dark:bg-black/80">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 dark:bg-[#1a1c3d] dark:shadow-none">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3D45EE] to-[#2E36C0] rounded-full flex items-center justify-center">
                <ReplyRounded className="text-white text-lg" />
              </div>
              <h2 className="apply-fonts-normal text-lg font-bold text-gray-800 dark:text-white">
                إضافة رد
              </h2>
            </div>
            <button
              onClick={onClose} // استخدام onClose هنا
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 dark:hover:bg-gray-800"
            >
              <CloseRounded className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={addReply} className="p-6 space-y-4">
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="apply-fonts-normal w-full resize-none border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-[#3D45EE] transition-colors duration-200 min-h-[120px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:border-[#3D45EE]"
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                <span>اكتب رداً مفيداً ومناسباً</span>
                <span>{text.length}/300</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="apply-fonts-normal flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className={`apply-fonts-normal flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loading || !text.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-gradient-to-r from-[#3D45EE] to-[#2E36C0] hover:from-[#2E36C0] hover:to-[#1E26A0] text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <SendRounded className="text-lg" />
                    إرسال الرد
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddReply;
