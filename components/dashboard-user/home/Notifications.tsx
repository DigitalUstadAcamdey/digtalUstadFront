"use client";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationCard from "./NotificationCard";
import { useUserStore } from "@/store/userStore";
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
  // get the old notification only by user_id and remove the user store
  const { user, loading } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on("newReply", (data) => {
      setNotifications([...notifications, data]);
    });
  }, [notifications]);
  const allNotifications = [...notifications, ...user.notifications 
    //remove this 
  ].slice(
    0,
    5
  );

  if (loading) {
    return (
      <div className="bg-white lg:custom-width rounded-xl px-6 py-8 h-[93vh] flex items-center justify-center shadow-sm">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className="flex-1 space-y-3  custom-scrollbar pr-2">
        {allNotifications.length > 0 ? (
          allNotifications.map((note, index) => (
            <NotificationCard
              key={index}
              message={note.message}
              courseImage={note.courseImage}
              userName={note.user.username}
            />
          ))
        ) : (
          <h1 className="apply-fonts-normal h-full w-full flex justify-center items-center ">
            لا توجد أي إشعارات
          </h1>
        )}
      </div>
      {allNotifications.length > 0 && (
        <a
          href="/dashboard-user/notification"
          className="mt-4 text-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          عرض كل الإشعارات
        </a>
      )}
    </>
  );
};

export default Notifications;
