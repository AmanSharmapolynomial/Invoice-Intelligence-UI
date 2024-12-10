import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { useGetDocumentMetadata } from "../api";
import useFilterStore from "@/store/filtersStore";
import { invoiceDetailsTabs } from "@/constants";
import MetadataTable from "./MetadataTable";

const Tables = ({ setData, setIsLoading, currentTab, setCurrentTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useFilterStore();
  let page = searchParams.get("page_number") || 1;
  let vendor_id = searchParams.get("vendor") || "";
  let document_uuid = searchParams.get("document_uuid") || "";
  let layout = searchParams.get("layout") || null;
  let assigned_to = searchParams.get("assigned_to");
  const { data, isLoading, isPending, isFetched } = useGetDocumentMetadata({
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
  });

  useEffect(() => {
    setData(data);
    setIsLoading(isLoading);
  }, [data]);

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
              onClick={() => setCurrentTab(value)}
              className={`text-center h-[3.2rem] cursor-pointer  ${styling} items-center  font-poppins font-medium text-sm leading-4 flex justify-center `}
            >
              {label}
            </div>
          );
        })}
      </div>

      {currentTab == "metadata" && !isLoading&& <MetadataTable data={data} />}
    </div>
  );
};

export default Tables;
