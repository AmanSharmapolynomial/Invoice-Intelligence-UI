import React from "react";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, className }) => {
  return (
    <div className={className}>
      <Toaster />
      {children}
    </div>
  );
};

export default Layout;
