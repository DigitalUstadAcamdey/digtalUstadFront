"use client";
import showToast from "@/utils/showToast";
import { X, Edit3, Trash2, CheckCircle, XCircle, Wallet } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { useSearchUser } from "@/store/searchUser";

type Props = {
  studentName: string;
  studentEmail: string;
  studentJoinDate: string | undefined;
  studentId: string;
  studentImg: string;
  studentStatus: boolean;
};

const StudentCard = ({
  studentName,
  studentId,
  studentJoinDate,
  studentEmail,
  studentImg,
  studentStatus,
}: Props) => {
  const { setUsers } = useSearchUser();

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showAddBalance, setShowAddBalance] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(studentStatus);
  const [balanceAmount, setBalanceAmount] = useState<string>("");

  // خيارات المبالغ السريعة
  const quickAmounts = [500, 1000, 5000];

  const handleQuickAmount = (amount: number) => {
    setBalanceAmount(amount.toString());
  };

  const handleActiveAccount = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/${studentId}`,
        { active: isActive },
        { withCredentials: true }
      );
      showToast("success", "تم تغيير حالة الحساب بنجاح");
      setShowEdit(false);
      window.location.reload(); // لتحديث البيانات
    } catch (error) {
      //@ts-expect-error:fix
      showToast("error", error.response?.data?.message || "حدث خطأ في التحديث");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      showToast("error", "يرجى إدخال مبلغ صحيح أكبر من الصفر");
      return;
    }
    setLoadingBalance(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/${studentId}`,
        { balance: parseFloat(balanceAmount) },
        { withCredentials: true }
      );
      showToast(
        "success",
        `تم إضافة ${balanceAmount} DZD إلى رصيد الطالب بنجاح`
      );
      setBalanceAmount("");
      setShowAddBalance(false);
    } catch (error) {
      //@ts-expect-error:fix Agine
      showToast("error", error.response?.data?.message);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleDeleteUser = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoadingDelete(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/${studentId}`,
        { withCredentials: true }
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users?page=1&limit=5`,
        { credentials: "include" }
      );
      const data = await res.json();
      setUsers(data.users);
      showToast("success", "تم حذف الحساب بنجاح");
      setShowDelete(false);
    } catch (error) {
      // @ts-expect-error:fix
      showToast("error", error.response?.data?.message || "حدث خطأ في الحذف");
    } finally {
      setLoadingDelete(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 dark:hover:bg-gray-800 transition-colors duration-200 overflow-auto">
          {/* Student Info */}
          <div className="col-span-4 flex items-center gap-4">
            <div className="relative">
              <Image
                src={studentImg}
                width={60}
                height={60}
                alt="Student Avatar"
                className="w-15 h-15 rounded-full border-3 border-white dark:border-gray-800 shadow-lg object-cover"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                  studentStatus ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="apply-fonts-normal text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                {studentName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {studentEmail}
              </p>
            </div>
          </div>

          {/* Join Date */}
          <div className="col-span-2 text-center">
            <p className=" text-gray-700 dark:text-gray-300 font-medium text-sm">
              {formatDate(studentJoinDate)}
            </p>
          </div>

          {/* Status */}
          <div className="col-span-2 flex justify-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                studentStatus
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-700"
              }`}
            >
              {studentStatus ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  نشط
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  غير نشط
                </>
              )}
            </span>
          </div>

          {/* Actions */}
          <div className="col-span-4 flex justify-center gap-2">
            <button
              onClick={() => setShowAddBalance(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
              title="إضافة رصيد"
            >
              <Wallet className="w-4 h-4 mr-1" />
              رصيد
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              title="تعديل الحساب"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              تعديل
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
              title="حذف الطالب"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              حذف
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 m-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Image
                src={studentImg}
                width={50}
                height={50}
                alt="Student Avatar"
                className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-md object-cover"
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  studentStatus ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="apply-fonts-normal text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {studentName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                    {studentEmail}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    انضم في: {formatDate(studentJoinDate)}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    studentStatus
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                  }`}
                >
                  {studentStatus ? "نشط" : "غير نشط"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => setShowAddBalance(true)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200"
                >
                  <Wallet className="w-4 h-4 mr-1" />
                  رصيد
                </button>
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  تعديل
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Balance Modal */}
      {showAddBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white apply-fonts-normal">
                    إضافة رصيد للطالب
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddBalance(false);
                    setBalanceAmount("");
                  }}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Image
                  src={studentImg}
                  width={50}
                  height={50}
                  alt="Student"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="apply-fonts-normal font-semibold text-gray-800 dark:text-gray-100">
                    {studentName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {studentEmail}
                  </p>
                </div>
              </div>

              {/* Quick Amount Options */}
              <div className="mb-6">
                <label className="block apply-fonts-normal text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  اختيار سريع للمبلغ
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleQuickAmount(amount)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        balanceAmount === amount.toString()
                          ? "bg-green-500 text-white border-green-500 shadow-md"
                          : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {amount.toLocaleString()} DZD
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="mb-6">
                <label className="block apply-fonts-normal text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  أو أدخل مبلغ مخصص
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="أدخل المبلغ"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full p-4 pr-16 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 text-lg transition-all duration-200"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      DZD
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  الحد الأدنى: 1 DZD • سيتم إضافة هذا المبلغ إلى الرصيد الحالي
                </p>
              </div>

              {/* Amount Preview */}
              {balanceAmount && parseFloat(balanceAmount) > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 dark:bg-green-700 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
                        {parseFloat(balanceAmount).toLocaleString()} DZD
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        المبلغ الذي سيتم إضافته للطالب
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddBalance(false);
                    setBalanceAmount("");
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 apply-fonts-normal font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddBalance}
                  disabled={
                    loadingBalance ||
                    !balanceAmount ||
                    parseFloat(balanceAmount) <= 0
                  }
                  className={`flex-1 px-4 py-3 text-white bg-green-600 dark:bg-green-700 rounded-xl hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200 apply-fonts-normal font-medium ${
                    (loadingBalance ||
                      !balanceAmount ||
                      parseFloat(balanceAmount) <= 0) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loadingBalance ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-gray-300 border-t-transparent"></div>
                      جاري الإضافة...
                    </div>
                  ) : (
                    "إضافة الرصيد"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit3 className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white apply-fonts-normal">
                    تعديل حالة الطالب
                  </h2>
                </div>
                <button
                  onClick={() => setShowEdit(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Image
                  src={studentImg}
                  width={50}
                  height={50}
                  alt="Student"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="apply-fonts-normal font-semibold text-gray-800 dark:text-gray-100">
                    {studentName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {studentEmail}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block apply-fonts-normal text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  حالة الحساب
                </label>
                <select
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 apply-fonts-normal text-lg transition-all duration-200"
                  value={isActive.toString()}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                >
                  <option value="true" className="apply-fonts-normal">
                    تنشيط الحساب ✓
                  </option>
                  <option value="false" className="apply-fonts-normal">
                    إلغاء تنشيط الحساب ✗
                  </option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 apply-fonts-normal font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleActiveAccount}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white bg-blue-600 dark:bg-blue-700 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 apply-fonts-normal font-medium ${
                    loading && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-gray-300 border-t-transparent"></div>
                      جاري التحديث...
                    </div>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-red-600 dark:bg-red-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white apply-fonts-normal">
                    تأكيد الحذف
                  </h2>
                </div>
                <button
                  onClick={() => setShowDelete(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-600 dark:text-red-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="apply-fonts-normal font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    حذف الطالب نهائياً
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    هذا الإجراء لا يمكن التراجع عنه
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6">
                <p className="apply-fonts-normal text-red-800 dark:text-red-300">
                  هل أنت متأكد من حذف الطالب{" "}
                  <span className="font-semibold">{studentName}</span> نهائياً؟
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  سيتم حذف جميع البيانات والمعلومات المرتبطة بهذا الطالب
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 apply-fonts-normal font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loadingDelete}
                  className={`flex-1 px-4 py-3 text-white bg-red-600 dark:bg-red-700 rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200 apply-fonts-normal font-medium ${
                    loadingDelete && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loadingDelete ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-gray-300 border-t-transparent"></div>
                      جاري الحذف...
                    </div>
                  ) : (
                    "حذف نهائياً"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentCard;
