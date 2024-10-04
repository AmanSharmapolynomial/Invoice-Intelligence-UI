import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { BadgeCheck, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import no_data from "@/assets/image/no-data.svg";

// import Modal,{ ModalTrigger } from "../ui/Modal";

const InvoiceTable = ({ data = [], isLoading }) => {

  return (
    <div className="w-full overflow-auto pb-4">
      <Table className="flex flex-col   box-border  scrollbar ">
        <TableHeader className="min-h-16">
          <TableRow className="flex  text-base  !border-none  ">
            <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start  !font-semibold !text-gray-800 !min-w-32 border-b pl-6  bg-gray-200 h-14">
              Invoice ID
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-6 !font-semibold !text-gray-800 !min-w-40 border-b  bg-gray-200 h-14">
              Source/Channel
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-semibold !text-gray-800 !min-w-44 border-b  bg-gray-200 h-14">
              Restaurant
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10  gap-x-2 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-72 border-b  bg-gray-200 h-14">
              Vendor
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-40 border-b  bg-gray-200 h-14">
              Upload Date
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-semibold !text-gray-800 !min-w-44 capitalize border-b  bg-gray-200 h-14">
              Balance Status
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-4 !font-semibold !text-gray-800 !min-w-40 border-b pb- bg-gray-200 h-14">
              Final Status
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-40 border-b  bg-gray-200 h-14">
              clickBACON Status
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-44 border-b  bg-gray-200 h-14">
              Failure Cause Code
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-40 border-b bg-gray-200 h-14 ">
              Accepted/Rejected
            </TableHead>

            <TableHead className="flex cursor-pointer !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-60  border-b border-r  bg-gray-200 h-14">
              Rejected Reasons
            </TableHead>
            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-60 border-b  bg-gray-200 h-14">
              Invoice Type
            </TableHead>
            <TableHead className="flex cursor-pointer !text-left items-center justify-start  !font-semibold !text-gray-800 !min-w-60 border-b  pl-4 bg-gray-200 h-14">
              Human Verification Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <div className="flex-1 !w-full">
          <TableBody className="flex-1 h-full w-full  ">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => {
                return (
                  <TableRow
                    className="flex  !text-sm !border-none min-h-14"
                    key={index}
                  >
                    {[
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "g",
                      "h",
                      "i",
                      "j",
                      "k",
                      "l"
                    ].map((_, i) => {
                      return (
                        <TableHead
                          key={i}
                          className="flex  !text-left items-center justify-start  pb-4 !font-semibold !text-gray-800 !min-w-40 border-b  "
                        >
                          {" "}
                          <Skeleton className={"w-28 h-5"} />
                        </TableHead>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : data && Object?.keys(data)?.length > 0 ? (
              data?.map(
                (
                  {
                    channel,
                    date_uploaded,
                    restaurant_id,
                    restaurant_name,
                    vendor_name,
                    invoice_number,
                    auto_accepted,
                    human_verified_date,
                    rejected,
                    document_failed_cause_code,
                    verified_vendor,
                    balance_type,
                    rejection_reason,
                    clickbacon_status,
                    document_uuid,
                    human_verified,
                    invoice_type
                  },
                  index
                ) => {
                  return (
                    <TableRow
                      className="flex  text-base items-center !min-h-14  !border-none"
                      key={index}
                    >
                      <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start pl-6  !font-normal !text-gray-800 !min-w-32 border-b  ">
                        {invoice_number}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-6 !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {channel}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-normal !text-gray-800 !min-w-44 border-b  ">
                        {restaurant_name}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10  !text-left items-center gap-x-4 justify-between pl-4 !font-normal !text-gray-800 !min-w-72 border-b !capitalize  ">
                        <span> {vendor_name}</span>
                        <span>
                          {verified_vendor && (
                            <BadgeCheck className="text-blue-500" />
                          )}
                        </span>
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {date_uploaded?.split("T")[0]}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start  capitalize pl-4 !font-normal !text-gray-800 !min-w-44 border-b pb- ">
                        {balance_type}
                      </TableHead>
                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  capitalize pl-4 !font-normal !text-gray-800 !min-w-40 border-b pb- ">
                        {!["auto", "manual"].includes(
                          balance_type?.toLowerCase()
                        ) ? (
                          <span className="h-5 w-5 rounded-full bg-red-500" />
                        ) : (
                          <span className="h-5 w-5 rounded-full bg-green-500" />
                        )}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-4 !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {clickbacon_status}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  !font-normal !text-gray-800 !min-w-44 border-b  ">
                        <span
                          className={`h-5 w-5 rounded-full ${
                            [0, 1, 2, 3, 4]?.includes(
                              document_failed_cause_code
                            )
                              ? "bg-red-500"
                              : document_failed_cause_code === 5
                              ? "bg-yellow-500"
                              : document_failed_cause_code === 6
                              ? "bg-orange-500"
                              : document_failed_cause_code === -1
                              ? "bg-green-500"
                              : "bg-black"
                          }`}
                        />
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {auto_accepted === true
                          ? "Accepted"
                          : rejected === true
                          ? "Rejected"
                          : human_verified == true
                          ? "Accepted"
                          : ""}
                      </TableHead>

                      <TableHead className="flex cursor-pointer !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-60  border-b border-r  ">
                        {rejection_reason && (
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button className="text-xs h-8 py-1 w-fit px-3 bg-primary hover:bg-primary/90 !font-normal">
                                View Reason
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Rejected Reasons
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <p className="font-semibold text-sm mt-4 border-b">
                                    {rejection_reason}
                                  </p>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableHead>
                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-normal !text-gray-800 !min-w-60 border-b  ">
                        {invoice_type}
                      </TableHead>
                      <TableHead className="flex cursor-pointer !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-60 border-b  ">
                        {!human_verified_date
                          ? ""
                          : human_verified_date?.split("T")?.[0]}
                      </TableHead>
                    </TableRow>
                  );
                }
              )
            ) : (
            
              <div className="flex justify-center items-center h-[40vh] !w-[95vw] !overflow-hidden">
              <img src={no_data} alt="" className="flex-1 h-full" />
            </div>
            )}
          </TableBody>
        </div>
      </Table>
      <div className="w-full flex flex-col items-center justify-center mt-2">
      
        <Link to={"/create-invoice"}>
          <Button className="flex gap-x-1 bg-primary hover:bg-primary/95">
            <span>
              <CirclePlus className="h-4" />
            </span>
            <span>Create Invoice</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InvoiceTable;
