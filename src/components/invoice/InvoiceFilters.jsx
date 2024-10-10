import {
  AutoAcceptedFilterFilterOptions,
  clickBACONStatusFilterOptions,
  HumanVerificationFilterOptions,
  InvoiceDetectionStatusFilterOptions,
  InvoiceReRunStatusFilterOptions,
  InvoiceTypeFilterOptions
} from "@/constants";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";
import { useInvoiceStore } from "@/components/invoice/store/index";

const InvoiceFilters = () => {
  const [searchParams] = useSearchParams();
  const [human_verified, setHumanverified] = useState(
    searchParams.get("human_verified") || "all"
  );
  const [invoice_type, setInvoiceType] = useState(
    searchParams.get("invoice_type") || "all"
  );
  const [clickbacon_status, setClickBaconStatus] = useState(
    searchParams.get("clickbacon_status") || "all"
  );
  const [rerun_status, setRerunStatus] = useState(
    searchParams.get("rerun_status") || "all"
  );
  const [detected, setDetected] = useState(
    searchParams.get("detected") || "all"
  );
  const [auto_accepted, setAutoAccepted] = useState(
    searchParams.get("auto_accepted") || "all"
  );

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  const updateParams = useUpdateParams();
  const {
    setRestaurantFilter,
    setVendorFilter,
  } = useInvoiceStore();
  const handleSelect = (ranges) => {
    const startDate = new Date(ranges.selection.startDate);
    const endDate = new Date(ranges.selection.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(adjustedStartDate.getDate() + 1); 

    setSelectionRange({
      startDate,
      endDate,
      key: "selection"
    });

    updateParams({
      start_date: adjustedStartDate.toISOString().split("T")[0], 
      end_date: endDate.toISOString().split("T")[0] 
    });
  };

  const handleReset = () => {
    updateParams({
      detected: undefined,
      invoice_type: undefined,
      human_verified: undefined,
      clickbacon_status: undefined,
      rerun_status: undefined,
      auto_accepted: undefined,
      start_date: undefined,
      end_date: undefined,
      restaurant:undefined,
      vendor:undefined,
    });

    setHumanverified("all");
    setClickBaconStatus("all");
    setInvoiceType("all");
    setDetected("all");
    setRerunStatus("all");
    setAutoAccepted("all");
    setVendorFilter("none")
    setRestaurantFilter("none")
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    });
  };


  return (
    <div className="mt-4 flex flex-col gap-y-4 !overflow-auto">
      <div className="grid grid-cols-2 gap-x-2">
        <div className="">
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Human Verification"
            placeholder="All"
            value={human_verified}
            onSelect={(val) => {
              setHumanverified(val);
              updateParams({ human_verified: val,page:1 });
            }}
            data={HumanVerificationFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Invoice Type"
            placeholder="All"
            value={invoice_type}
            onSelect={(val) => {
              setInvoiceType(val);
              updateParams({ invoice_type: val,page:1 });
            }}
            data={InvoiceTypeFilterOptions}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            placeholder="All"
            value={detected}
            label="Invoice Detection Status"
            data={InvoiceDetectionStatusFilterOptions}
            onSelect={(val) => {
              setDetected(val);
              updateParams({ detected: val,page:1 });
            }}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            placeholder="All"
            value={rerun_status}
            label="Invoice Re Run Status"
            onSelect={(val) => {
              setRerunStatus(val);
              updateParams({ rerun_status: val,page:1 });
            }}
            data={InvoiceReRunStatusFilterOptions}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            value={auto_accepted}
            label="Auto Accepted Filter"
            onSelect={(val) => {
              setAutoAccepted(val);
              updateParams({ auto_accepted: val,page:1 });
            }}
            data={AutoAcceptedFilterFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            label="clickBACON Status"
            value={clickbacon_status}
            onSelect={(val) => {
              setClickBaconStatus(val);
              updateParams({ clickbacon_status: val,page:1 });
            }}
            data={clickBACONStatusFilterOptions}
          />
        </div>
      </div>
      <Label>Date Range</Label>
      <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
      <div className="flex gap-x-2 w-full justify-end">
        <Button
          className="bg-primary hover:bg-primary/95"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
