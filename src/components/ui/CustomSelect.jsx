import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { Label } from "./label";
import { Input } from "./input";

const CustomSelect = ({
  data = [],
  placeholder = "Select",
  placeholderClassName,
  triggerClassName,
  optionClassName,
  label = "",
  onSelect,
  value,
  showCustomContent=false,
  children
}) => {
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

        {!showCustomContent &&  data.length !== 0
          ? data.map(({ label, value }) => (
              <SelectItem
                key={value}
                value={value}
                className={`${optionClassName} capitalize`}
              >
                {label}
              </SelectItem>
            ))
          : children}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
