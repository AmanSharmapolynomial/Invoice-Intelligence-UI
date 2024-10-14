import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import TablePagination from "@/components/common/TablePagination";
import { useGetItemMasterPdfs } from "@/components/invoice/api";
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
import {
  useGetVendorItemMaster,
  useMergeVendorItemMaster
} from "@/components/vendor/api";
import { vendorStore } from "@/components/vendor/store/vendorStore";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import { formatData, getUserNameFromId } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";

const VendorItemMaster = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const updateParams = useUpdateParams();
  const verified_by = searchParams.get("verified_by") || "";
  const item_code = searchParams.get("item_code") || "";
  const item_description = searchParams.get("item_description") || "";
  const human_verified = searchParams.get("human_verified") || "";
  const search_by = searchParams.get("search_by") || "";
  const page = searchParams.get("page") || 1;
  const document_uuid = searchParams.get("document_uuid") || "";
  const category_review_required =
    searchParams.get("category_review_required") || "";

  const { data, isLoading } = useGetVendorItemMaster({
    vendor_id,
    verified_by,
    human_verified,
    category_review_required,
    item_code,
    item_description,
    page,
    document_uuid
  });
  const [viewIconIndex, setViewIconIndex] = useState(null);
  const [showPdfs, setShowPdfs] = useState(false);
  const [item_uuid, setItem_uuid] = useState(null);
  const { data: usersData, isLoading: usersListLoading } = useGetUsersList();
  const { masterVendor, checkedVendors, setCheckedVendors, setMasterVendor } =
    vendorStore();
  const { mutate: mergeVendorItemMaster, isPending: merging } =
    useMergeVendorItemMaster();

  const handleMerge = () => {
    mergeVendorItemMaster(
      {
        master_item_uuid: masterVendor,
        items_to_merge: checkedVendors
      },
      {
        onSuccess: () => {
          setCheckedVendors();
          setMasterVendor();
        }
      }
    );
  };

  const { data: pdfsData, isLoading: loadingPdfs } = useGetItemMasterPdfs(
    showPdfs ? item_uuid : null
  );

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
                    <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm flex flex-col justify-center gap-y-1 px-4">
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

        <div className="w-full border flex justify-between p-3 gap-x-4 overflow-auto">
          <div>
            <div>
              <div className="flex w-full max-w-sm items-center space-x-1">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setSearchTerm("");
                      updateParams({ search_by: undefined });
                      updateParams({ [`${search_by}`]: undefined });
                    } else {
                      setSearchTerm(e.target.value);
                    }
                  }}
                  placeholder="Search"
                  className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
                />
                <CustomDropDown
                  triggerClassName={"bg-gray-100"}
                  Value={search_by}
                  contentClassName={"bg-gray-100"}
                  showSearch={false}
                  onChange={(val) => {
                    if (val == "none") {
                      updateParams({ search_by: undefined });
                    } else {
                      updateParams({ search_by: val });
                    }
                  }}
                  placeholder="Search by "
                  data={[
                    {
                      label: "Item Code",
                      value: "item_code"
                    },
                    {
                      label: "Item Description",
                      value: "item_description"
                    },
                    {
                      label: "None",
                      value: "none"
                    }
                  ]}
                />
                <Button
                  disabled={search_by == ""}
                  type="submit"
                  onClick={() => {
                    updateParams({ [`${search_by}`]: searchTerm });
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
              showSearch={false}
              Value={verified_by}
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
                verified_by == undefined
                  ? "Verified By"
                  : usersData
                  ? getUserNameFromId(usersData?.data, verified_by)
                  : "Verified By"
              }
            />
            <CustomDropDown
              showSearch={false}
              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              Value={human_verified}
              onChange={(val) => {
                if (val == "none") {
                  updateParams({ human_verified: undefined });
                } else {
                  updateParams({ human_verified: val });
                }
              }}
              placeholder="Human Verified"
              data={[
                {
                  label: "Verified",
                  value: "true"
                },
                {
                  label: "Not Verified",
                  value: "false"
                },
                {
                  label: "None",
                  value: "none"
                }
              ]}
            />
            <CustomDropDown
              Value={category_review_required}
              showSearch={false}
              onChange={(val) => {
                if (val == "none") {
                  updateParams({ category_review_required: undefined });
                } else {
                  updateParams({ category_review_required: val });
                }
              }}
              placeholder="Category Review"
              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              data={[
                {
                  label: "Yes",
                  value: "true"
                },
                {
                  label: "No",
                  value: "false"
                },
                {
                  label: "None",
                  value: "none"
                }
              ]}
            />
            <Button
              className="font-normal"
              onClick={handleMerge}
              disabled={!checkedVendors || checkedVendors?.length == 0}
            >
              {merging ? (
                <>
                  Merging <LoaderIcon className="ml-2" />
                </>
              ) : (
                "Merge Item Master"
              )}
            </Button>
          </div>
        </div>

        <div className={`${showPdfs && "flex "} w-full h-full`}>
          <div className={` ${showPdfs && "w-1/2 overflow-auto"}`}>
            <VendorItemMasterTable
              isLoading={isLoading}

              data={data}
              setViewIconIndex={setViewIconIndex}
              viewIconIndex={viewIconIndex}
              setItem_uuid={setItem_uuid}
              showPdfs={showPdfs}
              setShowPdfs={setShowPdfs}
            />
          </div>
          <div className="w-1/2 h-full">
            {showPdfs && (
              <PdfViewer pdfList={pdfsData?.data}>
              
              </PdfViewer>
            )}
          </div>
        </div>
        <TablePagination
          isFinalPage={data?.is_final_page}
          totalPages={data?.total_pages}
        />
      </Layout>
    </>
  );
};

export default VendorItemMaster;
