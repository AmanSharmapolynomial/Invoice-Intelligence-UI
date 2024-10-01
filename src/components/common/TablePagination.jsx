import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Input } from "../ui/input";

const TablePagination = ({ totalPages=0, pageIndex=0 }) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem className="flex justify-center items-center  h-10 ">
          <Input
            value={pageIndex+1}
            className="w-10 !shadow-none !text-base border-none focus:!border-none focus:!ring-0 focus:!outline-none"
          />{" "}
          <span className="pr-2">to</span>
          <span>{totalPages}</span>
        </PaginationItem>

        <PaginationItem className="cursor-pointer">
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
