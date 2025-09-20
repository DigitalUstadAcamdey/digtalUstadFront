"use client";
import axios from "axios";
import React, { useState } from "react";
import {
  Calendar,
  MessageSquare,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import showToast from "@/utils/showToast";
import { useFaq } from "@/store/faqStore";
import { replie } from "@/types/faq";

type Props = {
  subject: string;
  faqId: string;
  date: string;
  replies: replie[];
};

const MsgCard = ({ subject, date, faqId, replies }: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const { faqs, setFaqs } = useFaq();

  const handleDeleteFaq = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/faq/${faqId}`,
        {
          withCredentials: true,
        }
      );
      showToast("success", "تم حذف الرسالة بنجاح");
      setFaqs(faqs.filter((f) => f._id !== faqId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      //@ts-expect-error:fix
      showToast("error", error.response.data.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {replies.length > 0 ? (
        replies.map((reply, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden dark:bg-[#1a1c3d] dark:border-gray-800 dark:shadow-none"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-mainColor/5 to-mainColor/10 px-6 py-4 border-b border-gray-100 dark:from-blue-900/10 dark:to-blue-900/20 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-mainColor dark:text-blue-400" />
                    <h3 className="text-lg font-semibold apply-fonts-normal text-gray-800 dark:text-gray-100">
                      رد على:{" "}
                      <span className="text-mainColor dark:text-blue-400">
                        {subject}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="apply-fonts-normal">
                      تاريخ الرد: {formatDate(date)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-400 hover:text-redColor hover:bg-red-50 rounded-lg transition-all duration-200 group dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-mainColor dark:bg-gray-800 dark:border-blue-600">
                <p className="text-gray-700 leading-relaxed apply-fonts-normal dark:text-gray-300">
                  {reply.message}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-[#1a1c3d] dark:border-gray-800 dark:shadow-none">
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-600 apply-fonts-normal mb-2 dark:text-gray-300">
              {subject}
            </h3>
            <p className="text-gray-500 apply-fonts-normal dark:text-gray-400">
              لم يتم الرد على هذا الاستفسار بعد
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400 dark:text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>تاريخ الإرسال: {formatDate(date)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:bg-black/80">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all dark:bg-[#1a1c3d] dark:shadow-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-redColor dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 apply-fonts-normal dark:text-white">
                  تأكيد الحذف
                </h2>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 apply-fonts-normal mb-6 text-center leading-relaxed dark:text-gray-300">
                هل أنت متأكد من أنك تريد حذف هذه الرسالة؟
                <br />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  لن تتمكن من التراجع عن هذا الإجراء
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 apply-fonts-normal dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteFaq}
                  className="flex-1 px-4 py-3 bg-redColor hover:bg-redColorHoverLight text-white rounded-lg font-medium transition-all duration-200 apply-fonts-normal flex items-center justify-center gap-2 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MsgCard;
