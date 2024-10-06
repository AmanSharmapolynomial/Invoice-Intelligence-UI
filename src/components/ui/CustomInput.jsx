import React, { memo, useState } from "react";
import { Input } from "./input";
import { Value } from "@radix-ui/react-select";

const CustomInput = ({
  value = "",
  onChange,
  placeholder = "",
  className = ""
}) => {
  const [inputValue, setinputValue] = useState(value);
  const handleChange = (v) => {
    onChange(v);
  };
  return (
    <Input
      value={inputValue}
      className={className}
      placeholder={placeholder}
      onChange={(e) => {
        setinputValue(e.target.value);
        handleChange(e.target.value);
      }}
    />
  );
};

export default memo(CustomInput);
