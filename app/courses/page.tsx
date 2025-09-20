import NavBarCourse from "@/components/course-overview/NavBarCourse";
import Courses from "@/components/courses/Courses";
import React from "react";

const page = () => {
  return (
    <div className="py-3 container mx-auto ">
      <NavBarCourse />
      <Courses />
    </div>
  );
};

export default page;
