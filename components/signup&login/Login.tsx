"use client";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import showToast from "@/utils/showToast";
import { useUserStore } from "@/store/userStore";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const UserSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [, setIsValid] = useState(false);

  const [password, setPassword] = useState("");
  const [, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { fetchUser } = useUserStore();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const result = UserSchema.pick({ password: true }).safeParse({
      password: value,
    });
    setErrors((prev) => ({
      ...prev,
      password: result.success ? undefined : result.error.issues[0].message,
    }));
    // تحقق من صحة كلمة المرور (مثلاً، يجب أن تكون أطول من 6 حروف)
    setIsPasswordValid(value.length >= 6);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const result = UserSchema.pick({ email: true }).safeParse({ email: value });
    setErrors((prev) => ({
      ...prev,
      email: result.success ? undefined : result.error.issues[0].message,
    }));
    // تحقق من صحة البريد باستخدام تعبير منتظم بسيط
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };
  const handleLoginWithGoogle = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = UserSchema.safeParse({ email, password });
    if (!result.success) {
      showToast("error", result.error.issues[0].message);
      setLoading(false);
      return;
    }
    try {
      const data = { email: email, password: password };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );

      const role =
        res.data.user.role === "student" ? "user" : res.data.user.role;
      await fetchUser();
      router.replace(`/dashboard-${role}`);
    } catch (error) {
      // @ts-expect-error: fix after time
      showToast("error", error.response.data.message || "حصل خطأ غير متوقع");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4  h-full w-full flex items-center justify-center flex-col">
      <Link
        href={"/"}
        className="flex items-center flex-row-reverse  md:gap-3 mb-4"
      >
        <Image
          src="/imgs/dashboard-user-imgs/logoDashUser.png"
          alt="logoImg"
          className="w-44 "
          width={200}
          height={200}
        />
      </Link>

      <form
        className="space-y-4 font-[sans-serif] max-w-md mx-auto  w-full "
        onSubmit={handleLogin}
      >
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="البريد الإلكتروني"
          className={`bg-gray-50 px-3 py-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainColor focus:border-mainColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            errors.email ? "border-red-700" : "border-green-400"
          }`}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
        {/* passsword */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="كلمة المرور"
            required
            className={`bg-gray-50 px-3 py-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainColor focus:border-mainColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
            ${errors.password ? "border-red-700" : "border-green-400"}`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-3 flex items-center text-gray-500"
          >
            {showPassword ? <VisibilityOff /> : <RemoveRedEye />}
          </button>
        </div>

        <div className="flex justify-between">
          <Link
            href={"/forget-password"}
            className="apply-fonts-normal text-[12px] group  "
          >
            <p className="group-hover:underline  text-gray-600 cursor-pointer">
              نسيت كلمة السر ؟
            </p>
          </Link>
          <Link
            href={"/signup"}
            className="apply-fonts-normal text-[12px] group  "
          >
            <p className="group-hover:underline  text-gray-600 cursor-pointer">
              ليس لديك حساب؟ سجل هنا
            </p>
          </Link>
        </div>

        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          disabled={loading}
          className={`
            apply-fonts-normal !my-4 rounded-full 
            w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80
            px-4 py-3 mx-auto block text-sm font-medium
            text-white hoverEle transition-all duration-200
            hover:bg-mainColorHoverLight hover:transform hover:scale-[1.02]
            ${loading ? "bg-mainColorHoverLight" : "bg-mainColor"}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin w-5 h-5" />
            </div>
          ) : (
            "تسجيل الدخول"
          )}
        </button>

        {/* زر Google */}
        <button
          type="button"
          onClick={handleLoginWithGoogle}
          disabled={loading}
          className="
            group apply-fonts-normal !mt-5
            flex-wrap
            w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80
            px-4 py-3 mx-auto text-sm font-medium
            bg-white border border-gray-300 rounded-full
            shadow-sm hover:shadow-md transition-all duration-200 
            hover:bg-gray-50 hover:transform hover:scale-[1.02]
            flex flex-row-reverse items-center justify-center gap-3
          "
        >
          {/* شعار Google الرسمي */}
          <div className="w-5 h-5 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>

          {/* النص */}
          <span className="text-gray-700">التسجيل بإستخدام Google</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
