import no_data from "@/assets/image/no-data.svg";
import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";

import {
  useCombineVendorBranches,
  useGetVendorBranches,
  useGetVendorBranchPdfs
} from "@/components/vendor/api";
import VendorBranchesTable from "@/components/vendor/vendorBranches/VendorBranchesTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Merge } from "lucide-react";

import { PdfViewer } from "@/components/common/PDFViewer";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import { vendorStore } from "@/components/vendor/store/vendorStore";
import { findVendorNameById } from "@/lib/helpers";
import persistStore from "@/store/persistStore";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
const VendorBranches = () => {
  const { vendor_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  let branch_id = searchParams.get("branch") || "";
  const { checkedBranches, setCheckedBranches, setMasterBranch, masterBranch } =
    vendorStore();
  const { vendorNames } = persistStore();
  const [showPdfs, setShowPdfs] = useState(false);

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
    <div className="h-screen !overflow-hidden " id="maindiv">
      <Navbar className="" />
      <div className={`${showPdfs && "flex gap-x-2"}`}>
        <Layout
          className={`${
            showPdfs ? "!ml-10 !mx-0 w-1/2" : "!mx-10"
          }  box-border  overflow-auto`}
        >
          <BreadCrumb
            crumbs={[
              {
                path: `/vendor-details/${vendor_id}`,
                label: `${findVendorNameById(vendorNames, vendor_id)}`
              },
              { path: "", label: "Branches" }
            ]}
          />

          <div>
            <div
              id="div1"
              className="flex justify-between dark:border-l dark:border-r items-center  dark:border-b rounded-t-xl dark:border-primary  "
            >
              <ProgressBar
                title={"Verified Branches"}
                currentValue={data?.["data"]?.["verified_branch_count"]}
                totalValue={data?.["data"]?.["total_branch_count"]}
              />
              <div className="flex items-center gap-x-2">
                <CustomInput
                  variant="search"
                  showIcon
                  value={searchTerm}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSearchTerm("");
                      updateParams({ vendor_address: undefined });
                    } else {
                      setSearchTerm(e.target.value);
                    }
                  }}
                  placeholder="Search Vendor Address"
                  className="!min-w-[300px]"
                />
                <Button
                  className="disabled:bg-[#CBCBCB] disabled:text-[#FFFFFF] font-poppins font-normal  rounded-sm !text-xs flex items-center gap-x-1 h-10 px-3"
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
                  <Merge className="h-4 w-4" /> Combine
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto"></div>
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
                  onClick={() => {
                    setShowPdfs(false);
                    updateParams({ branch: undefined });
                  }}
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

            {branchPdfs && <PdfViewer pdfList={[...branchPdfs?.data]} />}
          </Layout>
        )}
      </div>
    </div>
  );
};

export default VendorBranches;
