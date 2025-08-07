import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import {
  useListInvoices,
  useListMultiInvoiceDocuments,
  useListRestaurants,
  useSearchInvoice
} from "@/components/home/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import { useInvoiceStore } from "@/components/invoice/store";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
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
import { useGetVendorNames } from "@/components/vendor/api";
import {
  formatDateTimeToReadable,
  formatRestaurantsList,
  vendorNamesFormatter
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import persistStore from "@/store/persistStore";
import { ArrowRight, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import approved from "@/assets/image/approved.svg";
import unapproved from "@/assets/image/unapproved.svg";
import { Skeleton } from "@/components/ui/skeleton";
import no_data from "@/assets/image/no-data.svg";
const MutliInvoiceDocuments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, setFilters, setDefault } = useFilterStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
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
    detailed_view:false
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
  console.log(data)

  return (
    <div className="!h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full h-full ml-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Multi Invoice Documents"}
            crumbs={[
              {
                path: null,
                label: "Multi Invoice Documents"
              }
            ]}
          />
          <div
            className="w-full flex items-center relative justify-end dark:bg-[#051C14] py-3 rounded-t-xl dark:border-primary dark:border px-4 "
            id="vendor-consolidation"
          >
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
                      setFilters({ ...filters, restaurant_tier: undefined });
                    } else {
                      updateParams({ restaurant_tier: val });
                      setFilters({ ...filters, restaurant_tier: val });
                    }
                  }}
                />
                <CustomDropDown
                  triggerClassName={"bg-gray-100"}
                  contentClassName={"bg-gray-100"}
                  Value={
                    searchParams.get("restaurant") || restaurantFilterValue
                  }
                  multiSelect={true}
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
          </div>

          {/* Listing Table */}
          <Table
            className={`flex flex-col  show-scrollbar custom-scrollbar box-border  scrollbar max-h-[${
              final - 1
            }vh]  `}
            style={{ height: `${final}vh` }}
          >
            <TableHeader className="sticky top-0 !bg-white dark:!bg-transparent !border-b !h-16 ">
              <TableRow className="flex  text-base  !sticky top-0 !h-16   border  bg-white !z-50">
                <TableHead className="w-[16.66%]  flex !min-h-16   !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Restaurant
                </TableHead>
                <TableHead className="w-[16.66%] flex !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Date Uploaded
                </TableHead>
                <TableHead className="w-[16.66%] flex !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Verified
                </TableHead>
                <TableHead className="w-[16.66%] flex !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Verified By
                </TableHead>
                <TableHead className="w-[16.66%] flex !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Verified At
                </TableHead>
                <TableHead className="w-[16.66%] flex !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              className="flex-1 !w-[100%] "
              style={{ height: `${final}vh` }}
            >
              {isLoading ? (
                <>
                  {" "}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((it) => {
                    return (
                      <TableRow
                        className="flex  text-base   !sticky top-0 !h-16 bg-white "
                        key={it}
                      >
                        <TableCell className="w-[16.66%] border-b border-l flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                        <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                        <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                        <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                        <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                        <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center capitalize gap-x-1 font-normal text-sm">
                          <Skeleton className={"w-full h-6"} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              ) : !Array.isArray(data?.data) ? (
                <div className="flex justify-center items-center h-full !w-full !overflow-hidden">
                  <img
                    src={no_data}
                    alt=""
                    className="flex-1 h-96 overflow-hidden"
                  />
                </div>
              ) : (
                data?.data?.map((item) => {
                  return (
                    <TableRow
                      className="flex  text-base   !sticky top-0 !h-16 bg-white cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/multi-invoice-documents/${item?.document_uuid}?detailed_view=true`
                        );
                      }}
                    >
                      <TableCell className="w-[16.66%] border-b border-l flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                        {item?.restaurant?.restaurant_name}
                      </TableCell>
                      <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                        {formatDateTimeToReadable(item?.date_uploaded)}
                      </TableCell>
                      <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                        {item?.verified ? (
                          <img src={approved} alt="" className="h-5 w-5" />
                        ) : (
                          <img src={unapproved} alt="" className="h-5 w-5" />
                        )}
                      </TableCell>
                      <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                        {item?.verified_by || "NA"}
                      </TableCell>
                      <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center gap-x-1 font-normal text-sm">
                        {formatDateTimeToReadable(item?.verified_at) || "-"}
                      </TableCell>
                      <TableCell className="w-[16.66%] border-b flex !min-h-16    !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-center capitalize gap-x-1 font-normal text-sm">
                        {item?.status}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="w-full flex !justify-end  pt-2 z-10" id="pagination">
            <TablePagination
              totalPages={data?.total_pages}
              isFinalPage={data?.is_final_page}
              page={page}
              previousPage={data?.previous_page}
            />
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default MutliInvoiceDocuments;
