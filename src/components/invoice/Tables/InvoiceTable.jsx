import no_data from "@/assets/image/no-data.svg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { invoiceTableHeaders } from "@/constants";
import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";
import { BadgeCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
const InvoiceTable = ({ data = [], isLoading }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let page = searchParams.get("page") || 1;
  return (
    <div className="w-full overflow-auto ">
      <Table className="flex flex-col   box-border  scrollbar min-h-[60vh] ">
        <TableHeader className="min-h-16">
          <TableRow className="flex  text-base  !border-none  ">
            {invoiceTableHeaders?.map(({ label, styling }) => (
              <TableHead
                key={label}
                className={`flex cursor-pointer border-r !text-left items-center justify-start  !font-semibold !text-gray-800 !${styling} border-b pl-4 bg-gray-200 h-14`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <div className="flex-1 !w-full">
          <TableBody className="flex-1 h-full w-full  ">
            {isLoading ? (
              new Array(9)?.fill(1)?.map((_, index) => {
                return (
                  <TableRow
                    className="flex  !text-sm !border-none min-h-14"
                    key={index}
                  >
                    {new Array(16).fill(10)?.map((_, i) => {
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
                    restaurant,
                    vendor,
                    invoice_number,
                    auto_accepted,
                    human_verified_date,
                    rejected,
                    document_failed_cause_code,
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
                      onClick={(e) => {
                        navigate(
                          `/invoice-details/?page_number=${
                            (page - 1) * 9 + (index + 1)
                          }`
                        );
                      }}
                      className="flex  text-base items-center !min-h-14  !border-none"
                      key={index}
                    >
                      <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start pl-6  !font-normal !text-gray-800 !min-w-32 border-b  ">
                        {invoice_number}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-6 !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {channel}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-normal !text-gray-800 !min-w-60 border-b  ">
                        {restaurant?.restaurant_name!==null
                          ? restaurant?.restaurant_name
                          : restaurant?.restaurant_id}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10  !text-left items-center gap-x-4 justify-between pl-4 !font-normal !text-gray-800 !min-w-72 border-b !capitalize  ">
                        <span> {vendor?.vendor_name}</span>
                        <span>
                          {vendor?.["human_verified"] && (
                            <BadgeCheck className="text-primary" />
                          )}
                        </span>
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-40 border-b  ">
                        {date_uploaded?.split("T")[0]}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  capitalize  !font-normal !text-gray-800 !min-w-44 border-b pb- ">
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

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-4 !font-normal !text-gray-800 !min-w-44 border-b  ">
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
                          ? "Auto Accepted"
                          : rejected === true
                          ? "Rejected"
                          : human_verified == true
                          ? "Accepted"
                          : ""}
                      </TableHead>

                      <TableHead
                        onClick={(e) => e.stopPropagation()}
                        className="flex cursor-pointer !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-60  border-b border-r  "
                      >
                        {rejection_reason && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="text-xs h-8 py-1 w-fit px-3 bg-primary hover:bg-primary/90 !font-normal"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                                <AlertDialogCancel
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Close
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableHead>
                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-60 border-b  ">
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
    </div>
  );
};

export default InvoiceTable;
