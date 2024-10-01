import React from "react";
import Navbar from "./Navbar";
const Layout = ({ children ,className}) => {
  return (
    

      <div className={className}>

      {children}
      </div>
    
  );
};

export default Layout;
