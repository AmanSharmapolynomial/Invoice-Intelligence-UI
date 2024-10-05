import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const ScrollableDropDown = ({
  children,
  placeholder = "Select",
  triggerClassName = "",
  scrollableClassName = "",
  contentClassName = ""
}) => {
  return (
    
      <Select>
        <SelectTrigger
          className={`${triggerClassName} min-w-[180px] w-full focus:!border-none focus:ring-0 !border `}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          <ScrollArea
            className={`${scrollableClassName} max-h-[200px] overflow-auto min-w-[350px] h-fit rounded-sm text-sm !bg-transparent`}
          >
            {children}
          </ScrollArea>
        </SelectContent>
      </Select>
    
  );
};

export default ScrollableDropDown;
