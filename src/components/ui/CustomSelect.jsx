import { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { Button } from "./button";

const CustomSelect = forwardRef(
  (
    {
      data = [],
      placeholder = "Select",
      placeholderClassName,
      triggerClassName,
      optionClassName,
      additionalKeysAndFunctions,
      searchPlaceHolder = "Search",
      label = "",
      onSelect,
      value,
      showSearch = false,
      contentClassName
    },
    ref
  ) => {
    const [dropDownSearch, setDropDownSearch] = useState("");
    const [filteredDropDownItems, setFilteredDropDownItems] = useState(data);
    let inputRef = useRef();
    let triggerRef = useRef(); // Local ref for the trigger
    const [isFocused,setIsFocused]=useState(false)

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(triggerRef.current);
        } else {
          ref.current = triggerRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      data?.forEach((item) => {
        if (item?.value == null || item?.value == "none") {
          item.label = placeholder;
        }
      });
    }, [data, placeholder]);

    return (
      <Select
        value={value}
        placeholder={placeholder}
        onValueChange={(val) => {
          onSelect(val == "none" ? "none" : val);
     setTimeout(() => {
      if (triggerRef.current) {
            
        triggerRef.current.blur();
        setIsFocused(false); // Remove border
      }
     },100);
        }}
      >
        <Label className="font-poppins font-medium text-sm text-[#000000] mb-2">
          {label}
        </Label>
        <SelectTrigger
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={triggerRef} // Attach ref here
          className={`${triggerClassName} ${
            isFocused&& "!border !border-black"
          } font-poppins font-normal  min-w-[180px] border border-[#E0E0E0] !h-[2.5rem] rounded-sm focus:outline-none focus:ring-0  text-sm text-[#1C1C1E]`}
        >
          <SelectValue
            placeholder={
              <span className={`${placeholderClassName} capitalize`}>
                {!value ? placeholder : value}
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className={`${contentClassName}`}>
          {showSearch && (
            <Input
              ref={inputRef}
              placeholder={searchPlaceHolder}
              value={dropDownSearch}
              onChange={(e) => {
                inputRef.current.focus();
                setDropDownSearch(e.target.value);
              }}
            />
          )}
          <div className="py-1">
            {data && filteredDropDownItems?.length > 0 ? (
              data
                ?.filter((item) =>
                  item?.label?.toLowerCase()?.includes(dropDownSearch)
                )
                ?.map(({ label, value }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className={`${optionClassName} !flex justify-between relative `}
                  >
                    <div className="flex gap-x-12 items-center justify-between w-full">
                      <span>{label == "None" ? placeholder : label}</span>
                      <div>
                        {additionalKeysAndFunctions?.map(({ key, method }) => (
                          <Button
                            key={key}
                            className={"font-normal h-8"}
                            onClick={() => method(label)}
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SelectItem>
                ))
            ) : (
              <p className="flex justify-center">No data found.</p>
            )}
          </div>
        </SelectContent>
      </Select>
    );
  }
);

export default CustomSelect;
