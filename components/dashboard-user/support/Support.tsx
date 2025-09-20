"use client";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { X, Plus, MessageCircle, Send } from "lucide-react";
import showToast from "@/utils/showToast";
import MsgCard from "./MsgCard";
import { useFaq } from "@/store/faqStore";
import Spinner from "@/components/spinner/Spinner";
import { useUserStore } from "@/store/userStore";
import { Faq } from "@/types/faq";

const socket = io(process.env.NEXT_PUBLIC_BACK_URL as string);

const Support = () => {
  const { loading } = useUserStore();
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showAddFaq, setShowAddFaq] = useState<boolean>(false);

  const { faqs, setFaqs } = useFaq();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!subject || !message) {
        showToast("error", "يجب ملء جميع الحقول!");
        return;
      }
      const faq = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/faq`,
        {
          subject: subject,
          description: message,
        },
        {
          withCredentials: true,
        }
      );

      socket.emit("newFaq", { subject: subject, description: message });

      setSubject("");
      setMessage("");
      showToast("success", "تم الإرسال بنجاح!");

      // تحديث الحالة بإضافة الاستفسار الجديد
      setFaqs([...faqs, faq.data.faq]);
      setShowAddFaq(false);
    } catch (error) {
      //@ts-expect-error:fix
      showToast("error", error.response.data.message);
    }
  };

  // جلب الاستفسارات عند تحميل المكون لأول مرة
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/faq/myFaqs`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        const data = await res.json();
        setFaqs(data.faqs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFaqs();
  }, [setFaqs]);

  // إضافة مستمع لـ socket.io
  useEffect(() => {
    // نستخدم الدالة الوظيفية للحصول على أحدث حالة لـ faqs
    socket.on("ticketReply", (data) => {
      setFaqs((prevFaqs) => {
        const faqIndex = prevFaqs.findIndex((faq:Faq) => faq._id === data.faqId);
        if (faqIndex !== -1) {
          const newFaqs = [...prevFaqs];
          newFaqs[faqIndex] = {
            ...newFaqs[faqIndex],
            replies: [...newFaqs[faqIndex].replies, data.reply],
          };
          return newFaqs;
        }
        return prevFaqs;
      });
    });

    return () => {
      socket.off("ticketReply");
    };
  }, [setFaqs]);

  if (loading) {
    return (
      <div className="bg-wygColor lg:custom-width rounded-xl px-4 py-5 h-[100vh] flex items-center justify-center dark:bg-[#05061b]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="lg:custom-width rounded-xl px-4 h-[93vh] relative overflow-y-scroll bg-gray-50 dark:bg-[#05061b] transition-colors duration-300">
      {/* Header */}
      <div className="w-full border-b-2 border-gray-200 pb-4 mt-4 flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10 dark:bg-[#05061b]/90 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-mainColor dark:text-blue-400" />
          <h1 className="apply-fonts-normal text-2xl font-bold text-gray-800 dark:text-gray-100">
            الردود والاستفسارات
          </h1>
        </div>
        <button
          onClick={() => setShowAddFaq(!showAddFaq)}
          className="apply-fonts-normal bg-mainColor hoverEle hover:bg-mainColorHoverLight px-6 py-3 rounded-lg text-white flex items-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-5 h-5" />
          إضافة استفسار جديد
        </button>
      </div>

      {/* Content */}
      <div className="py-6">
        {faqs && faqs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <MsgCard
                key={faq._id}
                faqId={faq._id}
                subject={faq.subject}
                date={faq.createdAt}
                replies={faq.replies}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h2 className="apply-fonts-medium text-xl text-gray-600 mb-2 dark:text-gray-300">
              لا توجد ردود حالياً
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              قم بإضافة استفسار جديد للحصول على المساعدة
            </p>
          </div>
        )}
      </div>

      {/* Add FAQ Modal */}
      {showAddFaq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:bg-black/80">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all dark:bg-[#1a1c3d] dark:shadow-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 apply-fonts-normal dark:text-white">
                إضافة استفسار جديد
              </h2>
              <button
                onClick={() => setShowAddFaq(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 apply-fonts-normal dark:text-gray-300">
                    موضوع الاستفسار
                  </label>
                  <input
                    type="text"
                    placeholder="اكتب موضوع استفسارك هنا..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-transparent transition-all duration-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 apply-fonts-normal dark:text-gray-300">
                    تفاصيل الاستفسار
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-transparent transition-all duration-200 text-gray-700 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-500"
                    placeholder="اكتب تفاصيل استفسارك بالتفصيل..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-mainColor hover:bg-mainColorHoverLight text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg apply-fonts-normal dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="w-5 h-5" />
                  إرسال الاستفسار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
