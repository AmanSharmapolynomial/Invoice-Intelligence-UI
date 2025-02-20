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
  selectedItems,
  setSelectedItems,
  masterUUID,
  setMasterUUID
}) => {
  const handleCheckboxChange = (item_uuid) => {
    setSelectedItems((prev) =>
      prev.includes(item_uuid)
        ? prev.filter((id) => id !== item_uuid)
        : [...prev, item_uuid]
    );
  };

  const handleMasterCheckboxChange = (item_uuid) => {
    setMasterUUID((prev) => (prev === item_uuid ? null : item_uuid));
  };

  let similarCondition = data?.data?.matching_items?.some(
    (item) => item["human_verified"]
  );

  return (
    <div className="max-h-72 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow
            className={`!text-white !rounded-md w-full grid ${"grid-cols-4"} items-center justify-center text-xs sm:text-sm `}
          >
            <TableHead className="font-semibold text-black  items-center border-r border-l flex gap-x-4 px-[0.75rem]">
              <Checkbox
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems(
                      data?.data?.matching_items

                        ?.map((item) => item.item_uuid)
                        ?.filter((it) => it.item_uuid !== masterUUID)
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
            <TableHead className="font-semibold flex items-center text-black border-r px-[0.75rem]">
              Item Description
            </TableHead>
            <TableHead className="font-semibold text-black flex items-center border-r px-[0.75rem]">
              Similarity
            </TableHead>

            <TableHead className="font-semibold flex items-center text-black border-r px-[0.75rem]">
              Select Master
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
                  className={`!rounded-md w-full grid ${
                   "grid-cols-4" 
                  } items-center justify-center text-xs sm:text-sm `}
                >
                  <TableCell className="border-r border-l border-b h-full flex items-center gap-x-4 px-[0.75rem]">
                    <Checkbox
                      disabled={item_uuid == masterUUID}
                      checked={
                        selectedItems.includes(item_uuid) &&
                        item_uuid !== masterUUID
                      }
                      onCheckedChange={() => handleCheckboxChange(item_uuid)}
                    />
                    <span className="mt-1"> {item_code}</span>
                    {human_verified && <img src={approved} alt="" />}
                  </TableCell>
                  <TableCell className="border-r border-b h-full px-[0.75rem]">
                    {item_description}
                  </TableCell>
                  <TableCell className="border-r border-b h-full px-[0.75rem]">
                    {match_percentage}%
                  </TableCell>

                  <TableCell className="border-r border-b h-full px-[0.75rem]">
                    <Checkbox
                      disabled={selectedItems?.includes(masterUUID)}
                      checked={masterUUID === item_uuid}
                      onCheckedChange={() =>
                        handleMasterCheckboxChange(item_uuid)
                      }
                    />
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
