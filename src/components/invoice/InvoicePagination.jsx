import navigate_end from "@/assets/image/navigate_end_black.svg";
import navigate_next from "@/assets/image/navigate_next_black.svg";
import slash from "@/assets/image/slash_black.svg";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
const InvoicePagination = ({ totalPages, setCurrentTab }) => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  let page = searchParams.get("page_number") || 1;
  const { isModalOpen ,clearStore} = invoiceDetailStore();
  const [pageIndex, setPageIndex] = useState(page);
  useEffect(() => {
    setPageIndex(page);
  }, [page]);
  useEffect(() => {
    if (!isModalOpen) {
      const handleKeyDown = (e) => {
        const tagName = document.activeElement.tagName.toLowerCase();
        const isEditable =
          document.activeElement.isContentEditable ||
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select";
  
        if (!isEditable) {
          if (e.key === "ArrowLeft" && pageIndex > 1) {
            updateParams({ page_number: Number(pageIndex) - 1 });
            setPageIndex((prev) => prev - 1);
            setCurrentTab("metadata");
            clearStore();
          } else if (e.key === "ArrowRight" && pageIndex < totalPages) {
            updateParams({ page_number: Number(pageIndex) + 1 });
            setPageIndex((prev) => Number(prev) + 1);
            setCurrentTab("metadata");
            clearStore();
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      // Cleanup the event listener
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [pageIndex, totalPages, updateParams, isModalOpen]);
  
  return (
    <div className="flex gap-x-6 py-2 mt-2 justify-center items-center  ">
      <img
        src={navigate_end}
        onClick={() => {
          updateParams({ page_number: 1 });
          setCurrentTab("metadata");
          setPageIndex(1);
        }}
        alt=""
        className="rotate-180  cursor-pointer h-[0.925rem]"
      />
      <img
        src={navigate_next}
        alt=""
        onClick={() => {
          if (pageIndex >= 1) {
            setPageIndex((prev) => Number(prev) - 1);
            setCurrentTab("metadata");
            updateParams({ page_number: Number(pageIndex) - 1 });
          }
        }}
        className="rotate-180 cursor-pointer h-[0.925rem]"
      />
      <Input
        min={1}
        type="number"
        value={pageIndex}
        onChange={(e) => {
          setPageIndex(e.target.value);
        }}
        onBlur={() => {
          updateParams({ page_number: pageIndex });
        }}
        className="!w-[3rem] !h-[1.75rem] rounded-md  shadow-none focus:!ring-0 border-[#E0E0E0] text-[#000000] font-poppins font-medium text-[0.9rem] text-center  !p-0 !pl-1.5 !pr-0 leading-5 border-[0.125rem]"
      />
      <img src={slash} alt="" />
      <Input
        disabled
        className="!w-[4.5rem] !h-[1.75rem] rounded-md  shadow-none focus:!ring-0 border-[#E0E0E0]  text-[#000000] font-poppins font-medium text-[0.9rem] leading-5 disabled:!bg-[#F6F6F6] disabled:!text-[#888888] disabled:!opacity-95 border-none"
        value={totalPages || pageIndex}
      />
      <img
        src={navigate_next}
        alt=""
        className=" cursor-pointer h-[0.925rem]"
        onClick={() => {
          if (pageIndex < totalPages) {
            setPageIndex((prev) => Number(prev) + 1);
            setCurrentTab("metadata");
            updateParams({ page_number: Number(pageIndex) + 1 });
          }
        }}
      />
      <img
        onClick={() => {
          updateParams({ page_number: totalPages });
          setPageIndex(totalPages);
          setCurrentTab("metadata");
        }}
        src={navigate_end}
        alt=""
        className="cursor-pointer h-[0.925rem]"
      />
    </div>
  );
};

export default InvoicePagination;
