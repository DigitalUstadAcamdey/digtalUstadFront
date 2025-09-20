"use client";
import showToast from "@/utils/showToast";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const UpdatePassword = () => {
  const [loadingUpdatePassword, setloadingUpdatePassword] =
    useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // this is new Password
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloadingUpdatePassword(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/updatePassword`,
        { currentPassword, password, passwordConfirm },
        {
          withCredentials: true,
        }
      );
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");

      showToast("success", "تم تغيير كلمة المرور بنجاح");
    } catch (error) {
      // @ts-expect-error: fix error agin
      showToast("error", error.response.data.message);
    } finally {
      setloadingUpdatePassword(false);
    }
  };

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    passwordConfirm: false,
  });
  const toggleShowPassword = (label: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <h2 className="apply-fonts-medium my-5 text-gray-800 dark:text-gray-100">
        تحديث كلمة المرور
      </h2>
      <form className="space-y-4" onSubmit={handleUpdatePassword}>
        {/* current password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="apply-fonts-normal block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            كلمة المرور القديمة
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPassword.currentPassword ? "text" : "password"}
              placeholder="*********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor  bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={() => toggleShowPassword("currentPassword")}
            >
              {showPassword.currentPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* new password */}
        <div>
          <label
            htmlFor="password"
            className="apply-fonts-normal block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword.password ? "text" : "password"}
              placeholder="*********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor  bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={() => toggleShowPassword("password")}
            >
              {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* confirm password */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="apply-fonts-normal block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            تأكيد كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              id="passwordConfirm"
              type={showPassword.passwordConfirm ? "text" : "password"}
              placeholder="*********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor  bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={() => toggleShowPassword("passwordConfirm")}
            >
              {showPassword.passwordConfirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`py-2 px-4 text-white font-medium rounded-md shadow-sm ${
            loadingUpdatePassword
              ? "bg-mainColorHoverLight cursor-not-allowed dark:bg-blue-900/50"
              : "bg-mainColor hoverEle hover:bg-mainColorHoverLight dark:bg-blue-700 dark:hover:bg-blue-800"
          } focus:outline-none focus:ring-4 focus:ring-mainColor focus:ring-offset-4 dark:focus:ring-blue-800`}
        >
          {loadingUpdatePassword
            ? "جاري تحديث كلمة السر ..."
            : "تحديث كلمة السر "}
        </button>
      </form>
    </>
  );
};

export default UpdatePassword;
