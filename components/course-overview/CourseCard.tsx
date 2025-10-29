"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Facebook,
  Download,
  Globe,
  Users,
  Twitter,
  Instagram,
  Tag,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import showToast from "@/utils/showToast";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

type Props = {
  id: string;
  price: number;
  duration: string | number;
  studentNumber: number;
  courseLink: string;
};

const CourseCard = ({
  price,
  duration,
  studentNumber,
  courseLink,
  id,
}: Props) => {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/course-overview/${id}`;
  const { user, fetchUser } = useUserStore();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [couponCode, setCouponCode] = useState<string>("");
  const [priceState, setPriceState] = useState(price);
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [originalPrice] = useState(price);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const handelOpenAndColsed = () => {
    setIsOpen(!isOpen);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast("error", "يرجى إدخال كود الخصم");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/coupons/use/${id}`,
        { code: couponCode.trim() },
        { withCredentials: true }
      );

      setPriceState(res.data.finalPrice);
      setAppliedCoupon(couponCode.trim());
      setCouponCode("");
      showToast("success", "تم تطبيق كود الخصم بنجاح ✅");
    } catch (error) {
      //@ts-expect-error:fix again
      showToast("error", error.response?.data?.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setPriceState(originalPrice);
    setAppliedCoupon("");
    showToast("info", "تم إزالة كود الخصم");
  };

  const enrollmentCourse = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      showToast("error", "يجب تسجيل الدخول أولا");
      return;
    }
    try {
      const requestData: { couponCode?: string } = {};
      if (appliedCoupon.trim()) {
        requestData.couponCode = appliedCoupon.trim();
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/enrolled/${id}`,
        requestData,
        {
          withCredentials: true,
        }
      );
      showToast("success", res.data.message);
    } catch (error) {
      //@ts-expect-error:fix agin
      showToast("error", error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      {/* Mobile Toggle Button */}

      <button
        onClick={handelOpenAndColsed}
        className={`transition-all duration-300 ease-in  ${
          isOpen ? "xs:left-1  lg:hidden" : "xs:hidden  lg:hidden"
        } xs:fixed xl:hidden z-50 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:scale-105`}
      >
        {isOpen ? (
          <div className="flex items-center gap-3">
            <ChevronRight size={20} />

            <span className="apply-fonts-normal xs:hidden text-sm font-medium">
              تفاصيل الدورة
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="apply-fonts-normal  xs:hidden text-sm font-medium">
              تفاصيل الدورة
            </span>

            <ChevronLeft size={20} />
          </div>
        )}
      </button>

      {/* Course Card */}

      <div
        className={`transition-all duration-300 ease-in-out  ${
          isOpen
            ? " xs:-translate-x-full lg:translate-x-0"
            : "xs:max-w-[400px] sm:min-w-[400px] translate-x-0"
        } xs:fixed lg:relative z-10 xs:left-0 xs:bg-transparent  w-auto `}
      >
        <button
          onClick={handelOpenAndColsed}
          className={`transition-all duration-300 ease-in-out border  ${
            isOpen ? "xs:left-1  lg:hidden" : "xs:-translate-x-px lg:hidden"
          } xs:fixed xl:hidden z-50 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          {isOpen ? (
            <div className="flex items-center gap-3">
              <ChevronRight size={20} />

              <span className="apply-fonts-normal xs:hidden text-sm font-medium">
                تفاصيل الدورة
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="apply-fonts-normal  xs:hidden text-sm font-medium">
                تفاصيل الدورة
              </span>

              <ChevronLeft size={20} />
            </div>
          )}
        </button>
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden sticky top-2 dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
          {/* Price Header */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white p-4 text-center">
            <div className="text-3xl font-bold mb-2">
              {priceState === 0 ? (
                <span className="text-yellow-300">مجاناً الآن</span>
              ) : (
                <>
                  <span>{priceState}</span>

                  <span className="text-lg mr-2">DA</span>
                </>
              )}
            </div>

            {appliedCoupon && originalPrice !== priceState && (
              <div className="text-blue-200 text-sm line-through">
                السعر الأصلي: {originalPrice} DA
              </div>
            )}

            {priceState !== 0 && (
              <div className="text-blue-100 text-sm">سعر خاص لفترة محدودة</div>
            )}
          </div>

          {/* Course Stats */}

          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/50">
            <div className="space-y-4">
              {/* lesson duration */}
              {/* <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-2 border-slate-300 dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900/30">
                    <Clock
                      size={20}
                      className="text-orange-600 dark:text-orange-400"
                    />
                  </div>

                  <span className="apply-fonts-normal font-medium text-slate-700 dark:text-gray-300">
                    مدة الدورة
                  </span>
                </div>

                <span className="font-bold text-slate-800 dark:text-gray-100">
                  {duration}
                </span>
              </div> */}

              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-2 border-slate-300 dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                    <Users
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>

                  <span className="apply-fonts-normal font-medium text-slate-700 dark:text-gray-300">
                    عدد الطلاب
                  </span>
                </div>

                <span className="font-bold text-slate-800 dark:text-gray-100">
                  {studentNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Applied Coupon Display */}

          {appliedCoupon && (
            <div className="mx-6 mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl dark:bg-green-900/30 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/50">
                    <Check
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>

                  <div>
                    <span className="apply-fonts-normal text-sm font-medium text-green-800 dark:text-green-300">
                      كود الخصم المطبق
                    </span>

                    <div className="text-green-700 font-bold text-sm dark:text-green-400">
                      {appliedCoupon}
                    </div>
                  </div>
                </div>

                <button
                  onClick={removeCoupon}
                  className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                  title="إزالة كود الخصم"
                >
                  <X size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          )}

          {/* Coupon Code Input */}

          <div
            className={`${
              user.enrolledCourses?.some((c) => c._id === id) ||
              appliedCoupon ||
              user.role === "teacher" ||
              user.role === "admin"
                ? "hidden"
                : "block"
            } p-6 border-t-2 border-slate-300 dark:border-gray-700`}
          >
            <div className="mb-4">
              <label className="apply-fonts-normal block text-sm font-medium text-slate-700 mb-2 dark:text-gray-300">
                كود الخصم (اختياري)
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Tag
                      size={18}
                      className="text-slate-400 dark:text-gray-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="أدخل كود الخصم"
                    className="w-full pr-10 pl-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                  />
                </div>

                <button
                  onClick={applyCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-md hover:shadow-lg dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 dark:disabled:from-gray-700 dark:disabled:to-gray-800"
                >
                  {isApplyingCoupon ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="apply-fonts-normal text-sm">تطبيق</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enrollment Button */}

          <div className="p-6 pt-0">
            {user.role === "teacher" || user.role === "admin" ? (
              <div className="text-center py-4 text-slate-500 bg-slate-100 rounded-xl dark:text-gray-400 dark:bg-gray-800">
                <span className="apply-fonts-normal">
                  أنت {user.role === "teacher" ? "مدرس" : "مدير"} في المنصة
                </span>
              </div>
            ) : (
              <button
                onClick={enrollmentCourse}
                disabled={user.enrolledCourses?.some((c) => c._id === id)}
                className={`apply-fonts-normal w-full p-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  user.enrolledCourses?.some((c) => c._id === id)
                    ? "bg-green-500 cursor-not-allowed dark:bg-green-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800"
                }`}
              >
                {user.enrolledCourses?.some((c) => c._id === id)
                  ? "أنت منضم بالفعل ✓"
                  : "الانضمام للدورة"}
              </button>
            )}
          </div>

          {/* Course Features */}

          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-t-2 border-slate-300 dark:from-gray-800/50 dark:to-blue-900/50 dark:border-gray-700">
            <h3 className="apply-fonts-medium font-bold text-slate-800 mb-4 flex items-center gap-2 dark:text-gray-100">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              تتضمن هذه الدورة
            </h3>

            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border-2 border-slate-300 hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-none">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                  <Clock
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                <span className="apply-fonts-normal text-sm text-slate-700 font-medium dark:text-gray-300">
                  وصول للدورة مدى الحياة
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border-2 border-slate-300 hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-none">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                  <Download
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>

                <span className="apply-fonts-normal text-sm text-slate-700 font-medium dark:text-gray-300">
                  تحميل مجاني للملفات والتمارين
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border-2 border-slate-300 hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-none">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                  <Globe
                    size={16}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>

                <span className="apply-fonts-normal text-sm text-slate-700 font-medium dark:text-gray-300">
                  الدورة أونلاين 100%
                </span>
              </div>
            </div>
          </div>

          {/* Share Course */}

          <div className="p-6 border-t-2 border-slate-300 dark:border-gray-700">
            <h3 className="apply-fonts-medium font-bold text-slate-800 mb-4 flex items-center gap-2 dark:text-gray-100">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              شارك هذه الدورة
            </h3>

            <div className="flex gap-3 justify-center">
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  link
                )}`}
                target="_blank"
                className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg dark:bg-blue-900/30 dark:hover:bg-blue-600 dark:text-blue-400"
              >
                <Facebook size={20} />
              </Link>

              <Link
                href={`https://twitter.com/intent/tweet?url=${link}`}
                target="_blank"
                className="flex items-center justify-center w-12 h-12 bg-sky-100 hover:bg-sky-500 text-sky-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg dark:bg-sky-900/30 dark:hover:bg-sky-500 dark:text-sky-400"
              >
                <Twitter size={20} />
              </Link>

              <Link
                href={`/${courseLink}`}
                className="flex items-center justify-center w-12 h-12 bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg dark:bg-pink-900/30 dark:hover:bg-pink-600 dark:text-pink-400"
              >
                <Instagram size={20} />
              </Link>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);

                  showToast("success", "تم نسخ الرابط ✅");
                }}
                className="flex items-center justify-center w-12 h-12 bg-slate-100 hover:bg-slate-600 text-slate-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
