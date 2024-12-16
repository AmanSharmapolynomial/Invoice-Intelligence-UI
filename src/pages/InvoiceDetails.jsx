import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import { useUpdateDocumentMetadata } from "@/components/invoice/api";
import CategoryWiseSum from "@/components/invoice/CategoryWiseSum";
import LastUpdateInfo from "@/components/invoice/LastUpdateInfo";
import Tables from "@/components/invoice/Tables/Tables";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { useGetAdditionalData } from "@/components/vendor/api";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const InvoiceDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [currentTab, setCurrentTab] = useState("metadata");
  const { updatedFields, branchChanged, vendorChanged, clearUpdatedFields } =
    invoiceDetailStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({
    saving: false,
    rejecting: false,
    accepting: false
  });
  const { filters } = useFilterStore();
  const { mutate: updateTable } = useUpdateDocumentMetadata();

  const { selectedInvoiceVendorName, selectedInvoiceRestaurantName } =
    globalStore();

  const appendFiltersToUrl = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    appendFiltersToUrl();
  }, []);

  const handleSave = () => {
    if (currentTab == "metadata") {
      setLoadingState({ ...loadingState, saving: true });
      updateTable(
        {
          document_uuid:
            data?.data?.[0]?.document_uuid || data?.data?.document_uuid,
          data: updatedFields
        },
        {
          onSuccess: () => {
            setLoadingState({ ...loadingState, saving: false });
            queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
            clearUpdatedFields();
          },
          onError: () => {
            setLoadingState({ ...loadingState, saving: false });
          }
        }
      );
    }
  };

  return (
    <>
      <Navbar />

      <Layout
        className={
          "mx-6 rounded-md    !shadow-none flex flex-1 flex-col justify-between gap-y-4   "
        }
      >
        <BreadCrumb
          title={selectedInvoiceVendorName}
          crumbs={[
            {
              path: "/vendor-consolidation",
              label: `${selectedInvoiceVendorName} `
            },
            {
              path: null,
              label: `${selectedInvoiceRestaurantName} `
            }
          ]}
        />

        <div className="flex justify-end">
          <div className="flex items-center gap-x-3">
            <Button className="bg-transparent h-[2.4rem] border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Review Later
            </Button>
            <Button className="bg-transparent w-[6.5rem] h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Reject
            </Button>
            <Button className="bg-transparent h-[2.4rem] border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Accept
            </Button>
            <Button className="bg-transparent h-[2.4rem] border-primary w-[7.25rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Not Supported
            </Button>
            <Button
              disabled={currentTab=="combined-table"||loadingState?.saving||loadingState?.rejecting||loadingState?.accepting}
              onClick={() => handleSave()}
              className="font-poppins h-[2.4rem] font-normal text-sm leading-5 border-2 border-primary text-[#ffffff]"
            >
              {loadingState?.saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="w-full flex  ">
          <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
            <PdfViewer
              isLoading={isLoading}
              pdfUrls={[
                {
                  document_link: `${
                    data?.data?.document_link || data?.data?.[0]?.document_link
                  }
                    `,
                  document_source: `${
                    data?.data?.document_source ||
                    data?.data?.[0]?.document_source
                  }`
                }
              ]}
            />
            <CategoryWiseSum data={data} isLoading={isLoading}/>
            <LastUpdateInfo info={data?.data?.latest_update_info ||
                    data?.data?.[0]?.latest_update_info}/>
          </div>
          <div className="w-1/2">
            <Tables
              setData={setData}
              setIsLoading={setIsLoading}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InvoiceDetails;
