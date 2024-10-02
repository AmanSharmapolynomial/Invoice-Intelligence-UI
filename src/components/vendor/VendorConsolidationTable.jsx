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
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import no_data from "@/assets/image/no-data.svg";
const VendorConsolidationTable = ({ data, isLoading }) => {
  return (
    <>
      <Table className="flex flex-col   box-border  scrollbar ">
        <TableHeader className="min-h-16">
          <TableRow className="flex  text-base  !border-none  ">
            <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start  !font-semibold !text-gray-800 !min-w-60 border-b pl-6  bg-gray-200 h-14">
              Vendor Name
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-6 !font-semibold !text-gray-800 !min-w-60 border-b  bg-gray-200 h-14">
              Vendor Category
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-semibold !text-gray-800 !min-w-36 border-b  bg-gray-200 h-14">
              Creation Date
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10  gap-x-2 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-40 border-b  bg-gray-200 h-14">
              Document Count
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-40 border-b  bg-gray-200 h-14">
              Branch Count
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-semibold !text-gray-800 !min-w-48 capitalize border-b  bg-gray-200 h-14">
              Verified Branch Count
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-4 !font-semibold !text-gray-800 !min-w-40 border-b pb- bg-gray-200 h-14">
              Item Count
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-48 border-b  bg-gray-200 h-14">
              Verified Item Count
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-44 border-b  bg-gray-200 h-14">
              Verified By
            </TableHead>

            <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-36 border-b bg-gray-200 h-14 ">
              View Invoice
            </TableHead>

            <TableHead className="flex cursor-pointer !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-36  border-b border-r  bg-gray-200 h-14">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <div className="flex-1 ">
          <TableBody className="flex-1 h-full  ">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => {
                return (
                  <TableRow
                    className="flex  !text-sm !border-none min-h-14"
                    key={index}
                  >
                    {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map(
                      (_, i) => {
                        return (
                          <TableHead
                            key={i}
                            className="flex  !text-left items-center justify-center pl-8 pb-4 !font-semibold !text-gray-800 !min-w-52 border-b  "
                          >
                            {" "}
                            <Skeleton className={"w-36 h-5"} />
                          </TableHead>
                        );
                      }
                    )}
                  </TableRow>
                );
              })
            ) : data && Object?.keys(data)?.length > 0 ? (
              data?.map(
                (
                  {
                    vendor_id,
                    vendor_name,
                    created_date,
                    human_verified,
                    vendor_category,
                    branch_count,
                    verified_branch_count,
                    document_count,
                    item_count,
                    verified_item_count,
                    verified_by
                  },
                  index
                ) => {
                  return (
                    <TableRow
                      className="flex  text-base items-center !min-h-14  !border-none"
                      key={index}
                    >
                      <TableHead className="flex cursor-pointer border-r !text-left items-center justify-start pl-6  !font-semibold !text-gray-800 !min-w-60 border-b  ">
                        {vendor_name}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-start pl-4  !font-semibold !text-gray-800 !min-w-60 border-b  ">
                        {vendor_category}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10  gap-x-2 !text-left items-center justify-start pl-4 !font-semibold !text-gray-800 !min-w-36 border-b  ">
                        {created_date?.split("T")[0]}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-40 border-b  ">
                        {document_count}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  capitalize !font-semibold !text-gray-800 !min-w-40 border-b ">
                        {branch_count}
                      </TableHead>
                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  capitalize pl-4 !font-semibold !text-gray-800 !min-w-48 border-b pb- ">
                        {verified_branch_count}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center pl-4 !font-semibold !text-gray-800 !min-w-40 border-b  ">
                        {item_count}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-48 border-b  ">
                        {verified_item_count}
                      </TableHead>

                      <TableHead className="flex cursor-pointer border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-44 border-b  ">
                        {verified_by}
                      </TableHead>

                      <TableHead className="flex cursor-pointer !text-left items-center justify-center pb-3  !font-semibold !text-gray-800 !min-w-36  border-b border-r  ">
                        <Button>View </Button>
                      </TableHead>

                      <TableHead className="flex cursor-pointer !text-left items-center justify-center   !font-semibold !text-gray-800 !min-w-36  pb-3 border-b border-r  ">
                        <Button>
                          <Trash />
                        </Button>
                      </TableHead>
                    </TableRow>
                  );
                }
              )
            ) : (
              <div className="flex justify-center items-center h-[60vh] !w-[90vw]">
                <img src={no_data} alt="" className="flex-1 h-full" />
              </div>
            )}
          </TableBody>
        </div>
      </Table>
    </>
  );
};

export default VendorConsolidationTable;
