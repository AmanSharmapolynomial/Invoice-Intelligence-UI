import useFilterStore from "@/store/filtersStore";
import useSidebarStore from "@/store/sidebarStore";
import useThemeStore from "@/store/themeStore";
import { Link, useLocation } from "react-router-dom";
import review_later_white from "@/assets/image/review_later_white.svg";
import review_later_black from "@/assets/image/review_later_black.svg";
import all_invoices_black from "@/assets/image/all_invoices_black.svg";
import all_invoices_white from "@/assets/image/all_invoices_white.svg";
import not_supported_white from "@/assets/image/not_supported_white.svg";
import not_supported_black from "@/assets/image/not_supported_black.svg";
import my_tasks_white from "@/assets/image/check_book_white.svg";
import my_tasks_black from "@/assets/image/check_book_black.svg";
import book_user_white from "@/assets/image/book_user_white.svg";
import book_user_black from "@/assets/image/book_user_black.svg";
import CustomTooltip from "../ui/Custom/CustomTooltip";
import { ChevronRight } from "lucide-react";
const Sidebar = ({ className }) => {
  const { expanded, setExpanded } = useSidebarStore();
  const { theme } = useThemeStore();
  const { pathname } = useLocation();
  const { setDefault } = useFilterStore();

  const options = [
    {
      path: "/home",
      icon: null,
      text: "All Invoices",
      image: theme === "light" ? all_invoices_black : all_invoices_white,
      hoverImage: all_invoices_white,
    },
    {
      path: "/my-tasks",
      icon: null,
      text: "My Tasks",
      image: theme === "light" ? my_tasks_black : my_tasks_white,
      hoverImage: my_tasks_white,
    },
    {
      path: "/review-later-tasks",
      icon: null,
      text: "Review Later Invoices",
      image: theme === "light" ? review_later_black : review_later_white,
      hoverImage: review_later_white,
    },
    {
      path: "/not-supported-documents",
      icon: null,
      text: "Not Supported Documents",
      image: theme === "light" ? not_supported_black : not_supported_white,
      hoverImage: not_supported_white,
    },
    {
      path: null,
      icon: null,
      text: "Vendor Consolidation",
      image: theme === "light" ? book_user_black : book_user_white,
      hoverImage: book_user_white,
    },
  ];

  const width = expanded === undefined ? "18rem" : expanded ? "18rem" : "3.75rem";

  return (
    <div className={`fixed top-0 left-0 h-screen overflow-y-auto transition-all z-50 duration-300 ease-in-out`} style={{ width }}>
      <div
        className="border h-full dark:border-white/10 bg-white dark:!bg-[#051C14] shadow-lg"
      >
        {expanded && (
          <div onClick={() => setExpanded()} className="cursor-pointer flex justify-end w-full">
            <Menu className="cursor-pointer absolute right-2 top-5 dark:text-white" />
          </div>
        )}

        <div className="mt-24 space-y-2 flex flex-col">
          {options.map((option, index) => {
            const isActive = pathname === option.path;
            return (
              <CustomTooltip content={!expanded && option?.text} key={index} right={"-20%"}>
                <Link
                  to={option.path !== pathname ? option.path : null}
                  onClick={() => setDefault()}
                  className={`group cursor-pointer flex items-center px-4 gap-2 py-3 text-sm font-normal transition-all duration-300 
                ${isActive ? "bg-primary text-white" : "text-black hover:bg-primary hover:text-white"}`}
                >
                  {option.icon ? (
                    <option.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                  ) : (
                    <div className="relative flex-shrink-0 w-5 h-5">
                      <img src={option.image} alt={option.text} className="absolute inset-0 w-full h-full transition-opacity duration-300" />
                      <img src={option.hoverImage} alt={option.text} className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`} />
                    </div>
                  )}

                  <span className={`transition-opacity duration-300 ease-in-out ${expanded ? "opacity-100" : "opacity-0"} dark:text-white`} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginLeft: expanded ? "0.5rem" : "0" }}>
                    {option.text}
                  </span>
                </Link>
              </CustomTooltip>
            );
          })}
        </div>
      </div>

      <div
        onClick={() => setExpanded()}
        className={`bg-primary w-5 h-5 rounded-r-sm cursor-pointer fixed top-16 left-[3.75rem] !z-20 flex justify-center items-center 
          ${expanded ? "opacity-0" : "opacity-100"}
          transition-opacity duration-300`}
      >
        <ChevronRight className="text-white h-3.5 w-3.5" />
      </div>
    </div>
  );
};

export default Sidebar;
