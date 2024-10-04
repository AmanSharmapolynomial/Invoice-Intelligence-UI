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

const CustomSelect = ({
  data = [],
  placeholder = "Select",
  placeholderClassName,
  triggerClassName,
  optionClassName,
  searchPlaceHolder="Search",
  label = "",
  onSelect,
  value,
  showCustomContent = false,
  children
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
          placeholder={
            <span className={`${placeholderClassName} capitalize`}>
              {placeholder}
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {/* {!showCustomContent && data.length !== 0
          ? data.map(({ label, value }) => (
              <SelectItem
                key={value}
                value={value}
                className={`${optionClassName} capitalize`}
              >
                {label}
              </SelectItem>
            ))
          : children} */}
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
        <div className="py-1">
          {data && filteredDropDownItems?.length > 0 ? (
            filteredDropDownItems?.map(({ label, value }) => (
              <SelectItem key={value} value={value} className={``}>
                {label}
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
