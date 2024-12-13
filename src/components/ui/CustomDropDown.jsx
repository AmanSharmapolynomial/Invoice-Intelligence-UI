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
import { Check, ChevronDown, Verified } from "lucide-react";
import { useEffect, useState } from "react";

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
  showSearch = true
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Value || "");
  useEffect(() => {
    if (Value !== undefined) {
      setValue(Value);
    }
  }, [Value]);

  const handleSelect = (currentValue, item) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    onChange(getValueFromLabel(data, newValue), item);
  };
console.log(data)
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={`${className} dark:!border-[#000000]`}
    >
      <PopoverTrigger
        asChild
        className={`${triggerClassName} dark:!border-[#000000]`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-fit border !h-[2.5rem] dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0]  justify-between capitalize shadow-none !rounded-[4px] text-[#666666] hover:text-[#666666] font-poppins font-normal text-xs"
        >
          {value && value !== "none"
            ? data.find((item) => item?.[Key] == value)?.label
            : placeholder}

          {/* Chevron icon with transition */}
          <ChevronDown
            className={`ml-2 h-4 font-bold w-4 shrink-0 !text-[#666666] dark:text-textColor/200 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${className}  p-0 bg-[#FFFFFF] dark:border-[#051C14]  w-fit  !max-w-60 mr-1`}
        contentClassName={`${contentClassName}   w-full`}
      >
        <Command className="dark:!border-[#051C14]    dark:bg-[#051C14] min-w-[100%] !w-full">
          {showSearch && (
            <CommandInput placeholder={searchPlaceholder} className="" />
          )}
          <CommandList className="border dark:!border-[#000000]">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup className="">
              {showCustomItems
                ? children // Render custom items if showCustomItems is true
                : data?.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => handleSelect(item.value, item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 dark:text-[#FFFFFF]",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex justify-between  w-full items-center font-poppins text-xs font-normal dark:!text-[#FFFFFF]   gap-x-4">
                        <span>{item.label}</span>
                        {item?.human_verified && (
                          <Verified className="h-4 w-4 text-primary" />
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
