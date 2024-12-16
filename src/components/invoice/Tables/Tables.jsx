import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { useGetCombinedTable, useGetDocumentMetadata } from "../api";
import useFilterStore from "@/store/filtersStore";
import { invoiceDetailsTabs } from "@/constants";
import MetadataTable from "./MetadataTable";
import CombinedTable from "./CombinedTable";
import { useGetAdditionalData } from "@/components/vendor/api";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import warning from "@/assets/image/warning.svg";
const Tables = ({ setData, setIsLoading, currentTab, setCurrentTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { branchChanged, vendorChanged, updatedFields,setCategoryWiseSum,reCalculateCWiseSum,setHistory,operations } = invoiceDetailStore();
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();

  const { filters } = useFilterStore();
  let page = searchParams.get("page_number") || 1;
  let vendor_id = searchParams.get("vendor") || "";
  let document_uuid = searchParams.get("document_uuid") || "";
  let layout = searchParams.get("layout") || null;
  let assigned_to = searchParams.get("assigned_to");
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
    vendor_id,
    document_uuid,
    assigned_to
  };

  const { data, isLoading, isPending, isFetched } =
    useGetDocumentMetadata(payload);
  const { data: combinedTableData, isLoading: loadingCombinedTable } =
    useGetCombinedTable(
      data?.data?.[0]?.document_uuid || data?.data?.document_uuid
    );
  useEffect(() => {
    setData(data);
    setIsLoading(isLoading);
  }, [data]);
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
          const category = row?.cells[categoryColNum]?.text;
          const price = Number(row?.cells[extPriceColNum]?.text || 0);
          if (category) {
            acc[category] = (acc[category] || 0) + price;
          }
          return acc;
        },
        {}
      );
      if (!categorySum) {
        return;
      }
      const categorySumArray = Object?.entries(categorySum).map(
        ([category, sum]) => ({ category, sum })
      );
console.log(categorySumArray)
      setCategoryWiseSum(categorySumArray);
    

  }, [reCalculateCWiseSum, history, setHistory, operations, page,combinedTableData]);
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 border-b border-b-[#F0F0F0]">
        {invoiceDetailsTabs?.map(({ label, value }) => {
          let styling = `${
            value == currentTab && "bg-primary text-[#ffffff] rounded-t-xl"
          }`;
          return (
            <div
              key={value}
              onClick={() => {
                if (
                  branchChanged ||
                  vendorChanged ||
                  Object.keys(updatedFields)?.length > 0
                ) {
                  setShowWarningModal(true);
                } else {
                  setCurrentTab(value);
                }
              }}
              className={`text-center h-[3.2rem] cursor-pointer  ${styling} items-center  font-poppins font-medium text-sm leading-4 flex justify-center `}
            >
              {label}
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
      {currentTab == "combined-table" && !loadingCombinedTable && (
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
      <Modal
        open={showWarningModal}
        setOpen={setShowWarningModal}
        title={""}
        showXicon={false}
        className={"h-[18rem] w-[25rem] !rounded-3xl"}
      >
        <ModalDescription className="h-[50rem]">
          <div className="w-full flex  flex-col justify-center h-full items-center -ml-4">
            <img src={warning} alt="" className="h-16 w-16" />
            <p className="font-poppins font-semibold text-base leading-6 text-[#000000]">
              Warning
            </p>
            <p className="px-8 text-center mt-2 text-[#666667] font-poppins font-medium  text-sm leading-5">
              Please save{" "}
              {branchChanged
                ? "the vendor"
                : vendorChanged
                ? "the branch "
                : "the updated fields"}{" "}
              before proceeding to the next step to avoid losing your changes or
              encountering errors.
            </p>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default Tables;
