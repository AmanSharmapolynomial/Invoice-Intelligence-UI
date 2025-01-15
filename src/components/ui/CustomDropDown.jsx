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
import { Archive, Check, ChevronDown, Link2 } from 'lucide-react';
import approved from "@/assets/image/approved.svg";
import { Link } from "react-router-dom";
import { Checkbox } from "./checkbox";
import { FixedSizeList as List } from 'react-window';
import debounce from 'lodash/debounce';

const ITEM_HEIGHT = 35; // Adjust based on your item height
const ITEMS_PER_PAGE = 100; // Adjust based on your needs

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
  multiSelect = false
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Value || "");
  const [item, setItem] = useState(null);
  const [itemsArray, setItemsArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

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

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (itemsArray.includes(a.value)) return -1;
      if (itemsArray.includes(b.value)) return 1;
      return 0;
    });
  }, [filteredData, itemsArray]);

  const paginatedData = useMemo(() => {
    const startIndex = page * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, page]);

  const renderTriggerContent = useCallback(() => {
    if (multiSelect) return placeholder;

    if (showBranchAsLink || showVendorAsLink) {
      const selectedItem = data.find(
        (item) => item[Key] == (showBranchAsLink ? value?.branch_id : value)
      );
      return (
        <Link to={null} className="flex items-center gap-x-2">
          <Link2 className="text-[#348355] !h-4 !w-4" />
          <span className="text-[#348355] text-sm font-poppins font-normal truncate">
            {selectedItem
              ? selectedItem.label.slice(0, 50) +
                (selectedItem.label.length > 100 ? "....." : "")
              : placeholder}
          </span>
          <div>
            {selectedItem?.human_verified && (
              <img
                src={approved || "/placeholder.svg"}
                className="text-primary !h-4 !w-5"
                alt="Approved"
              />
            )}
          </div>
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
            src={approved || "/placeholder.svg"}
            className="text-primary !h-4 !w-5"
            alt="Approved"
          />
        )}
      </div>
    );
  }, [multiSelect, showBranchAsLink, showVendorAsLink, data, Key, value, placeholder, item, Value]);

  const CommandItemMemo = React.memo(({ index, style }) => {
    const item = paginatedData[index];
    if (!item) return null;

    return (
      <div style={style}>
        <CommandItem
          key={item.value}
          className={cn(
            "text-left border mb-1.5 border-[#E0E0E0] !bg-gray-200/70 !ml-0 py-2",
            multiSelect && "!pl-2"
          )}
          onBlur={onBlur}
          onSelect={() => {
            !multiSelect && handleSelect(item.value, item);
          }}
        >
          <div className="flex items-center w-full">
            {!multiSelect && (
              <Check
                className={cn(
                  "mr-2 h-4 w-4 flex-shrink-0 dark:text-[#FFFFFF]",
                  value === item.value ? "opacity-100" : "opacity-0"
                )}
              />
            )}
            <div className="flex flex-1 justify-between items-center font-poppins text-xs font-normal dark:!text-[#FFFFFF] min-w-0">
              <span className="capitalize truncate mr-2">
                {item?.label || item?.value}
              </span> 
              <div className="flex items-center gap-x-2 flex-shrink-0">
                {item?.human_verified && (
                  <img
                    src={approved || "/placeholder.svg"}
                    className="text-primary !h-4 !w-5"
                    alt="Approved"
                  />
                )}
                {item?.archived_status && (
                  <Archive className="w-4 h-4 text-yellow-500" />
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
            </div>
          </div>
        </CommandItem>
      </div>
    );
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(0);
    }, 300),
    []
  );

  const handleScroll = useCallback(({ scrollOffset }) => {
    const newPage = Math.floor(scrollOffset / (ITEM_HEIGHT * ITEMS_PER_PAGE));
    if (newPage !== page) {
      setPage(newPage);
    }
  }, [page]);

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
        className={`${className} p-0 dark:border-[#051C14] w-[300px] mr-1`}
        contentClassName={`${contentClassName} w-full`}
      >
        <Command className="dark:!border-[#051C14] dark:bg-[#051C14] min-w-[100%] !w-full !z-50">
          {showSearch && (
            <CommandInput 
              placeholder={searchPlaceholder} 
              className=""
              onValueChange={debouncedSearch}
            />
          )}
          {children}
          <CommandList className="border dark:!border-[#000000] !z-50 max-h-[300px] overflow-auto hide-scrollbar" >
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup className="hide-scrollbar">
              {showCustomItems
                ? children
                : (
                  <List
                    height={300}
                    itemCount={paginatedData.length}
                    itemSize={ITEM_HEIGHT}
                    width="100%"
                    onScroll={handleScroll}
                    className=""
                  >
                    {CommandItemMemo}
                  </List>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(CustomDropDown);

