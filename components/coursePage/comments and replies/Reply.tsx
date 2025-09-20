"use client";
import { User } from "@/types/user";
import { ExpandMoreRounded, ExpandLessRounded } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";

interface Replay {
  _id: string;
  user: User;
  createdAt: string;
  text: string;
}

export const Reply = ({ replys }: { replys: Replay[] }) => {
  const [showComments, setShowComments] = useState<boolean>(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 text-sm font-medium transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
      >
        {showComments ? (
          <>
            <ExpandLessRounded className="text-lg" />
            <span className="apply-fonts-normal">
              إخفاء الردود ({replys.length})
            </span>
          </>
        ) : (
          <>
            <ExpandMoreRounded className="text-lg" />
            <span className="apply-fonts-normal">
              عرض الردود ({replys.length})
            </span>
          </>
        )}
      </button>

      {showComments && (
        <div className="mt-4 space-y-4 mr-8 border-r-2 border-[#B9BCFF]/30 pr-4 dark:border-r-gray-700 dark:pr-4">
          {replys.map((reply) => (
            <div
              key={reply._id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow duration-200 dark:from-[#21235a] dark:to-[#1a1c3d] dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <Image
                    src={reply.user.thumbnail || "/imgs/logoImg.png"}
                    alt="user-username"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-[#B9BCFF]/20 dark:ring-gray-700"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#45DA10] rounded-full border-2 border-white dark:border-[#1a1c3d]"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm dark:text-gray-200">
                      {reply.user.username}
                    </h4>
                    <span className="px-2 py-0.5 bg-[#3D45EE]/10 text-[#3D45EE] text-xs rounded-full font-medium dark:bg-blue-900/30 dark:text-blue-300">
                      مدرس
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {reply.createdAt.split("T")[0]}
                    </span>
                  </div>
                  <div
                    dir="rtl"
                    className="bg-white rounded-lg p-3 border-r-2 border-[#3D45EE]/20 dark:bg-gray-800 dark:border-r-gray-700"
                  >
                    <p className="apply-fonts-normal text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                      {reply.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
