import userStore from "@/components/auth/store/userStore";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import no_data from "@/assets/image/no-data.svg";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import approved from "@/assets/image/approved.svg";
import unapproved from "@/assets/image/unapproved.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import { PdfViewer } from "@/components/common/PDFViewer";
import Sidebar from "@/components/common/Sidebar";
import { useListRestaurants } from "@/components/home/api";
import {
  useGetSupportedUnsupportedOptions,
  useGetUnSupportedDocuments,
  useUpdateDocumentStatus
} from "@/components/invoice/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import InvoicePagination from "@/components/invoice/InvoicePagination";
import { useInvoiceStore } from "@/components/invoice/store";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import CustomDropDown from "@/components/ui/CustomDropDown";
import Loader from "@/components/ui/Loader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  calculateTimeDifference,
  formatDateTimeToReadable,
  formatRestaurantsList
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import { ArrowRight, Filter, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const UnsupportedDocumentDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  let { userId } = userStore();
  let page = searchParams.get("page_number") || 1;
  let page_size = searchParams.get("page_size") || 1;
  let invoice_type = searchParams.get("invoice_type") || "";
  let is_all=searchParams.get("is_all")
  let human_verification =
    searchParams.get("human_verification") || filters?.human_verification;
  let human_verified =
    searchParams.get("human_verified") || filters?.human_verified;
  let detected =
    searchParams.get("invoice_detection_status") || filters?.detected || "all";
  let rerun_status = searchParams.get("rerun_status") || filters?.rerun_status;
  let auto_accepted =
    searchParams.get("auto_accepted") || filters?.auto_accepted;
  let start_date = searchParams.get("start_date") || filters?.start_date;
  let end_date = searchParams.get("end_date") || filters?.end_date;
  let clickbacon_status =
    searchParams.get("clickbacon_status") || filters?.clickbacon_status;
  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  let sort_order = searchParams.get("sort_order") || "desc";
  let invoice_number = searchParams.get("invoice_number") || "";
  let assigned_to = searchParams.get("assigned_to");
  let rejected = searchParams.get("rejected") || "all";
  let extraction_source = searchParams.get("extraction_source") || "all";
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let document_priority = searchParams.get("document_priority") || "all";
  let restaurant_tier =
    searchParams.get("restaurant_tier") == "null" ||
    searchParams.get("restaurant_tier") == "all"
      ? null
      : searchParams.get("restaurant_tier");
  const payload = {
    auto_accepted: auto_accepted,
    end_date: end_date,
    human_verification: human_verification,
    detected: detected,
    invoice_type: invoice_type,
    clickbacon_status: clickbacon_status,
    // rerun_status: rerun_status,
    restaurant: restaurant,
    start_date: start_date,
    vendor: vendor,
    page_size,
    page,
    sort_order,
    human_verified,
    assigned_to: assigned_to||userId,
    document_priority,
    auto_accepted_by_vda,
    review_later: "false",
    restaurant_tier: restaurant_tier || "all",
    rejected,
    extraction_source,
    detailed_view: true
  };
  const { data, isLoading } = useGetUnSupportedDocuments({...payload,assigned_to:is_all?assigned_to||"":userId});
  const { mutate: updateStatus } = useUpdateDocumentStatus();
  const [markingAsFlagged, setMarkingAsFlagged] = useState(false);
  const [markingAsSupported, setMarkingAsSupported] = useState(false);
  let timeRemainng = calculateTimeDifference(
    new Date(data?.data?.[0]?.assignment_details?.verification_due_at)
  );
  const navigate = useNavigate();
  const updateParams = useUpdateParams();
  const {
    setRestaurantFilter,
    setVendorFilter,
    vendorFilterValue,
    restaurantFilterValue,
    setVendorNames
  } = useInvoiceStore();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    setShowWarning(false);

    if (!isLoading) {
      if (
        data?.data?.[0]?.action_controls?.mark_as_supported_or_unsupported
          ?.disabled == true
      ) {
        setShowWarning(true);
      }
    }
  }, [data, isLoading]);
  const { data: options, isLoading: loadingUnsupportedSupportedOptions } =
    useGetSupportedUnsupportedOptions();
  const appendFiltersToUrl = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
     
        if (key == "page" || key == "page_number" || key == "page_size") {
          return;
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
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full pl-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            // title={"Unsupported Documents"}
            crumbs={[
              {
                path: null,
                label: "My Tasks"
              },
              {
                path: null,
                label: "Flagged Documents"
              },

              {
                path: null,
                label: data?.data?.length > 0 && (
                  <div className="flex items-center gap-x-2">
                    <p>{data?.data?.[0]?.restaurant?.restaurant_name}</p>
                    <p>
                      <img
                        className="h-4 w-4"
                        src={
                          data?.data?.[0]?.restaurant?.tier == 1
                            ? tier_1
                            : data?.data?.[0]?.restaurant?.tier == 2
                            ? tier_2
                            : tier_3
                        }
                        alt=""
                      />
                    </p>
                  </div>
                )
              }
            ]}
          />

          <div className="flex justify-end gap-x-4">
            <div className="flex  items-center space-x-2 ">
              <div className="flex items-center gap-x-2 dark:bg-[#051C14]">
                <CustomDropDown
                  Value={restaurant_tier}
                  label="Restaurant Tier"
                  placeholder="All Tiers Restaurants"
                  commandGroupClassName="!min-h-[5rem] !max-h-[10rem]"
                  className={"!min-w-[10rem]  w-full"}
                  data={[
                    { label: "Tier 1", value: "1" },
                    { label: "Tier 2", value: "2" },
                    { label: "Tier 3", value: "3" },
                    { label: "All", value: null }
                  ]}
                  onChange={(val) => {
                    if (val == null) {
                      updateParams({ restaurant_tier: undefined });
                      setFilters({
                        ...filters,
                        restaurant_tier: undefined
                      });
                    } else {
                      updateParams({ restaurant_tier: val });
                      setFilters({ ...filters, restaurant_tier: val });
                    }
                  }}
                />
                <CustomDropDown
                  multiSelect={true}
                  triggerClassName={"bg-gray-100"}
                  contentClassName={"bg-gray-100"}
                  Value={
                    searchParams.get("restaurant") || restaurantFilterValue
                  }
                  placeholder="All Restaurants"
                  className={"!max-w-fit"}
                  data={formatRestaurantsList(
                    restaurantsList && restaurantsList?.data
                  )}
                  searchPlaceholder="Search Restaurant"
                  onChange={(val) => {
                    if (typeof val == "object") {
                      let restaurant = val.map((item) => item).join(",");
                      setFilters({ ...filters, restaurant: restaurant });
                      updateParams({ restaurant: restaurant });
                    } else {
                      if (val == "none") {
                        updateParams({ restaurant: undefined });
                        setFilters({ ...filters, restaurant: undefined });
                      } else {
                        updateParams({ restaurant: val });
                        setFilters({ ...filters, restaurant: val });
                      }
                    }
                  }}
                />{" "}
              </div>

              <Sheet
                className="!overflow-auto"
                open={open}
                onOpenChange={() => setOpen(!open)}
              >
                <SheetTrigger>
                  {" "}
                  <Button
                    className={`bg-transparent hover:bg-transparent p-0 w-[2.5rem] shadow-none border flex items-center justify-center h-[2.5rem] border-[#D9D9D9] rounded-sm dark:bg-[#000000] dark:border-[#000000] ${
                      open ||
                      filters?.human_verified !== "all" ||
                      filters?.human_verification !== "all" ||
                      filters?.invoice_type !== "" ||
                      filters?.start_date !== "" ||
                      filters?.end_date !== "" ||
                      filters?.clickbacon_status !== "" ||
                      filters?.auto_accepted !== ""
                        ? "!bg-primary !text-white"
                        : "!bg-white"
                    }   `}
                  >
                    <Filter
                      className={`${
                        open ||
                        filters?.human_verified !== "all" ||
                        filters?.human_verification !== "all" ||
                        filters?.invoice_type !== "" ||
                        filters?.start_date !== "" ||
                        filters?.end_date !== "" ||
                        filters?.clickbacon_status !== "" ||
                        filters?.auto_accepted !== ""
                          ? "!text-white"
                          : ""
                      } h-5  text-black/40 dark:text-white/50`}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-w-fit !overflow-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex justify-between items-center">
                        <p>Filters</p>
                        <div
                          className="flex items-center gap-x-2 cursor-pointer"
                          onClick={() => setOpen(!open)}
                        >
                          <p className="text-sm font-poppins font-normal text-[#000000]">
                            Collapse
                          </p>
                          <ArrowRight className="h-4 w-4 text-[#000000]" />
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <InvoiceFilters />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {showWarning && (
            <div className="flex flex-col relative my-2 justify-center items-center w-full rounded-md bg-red-500/10 p-4 border border-[#FF9800] bg-[#FFF3E0]">
              <div className="flex items-center gap-x-2">
                <Info className="h-5 w-5 text-[#FF9800]" />
                <p className="text-[#263238] font-poppins capitalize font-semibold text-sm leading-5 pt-[0.5px] ">
                  {
                    data?.data?.[0]?.action_controls
                      ?.mark_as_supported_or_unsupported?.reason
                  }
                </p>
              </div>

              <X
                className="h-6 w-6 text-[#546E7A] absolute top-2 right-2 cursor-pointer"
                onClick={() => {
                  setShowWarning(false);
                }}
              />
            </div>
          )}
          {isLoading ? (
            <div className="w-[90vw] h-[80vh] flex items-center justify-center">
              <Loader className={"!h-16 !w-16"} />
            </div>
          ) : data?.data?.length > 0 ? (
            <div className="w-full">
              <div className="w-full flex gap-x-8 ">
                <div className="w-1/2 ">
                  <PdfViewer
                    pdfUrls={[
                      {
                        document_link: data?.data?.[0]?.document_link,
                        document_source: data?.data?.[0]?.document_source
                      }
                    ]}
                  />
                  <InvoicePagination
                    totalPages={data?.total_pages}
                    setCurrentTab={() => {}}
                  />
                </div>
                <div className="w-1/2">
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow className="!border">
                        <TableHead className="border-r font-semibold text-black font-poppins text-sm">
                          Title
                        </TableHead>
                        <TableHead className="font-semibold text-black font-poppins text-sm">
                          Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="!border">
                        <TableCell className="border-r capitalize font-poppins font-normal text-sm leading-5 text-black">
                          {" "}
                          Document Classifier Prediction
                        </TableCell>
                        <TableCell className="capitalize font-poppins font-normal text-sm leading-5 text-black">
                          {data?.data?.[0]?.document_classifier_prediction}
                        </TableCell>
                      </TableRow>
                      <TableRow className="!border">
                        <TableCell className="border-r capitalize font-poppins font-normal text-sm leading-5 text-black">
                          {" "}
                          Load Date
                        </TableCell>
                        <TableCell className="capitalize font-poppins font-normal text-sm leading-5 text-black">
                          {formatDateTimeToReadable(
                            data?.data?.[0]?.date_uploaded
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className="!border">
                        <TableCell className="border-r font-poppins capitalize font-normal text-sm leading-5 text-black">
                          Due Time
                        </TableCell>
                        <TableCell
                          className={`${
                            timeRemainng?.includes("ago") && "!text-[#F15156]"
                          }  font-poppins capitalize font-normal text-sm leading-5 text-black`}
                        >
                          {timeRemainng?.split("-").join("") || "NA"}
                        </TableCell>
                      </TableRow>
                      <TableRow className="!border">
                        <TableCell className="border-r capitalize font-poppins font-normal text-sm leading-5 text-black ">
                          User Reviewed
                        </TableCell>
                        <TableCell className="capitalize font-poppins font-normal text-sm leading-5 text-black">
                          {data?.data?.[0]?.user_marked_as_unsupported ==
                          null ? (
                            <img src={unapproved} className="h-5 w-5" />
                          ) : (
                            <img src={approved} className="h-5 w-5" />
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow className="!border">
                        <TableCell className="border-r font-poppins font-normal text-sm leading-5 text-black capitalize">
                          Assigned To
                        </TableCell>
                        <TableCell className="font-poppins font-normal text-sm leading-5 text-black capitalize">
                          {
                            data?.data?.[0]?.assignment_details?.assigned_to
                              ?.username
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="gap-x-2 mt-4  gap-y-4  w-full  items-start">
                    <div className="flex  items-center w-full ">
                      <div className="w-1/2 border">
                        <p className=" font-poppins font-medium text-sm leading-4 py-2 flex justify-center items-center">
                          Supported
                        </p>
                      </div>
                      <div className="w-1/2 border">
                        <p className=" font-poppins font-medium text-sm leading-4 py-2 flex justify-center items-center">
                          Unsupported
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start w-full ">
                      <div className="w-1/2 grid grid-cols-3 gap-2 h mt-2  align-top items-start justify-self-start">
                        {options?.data?.supported_document_types?.map(
                          (type) => {
                            return (
                              <CustomTooltip
                                key={type}
                                content={
                                  data?.data?.[0]?.action_controls
                                    ?.mark_as_supported_or_unsupported
                                    ?.disabled &&
                                  data?.data?.[0]?.action_controls
                                    ?.mark_as_supported_or_unsupported?.reason
                                }
                              >
                                <Button
                                  disabled={
                                    markingAsSupported ||
                                    data?.data?.[0]?.action_controls
                                      ?.mark_as_supported_or_unsupported
                                      ?.disabled
                                  }
                                  onClick={() => {
                                    setMarkingAsSupported(true);
                                    let payload = {
                                      document_type: type,
                                      document_uuid:
                                        data?.data?.[0]?.document_uuid
                                    };
                                    updateStatus(payload, {
                                      onSuccess: () => {
                                        // toast.success(data?.message)
                                        setMarkingAsSupported(false);
                                      },
                                      onError: () => {
                                        setMarkingAsSupported(false);
                                      }
                                    });
                                  }}
                                  className="rounded-sm w-full hover:bg-transparent bg-transparent border border-primary text-black font-poppins font-medium text-xs"
                                  // key={type}
                                >
                                  {type}
                                </Button>
                              </CustomTooltip>
                            );
                          }
                        )}
                      </div>
                      <div className="w-1/2 grid grid-cols-3 gap-2 px-2 mt-2">
                        {options?.data?.unsupported_document_types?.map(
                          (type) => {
                            return (
                              <CustomTooltip
                                key={type}
                                content={
                                  data?.data?.[0]?.action_controls
                                    ?.mark_as_supported_or_unsupported
                                    ?.disabled &&
                                  data?.data?.[0]?.action_controls
                                    ?.mark_as_supported_or_unsupported?.reason
                                }
                              >
                                <Button
                                  disabled={
                                    markingAsSupported ||
                                    data?.data?.[0]?.action_controls
                                      ?.mark_as_supported_or_unsupported
                                      ?.disabled
                                  }
                                  onClick={() => {
                                    setMarkingAsSupported(true);
                                    let payload = {
                                      document_type: type,
                                      document_uuid:
                                        data?.data?.[0]?.document_uuid
                                    };
                                    updateStatus(payload, {
                                      onSuccess: () => {
                                        // toast.success(data?.message)
                                        setMarkingAsSupported(false);
                                      },
                                      onError: () => {
                                        setMarkingAsSupported(false);
                                      }
                                    });
                                  }}
                                  className="rounded-sm w-full capitalize font-medium text-xs bg-transparent text-black hover:bg-transparent  border-[#F15156] border "
                                  // key={type}
                                >
                                  {type}
                                </Button>
                              </CustomTooltip>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center flex-col justify-center w-[90vw] h-[70vh]">
              <img src={no_data} alt="" className="h-96" />
              <p className="font-poppins font-semibold text-base leading-5">
                No Data Found
              </p>
            </div>
          )}
        </Layout>
      </div>
    </div>
  );
};

export default UnsupportedDocumentDetails;
