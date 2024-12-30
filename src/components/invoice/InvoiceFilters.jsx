"use client";

import { useInvoiceStore } from "@/components/invoice/store/index";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";
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
import { useSearchParams } from "react-router-dom";
import { DateRangePicker } from "../ui/Custom/DateRangePicker";
import useFilterStore from "@/store/filtersStore";

const InvoiceFilters = () => {
  const [searchParams] = useSearchParams();

  // Centralized state for filters
  const { filters, setFilters } = useFilterStore();
  let human_verification = searchParams.get("human_verification") || "all";
  let human_verified = searchParams.get("human_verified") || "all";
  let invoice_type = searchParams.get("invoice_type") || "all";
  let clickbacon_status = searchParams.get("clickbacon_status") || "all";
  let auto_accepted = searchParams.get("auto_accepted") || "all";
  let start_date = searchParams.get("start_date") || "";
  let end_date = searchParams.get("end_date") || "";
  
  const [selectionRange, setSelectionRange] = useState({
    from: filters?.start_date ? new Date(filters?.start_date) : null,
    to: filters?.end_date ? new Date(filters?.end_date) : null
  });

  const updateParams = useUpdateParams();
  const { setRestaurantFilter, setVendorFilter } = useInvoiceStore();

  // Update individual filter state and query params
  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    updateParams({ [key]: value, page: 1 });
  };

  // Handle date range selection
  const handleDateRangeChange = (range) => {
    const startDate = range?.from
      ? new Date(range.from).toISOString().split("T")[0]
      : null;
    const endDate = range?.to
      ? new Date(range.to).toISOString().split("T")[0]
      : null;

    setSelectionRange({
      from: startDate,
      to: endDate
    });

    updateParams({ start_date: startDate, end_date: endDate });
  };

  // Reset filters and date range
  const handleReset = () => {
    const defaultFilters = {
      human_verified: "all",
      human_verification: "all",
      invoice_type: "all",
      clickbacon_status: "all",
      rerun_status: "all",
      detected: "all",
      auto_accepted: "all"
    };

    setFilters(defaultFilters);
    updateParams({
      ...defaultFilters,
      page: 1,
      start_date: "",
      end_date: "",
      vendor: "",
      restaurant: "",
      assigned_to: "",
      sort_order: "desc"
    });

    setRestaurantFilter("none");
    setVendorFilter("none");
    setSelectionRange({ from: null, to: null });
  };

  return (
    <div className="mt-2 flex flex-col gap-y-2 !overflow-auto">
      <div className="flex flex-col gap-y-2">
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Human Verification"
            placeholder="All"
            value={human_verification}
            onSelect={(val) => updateFilter("human_verification", val)}
            data={HumanVerificationFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Human Verified"
            placeholder="All"
            value={human_verified}
            onSelect={(val) => {
              updateFilter("human_verified", val);
            }}
            data={AutoAcceptedFilterFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            triggerClassName={"!w-full"}
            label="Invoice Type"
            placeholder="All"
            value={invoice_type}
            onSelect={(val) => updateFilter("invoice_type", val)}
            data={InvoiceTypeFilterOptions}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            value={auto_accepted}
            label="Auto Accepted Filter"
            onSelect={(val) => updateFilter("auto_accepted", val)}
            data={AutoAcceptedFilterFilterOptions}
          />
        </div>
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            label="clickBACON Status"
            value={clickbacon_status}
            onSelect={(val) => updateFilter("clickbacon_status", val)}
            data={clickBACONStatusFilterOptions}
          />
        </div>
      </div>
      <Label>Date Range</Label>
      <DateRangePicker
        className={"!w-fit"}
        dateRange={{
          from: selectionRange.from ? new Date(selectionRange.from) : null,
          to: selectionRange.to ? new Date(selectionRange.to) : null
        }}
        onChange={handleDateRangeChange}
      />
      <div className="flex gap-x-2 w-full mt-2 justify-end">
        <Button
          className="bg-primary hover:bg-primary/95 font-poppins !font-normal !rounded-sm text-white text-xs"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
