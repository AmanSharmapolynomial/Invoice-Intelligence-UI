import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Skeleton } from "../ui/skeleton";
import no_data from "@/assets/image/no-data.svg";
import { Button } from "../ui/button";
import { Delete, Edit, Trash, Trash2, Verified } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "../ui/checkbox";
const VendorBranchesTable = ({ data = [], isLoading }) => {
  return (
    <Table className="flex flex-col   box-border  scrollbar ">
      <TableHeader className="min-h-16">
        <TableRow className="flex text-base  !border-none  ">
          <TableHead className="flex  border-r !text-left items-center justify-start  !font-semibold !text-gray-800  !max-w-[20%] !min-w-[20%]  border-b pl-6  bg-gray-200 !h-14">
            Vendor Address
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Document Count
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center   !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Creation Date
          </TableHead>

          <TableHead className="flex  border-r !min-h-10  gap-x-2 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Select Master
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Select For Merge
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center   !font-semibold !text-gray-800 !min-w-[10%] capitalize border-b  bg-gray-200 h-14">
            Migrate
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-[10%] border-b pb- bg-gray-200 h-14">
            View Invoice
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Edit
          </TableHead>

          <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
            Delete
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="flex-1 h-full  w-full">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => {
            return (
              <TableRow
                className="flex  !text-sm !border-none !min-h-16"
                key={index}
              >
                {["a", "b", "c", "d", "e", "f", "g", "h"].map((_, i) => {
                  return (
                    <TableHead
                      key={i}
                      className="flex  !text-left items-center justify-center pl-8 pb-4 !font-semibold !text-gray-800 !min-w-52 border-b  "
                    >
                      {" "}
                      <Skeleton className={"w-36 h-5"} />
                    </TableHead>
                  );
                })}{" "}
              </TableRow>
            );
          })
        ) : data && Object?.keys(data)?.length > 0 ? (
          data?.map(
            (
              {
                vendor_address,
                created_date,
                human_verified,
                document_count,
                branch_id,
                verified_by
              },
              index
            ) => {
              return (
                <TableRow
                  className="flex !w-[100%]  text-base !items-center leading-5  !min-h-16  !border-none"
                  key={index}
                >
                  <TableHead className="flex  border-r !text-left justify-between items-center gap-x-4 pl-6  !font-normal !text-gray-800 !min-w-[20%]  border-b py-8 min-h-16 ">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center justify-between gap-x-2">
                          {" "}
                          <Link
                            to={`/vendor-branch-details/${branch_id}`}
                            className="underline underline-offset-2 "
                          >
                            {vendor_address?.length > 20
                              ? vendor_address?.slice(0, 35) + "..."
                              : vendor_address}
                          </Link>
                          <span>{human_verified && <Verified />}</span>
                        </TooltipTrigger>
                        <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm">
                          <p>{vendor_address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16 !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-[10%] border-b ">
                    {document_count}{" "}
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16  gap-x-2 !text-left items-center justify-center  !font-normal !text-gray-800 !min-w-[10%] border-b  ">
                    {created_date?.split("T")[0]}{" "}
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[10%] border-b  ">
                    <Checkbox className="h-4 w-4" />
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16 !text-left items-center justify-center  capitalize !font-normal !text-gray-800 !min-w-[10%] border-b ">
                    <Checkbox className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center  capitalize !font-normal !text-gray-800 !min-w-[10%] border-b ">
                    <Button className="font-normal">Migrate</Button>
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[10%] border-b">
                    <Button className="font-normal">View</Button>
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[10%] border-b">
                    <Button>
                      <Edit className="h-4" />
                    </Button>
                  </TableHead>

                  <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center  !font-normal !text-gray-800 !min-w-[10%] border-b  ">
                    <Button>
                      <Trash2 className="h-4"/>
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
        )}{" "}
      </TableBody>
    </Table>
  );
};

export default VendorBranchesTable;
