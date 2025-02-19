import { Checkbox } from "@/components/ui/checkbox";
import approved from "@/assets/image/approved.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import React from "react";

const SimilarItems = ({
  data,
  isLoading,
  isPending,
  mutate,
  selectedItems,
  setSelectedItems
}) => {
  const handleCheckboxChange = (item_uuid) => {
    setSelectedItems(
      (prev) =>
        prev.includes(item_uuid)
          ? prev.filter((id) => id !== item_uuid) // Remove if already selected
          : [...prev, item_uuid] // Add if not selected
    );
  };

  return (
    <div className="max-h-72 overflow-auto">
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
              <Checkbox
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems(
                      data?.data?.matching_items?.map((item) => item.item_uuid)
                    );
                  } else {
                    setSelectedItems([]);
                  }
                }}
                checked={
                  selectedItems.length > 0 &&
                  selectedItems.length === data?.data?.matching_items?.length
                }
              />
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
            (
              {
                item_code,
                item_description,
                match_percentage,
                item_uuid,
                human_verified
              },
              index
            ) => {
              return (
                <TableRow
                  key={index}
                  className={` !rounded-md w-full grid grid-cols-3 items-center justify-center text-xs sm:text-sm `}
                >
                  <TableCell className="border-r border-l border-b h-full font-poppins px-[0.75rem] capitalize text-sm font-normal flex items-center gap-x-4 ">
                    <Checkbox
                      checked={selectedItems.includes(item_uuid)}
                      onCheckedChange={() => handleCheckboxChange(item_uuid)}
                    />
                    <span className="mt-1"> {item_code}</span>
                    {human_verified && <img src={approved} alt="" />}
                  </TableCell>
                  <TableCell className="border-r border-b  h-full font-poppins px-[0.75rem] capitalize text-sm font-normal">
                    {item_description}
                  </TableCell>
                  <TableCell className="border-r h-full  border-b font-poppins px-[0.75rem] capitalize text-sm font-normal">
                    {match_percentage}%
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimilarItems;
