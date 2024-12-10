import { useEffect, useState } from "react";
import { Input } from "../input";
import search from "@/assets/image/search.svg";
const CustomInput = ({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  type = "text",
  showIcon = false,
  variant = ""
}) => {
  const searchClassName = `placeholder:!font-medium placeholder:!font-poppins placeholder:!text-[#666666] placeholder:!text-xs !px-0`;
  const [inputValue, setinputValue] = useState(value);
  const handleChange = (v) => {
    onChange(v);
  };
  useEffect(()=>{setinputValue(value)},[value])

  return (
    <>
      {variant == "search" ? (
        <div
          className={` ${
            variant == "search" &&
            "!border-[#FFFFFF] dark:!bg-[#000000] gap-x-2 rounded-sm "
          } flex  items-center  `}
          style={{ boxShadow: "0px 0px 4px 0px #0000001A" }}
        >
          {showIcon && <img src={search} alt="" className="h-5   mt-1 ml-3 " />}
          <Input
            value={inputValue}
            className={`${className} ${
              variant == "search" && searchClassName
            } rounded-md border-none shadow-none font-poppins  font-normal text-sm placeholder:text-base dark:text-[#FFFFFF] !h-[2.5rem] focus:!outline-none focus:!ring-0 `}
            placeholder={placeholder}
            type={type}
            onChange={(e) => {
              setinputValue(e.target.value);
              handleChange(e.target.value);
            }}
          />
        </div>
      ) : (
        <Input
          value={inputValue}
          className={`${className} font-poppins  font-normal text-sm dark:!bg-[#000000] dark:text-[#FFFFFF]  focus:!outline-none !min-h-[2.5rem] !h-[2.5rem] focus:!ring-0  border-[1px] border-[#E0E0E0] rounded-[4px] shadow-none `}
          placeholder={placeholder}
          type={type}
          onChange={(e) => {
            setinputValue(e.target.value);
            handleChange(e.target.value);
          }}
        />
      )}
    </>
  );
};

export default CustomInput;
