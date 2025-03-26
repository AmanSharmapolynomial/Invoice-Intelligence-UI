import React from "react";
import no_items from "@/assets/image/no_items.svg";
import check_circle from "@/assets/image/check_circle.svg";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const ItemsListingWithoutScrollingApproval = ({items,showShortCuts,loadingItems,selectedVendor,removedItems,unCheckedItems,mode,page,setUnCheckedItems,setShowShortCuts}) => {
  return (
    <div className="w-[60%]  h-full pt-8 relative">
      <div className="flex flex-col gap-y-2 md:min-h-[30rem] 2xl:min-h-[35rem]   max-h-[40rem]">
        {items?.data?.items?.length > 0 && (
          <TooltipProvider>
            <Tooltip open={showShortCuts} className="">
              <TooltipTrigger className=""></TooltipTrigger>
              <TooltipContent className="bg-white border  shadow-sm px-4 flex items-center    gap-x-1  h-10">
                <span className="mr-2 text-gray-800 text-sm ">
                  Press <kbd>0-9</kbd> to check or uncheck items.
                </span>
                <span onClick={() => setShowShortCuts(false)}>
                  <X className="text-gray-800 h-[1rem] absolute w-[1rem] top-1 right-1 cursor-pointer" />
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {loadingItems ? (
          <div className="flex flex-col gap-y-4 h-[50vh]">
            {new Array(10).fill(0).map((_, index) => {
              return <Skeleton key={index} className={"w-full h-[2.5rem]"} />;
            })}
          </div>
        ) : (
          <>
            {!selectedVendor || loadingItems ? (
              <div className="flex items-center justify-center    md:min-h-[25rem] 2xl:min-h-[30rem] h-[30rem] w-full">
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <img src={no_items} alt="" className="h-[70%] w-[60%] mt-8" />
                  <p className="text-[#040807] font-poppins font-normal  text-[0.9rem] leading-5">
                    To proceed, kindly choose a vendor from the side navigation
                    menu.
                  </p>
                </div>
              </div>
            ) : (
              items?.data?.items?.map((item, index) => {
                let isUncheckd = (
                  mode == "vendor"
                    ? removedItems?.data?.removed_items?.length > 0
                    : removedItems?.data?.length > 0
                )
                  ? mode == "vendor"
                    ? removedItems?.data?.removed_items?.find(
                        (it) => it.item_uuid == item?.item_uuid
                      )
                    : removedItems?.data?.find(
                        (it) => it.item_uuid == item?.item_uuid
                      )
                  : false;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      // removeItem({ item_uuid: item?.item_uuid });;

                      if (unCheckedItems?.includes(item?.item_uuid)) {
                        setUnCheckedItems(
                          unCheckedItems?.filter((it) => it !== item?.item_uuid)
                        );
                      } else {
                        setUnCheckedItems([...unCheckedItems, item?.item_uuid]);
                      }
                    }}
                    className={` ${
                      (isUncheckd ||
                        unCheckedItems?.includes(item?.item_uuid) ||
                        item?.category_review_required) &&
                      "border-[#ca5644]"
                    } border rounded-sm w-full px-4 cursor-pointer border-[#D9D9D9] min-h-[2.5rem] flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-x-4">
                      <span className="font-poppins font-normal text-xs leading-5 capitalize flex items-center gap-x-2 text-black">
                        <span className="font-poppins font-semibold">
                          {index}.
                        </span>{" "}
                        <span>
                          {item?.item_description?.length > 90
                            ? item?.item_description?.slice(0, 90) + "..."
                            : item?.item_description}
                        </span>
                      </span>
                    </div>

                    {!isUncheckd &&
                      !unCheckedItems?.includes(item?.item_uuid) &&
                      !item?.category_review_required && (
                        <img src={check_circle} alt="" className="h-5 w-5" />
                      )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
      {loadingItems ? (
        <div className="flex items-center justify-center 2xl:mt-6 md:mt-2">
          <div className="grid grid-cols-5 gap-x-3 px-4">
            {new Array(5).fill(0).map((_, index) => {
              return (
                <Skeleton key={index} className={"w-[2.5rem] h-[2.5rem]"} />
              );
            })}
          </div>
        </div>
      ) : (
        items?.data?.items?.length > 0 && (
          <div className="2xl:mt-6 md:mt-2">
            {/* i need to  show max at 2 and then ellipssis and then at the end */}

            <Pagination>
              <PaginationContent>
                <PaginationItem className="!text-sm font-semibold cursor-pointer">
                  <PaginationLink
                    className={"border border-[#F1F1F1] rounded-lg"}
                    onClick={() => {
                      if (unCheckedItems?.length > 0) {
                        toast("Please save the removed items.", {
                          icon: "⚠️"
                        });
                      } else {
                        updateParams({
                          page: 1
                        });
                      }
                    }}
                  >
                    <ChevronsLeft className="h-[1rem] w-[1rem]" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="!text-sm font-semibold cursor-pointer">
                  <PaginationLink
                    className={"border border-[#F1F1F1] rounded-lg"}
                    onClick={() => {
                      if (unCheckedItems?.length > 0) {
                        toast("Please save the removed items.", {
                          icon: "⚠️"
                        });
                      } else {
                        if (page > 1) {
                          updateParams({
                            page: page - 1
                          });
                        }
                      }
                    }}
                  >
                    <ChevronLeft />
                  </PaginationLink>
                </PaginationItem>
                {new Array(items?.total_pages)
                  ?.fill(0)
                  ?.slice(0, items?.total_pages > 2 ? 2 : 1)
                  ?.map((_, index) => {
                    return (
                      <PaginationItem
                        key={index}
                        className="!text-sm font-semibold cursor-pointer"
                      >
                        <PaginationLink
                          className={`${
                            page == index + 1 &&
                            "bg-primary hover:bg-primary !text-white"
                          } text-[#000000] dark:text-[#F6F6F6] border  rounded-lg font-poppins font-semibold text-sm border-[#F1F1F1]`}
                          active={index + 1 === page}
                          onClick={() => {
                            if (unCheckedItems?.length > 0) {
                              toast("Please save the removed items.", {
                                icon: "⚠️"
                              });
                            } else {
                              updateParams({
                                page: Number(index) + 1
                              });
                            }
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                {items?.total_pages > 2 && (
                  <PaginationEllipsis className="!text-sm font-semibold font-poppins " />
                )}
                {items?.total_pages > 3 &&
                  page > 2 &&
                  page < items?.total_pages && (
                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={`${
                          true && "bg-primary !text-white hover:bg-primary"
                        } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                        onClick={() => {
                          updateParams({
                            page: items?.total_pages
                          });
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                {items?.total_pages > 1 && (
                  <PaginationItem className="!text-sm font-semibold cursor-pointer">
                    <PaginationLink
                      className={`${
                        page == items?.total_pages &&
                        "bg-primary !text-white hover:bg-primary"
                      } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                      onClick={() => {
                        if (unCheckedItems?.length > 0) {
                          toast("Please save the removed items.", {
                            icon: "⚠️"
                          });
                        } else {
                          updateParams({
                            page: items?.total_pages
                          });
                        }
                      }}
                    >
                      {items?.total_pages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem className="!text-sm font-semibold cursor-pointer">
                  <PaginationLink
                    className={"border border-[#F1F1F1] rounded-lg"}
                    onClick={() => {
                      if (unCheckedItems?.length > 0) {
                        toast("Please save the removed items.", {
                          icon: "⚠️"
                        });
                      } else {
                        if (page < items?.total_pages) {
                          updateParams({
                            page: Number(page) + 1
                          });
                        }
                      }
                    }}
                  >
                    <ChevronRight />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="!text-sm font-semibold cursor-pointer">
                  <PaginationLink
                    className={"border border-[#F1F1F1] rounded-lg"}
                    onClick={() => {
                      if (unCheckedItems?.length > 0) {
                        toast("Please save the removed items.", {
                          icon: "⚠️"
                        });
                      } else {
                        updateParams({
                          page: items?.total_pages
                        });
                      }
                    }}
                  >
                    <ChevronsRight />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )
      )}
    </div>
  );
};

export default ItemsListingWithoutScrollingApproval;
