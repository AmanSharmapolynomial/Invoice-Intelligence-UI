import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import slash from "@/assets/image/slash.svg";
import navigate_end from "@/assets/image/navigate_end.svg";
import navigate_start from "@/assets/image/navigate_start.svg";
import navigate_next from "@/assets/image/navigate_next.svg";
import navigate_back from "@/assets/image/navigate_back.svg";

const TablePagination = ({
  totalPages = null,
  isFinalPage = false,
  Key = "page",
  className
}) => {
  const [searchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get([`${Key}`])) || 1;

  const [pageIndex, setPageIndex] = useState(currentPage);

  const updateParams = useUpdateParams();
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      updateParams({ [`${Key}`]: newPage });
      setPageIndex(newPage);
    }
  };

  const handleNextPage = () => {
    if (!isFinalPage) {
      const newPage = currentPage + 1;
      updateParams({ [`${Key}`]: newPage });
      setPageIndex(newPage);
    }
  };
  const handleNavigateStart = () => {
    updateParams({ [`${Key}`]: 1 });
    setPageIndex(newPage);
  };
  const handleNavigateEnd = () => {
    updateParams({ [`${Key}`]: totalPages });
    setPageIndex(newPage);
  };
  useEffect(() => {
    setPageIndex(currentPage);
  }, [currentPage]);
  return (
    <Pagination
      className={`${className} !bg-[#1E7944] py-1.5 rounded-b-md flex items-center gap-x-4`}
    >
      <PaginationContent className="flex items-center gap-x-4">
        <PaginationItem
          className="cursor-pointer"
          onClick={handleNavigateStart}
        >
          <img src={navigate_start} alt="" className="h-[0.8rem]" />
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handlePreviousPage}>
          <img src={navigate_back} alt="" className="h-6 w-6" />
        </PaginationItem>
        <PaginationItem className="flex justify-center items-center h-10 z-20">
          <Input
            value={pageIndex}
            type="number"
            onChange={(e) => setPageIndex(e.target.value)}
            onBlur={() => {
              let newPageIndex = Math.max(1, Math.min(pageIndex, totalPages));
              updateParams({ [`${Key}`]: newPageIndex });
              setPageIndex(newPageIndex);
            }}
            className=" !shadow-none !text-sm font-medium remove-number-spinner text-[#000000] border-none focus:!border-[#FFFFFF] focus:!outline-none focus:!ring-[#FFFFFF] bg-[#FFFFFF]  flex justify-center items-center  w-[2.75rem]   h-[1.25rem] "
          />
          <img src={slash} alt="" className="h-4 w-6" />

          <Input
            disabled
            value={totalPages || 1}
            className=" !shadow-none !text-sm font-medium remove-number-spinner text-[#000000] border-none focus:!border-[#FFFFFF] focus:!outline-none focus:!ring-[#FFFFFF] bg-[#F6F6F6]  w-[2.75rem] max  h-[1.25rem]  disabled:!bg-[#F6F6F6] disabled:text-textColor/400"
          />
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handleNextPage}>
          <img src={navigate_next} alt="" className="h-6 w-6" />
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handleNavigateEnd}>
          <img src={navigate_end} alt="" className="h-[0.8rem]" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
