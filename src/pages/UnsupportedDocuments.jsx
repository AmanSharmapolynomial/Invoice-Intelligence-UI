import userStore from "@/components/auth/store/userStore";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import approved from '@/assets/image/approved.svg'
import unapproved from '@/assets/image/unapproved.svg'
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import no_data from "@/assets/image/no-data.svg";
import TablePagination from "@/components/common/TablePagination";
import { useListRestaurants } from "@/components/home/api";
import { useGetUnSupportedDocuments } from "@/components/invoice/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import { useInvoiceStore } from "@/components/invoice/store";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomDropDown from "@/components/ui/CustomDropDown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowRight, Filter } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";

const UnsupportedDocuments = () => {
  const [searchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  let { userId } = userStore();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verification =
    searchParams.get("human_verification") ||
    filters?.human_verification ||
    "all";
const {pathname}=useLocation();
    let isAll=pathname?.includes("flagged-invoices")
  let human_verified =
    searchParams.get("human_verified") || filters?.human_verified;
  let detected =
    searchParams.get("invoice_detection_status") || filters?.detected || "all";
  let rerun_status =
    searchParams.get("rerun_status") || filters?.human_verified;
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
  let assigned_to = searchParams.get("assigned_to")||(isAll?"":userId);
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
    rerun_status: rerun_status,
    restaurant: restaurant,
    start_date: start_date,
    vendor: vendor,
    page_size,
    page,
    sort_order,
    human_verified,
    assigned_to: assigned_to,
    document_priority,
    auto_accepted_by_vda,
    review_later: "false",
    restaurant_tier: restaurant_tier || "all",
    rejected,
    extraction_source,
    detailed_view: false,
  };
  const { data, isLoading } = useGetUnSupportedDocuments(payload);
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
  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full pl-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Flagged Documents"}
            crumbs={[
              {
                path: null,
                label: "My Tasks"
              },
              {
                path: null,
                label: "Flagged Documents"
              }
            ]}
          />
          <div className="flex flex-col justify-between h-[85vh]">
            <div>
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
              <Table>
                <TableHeader>
                  <TableRow className="border h-16">
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Restaurant
                    </TableHead>
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Document Classifier Prediction
                    </TableHead>
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Load Date
                    </TableHead>
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Due Time
                    </TableHead>
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Reviewed By
                    </TableHead>
                    <TableHead
                      className={`  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
                    >
                      Human Verified
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? new Array(10)?.fill(1)?.map((_, index) => {
                        return (
                          <TableRow
                            className=" w-[100%] items-center gap-x-0 !text-sm  !h-16 "
                            key={index}
                          >
                            {new Array(6)
                              .fill(10 * Math.random())
                              ?.map((_, i) => {
                                return (
                                  <TableHead
                                    key={i}
                                    className={`!text-left  py-4  justify-normal h-16 !font-semibold !text-[#1C1C1E]  border   `}
                                  >
                                    {" "}
                                    <Skeleton className={` min-w-24 h-5`} />
                                  </TableHead>
                                );
                              })}
                          </TableRow>
                        );
                      })
                    : data?.data?.length > 0 &&
                      data?.data?.map(
                        (
                          {
                            restaurant,
                            document_classifier_prediction,
                            user_marked_as_unsupported,
                            date_uploaded,
                            assignment_details,
                            review_by
                          },
                          index
                        ) => {
                          let timeRemainng = calculateTimeDifference(
                            new Date(assignment_details?.verification_due_at)
                          );
                          return (
                            <TableRow
                              onClick={() => {
                                navigate(
                                  `/unsupported-documents/details/?page_number=${
                                    (page - 1) * 10 + (index + 1)
                                }&is_all=${isAll}`
                                );
                              }}
                              key={index}
                              className={` !font-poppins  !h-16 !text-sm w-[100%]  !text-[#1C1C1E] items-center  !border  `}
                            >
                              <TableCell
                                className={` dark:!text-[#F6F6F6] !h-full !pl-[0.7rem]  font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                                <div className="flex items-center gap-x-4">
                                  <span> {restaurant?.restaurant_name} </span>
                                  <img
                                    className="h-4 w-4"
                                    src={
                                      restaurant?.tier == 1
                                        ? tier_1
                                        : restaurant?.tier == 2
                                        ? tier_2
                                        : tier_3
                                    }
                                    alt=""
                                  />
                                </div>
                              </TableCell>
                              <TableCell
                                className={` dark:!text-[#F6F6F6] !pl-[0.7rem] font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                                {document_classifier_prediction}
                              </TableCell>
                              <TableCell
                                className={` dark:!text-[#F6F6F6] !pl-[0.7rem] !h-full !min-h-16 !max-h-44 font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                                {formatDateTimeToReadable(date_uploaded)}
                              </TableCell>
                              <TableCell
                                className={` ${user_marked_as_unsupported!==null?"!text-primary":
                                  timeRemainng?.includes("ago") &&
                                  "!text-[#F15156]"
                                } dark:!text-[#F6F6F6] !pl-[0.7rem] !h-full !min-h-16 !max-h-44 font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                              <CustomTooltip
                              content={assignment_details&&`Assigned To :- ${assignment_details?.assigned_to?.username}`}
                              >
                                  {user_marked_as_unsupported!==null?"Completed":assignment_details?timeRemainng?.split("-").join("") || "NA":"NA"}
                              </CustomTooltip>
                              </TableCell>
                              <TableCell
                                className={` dark:!text-[#F6F6F6] !pl-[0.7rem] !h-full  font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                                {review_by?.username ||"-"}
                              </TableCell>
                              <TableCell
                                className={` dark:!text-[#F6F6F6] !pl-[0.7rem] !h-full  font-poppins  cursor-pointer !text-left border-r capitalize  justify-start gap-x-2  !font-normal   text-sm  `}
                              >
                                {user_marked_as_unsupported == null
                                  ? <img src={unapproved} className="h-5 w-5"/>
                                  : <img src={approved} className="h-5 w-5"/>}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                </TableBody>
              </Table>
              {!data?.data?.length > 0 && !isLoading && (
                <div className="flex justify-center  items-center h-full !w-[80vw] !overflow-hidden">
                  <img
                    src={no_data}
                    alt=""
                    className="flex-1 h-96 overflow-hidden"
                  />
                </div>
              )}
            </div>
            <div
              className="w-full flex !justify-end  pt-2 z-10"
              id="pagination"
            >
              <TablePagination
                totalPages={data?.total_pages}
                isFinalPage={data?.is_final_page}
                page={1}
                previousPage={data?.previous_page}
              />
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default UnsupportedDocuments;
