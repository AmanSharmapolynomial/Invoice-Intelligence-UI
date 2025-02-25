import { useGetCategoryWiseVendor } from "@/components/bulk-categorization/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import user_grey from "@/assets/image/user_grey.svg";
import user_white from "@/assets/image/user_white.svg";
const CategoryWiseItems = () => {
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedVendor, setSelectedVendor] = useState(null);
  let category_name = searchParams.get("category_name");
  const { data: vendors, isLoading: loadingVendors } = useGetCategoryWiseVendor(
    { category_id }
  );
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
          <p className="rounded-3xl h-[2.3rem] px-4 flex items-center justify-center font-poppins font-medium text-sm leading-5 text-black border border-[#E0E0E0]">
            {category_name} Items : 200
          </p>

          <Button className="rounded-sm font-normal leading-6 w-[9rem] h-[2.3rem] text-sm  text-white">
            Save & Next
          </Button>
        </div>
      </div>

      {/* Vendor List and Items Section */}

      <div className="flex gap-x-4 items-center h-full">
        <div className="w-[40%]  bg-[#FAFAFA] flex items-center justify-center h-full py-8">
          <div className="w-[70%] h-full">
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

            <div className="h-[20rem]  overflow-auto">
              {vendors?.data?.map((vendor, index) => {
                let isSelected =
                  selectedVendor?.vendor?.vendor_id === vendor?.vendor?.vendor_id;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedVendor(vendor)}
                    className={`${
                      isSelected && "bg-primary"
                    }  
                  flex items-center justify-between cursor-pointer h-[2.5rem] gap-x-4 mt-4 px-4`}
                  >
                    <div className="font-poppins flex items-center gap-x-4 capitalize font-normal text-sm leading-5 text-black">
                      {isSelected? (
                        <img src={user_white} alt="" />
                      ) : (
                        <img src={user_grey} alt="" />
                      )}
                      <span
                        className={` ${
                          isSelected&& "text-white"
                        } text-[#222222] font-poppins font-normal text-[0.9rem] leading-5`}
                      >
                        {" "}
                        {vendor?.vendor?.vendor_name}
                      </span>
                    </div>
                    <span
                      className={`${isSelected ? "text-white":"text-[#AEAEAE]"}   font-poppins font-medium text-xs leading-4`}
                    >
                      {vendor?.items_count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-[60%]"></div>
      </div>
    </div>
  );
};

export default CategoryWiseItems;
