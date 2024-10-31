import React from "react";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, className }) => {
  return (
    <div className={`${className} mx-6 box-border flex flex-col gap-y-4 mt-2`}>
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
