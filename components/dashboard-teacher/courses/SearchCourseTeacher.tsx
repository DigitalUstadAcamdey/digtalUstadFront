"use client";
import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

const SearchCourseTeacher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const [query, setQuery] = useState<string>(filter);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set("filter", query);

    // حدّث الرابط بالمعلمات الجديدة
    router.push(`?${params.toString()}`);
  }, [query, router]);
  return (
    <>
      <form>
        <div className="relative ">
          <input
            type="text"
            className="w-full py-2.5 px-3 rounded-xl border-courseTextSection bg-wygColor text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor dark:bg-[#1a1c3d] dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="إبحث ..."
          />
        </div>
      </form>
    </>
  );
};

export default SearchCourseTeacher;
