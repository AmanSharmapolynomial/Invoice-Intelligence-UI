import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { Button } from "./button";

// Data Format
// data=['abcccdefghji','abchsjsjsjsj ]
const ScrollableDropDown = ({
  children,
  placeholder = "Select",
  triggerClassName = "",
  scrollableClassName = "",
  contentClassName = "",
  data = [],
  onButtonClick,
  onItemClick
}) => {
  let modiedData = makeKeyValueFromKey(data);

  return (
    <Select>
      <SelectTrigger
        className={`${triggerClassName} min-w-[180px] w-full focus:!border-none focus:ring-0 !border `}
      >
        <SelectValue placeholder={modiedData?.[0]?.label ?? placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <ScrollArea
          className={`${scrollableClassName} max-h-[200px] overflow-auto min-w-[350px] h-fit rounded-sm text-sm !bg-transparent`}
        >
          {children}
          {modiedData?.map(({ label, value }, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 px-2 flex justify-between items-center "
            >
              <p
                onClick={() => {
                  onItemClick({ label, value });
                }}
              >
                {label}
              </p>
              <Button
                className={"h-8 font-normal"}
                onClick={() => {
                  onButtonClick({ label, value });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ScrollableDropDown;
