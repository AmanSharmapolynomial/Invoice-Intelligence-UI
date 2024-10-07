import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomSelect from "@/components/ui/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useGetUsersList } from "@/components/user/api";
import { useGetVendorItemMaster } from "@/components/vendor/api";
import { formatData, getUserNameFromId } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const VendorItemMaster = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const updateParams = useUpdateParams();
  const verified_by = searchParams.get("verified_by") || "";
  const { data, isLoading } = useGetVendorItemMaster(vendor_id);
  const { data: usersData, isLoading: usersListLoading } = useGetUsersList();

  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto"}>
        <Header
          title={`Vendor Items`}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative "
        >
          <div className="flex items-center justify-center gap-x-2 w-fit">
            {!isLoading && (
              <>
                {" "}
                <Label className="min-w-16">
                  Total :- {data?.["data"]?.["total_item_count"]}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center justify-between gap-x-2 w-full">
                      {" "}
                      <Progress
                        innerClassName="border-primary  !bg-white/85 "
                        totalValue={data?.["data"]?.["total_item_count"]}
                        value={data?.["data"]?.["verified_item_count"]}
                        // innerText={vendorsData?.['data']?.['verified_vendor_count']}
                        className="w-72  h-4 bg-white/15 "
                      />
                    </TooltipTrigger>
                    <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm flex flex-col justify-center gap-y-1">
                      {/* <p>{vendor_address}</p> */}

                      <span>
                        Verified Item Count :-{" "}
                        {data?.["data"]?.["verified_item_count"]}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </Header>

        <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto">
          <div>
            <div>
              <div className="flex w-full max-w-sm items-center space-x-1">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSearchTerm("");
                      // updateParams({ vendor_name_search: undefined });
                    } else {
                      setSearchTerm(e.target.value);
                    }
                  }}
                  placeholder="Search"
                  className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
                />
                <CustomSelect
                  showSearch={false}
                  onSelect={(val) => console.log(val)}
                  placeholder="Search by "
                  data={[
                    {
                      label: "Item Code",
                      value: "item_code"
                    },
                    {
                      label: "Item Description",
                      value: "item_description"
                    }
                  ]}
                />
                <Button
                  type="submit"
                  onClick={() => {
                    //   updateParams({ vendor_name_search: searchTerm });
                  }}
                >
                  <Search />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <CustomDropDown
              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              data={usersListLoading ? [] : formatData(usersData?.data)}
              onChange={(val) => {
                if (val == "none") {
                  updateParams({ verified_by: undefined });
                } else {
                  updateParams({ verified_by: val });
                }
              }}
              placeholder={
                <span className="capitalize">
                  {verified_by == undefined
                    ? "Verified By"
                    : usersData
                    ? getUserNameFromId(usersData?.data, verified_by)
                    : "Verified By"}
                </span>
              }
            />
            <CustomSelect
              showSearch={false}
              onSelect={(val) => console.log(val)}
              placeholder="Human Verified"
              data={[
                {
                  label: "Human Verified",
                  value: true
                },
                {
                  label: "Not Verified",
                  value: false
                }
              ]}
            />
            <CustomSelect
              showSearch={false}
              onSelect={(val) => console.log(val)}
              placeholder="Category Review"
              data={[
                {
                  label: "Yes",
                  value: true
                },
                {
                  label: "No",
                  value: false
                }
              ]}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default VendorItemMaster;
