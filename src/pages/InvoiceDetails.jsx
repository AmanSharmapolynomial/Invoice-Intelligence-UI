import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import { useGetInvoiceMetaData } from "@/components/invoice/api";
import RawMetaDataTable from "@/components/invoice/Tables/RawMetaDataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetVendorNotes } from "@/components/vendor/api";
import VendorNotes from "@/components/vendor/VendorNotes";
import { tableTabs } from "@/constants";
import { Save } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const InvoiceDetails = () => {
  
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 1;
  const { data, isLoading } = useGetInvoiceMetaData({ page, page_size });
  const [tab, setTab] = useState("raw_metadata");
  const { data: vendorNotes, isLoading: vendorNotesLoading } =
    useGetVendorNotes(data?.['data']?.[0]?.["vendor"]?.['vendor_id']);

  return (
    <>
      <Navbar />
      <Layout
        className={
          "mx-6 rounded-md  border mt-8 !shadow-none flex flex-1 flex-col justify-between gap-y-4   "
        }
      >
        <div>
          <Header
            className={
              "shadow-none bg-primary rounded-t-md !text-[#FFFFFF] !pr-3 gap-x-2 relative overflow-auto"
            }
            showVC={true}
            title={"Invoice Details"}
            showDeDuplication={true}
          >
            {" "}
            <Button className=" bg-[#FFFFFF] text-black hover:bg-white/95">
              Re Run Invoices
            </Button>
            <VendorNotes
              data={vendorNotes}
              vendor_id={data?.['data']?.[0]?.["vendor_id"]}
              isLoading={vendorNotesLoading}
            />
         
          </Header>
          <Header className={"!w-full !px-2 border-none shadow-none "}>
            <div className="w-full !overflow-auto !h-full grid  grid-cols-6 gap-x-2 px-2 bg-gray-200 shadow border-gray-200 border py-1.5 rounded-md">
              {tableTabs?.map(({ label, value }) => (
                <p
                  onClick={() => setTab(value)}
                  key={value}
                  className={`${
                    tab == value ? "bg-primary text-[#FFFFFF]" : ""
                  } cursor-pointer py-2 px-0.5 flex justify-center rounded-md`}
                >
                  {label}
                </p>
              ))}
            </div>
            {tab == "edit_metadata" &&<Button className=" text-[#FFFFFF] bg-primary hover:bg-primary/95 !p-0 h-14 !rounded-md w-16">
                <Save
                  className="h-6 w-6"
                  onClick={() => {
                    // console.log("Current saved data:", data);
                  }}
                />

              </Button>}
          </Header>
          <div className="w-full flex  flex-1  max-h-fit">
            <div className="w-1/2  h-fit"></div>
            {/* Pdf Rendering  */}

            {/* Tables  */}
            <div className="w-1/2 border-l border-t ">
              <RawMetaDataTable
                tab={tab}
                data={data?.["data"]?.[0]}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
        <TablePagination
          isFinalPage={data?.["is_final_page"]}
          totalPages={data?.["total_pages"]}
        />
      </Layout>
    </>
  );
};

export default InvoiceDetails;