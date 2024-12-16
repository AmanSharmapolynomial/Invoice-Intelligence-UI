"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays, CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export default function DatePicker({ date, onChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "min-w-[280px] text-left dark:bg-[#000000] dark:text-textColor/200 dark:border-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border-[#E0E0E0]  justify-between capitalize !shadow-none !rounded-[4px] text-[#666666] hover:text-[#666666] font-poppins font-normal text-xs    !h-[2.5rem] ",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarDays className="text-[#000000]/80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-full p-0 " align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
