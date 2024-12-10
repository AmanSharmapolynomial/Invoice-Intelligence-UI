import { ArrowLeft, LogOut, LucideHome } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import userStore from "../auth/store/userStore";
import settings from "@/assets/image/settings.svg";
import settings_white from "@/assets/image/settings_white.svg";
import moon from "@/assets/image/moon.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useThemeStore from "@/store/themeStore";
import { useEffect } from "react";
import useFilterStore from "@/store/filtersStore";

const Navbar = ({ children, className }) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { email, username, first_name, last_name, access_token, role } =
    userStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  let avatarUrl =
    `https://ui-avatars.com/api/?name=` +
    username?.[0] +
    `&background=7FCBA0&color=FFFFFF&font-size=0.6&bold=true`;
    const [searchParams,setSearchParams]=useSearchParams()
  
    const { filters } = useFilterStore();
    const appendFiltersToUrl = () => {
      const newParams = new URLSearchParams(searchParams);
  
      // Loop through each filter and append to the search params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        }
      });
  
      // Update searchParams with new filters
      setSearchParams(newParams);
    };
    useEffect(() => {
  if(pathname?.includes("invoice-details")||pathname?.includes("home")){
    appendFiltersToUrl();
    
  }
    }, []);
  return (
    <div
      id="navbar"
      className={`${className} z-30 !sticky top-0 w-full h-[3.75rem]   justify-between flex items-center pr-[1.25rem]  ${
        pathname == "/" ? "pl-[6.25rem]" : "pl-[1.25rem]"
      }  shadow relative bg-white dark:!bg-[#051C14]`}
      style={{boxShadow:"0px 2px 8px 0px rgba(0, 0, 0, 0.08)"}}
    >
      <div>
        <Link
          to={"/"}
          className="font-bold !text-[1.25rem] pl-3  font-poppins text-color/900 dark:text-[#FFFFFF]"
        >
          Invoice Intelligence Platform
        </Link>
      </div>
      {children}
      {/* {access_token && ( */}
      <div className="flex gap-x-8 items-center">
        <div className="flex items-center gap-x-3">
          <div>
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username?.[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-y-0 items-start justify-center">
            <p className="font-poppins font-medium text-sm text-textColor/900 dark:text-[#FFFFFF]">
              {username}
            </p>
            <span className="text-textColor/400 font-poppins capitalize font-normal text-xs  dark:text-textColor/200">
              {role}
            </span>
          </div>
        </div>
        <div className="flex gap-x-3 items-center">
          <Button className="bg-transparent shadow-none border h-[2.5rem] w-[2.5rem] hover:bg-transparent  p-0 border-textColor/200">
            <img src={settings} alt="" className="dark:hidden" />
            <img src={settings_white} alt="" className="dark:flex hidden" />
          </Button>
          <Button
            className="bg-primary shadow-none border h-[2.5rem] w-[2.5rem] p-0 border-primary"
            onClick={handleToggleTheme}
          >
            <img src={moon} alt="" />
          </Button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Navbar;
