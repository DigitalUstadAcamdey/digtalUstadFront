"use client";
import showToast from "@/utils/showToast";
import { CloseOutlined } from "@mui/icons-material";
import axios, { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";

type UserData = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
  thumbnail: string;
};

const AddUser = () => {
  const [showAdd, setshowAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student",
    thumbnail:
      "https://res.cloudinary.com/dwnhria2i/image/upload/v1732471265/nt0nghzhiorwgrd4zrv9.png",
  });

  const handelAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData.password.trim().length < 6) {
      showToast("info", "يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users`,
        userData,
        {
          withCredentials: true,
        }
      );
      showToast("success", "تمت الإضافة بنجاح");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/users`, {
        credentials: "include",
      });
      setUserData({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "student",
        thumbnail:
          "https://res.cloudinary.com/dwnhria2i/image/upload/v1732471265/nt0nghzhiorwgrd4zrv9.png",
      });

      setshowAdd(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      showToast("error", err.response?.data?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setshowAdd(true)}
        className="apply-fonts-normal flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        إضافة مستخدم
      </button>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="apply-fonts-medium text-2xl font-bold text-gray-900">
                  إضافة مستخدم جديد
                </h2>
              </div>
              <button
                onClick={() => setshowAdd(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <CloseOutlined className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handelAddUser} className="space-y-5">
                {/* الاسم */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="apply-fonts-normal block text-sm font-semibold text-gray-700"
                  >
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    placeholder="أدخل اسم المستخدم"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
                    required
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="apply-fonts-normal block text-sm font-semibold text-gray-700"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    placeholder="أدخل البريد الإلكتروني"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
                    required
                  />
                </div>

                {/* كلمة المرور */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="apply-fonts-normal block text-sm font-semibold text-gray-700"
                    >
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      placeholder="أدخل كلمة المرور"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="passwordConfirm"
                      className="apply-fonts-normal block text-sm font-semibold text-gray-700"
                    >
                      تأكيد كلمة المرور
                    </label>
                    <input
                      type="password"
                      id="passwordConfirm"
                      name="passwordConfirm"
                      value={userData.passwordConfirm}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          passwordConfirm: e.target.value,
                        })
                      }
                      placeholder="أعد إدخال كلمة المرور"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* اختيار الدور */}
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="apply-fonts-normal block text-sm font-semibold text-gray-700"
                  >
                    دور المستخدم
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={(e) =>
                      setUserData({ ...userData, role: e.target.value })
                    }
                    className="apply-fonts-normal w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 bg-white"
                  >
                    <option value="student">طالب</option>
                    <option value="teacher">معلم</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>

                {/* Role Description */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-lg">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">معلومات عن الأدوار:</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <strong>طالب:</strong> يمكنه الوصول للمحتوى التعليمي
                        </li>
                        <li>
                          <strong>معلم:</strong> يمكنه إدارة المحتوى والطلاب
                        </li>
                        <li>
                          <strong>مدير:</strong> صلاحيات كاملة في النظام
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setshowAdd(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-3 font-medium rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        جاري الإضافة...
                      </div>
                    ) : (
                      "إضافة المستخدم"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
