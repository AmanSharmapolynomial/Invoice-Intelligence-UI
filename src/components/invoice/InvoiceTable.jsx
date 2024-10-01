import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { invoiceTableHeaders } from "@/constants";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { BadgeCheck, CirclePlus } from "lucide-react";

const InvoiceTable = ({ data, isLoading }) => {
  return (
    <div className="w-full overflow-auto pb-4">
      <Table className="flex flex-col   box-border  scrollbar ">
        <TableHeader className="min-h-16">
          <TableRow className="flex  text-base  !border-none  ">
            {invoiceTableHeaders?.map(({ label, key }) => (
              <TableHead
                key={label}
                className="flex  !text-left items-center justify-start bg-gray-100 h-full pl-10 py-4 !font-bold !text-gray-800 !min-w-60 border-b  "
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <div className="flex-1 ">
          <TableBody className="flex-1 h-full  ">
            {isLoading
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => {
                  return (
                    <TableRow
                      className="flex  text-base  !border-none min-h-14"
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
                        "l",
                        "m"
                      ].map((_, i) => {
                        return (
                          <TableHead
                            key={i}
                            className="flex  !text-left items-center justify-start pl-10 pb-4 !font-semibold !text-gray-800 !min-w-60 border-b  "
                          >
                            {" "}
                            <Skeleton className={"w-24 h-5"} />
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  );
                })
              : data?.map(
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
                      invoice_type
                    },
                    index
                  ) => {
                    return (
                      <TableRow
                        className="flex  text-base items-center !min-h-14  !border-none"
                        key={index}
                      >
                        <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {invoice_number}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {channel}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {restaurant_name}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10  gap-x-2 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          <span> {vendor_name}</span>
                          <span>{verified_vendor && <BadgeCheck />}</span>
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {date_uploaded?.split("T")[0]}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-60 capitalize border-b  ">
                          {balance_type}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {""}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-10 !font-semibold !text-gray-800 !min-w-60 border-b pb- ">
                          {""}
                        </TableHead>

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pr-4 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {clickbacon_status}
                        </TableHead>
                        {/* item.failure_cause_code === 0 ||
                            item.failure_cause_code === 1 ||
                            item.failure_cause_code === 2 ||
                            item.failure_cause_code === 3 ||
                            item.failure_cause_code === 4
                              ? "red"
                              : item.failure_cause_code === 5
                              ? "yellow"
                              : item.failure_cause_code === 6
                              ? "orange"
                              : item.failure_cause_code === -1
                              ? "green"
                              : "black"
                          } */}
                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pr-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          <span
                            className={`h-5 w-5 rounded-full ${
                              [0, 1, 2, 3, 4].includes(
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

                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {""}
                        </TableHead>

                        <TableHead className="flex cursor-pointer !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-60 pr-8 border-b  ">
                          {!rejection_reason ? "-----" : rejection_reason}
                        </TableHead>
                        <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-10 !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {invoice_type}
                        </TableHead>
                        <TableHead className="flex cursor-pointer !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-60 border-b  ">
                          {!human_verified_date ? "-----" : human_verified_date}
                        </TableHead>
                      </TableRow>
                    );
                  }
                )}
          </TableBody>
        </div>
      </Table>
      <div className="w-full flex justify-center mt-2">
        <Link to={"/create-invoice"}>
          <Button className="flex gap-x-1">
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
