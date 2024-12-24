"use client";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
export function DateRangePicker({ dateRange, onChange, className }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={onChange}
        numberOfMonths={1}
        className={cn(
          "border rounded-md dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF]",
          "font-poppins w-full flex justify-center"
        )}
        classNames={{
          day_selected:
            "bg-[#000000] text-white hover:bg-primary hover:text-white focus:!bg-primary focus:text-white",
          day_today: "bg-accent text-accent-foreground",
          day_range_middle: "!bg-primary",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_end:
            "!bg-primary text-white hover:!bg-primary hover:text-white focus:bg-[#000000] focus:text-white",
          day_range_start:
            "!bg-primary text-white hover:bg-[#000000] hover:text-white focus:bg-[#000000] focus:text-white",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md flex [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center ",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          table: "w-full border-collapse space-y-1  ",
          root: "p-3 ",
        }}
      />
     
    </div>
  );
}
