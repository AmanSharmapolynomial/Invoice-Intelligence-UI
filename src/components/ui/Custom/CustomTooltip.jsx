import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const CustomTooltip = ({ content, children, top = 0, className,right=0 }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        {content && (
          <TooltipContent
          
            className={`${className} text-[#000000] font-normal capitalize !font-poppins  text-xs bg-[#ffffff] border border-black/5 !z-50 drop-shadow-sm shadow-md relative  top-${top} min-w-full !right-${right} max-w-52 break-words `}
          >
            {content}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
