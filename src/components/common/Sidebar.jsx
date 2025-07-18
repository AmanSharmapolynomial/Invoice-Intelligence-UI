import useFilterStore from "@/store/filtersStore";
import useSidebarStore from "@/store/sidebarStore";
import useThemeStore from "@/store/themeStore";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import review_later_white from "@/assets/image/review_later_white.svg";
import review_later_black from "@/assets/image/review_later_black.svg";
import all_invoices_black from "@/assets/image/all_invoices_black.svg";
import all_invoices_white from "@/assets/image/all_invoices_white.svg";
import not_supported_white from "@/assets/image/not_supported_white.svg";
import not_supported_black from "@/assets/image/not_supported_black.svg";
import my_tasks_white from "@/assets/image/check_book_white.svg";
import my_tasks_black from "@/assets/image/check_book_black.svg";
import flagged_white from "@/assets/image/flagged_white.svg";
import flagged_black from "@/assets/image/flagged_black.svg";
import book_user_white from "@/assets/image/book_user_white.svg";
import book_user_black from "@/assets/image/book_user_black.svg";
import { ChevronRight, ChevronDown, ChevronUp, Menu, Info } from "lucide-react";
import userStore from "../auth/store/userStore";
import { useGetSidebarCounts } from "./api";
import CustomTooltip from "../ui/Custom/CustomTooltip";

