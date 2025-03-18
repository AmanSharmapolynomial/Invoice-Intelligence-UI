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
    const inputRef = useRef(null);
    const triggerRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(triggerRef.current);
        } else {
          ref.current = triggerRef.current;
        }
      }
    }, [ref]);

    // Update filtered items based on search input
    useEffect(() => {
      if (!dropDownSearch) {
        setFilteredDropDownItems(data);
      } else {
        setFilteredDropDownItems(
          data.filter((item) =>
            item?.label?.toLowerCase().includes(dropDownSearch.toLowerCase())
          )
        );
      }
    }, [dropDownSearch, data]);

    // Maintain focus on input field when typing
    useEffect(() => {
      if (showSearch && isDropdownOpen && inputRef.current) {
        inputRef.current.focus();
      }

    }, [isDropdownOpen, dropDownSearch, showSearch]);

    return (
      <Select
        value={value}
        placeholder={placeholder}
        onOpenChange={(open) => {
          setIsDropdownOpen(open);
          if (!open) setDropDownSearch(""); // Reset search when closing dropdown
        }}
        onValueChange={(val) => {
          onSelect(val === "none" ? "none" : val);
          setTimeout(() => {
            if (triggerRef.current) {
              triggerRef.current.blur();
              setIsFocused(false);
            }
          }, 100);
        }}
      >
        {label && (
          <Label className="font-poppins font-medium text-sm text-[#000000] mb-2">
            {label}
          </Label>
        )}
        <SelectTrigger
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={triggerRef}
          className={`${triggerClassName} ${
            isFocused && "!border !border-black"
          } font-poppins font-normal min-w-[180px] border border-[#E0E0E0] h-[2.5rem] rounded-sm focus:outline-none focus:ring-0 text-sm text-[#1C1C1E]`}
        >
          <SelectValue
            placeholder={
              <span className={`${placeholderClassName} capitalize`}>
                {!value ? placeholder : value}
              </span>
            }
          />
        </SelectTrigger>

        <SelectContent
          className={`${contentClassName} overflow-auto`}
          search={
            <div className="p-2 mr-2 sticky top-0  ">
              <Input
                ref={inputRef}
                placeholder={searchPlaceHolder}
                value={dropDownSearch}
                className="w-full p-2 border rounded-md"
                onChange={(e) => {
                  e.preventDefault();
                  setDropDownSearch(e.target.value);
                  inputRef.current.focus();
                }}
              />
            </div>
          }
        >
          {/* <div className="py-1 max-h-60  overflow-auto "> */}
     
              {filteredDropDownItems?.length > 0 ? (
                data
                  ?.filter((it) =>
                    it?.label
                      ?.toLowerCase()
                      ?.includes(dropDownSearch?.toLowerCase())
                  )
                  ?.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={`${optionClassName} flex justify-between`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{label === "None" ? placeholder : label}</span>
                        <div>
                          {additionalKeysAndFunctions?.map(
                            ({ key, method }) => (
                              <Button
                                key={key}
                                className="font-normal h-8"
                                onClick={() => method(label)}
                              >
                                {key}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))
              ) : (
                <p className="flex justify-center text-gray-500 p-2">
                  No data found.
                </p>
              )}
            
          {/* </div> */}
        </SelectContent>
      </Select>
    );
  }
);

export default CustomSelect;
