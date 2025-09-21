import SignUp from "@/components/signup&login/SignUp";
import React from "react";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className=" h-screen">
      <SignUp />
      <ToastContainer />
    </div>
  );
};

export default page;
