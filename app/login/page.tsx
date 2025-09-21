import React from "react";
import Login from "../../components/signup&login/Login";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className=" h-screen">
      <Login />
      <ToastContainer />
    </div>
  );
};

export default page;
