import "@/App.css";
import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import InfoSection from "@/components/home/InfoSection";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import InvoiceTable from "@/components/invoice/InvoiceTable";
import {
  formatRestaurantsList,
  vendorNamesFormatter
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Filter as FilterIcon, Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TablePagination from "@/components/common/TablePagination";
import { useListInvoices, useListRestaurants } from "@/components/home/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import { useInvoiceStore } from "@/components/invoice/store";
import { Button } from "@/components/ui/button";
import CustomDateRangePicker from "@/components/ui/CustomDateRangePicker";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Input } from "@/components/ui/input";
import { useGetVendorNames } from "@/components/vendor/api";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 8;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verified = searchParams.get("human_verified") || "";
  let detected = searchParams.get("detected") || "";
  let rerun_status = searchParams.get("rerun_status") || "";
  let auto_accepted = searchParams.get("auto_accepted") || "";
  let start_date = searchParams.get("start_date") || "";
  let end_date = searchParams.get("end_date") || "";
  let clickbacon_status = searchParams.get("clickbacon_status") || "";
  let restaurant = searchParams.get("restaurant") || "";
  let vendor = searchParams.get("vendor") || "";

  const updateParams = useUpdateParams();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorsList, isLoading: vendorsListLoading } =
    useListInvoices();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
  const {
    setRestaurantFilter,
    setVendorFilter,
    vendorFilterValue,
    restaurantFilterValue
  } = useInvoiceStore();
  const { data, isLoading } = useListInvoices({
    auto_accepted: auto_accepted,
    end_date: end_date,
    human_verified: human_verified,
    detected: detected,
    invoice_type: invoice_type,
    clickbacon_status: clickbacon_status,
    rerun_status: rerun_status,
    restaurant: restaurant,
    start_date: start_date,

    vendor: vendor,
    page_size: page_size,
    page: page
  });
  useEffect(() => {
    const resValue = formatRestaurantsList(
      restaurantsList && restaurantsList?.data
    )?.find((item) => item.value == restaurant)?.value;
    const vendValue = vendorNamesFormatter(
      vendorNamesList?.data && vendorNamesList?.data?.vendor_names
    )?.find((item) => item.value == vendor)?.value;

    setRestaurantFilter(resValue);
    setVendorFilter(vendValue);
  }, [
    restaurantsList,
    vendorNamesList,
    vendorNamesLoading,
    restaurantsListLoading
  ]);
  return (
    <>
      <Navbar></Navbar>
      <Layout className={"mx-10 rounded-md  border mt-8 !shadow-none "}>
        <Header
          className={"shadow-none bg-primary rounded-t-md !text-[#FFFFFF] relative"}
          showVC={true}
          title={"Invoices"}
          showDeDuplication={true}
        />
        <InfoSection />
        <Header className={"shadow-none  relative"}>
          <div className="w-full flex justify-between overflow-auto">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search invoice"
                className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
              />
              <Button type="submit" className="w-12">
                <Search className="h-4 w-10" />
              </Button>
            </div>
            <div className="flex items-center gap-x-2">
              <CustomDropDown
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                Value={ restaurantFilterValue
                }
                placeholder="All Restaurants"
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
                className="!min-w-56"
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
              <Sheet className="!overflow-auto">
                <SheetTrigger>
                  {" "}
                  <Button>
                    <FilterIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-w-fit !overflow-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <InvoiceFilters />
                  <SheetFooter></SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <CustomDateRangePicker />
          </div>
        </Header>
        <InvoiceTable data={data?.data} isLoading={isLoading} />
        <div className="w-full flex !justify-end  pt-2 z-10">
          <TablePagination
            totalPages={data?.total_pages}
            isFinalPage={data?.is_final_page}
            page={page}
            previousPage={data?.previous_page}
          />
        </div>
      </Layout>
    </>
  );
};

export default Home;
