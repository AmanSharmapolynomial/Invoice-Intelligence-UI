import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import React from "react";

const SimilarItems = ({ data, isLoading }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow
          className={`!text-white !rounded-md w-full grid grid-cols-3 items-center justify-center text-xs sm:text-sm `}
        >
          <TableHead
            className={
              "cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r border-l items-center flex gap-x-4"
            }
          >
            <Checkbox />
            <span className="mt-1"> Item Code</span>
          </TableHead>
          <TableHead
            className={
              "cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r items-center flex gap-1"
            }
          >
            Item Description
          </TableHead>
          <TableHead
            className={
              "cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r items-center flex gap-1"
            }
          >
            Similarity{" "}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.matching_items?.map(
          ({ item_code, item_description, match_percentage }, index) => {
            return (
              <TableRow
                key={index}
                className={` !rounded-md w-full grid grid-cols-3 items-center justify-center text-xs sm:text-sm `}
              >
                <TableCell className="border-r border-l border-b h-full font-poppins px-[0.8rem] capitalize text-sm font-normal flex items-center gap-x-4 ">
                  <Checkbox />
                  <span className="mt-1"> {item_code}</span>
                </TableCell>
                <TableCell className="border-r border-b  h-full font-poppins px-[0.8rem] capitalize text-sm font-normal">
                  {item_description}
                </TableCell>
                <TableCell className="border-r h-full  border-b font-poppins px-[0.8rem] capitalize text-sm font-normal">
                  {match_percentage}%
                </TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
};

export default SimilarItems;
