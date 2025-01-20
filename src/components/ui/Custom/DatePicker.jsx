"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function DatePicker({ date, onChange, className }) {
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "MM/dd/yyyy") : ""
  );
  const [month, setMonth] = React.useState(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = React.useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (newValue.length <= 2) {
      formattedValue = newValue;
    } else if (newValue.length <= 4) {
      formattedValue = `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
    } else {
      formattedValue = `${newValue.slice(0, 2)}/${newValue.slice(
        2,
        4
      )}/${newValue.slice(4, 8)}`;
    }

    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      const parsedDate = parse(formattedValue, "MM/dd/yyyy", new Date());
      if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
        onChange(parsedDate);
        setMonth(parsedDate.getMonth());
        setYear(parsedDate.getFullYear());
      }
    }
  };

  const handleCalendarSelect = (newDate) => {
    onChange(newDate);
    setInputValue(newDate ? format(newDate, "MM/dd/yyyy") : "");
    if (newDate) {
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
    }
  };

  const handleMonthChange = (value) => {
    const newMonth = parseInt(value, 10);
    setMonth(newMonth);
    if (date) {
      const newDate = new Date(date.setMonth(newMonth));
      onChange(newDate);
      setInputValue(format(newDate, "MM/dd/yyyy"));
    }
  };

  const handleYearChange = (value) => {
    const newYear = parseInt(value, 10);
    setYear(newYear);
    if (date) {
      const newDate = new Date(date.setFullYear(newYear));
      onChange(newDate);
      setInputValue(format(newDate, "MM/dd/yyyy"));
    }
  };

  return (
    <Popover className="!z-10">
      <PopoverTrigger asChild  className="!z-10">
        <div className="relative w-full z-10">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="MM/DD/YYYY"
            className={cn(
              "pr-10 dark:bg-[#000000] !min-w-full dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0] capitalize !shadow-none !rounded-[4px] !text-[#000000] hover:text-[#666666] font-poppins font-normal text-xs !h-[2.5rem] -z-10",
              className
            )}
          />
          <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-[#000000]/80" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-between p-2">
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[110px]">
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
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => {
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
          mode="single"
          selected={date}
          onSelect={handleCalendarSelect}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth());
            setYear(newMonth.getFullYear());
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
