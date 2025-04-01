import "@/App.css";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetVendorNames } from "@/components/vendor/api";
import {
  formatData,
  formatRestaurantsList,
  vendorNamesFormatter
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import persistStore from "@/store/persistStore";
import { ArrowRight, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userStore from "@/components/auth/store/userStore";
import { useGetUsersList } from "@/components/user/api";

const Home = () => {
  const [searchParams] = useSearchParams();
  const { clearStore } = invoiceDetailStore();
  const navigate = useNavigate();
  const { filters, setFilters } = useFilterStore();
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
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
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
  let document_priority = searchParams.get("document_priority") || "all";
  let restaurant_tier = searchParams.get("restaurant_tier") || "all";
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
    assigned_to,
    document_priority,
    auto_accepted_by_vda,
    review_later: "false",
    restaurant_tier
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
      9.5);

  useEffect(() => {
    clearStore();
  }, []);
  const { role } = userStore();
  
  useEffect(() => {
    const element = document.getElementById("invoice-filters");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(open)
    }
  }, [open,setOpen,data]);

  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full pl-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Invoice Balancing"}
            crumbs={[
              {
                path: null,
                label: "Invoices"
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
                  triggerClassName={"bg-gray-100"}
                  contentClassName={"bg-gray-100"}
                  Value={
                    searchParams.get("restaurant") || restaurantFilterValue
                  }
                  placeholder="All Restaurants"
                  multiSelect={true}
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
                <CustomDropDown
                  Value={searchParams.get("vendor") || vendorFilterValue}
                  className={"!max-w-80"}
                  triggerClassName={"bg-gray-100 "}
                  contentClassName={"bg-gray-100 !min-w-80"}
                  data={vendorNamesFormatter(
                    vendorNamesList?.data && vendorNamesList?.data?.vendor_names
                  )}
                  multiSelect={true}
                  onChange={(val) => {
                    if (typeof val == "object") {
                      let vendor = val.map((item) => item).join(",");
                      updateParams({ vendor: vendor });
                      setFilters({ ...filters, vendor: vendor });
                    } else {
                      if (val == "none") {
                        updateParams({ vendor: undefined });
                        setFilters({ ...filters, vendor: undefined });
                      } else {
                        setFilters({ ...filters, vendor: val });
                      }
                    }
                  }}
                  placeholder="All Vendors"
                  searchPlaceholder="Search Vendor Name"
                />{" "}
                <Sheet
                  className="!overflow-auto "
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
                        filters?.auto_accepted !== "" ||
                        filters?.assigned_to !== "" ||
                        filters?.restaurant_tier !== "all"
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
                          filters?.auto_accepted !== "" ||
                          filters?.assigned_to !== "" ||
                          filters?.restaurant_tier !== "all"
                            ? "!text-white"
                            : ""
                        } h-5  text-black/40 dark:text-white/50`}
                      />
                    </Button>
                  </SheetTrigger>
                  <div>
                    <SheetContent className="min-w-fit !max-w-[20rem] !overflow-auto">
                      <SheetHeader>
                        <SheetTitle>
                          <div
                         
                            className="flex justify-between items-center"
                          >
                            <p    id="invoice-filters">Filters</p>
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
                  </div>
                </Sheet>
              </div>

              <CustomInput
                showIcon={true}
                variant="search"
                placeholder="Search invoice"
                value={invoiceNumber}
                onChange={(value) => {
                  setInvoiceNumber(value);
                }}
                onKeyDown={(e) => {
                  // alert(e.key)
                  if (e.key == "Enter") {
                    if (invoiceNumber?.length == 0) {
                      setShowResults(false);
                      return;
                    }
                    if (invoiceNumber?.length !== 0) {
                      setShowResults(true);
                      searchInvoices(invoiceNumber, {
                        onSuccess: (data) => {
                          setSearchedInvoices(data?.data);
                        }
                      });
                    }
                  }
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

export default Home;
