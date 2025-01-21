import React, { useEffect, useState, useMemo, useCallback } from "react";

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
  branch_id
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Value || "");
  const [item, setItem] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

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
  useEffect(() => {
    if (focusedIndex >= 0) {
      const focusedItem = document.getElementById(`dropdown-item-${focusedIndex}`);
      if (focusedItem) {
        focusedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [focusedIndex]);
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (itemsArray.includes(a.value)) return -1;
      if (itemsArray.includes(b.value)) return 1;
      return 0;
    });
  }, [data, itemsArray]);

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
          <span className="text-[#348355] text-sm font-poppins font-normal truncate">
            {selectedItem
              ? selectedItem.label.slice(0, 50) +
                (selectedItem.label.length > 100 ? "....." : "")
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
              ? `${selectedItem.label.slice(0, 50)}${
                  selectedItem.label.length > 100 ? "....." : ""
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

  const handleKeyDown = (event) => {
    // event.stopPropagation()
    if (!open) return;
    console.log(event.key)

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < sortedData.length - 1 ? Number(prevIndex) + 1 : Number(prevIndex)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? Number(prevIndex) - 1 : 0
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < sortedData.length) {
       
        handleSelect(sortedData[focusedIndex].value, sortedData[focusedIndex]);
      }
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={`${className} dark:!border-[#000000]`}
    >
      <PopoverTrigger
        asChild
        className={`${triggerClassName} dark:!border-[#000000] !relative !z-10 focus:!outline-none outline-none focus:!ring-0`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-fit border h-[2.5rem] dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0] justify-between capitalize shadow-none !rounded-[4px] text-[#000000] hover:text-[#666666] font-poppins font-normal text-xs !z-10",
            multiSelect && itemsArray?.length > 0 && "!bg-primary !text-white"
          )}
          onKeyDown={handleKeyDown}
        >
          {renderTriggerContent()}
          <ChevronDown
            className={cn(
              "ml-2 h-4 font-bold w-4 shrink-0 !text-[#666666] dark:text-textColor/200 transition-transform duration-300",
              open && "rotate-180",
              multiSelect && itemsArray?.length > 0 && "!text-white"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
      onKeyDown={handleKeyDown}
        className={`${className} p-0 dark:border-[#051C14] w-fit !max-w-80 mr-1 !z-50 `}
        contentClassName={`${contentClassName} w-full`}
      >
        <Command className="dark:!border-[#051C14] dark:bg-[#051C14] min-w-[100%] !w-full !z-40">
          {showSearch && (
            <CommandInput placeholder={searchPlaceholder} className="!z-40" />
          )}
          {children}
          <CommandList className="border dark:!border-[#000000] !z-50 ">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup className=" !z-50 !ml-0 ">
              {showCustomItems
                ? children
                : sortedData.map((item, index) => (
                  <CommandItem
                  key={item.value}
                  id={`dropdown-item-${index}`}
                  className={cn(
                    "text-left flex items-start justify-normal mb-1.5 !pl-0 border-[#E0E0E0] !bg-gray-200/70 !z-50",
                    multiSelect && "!pl-2",
                    focusedIndex === index && "!border-black !border !bg-gray-300/40"
                  )}
                  onBlur={onBlur}
                  onSelect={() => {
                    if (!multiSelect) handleSelect(item.value, item);
                  }}
                >
                      <div className="flex justify-between w-full items-center !min-w-56 !pl-0 font-poppins text-xs font-normal dark:!text-[#FFFFFF] gap-x-4   !ml-0">
                        <div className="flex items-center gap-x-2 ">
                          {item?.archived_status ? (
                            <Archive className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <div className="w-5 h-5" />
                          )}
                          <span className="capitalize text-left  flex items-center gap-x-2">
                            {!multiSelect && (
                              <Check
                                className={cn(
                                  " h-4 w-4 dark:text-[#FFFFFF] ",
                                  value === item.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            )}
                            {item?.label || item?.value} 
                          </span>
                        </div>
                        <div className="flex gap-x-2 items-center pr-2">
                          {item?.human_verified && (
                            <img
                              src={approved}
                              className="text-primary !h-4 !w-5"
                              alt="Approved"
                            />
                          )}
                          {multiSelect && (
                            <Checkbox
                            className=""
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
                        </div>
                      </div>
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(CustomDropDown);
