import "@/App.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Header from "../common/Header";
import Layout from "../common/Layout";
import Navbar from "../common/Navbar";
import InfoSection from "./InfoSection";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import InvoiceTable from "@/components/invoice/InvoiceTable";
import { useListInvoices, useListRestaurants } from "./api";
import TablePagination from "../common/TablePagination";
import { Table } from "../ui/table";
import { useSearchParams } from "react-router-dom";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Filter as FilterIcon, Search } from "lucide-react";
import CustomDropDown from "../ui/CustomDropDown";
import { vendorCategories } from "@/constants";
import { formatRestaurantsList } from "@/lib/helpers";
import InvoiceFilters from "../invoice/InvoiceFilters";
import CustomDateRangePicker from "../ui/CustomDateRangePicker";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 8;
  let invoice_type = searchParams.get("invoice_type") || "";
  const updateParams = useUpdateParams();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorsList, isLoading: vendorsListLoading } =
    useListInvoices();
  const { data, isLoading } = useListInvoices({
    auto_accepted: "all",
    end_date: null,
    human_verification: "all",
    human_verified: "all",
    invoice_detection_status: "all",
    invoice_type: invoice_type,
    rerun_status: "both",
    restaurant: null,
    start_date: null,
    vendor: "all",
    page_size: page_size,
    page: page
  });

  return (
    <>
      <Navbar></Navbar>
      <Layout className={"mx-10 rounded-md  border mt-8 !shadow-none "}>
        <Header
          className={"shadow-none bg-gray-200 relative"}
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
              {/* <Select
                className="!bg-[#FFFFFF]"
                // placeholder={invoice_type ? invoice_type : "Invoice Type"}
                onValueChange={handleValueChange}
              >
                <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0 !bg-gray-100  font-medium">
                  <SelectValue
                    placeholder={
                      <span className="capitalize ">
                        {invoice_type ? invoice_type : "Invoice Type"}
                      </span>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Summary Invoice">
                    Summay Invoice
                  </SelectItem>
                  <SelectItem value="Liquor Invoice">Liquor Invoice</SelectItem>
                  <SelectItem value="Normal Invoice">Normal Invoice</SelectItem>
                </SelectContent>
              </Select> */}
              <CustomDropDown
                className="!bg-red-500"
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                data={vendorCategories
                  .filter((item) => item.label !== "NA")
                  .map((item) => {
                    if (item.label == "None") {
                      item.label = "All";
                      item.value = "none";
                    }
                    return item;
                  })
                  .reverse()}
                onChange={(val) => {
                  if (val == "none") {
                    updateParams({ invoice_type: undefined });
                  } else {
                    updateParams({ invoice_type: val });
                  }
                }}
                placeholder={
                  <span className="capitalize">
                    {(invoice_type =="all" || invoice_type == "none" || !invoice_type)
                      ? "Invoice Type"
                      : invoice_type}
                  </span>
                }
              />{" "}
              <CustomDropDown
                className="!bg-red-500"
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                data={formatRestaurantsList(
                  restaurantsList && restaurantsList?.data
                )}
                onChange={(val) => {}}
                placeholder={"All Restaurants"}
              />{" "}
              <CustomDropDown
                className="!bg-red-500"
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                data={vendorCategories}
                onChange={(val) => {}}
                placeholder={"All Vendors"}
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
                  <SheetFooter>
                
                </SheetFooter>
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
