import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetVendorBranches } from "@/components/vendor/api";
import VendorBranchesTable from "@/components/vendor/VendorBranchesTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Search } from "lucide-react";

import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const VendorBranches = () => {
  const { vendor_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams]=useSearchParams()
  const updateParams=useUpdateParams()
  let vendor_address=searchParams.get('vendor_address')||"";
  const { data, isLoading } = useGetVendorBranches(vendor_id,vendor_address);
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto"}>
        <Header
          title={`Vendor Branches `}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative "
        >
               <div className="flex items-center justify-center gap-x-2 w-fit">
               <Label className="min-w-16">
              Total :- {data?.["data"]?.["total_branch_count"]}
            </Label>
       
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-between gap-x-2 w-full">
                  {" "}
                  <Progress
                    innerClassName="border-primary  !bg-white/85 "
                    value={data?.["data"]?.["verified_branch_count"]}
                    // innerText={vendorsData?.['data']?.['verified_vendor_count']}
                    className="w-72  h-4 bg-white/15 "
                  />
                </TooltipTrigger>
                <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm flex flex-col justify-center gap-y-1">
                  {/* <p>{vendor_address}</p> */}
             
                  <span>
                    Verified Branch Count :-{" "}
                    {data?.["data"]?.["verified_branch_count"]}
                  </span>
             
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
        </Header>
        <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto">
       
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSearchTerm("");
                    updateParams({ vendor_address: undefined });
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                placeholder="Search vendor address"
                className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
              />
              <Button
                type="submit"
                onClick={() => {
                  updateParams({ vendor_address: searchTerm });
                }}
              >
                <Search />
              </Button>
            </div>
          </div>
          <Button
          disabled={true}
          >
            Combine Vendor Branches
          </Button>
        </div>
        <VendorBranchesTable isLoading={isLoading} data={data?.data?.['branches']} />
        <TablePagination isFinalPage={data?.is_final_page} totalPages={data?.total_pages}/>
      </Layout>
    </>
  );
};

export default VendorBranches;
