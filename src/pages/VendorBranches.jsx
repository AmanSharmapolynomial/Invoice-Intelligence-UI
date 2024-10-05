import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
          <Progress
            innerClassName="border-primary  !bg-white/85 "
            value={33}
            className="w-72 absolute right-4 h-4 bg-white/15 "
          />
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
        <VendorBranchesTable isLoading={isLoading} data={data?.data} />
        <TablePagination isFinalPage={data?.is_final_page} totalPages={data?.total_pages}/>
      </Layout>
    </>
  );
};

export default VendorBranches;
