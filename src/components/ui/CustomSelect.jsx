import { useRef, useState } from "react";
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

const CustomSelect = ({
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
  
  showSearch = true
}) => {
  const [dropDownSearch, setDropDownSearch] = useState("");
  const [filteredDropDownItems, setFilteredDropDownItems] = useState(data);
  let inputRef = useRef();
  data?.forEach((item) => {
    if (item?.value == null || item?.value == "none") {
      item.label = placeholder;

    }
    // item?.value?.toLowerCase()
  });

  return (
    <Select
      className="!bg-[#FFFFFF]"
      value={value}
      placeholder={placeholder}
      onValueChange={(val) => {
        onSelect(val == "none" ? "none" : val);
      }}
    >
      <Label>{label}</Label>
      <SelectTrigger
        className={`${triggerClassName} min-w-[180px] focus:outline-none focus:ring-0 !bg-gray-100 font-medium`}
      >
        <SelectValue
          placeholder={
            <span className={`${placeholderClassName} capitalize`}>
              {!value ? placeholder : value}
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {showSearch && (
          <Input
            ref={inputRef}
            placeholder={searchPlaceHolder}
            value={dropDownSearch}
            onChange={(e) => {
              inputRef.current.focus();
              setDropDownSearch(e.target.value);
              // let fil = data?.filter((item) =>
              //   item?.label?.toLowerCase()?.includes(e.target.value)
              // );

              // setFilteredDropDownItems(fil);
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
                    <span>{label}</span>
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
};

export default CustomSelect;
