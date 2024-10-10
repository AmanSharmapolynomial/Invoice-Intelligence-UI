import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"; // adjust the import based on your setup

const CustomAccordion = ({ title, children,contentClassName }) => {
  return (
    <Accordion type="single" collapsible className="mt-4 ">
      <AccordionItem value={title} className="!border rounded-t-md rounded-b-md">
        <AccordionTrigger className="!text-sm font-semibold  hover:no-underline border-b pb-3 ">
          <p className="px-4">{title}</p>
        </AccordionTrigger>
        <AccordionContent className={`${contentClassName} `}>

            <div className="px-4 !border-none ">
            {children}
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