const Sidebar = ({ className }) => {
  const { expanded, setExpanded } = useSidebarStore();
  const { theme } = useThemeStore();
  const { pathname } = useLocation();
  const { role } = userStore();
  const { setDefault, filters } = useFilterStore();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { data, isLoading } = useGetSidebarCounts({
    invoice_type: filters?.invoice_type,
    start_date: filters?.start_date,
    end_date: filters?.end_date,
    clickbacon_status: filters?.clickbacon_status,
    restaurant: filters?.restaurant,
    auto_accpepted: filters?.auto_accepted,
    rerun_status: filters?.rerun_status,
    invoice_detection_status: filters?.invoice_detection_status,
    human_verified: filters?.human_verified,
    human_verification_required: filters?.human_verification,
    vendor: filters?.vendor,
    sort_order: filters?.sort_order,
    restaurant_tier: filters?.restaurant_tier,
    rejected: filters?.rejected,
    extraction_source: filters?.extraction_source
  });

  const options = [
    {
      path: "/home",
      text: "All Invoices",
      image: theme === "light" ? all_invoices_black : all_invoices_white,
      hoverImage: all_invoices_white,
      count: data?.all_invoices
    },
    {
      path: "/flagged-invoices",
      text: "All Flagged Documents",
      image: theme === "light" ? flagged_black : flagged_white,
      hoverImage: flagged_white,
      count: data?.all_flagged_documents
    },
    {
      path: "/my-tasks",
      text: "My Tasks",
      image: theme === "light" ? my_tasks_black : my_tasks_white,
      hoverImage: my_tasks_white,
      count: data?.my_tasks?.invoices + data?.my_tasks?.flagged_documents,
      children: [
        {
          path: "/my-tasks",
          text: "Invoices",
          count: data?.my_tasks?.invoices
        },
        {
          path: "/unsupported-documents",
          text: "Flagged Documents",
          count: data?.my_tasks?.flagged_documents
        }
      ]
    },
    {
      path: "/review-later-tasks",
      text: "Review Later Invoices",
      image: theme === "light" ? review_later_black : review_later_white,
      hoverImage: review_later_white,
      count: data?.review_later
    },
    {
      path: "/not-supported-documents",
      text: "Not Supported Documents",
      image: theme === "light" ? not_supported_black : not_supported_white,
      hoverImage: not_supported_white,
      count: data?.not_supported
    },
    {
      path: null,
      text: "Vendor Consolidation",
      image: theme === "light" ? book_user_black : book_user_white,
      hoverImage: book_user_white
    }
  ];

  const width = expanded ? "18rem" : "3.75rem";

  useEffect(() => {
    const matchingIndex = options.findIndex((option) =>
      option.children?.some((child) => child.path === pathname)
    );
    if (matchingIndex !== -1) {
      setOpenSubmenu(matchingIndex);
    }
  }, [pathname]);

  const handleToggle = (index, hasChildren) => {
    if (hasChildren) {
      setOpenSubmenu(openSubmenu === index ? null : index);
    } else {
      setOpenSubmenu(null);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen overflow-y-auto transition-all z-50 duration-300 ease-in-out`}
      style={{ width }}
    >
      <div className="border h-full dark:border-white/10 bg-white dark:!bg-[#051C14] shadow-lg">
        {expanded && (
          <div
            onClick={() => setExpanded(true)}
            className="cursor-pointer flex justify-end w-full"
          >
            <Menu className="cursor-pointer absolute right-2 top-5 dark:text-white" />
          </div>
        )}

        <div className="mt-24 space-y-2 flex flex-col">
          {options?.map((option, index) => {
            const isActive =
              pathname === option.path ||
              option.children?.some((child) => child.path === pathname);
            const isSubmenuOpen = openSubmenu === index;
            const hasChildren = option.children?.length > 0;

            const handleClick = (e) => {
              if (hasChildren) {
                e.preventDefault();
                if (!expanded) {
                  setExpanded(true);
                  setTimeout(() => handleToggle(index, true), 150);
                } else {
                  handleToggle(index, true);
                }
              } else {
                if (pathname === option.path) {
                  e.preventDefault();
                  return;
                }
                setDefault();
              }
            };

            const Wrapper = option.path ? Link : "div";

            return (
              <div
                key={index}
                className={`${
                  role !== "admin" &&
                  option?.text === "Not Supported Documents" &&
                  "hidden"
                }`}
              >
                <Wrapper
                  to={option.path || "#"}
                  onClick={handleClick}
                  className={`group relative cursor-pointer flex items-center px-4 gap-2 py-3 text-sm font-normal transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-black hover:bg-primary hover:text-white"
                  }`}
                >
                  {!expanded && typeof option?.count == "number" && option?.count!==0&& !isLoading&&(
                    <span className="absolute right-0.5  top-0.5 z-50  text-[10px] text-white bg-red-500 flex items-center justify-center w-7 pb-0.5 rounded-full">
                      {" "}
                      {/* <div className=" bg-red-500 rounded-full  h-6 w-6 pl-1 pt-[0.05rem] text-[10px] " > */}

                        {option?.count && option?.count >100?"99+":option?.count }
                      {/* </div> */}
                    </span>
                  )}
                  <div className="relative flex-shrink-0 w-5 h-5">
                    <img
                      src={option?.image}
                      alt={option?.text}
                      className="absolute inset-0 w-full h-full transition-opacity duration-300"
                    />
                    <img
                      src={option?.hoverImage}
                      alt={option?.text}
                      className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? "opacity-100" : ""
                      }`}
                    />
                  </div>

                  {expanded && (
                    <div className="flex items-center justify-between w-full ml-2 dark:text-white">
                      <span className="truncate">{option?.text}</span>
                      <div className="flex items-center gap-2">
                        {typeof option?.count === "number" && (
                          <CustomTooltip content={"Unverified Documents Count"}>
                            <span className="text-xs bg-red-500 text-white dark:bg-white/10 dark:text-white px-2 py-1 rounded-full">
                              {option?.count}
                            </span>
                          </CustomTooltip>
                        )}
                        {hasChildren &&
                          (isSubmenuOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </div>
                  )}
                </Wrapper>

                {hasChildren && isSubmenuOpen && expanded && (
                  <div className="ml-8 space-y-1">
                    {option.children.map((child, idx) => (
                      <Link
                        to={child.path}
                        onClick={() => setDefault()}
                        key={idx}
                        className={`block text-sm py-3 mt-1 px-2 hover:bg-primary hover:text-white ${
                          pathname === child.path
                            ? "bg-primary text-white"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{child?.text}</span>
                          {typeof child?.count === "number" && (
                            <CustomTooltip
                              content={"Unverified Documents Count"}
                            >
                              <span className="ml-2 text-xs bg-red-500 text-white dark:bg-white/10 dark:text-white px-2 mr-2.5 py-0.5 rounded-full">
                                {child?.count}
                              </span>
                            </CustomTooltip>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
