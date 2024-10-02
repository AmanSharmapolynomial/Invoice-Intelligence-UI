import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { Label } from "./label";

const CustomSelect = ({
  data = [], 
  placeholder="Select",
  placeholderClassName,
  triggerClassName,
  optionClassName,
  label=""
}) => {

  return (
    <Select className="!bg-[#FFFFFF]" placeholder={placeholder}>
        <Label>{label}</Label>
      <SelectTrigger className={`${triggerClassName} w-[180px] focus:outline-none focus:ring-0 !bg-gray-100 font-medium`}>
        <SelectValue
          placeholder={
            <span className={`${placeholderClassName} capitalize`}>
              {placeholder}
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {data.length !== 0 ? data.map(({ label, value }) => (
          <SelectItem
            key={value}
            value={value}
            className={`${optionClassName} capitalize`}
          >
            {label}
          </SelectItem>
        )) : null}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
