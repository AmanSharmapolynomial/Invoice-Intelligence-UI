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
              : showBranchAsLink ?`${OLD_UI}/vendor-consolidation-v2/branches/${vendor_id}`:null
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

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={`${className} dark:!border-[#000000]`}
    >
      <PopoverTrigger
        asChild
        className={`${triggerClassName} dark:!border-[#000000] !relative`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-fit border h-[2.5rem] dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0] justify-between capitalize shadow-none !rounded-[4px] text-[#000000] hover:text-[#666666] font-poppins font-normal text-xs",
            multiSelect && itemsArray?.length > 0 && "!bg-primary !text-white"
          )}
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
        className={`${className} p-0 dark:border-[#051C14] w-fit !max-w-60 mr-1`}
        contentClassName={`${contentClassName} w-full`}
      >
        <Command className="dark:!border-[#051C14] dark:bg-[#051C14] min-w-[100%] !w-full !z-50">
          {showSearch && (
            <CommandInput placeholder={searchPlaceholder} className="" />
          )}
          {children}
          <CommandList className="border dark:!border-[#000000] !z-50 ">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup className=" ">
              {showCustomItems
                ? children
                : sortedData.map((item) => (
                    <CommandItem
                      key={item.value}
                      className={cn(
                        "text-left border mb-1.5 !pl-0 border-[#E0E0E0] !bg-gray-200/70 !ml-0 ",
                        multiSelect && "!pl-2"
                      )}
                      onBlur={onBlur}
                      onSelect={() => {
                        !multiSelect && handleSelect(item.value, item);
                      }}
                    >
                      {!multiSelect && (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 dark:text-[#FFFFFF]",
                            value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}
                      <div className="flex justify-between w-full items-center !pl-0 font-poppins text-xs font-normal dark:!text-[#FFFFFF] gap-x-4">
                        <span className="capitalize text-left flex items-center gap-x-2">
                          {item?.archived_status && (
                            <Archive className="h-4 w-4 text-yellow-500" />
                          )}
                          {item?.label || item?.value}
                        </span>
                        {item?.human_verified && (
                          <img
                            src={approved}
                            className="text-primary !h-4 !w-5"
                            alt="Approved"
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
