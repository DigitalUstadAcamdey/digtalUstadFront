"use client";
import showToast from "@/utils/showToast";
import { CloseOutlined } from "@mui/icons-material";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";

type Props = {
  userName: string;
  userEmail: string;
  userJoinDate: string | undefined;
  userImg: string;
  userRole: string; // Admin, Teacher, student
  userId: string;
  userStatus: boolean;
};

const AdminCardPage = ({
  userName,
  userJoinDate,
  userEmail,
  userImg,
  userRole,
  userId,
  userStatus,
}: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [isActive, setisActive] = useState<boolean>();


  const handelDeleteUser = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/users`, {
        credentials: "include",
      });
      const data = await res.json();
      
      setShowDeleteModal(false);
      showToast("success", "تم حذف هذا المستخدم بنجاح");
    } catch (error) {
      //@ts-expect-error:fix
      showToast("error", error.response.data.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handelActiveAccount = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoadingEdit(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/${userId}`,
        { active: isActive },
        {
          withCredentials: true,
        }
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/users`, {
        credentials: "include",
      });
      const data = await res.json();
      
     
      showToast("success", "تم تغيير حالة الحساب بنجاح");
      setShowEditModal(false);
    } catch (error) {
      //@ts-expect-error:fix
      showToast("error", error.response.data.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <>
      <div className="p-6 h-full flex flex-col">
        {/* Header with Role Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                userRole === "أدمن"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {userRole}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                userStatus
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {userStatus ? "نشط" : "غير نشط"}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Image
              src={userImg}
              width={80}
              height={80}
              alt="userImg"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                userStatus ? "bg-green-400" : "bg-gray-400"
              }`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="apply-fonts-normal text-lg font-semibold text-gray-900 truncate">
              {userName}
            </h3>
            <p className="text-sm text-gray-500 truncate">{userEmail}</p>
            <p className="text-sm text-gray-400 mt-1">
              انضم في: {userJoinDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            تعديل
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            حذف
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="p-6 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="apply-fonts-normal text-xl font-bold text-gray-900 mb-2">
                تأكيد الحذف
              </h3>
              <p className="apply-fonts-normal text-gray-600 mb-6">
                هل أنت متأكد من حذف المستخدم{" "}
                <span className="font-bold text-gray-900">({userName})</span>؟
                <br />
                <span className="text-sm text-red-600">
                  هذا الإجراء لا يمكن التراجع عنه
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handelDeleteUser}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                >
                  حذف نهائي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="apply-fonts-normal text-lg font-bold text-gray-900">
                  تعديل حالة الحساب
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <CloseOutlined className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={userImg}
                    width={50}
                    height={50}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="apply-fonts-normal font-semibold text-gray-900">
                      {userName}
                    </h4>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="apply-fonts-normal block text-sm font-medium text-gray-700 mb-3">
                  حالة الحساب
                </label>
                <select
                  onChange={(e) => setisActive(e.target.value === "true")}
                  className="apply-fonts-normal w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">
                    {userStatus ? "نشط حالياً" : "غير نشط حالياً"}
                  </option>
                  <option value="true" className="apply-fonts-normal">
                    تفعيل الحساب
                  </option>
                  <option value="false" className="apply-fonts-normal">
                    إلغاء تفعيل الحساب
                  </option>
                </select>
              </div>

              <button
                onClick={handelActiveAccount}
                disabled={loadingEdit}
                className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  loadingEdit
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                }`}
              >
                {loadingEdit ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    جاري التحديث...
                  </div>
                ) : (
                  "تحديث حالة الحساب"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCardPage;
