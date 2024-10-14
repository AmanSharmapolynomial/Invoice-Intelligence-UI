import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetDocumentNotes,
  useGetDuplicateInvoices,
  useGetInvoiceMetaData
} from "@/components/invoice/api";
import RawMetaDataTable from "@/components/invoice/Tables/RawMetaDataTable";
import RawTable from "@/components/invoice/Tables/RawTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorNotes } from "@/components/vendor/api";
import VendorNotes from "@/components/vendor/notes/VendorNotes";
import { tableTabs } from "@/constants";
import { Save } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const InvoiceDetails = () => {
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page_number") || 1;
  let page_size = searchParams.get("page_size") || 1;
  let vendor = searchParams.get("vendor") || "";
  let document_uuid = searchParams.get("document_uuid") || "";
  const { data, isLoading } = useGetInvoiceMetaData({
    page,
    page_size,
    vendor,
    document_uuid
  });
  const [tab, setTab] = useState("metadata");
  const { data: vendorNotes, isLoading: vendorNotesLoading } =
    useGetVendorNotes(data?.["data"]?.[0]?.["vendor"]?.["vendor_id"]);
  const { data: duplicateInvoices, isLoading: loadingDuplicateInvoices } =
    useGetDuplicateInvoices(data?.["data"]?.[0]?.["document_uuid"]);

  const { data: documentNotes, isLoading: loadingDocumentNotes } =
    useGetDocumentNotes(!isLoading && data?.["data"]?.[0]?.["document_uuid"]);
  console.log(tab);
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
              vendor_id={data?.["data"]?.[0]?.["vendor"]?.["vendor_id"]}
              isLoading={vendorNotesLoading}
            />
          </Header>
          <Header className={"!w-full !px-2 border-none shadow-none "}>
            <div className="w-full !overflow-auto !h-full grid  grid-cols-5 gap-x-2 px-2 bg-gray-200 shadow border-gray-200 border py-1.5 rounded-md">
              {tableTabs?.map(({ label, value }) => (
                <p
                  onClick={() => setTab(value)}
                  key={label}
                  className={`${
                    tab == value ? "bg-primary text-[#FFFFFF]" : ""
                  } cursor-pointer py-2 px-0.5 flex justify-center rounded-md`}
                >
                  {label}
                </p>
              ))}
            </div>
            {tab == "edit_metadata" && (
              <Button className=" text-[#FFFFFF] bg-primary hover:bg-primary/95 !p-0 h-14 !rounded-md w-16">
                <Save className="h-6 w-6" onClick={() => {}} />
              </Button>
            )}
          </Header>
          <div className="w-full flex  flex-1  max-h-fit">
            <div className="w-1/2  h-fit">
              {/* Pdf Rendering  */}
              {isLoading ? (
                <div>
                  <Skeleton className={"w-full h-[580px]"} />
                </div>
              ) : (
                <PdfViewer
                  singlePdf={true}
                  pdfList={[
                    { document_link: data?.["data"]?.[0]?.["document_link"] }
                  ]}
                />
              )}
            </div>

            {/* Tables  */}
            <div className="w-1/2 border-l border-t !max-h-[580px] overflow-auto ">
              {tab == "metadata" && (
                <RawMetaDataTable
                  tab={tab}
                  data={!document_uuid ? data?.["data"]?.[0] : data?.data}
                  isLoading={isLoading}
                />
              )}
              {tab == "raw_table" ? (
                <RawTable document_uuid={data?.["data"]?.[0]?.document_uuid} />
              ) : null}
            </div>
          </div>
        </div>
        {!document_uuid && (
          <TablePagination
            isFinalPage={data?.["is_final_page"]}
            totalPages={data?.["total_pages"]}
            Key={"page_number"}
          />
        )}
      </Layout>
    </>
  );
};

export default InvoiceDetails;
