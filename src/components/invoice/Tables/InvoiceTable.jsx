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
import approved from "@/assets/image/approved.svg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { invoiceTableHeaders } from "@/constants";
import { BadgeCheck, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
const InvoiceTable = ({ data = [], isLoading, height }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let page = searchParams.get("page") || 1;
  return (
    <div className="w-full overflow-auto  dark:bg-[#051C14] mb-1.5 dark:border-b dark:border-r dark:border-l dark:border-primary ">
      <Table
        className={`flex flex-col   box-border  scrollbar max-h-[${
          height - 1
        }vh]  `}
        style={{ height: `${height}vh` }}
      >
        <TableHeader className="sticky top-0">
          <TableRow className="flex  text-base  !border-none mb-4 !sticky top-0 py-2 ">
            {invoiceTableHeaders?.map(({ label, styling }) => (
              <TableHead
                key={label}
                className={`flex cursor-pointer dark:text-[#F6F6F6] flex-wrap break-words  text-[#000000] font-poppins  items-center justify-start  !font-semibold text-sm !${styling} border-none  `}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          className="flex-1 !w-[100%] !overflow-auto"
          style={{ height: `${height}vh` }}
        >
          {isLoading ? (
            new Array(15)?.fill(1)?.map((_, index) => {
              return (
                <TableRow
                  className="flex  !text-sm !border-none min-h-14"
                  key={index}
                >
                  {new Array(16).fill(10)?.map((_, i) => {
                    return (
                      <TableHead
                        key={i}
                        className="flex  !text-left items-center justify-start  pb-4 !font-semibold !text-[#1C1C1E] !min-w-[8%] border-b  "
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
                    className="flex gap-y-4 !font-poppins !text-sm  !text-[#1C1C1E] items-center  !border-none"
                    key={index}
                  >
                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer!text-left break-word items-center justify-start  !font-normal !w-[7%]  ">
                      {invoice_number}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-center justify-start  !font-normal !text-[#1C1C1E] !w-[7.27%]  ">
                      {channel}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-10 !text-left items-center justify-start   !font-normal !text-[#1C1C1E] !w-[9.5%]   ">
                      {restaurant?.restaurant_name !== null
                        ? restaurant?.restaurant_name
                        : restaurant?.restaurant_id}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-10  !text-left items-center gap-x-4 justify-between  !font-normal !text-[#1C1C1E] !w-[9.6%]  !capitalize  ">
                      <span
                        className={`${
                          vendor?.human_verified && "text-primary"
                        }`}
                      >
                        {" "}
                        {vendor?.vendor_name}
                      </span>
                      <span>
                        {vendor?.["human_verified"] && (
                          <img src={approved} className="text-primary" />
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer  !text-left items-center justify-center !font-normal !text-[#1C1C1E] !w-[7%]   ">
                      {date_uploaded?.split("T")[0]}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer  !text-left items-center justify-center  capitalize  !font-normal !text-[#1C1C1E] !w-[7%]  ">
                      {balance_type}
                    </TableCell>
                    <TableCell className="flex font-poppins cursor-pointer   !text-left items-center justify-center  capitalize !font-normal !text-[#1C1C1E] !w-[7%] ">
                      {!["auto", "manual"].includes(
                        balance_type?.toLowerCase()
                      ) ? (
                        <span className="h-[0.88rem] w-[0.88rem]rounded-full bg-[#F15156]" />
                      ) : (
                        <span className="h-[0.88rem] w-[0.88rem] rounded-full bg-primary" />
                      )}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-center justify-center  !font-normal !text-[#1C1C1E] !w-[7%]  ">
                      {clickbacon_status}
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] cursor-pointer  !text-left items-center justify-center  !font-normal !text-[#1C1C1E] !w-[7%]  ">
                      <span
                        className={`h-[0.88rem] w-[0.88rem] rounded-full ${
                          [0, 1, 2, 3, 4]?.includes(document_failed_cause_code)
                            ? "bg-[#F15156]"
                            : document_failed_cause_code === 5
                            ? "bg-[#FFEF00]"
                            : document_failed_cause_code === 6
                            ? "bg-[#FFA654]"
                            : document_failed_cause_code === -1
                            ? "bg-primary"
                            : "bg-black"
                        }`}
                      />
                    </TableCell>

                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-center justify-center  !font-normal !text-[#1C1C1E] !w-[7.27%] ">
                      {auto_accepted === true
                        ? "Auto Accepted"
                        : rejected === true
                        ? "Rejected"
                        : human_verified == true
                        ? "Accepted"
                        : ""}
                    </TableCell>

                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-center justify-center   !font-normal !text-[#1C1C1E] !w-[7.5%] "
                    >
                      {rejection_reason && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Eye
                              className="flex justify-center items-center text-[#1C1C1E] h-4 w-5"
                              onClick={(e) => e.stopPropagation()}
                            />
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
                    </TableCell>
                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-centerjustify-start !font-normal !text-[#1C1C1E] !w-[7.27%]  ">
                      {invoice_type}
                    </TableCell>
                    <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !text-left items-center justify-center !font-normal !text-[#1C1C1E] !w-[10%]">
                      {!human_verified_date
                        ? ""
                        : human_verified_date?.split("T")?.[0]}
                    </TableCell>
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
      </Table>
    </div>
  );
};

export default InvoiceTable;
