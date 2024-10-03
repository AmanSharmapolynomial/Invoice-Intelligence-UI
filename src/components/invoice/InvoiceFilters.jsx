import {
  AutoAcceptedFilterFilterOptions,
  clickBACONStatusFilterOptions,
  HumanVerificationFilterOptions,
  InvoiceDetectionStatusFilterOptions,
  InvoiceReRunStatusFilterOptions,
  InvoiceTypeFilterOptions
} from "@/constants";
import CustomSelect from "../ui/CustomSelect";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const InvoiceFilters = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });
  const handleSelect = (ranges) => {
    console.log(ranges);
    setSelectionRange(ranges.selection);
  };

  return (
    <div className="mt-4 flex flex-col gap-y-4 !overflow-auto">
      <div className="grid grid-cols-2 gap-x-2">
        <div className="">
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Human Verification"
            placeholder="All"
            data={HumanVerificationFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Invoice Type"
            placeholder="All"
            data={InvoiceTypeFilterOptions}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            placeholder="All"
            label="Invoice Detection Status"
            data={InvoiceDetectionStatusFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            placeholder="All"
            label="Invoice Re Run Status"
            data={InvoiceReRunStatusFilterOptions}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div>
          <CustomSelect
            placeholder="Both"
            triggerClassName={"!w-full"}
            label="Auto Accepted Filter"
            data={AutoAcceptedFilterFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            label="clickBACON Status"
            data={clickBACONStatusFilterOptions}
          />
        </div>
      </div>
      <Label>Date Range</Label>
      <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
      <div className="flex gap-x-2 w-full justify-end">
        <Button className="bg-orange-600 hover:bg-orange-600">Reset</Button>
        <Button className="bg-[#3d91ff] hover:bg-[#3d91ff]">Apply</Button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
