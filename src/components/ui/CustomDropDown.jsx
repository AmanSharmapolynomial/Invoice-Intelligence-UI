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
import { Check, ChevronDown, Link2, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import approved from "@/assets/image/approved.svg";
import { Link } from "react-router-dom";
import { Checkbox } from "./checkbox";

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
  useEffect(() => {
    if (Value !== undefined) {
      setValue(Value);
    }
  }, [Value]);

  const handleSelect = (currentValue, item) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    setItem(item);
    !multiSelect
      ? onChange(getValueFromLabel(data, newValue), item)
      : onChange(itemsArray, item);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={`${className} dark:!border-[#000000] `}
    >
      <PopoverTrigger
        asChild
        className={`${triggerClassName} dark:!border-[#000000]`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${
            multiSelect && itemsArray?.length > 0 && "!bg-primary !text-white"
          } min-w-fit border h-[2.5rem] dark:bg-[#000000 ] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0]  justify-between capitalize shadow-none !rounded-[4px] text-[#000000] hover:text-[#666666] font-poppins font-normal text-xs`}
        >
          {multiSelect ? (
            <>{placeholder}</>
          ) : (
            <>
              {showBranchAsLink || showVendorAsLink ? (
                <>
                  {showBranchAsLink ? (
                    <Link to={null} className="flex items-center gap-x-2">
                      <Link2 className="text-[#348355] !h-4 !w-4" />
                      <span className="text-[#348355]  text-sm font-poppins font-normal truncate">
                        {value && value !== "none"
                          ? data.find((item) => item?.[Key] == value?.branch_id)
                            ? data
                                .find((item) => item?.[Key] == value?.branch_id)
                                ?.label?.slice(0, 100) +
                              `${
                                data.find(
                                  (item) => item?.[Key] == value?.branch_id
                                )?.vendor_address?.length > 100
                                  ? "....."
                                  : ""
                              }`
                            : placeholder
                          : placeholder}
                      </span>
                      {data.find((item) => item?.[Key] == value)
                        ?.human_verified && (
                        <img
                          src={approved}
                          className="text-primary !h-4 !w-5  "
                        />
                      )}
                      {data.find((item) => item?.[Key] == value?.branch_id)
                        ?.human_verified && (
                        <img
                          src={approved}
                          className="text-primary !h-4 !w-5  "
                        />
                      )}
                    </Link>
                  ) : showVendorAsLink ? (
                    <Link to={null} className="flex items-center gap-x-2">
                      <Link2 className="text-[#348355] !h-4 !w-4" />
                      <span className="text-[#348355]  text-sm font-poppins font-normal truncate">
                        {value && value !== "none"
                          ? data.find((item) => item?.[Key] == value)
                            ? data
                                .find((item) => item?.[Key] == value)
                                ?.label?.slice(0, 100) +
                              `${
                                data.find((item) => item?.[Key] == value)?.label
                                  ?.length > 100
                                  ? "....."
                                  : ""
                              }`
                            : placeholder
                          : placeholder}
                      </span>
                      {data.find((item) => item?.[Key] == value)
                        ?.human_verified && (
                        <img
                          src={approved}
                          className="text-primary !h-4 !w-5  "
                        />
                      )}
                    </Link>
                  ) : null}
                </>
              ) : (
                <div className="flex items-center gap-x-2">
                  <span className="!truncate">
                    {value && value !== "none"
                      ? data.find((item) => item?.[Key] == value)
                        ? `${
                            data
                              .find((item) => item?.[Key] == value)
                              ?.label?.slice(0, 100) +
                            `${
                              data.find((item) => item?.[Key] == value)?.label
                                ?.length > 100
                                ? "....."
                                : ""
                            }`
                          }`
                        : typeof value === "string"
                        ? value
                        : Value?.vendor_address
                      : placeholder}
                  </span>
                  <span>
                    {" "}
                    {item?.human_verified && (
                      <img
                        src={approved}
                        className="text-primary !h-4 !w-5  "
                      />
                    )}
                  </span>
                </div>
              )}
            </>
          )}
          {/* Chevron icon with transition */}
          <ChevronDown
            className={`ml-2 h-4 font-bold w-4 shrink-0 !text-[#666666] dark:text-textColor/200 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            } ${multiSelect && itemsArray?.length > 0 && "!text-white"}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${className}  p-0 bg-[#FFFFFF] dark:border-[#051C14]  w-fit  !max-w-60  mr-1`}
        contentClassName={`${contentClassName}   w-full`}
      >
        <Command className="dark:!border-[#051C14]    dark:bg-[#051C14] min-w-[100%] !w-full !z-50">
          {showSearch && (
            <CommandInput placeholder={searchPlaceholder} className="" />
          )}
          {children}
          <CommandList className="border dark:!border-[#000000] !z-50">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {showCustomItems
                ? children // Render custom items if showCustomItems is true
                : data?.map((item) => (
                    <CommandItem
                      key={item.value}
                      className="text-left   !pl-0 !ml-0"
                      onBlur={onBlur}
                      onSelect={() => {
                        !multiSelect && handleSelect(item.value, item);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 dark:text-[#FFFFFF]",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex justify-between  w-full items-center font-poppins text-xs font-normal dark:!text-[#FFFFFF]   gap-x-4">
                        <span className="capitalize text-left">
                          {item.label}
                        </span>
                        {item?.human_verified && (
                          <img
                            src={approved}
                            className="text-primary !h-4 !w-5  "
                          />
                        )}

                        {multiSelect && (
                          <Checkbox
                            checked={itemsArray.includes(item.value)}
                            onCheckedChange={(checked) => {
                              setItemsArray((prev) => {
                                const updatedArray = checked
                                  ? [...prev, item.value] // Add item
                                  : prev.filter((i) => i !== item.value); // Remove item

                                onChange(updatedArray, item); // Call onChange with updated array
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

export default CustomDropDown;
