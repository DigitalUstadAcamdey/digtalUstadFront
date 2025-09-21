"use client";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import showToast from "@/utils/showToast";
import UpdatePassword from "@/components/utlisComponenets/UpdatePassword";
import Spinner from "@/components/spinner/Spinner";
import {
  DollarSign,
  Wallet,
  MessageCircle,
  Instagram,
  X,
  Phone,
  Clock,
} from "lucide-react";
import { User } from "@/types/user";

interface Props {
  userFetcher: User | null;
}

const Settings = ({ userFetcher }: Props) => {
  const router = useRouter();

  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user, setUser, loading } = useUserStore();

  const [name, setName] = useState(userFetcher?.username || "");
  const [email, setEmail] = useState(userFetcher?.email || "");
  const [numPhone, setNumPhone] = useState(userFetcher?.phoneNumber || "");

  const [image, setImage] = useState<File>();

  const contactMethods = [
    {
      platform: "واتساب",
      icon: MessageCircle,
      color: "green",
      number: "+213 555 123 456",
      description: "متوفر 24/7 للرد السريع",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      hoverColor: "hover:bg-green-100",
      darkBgColor: "dark:bg-green-900/30",
      darkBorderColor: "dark:border-green-800",
      darkTextColor: "dark:text-green-400",
      darkHoverColor: "dark:hover:bg-green-900/50",
    },
    {
      platform: "إنستاغرام",
      icon: Instagram,
      color: "purple",
      number: "@platform_support",
      description: "تواصل معنا عبر الرسائل المباشرة",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      hoverColor: "hover:bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30",
      darkBorderColor: "dark:border-purple-800",
      darkTextColor: "dark:text-purple-400",
      darkHoverColor: "dark:hover:bg-purple-900/50",
    },
  ];

  const handleContactClick = (method: (typeof contactMethods)[0]) => {
    if (method.platform === "واتساب") {
      window.open(
        `https://wa.me/213555123456?text=مرحباً، أريد شحن رصيد حسابي`,
        "_blank"
      );
    } else if (method.platform === "إنستاغرام") {
      window.open("https://instagram.com/platform_support", "_blank");
    }
  };
  useEffect(() => {
    if (userFetcher) {
      setUser(userFetcher);
    }
  }, [userFetcher, setUser]);
  if (loading) {
    return (
      <div className="bg-wygColor lg:custom-width rounded-xl px-4 py-5 h-[93vh] dark:bg-[#05061b] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handelupdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name?.trim()) {
      showToast("error", "الاسم مطلوب");
      return;
    }

    if (!email?.trim()) {
      showToast("error", "البريد الإلكتروني مطلوب");
      return;
    }
    if (!numPhone?.trim()) {
      showToast("error", "رقم الهاتف مطلوب");
      return;
    }
    const formData = new FormData();
    if (image) {
      formData.append("thumbnail", image);
    }
    formData.append("username", name);
    formData.append("email", email);
    formData.append("phoneNumber", numPhone);
    setLoadingUpdate(true);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/updateMe`,
        formData,
        {
          withCredentials: true,
        }
      );
      showToast("success", "تم تحديث البيانات بنجاح ");
      setUser(res.data.user);
      router.refresh();
    } catch (error) {
      console.log(error);
      //@ts-expect-error:fix error agin
      showToast("success", error.response.data.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      <div className="lg:custom-width rounded-xl px-4 py-5 h-[93vh] overflow-y-scroll  dark:bg-[#05061b] transition-colors duration-300">
        <div className="mb-5">
          <h1 className="apply-fonts-normal text-2xl font-semibold text-gray-800 dark:text-gray-100">
            إعدادات الحساب
          </h1>
        </div>

        {/* عرض رصيد الطالب */}
        {user && user.role === "student" && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm dark:from-green-900/30 dark:to-emerald-900/30 dark:border-green-800 dark:shadow-none transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/50">
                  <Wallet
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                </div>
                <div>
                  <h3 className="apply-fonts-normal text-lg font-semibold text-gray-800 mb-1 dark:text-gray-100">
                    رصيد الحساب
                  </h3>
                  <p className="apply-fonts-normal text-sm text-gray-600 dark:text-gray-400">
                    الرصيد المتاح للشراء
                  </p>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                  <span className="text-2xl font-bold text-green-700 dark:text-green-500">
                    {user.balance ? user.balance.toLocaleString("ar-DZ") : "0"}
                  </span>
                  <span className="text-lg font-medium text-green-600 dark:text-green-400">
                    DZD
                  </span>
                </div>
                <div className="text-xs text-gray-500 apply-fonts-normal dark:text-gray-400">
                  آخر تحديث: اليوم
                </div>
              </div>
            </div>

            {/* شريط إضافي للتفاعل */}
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.balance && user.balance > 0
                        ? "bg-green-400 animate-pulse"
                        : "bg-red-400"
                    }`}
                  ></div>
                  <span className="apply-fonts-normal text-sm text-gray-600 dark:text-gray-400">
                    {user.balance && user.balance > 0
                      ? "الرصيد متاح للاستخدام"
                      : "يرجى شحن الرصيد"}
                  </span>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="apply-fonts-normal bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105 dark:bg-green-700 dark:hover:bg-green-800"
                >
                  شحن الرصيد
                </button>
              </div>
            </div>
          </div>
        )}

        {user && (
          <form onSubmit={handelupdate}>
            {/* Image */}
            <div className="flex flex-col justify-center gap-3 mb-6">
              <label className="apply-fonts-normal block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                الصورة
              </label>
              <Image
                src={user.thumbnail ? user.thumbnail : "/imgs/personImg.png"}
                width={150}
                height={150}
                loading="lazy"
                alt="personImg"
                className="w-36 h-36 rounded-xl object-cover"
              />
              <div className="flex flex-col items-start w-36">
                <label
                  htmlFor="image"
                  className="cursor-pointer text-sm w-full text-center apply-fonts-normal text-white bg-mainColor hover:bg-mainColorHoverLight rounded-lg px-4 py-2 hoverEle dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  اختر صورة
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="apply-fonts-normal block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  الإسم
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  placeholder={user.username}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainColor focus:border-mainColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="apply-fonts-normal block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainColor focus:border-mainColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-2">
                <label className="apply-fonts-normal block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={numPhone}
                  placeholder={user.phoneNumber}
                  onChange={(e) => setNumPhone(e.target.value)}
                  name="price"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainColor focus:border-mainColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loadingUpdate}
                className={`apply-fonts-normal text-white ${
                  loadingUpdate
                    ? "animate-pulse bg-mainColorHoverLight cursor-not-allowed"
                    : "bg-mainColor"
                } hover:bg-mainColorHoverLight hoverEle focus:ring-4 focus:outline-none focus:ring-mainColor font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800`}
              >
                {loadingUpdate ? "جاري التعديل..." : "التعديل"}
              </button>
            </div>
          </form>
        )}

        {/* Edit Password*/}
        {user.googleId ? <></> : <UpdatePassword />}
      </div>

      {/* Modal وسائل التواصل */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/80 flex items-center justify-center z-50 p-4 transition-colors duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto dark:bg-[#1a1c3d] dark:shadow-none">
            {/* Header */}
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl text-white relative dark:from-green-700 dark:to-emerald-800"
              dir="rtl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center apply-fonts-normal">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  تواصل معنا لشحن الرصيد
                </h2>
                <p className="text-green-100 text-sm dark:text-green-300">
                  اختر وسيلة التواصل المفضلة لديك
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* وقت الاستجابة */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900/30 dark:border-blue-800">
                <div className="flex items-center gap-3" dir="rtl">
                  <Clock
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-blue-800 apply-fonts-normal dark:text-blue-300">
                      وقت الاستجابة
                    </h4>
                    <p className="text-blue-600 text-sm dark:text-blue-400">
                      عادة خلال 5-10 دقائق
                    </p>
                  </div>
                </div>
              </div>

              {/* وسائل التواصل */}
              <div className="space-y-4">
                <h3
                  className="font-semibold text-gray-800 mb-4 apply-fonts-normal dark:text-gray-100"
                  dir="rtl"
                >
                  وسائل التواصل المتاحة:
                </h3>

                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => handleContactClick(method)}
                      className={`${method.bgColor} ${method.borderColor} border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${method.hoverColor} hover:shadow-md hover:border-opacity-60 transform hover:scale-[1.02] ${method.darkBgColor} ${method.darkBorderColor} ${method.darkHoverColor}`}
                    >
                      <div className="flex items-center gap-4" dir="rtl">
                        <div
                          className={`${method.bgColor} p-3 rounded-full border ${method.borderColor} ${method.darkBgColor} ${method.darkBorderColor}`}
                        >
                          <IconComponent
                            className={method.textColor}
                            size={24}
                          />
                        </div>

                        <div className="flex-1">
                          <h4
                            className={`font-semibold apply-fonts-normal ${method.textColor} mb-1 dark:text-gray-100`}
                          >
                            {method.platform}
                          </h4>
                          <p className="text-gray-600 text-sm mb-1 dark:text-gray-300">
                            {method.number}
                          </p>
                          <p className="text-gray-500 text-xs apply-fonts-normal dark:text-gray-400">
                            {method.description}
                          </p>
                        </div>

                        <div
                          className={`${method.textColor} opacity-60 dark:text-gray-500`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ملاحظة إضافية */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-900/30 dark:border-amber-800">
                <div className="apply-fonts-normal" dir="rtl">
                  <h4 className="font-semibold text-amber-800 mb-2 dark:text-amber-400">
                    ملاحظة مهمة:
                  </h4>
                  <ul className="text-amber-700 text-sm space-y-1 dark:text-amber-300">
                    <li>• يرجى ذكر رقم حسابك عند التواصل</li>
                    <li>• المبلغ المطلوب شحنه</li>
                    <li>• طريقة الدفع المفضلة</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 rounded-b-2xl dark:bg-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium apply-fonts-normal dark:bg-gray-700 dark:hover:bg-gray-600"
                dir="rtl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
