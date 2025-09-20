"use client";
import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { io } from "socket.io-client";
import { User } from "@/types/user";
import { Comment } from "@/types/lesson";
import { useUserStore } from "@/store/userStore";
import { Bell, BellOff } from "lucide-react";
import Spinner from "@/components/spinner/Spinner";

const socket = io(process.env.NEXT_PUBLIC_BACK_URL);

type Notification = {
  message: string;
  comment: Comment;
  courseImage: string;
  courseId: string;
  user: User;
  lessonNumber: number;
};

const Notifications = () => {
  const { user, loading } = useUserStore();
  const [notification, setNotification] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on("newReply", (data) => {
      setNotification([...notification, data]);
    });
  }, [notification]);

  if (loading) {
    return (
      <div className="bg-white lg:custom-width rounded-xl px-6 py-8 h-[93vh] flex items-center justify-center shadow-sm">
        <Spinner />
      </div>
    );
  }

  const allNotifications = [...notification, ...user.notifications];
  const hasNotifications = allNotifications.length > 0;

  return (
    <div className=" lg:custom-width rounded-xl px-6 py-8 h-[93vh] overflow-hidden flex flex-col shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/30">
          <Bell className="w-6 h-6 text-mainColor dark:text-blue-400" />
        </div>
        <div>
          <h1 className="apply-fonts-medium text-2xl font-bold text-gray-800 dark:text-gray-100">
            إشعاراتك
          </h1>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
            {hasNotifications
              ? `لديك ${allNotifications.length} إشعار${
                  allNotifications.length > 1 ? "ات" : ""
                }`
              : "لا توجد إشعارات جديدة"}
          </p>
        </div>
      </div>

      {/* Notifications Content */}
      <div className="flex-1 overflow-y-auto">
        {hasNotifications ? (
          <div className="space-y-4">
            {/* Real-time notifications */}
            {notification.map((notif, index) => (
              <NotificationCard
                key={`realtime-${index}`}
                lessonNumber={notif.lessonNumber}
                notificationDate={notif.comment.createdAt.split("T")[0]}
                notificationImg={notif.courseImage}
                notificationName={notif.message}
                courseId={notif.courseId}
                isNew={true}
              />
            ))}

            {/* User notifications */}
            {user.notifications.map((notif, index) => (
              <NotificationCard
                key={`user-${index}`}
                lessonNumber={notif.lessonNumber}
                notificationDate={notif.createdAt.split("T")[0]}
                notificationImg={notif.courseImage}
                notificationName={notif.message}
                courseId={notif.courseId}
                isNew={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <BellOff className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد إشعارات
            </h2>
            <p className="text-gray-500 max-w-sm">
              ستظهر هنا جميع الإشعارات والتحديثات المهمة المتعلقة بدوراتك
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
