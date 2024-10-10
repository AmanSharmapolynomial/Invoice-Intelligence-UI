import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import no_data from "@/assets/image/no-data.svg";
import { Progress } from "@/components/ui/progress";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  useCombineVendorBranches,
  useGetVendorBranches,
  useGetVendorBranchPdfs
} from "@/components/vendor/api";
import VendorBranchesTable from "@/components/vendor/VendorBranchesTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Search } from "lucide-react";

import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { PdfViewer } from "@/components/common/PDFViewer";

const VendorBranches = () => {
  const { vendor_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  let branch_id = searchParams.get("branch") || "";
  const [checkedBranches, setCheckedBranches] = useState([]);
  const [showPdfs, setShowPdfs] = useState(false);
  const [masterBranch, setMasterBranch] = useState("");

  const updateParams = useUpdateParams();

  const { mutate: combineBranches, isPending: combiningBranches } =
    useCombineVendorBranches();

  let vendor_address = searchParams.get("vendor_address") || "";
  const { data, isLoading } = useGetVendorBranches(vendor_id, vendor_address);
  const {
    data: branchPdfs,
    isLoading: loadingBranchPdfs,
    error,
    isError,
    isRefetchError,
    isFetched
  } = useGetVendorBranchPdfs(branch_id);

  return (
    <>
      <Navbar className="" />
      <div className={`${showPdfs && "flex gap-x-2"}`}>
        <Layout
          className={`${
            showPdfs ? "!ml-10 !mx-0 w-1/2" : "!mx-10"
          }  box-border  overflow-auto`}
        >
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
                      totalValue={data?.["data"]?.["total_branch_count"]}
                      className="w-72  h-4 bg-white/15 "
                    />
                  </TooltipTrigger>
                  <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm flex flex-col justify-center gap-y-1">
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
              disabled={combiningBranches || checkedBranches?.length == 0}
              onClick={() => {
                combineBranches(
                  {
                    branch_id: masterBranch,
                    branches_to_combine: checkedBranches
                  },
                  {
                    onSuccess: () => {
                      setCheckedBranches([]);
                      setMasterBranch([]);
                    }
                  }
                );
              }}
            >
              Combine Vendor Branches
            </Button>
          </div>
          <VendorBranchesTable
            setShowPdfs={setShowPdfs}
            showPdfs={showPdfs}
            masterBranch={masterBranch}
            setMasterBranch={setMasterBranch}
            isLoading={isLoading}
            checkedBranches={checkedBranches}
            setCheckedBranches={setCheckedBranches}
            data={data?.data?.["branches"]}
          />
          <TablePagination
            isFinalPage={data?.is_final_page}
            totalPages={data?.total_pages}
          />
        </Layout>
        {showPdfs && (
          <Layout className={"box-border w-1/2 overflow-hidden mr-10"}>
            <Header className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative  ">
              <div className="w-full flex items-center gap-x-4 justify-end">
                
                <Button
                  disabled={isError}
                  className=" disabled:!bg-gray-50 bg-[#FFFFFF] text-black hover:bg-white/95 min-w-36"
                  onClick={() =>{ setShowPdfs(false);updateParams({branch:undefined})}}
                >
                  Close
                </Button>
              </div>
            </Header>

            {isError && (
              <div className="w-full h-full flex justify-center items-center">
                <img src={no_data} alt="" />
              </div>
            )}


            {
              branchPdfs && <PdfViewer  pdfList={[...branchPdfs?.data]}/>
            }
          </Layout>
        )}
      </div>
    </>
  );
};

export default VendorBranches;
