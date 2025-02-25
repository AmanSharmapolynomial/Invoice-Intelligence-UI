import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const BulkCategorizationTable = ({ data, isLoading, columns,searchTerm }) => {
  return (
    <div className="w-full mt-4 ">
      {/* Table wrapper with horizontal and vertical scroll */}
      <div className="md:h-[65vh] sm:h-[65vh] 2xl:h-[70vh] overflow-y-auto overflow-x-auto  relative rounded-lg">
        <Table className="w-full min-w-[600px]">
          {/* Table Header */}
          <TableHeader>
            <TableRow className="border-b border-t border-t-[#E0E0E0] border-b-[#E0E0E0]  ">
              {columns?.map(({ label, key }) => (
                <TableHead
                  key={key}
                  className="!font-poppins !font-semibold text-sm md:text-base leading-5 text-black px-4 md:px-6"
                >
                  <div
                    className={`flex ${
                      key?.includes("[") ? "justify-start" : "justify-center"
                    } items-center`}
                  >
                    {label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {isLoading &&
              new Array(10).fill(0).map((_, index) => (
                <TableRow className="border-none h-[3.75rem]">
                  {[0, 1, 2, 3, 4]?.map((it) => (
                    <TableCell key={it} >
                      <Skeleton className={"w-full h-4"} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {data?.data?.filter((it)=>it?.category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()))?.map((item, index) => (
              <TableRow key={index} className="border-none h-[3.75rem]">
                {columns?.map(({ key }) => (
                  <TableCell
                    key={key}
                    className={`!font-poppins !font-normal text-sm md:text-base leading-5 text-black w-1/5 px-4 md:px-6 ${
                      key?.includes("[") ? "pl-4 md:pl-6" : ""
                    }`}
                  >
                    <div
                      className={`flex ${
                        key?.includes("[") ? "justify-start" : "justify-center"
                      } items-center`}
                    >
                      {key?.includes("[")
                        ? key.split("[")[0] === "category"
                          ? item.category.name
                          : item[key]
                        : item[key]}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkCategorizationTable;
