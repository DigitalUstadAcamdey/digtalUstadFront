"use client";
import { FacebookRounded, Instagram, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full  bg-mainColor text-white dark:bg-transparent/5 py-8 flex flex-col mt-12">
      <div className="container mx-auto flex items-center justify-between border-b-2 ">
        <Link
          href={`/`}
          className="flex items-center flex-row-reverse  md:gap-3 py-2"
        >
          <Image
            src="/imgs/dashboard-user-imgs/logoDashUser.png"
            alt="logoImg"
            loading="lazy"
            width={150}
            height={150}
          />
        </Link>
        <div className="flex gap-5 ">
          <h1 className="apply-fonts-normal sm:block xs:hidden">
            تابعنا على مواقع التواصل الاجتماعي
          </h1>
          <div className="flex gap-1">
            <Link href={"/"}>
              <FacebookRounded />
            </Link>
            <Link href={"/"}>
              <YouTube />
            </Link>
            <Link href={"/"}>
              <Instagram />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto  mt-10 flex justify-center">
        <p className="text-gray-200 text-sm  " dir="ltr">
          © Sience Academie. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
