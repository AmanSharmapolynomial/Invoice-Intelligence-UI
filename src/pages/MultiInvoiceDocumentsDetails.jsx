import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import {
  useApproveMultiInvoiceDocument,
  useListMultiInvoiceDocuments,
  useListRestaurants,
  useRejectMultiInvoiceDocument,
  useSearchInvoice,
  useUpdateMultiInvoiceDocument
} from "@/components/home/api";
import { useInvoiceStore } from "@/components/invoice/store";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorNames } from "@/components/vendor/api";
import { formatRestaurantsList, vendorNamesFormatter } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import persistStore from "@/store/persistStore";
import { useEffect, useMemo, useState } from "react";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PdfViewer } from "@/components/common/PDFViewer";
import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
import { Button } from "@/components/ui/button";
import { Check, Plus, Share2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/utils";
import toast from "react-hot-toast";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import InvoicePagination from "@/components/invoice/InvoicePagination";

const InvoiceGroupAccordion = ({
  group,
  f_key,
  payload,
  data,
  pagesCount,
  resetTrigger
}) => {
  const [newIndex, setNewIndex] = useState("");
  const [addingIndex, setAddingIndex] = useState(false);
  const [groupIndices, setGroupIndices] = useState(group.page_indices || []);
  useEffect(() => {
    setAddingIndex(false);
    setNewIndex("");
  }, [resetTrigger]);

  const invoiceToCompanyMap = useMemo(() => {
    const map = {};
    data?.data?.[0]?.[f_key]?.forEach((doc) => {
      if (doc.invoice_number && doc.company_id) {
        map[doc.invoice_number] = doc.company_id;
      }
    });
    return map;
  }, [data]);

  const handleAddIndex = () => {
    const companyId = invoiceToCompanyMap[group.invoice_number];
    const indexNum = parseInt(newIndex);

    // Basic validation with toasts
    if (isNaN(indexNum)) {
      toast.error("Please enter a valid number.");
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    if (indexNum < 1 || indexNum > pagesCount) {
      toast.error(`Page Index must be between 1 and ${pagesCount}.`);
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    if (groupIndices.includes(indexNum)) {
      toast.error("This page index  is already added.");
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    const allGroups = [
      ...(data?.data?.[0]?.["closed_groups"] || []),
      ...(data?.data?.[0]?.["complete_groups"] || []),
      ...(data?.data?.[0]?.["incomplete_groups"] || [])
    ].flat();

    console.log(allGroups);
    const usedIndicesInCompany = allGroups?.flatMap(
      (g) => g.page_indices || []
    );
    console.log(usedIndicesInCompany);
    if (usedIndicesInCompany.includes(indexNum)) {
      toast.error("This page index is already used.");
      return;
    }

    const updatedIndices = [...groupIndices, indexNum];
    setGroupIndices(updatedIndices);
    setNewIndex("");
    setAddingIndex(false);

    // ✅ Update React Query cache
    let copyData = JSON.parse(
      JSON.stringify(
        queryClient.getQueryData(["multi-invoice-documents", payload])
      )
    );
    if (!copyData) return;

    let myData = copyData?.data?.[0];
    myData?.[f_key]?.forEach((g) => {
      if (
        g?.invoice_number === group?.invoice_number &&
        g?.vendor_name === group?.vendor_name
      ) {
        g.page_indices = updatedIndices;
      }
    });

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
  };

  const handleRemoveIndex = (indexToRemove) => {
    const updatedIndices = groupIndices.filter((idx) => idx !== indexToRemove);
    setGroupIndices(updatedIndices);

    // ✅ Update React Query cache
    let copyData = JSON.parse(JSON.stringify(data));
    if (!copyData) return;

    let myData = copyData?.data?.[0];
    myData?.[f_key]?.forEach((g) => {
      if (
        g?.invoice_number === group?.invoice_number &&
        g?.vendor_name === group?.vendor_name
      ) {
        g.page_indices = updatedIndices;
      }
    });

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
  };

  return (
    <div className="my-1">
      <CustomAccordion
        className="!rounded-sm !shadow-none border !text-sm w-full"
        triggerClassName="!text-sm"
        
        title={f_key=="open_groups"?`${group?.type}`:`${group?.vendor_name} | ${group?.invoice_number}`}
      >
        <div className="flex justify-end w-full px-2 my-2">
          <Button
            className="rounded-sm h-7 w-7"
            onClick={() => setAddingIndex(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="w-full flex justify-center items-center gap-2 flex-wrap">
          {groupIndices?.map((index, i) => (
            <div className="w-10 h-10 relative" key={i}>
              <Button className="w-10 h-10 flex items-center hover:bg-transparent justify-center bg-gray-50 text-black">
                {index}
              </Button>
              <div
                onClick={() => handleRemoveIndex(index)}
                className="h-4 w-4 rounded-full bg-red-500 absolute -top-1 flex items-center justify-center -right-1.5 cursor-pointer"
              >
                <X className="h-3 w-3 text-white" />
              </div>
            </div>
          ))}

          {addingIndex && (
            <div className="w-10 h-10 relative">
              <input
                type="number"
                className="w-10 h-10 text-center text-sm border border-gray-300 rounded"
                value={newIndex}
                onChange={(e) => setNewIndex(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIndex()}
              />
              <div
                className="h-4 w-4 rounded-full bg-green-500 absolute -top-1 -right-1.5 flex items-center justify-center cursor-pointer"
                onClick={handleAddIndex}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
        </div>
      </CustomAccordion>
    </div>
  );
};

const MultiInvoiceDocumentsDetails = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, setFilters, setDefault } = useFilterStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();
  let page = searchParams.get("page_number") || 1;
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
    page_size:1,
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
  const {
    mutate: rejectDocument,
    isPending: rejecting,
    isError: errorRejecting
  } = useRejectMultiInvoiceDocument();
  const {
    mutate: approveDocument,
    isPending: approving,
    isError: errorApproving
  } = useApproveMultiInvoiceDocument();
  const {
    mutate: updateDocument,
    isPending: updating,
    isError: errorUpdating
  } = useUpdateMultiInvoiceDocument();
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
  const [totalInvoicePages, setTotalInvoicePages] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
const appendFiltersToUrl = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if(key=="start_date"||key=="end_date"){
          return
        }
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    appendFiltersToUrl();
  }, []);
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
                {/* <Skeleton className={"w-44 h-10  mb-1"} /> */}
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
          <div className="mt-4 flex justify-end w-full gap-x-4 mb-3">
            {" "}
            <CustomTooltip content={"Click To Copy The Link."}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/multi-invoice-documents/${data?.data?.[0]?.document_uuid}`
                  );
                  toast.success("Link copied to clipboard");
                }}
                // disabled={markingForReview}
                className="bg-transparent h-[2.4rem] border-primary w-[3rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                <Share2 className="dark:text-white" />
              </Button>
            </CustomTooltip>
            <CustomTooltip>
              <Button
                onClick={() => {
                  rejectDocument(data?.data?.[0]?.document_uuid, {
                    onSuccess: () => {
                      setResetTrigger((prev) => prev + 1);
                    }
                  });
                }}
                className="bg-transparent w-[6.5rem] dark:text-white h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                {rejecting && !errorRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </CustomTooltip>
            <CustomTooltip className={"!max-w-72"}>
              <Button
                onClick={() => {
                  approveDocument(data?.data?.[0]?.document_uuid, {
                    onSuccess: () => {
                      setResetTrigger((prev) => prev + 1);
                    }
                  });
                }}
                className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                {approving && !errorApproving ? "Approving..." : "Approve"}
              </Button>
            </CustomTooltip>
            <CustomTooltip>
              <Button
                onClick={() => {
                  updateDocument(
                    {
                      document_uuid: data?.data?.[0]?.document_uuid,
                      data: {
                        closed_groups: data?.data?.[0]?.closed_groups,
                        incomplete_groups: data?.data?.[0]?.incomplete_groups,
                        open_groups: data?.data?.[0]?.open_groups
                      }
                    },
                    {
                      onSuccess: () => {
                        setResetTrigger((prev) => prev + 1);
                      }
                    }
                  );
                }}
                className="font-poppins h-[2.4rem] dark:text-white font-normal text-sm w-[6.5rem] leading-5 border-2 border-primary text-[#ffffff]"
              >
                {updating && !errorUpdating ? "Saving..." : "Save"}
              </Button>
            </CustomTooltip>
          </div>
          <div className="w-full flex  pt-4 border-t">
            <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
              <PdfViewer
                payload={payload}
                setTotalPages={setTotalInvoicePages}
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
              {
                <InvoicePagination
                  totalPages={data?.total_pages}
                  currentTab={""}
                  setCurrentTab={() => {}}
                />
              }
            </div>
            <div className="w-1/2">
              {isLoading ? (
                <Skeleton className={"max-w-[50rem]  h-[38.25rem] mt-8"} />
              ) : (
                <>
                  {/* -------------------------------------------------------------------Closed Groups--------------------------------------------- */}
                  {myData?.closed_groups?.length>0&&<div>
                    <p className="font-poppins font-semibold text-sm text-black mb-3">
                      Closed Groups
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {myData?.closed_groups?.map((group, groupIdx) => (
                        <InvoiceGroupAccordion
                          key={groupIdx}
                          data={data}
                          group={group}
                          payload={payload}
                          f_key={"closed_groups"}
                          pagesCount={totalInvoicePages}
                          resetTrigger={resetTrigger}
                        />
                      ))}
                    </div>
                  </div>}

                  {/* -------------------------------------------------------------------Open Groups--------------------------------------------- */}
                  {myData?.open_groups?.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <p className="font-poppins font-semibold text-sm text-black mb-3">
                        Open Groups
                      </p>
                      <div className="flex flex-col gap-y-1">
                        {myData?.open_groups?.map((group, groupIdx) => (
                          <InvoiceGroupAccordion
                            key={groupIdx}
                            data={data}
                            group={group}
                            payload={payload}
                            f_key={"open_groups"}
                            pagesCount={totalInvoicePages}
                            resetTrigger={resetTrigger}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------------------Incomplete Groups--------------------------------------------- */}
                  {myData?.incomplete_groups?.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <p className="font-poppins font-semibold text-sm text-black mb-3">
                        Incomplete Groups
                      </p>
                      <div className="flex flex-col gap-y-1">
                        {myData?.incomplete_groups?.map((group, groupIdx) => (
                          <InvoiceGroupAccordion
                            key={groupIdx}
                            data={data}
                            group={group}
                            payload={payload}
                            f_key={"incomplete_groups"}
                            pagesCount={totalInvoicePages}
                            resetTrigger={resetTrigger}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default MultiInvoiceDocumentsDetails;
