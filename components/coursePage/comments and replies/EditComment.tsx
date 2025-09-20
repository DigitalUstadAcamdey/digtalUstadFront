"use client";
import { useState } from "react";

const EditCommentModal = ({
  commentTitle,
  onClose,
  onConfirm,
  isLoading,
}: {
  commentTitle: string | null;
  onClose: () => void;
  onConfirm: (newComment: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const [editedComment, setEditedComment] = useState(commentTitle || "");
  const [internalLoading, setInternalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedComment.trim()) return;

    try {
      setInternalLoading(true);
      await onConfirm(editedComment.trim());
      onClose(); // إخفاء المودل عند النجاح
    } catch (error) {
      console.error("خطأ في تعديل التعليق:", error);
      // يمكن إضافة toast أو رسالة خطأ هنا
    } finally {
      setInternalLoading(false);
    }
  };

  const currentLoading = isLoading || internalLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-inner w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              تعديل التعليق
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            disabled={currentLoading}
          >
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              محتوى التعليق
            </label>
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              rows={4}
              placeholder="أدخل التعليق المحدث..."
              disabled={currentLoading}
              dir="rtl"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors disabled:opacity-50"
              disabled={currentLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-mainColor hover:bg-mainColorHoverDark text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={currentLoading || !editedComment.trim()}
            >
              {currentLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  جارٍ الحفظ...
                </>
              ) : (
                "تأكيد التعديل"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommentModal;
