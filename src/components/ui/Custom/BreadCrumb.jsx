import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import home from "@/assets/image/home.svg";
import home_white from "@/assets/image/home_white.svg";
import { ArrowLeft, MoveLeft } from "lucide-react";

const BreadCrumb = ({ crumbs = [], title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full items-center justify-between p-4" id="bread">
      <p className="text-textColor/950 font-poppins font-semibold text-xl dark:text-[#FFFFFF] flex items-center gap-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => navigate(-1)}
        />{" "}
        <span> {title || crumbs?.[crumbs?.length - 1]?.["label"]}</span>
      </p>
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center">
              <Link to="/home">
                <img src={home} alt="" className="-mt-0.5 dark:hidden" />
                <img
                  src={home_white}
                  alt=""
                  className="-mt-0.5 hidden dark:block"
                />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator
            className={"text-[#000000] dark:text-[#FFFFFF]"}
          />
          {crumbs?.map(({ label, path }, index) => {
            return (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink asChild>
                    <Link
                      to={path}
                      className={`${
                        index == crumbs?.length - 1 &&
                        "!text-[#1E7944] dark:!text-[#1E7944]"
                      } text-[#000000] !font-poppins !font-normal text-xs dark:!text-[#FFFFFF]`}
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== crumbs?.length - 1 && (
                  <BreadcrumbSeparator
                    className={"dark:!text-[#FFFFFF] dark:bg-[#FFFFFF]"}
                  />
                )}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
