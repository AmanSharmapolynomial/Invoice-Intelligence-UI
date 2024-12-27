"use client";

import React, { useState, useEffect } from "react";
import { addMonths, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DateRangePicker({ dateRange, onChange, className }) {
  const [month, setMonth] = useState(() => {
    return dateRange && dateRange.from ? dateRange.from.getMonth() : new Date().getMonth();
  });

  const [year, setYear] = useState(() => {
    return dateRange && dateRange.from ? dateRange.from.getFullYear() : new Date().getFullYear();
  });

  useEffect(() => {
    if (dateRange && dateRange.from) {
      setMonth(dateRange.from.getMonth());
      setYear(dateRange.from.getFullYear());
    }
  }, [dateRange]);

  const handleMonthChange = (value) => {
    setMonth(parseInt(value, 10));
  };

  const handleYearChange = (value) => {
    setYear(parseInt(value, 10));
  };

  const handleSelect = (range) => {
    if (range && range.from) {
      const from = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 12, 0, 0);
      const to = range.to ? new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 12, 0, 0) : undefined;
      onChange({ from, to });
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex justify-between mb-2">
        <Select value={month.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {format(new Date(0, i), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => {
              const yearValue = new Date().getFullYear() - 5 + i;
              return (
                <SelectItem key={i} value={yearValue.toString()}>
                  {yearValue}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={new Date(year, month)}
        selected={dateRange}
        onSelect={handleSelect}
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

