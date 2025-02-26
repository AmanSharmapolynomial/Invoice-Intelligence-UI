import {
  useGetCategoryWiseVendor,
  useGetCategoryWiseVendorItems
} from "@/components/bulk-categorization/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import user_grey from "@/assets/image/user_grey.svg";
import user_white from "@/assets/image/user_white.svg";
import check_circle from "@/assets/image/check_circle.svg";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Skeleton } from "@/components/ui/skeleton";
const CategoryWiseItems = () => {
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedVendor, setSelectedVendor] = useState(null);
  let category_name = searchParams.get("category_name");
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  const { data: vendors, isLoading: loadingVendors } = useGetCategoryWiseVendor(
    { category_id }
  );

  const { data: items, isLoading: loadingItems } =
    useGetCategoryWiseVendorItems({
      category_id,
      vendor_id: selectedVendor?.vendor?.vendor_id,
      page,
      page_size
    });
  return (
    <div className="py-4 md:px-16 px-8">
      {/* Navbar */}
      <div>
        <Link
          to={"/"}
          className="font-bold !text-[1.25rem]  font-poppins text-color/900 dark:text-[#FFFFFF]"
        >
          Invoice Intelligence Platform
        </Link>
      </div>
      {/* Header */}
      <div className="mt-8 flex items-center justify-between border-b-2  pb-2 border-b-[#E0E0E0]">
        <div>
          <p className="font-poppins font-semibold capitalize text-xl leading-8 text-black">
            Here are all the items under the category {category_name}{" "}
          </p>
          <p className="font-poppins capitalize text-primary font-medium text-[0.9rem] leading-6 ">
            You can change the category of any item by clicking on the
            particular menu item
          </p>
        </div>
        <div className="flex items-center gap-x-4 font-normal ">
          {!loadingItems && (
            <p className="rounded-3xl h-[2.3rem] px-4 flex items-center justify-center font-poppins font-medium text-sm leading-5 text-black border border-[#E0E0E0]">
              Total Items : {items?.total_records}
            </p>
          )}

          <Button className="rounded-sm font-normal leading-6 w-[9rem] h-[2.3rem] text-sm  text-white">
            Save & Next
          </Button>
        </div>
      </div>

      {/* Vendor List and Items Section */}

      <div className="flex gap-x-4 items-start h-full">
        <div className="w-[40%]  bg-[#FAFAFA] flex items-center justify-center h-full py-8">
          <div className="w-[80%] h-full">
            <p className="font-poppins font-semibold text-base leading-6 pl-3 text-[#3D3D3D]">
              Vendors List
            </p>
            <div className="mt-4">
              <CustomInput
                showIcon={true}
                variant="search"
                placeholder="Search Vendor"
                value={null}
                onChange={(value) => {
                  // setSearchTerm(value)
                }}
                onKeyDown={(e) => {}}
                className="min-w-72 max-w-96 border border-gray-200 relative   focus:!ring-0 focus:!outline-none remove-number-spinner"
              />
            </div>

            <div className="max-h-[50vh] mt-2  overflow-auto">
              {vendors?.data?.map((vendor, index) => {
                let isSelected =
                  selectedVendor?.vendor?.vendor_id ===
                  vendor?.vendor?.vendor_id;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedVendor(vendor);
                      updateParams({ page: 1 });
                    }}
                    className={`${isSelected && "bg-primary"}  
                  flex items-center justify-between cursor-pointer h-[2.5rem] gap-x-4 mt-4 px-4`}
                  >
                    <div className="font-poppins flex items-center gap-x-4 capitalize font-normal text-sm leading-5 text-black">
                      {isSelected ? (
                        <img src={user_white} alt="" />
                      ) : (
                        <img src={user_grey} alt="" />
                      )}
                      <span
                        className={` ${
                          isSelected && "text-white"
                        } text-[#222222] font-poppins font-normal text-[0.9rem] leading-5`}
                      >
                        {" "}
                        {vendor?.vendor?.vendor_name}
                      </span>
                    </div>
                    <span
                      className={`${
                        isSelected ? "text-white" : "text-[#AEAEAE]"
                      }   font-poppins font-medium text-xs leading-4`}
                    >
                      {vendor?.items_count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="w-[60%]  h-full pt-8">
          <div className="flex flex-col gap-y-2 h-[30rem]">
            {loadingItems ? (
              <div className="flex flex-col gap-y-4 h-[50vh]">
                {new Array(10).fill(0).map((_, index) => {
                  return (
                    <Skeleton key={index} className={"w-full h-[2.5rem]"} />
                  );
                })}
              </div>
            ) : (
              items?.data?.items?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="border rounded-sm w-full px-4 border-[#D9D9D9] h-[2.5rem] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-x-4">
                      <span className="font-poppins font-normal text-xs leading-5 capitalize flex items-center gap-x-2 text-black">
                        <span className="font-poppins font-semibold">
                          {index}.
                        </span>{" "}
                        <span>{item?.item_description}</span>
                      </span>
                    </div>
                    <img src={check_circle} alt="" className="h-5 w-5" />
                  </div>
                );
              })
            )}
          </div>
          {loadingItems ? (
            <div className="flex items-center justify-center mt-8">
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
                          updateParams({
                            page: 1
                          });
                        }}
                      >
                        <ChevronsLeft className="h-[1rem] w-[1rem]" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="!text-sm font-semibold cursor-pointer">
                      <PaginationLink
                        className={"border border-[#F1F1F1] rounded-lg"}
                        onClick={() => {
                          if (page > 1) {
                            updateParams({
                              page: page - 1
                            });
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
                                updateParams({
                                  page: Number(index) + 1
                                });
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

                    {items?.total_pages > 1 && (
                      <PaginationItem className="!text-sm font-semibold cursor-pointer">
                        <PaginationLink
                          className={`${
                            page == items?.total_pages &&
                            "bg-primary !text-white hover:bg-primary"
                          } text-[#000000] border border-[#F1F1F1] rounded-lg font-poppins font-semibold text-sm dark:text-[#F6F6F6]`}
                          onClick={() => {
                            updateParams({
                              page: items?.total_pages
                            });
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
                          if (page < items?.total_records) {
                            updateParams({
                              page: Number(page) + 1
                            });
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
                          updateParams({
                            page: items?.total_pages
                          });
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
      </div>
    </div>
  );
};

export default CategoryWiseItems;
