"use client";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import showToast from "@/utils/showToast";
import UpdatePassword from "@/components/utlisComponenets/UpdatePassword";
import Spinner from "@/components/spinner/Spinner";
import { User } from "@/types/user";
interface Props {
  userFetcher: User | null;
}

const Settings = ({ userFetcher }: Props) => {
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(false);

  const loadingUser = useUserStore((state) => state.loading);

  const { user, setUser } = useUserStore();

  const [name, setName] = useState(userFetcher?.username || "");
  const [email, setEmail] = useState(userFetcher?.email || "");
  const [numPhone, setNumPhone] = useState(userFetcher?.phoneNumber || "");
  const [image, setImage] = useState<File>();
  useEffect(() => {
    if (userFetcher) setUser(userFetcher);
  }, [userFetcher, setUser]);

  if (loadingUser) {
    return (
      <div className="bg-wygColor lg:custom-width rounded-xl px-4 py-5 h-[100vh] ">
        <Spinner />
      </div>
    );
  }

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
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
    setloading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/updateMe`,
        formData,
        {
          withCredentials: true,
        }
      );
      showToast("success", "تم تحديث البيانات بنجاح ");
      router.refresh();
    } catch (error) {
      //@ts-expect-error:fix error agin
      showToast("error", error.response.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="lg:custom-width rounded-xl px-4 py-5 h-[93vh] overflow-y-scroll  dark:bg-[#05061b] transition-colors duration-300">
      <div className="mb-5">
        <h1 className="apply-fonts-normal text-2xl font-semibold text-gray-800 dark:text-gray-100">
          إعدادات الحساب
        </h1>
      </div>

      {user && (
        <form onSubmit={handleUpdate}>
          {/* Image */}
          <div className="flex flex-col justify-center gap-3 mb-6">
            <label className="apply-fonts-normal block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              الصورة
            </label>
            <Image
              src={user.thumbnail ? user.thumbnail : "/imgs/avatar.png"}
              width={150}
              height={150}
              alt="personImg"
              className="w-36 h-36 rounded-xl object-cover"
            />
            <div className="flex flex-col items-start w-36">
              <label
                htmlFor="image"
                className="cursor-pointer text-sm w-full text-center font-medium text-white bg-mainColor hover:bg-mainColorHoverLight rounded-lg px-4 py-2 hoverEle dark:bg-blue-700 dark:hover:bg-blue-800"
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
            {/*no need to edit when login with google */}
            {user.googleId ? (
              <></>
            ) : (
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
            )}

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
              disabled={loading}
              className={`apply-fonts-normal text-white ${
                loading
                  ? "animate-pulse bg-mainColorHoverLight cursor-not-allowed"
                  : "bg-mainColor"
              } hover:bg-mainColorHoverLight hoverEle focus:ring-4 focus:outline-none focus:ring-mainColor font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800`}
            >
              {loading ? "جاري التعديل..." : "التعديل"}
            </button>
          </div>
        </form>
      )}

      {/* Edit Password*/}
      {user.googleId ? <></> : <UpdatePassword />}
    </div>
  );
};

export default Settings;
