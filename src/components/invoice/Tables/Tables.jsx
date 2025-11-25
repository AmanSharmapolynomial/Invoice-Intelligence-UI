import { useEffect, useState } from "react";

import warning from "@/assets/image/warning.svg";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { useGetAdditionalData } from "@/components/vendor/api";
import { invoiceDetailsTabs } from "@/constants";
import useFilterStore from "@/store/filtersStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  useGetCombinedTable,
  useGetDocumentMetadata,
  useGetDocumentMetadataBoundingBoxes
} from "../api";
import CombinedTable from "./CombinedTable";
import MetadataTable from "./MetadataTable";
import HumanVerificationTable from "./HumanVerificationTable";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderIcon } from "react-hot-toast";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import {
  CheckCheck,
  FileWarning,
  FileWarningIcon,
  Loader,
  Rows4,
  SquareCheckBig,
  Table2,
  TextSelect,
  TriangleAlert,
  X
} from "lucide-react";
import userStore from "@/components/auth/store/userStore";
const Tables = ({ setData, setIsLoading = () => { }, currentTab, setCurrentTab = () => { } }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const {
    branchChanged,
    vendorChanged,
    updatedFields,
    setCategoryWiseSum,
    reCalculateCWiseSum,
    setHistory,
    operations,
    setMetaData,
    setMetadataTableCopy,
    setMetadataTableCopy2,
    setTableData,
    loadingMetadata,
    setLoadingMetadata
  } = invoiceDetailStore();
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();

  const { filters } = useFilterStore();
  let { pathname } = useLocation();
  let page = searchParams.get("page_number") || 1;
  let vendor_id = searchParams.get("vendor") || "";
  let document_uuid = searchParams.get("document_uuid") || "";
  let layout = searchParams.get("layout") || null;
  let assigned_to = searchParams.get("assigned_to");
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let restaurant_tier = searchParams.get("restaurant_tier") || "all";
  let rejected = searchParams.get("rejected") || "all";
  let from_view = searchParams.get("from_view") || "";
  let extraction_source = searchParams.get("extraction_source") || "all";
  let re_review_requested = searchParams.get("re_review_requested");
  let payload = {
    page: page,
    page_size: filters?.page_size,
    invoice_type: filters?.invoice_type,
    invoice_detection_status: filters?.invoice_detection_status,
    rerun_status: filters?.rerun_status,
    auto_accepted: filters?.auto_accepted,
    start_date: filters?.start_date,
    end_date: filters?.end_date,
    clickbacon_status: filters?.clickbacon_status,
    human_verification: filters?.human_verification,
    sort_order: filters?.sort_order,
    restaurant: filters?.restaurant,
    human_verified: filters?.human_verified,
    auto_accepted_by_vda: auto_accepted_by_vda,
    vendor_id,
    document_uuid,
    assigned_to,
    review_later: from_view=="review_later"?true:filters?.review_later ,
    from_view: from_view?.includes("not-supported")
      ? "not-supported-documents"
      : "",
    restaurant_tier,
    rejected,
    extraction_source,
    agent_table_data_validation_status: filters?.agent_table_data_validation_status||"all",
    agent_metadata_validation_status:
      filters?.agent_metadata_validation_status||"all"
  };
  const {userId}=userStore();
  if(from_view=="re-review" ){
    payload = {
      ...payload,
      re_review_requested:filters?.re_review_requested|| re_review_requested
    }
  }
  if(from_view=="review-later" ){
    payload = {
      ...payload,
      review_later:true
    }
  }
  if(from_view=="re-review-assigned"){
    payload = {
      ...payload,
      assigned_to:userId,
       re_review_requested:filters?.re_review_requested|| re_review_requested
    }
  }

  const { data, isLoading, isPending, isFetched } =
    useGetDocumentMetadata(payload);

  const { data: combinedTableData, isLoading: loadingCombinedTable } =
    useGetCombinedTable(
      data?.data?.[0]?.document_uuid || data?.data?.document_uuid
    );

  useEffect(() => {
    setMetadataTableCopy(data);
    setMetadataTableCopy2(data?.data?.[0] || data?.data);

    setMetaData(data?.data?.[0] || data?.data);
    setLoadingMetadata(isLoading);
  }, [data, isLoading]);
  useEffect(() => {
    setData(data);
    setIsLoading(isLoading);
    setTableData(combinedTableData);
  }, [data, combinedTableData]);
  useEffect(() => {
    const categoryColNum =
      combinedTableData?.data?.processed_table?.columns?.findIndex(
        (col) => col.column_name == "Category"
      );
    const extPriceColNum =
      combinedTableData?.data?.processed_table?.columns?.findIndex(
        (col) => col.column_name == "Extended Price"
      );

    const categorySum = combinedTableData?.data?.processed_table?.rows?.reduce(
      (acc, row) => {
        const category =
          categoryColNum !== -1 ? row?.cells[categoryColNum]?.text || "-" : "-"; // Default to "-" if no category column
        const price = Number(row?.cells[extPriceColNum]?.text || 0);
        if (price > 0) {
          // Only consider rows with a valid price
          acc[category] = (acc[category] || 0) + price;
        }
        return acc;
      },
      {}
    );

    if (!categorySum) {
      return;
    }

    const categorySumArray = Object?.entries(categorySum)?.map(
      ([category, sum]) => ({ category, sum })
    );

    setCategoryWiseSum(categorySumArray);
  }, [
    reCalculateCWiseSum,
    history,
    setHistory,
    operations,
    page,
    combinedTableData,
    data
  ]);

  let length = invoiceDetailsTabs?.filter(({ value }) => {
    if (value == "combined-table") {
      if (
        data?.data?.[0]?.invoice_type === "Summary Invoice" ||
        data?.data?.invoice_type === "Summary Invoice"
      ) {
        return false;
      }
    }
    return true;
  })?.length;

  return (
    <div className="w-full box-border ">
      <div
        className={`grid grid-cols-${length} !max-w-full border-b border-b-[#F0F0F0] mt-2`}
      >
        {invoiceDetailsTabs
          ?.filter(({ value }) => {
            if (value == "combined-table") {
              if (
                data?.data?.[0]?.invoice_type === "Summary Invoice" ||
                data?.data?.invoice_type === "Summary Invoice"
              ) {
                return false;
              }
            }
            return true;
          })
          ?.map(({ label, value }) => {
            let styling = `${value == currentTab && "bg-primary text-[#ffffff] rounded-t-xl"
              }`;
            return (
              <div
                key={value}
                onClick={() => {
                  if (isLoading || loadingCombinedTable) {
                    return;
                  } else {
                    setCurrentTab(value);
                  }
                }}
                className={`text-center h-[3.2rem] cursor-pointer relative   ${styling} items-center  font-poppins font-medium text-sm leading-4 flex justify-center gap-x-2 `}
              >
                {label}{" "}
                {isLoading && currentTab !== value && (
                  <LoaderIcon className="h-4 w-4 ml-2" />
                )}
                {!isLoading && label === "Metadata" && (
                  <CustomTooltip
                    content={`Agent Metadata Validation Status : ${(data?.data?.[0] || data?.data)?.agent_validation_status
                        ?.metadata_validation_status
                      } `}
                    className={"!min-w-80 !mb-4"}
                  >
                    {(data?.data?.[0] || data?.data)?.agent_validation_status && (data?.data?.[0] || data?.data)?.agent_validation_status
                      ?.metadata_validation_status !== "unassigned" &&
                      !loadingMetadata && (
                        <span
                          className={`${(data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "rejected"
                              ? "bg-gray-200"
                              : (data?.data?.[0] || data?.data)
                                ?.agent_validation_status
                                ?.metadata_validation_status == "approved"
                                ? "bg-primary border-white border"
                                : "bg-yellow-500"
                            } mx-2  flex items-center gap-x-1 font-poppins absolute right-0 top-3.5 font-normal text-xs capitalize leading-3  text-[#ffffff] py-1 rounded-md   px-1`}
                        >
                          {/* <TextSelect className="h-3 w-3" /> */}
                          <span>
                            {" "}
                            {(data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "rejected" ? (
                              <TriangleAlert className="w-4 h-4 text-yellow-600 z-50" />
                            ) : (data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "approved" ? (
                              <CheckCheck className="w-4 h-4" />
                            ) : (data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "queued" ? (
                              <Rows4 className="w-4 h-4" />
                            ) : (data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "processing" ? (
                              <Loader className="w-4 h-4" />
                            ) : (data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.metadata_validation_status == "assigned" ? (
                              <SquareCheckBig className="w-4 h-4" />
                            ) : (
                              <></>
                            )}
                          </span>
                        </span>
                      )}
                  </CustomTooltip>
                )}
                {!isLoading && label == "Human Verification" && (
                  <CustomTooltip
                    className={"!min-w-80 !mb-4"}
                    content={`Agent Table Data Validation Status : ${(data?.data?.[0] || data?.data)?.agent_validation_status
                        ?.table_data_validation_status
                      } `}
                  >
                    {(data?.data?.[0] || data?.data)?.agent_validation_status && (data?.data?.[0] || data?.data)?.agent_validation_status
                      ?.table_data_validation_status !== "unassigned" &&
                      !loadingMetadata && (
                        <div
                          className={`${(data?.data?.[0] || data?.data)
                              ?.agent_validation_status
                              ?.table_data_validation_status == "rejected"
                              ? "bg-gray-200"
                              : (data?.data?.[0] || data?.data)
                                ?.agent_validation_status
                                ?.table_data_validation_status == "approved"
                                ? "bg-primary border border-white"
                                : "bg-yellow-500"
                            } mx-2  font-poppins font-normal text-xs leading-3  absolute right-0 top-3.5 flex items-center gap-x-1 !capitalize  text-[#ffffff] py-1  px-1 rounded-md `}
                        >
                          {/* <Table2 className="w-3 h-3" />{" "} */}
                          {(data?.data?.[0] || data?.data)
                            ?.agent_validation_status
                            ?.table_data_validation_status == "rejected" ? (
                            <TriangleAlert className="w-4 h-4 text-yellow-600 z-50" />
                          ) : (data?.data?.[0] || data?.data)
                            ?.agent_validation_status
                            ?.table_data_validation_status == "approved" ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (data?.data?.[0] || data?.data)
                            ?.agent_validation_status
                            ?.table_data_validation_status == "queued" ? (
                            <Rows4 className="w-4 h-4" />
                          ) : (data?.data?.[0] || data?.data)
                            ?.agent_validation_status
                            ?.table_data_validation_status == "processing" ? (
                            <Loader className="w-4 h-4" />
                          ) : (data?.data?.[0] || data?.data)
                            ?.agent_validation_status
                            ?.table_data_validation_status == "assigned" ? (
                            <SquareCheckBig className="w-4 h-4" />
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                  </CustomTooltip>
                )}
              </div>
            );
          })}
      </div>
      <div className=" gap-y-8 mt-4 flex flex-col">
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8.9, 10, , 11, 12].map((_, i) => {
            return (
              <div
                key={i}
                className="grid grid-cols-3 items-center gap-y-8 gap-x-8"
              >
                <Skeleton
                  key={i}
                  className={"max-w-[19rem] min-w-full h-[2rem]"}
                />
                <Skeleton
                  key={i}
                  className={"max-w-[19rem] min-w-full h-[2rem]"}
                />
                <Skeleton
                  key={i}
                  className={"max-w-[19rem] min-w-full h-[2rem]"}
                />
              </div>
            );
          })}
      </div>
      {currentTab == "metadata" && !isLoading && (
        <MetadataTable
          data={data}
          payload={payload}
          additionalData={additionalData}
          loadingAdditionalData={loadingAdditionalData}
        />
      )}
      {currentTab == "human-verification" && !isLoading && (
        <HumanVerificationTable
          data={combinedTableData}
          metadata={data?.data?.[0] || data?.data}
          payload={{
            ...filters,
            page,
            vendor_id,
            document_uuid
          }}
          additionalData={additionalData}
          loadingAdditionalData={loadingAdditionalData}
          isLoading={loadingCombinedTable}
          document_uuid={
            data?.data?.[0]?.document_uuid || data?.data?.document_uuid
          }
        />
      )}
      {currentTab == "combined-table" &&
        !loadingCombinedTable &&
        (data?.data?.[0]?.invoice_type !== "Summary Invoice" ||
          data?.data?.invoice_type !== "Summary Invoice") && (
          <CombinedTable
            data={combinedTableData}
            isLoading={loadingCombinedTable}
            additionalData={additionalData}
            loadingAdditionalData={loadingAdditionalData}
            document_uuid={
              data?.data?.[0]?.document_uuid || data?.data?.document_uuid
            }
          />
        )}
    </div>
  );
};

export default Tables;
