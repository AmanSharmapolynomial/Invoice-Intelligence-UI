import { useState } from "react";
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
  
  return (
    <Select
      className="!bg-[#FFFFFF]"
      value={value}
      placeholder={placeholder}
      onValueChange={(val) => {

        onSelect(val);
      }}
    >
      <Label>{label}</Label>
      <SelectTrigger
        className={`${triggerClassName} min-w-[180px] focus:outline-none focus:ring-0 !bg-gray-100 font-medium`}
      >
        <SelectValue
        /* The `placeholder` attribute in the `SelectValue` component is being set to a JSX element that
   consists of a `span` element with a class name that combines the `placeholderClassName` prop
   value and the string "capitalize". The content of this `span` element is the `placeholder` prop
   value passed to the `CustomSelect` component. This allows for custom styling of the placeholder
   text displayed in the select input field. */
        placeholder={
          <span className={`${placeholderClassName} capitalize`}>
            {placeholder}
          </span>
        }
        />
      </SelectTrigger>
      <SelectContent>
        {showSearch && (
          <Input
            placeholder={searchPlaceHolder}
            value={dropDownSearch}
            onChange={(e) => {
              setDropDownSearch(e.target.value);
              let fil = data?.filter((item) =>
                item?.label?.includes(e.target.value)
              );
              setFilteredDropDownItems(fil);
            }}
          />
        )}
        <div className="py-1">
          {data && filteredDropDownItems?.length > 0 ? (
            filteredDropDownItems?.map(({ label, value }) => (
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
