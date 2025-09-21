"use client";
import { Google, RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import showToast from "@/utils/showToast";
import * as z from "zod";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useUserStore } from "@/store/userStore";
const UserSchema = z
  .object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [, setPasswordIsMatch] = useState(false);

  const { fetchUser } = useUserStore();

  // errors
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
  }>({});

  const [, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setPasswordIsMatch(passwordConfirm === e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const result = UserSchema.pick({ email: true }).safeParse({ email: value });
    setErrors((prev) => ({
      ...prev,
      email: result.success ? undefined : result.error.issues[0].message,
    }));
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);

    const result = UserSchema.pick({ username: true }).safeParse({
      username: value,
    });
    setErrors((prev) => ({
      ...prev,
      username: result.success ? undefined : result.error.issues[0].message,
    }));
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    const result = UserSchema.safeParse({
      username,
      email,
      password,
      confirmPassword: value,
    });

    setErrors((prev) => ({
      ...prev,
      confirmPassword: result.success
        ? undefined
        : result.error.issues.find((i) => i.path[0] === "confirmPassword")
            ?.message,
    }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = UserSchema.safeParse({
      username,
      email,
      password,
      confirmPassword: passwordConfirm,
    });

    if (!result.success) {
      // اجمع الأخطاء من Zod وضعها في state
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof typeof errors;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return; // لا تكمل الإرسال
    }
    const formData = new FormData();

    if (image) {
      formData.append("thumbnail", image);
    }

    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("passwordConfirm", passwordConfirm);

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/signup`,
        formData,
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
      showToast("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupWithGoogle = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="container mx-auto py-4 h-full  w-full flex items-center justify-center flex-col ">
      <Link
        href={"/"}
        className="flex items-center flex-row-reverse  md:gap-3 mb-4"
      >
        <Image
          src="/imgs/dashboard-user-imgs/logoDashUser.png"
          alt="logoImg"
          className="w-44"
          width={200}
          height={200}
        />
      </Link>

      <form
        className="space-y-4 apply-fonts-normal max-w-md mx-auto  w-full "
        onSubmit={handleSignUp}
      >
        {/* username */}
        <div>
          <input
            type="tetx"
            value={username}
            onChange={handleUsernameChange}
            placeholder="إسم المستخدم"
            className={`  w-full px-4 py-3 bg-gray-100 text-md outline-none border-b-2 border-transparent  rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
            ${errors.username ? "border-red-700" : "border-green-400"} `}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}
        </div>
        {/* email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="البريد الإلكتروني"
            className={`w-full px-4 py-3 bg-gray-100 text-md outline-none border-b-2 border-transparent rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
  ${errors.email ? "border-red-700" : "border-green-400"}`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        {/* image */}
        {/* تحسين قسم اختيار الصورة */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الصورة الشخصية
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* منطقة عرض الصورة المحسنة */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700 shadow-lg">
                <Image
                  src={imageUrl || "/imgs/avatar.png"}
                  alt="الصورة الشخصية"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  width={96}
                  height={96}
                />
              </div>

              {/* مؤشر التحديث عند التحويم */}
              {imageUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              )}
            </div>

            {/* حقل اختيار الملف المحسن */}
            <div className="flex-1 w-full sm:w-auto">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];

                      // التحقق من نوع الملف
                      if (file.type.startsWith("image/")) {
                        setImage(file);
                        setImageUrl(URL.createObjectURL(file));
                      } else {
                        alert("يرجى اختيار ملف صورة صالح");
                      }
                    }
                  }}
                  accept="image/*"
                  required
                  className="sr-only"
                />

                <div
                  className={`
          w-full px-4 py-3 border-2 border-dashed rounded-lg
          transition-all duration-200 cursor-pointer
          hover:border-mainColor hover:bg-mainColor hover:bg-opacity-5
          ${
            imageUrl
              ? "border-green-400 bg-green-50 dark:bg-green-900 dark:bg-opacity-20"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          }
        `}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {imageUrl ? "اضغط لتغيير الصورة" : "اضغط لاختيار صورة"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, JPEG حتى 10MB
                    </p>
                  </div>
                </div>
              </label>

              {/* معلومات الصورة المختارة */}
              {image && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded text-xs">
                  <p className="text-blue-700 dark:text-blue-300">
                    📁 {image.name}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    📏 {(image.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* زر حذف الصورة */}
          {imageUrl && imageUrl !== "/imgs/avatar.png" && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImageUrl(null);
              }}
              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              حذف الصورة
            </button>
          )}
        </div>
        {/* password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="كلمة المرور"
            className={` w-full px-4 py-3 bg-gray-100 text-md outline-none border-b-2 border-transparent  rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
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

        <div>
          <input
            type="password"
            value={passwordConfirm}
            onChange={handleConfirmPasswordChange}
            placeholder="تأكيد كلمة المرور "
            className={` w-full px-4 py-3 bg-gray-100 text-md outline-none border-b-2 border-transparent  rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
            ${errors.confirmPassword ? "border-red-700" : "border-green-400"}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <Link
            href={"/login"}
            className="apply-fonts-normal text-[12px] group  "
          >
            <p className="group-hover:underline  text-gray-600 cursor-pointer">
              هل لديك حساب؟ إضغط هنا للتسجيل الدخول
            </p>
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`apply-fonts-normal !my-4 w-full px-4 py-2.5 mx-auto block text-sm bg-mainColor text-white hoverEle rounded hover:bg-mainColorHoverLight ${
            loading ? "bg-mainColorHoverLight" : "bg-mainColor"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin text-center w-full" size={22} />
          ) : (
            "التسجيل "
          )}
        </button>

        <button
          type="button"
          onClick={handleSignupWithGoogle}
          disabled={loading}
          className="group flex justify-between items-center  apply-fonts-normal !mt-5 w-full  px-4 py-2.5 mx-auto  text-sm border-mainColor border-2 hoverEle rounded hover:bg-mainColor hover:text-white"
        >
          <p>التسجيل بإستخدام Google </p>
          <Google className="" />
        </button>
      </form>
    </div>
  );
};

export default SignUp;
