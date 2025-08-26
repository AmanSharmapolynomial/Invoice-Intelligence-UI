import navigate_back from "@/assets/image/navigate_back.svg";
import navigate_next from "@/assets/image/navigate_next.svg";
import navigate_end from "@/assets/image/navigate_end.svg";
import navigate_start from "@/assets/image/navigate_start.svg";
import slash from "@/assets/image/slash.svg";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import useFilterStore from "@/store/filtersStore";

const TablePagination = ({
  totalPages = null,
  isFinalPage = false,
  Key = "page",
  className
}) => {
  const [searchParams] = useSearchParams();
  const {filters,setFilters}=useFilterStore()

  const currentPage = parseInt(searchParams.get([`${Key}`])) || 1;

  const [pageIndex, setPageIndex] = useState(currentPage);

  const updateParams = useUpdateParams();
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      updateParams({ [`${Key}`]: newPage });
      setPageIndex(newPage);
      setFilters({...filters,page:newPage})
    }
  };

  const handleNextPage = () => {
    if (!isFinalPage) {
      const newPage = currentPage + 1;
      updateParams({ [`${Key}`]: newPage });
      setPageIndex(newPage);
      setFilters({...filters,page:newPage})
    }
  };
  const handleNavigateStart = () => {
    updateParams({ [`${Key}`]: 1 });
    setPageIndex(1);
    setFilters({...filters,page:1})
  };
  const handleNavigateEnd = () => {
    updateParams({ [`${Key}`]: totalPages });
    setPageIndex(totalPages);
    setFilters({...filters,page:totalPages})
  };
  useEffect(() => {
    setPageIndex(currentPage);
    setFilters({...filters,page:currentPage})
  }, [currentPage]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      const isEditable =
        document.activeElement.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (!isEditable) {
        if (e.key === "ArrowLeft" && pageIndex > 1) {
          // Go to the previous page
          updateParams({ page: Number(pageIndex) - 1 });
          setPageIndex(pageIndex - 1);
        } else if (e.key === "ArrowRight" && pageIndex < totalPages) {
          // Go to the next page
          updateParams({ page: Number(pageIndex) + 1 });
          setPageIndex(pageIndex + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageIndex, totalPages, updateParams]);

  return (
    <Pagination
      className={`${className} !bg-[#1E7944] py-1.5 rounded-b-md flex items-center gap-x-4`}
    >
      <PaginationContent className="flex items-center gap-x-4">
        <PaginationItem
          className="cursor-pointer"
          onClick={handleNavigateStart}
        >
          <Button className="border-none !p-0 bg-transparent hover:bg-transparent ring-0  outline-none shadow-none">
            <img src={navigate_start} alt="" className="h-[0.8rem]" />
          </Button>
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handlePreviousPage}>
          <Button className="border-none p-0 bg-transparent hover:bg-transparent ring-0 outline-none shadow-none">
            <img src={navigate_back} alt="" className="h-6 w-6" />
          </Button>
        </PaginationItem>
        <PaginationItem className="flex justify-center items-center h-10 z-20">
          <Input
            value={pageIndex}
            type="number"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                let newPageIndex = Math.max(1, Math.min(pageIndex, totalPages));
                updateParams({ [`${Key}`]: newPageIndex });
                setPageIndex(newPageIndex);
              }
            }}
            onChange={(e) => setPageIndex(e.target.value)}
            onBlur={() => {
              let newPageIndex = Math.max(1, Math.min(pageIndex, totalPages));
              updateParams({ [`${Key}`]: newPageIndex });
              setPageIndex(newPageIndex);
            }}
            className=" !shadow-none !text-sm font-medium remove-number-spinner text-[#000000] border-none focus:!border-[#FFFFFF] focus:!outline-none focus:!ring-[#FFFFFF] bg-[#FFFFFF]  flex justify-center items-center  min-w-[3rem] !w-fit !max-w-[4rem]   h-[1.25rem] "
          />
          <img src={slash} alt="" className="h-4 w-6" />

          <Input
            disabled
            value={totalPages || pageIndex}
            className=" !shadow-none !text-sm font-medium remove-number-spinner text-[#000000] border-none focus:!border-[#FFFFFF] focus:!outline-none focus:!ring-[#FFFFFF] bg-[#F6F6F6]  !w-fit  max-w-[3.75rem] max  h-[1.25rem]  disabled:!bg-[#F6F6F6] disabled:text-textColor/400"
          />
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handleNextPage}>
          <Button className="border-none p-0 bg-transparent hover:bg-transparent ring-0 outline-none shadow-none">
            <img src={navigate_next} alt="" className="h-6 w-6" />
          </Button>
        </PaginationItem>
        <PaginationItem className="cursor-pointer" onClick={handleNavigateEnd}>
          <Button className="border-none p-0 bg-transparent hover:bg-transparent ring-0 outline-none shadow-none">
            <img src={navigate_end} alt="" className="h-[0.8rem]" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
