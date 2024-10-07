import React, { memo, useEffect, useState } from "react";
import { Input } from "./input";

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
      className={`${className}  focus:!outline-none focus:!ring-0 `}
      placeholder={placeholder}
      type="text"
      onChange={(e) => {
        setinputValue(e.target.value);
        handleChange(e.target.value);
      }}
    />
  );
};

export default (CustomInput);
