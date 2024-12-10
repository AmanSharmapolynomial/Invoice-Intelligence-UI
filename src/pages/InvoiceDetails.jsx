import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import Tables from "@/components/invoice/Tables/Tables";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const InvoiceDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [currentTab, setCurrentTab] = useState("metadata");
  const [isLoading, setIsLoading] = useState(true);
  const { filters } = useFilterStore();
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
            <Button className="font-poppins h-[2.4rem] font-normal text-sm leading-5 border-2 border-primary text-[#ffffff]">
              Save
            </Button>
          </div>
        </div>

        <div className="w-full flex  ">
          <div className="w-1/2">
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
          </div>
          <div className="w-1/2">
            <Tables setData={setData} setIsLoading={setIsLoading} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InvoiceDetails;
