"use client";
import { colors } from "@/constants/colors";
import { Coupon } from "@/types/coupon";
import React, { useState } from "react";
import { CouponCard } from "./CouponCard";
import { Plus, Tickets } from "lucide-react";
import AddCoupon from "./AddCoupon";
interface CouponsProps {
  couponsData: Coupon[] | [];
}
const Coupons = ({ couponsData }: CouponsProps) => {
  const [coupons, setCoupons] = useState(couponsData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const totalCoupons = coupons?.length;
  const activeCoupons = coupons?.filter((c) => {
    const unlimited = c.maxUsage === null || c.maxUsage === 0;
    return unlimited || c.usedCount < c.maxUsage;
  }).length;
  const expiredCoupons = totalCoupons - activeCoupons;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <>
      <div
        className="rounded-xl px-4 py-5 h-[93vh] overflow-y-scroll "
        dir="rtl"
      >
        {/* رأس الصفحة */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-mainColor rounded-xl p-3">
                <Tickets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="apply-fonts-normal text-3xl font-bold text-gray-800 dark:text-gray-100">
                  الكوبونات
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  إدارة الكوبونات
                </p>
              </div>
            </div>

            {/* زر إضافة كوبون جديد */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all hover:shadow-lg"
              style={{
                backgroundColor: colors.mainColor,
              }}
            >
              <Plus className="w-5 h-5" />
              إضافة كوبون جديد
            </button>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div
              className="text-2xl font-bold"
              style={{ color: colors.mainColor }}
            >
              {totalCoupons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              إجمالي الكوبونات
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div
              className="text-2xl font-bold"
              style={{ color: colors.successColor }}
            >
              {activeCoupons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              كوبونات نشطة
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div
              className="text-2xl font-bold"
              style={{ color: colors.redColor }}
            >
              {expiredCoupons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              كوبونات منتهية
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div
              className="text-2xl font-bold"
              style={{ color: colors.startTextColor }}
            >
              {totalUsage}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              إجمالي الاستخدامات
            </div>
          </div>
        </div>

        {/* عرض الكوبونات */}
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                setCoupons={setCoupons}
                coupons={coupons}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${colors.mainColor}20` }}
            >
              <Tickets
                className="w-8 h-8"
                style={{ color: colors.mainColor }}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              لا توجد كوبونات حتى الآن
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              ابدأ بإنشاء أول كوبون خصم
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all hover:shadow-lg"
              style={{
                backgroundColor: colors.mainColor,
              }}
            >
              <Plus className="w-5 h-5" />
              إنشاء كوبون جديد
            </button>
          </div>
        )}
      </div>

      {/* مودال إضافة كوبون */}
      <AddCoupon
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {}}
        setCoupons={setCoupons}
        coupons={coupons}
      />
    </>
  );
};

export default Coupons;
