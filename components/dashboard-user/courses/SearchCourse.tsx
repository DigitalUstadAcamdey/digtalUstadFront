"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchCourse = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const [query, setQuery] = useState<string>(search || "");

  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set("filter", query);

    // حدّث الرابط بالمعلمات الجديدة
    router.push(`?${params.toString()}`);
  }, [query, router]);
  return (
    <>
      <form className="flex items-center flex-grow ">
        <label className="sr-only">Search</label>
        <div className="relative w-full ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="apply-fonts-normal bg-wygColor block w-full ps-10 p-2.5 rounded-3xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor dark:bg-[#1a1c3d] dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-mainColor dark:focus:border-mainColor transition-colors duration-200"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="البحث..."
          />
        </div>
      </form>
    </>
  );
};

export default SearchCourse;
