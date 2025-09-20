"use client";

import dynamic from "next/dynamic";

// استيراد المكون الديناميكي
const VideoPlyr = dynamic(() => import("./VideoPlyr"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full aspect-video  border-2  rounded-xl flex justify-center items-center flex-col space-y-4">
      <div className="relative ">
        <div className="w-16 h-16 bg-mainColor/20 rounded-full animate-ping absolute"></div>
        <div className="w-16 h-16 bg-mainColor/40 rounded-full animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-mainColor"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 5v10l8-5-8-5z" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-mainColor font-semibold text-lg">تحميل المشغل</p>
        <p className="text-gray-500 text-sm mt-1">الرجاء الإنتظار...</p>
      </div>
    </div>
  ),
});

type Props = {
  videoId: string;
};

const DynamicVideoPlyr = ({ videoId }: Props) => {
  return (
    <VideoPlyr
      videoSrc={`${process.env.NEXT_PUBLIC_BUNNY_BASE_URL}/${process.env.NEXT_PUBLIC_VIDEO_LIBRARY}/${videoId}`}
    />
  );
};

export default DynamicVideoPlyr;
