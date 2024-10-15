import { ArrowLeft, LogOut, LucideHome } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = ({ children, className }) => {
  const { pathname } = useLocation();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  return (
    <div
      className={`${className} w-full h-[3.75rem]  flex items-center  pl-[6.25rem] shadow relative bg-white`}
    >
      {!["/", "/login"].includes(pathname) && (
        <ArrowLeft
          className="absolute left-4 pt-1 cursor-pointer"
          onClick={() =>
            pathname == "/home" ? navigate("/") : window.history.back()
          }
        />
      )}
      {!["/home", "/", "/login"].includes(pathname) && (
        <Link to={"/home"}>
          <LucideHome className="mt-0.5" />
        </Link>
      )}
      <Link
        to={"/"}
        className="font-bold !text-[1.25rem] pl-3  font-poppins text-color/900 "
      >
        Invoice Intelligence Platform
      </Link>
      {children}
      {token && (
        <Button
          className="absolute  right-10 h-10 w-16"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Navbar;
