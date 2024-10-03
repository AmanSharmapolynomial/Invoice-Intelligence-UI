import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, HomeIcon, LogOut, LucideHome } from "lucide-react";

const Navbar = ({ children, className }) => {
  const { pathname } = useLocation();

  return (
    <div
      className={`${className} w-full h-[8vh]  flex items-center px-8 shadow relative`}
    >
      {!["/home", "/"].includes(pathname) && (
        <Link to={"/home"}>
          <LucideHome className="mt-0.5" />
        </Link>
      )}
      <Link to={"/"} className="font-bold text-2xl pl-3">
        Invoice Intelligence Platform
      </Link>
      {children}

      <LogOut className="absolute right-10" />
    </div>
  );
};

export default Navbar;
