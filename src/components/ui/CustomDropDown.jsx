import React, { useEffect, useState, useMemo, useCallback } from "react";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { getValueFromLabel } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Archive, Check, ChevronDown, Link2 } from "lucide-react";
import approved from "@/assets/image/approved.svg";
import { Link } from "react-router-dom";
import { Checkbox } from "./checkbox";
import { OLD_UI } from "@/config";
import { FixedSizeList as List } from "react-window";
import debounce from "lodash.debounce";
import { Input } from "./input";
import CustomTooltip from "./Custom/CustomTooltip";

const CustomDropDown = ({
  data = [],
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  className,
  triggerClassName,
  Value,
  contentClassName,
  showCustomItems = false,
  children,
  Key = "value",
  showSearch = true,
  onBlur = () => {},
  showVendorAsLink = false,
  showBranchAsLink = false,
  multiSelect = false,
  vendor_id,
  branch_id,
  commandGroupClassName
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Value || "");
  const [item, setItem] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (Value !== undefined) {
      setValue(Value);
    }
  }, [Value]);

  useEffect(() => {
    if (multiSelect && Value !== "none") {
      setItemsArray(
        Value ? (typeof Value === "string" ? Value.split(",") : [Value]) : []
      );
    }
  }, [multiSelect, Value]);

  const handleSelect = useCallback(
    (currentValue, item) => {
      const newValue = currentValue === value ? "" : currentValue;
      setValue(newValue);
      setOpen(false);
      setItem(item);
      !multiSelect
        ? onChange(getValueFromLabel(data, newValue), item)
        : onChange(itemsArray, item);
    },
    [value, multiSelect, onChange, itemsArray, data]
  );

  const handleSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data]
      .filter((item) =>
        item.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (itemsArray.includes(a.value)) return -1;
        if (itemsArray.includes(b.value)) return 1;
        return 0;
      });
  }, [data, itemsArray, searchTerm]);

  const renderTriggerContent = () => {
    if (multiSelect) return placeholder;

    if (showBranchAsLink || showVendorAsLink) {
      const selectedItem = data.find(
        (item) => item[Key] == (showBranchAsLink ? value?.branch_id : value)
      );
      return (
        <Link
          target="_blank"
          to={
            showVendorAsLink
              ? `${OLD_UI}/vendor-consolidation-v2/${selectedItem?.value}`
              : showBranchAsLink
              ? `${OLD_UI}/vendor-consolidation-v2/branches/${vendor_id}`
              : null
          }
          className="flex items-center gap-x-2"
        >
          <Link2 className="text-[#348355] !h-4 !w-4" />
          <span className="text-[#348355] text-sm w-full font-poppins font-normal truncate">
            {selectedItem
              ? selectedItem?.label?.slice(0, 50) +
                (selectedItem?.label?.length > 50 ? ".." : "")
              : placeholder}
          </span>
          {selectedItem?.human_verified && (
            <img
              src={approved}
              className="text-primary !h-4 !w-5"
              alt="Approved"
            />
          )}
        </Link>
      );
    }

    const selectedItem = data.find((item) => item[Key] == value);
    return (
      <div className="flex items-center gap-x-2">
        <span className="!truncate">
          {value && value !== "none"
            ? selectedItem
              ? `${selectedItem.label?.slice(0, 50)}${
                  selectedItem.label?.length > 100 ? "....." : ""
                }`
              : typeof value === "string"
              ? value
              : Value?.vendor_address
            : placeholder}
        </span>
        {item?.human_verified && (
          <img
            src={approved}
            className="text-primary !h-4 !w-5"
            alt="Approved"
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    setFocusedIndex(sortedData.findIndex((item) => item.value === value));
  }, [Value]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={`${className} dark:!border-[#000000] !z-50 !w-full`}
    >
      <PopoverTrigger
        asChild
        className={`${triggerClassName} dark:!border-[#000000] !relative !w-full`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-fit relative border pr-12 h-[2.5rem] dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0] justify-between capitalize shadow-none !rounded-[4px] text-[#000000] hover:text-[#666666] font-poppins w-full font-normal text-xs",
            multiSelect && itemsArray?.length > 0 && "!bg-primary !text-white "
          )}
        >
          {renderTriggerContent()}
          <ChevronDown
            className={cn(
              "ml-2 h-4 font-bold right-3   absolute w-4 shrink-0 !text-[#666666] dark:text-textColor/200 transition-transform duration-300",
              open && "rotate-180",
              multiSelect && itemsArray?.length > 0 && "!text-white"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${className} p-0 dark:border-[#051C14]  min-w-[25rem] ${
          (showBranchAsLink || showVendorAsLink) && "!min-w-[30rem]"
        }  mr-1 !z-50`}
        contentClassName={`${contentClassName}  !max-w-[17rem] min-w-full`}
      >
        <Command className="dark:!border-[#051C14] px-1 py-2 dark:bg-[#051C14]  !min-w-full !z-50">
          {showSearch && (
            <Input
              placeholder={searchPlaceholder}
              className=" rounded-sm mb-1 focus:!ring-0 !outline-none focus:!outline-none"
              onInput={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  handleSelect(sortedData[0].value, sortedData[0]);
                }
              }}
            />
          )}
          {children}
          <CommandList className=" dark:!border-[#000000] !z-50 hide-scrollbar !w-full">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup
              className={`${commandGroupClassName} min-h-[8rem]  max-h-[20rem] !w-full`}
            >
              <List
                height={200}
                itemCount={sortedData.length}
                itemSize={40}
                width="100%"
              >
                {({ index, style }) => {
                  const item = sortedData[index];
                  return (
                    <div style={style} key={item.value}>
                      <CommandItem
                        className={cn(
                          "text-left border mb-1.5 break-word  truncate whitespace-break-spaces !max-h-[3rem] overflow-hidden !pl-0 border-[#E0E0E0]   !bg-gray-200/70 !ml-0 ",
                          multiSelect && "!pl-2"
                        )}
                        onBlur={onBlur}
                        onSelect={() => {
                          !multiSelect && handleSelect(item.value, item);
                          setSearchTerm("");
                        }}
                      >
                        {!multiSelect && (
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 dark:text-[#FFFFFF] ml-4",
                              value === item.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        )}
                        <div className="flex justify-between w-full items-center !pl-0 font-poppins text-xs font-normal dark:!text-[#FFFFFF] gap-x-4 break-word truncate whitespace-normal">
                          <div className="flex gap-x-1 items-center ">
                            <span>
                              {item?.archived_status ? (
                                <Archive className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                            </span>
                            <span className="capitalize text-left flex items-center gap-x-2">
                              {item?.label?.slice(
                                0,
                                (showBranchAsLink || showVendorAsLink) &&
                                  item?.label?.length
                              ) ||
                                item?.label?.slice(
                                  0,
                                  showBranchAsLink || showVendorAsLink ? 25 : 35
                                )}{" "}
                            </span>
                          </div>
                          <div className="flex items-center gap-x-2 mr-0.5">
                            {item?.human_verified && (
                              <img
                                src={approved}
                                className="text-primary !h-4 !w-5"
                                alt="Approved"
                              />
                            )}
                            {item?.tier && (
                              <img
                                className="h-4 w-4"
                                src={
                                  item?.tier == 1
                                    ? tier_1
                                    : item?.tier == 2
                                    ? tier_2
                                    : tier_3
                                }
                                alt=""
                              />
                            )}
                            {multiSelect && (
                              <Checkbox
                                checked={itemsArray.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  setItemsArray((prev) => {
                                    const updatedArray = checked
                                      ? [...prev, item.value]
                                      : prev.filter((i) => i !== item.value);
                                    onChange(updatedArray, item);
                                    return updatedArray;
                                  });
                                }}
                              />
                            )}
                            {item?.count !== undefined && (
                              <CustomTooltip
                                content={"Duplicate Findings Count"}
                                right={16}
                              >
                                <span className="font-poppins mr-2">
                                  {item?.count}
                                </span>
                              </CustomTooltip>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(CustomDropDown);
