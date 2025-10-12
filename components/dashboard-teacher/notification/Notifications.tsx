"use client";
import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { useUserStore } from "@/store/userStore";
import { io } from "socket.io-client";
import { Notifcation } from "@/types/notification";
import Spinner from "@/components/spinner/Spinner";

const socket = io(process.env.NEXT_PUBLIC_BACK_URL as string);

const Notifications = () => {
  // get the old notification only by user_id and remove the user store
  const { user, loading } = useUserStore(); 
  const [liveNotifications, setLiveNotifications] = useState<Notifcation[]>([]);

  useEffect(() => {
    // استخدام التحديث الوظيفي لتجنب إعادة إنشاء الـ effect
    socket.on("newComment", (data) => {
      setLiveNotifications((prevNotifications) => [data, ...prevNotifications]);
    });

    // تنظيف الـ event listener عند إلغاء تحميل المكون
    return () => {
      socket.off("newComment");
    };
  }, []);

  if (loading) {
    return (
      <div className=" dark:bg-bodyDark lg:custom-width rounded-xl px-4 py-5 h-[100vh]">
        <Spinner />
      </div>
    );
  }

  // دمج الإشعارات الجديدة مع الإشعارات القديمة
  const allNotifications = [
    ...liveNotifications,
    ...(user.notifications || []), // remove this 
  ];

  return (
    <div className="lg:custom-width rounded-xl px-4 py-5 h-[94vh] overflow-y-scroll  dark:bg-bodyDark">
      <div className="mb-6">
        <h1 className="apply-fonts-normal text-2xl font-semibold text-slate-800 dark:text-textPrimary">
          إشعاراتك
        </h1>
      </div>

      <div className="space-y-4">
        {allNotifications.length > 0 ? (
          allNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              lessonNumber={notification.lessonNumber}
              notificationDate={notification.createdAt}
              notificationImg={notification.courseImage}
              notificationName={notification.message}
              courseId={notification.courseId}
              isNew={liveNotifications.some((n) => n._id === notification._id)} // تحديد ما إذا كان الإشعار جديداً
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center py-20">
            <h1 className="apply-fonts-normal text-xl text-slate-500 dark:text-textSecondary">
              لا توجد أي إشعارات حالياً.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
