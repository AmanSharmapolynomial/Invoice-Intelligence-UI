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
import { Check, ChevronsUpDown, Verified } from "lucide-react";
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




  const handleSelect = (currentValue,item) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    onChange(getValueFromLabel(data, newValue),item);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} className={className}>
      <PopoverTrigger asChild className={triggerClassName}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          {value && value !== "none"
            ? data.find((item) => item?.[Key] == value)?.label
            : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${className} min-w-[200px]  !w-full p-0`}
        contentClassName={contentClassName}
      >
        <Command>
          {showSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {showCustomItems
                ? children // Render custom items if showCustomItems is true
                : data?.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => handleSelect(item.value,item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex justify-between items-center gap-x-4">
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
