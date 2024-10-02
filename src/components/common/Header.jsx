import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Header = ({ title, children, className, showVC, showDeDuplication }) => {
  return (
    <div
      className={`${className} w-full min-h-16 shadow px-8 flex items-center `}
    >
      {title && <p className="text-left font-semibold text-xl ">{title}</p>}

      {children}

      <div className="flex gap-x-2 absolute right-8 items-center">
        {showDeDuplication && (
          <Link to={""} className="flex justify-end">
            <Button className=" bg-gray-800 hover:bg-gray-900">De Duplication</Button>
          </Link>
        )}
        {showVC && (
          <Link to={"/vendor-consolidation"} className="flex justify-end">
            <Button className=" bg-gray-800 hover:bg-gray-900">Vendor Consolidation</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
