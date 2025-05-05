import { useEffect, useState } from "react";

import warning from "@/assets/image/warning.svg";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { useGetAdditionalData } from "@/components/vendor/api";
import { invoiceDetailsTabs } from "@/constants";
import useFilterStore from "@/store/filtersStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useLocation, useSearchParams } from "react-router-dom";
import { useGetCombinedTable, useGetDocumentMetadata, useGetDocumentMetadataBoundingBoxes } from "../api";
import CombinedTable from "./CombinedTable";
import MetadataTable from "./MetadataTable";
import HumanVerificationTable from "./HumanVerificationTable";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderIcon } from "react-hot-toast";
const Tables = ({ setData, setIsLoading, currentTab, setCurrentTab }) => {
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
    setTableData
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
  let restaurant_tier=searchParams.get('restaurant_tier')||"all"
  let rejected=searchParams.get('rejected')||"all"
  let from_view = searchParams.get("from_view") || "";
  let extraction_source = searchParams.get("extraction_source") || "all";
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
    review_later: filters?.review_later || "false",
    from_view: from_view?.includes("not-supported")
      ? "not-supported-documents"
      : "",
      restaurant_tier,
      rejected,
      extraction_source
  };

  const { data, isLoading, isPending, isFetched } =
    useGetDocumentMetadata(payload);

  const { data: combinedTableData, isLoading: loadingCombinedTable } =
    useGetCombinedTable(
      data?.data?.[0]?.document_uuid || data?.data?.document_uuid
    );

  useEffect(() => {
    setMetadataTableCopy(data);

    setMetaData(data?.data?.[0] || data?.data);
  }, [data]);
  useEffect(() => {

    setData(data);
    setIsLoading(isLoading);
    setTableData(combinedTableData);
  }, [data,combinedTableData]);
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

    const categorySumArray = Object.entries(categorySum).map(
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
            let styling = `${
              value == currentTab && "bg-primary text-[#ffffff] rounded-t-xl"
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
                className={`text-center h-[3.2rem] cursor-pointer   ${styling} items-center  font-poppins font-medium text-sm leading-4 flex justify-center `}
              >
                {label} {isLoading && currentTab!==value && <LoaderIcon className="h-4 w-4 ml-2" />}
              </div>
            );
          })}
      </div>
      <div className=" gap-y-8 mt-4 flex flex-col">
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8.9, 10, ,11,12].map((_, i) => {
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
