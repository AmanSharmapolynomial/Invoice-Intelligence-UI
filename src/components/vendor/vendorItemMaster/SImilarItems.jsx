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
import { keysCapitalizer } from "@/lib/helpers";

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

  

  return (
    <div className="max-h-72 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow
            className={`!text-white !rounded-none justify-between  w-full items-center  sm:text-sm `}
          >
            {data?.data?.required_columns?.map((v, i) => (
              <TableHead
                key={i}
                className={`${
                  i == 0 && "border-l"
                } font-semibold  items-center gap-x-4 text-black border-r `}
              >
              <div className="flex  gap-x-4 items-center">
              <div className=" flex  items-center">
                {i == 0 && (
                  <Checkbox
                  className="ml-1"
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
                      selectedItems.length ===
                        data?.data?.matching_items?.length
                    }
                  />
                )}
                </div>
                <span className={`${v!=="category"?"-ml-3":""} pt-1 `}> {keysCapitalizer(v)}</span>
              </div>
              </TableHead>
            ))}
            <TableHead className="font-semibold  items-center gap-x-4 text-black border-r px-[0.75rem]">
              Match Percentage
            </TableHead>
            <TableHead className="font-semibold items-center gap-x-4 text-black border-r px-[0.75rem]">
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
                  className={`!rounded-md w-full items-center justify-between text-xs sm:text-sm `}
                >
                  {data?.data?.required_columns?.map((v, i) => (
                    <TableCell
                      key={i}
                      className="border-r border-l border-b h-full  items-center justify-between !pr-8  w-auto  gap-x-4 px-[0.75rem]"
                    >
                      <div className="flex w-full justify-between gap-x-4">
                        <div className="flex items-center gap-x-4">
                          {i == 0 && (
                            <Checkbox
                              disabled={item_uuid == masterUUID}
                              checked={
                                selectedItems.includes(item_uuid) &&
                                item_uuid !== masterUUID
                              }
                              onCheckedChange={() =>
                                handleCheckboxChange(item_uuid)
                              }
                            />
                          )}
                          {/* <span>{data?.data?.matching_items[index][v]}</span> */}
                          <div>
                            <span>
                              {v == "category"
                                ? data?.data?.matching_items[index][`${v}`]
                                    ?.name || "---"
                                : data?.data?.matching_items[index][`${v}`]}
                            </span>
                          </div>
                          {i == 0 && human_verified && (
                            <img src={approved} alt="" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                  ))}

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
