import React from "react";
import Image from "next/image";

type NotificationCardProps = {
  message: string;
  courseImage: string;
  userName: string;
};

const NotificationCard = ({
  message,
  courseImage,
  userName,
}: NotificationCardProps) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm border border-gray-700 hover:bg-opacity-70 transition-colors duration-200">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={courseImage || "/images/default-course.png"}
          alt="Course Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-200">
          <span className="text-purple-400 font-bold">{userName}</span>{" "}
          {message}
        </p>
        <p className="text-xs text-gray-400 mt-1">دورة ديجيتال أستاذ</p>
      </div>
    </div>
  );
};

export default NotificationCard;
