import React, { memo, useEffect, useState } from "react";
import { Input } from "./input";

const CustomInput = ({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  type="text"
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

      type={type}
      onChange={(e) => {
        setinputValue(e.target.value);
        handleChange(e.target.value);
      }}
    />
  );
};

export default (CustomInput);
