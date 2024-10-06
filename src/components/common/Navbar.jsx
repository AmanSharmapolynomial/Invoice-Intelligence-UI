import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft, ChevronLeft, Home, HomeIcon, LogOut, LucideHome } from "lucide-react";

const Navbar = ({ children, className }) => {
  const { pathname } = useLocation();
  const navigate=useNavigate();

  return (
    <div
      className={`${className} w-full h-[8vh]  flex items-center px-8 pl-14 shadow relative`}
    >

      {pathname!=="/"&&<ArrowLeft className="absolute left-4 pt-1 cursor-pointer" onClick={()=>pathname=="/home"?navigate("/"):window.history.back()}/>}
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
