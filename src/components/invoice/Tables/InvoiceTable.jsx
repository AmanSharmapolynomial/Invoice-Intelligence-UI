import approved from "@/assets/image/approved.svg";
import no_data from "@/assets/image/no-data.svg";
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
import { formatDateToReadable } from "@/lib/helpers";
import globalStore from "@/store/globalStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetDocumentTimeLine } from "../api";
import { useState } from "react";
import Timeline from "../Timeline";
import {
  ArrowUp,
  CheckCheck,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Equal,
  MoveUpIcon
} from "lucide-react";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
const InvoiceTable = ({ data = [], isLoading, height }) => {
  const [searchParams] = useSearchParams();
  const [clickedInvoiceUUID, setClickedInvoiceUUID] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const { setSelectedInvoiceRestaurantName, setSelectedInvoiceVendorName } =
    globalStore();
  const navigate = useNavigate();
  let page = searchParams.get("page") || 1;
  function calculateTimeDifference(dueDate) {
    const now = new Date();
    const timeDiff = dueDate - now;

    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (timeDiff <= 0) {
      return `Due  ${hours}h ${minutes}m ago`;
    }
    return `${hours}h ${minutes}m`;
  }

  function getPropertyIcon(priority) {
    if (priority == "HIGHEST") {
      return (
        <ChevronsUp className="w-4 object-fill h-4 text-red-500 cursor-pointer" />
      );
    }

    if (priority == "LOWEST") {
      return (
        <ChevronsDown className=" object-fill h-10  text-blue-500 cursor-pointer" />
      );
    }

    if (priority == "HIGH") {
      return (
        <ChevronUp className="w-4 object-fill h-10  text-orange-400 cursor-pointer" />
      );
    }

    if (priority == "LOW") {
      return (
        <ChevronDown className=" object-fill h-10  text-orange-400 cursor-pointer" />
      );
    }

    if (priority == "MEDIUM") {
      return (
        <CustomTooltip content={"MEDIUM"} top={2}>
          <Equal className=" object-fill h-10  text-orange-700 cursor-pointer" />
        </CustomTooltip>
      );
    }

    if (priority == "COMPLETED") {
      return (
        <CustomTooltip content={"COMPLETED"}>
          <CheckCheck className=" object-fill h-5 !z-50  text-primary cursor-pointer" />
        </CustomTooltip>
      );
    }
  }
  const { mutate, isPending } = useGetDocumentTimeLine();

  return (
    <div className="w-full overflow-auto  dark:bg-[#051C14] mb-1.5 dark:border-b dark:border-r dark:border-l dark:border-primary ">
      <Table
        className={`flex flex-col   box-border  scrollbar max-h-[${
          height - 1
        }vh]  `}
        style={{ height: `${height}vh` }}
      >
        <TableHeader className="sticky top-0">
          <TableRow className="flex  text-base border-none !sticky top-0 py-2 ">
            {invoiceTableHeaders?.map(({ label, styling }) => (
              <TableHead
                key={label}
                className={`flex  dark:text-[#F6F6F6] flex-wrap break-words  text-[#000000] font-poppins  items-center !justify-start gap-x-1  !font-semibold text-sm w-[11.11%]   `}
              >
                {label == "Invoice Number" && (
                  <ArrowUp className="h-4 cursor-pointer" />
                )}{" "}
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
                  {new Array(9).fill(10 * Math.random())?.map((_, i) => {
                    return (
                      <TableHead
                        key={i}
                        className="flex  !text-left items-center justify-start  pb-4 !font-semibold !text-[#1C1C1E] !min-w-[11.11%] border-b  "
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
                  invoice_type,
                  document_priority,
                  assignment_details
                },
                index
              ) => {
                const timeRemaining = calculateTimeDifference(
                  new Date(assignment_details?.verification_due_at)
                );

                return (
                  <div key={index}>
                    <TableRow
                      onClick={(e) => {
                        setSelectedInvoiceVendorName(vendor?.vendor_name);
                        setSelectedInvoiceRestaurantName(
                          restaurant?.restaurant_name !== null
                            ? restaurant?.restaurant_name
                            : restaurant?.restaurant_id
                        );
                        navigate(
                          `/invoice-details/?page_number=${
                            (page - 1) * 15 + (index + 1)
                          }`
                        );
                      }}
                      className="flex gap-y-4  !font-poppins !text-sm w-[100%]  !text-[#1C1C1E] items-center  !border-none"
                    >
                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer!text-left break-word items-center justify-start gap-x-2  !font-normal !w-[11.11%] text-sm  ">
                        {getPropertyIcon(document_priority)} {invoice_number}
                      </TableCell>

                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-10 !text-left items-center justify-start   !font-normal !text-[#1C1C1E] !w-[11.11%]  text-sm ">
                        {restaurant?.restaurant_name !== null
                          ? restaurant?.restaurant_name
                          : restaurant?.restaurant_id}
                      </TableCell>

                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-10  !text-left items-center gap-x-4 justify-between  !font-normal !text-[#1C1C1E] !w-[11.11%]  !capitalize  text-sm break-words  ">
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

                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer text-sm  !text-left items-center justify-start !font-normal !text-[#1C1C1E] !w-[11.11%]   ">
                        {formatDateToReadable(date_uploaded?.split("T")[0])}
                      </TableCell>
                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer text-sm !text-left items-center justify-start !font-normal !text-[#1C1C1E] !w-[11.11%]   ">
                        {assignment_details
                          ? timeRemaining?.split("-").join("")
                          : "NA"}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          if (clickedInvoiceUUID == document_uuid) {
                            setClickedInvoiceUUID(null);
                          } else {
                            setClickedInvoiceUUID(document_uuid);
                            mutate(document_uuid, {
                              onSuccess: (data) => setTimeline(data)
                            });
                          }
                        }}
                        className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer text-sm  !text-left items-center justify-start  capitalize  !font-normal !text-[#1C1C1E] !w-[11.11%]  "
                      >
                        {auto_accepted === true
                          ? "Auto Accepted"
                          : rejected === true
                          ? "Rejected"
                          : human_verified == true
                          ? "Accepted"
                          : ""}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          if (clickedInvoiceUUID == document_uuid) {
                            setClickedInvoiceUUID(null);
                          } else {
                            setClickedInvoiceUUID(document_uuid);
                            mutate(document_uuid, {
                              onSuccess: (data) => setTimeline(data)
                            });
                          }
                        }}
                        className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer text-sm !text-left items-center justify-start  !font-normal !text-[#1C1C1E] !w-[11.11%]  "
                      >
                        {clickbacon_status}
                      </TableCell>

                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer  text-sm !text-left items-center justify-start !font-normal !text-[#1C1C1E] !w-[11.11%]  ">
                        {invoice_type}
                      </TableCell>
                      <TableCell className="flex dark:!text-[#F6F6F6] font-poppins cursor-pointer text-sm !text-left items-center justify-start !font-normal !text-[#1C1C1E] !w-[11.11%]">
                        {!human_verified_date
                          ? ""
                          : formatDateToReadable(
                              human_verified_date?.split("T")?.[0]
                            )}
                      </TableCell>
                    </TableRow>

                    {clickedInvoiceUUID == document_uuid && (
                      <div className="pl-[10rem]">
                        {isPending ? (
                          <div className="grid grid-cols-5 my-4 items-center  h-full">
                            {[1, 2, 3, 4, 5]?.map((_, i) => {
                              return <Skeleton className="w-44 h-4" />;
                            })}
                          </div>
                        ) : (
                          <Timeline timeline={timeline} />
                        )}
                      </div>
                    )}
                  </div>
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
