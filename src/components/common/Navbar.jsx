import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const Navbar = ({ children,className }) => {
  return (
    <div className={`${className} w-full h-[8vh]  flex items-center px-8 shadow relative`}>
      <Link to={"/"} className="font-bold text-2xl pl-3">
        Invoice Intelligence Platform
      </Link>
      {children}

      <LogOut className="absolute right-10" />
    </div>
  );
};

export default Navbar;
