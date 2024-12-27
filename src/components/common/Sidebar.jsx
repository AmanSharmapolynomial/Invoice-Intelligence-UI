import useSidebarStore from "@/store/sidebarStore";
import { ChevronRight, Menu } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import review_later_white from "@/assets/image/review_later_white.svg";
import review_later_black from "@/assets/image/review_later_black.svg";
import all_invoices_black from "@/assets/image/all_invoices_black.svg";
import all_invoices_white from "@/assets/image/all_invoices_white.svg";
import my_tasks_white from "@/assets/image/check_book_white.svg";
import my_tasks_black from "@/assets/image/check_book_black.svg";

import useThemeStore from "@/store/themeStore";

const Sidebar = () => {
  const { expanded, setExpanded } = useSidebarStore();
  const { theme } = useThemeStore();
  const { pathname } = useLocation();

  const options = [
    {
      path: "/home",
      icon: null,
      text: "All Invoices",
      image: theme === "light" ? all_invoices_black : all_invoices_white,
      hoverImage: all_invoices_white
    },
    {
      path: "/my-tasks",
      icon: null,
      text: "My Tasks",
      image: theme === "light" ? my_tasks_black : my_tasks_white,
      hoverImage: my_tasks_white
    },
    {
      path: "/review-later-tasks",
      icon: null,
      text: "Review Later Invoices",
      image: theme === "light" ? review_later_black : review_later_white,
      hoverImage: review_later_white
    },
    {
      path: null,
      icon: null,
      text: "Vendor Consolidation",
      image: theme === "light" ? review_later_black : review_later_white,
      hoverImage: review_later_white
    }
    // {
    //   path: "/custom",
    //   icon: null,
    //   text: "All Items",
    //   image: theme === "light" ? image : image_white,
    //   hoverImage: image_white
    // },
    // {
    //   path: "/custom",
    //   icon: null,
    //   text: "My Statistics",
    //   image: theme === "light" ? image : image_white,
    //   hoverImage: image_white
    // },
    // {
    //   path: "/custom",
    //   icon: null,
    //   text: "Calendar Management",
    //   image: theme === "light" ? image : image_white,
    //   hoverImage: image_white
    // },
    // {
    //   path: "/custom",
    //   icon: null,
    //   text: "Communication",
    //   image: theme === "light" ? image : image_white,
    //   hoverImage: image_white
    // },
    // {
    //   path: "/custom",
    //   icon: null,
    //   text: "Issue Reporting",
    //   image: theme === "light" ? image : image_white,
    //   hoverImage: image_white
    // }
  ];
  
  const width =
    expanded === undefined ? "18rem" : expanded ? "18rem" : "3.75rem";

  return (
    <div className="relative ">
      <div
        className="border h-screen w-full dark:border-white/10  overflow-y-auto sticky z top-0 dark:!bg-[#051C14] bg-white  transition-all z-50 duration-300 ease-in-out"
        style={{
          width: width,
          boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.08)"
        }}
      >
        {expanded ? (
          <div
            onClick={() => setExpanded()}
            className="cursor-pointer flex justify-end w-full"
          >
            <Menu className="cursor-pointer absolute right-2 top-5 dark:text-white" />
          </div>
        ) : null}

        <div className="mt-24 space-y-2">
          {options.map((option, index) => {
            const isActive = pathname === option.path;
            return (
              <Link
                to={option.path}
                key={index}
                className={`group cursor-pointer overflow-hidden flex items-center px-4 gap-2 py-3 text-sm font-normal font-poppins transition-all duration-300 ease-in-out 
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-black hover:bg-primary hover:text-white"
                }`}
              >
                {option.icon ? (
                  <option.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                  />
                ) : (
                  <div className="relative flex-shrink-0 w-5 h-5">
                    <img
                      src={option.image}
                      alt={option.text}
                      className="absolute inset-0 w-full h-full transition-opacity duration-300"
                    />
                    <img
                      src={option.hoverImage}
                      alt={option.text}
                      className={`${
                        isActive && "opacity-100"
                      } absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                )}

                <span
                  className={`transition-opacity duration-300 ease-in-out ${
                    expanded ? "opacity-100" : "opacity-0"
                  } dark:text-white`}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginLeft: expanded ? "0.5rem" : "0"
                  }}
                >
                  {option.text}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div
        onClick={() => setExpanded()}
        className={`bg-primary w-5 h-5 rounded-r-sm cursor-pointer  fixed  mt-1 top-16 left-[3.05%] !z-50 flex justify-center items-center 
          ${expanded ? "opacity-0" : "opacity-100"}
          transition-opacity duration-300 ease-in-out`}
      >
        <ChevronRight className="text-white h-3.5 w-3.5" />
      </div>
    </div>
  );
};

export default Sidebar;
