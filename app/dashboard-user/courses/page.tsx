import Courses from "@/components/dashboard-user/courses/Courses";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="   h-full ">
      <Suspense
        fallback={
          <div className="w-full h-screen flex justify-center items-center">
            <Loader2 className="animate-spin text-mainColor" size={32} />
          </div>
        }
      >
        <Courses searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default page;
