import "@/App.css";
import clock from "@/assets/image/clock.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import userStore from "@/components/auth/store/userStore";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import {
  useListInvoices,
  useListRestaurants,
  useSearchInvoice
} from "@/components/home/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import { useInvoiceStore } from "@/components/invoice/store";
import InvoiceTable from "@/components/invoice/Tables/InvoiceTable";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetVendorNames } from "@/components/vendor/api";
import { formatRestaurantsList, vendorNamesFormatter } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import persistStore from "@/store/persistStore";
import {
  ArrowRight,
  Filter,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const MyTasks = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verification = searchParams.get("human_verification") || "";
  let human_verified = searchParams.get("human_verified") || "";
  let detected = searchParams.get("invoice_detection_status") || "";
  let rerun_status = searchParams.get("rerun_status") || "";
  let auto_accepted = searchParams.get("auto_accepted") || "";
  let start_date = searchParams.get("start_date") || "";
  let end_date = searchParams.get("end_date") || "";
  let clickbacon_status = searchParams.get("clickbacon_status") || "";
  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  let sort_order = searchParams.get("sort_order") || "desc";
  let invoice_number = searchParams.get("invoice_number") || "";
  let assigned_to = searchParams.get("assigned_to");

  let {userId}=userStore()
  let document_priority = searchParams.get("document_priority") || "desc";
  const updateParams = useUpdateParams();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
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
    assigned_to:userId,
    document_priority,
    
  };
  const { data, isLoading } = useListInvoices(payload);
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
      // Get the height of the element in pixels
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
      8.5);
  let timer;
  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Review Later Invoices"}
            crumbs={[
              {
                path: null,
                label: "Review Later Invoices"
              }
            ]}
          />

          <div
            className="w-full flex items-center relative justify-between dark:bg-[#051C14] py-3 rounded-t-xl dark:border-primary dark:border px-4 "
            id="vendor-consolidation"
          >
            <div className="flex items-baseline gap-x-4">
              <div className="flex gap-x-2 items-center">
                <img src={clock} alt="" className="-mt-[1px] h-3 w-3" />
                <span className="font-poppins font-medium text-[1rem] leading-5 text-[#222222]">
                  Out
                </span>
              </div>
              <Switch className="!bg-[#888888]" />
              <div className="flex  items-center gap-x-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="font-poppins font-medium text-[1rem] leading-5 text-[#222222]">
                  In
                </span>
              </div>
            </div>
            <div className="flex  items-center space-x-2 ">
              <div className="flex items-center gap-x-2 dark:bg-[#051C14]">
                <Button
                  onClick={() => navigate("/vendor-consolidation")}
                  className="border border-primary dark:bg-[#000000] bg-transparent hover:bg-transparent dark:text-[#E7E7E7] text-[#0F172A] font-poppins font-normal text-sm rounded-sm h-[2.5rem]"
                >
                  Vendor Consolidation
                </Button>
                <CustomDropDown
                  triggerClassName={"bg-gray-100"}
                  contentClassName={"bg-gray-100"}
                  Value={restaurantFilterValue}
                  placeholder="All Restaurants"
                  className={"!max-w-fit"}
                  data={formatRestaurantsList(
                    restaurantsList && restaurantsList?.data
                  )}
                  searchPlaceholder="Search Restaurant"
                  onChange={(val) => {
                    if (val == "none") {
                      updateParams({ restaurant: undefined });
                      setRestaurantFilter("none");
                    } else {
                      setRestaurantFilter(val);
                      updateParams({ restaurant: val });
                    }
                  }}
                />{" "}
                <CustomDropDown
                  Value={vendorFilterValue}
                  // className="!min-w-56"
                  className={"!max-w-56"}
                  triggerClassName={"bg-gray-100"}
                  contentClassName={"bg-gray-100"}
                  data={vendorNamesFormatter(
                    vendorNamesList?.data && vendorNamesList?.data?.vendor_names
                  )}
                  onChange={(val) => {
                    if (val == "none") {
                      setVendorFilter("none");
                      updateParams({ vendor: undefined });
                    } else {
                      setVendorFilter(val);
                      updateParams({ vendor: val });
                    }
                  }}
                  placeholder="All Vendors"
                  searchPlaceholder="Search Vendor Name"
                />{" "}
                <Sheet
                  className="!overflow-auto"
                  open={open}
                  onOpenChange={() => setOpen(!open)}
                >
                  <SheetTrigger>
                    {" "}
                    <Button className="bg-transparent hover:bg-transparent p-0 w-[2.5rem] shadow-none border flex items-center justify-center h-[2.5rem] border-[#D9D9D9] rounded-sm dark:bg-[#000000] dark:border-[#000000]  ">
                      <Filter className="h-5  text-black/40" />
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

              <CustomInput
                showIcon={true}
                variant="search"
                placeholder="Search invoice"
                value={invoiceNumber}
                onChange={(value) => {
                  setInvoiceNumber(value);

                  clearTimeout(timer);
                  if (value?.length == 0) {
                    setShowResults(false);
                    return;
                  }
                  timer = setTimeout(() => {
                    if (value?.length !== 0) {
                      setShowResults(true);
                      searchInvoices(value, {
                        onSuccess: (data) => {
                          setSearchedInvoices(data?.data);
                        }
                      });
                      setInvoiceNumber("");
                    }
                  }, 500);
                }}
                className="min-w-72 max-w-96 border border-gray-200 relative  focus:!ring-0 focus:!outline-none remove-number-spinner"
              />

              {showResults && (
                <div className="shadow-md border h-44 absolute right-4 min-w-80 max-w-96 rounded-md overflow-auto top-14 border-[#E0E0E0] bg-[#FFFFFF] z-50">
                  <p className="font-poppins font-medium flex justify-between items-center text-sm p-4 sticky top-0">
                    {" "}
                    <span> Matched Invoice Numbers </span>
                    <span
                      onClick={() => {
                        setShowResults(false);
                        setSearchedInvoices([]);
                        setInvoiceNumber("");
                      }}
                    >
                      <X className="cursor-pointer" />
                    </span>
                  </p>
                  <Table>
                    <div className="w-full justify-between flex max-h-56 overflow-auto">
                      <TableBody className="w-full">
                        {searchingInvoices ? (
                          [1, 2, 3, 4, 5]?.map((_, index) => (
                            <TableRow
                              key={index}
                              className="!w-full flex justify-between cursor-pointer"
                            >
                              <TableCell>
                                <Skeleton className={"w-44 h-5"} />
                              </TableCell>
                              <TableCell>
                                <Skeleton className={"w-44 h-5"} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : searchedInvoices?.length > 0 ? (
                          searchedInvoices?.map(
                            ({
                              document_uuid,
                              vendor_name,
                              invoice_number
                            }) => {
                              return (
                                <TableRow
                                  key={document_uuid}
                                  onClick={() =>
                                    navigate(
                                      `/invoice-details?document_uuid=${document_uuid}`
                                    )
                                  }
                                  className="!w-full flex justify-between cursor-pointer !capitalize"
                                >
                                  <TableCell>{invoice_number}</TableCell>
                                  <TableCell>{vendor_name}</TableCell>
                                </TableRow>
                              );
                            }
                          )
                        ) : (
                          <>
                            <div className="w-full flex items-center justify-center mt-4">
                              <p>No Invoices Found</p>
                            </div>
                          </>
                        )}
                      </TableBody>
                    </div>
                  </Table>
                </div>
              )}
            </div>
          </div>

          <InvoiceTable
            data={data?.data}
            isLoading={isLoading}
            height={final}
          />

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

export default MyTasks;
