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

  let similarCondition = data?.data?.matching_items?.some(
    (item) => item["human_verified"]
  );

  return (
    <div className="max-h-72 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow
            className={`!text-white !rounded-none w-full grid ${`grid-cols-${
              data?.data?.required_columns?.length + 2
            }`} items-center justify-center text-xs sm:text-sm `}
          >
            {data?.data?.required_columns?.map((v, i) => (
              <TableHead
                key={i}
                className={`${i==0&&"border-l"} font-semibold flex items-center gap-x-4 text-black border-r px-[0.75rem]"`}
              >
                {i == 0 && (
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
                      selectedItems.length ===
                        data?.data?.matching_items?.length
                    }
                  />
                )}
                <span className="pt-1"> {keysCapitalizer(v)}</span>
              </TableHead>
            ))}
            <TableHead className="font-semibold flex items-center gap-x-4 text-black border-r px-[0.75rem]">
              Match Percentage
            </TableHead>
            <TableHead className="font-semibold flex items-center gap-x-4 text-black border-r px-[0.75rem]">
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
                  className={`!rounded-md w-full grid ${`grid-cols-${
                    data?.data?.required_columns?.length + 2
                  }`} items-center justify-center text-xs sm:text-sm `}
                >
                  {data?.data?.required_columns?.map((v, i) => (
                    <TableCell
                      key={i}
                      className="border-r border-l border-b h-full flex items-center justify-between !pr-8   gap-x-4 px-[0.75rem]"
                    >
                    <div className="flex items-center gap-x-3 ">
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
                      <span>
                        {v == "category" ? data?.data?.matching_items[index][`${v}`]?.name ||"---":
                          data?.data?.matching_items[index][`${v}`]}
                      </span>
                    </div>
                      {i == 0 && human_verified && (
                        <img src={approved} alt="" />
                      )}
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
