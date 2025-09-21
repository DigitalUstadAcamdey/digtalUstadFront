"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { colors } from "@/constants/colors";
import { Coupon } from "@/types/coupon";
import {
  Percent,
  DollarSign,
  Calendar,
  Users,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import showToast from "@/utils/showToast";

interface CouponCardProps {
  coupon: Coupon;
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  coupons: Coupon[];
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  couponCode: string;
  isLoading: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  couponCode,
  isLoading,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="text-center">
          {/* أيقونة التحذير */}
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${colors.redColor}20` }}
          >
            <AlertTriangle
              className="w-8 h-8"
              style={{ color: colors.redColor }}
            />
          </div>

          {/* النص */}
          <h3
            className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2"
            dir="rtl"
          >
            تأكيد الحذف
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6" dir="rtl">
            هل أنت متأكد من حذف الكوبون{" "}
            <span className="font-bold" style={{ color: colors.mainColor }}>
              {couponCode}
            </span>
            ؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>

          {/* الأزرار */}
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.redColor }}
            >
              {isLoading ? "جاري الحذف..." : "نعم، احذف"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CouponCard = ({
  coupon,
  setCoupons,
  coupons,
}: CouponCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // حساب حالة الكوبون
  const isActive = coupon.maxUsage === 0 || coupon.usedCount < coupon.maxUsage;

  const usagePercentage =
    coupon.maxUsage > 0 ? (coupon.usedCount / coupon.maxUsage) * 100 : 0;

  // تحديد لون الحالة
  const statusColor = isActive ? colors.successColor : colors.redColor;
  const statusText = isActive ? "نشط" : "منتهي";

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/coupons/${coupon._id}`,
        {
          withCredentials: true,
        }
      );

      setShowDeleteModal(false);
      setCoupons(coupons.filter((c) => c._id !== coupon._id));

      showToast("success", response.data.message);
    } catch (error) {
      console.error("خطأ في الشبكة:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
        {/* رأس الكوبون */}
        <div className="mb-4" dir="rtl">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-lg font-bold"
              style={{ color: colors.mainColor }}
            >
              {coupon.code}
            </h3>
            <div className="flex gap-3  items-center">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{
                  backgroundColor: `${
                    coupon.maxUsage === null ? colors.mainColor : statusColor
                  }`,
                }}
              >
                {coupon.maxUsage === null ? `غير محدود` : statusText}
              </span>
              {/* زر الحذف */}
              <button
                onClick={handleDeleteClick}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف الكوبون"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* معلومات الخصم */}
          <div className="flex items-center gap-2 text-gray-600">
            {coupon.discountType === "percentage" ? (
              <Percent className="w-4 h-4" />
            ) : (
              <DollarSign className="w-4 h-4" />
            )}
            <span className="font-medium">
              خصم {coupon.discountValue}
              {coupon.discountType === "percentage" ? "%" : " وحدة"}
            </span>
          </div>
        </div>

        {/* تفاصيل الاستخدام */}
        <div className="space-y-3" dir="rtl">
          {/* عداد الاستخدام */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>الاستخدامات</span>
            </div>
            <div className="font-medium">
              {coupon.maxUsage
                ? `${coupon.usedCount} / ${coupon.maxUsage}`
                : `غير محدود/${coupon.usedCount}`}
            </div>
          </div>

          {/* شريط التقدم (إذا كان هناك حد أقصى) */}
          {coupon.maxUsage > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(usagePercentage, 100)}%`,
                  backgroundColor:
                    usagePercentage >= 100
                      ? colors.redColor
                      : colors.successColor,
                }}
              />
            </div>
          )}

          {/* معلومات الكورس */}
          {coupon.courseId && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">مخصص لكورس معين</span>
            </div>
          )}

          {/* تاريخ الإنشاء */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              تم الإنشاء:{" "}
              {new Date(coupon.createdAt).toLocaleDateString("en-US")}
            </span>
          </div>
        </div>
      </div>

      {/* مودال تأكيد الحذف */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        couponCode={coupon.code}
        isLoading={isDeleting}
      />
    </>
  );
};
