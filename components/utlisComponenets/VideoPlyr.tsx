"use client";
import React from "react";
import "plyr/dist/plyr.css";
type Props = {
  videoSrc: string;
};

const VideoPlyr = ({ videoSrc }: Props) => {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border-2 border-slate-200"
      style={{ paddingTop: "56.25%" }}
    >
      <iframe
        src={`${videoSrc}?autoplay=false&loop=false&muted=false&preload=false&responsive=false`}
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlyr;
