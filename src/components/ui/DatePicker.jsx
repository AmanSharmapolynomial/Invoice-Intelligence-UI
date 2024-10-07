import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "react-date-range";

export default function DatePicker({
  className,
  triggerClassName,
  initialDate,
  onChange,
  buttonLabel = "Pick a date",
  dateFormat = "PPP",
}) {
  const [date, setDate] = React.useState(initialDate || null);
  const handleDateChange = (val) => {
    setDate(val);
    if (onChange) {
      onChange(val); // Call the onChange prop if provided
    }
  };

  return (
    <Popover className={className}>
      <PopoverTrigger asChild className={`!bg-transparent ${triggerClassName}`}>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{buttonLabel}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          date={date}
          onChange={handleDateChange}
          className="text-red-500"
        />
      </PopoverContent>
    </Popover>
  );
}
