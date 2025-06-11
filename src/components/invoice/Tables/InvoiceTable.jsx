import approved from "@/assets/image/approved.svg";
import no_data from "@/assets/image/no-data.svg";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import ReactDOM from "react-dom";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { invoiceTableHeaders } from "@/constants";
import { calculateTimeDifference, formatDateToReadable } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import globalStore from "@/store/globalStore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGetDocumentTimeLine, useUpdateDocumentPriority } from "../api";
import Timeline from "../Timeline";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFilterStore from "@/store/filtersStore";
import {
  CheckCheck,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Equal
} from "lucide-react";
function getPropertyIcon(priority) {
  if (priority == "HIGHEST") {
    return (
      <CustomTooltip
        content={
          <p className="flex flex-col gap-y-1 justify-center items-center">
            <span>HIGHEST</span>
            <span>Click To Change </span>
          </p>
        }
        top={2}
      >
        <ChevronsUp className="w-4 object-fill  text-red-500 cursor-pointer" />
      </CustomTooltip>
    );
  }

  if (priority == "LOWEST") {
    return (
      <CustomTooltip content={"LOWEST"} top={2}>
        <ChevronsDown className=" object-fill h-4  text-blue-500 cursor-pointer" />
      </CustomTooltip>
    );
  }

  if (priority == "HIGH") {
    return (
      <CustomTooltip content={"HIGH"} top={2}>
        <ChevronUp className="w-4 object-fill h-4  text-orange-400 cursor-pointer" />
      </CustomTooltip>
    );
  }

  if (priority == "LOW") {
    return (
      <CustomTooltip content={"LOW"} top={2}>
        <ChevronDown className=" object-fill h-4  text-orange-400 cursor-pointer" />
      </CustomTooltip>
    );
  }

  if (priority == "MEDIUM") {
    return (
      <CustomTooltip content={"MEDIUM"} top={2}>
        <Equal className=" object-fill h-4  text-orange-700 cursor-pointer" />
      </CustomTooltip>
    );
  }

  if (priority == "COMPLETED") {
    return (
      <CustomTooltip content={"COMPLETED"}>
        <CheckCheck className=" object-fill h-4 !z-50  text-primary cursor-pointer" />
      </CustomTooltip>
    );
  }
}
const InvoiceTable = ({
  data = [],
  isLoading,
  height,
  review_later = false
}) => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const [clickedInvoiceUUID, setClickedInvoiceUUID] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const { setSelectedInvoiceRestaurantName, setSelectedInvoiceVendorName } =
    globalStore();
  const navigate = useNavigate();
  let page = searchParams.get("page") || 1;
  let sort_order = searchParams.get("sort_order") || "desc";
  let document_priority = searchParams.get("document_priority") || "all";

  const [changePriorityModal, setChangePriorityModal] = useState({
    state: false,
    document_uuid: null,
    priority: null
  });

  const { mutate, isPending } = useGetDocumentTimeLine();
  const { mutate: updatePriority, isPending: updatingPriority } =
    useUpdateDocumentPriority();
  const { filters, setFilters } = useFilterStore();

  useEffect(() => {
    if (review_later) {
      setFilters({ ...filters, review_later: "true" });
    }
  }, [review_later]);
  let { pathname } = useLocation();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    documentUuid: "",
    index: null
  });
  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="w-full overflow-auto  dark:bg-[#051C14] mb-1.5 dark:border-b dark:border-r dark:border-l dark:border-primary ">
      <Table
        className={`flex flex-col  show-scrollbar custom-scrollbar box-border  scrollbar max-h-[${
          height - 1
        }vh]  `}
        style={{ height: `${height}vh` }}
      >
        <TableHeader className="sticky top-0 !bg-white dark:!bg-transparent border-b !z-20">
          <TableRow className="flex  text-base  !sticky top-0  !border-t  !border-b-0 border-l !min-h-16  !max-h-fit bg-white !z-50">
            {invoiceTableHeaders?.map(({ label, styling }, i) => (
              <TableHead
                key={label}
                className={`flex ${
                  review_later
                    ? "!w-[9.090909090909091%] !pl-[0.9rem]"
                    : "!w-[10%]"
                } !h-full !min-h-16 !max-h-fit !pt-0 dark:text-[#F6F6F6] !text-center flex-wrap break-words  text-[#000000] font-poppins  !border-r  items-center !justify-start gap-x-1 ${
                  !review_later && styling
                } !font-semibold text-sm !border-b-0   ${
                  data && Object?.keys(data)?.length > 0 ? "" : " "
                }  ${label === "Invoice #" && " !pl-2"} ${
                  i !== invoiceTableHeaders?.length - 1 ? "!border-r" : "!"
                }`}
              >
                {label == "Load Date" && (
                  <>
                    {sort_order == "desc" && (
                      <CustomTooltip
                        content={"Click To Sort In Ascending Order."}
                      >
                        <ArrowUp
                          className="h-4 cursor-pointer"
                          onClick={() => {
                            updateParams({ sort_order: "asc" });
                            setFilters({ ...filters, sort_order: "asc" });
                          }}
                        />
                      </CustomTooltip>
                    )}
                    {sort_order == "asc" && (
                      <CustomTooltip
                        content={"Click To Sort In Descending Order."}
                      >
                        <ArrowDown
                          className="h-4 cursor-pointer"
                          onClick={() => {
                            updateParams({ sort_order: "desc" });
                            setFilters({ ...filters, sort_order: "desc" });
                          }}
                        />
                      </CustomTooltip>
                    )}
                  </>
                )}
                {label == "Invoice #" && (
                  <>
                    {document_priority == "desc" && (
                      <CustomTooltip
                        content={"Click To Sort Priority In Ascending Order."}
                      >
                        <ArrowUp
                          className="h-4 cursor-pointer"
                          onClick={() => {
                            updateParams({ document_priority: "asc" });
                            setFilters({
                              ...filters,
                              document_priority: "asc"
                            });
                          }}
                        />
                      </CustomTooltip>
                    )}
                    {document_priority == "asc" && (
                      <CustomTooltip
                        content={"Click To Sort Priority In Descending Order."}
                      >
                        <ArrowDown
                          className="h-4 cursor-pointer"
                          onClick={() => {
                            updateParams({ document_priority: "desc" });
                            setFilters({
                              ...filters,
                              document_priority: "desc"
                            });
                          }}
                        />
                      </CustomTooltip>
                    )}
                  </>
                )}

                {label == "Invoice #" && (
                  <span
                    className={`!mr-2  border-r h-full !min-h-16 !max-h-fit !w-[25.5%]`}
                  />
                )}
                {label}
              </TableHead>
            ))}
            {review_later && (
              <TableHead
                className={`flex  dark:text-[#F6F6F6] flex-wrap break-words !min-h-16 !max-h-fit  border-r text-[#000000] font-poppins  items-center !justify-start !pl-[0.7rem] gap-x-1  !font-semibold text-sm !w-[10%]   `}
              >
                Comments
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody
          className="flex-1 !w-[100%] "
          style={{ height: `${height}vh` }}
        >
          {contextMenu.visible &&
            ReactDOM.createPortal(
              <div
                className="fixed z-50 bg-white shadow-lg rounded border text-sm w-48"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onMouseLeave={() =>
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }
              >
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    window.open(
                      `/invoice-details/?page_number=${
                        (page - 1) * 10 + ((contextMenu.index ?? 0) + 1)
                      }&from_view=${
                        pathname?.includes("review")
                          ? "review_later"
                          : pathname?.includes("my-tasks")
                          ? "my-tasks"
                          : pathname?.includes("not-supported")
                          ? "not-supported-documents"
                          : "invoice_listing"
                      }`,
                      "_blank"
                    );
                    setContextMenu((prev) => ({ ...prev, visible: false }));
                  }}
                >
                  Open in New Tab
                </div>
              </div>,
              document.body
            )}

          {isLoading ? (
            new Array(16)?.fill(1)?.map((_, index) => {
              return (
                <TableRow
                  className=" w-[100%] items-center gap-x-0 !text-sm  min-h-14 "
                  key={index}
                >
                  {new Array(10).fill(10 * Math.random())?.map((_, i) => {
                    return (
                      <TableHead
                        key={i}
                        className={`!text-left  py-4  justify-normal !font-semibold !text-[#1C1C1E]  border ${
                          i !== 9 || i !== 8 ? "!w-[9.0999%]" : "!w-[9.099%]"
                        }    `}
                      >
                        {" "}
                        {i == 0 ? (
                          <div className="flex items-center gap-x-2">
                            <div className="">
                              <Skeleton className={` min-w-10 h-5`} />
                            </div>
                            <div className=" min-h-full">
                              <Skeleton className={` min-w-[6.25rem] h-5`} />
                            </div>
                          </div>
                        ) : (
                          <Skeleton className={` min-w-24 h-5`} />
                        )}
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
                  assignment_details,
                  review_later_details,
                  extraction_source
                },
                index
              ) => {
                const timeRemaining = calculateTimeDifference(
                  new Date(assignment_details?.verification_due_at)
                );

                return (
                  <div key={index} className="relative">
                    <TableRow
                      onContextMenu={(e) => {
                        e.preventDefault();
                        console.log("Right clicked on", {
                          document_uuid,
                          index
                        });
                        setContextMenu({
                          visible: true,
                          x: e.pageX,
                          y: e.pageY,
                          documentUuid: document_uuid,
                          index: index
                        });
                      }}
                      onClick={(e) => {
                        setSelectedInvoiceVendorName(vendor?.vendor_name);
                        setSelectedInvoiceRestaurantName(
                          restaurant?.restaurant_name !== null
                            ? restaurant?.restaurant_name
                            : restaurant?.restaurant_id
                        );
                        navigate(
                          `/invoice-details/?page_number=${
                            (page - 1) * 10 + (index + 1)
                          }&from_view=${
                            pathname?.includes("review")
                              ? "review_later"
                              : pathname?.includes("my-tasks")
                              ? "my-tasks"
                              : pathname?.includes("not-supported")
                              ? "not-supported-documents"
                              : "invoice_listing"
                          }`
                        );
                      }}
                      className={`${
                        index == 0 ? "!border-t" : "!border-t-0"
                      }  flex !py-0  !font-poppins  !min-h-16 !max-h-44  !text-sm w-[100%]  !text-[#1C1C1E] items-center  !border   ${
                        index == data?.length - 1 ? "!border-b" : "!border-b-0"
                      } w-full`}
                    >
                      <TableCell
                        className={`flex dark:!text-[#F6F6F6] !h-full !min-h-16 !max-h-44 font-poppins  cursor-pointer !text-left  justify-start gap-x-2 !p-0 !font-normal ${
                          review_later
                            ? "!w-[9.090909090909091%]"
                            : "!w-[10%] pl-2 border-r "
                        }  text-sm  `}
                      >
                        <div className=" w-full flex  ">
                          <div className="border-r !w-[30%] flex mr-4 justify-center  !items-center h-full">
                            <div
                              className=" pt-[3px]  !break-word truncate"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChangePriorityModal({
                                  state: true,
                                  document_uuid: document_uuid
                                });
                              }}
                            >
                              {getPropertyIcon(document_priority)}
                            </div>{" "}
                          </div>
                          <div className=" flex !w-[70%] justify-start items-center !break-word  whitespace-normal truncate">
                            <div className="!break-word  whitespace-normal truncate">
                              {" "}
                              {invoice_number}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        className={` dark:!text-[#F6F6F6] border-r-0  !min-h-16 !max-h-44  flex font-poppins cursor-pointer !text-left items-center justify-start  !break-word whitespace-normal !font-normal !text-[#1C1C1E] ${
                          review_later
                            ? "!w-[9.090909090909091%] border-l"
                            : "!w-[10%] "
                        } text-sm `}
                      >
                        <div className="flex items-center justify-between w-full gap-x-4">
                          <span>
                            {" "}
                            {restaurant?.restaurant_name !== null
                              ? restaurant?.restaurant_name
                              : restaurant?.restaurant_id}
                          </span>
                          {restaurant?.tier && (
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
                          )}
                        </div>
                      </TableCell>

                      <TableCell
                        className={` ${
                          review_later ? "!w-[9.090909090909091%]" : "!w-[10%] "
                        } flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-16 !max-h-44 !h-full border-l  !text-left items-center gap-x-2 justify-start !break-word whitespace-normal truncate  !font-normal !text-[#1C1C1E]   !capitalize  text-sm break`}
                      >
                        <span
                          className={`${
                            vendor?.human_verified && "text-primary"
                          } w-[80%]`}
                        >
                          {" "}
                          {vendor?.vendor_name}
                        </span>
                        <span className="w-[20%]">
                          {vendor?.["human_verified"] && (
                            <img
                              src={approved}
                              className="text-primary !h-4 !w-5  "
                            />
                          )}
                        </span>
                      </TableCell>

                      <TableCell
                        className={`flex dark:!text-[#F6F6F6] font-poppins !min-h-16 !max-h-44 !h-full  border-l cursor-pointer text-sm  !text-left items-center justify-start !break-word whitespace-normal !font-normal !text-[#1C1C1E] ${
                          review_later
                            ? "!w-[9.090909090909091%] pl-[0.9rem]"
                            : "!w-[10%] pl-[1.05rem]"
                        }   `}
                      >
                        {formatDateToReadable(date_uploaded?.split("T")[0])}
                      </TableCell>

                      <TableCell
                        className={`${
                          review_later
                            ? "!w-[9.090909090909091%] !pl-[0.9rem]"
                            : "!w-[10%] pl-[1rem]"
                        } flex dark:!text-[#F6F6F6] ${
                          (rejected || human_verified) && "!text-primary"
                        } font-poppins cursor-pointer !min-h-16 !max-h-44 text-sm w-full border-l h-full !text-left items-center justify-start !break-word whitespace-normal !font-normal text-[#1C1C1E] ${
                          timeRemaining?.includes("ago") && "text-[#F15156]"
                        } `}
                      >
                        <CustomTooltip
                          className={"!min-w-[15rem]"}
                          content={`Asssigned To :- ${assignment_details?.assigned_to?.username}`}
                        >
                          <div className="w-full ">
                            {(assignment_details &&
                              (rejected || human_verified)) ||
                            auto_accepted
                              ? "Completed"
                              : (assignment_details &&
                                  timeRemaining?.split("-").join("")) ||
                                "NA"}
                          </div>
                        </CustomTooltip>
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
                        className={`${
                          review_later
                            ? "!w-[9.090909090909091%] pl-[0.9rem]"
                            : "!w-[10%] pl-[1rem]"
                        } flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-16 !max-h-44 text-sm border-l h-full  items-center justify-start text-left pr-[7.25rem] !break-word whitespace-normal  capitalize  !font-normal !text-[#1C1C1E] 
                        ${
                          auto_accepted
                            ? "!text-[#348355]"
                            : rejected === true
                            ? "!text-[#F15156]"
                            : human_verified == true
                            ? "!text-[#348355]"
                            : "NA"
                        }
                        
                        `}
                      >
                        {auto_accepted === true
                          ? "Auto Accepted"
                          : rejected === true
                          ? "Rejected"
                          : human_verified == true
                          ? "Accepted"
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
                        className={` ${
                          review_later
                            ? "!w-[9.0909090909090910909091%] !pl-[0.8rem]"
                            : "!w-[10%] !pl-[0.9rem]"
                        } flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-16 !max-h-44 text-sm border-l h-full !text-left items-center !justify-start  !font-normal !break-word whitespace-normal !text-[#1C1C1E]  `}
                      >
                        {clickbacon_status}
                      </TableCell>

                      <TableCell
                        className={`${
                          review_later
                            ? "!w-[9.090909090909091%] pl-[0.9rem] "
                            : "!w-[10%] pl-[0.9rem]"
                        } flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-16 !max-h-44 border-l h-full  text-sm !text-left items-center justify-start !font-normal !text-[#1C1C1E] !break-word whitespace-normal  `}
                      >
                        {invoice_type}
                      </TableCell>
                      <TableCell
                        className={`${
                          review_later
                            ? "!w-[9.090909090909091%] pl-[0.9rem]"
                            : "!w-[10%] pl-[0.9rem]"
                        } flex dark:!text-[#F6F6F6] font-poppins cursor-pointer !min-h-16 !max-h-44 border-l h-full text-sm !text-left items-center justify-start !font-normal !text-[#1C1C1E] !break-word whitespace-normal `}
                      >
                        {!human_verified_date
                          ? "NA"
                          : formatDateToReadable(
                              human_verified_date?.split("T")?.[0]
                            ) || "NA"}
                      </TableCell>

                      <TableCell className="flex capitalize dark:!text-[#F6F6F6] pl-4  !min-h-16 !max-h-44 font-poppins cursor-pointer text-sm !text-left items-center justify-start border-l h-full !break-word whitespace-normal  !font-normal !text-[#1C1C1E] !w-[10%] ">
                        {extraction_source}
                      </TableCell>

                      {review_later && (
                        <TableCell className="flex capitalize dark:!text-[#F6F6F6]  !min-h-16 !max-h-44 font-poppins cursor-pointer text-sm !text-left items-center justify-start border-l h-full !break-word whitespace-normal  !font-normal !text-[#1C1C1E] !w-[10%] ">
                          {review_later_details?.comments}
                        </TableCell>
                      )}
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

                    {changePriorityModal?.state == true &&
                      changePriorityModal?.document_uuid == document_uuid && (
                        <div
                          onMouseLeave={() => {
                            setChangePriorityModal({
                              state: false,
                              document_uuid: null,
                              priority: null
                            });
                          }}
                          style={{
                            boxShadow: "4px 4px 8px 0px rgba(0, 0, 0, 0.12)"
                          }}
                          className="absolute  top-10 left-8 rounded-md min-h-56 p-4 w-44 bg-white z-50 border"
                        >
                          <p className="font-poppins  font-bold text-sm leading-4 text-[#000000] tracking-normal">
                            Priority
                          </p>
                          <RadioGroup
                            defaultValue={document_priority}
                            onValueChange={(v) => {
                              setChangePriorityModal({
                                ...changePriorityModal,
                                priority: v
                              });
                            }}
                            className="flex flex-col   gap-y-4 mt-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="HIGHEST"
                                id="HIGHEST"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <ChevronsUp className="h-5 text-red-500" />
                              <Label htmlFor="HIGHEST">Highest</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="HIGH" id="HIGH" />
                              <ChevronDown className=" object-fill h-5  text-orange-400 cursor-pointer" />
                              <Label htmlFor="HIGH">High</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="MEDIUM" id="MEDIUM" />
                              <Equal className=" object-fill h-5 text-center text-orange-700 cursor-pointer" />
                              <Label htmlFor="MEDIUM">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="LOW" id="LOW" />
                              <ChevronDown className=" object-fill h-5  text-orange-400 cursor-pointer" />
                              <Label htmlFor="LOW">Low</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="LOWEST" id="LOWEST" />
                              <ChevronsDown className=" object-fill h-5  text-blue-500 cursor-pointer" />
                              <Label htmlFor="LOWEST">Lowest</Label>
                            </div>
                          </RadioGroup>

                          {changePriorityModal?.priority && (
                            <Button
                              onClick={() => {
                                updatePriority(
                                  {
                                    document_uuid:
                                      changePriorityModal?.document_uuid,
                                    priority: changePriorityModal?.priority
                                  },
                                  {
                                    onSuccess: () => {
                                      setChangePriorityModal({
                                        state: false,
                                        document_uuid: null,
                                        priority: null
                                      });
                                    }
                                  }
                                );
                              }}
                              className="text-xs h-[1.5rem] font-normal mt-4 relative  left-14  font-poppins"
                            >
                              {updatingPriority ? "Updating.." : "Update"}
                            </Button>
                          )}
                        </div>
                      )}
                  </div>
                );
              }
            )
          ) : (
            <div className="flex justify-center items-center h-full !w-full !overflow-hidden">
              <img
                src={no_data}
                alt=""
                className="flex-1 h-96 overflow-hidden"
              />
            </div>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
