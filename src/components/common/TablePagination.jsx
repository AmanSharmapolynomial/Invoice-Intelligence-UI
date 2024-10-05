import React, { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Skeleton } from "../ui/skeleton";

const TablePagination = ({ totalPages, isFinalPage }) => {
  const [searchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [pageIndex, setPageIndex] = useState(currentPage);

  const updateParams = useUpdateParams();
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      updateParams({page: newPage});
      setPageIndex(newPage);
    }
  };

  const handleNextPage = () => {
    if (!isFinalPage) {
      const newPage = currentPage + 1;
      updateParams({page: newPage});
      setPageIndex(newPage);
    }
  };

  useEffect(() => {
    setPageIndex(currentPage);
  }, [currentPage]);
  return (
    <Pagination className={"!bg-[#1E7944] py-1.5 rounded-b-md"}>
      <PaginationContent>
        <PaginationItem className="cursor-pointer" onClick={handlePreviousPage}>
          <PaginationPrevious className={"text-[#FFFFFF]"} />
        </PaginationItem>
        <PaginationItem className="flex justify-center items-center h-10 z-20">
          <Input
            value={pageIndex}
            type="number"
            onChange={(e) => setPageIndex(e.target.value)}
            onBlur={() => {
              let newPageIndex = Math.max(
                1,
                Math.min(pageIndex, totalPages)
              );
              updateParams({page: newPageIndex});
              setPageIndex(newPageIndex);
            }}
            className="w-10 !shadow-none !text-sm font-medium remove-number-spinner text-[#FFFFFF] border-none focus:!border-[#FFFFFF] focus:!outline-none focus:!ring-[#FFFFFF]"
          />
          <Button className="!bg-transparent pt-2.5 w-fit shadow-none border-none font-medium text-[#FFFFFF] cursor-default">
            out of
          </Button>
          <Button className="!bg-transparent w-4 pt-2.5 shadow-none border-none font-medium text-[#FFFFFF] cursor-default">
            <span>{totalPages?totalPages:<Skeleton className={"w-7 h-7 bg-gray-300"}/>}</span>
          </Button>
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handleNextPage}>
          <PaginationNext className={"text-[#FFFFFF]"}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
