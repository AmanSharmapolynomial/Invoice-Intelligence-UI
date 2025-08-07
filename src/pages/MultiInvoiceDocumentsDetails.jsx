import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import {
  useListMultiInvoiceDocuments,
  useListRestaurants,
  useSearchInvoice
} from "@/components/home/api";
import { useInvoiceStore } from "@/components/invoice/store";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorNames } from "@/components/vendor/api";
import { formatRestaurantsList, vendorNamesFormatter } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import persistStore from "@/store/persistStore";
import { useEffect, useState } from "react";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PdfViewer } from "@/components/common/PDFViewer";
const MultiInvoiceDocumentsDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, setFilters, setDefault } = useFilterStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 1;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verification =
    searchParams.get("human_verification") || filters?.human_verification;
  let human_verified =
    searchParams.get("human_verified") || filters?.human_verified;
  let detected =
    searchParams.get("invoice_detection_status") || filters?.detected;
  let rerun_status =
    searchParams.get("rerun_status") || filters?.human_verified;
  let rejected = searchParams.get("rejected") || "all";
  let auto_accepted =
    searchParams.get("auto_accepted") || filters?.auto_accepted;
  let start_date = searchParams.get("start_date") || filters?.start_date;
  let end_date = searchParams.get("end_date") || filters?.end_date;
  let extraction_source = searchParams.get("extraction_source") || "all";
  let clickbacon_status =
    searchParams.get("clickbacon_status") || filters?.clickbacon_status;
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  let sort_order = searchParams.get("sort_order") || "desc";
  let invoice_number = searchParams.get("invoice_number") || "";
  let assigned_to = searchParams.get("assigned_to");
  let detailed_view = searchParams.get("detailed_view") || "false";

  let document_priority = searchParams.get("document_priority") || "all";
  let restaurant_tier =
    searchParams.get("restaurant_tier") == "null" ||
    searchParams.get("restaurant_tier") == "all"
      ? null
      : searchParams.get("restaurant_tier");

  const updateParams = useUpdateParams();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames("all", restaurant);
  const {
    setRestaurantFilter,
    setVendorFilter,
    vendorFilterValue,
    restaurantFilterValue,
    setVendorNames
  } = useInvoiceStore();
  const payload = {
    auto_accepted: auto_accepted,
    end_date: end_date,
    human_verification: human_verification,
    detected: detected,
    invoice_type: invoice_type,
    clickbacon_status: clickbacon_status,
    rerun_status: rerun_status,
    restaurant: restaurant,
    start_date: start_date,
    vendor: vendor,
    page_size,
    page,
    sort_order,
    human_verified,
    auto_accepted_by_vda,
    assigned_to,
    document_priority,
    review_later: false,
    // supported_documents: false,
    restaurant_tier: restaurant_tier || "all",
    rejected,
    extraction_source,
    detailed_view
  };
  const { data, isLoading } = useListMultiInvoiceDocuments(payload);
  useEffect(() => {
    const resValue = formatRestaurantsList(
      restaurantsList && restaurantsList?.data
    )?.find((item) => item.value == restaurant)?.value;
    const vendValue = vendorNamesFormatter(
      vendorNamesList?.data && vendorNamesList?.data?.vendor_names
    )?.find((item) => item.value == vendor)?.value;

    setRestaurantFilter(resValue);
    setVendorFilter(vendValue);
    setVendorNames(vendorNamesList?.data?.vendor_names);
    setVendorsList(vendorNamesList?.data?.vendor_names);
  }, [
    restaurantsList,
    vendorNamesList,
    vendorNamesLoading,
    restaurantsListLoading
  ]);

  const {
    mutate: searchInvoices,
    isPending: searchingInvoices,
    isSuccess
  } = useSearchInvoice();
  function calculateDivHeightInVh(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementHeight = element.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const heightInVh = (elementHeight / viewportHeight) * 100;
      return heightInVh;
    } else {
      console.error("Element not found");
      return null;
    }
  }

  let final =
    calculateDivHeightInVh("maindiv") -
    (calculateDivHeightInVh("bread") +
      calculateDivHeightInVh("vendor-consolidation") +
      calculateDivHeightInVh("div2") +
      calculateDivHeightInVh("div2") +
      calculateDivHeightInVh("pagination") +
      9.5);
  let timer;
  let myData = data?.data?.[0];
  console.log(myData);
  return (
    <div className="!h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full h-full ml-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Multi Invoice Document Details"}
            hideTitle={true}
            showCustom={true}
            crumbs={[
              {
                path: null,
                label: "Multi Invoice Document Details"
              }
            ]}
          >
            {isLoading ? (
              <div className="flex items-center gap-x-2">
                <Skeleton className={"w-44 h-10  mb-1"} />
                <Skeleton className={"w-44 h-10  mb-1"} />
                ss
              </div>
            ) : (
              <>
                <div className="flex gap-x-4 items-end ">
                  {myData?.restaurant?.restaurant_id && (
                    <>
                      <div className="flex flex-col gap-y-0">
                        <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                          Restaurant
                        </p>
                        <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                          <span>{myData?.restaurant?.restaurant_name}</span>
                          <img
                            className="h-4 w-4"
                            src={
                              myData?.tier == 1
                                ? tier_1
                                : myData?.tier == 2
                                ? tier_2
                                : tier_3
                            }
                            alt=""
                          />
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </BreadCrumb>
          <div className="mt-4">

          </div>
          <div className="w-full flex  mt-4">
            <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
              <PdfViewer
                payload={payload}
                loadinMetadata={isLoading}
                pdfUrls={[
                  {
                    document_uuid: myData?.document_uuid,
                    document_source: myData?.document_source,
                    document_link: myData?.document_link
                  }
                ]}
                multiple={false}
              />
              {/* {!myDatadocument_uuid && (
              <InvoicePagination
                totalPages={data?.total_pages}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )} */}
            </div>
            <div className="w-1/2">
              {/* <Tables
              setData={setData}
              setIsLoading={setIsLoading}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            /> */}
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default MultiInvoiceDocumentsDetails;
