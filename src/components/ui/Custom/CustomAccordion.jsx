import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import chevron from "@/assets/image/arrow_drop_down.svg";

const CustomAccordion = ({
  title = "Accordion",
  children,
  triggerButtons,
  contentClassName,
  className,
  triggerClassName
}) => {
  const [isOpen, setIsOpen] = useState(true); // Set to true for default open

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Accordion
      type="single"
      // collapsible
      defaultValue={isOpen ? "item-1" : ""}
      value={isOpen ? "item-1" : ""}
      className={`${className} rounded-xl`}
      style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.12)" }}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          onClick={handleToggle}
          className={`${
            isOpen ? "border-b !border-b-[#F1F1F1]" : ""
          } no-underline hover:no-underline px-4  ${triggerClassName}`}
        >
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-x-4 items-center">
              <span
                className={`transform transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                <img src={chevron} alt="Toggle" className="h-3 -mt-0.5" />
              </span>
              <span className="text-[#222222] !font-poppins capitalize !font-semibold text-sm">
                {title}
              </span>
            </div>
            {triggerButtons}
          </div>
        </AccordionTrigger>
        <AccordionContent className={`${contentClassName}`}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
