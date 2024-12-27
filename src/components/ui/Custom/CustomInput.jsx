import { useEffect, useState } from "react";
import { Input } from "../input";
import dollar from "@/assets/image/dollar.svg";
import search from "@/assets/image/search.svg";
import { ChevronDown, ChevronUp } from "lucide-react";

const CustomInput = ({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  type = "text",
  showIcon = false,
  variant = "",
  onKeyDown,
},...props) => {
  const searchClassName = `placeholder:!font-medium placeholder:!font-poppins placeholder:!text-[#666666] placeholder:!text-xs !px-0`;
  const [inputValue, setinputValue] = useState(value);
  const handleChange = (v) => {
    onChange(v);
  };
  useEffect(() => {
    setinputValue(value);
  }, [value]);

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
            onKeyDown={(e)=>{
              onKeyDown(e)
            }}
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
        <>
          {type == "number" ? (
            <div className="flex items-center gap-x-0 border-[1px] border-[#E0E0E0] rounded-md pl-2">
              <img src={dollar} alt="dollar " className="h-3 w-3" />
              <Input
                value={inputValue}
                className={`${className} font-poppins !flex !justify-end text-end font-normal text-sm dark:!bg-[#000000] dark:text-[#FFFFFF]  focus:!outline-none  !h-[2.5rem] focus:!ring-0  !border-none shadow-none  `}
                placeholder={placeholder}
                type={type}
                onKeyDown={(e)=>{
                  onKeyDown(e)
                }}
                onChange={(e) => {
                  setinputValue(e.target.value);
                  handleChange(e.target.value);
                }}
              />

              <div className="flex flex-col gap-y-0.5 ml-1  justify-between items-stretch">
                <div className="cursor-pointer flex justify-center !h-[1.1rem] w-[1.1rem] items-center bg-primary rounded-tr-md " onClick={() => handleChange(parseInt(inputValue) + 1)}>
                  <ChevronUp className="h-3 w-3 text-white" />
                </div>
                <div className="cursor-pointer flex justify-center !h-[1.1rem] w-[1.1rem] items-center bg-primary  rounded-br-md"
                  onClick={() => handleChange(parseInt(inputValue) - 1)}
                >
                  <ChevronDown className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <Input
              value={inputValue}
              className={`${className} font-poppins  font-normal text-sm dark:!bg-[#000000] dark:text-[#FFFFFF]  focus:!outline-none  !h-[2.5rem] focus:!ring-0  border-[1px] border-[#E0E0E0] rounded-[4px] shadow-none `}
              placeholder={placeholder}
              type={type}
              onKeyDown={(e)=>{
                onKeyDown(e)
              }}
              onChange={(e) => {
                setinputValue(e.target.value);
                handleChange(e.target.value);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default CustomInput;
