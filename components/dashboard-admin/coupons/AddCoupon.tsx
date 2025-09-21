"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { colors } from "@/constants/colors";
import { X, Plus, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import showToast from "@/utils/showToast";
import { Coupon } from "@/types/coupon";

interface Course {
  _id: string;
  title: string;
}

interface AddCouponProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  coupons: Coupon[];
}

const AddCoupon = ({
  isOpen,
  onClose,
  setCoupons,
  coupons,
}: AddCouponProps) => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    courseId: "",
    maxUsage: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // جلب الكورسات عند فتح الـ modal
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses`
      );

      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error("خطأ في جلب الكورسات:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // إعداد البيانات للإرسال

      formData.discountValue = Number(formData.discountValue);
      console.log(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/coupons`,
        {
          code: formData.code,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          courseId: formData.courseId !== "" ? formData.courseId : null,
          maxUsage: formData.maxUsage === 0 ? null : formData.maxUsage,
        },
        {
          withCredentials: true,
        }
      );
      // إعادة تعيين النموذج
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        courseId: "",
        maxUsage: 0,
      });
      setCoupons([...coupons, response.data.coupon]);
      showToast("success", response.data.message);
      // onSuccess();
      // onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("خطأ في الشبكة:", error);
      showToast(
        "error",
        (axiosError.response?.data as { message: string })?.message ||
          "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* رأس الـ Modal */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold apply-fonts-normal text-gray-800 dark:text-gray-100"
            style={{ color: colors.mainColor }}
          >
            إضافة كوبون جديد
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* كود الكوبون */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كود الكوبون <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="مثال: SAVE20"
            />
          </div>

          {/* نوع الخصم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع الخصم <span className="text-red-500">*</span>
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="percentage">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>

          {/* قيمة الخصم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              قيمة الخصم <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder={
                formData.discountType === "percentage"
                  ? "مثال: 20 (للحصول على خصم 20%)"
                  : "مثال: 100 (للحصول على خصم 100 وحدة)"
              }
            />
          </div>

          {/* اختيار الكورس */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الكورس (اختياري)
            </label>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin ml-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  جاري تحميل الكورسات...
                </span>
              </div>
            ) : (
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">جميع الكورسات</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* الحد الأقصى للاستخدام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الحد الأقصى للاستخدام (اختياري)
            </label>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleInputChange}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="اتركه فارغاً للاستخدام غير المحدود"
            />
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.mainColor,
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isLoading ? "جاري الإنشاء..." : "إنشاء الكوبون"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
