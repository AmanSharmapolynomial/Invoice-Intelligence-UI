"use client";

import { useInvoiceStore } from "@/components/invoice/store/index";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";
import {
  AutoAcceptedFilterFilterOptions,
  clickBACONStatusFilterOptions,
  HumanVerificationFilterOptions,
  InvoiceTypeFilterOptions
} from "@/constants";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import useFilterStore from "@/store/filtersStore";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRangePicker } from "../ui/Custom/DateRangePicker";
import CustomDropDown from "../ui/CustomDropDown";
import userStore from "../auth/store/userStore";
import { formatData } from "@/lib/helpers";
import { useGetUsersList } from "../user/api";

const InvoiceFilters = () => {
  const [searchParams] = useSearchParams();

  // Centralized state for filters
  const { filters, setFilters } = useFilterStore();
  let human_verification = searchParams.get("human_verification") || "all";
  let human_verified = searchParams.get("human_verified") || "all";
  let invoice_type = searchParams.get("invoice_type") || "all";
  let clickbacon_status = searchParams.get("clickbacon_status") || "all";
  let agent_metadata_validation_status =
    searchParams.get("agent_metadata_validation_status") == "null" ||
    searchParams.get("agent_metadata_validation_status") == "all"
      ? 'all'
      : searchParams.get("agent_metadata_validation_status") || "all";
  let agent_table_data_validation_status =searchParams.get("agent_table_data_validation_status") || "all";
  let auto_accepted = searchParams.get("auto_accepted") || "all";
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let assigned_to = searchParams.get("assigned_to") || "none";
  let rejected = searchParams.get("rejected") || "all";
  let extraction_source = searchParams.get("extraction_source") || "all";
  let start_date = searchParams.get("start_date") || "";
  let end_date = searchParams.get("end_date") || "";
  const { data: users, isLoading: loadingUsers } = useGetUsersList();

  const [selectionRange, setSelectionRange] = useState({
    from: filters?.start_date ? new Date(filters?.start_date) : null,
    to: filters?.end_date ? new Date(filters?.end_date) : null
  });
  const { role } = userStore();
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
    setFilters({ ...filters, start_date: startDate, end_date: endDate });

    updateParams({ start_date: startDate, end_date: endDate });
  };

  // Reset filters and date range
  const handleReset = () => {
    const defaultFilters = {
      human_verified: "all",
      human_verification: "all",
      invoice_type: "all",
      clickbacon_status: "all",
      // rerun_status: "all",
      detected: "all",
      auto_accepted: "all",
      auto_accepted_by_vda: "",
      rejected: "all",
      extraction_source:"all"
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
      sort_order: "desc",
      rejected: "all",
      extraction_source:"all"
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
            value={auto_accepted_by_vda}
            label="Auto Accepted By VDA Filter"
            onSelect={(val) => updateFilter("auto_accepted_by_vda", val)}
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
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            label="Extraction Source"
            value={extraction_source}
            onSelect={(val) => updateFilter("extraction_source", val)}
            data={[
              {
                label: "Method A",
                value: "method_a"
              },
              {
                label: "Method B",
                value: "method_b"
              },
              {
                label: "All",
                value: "all"
              },
            ]}
          />
        </div>
        <div>
          <CustomSelect
            placeholder="All"
            triggerClassName={"!w-full"}
            label="Rejected"
            value={rejected}
            onSelect={(val) => updateFilter("rejected", val)}
            data={AutoAcceptedFilterFilterOptions}
          />
        </div>
         <div>
          <CustomSelect
            value={agent_metadata_validation_status}
            label="Agent Metadata Validation Status"
            placeholder="All"
            commandGroupClassName="!min-h-[5rem] !max-h-[10rem]"
            className={"!min-w-[10rem]  w-full"}
            data={[
              { label: "Unassigned", value: "unassigned" },
              { label: "Assigned", value: "assigned" },
              { label: "Queued", value: "queued" },
              { label: "Processing", value: "processing" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "All", value: "all" },
            ]}
            onSelect={(val) => {
              if (val == null) {
                updateParams({ agent_metadata_validation_status: undefined });
                setFilters({ ...filters, agent_metadata_validation_status: undefined });
              } else {
                updateParams({ agent_metadata_validation_status: val });
                setFilters({ ...filters, agent_metadata_validation_status: val });
              }
            }}
          />
        </div>
        <div>
          <CustomSelect
            value={agent_table_data_validation_status}
            label="Agent Table Data  Validation Status"
            placeholder="All"
            commandGroupClassName="!min-h-[5rem] !max-h-[10rem]"
            className={"!min-w-[10rem]  w-full"}
            data={[
              { label: "Unassigned", value: "unassigned" },
              { label: "Assigned", value: "assigned" },
              { label: "Queued", value: "queued" },
              { label: "Processing", value: "processing" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "All", value: "all" },
            ]}
            onSelect={(val) => {
              if (val == 'all') {
                updateParams({ agent_table_data_validation_status: undefined });
                setFilters({ ...filters, agent_table_data_validation_status: undefined });
              } else {
                updateParams({ agent_table_data_validation_status: val });
                setFilters({ ...filters, agent_table_data_validation_status: val });
              }
            }}
          />
        </div>

        <div>
          {(role?.toLowerCase() == "admin" ||
            role?.toLowerCase() == "manager") && (
            <CustomSelect
              value={assigned_to}
              label="Users"
              placeholder="All Users"
              data={formatData(users?.data)}
              searchPlaceholder="Search User"
              onSelect={(val) => {
                if (typeof val == "object") {
                  let assigned_to = val.map((item) => item).join(",");
                  setFilters({ ...filters, assigned_to: assigned_to,page:1 });
                  updateParams({ assigned_to: assigned_to,page:1 });
                } else {
                  if (val == "none") {
                    updateParams({ assigned_to: undefined });
                    setFilters({ ...filters, assigned_to: undefined,page:1 });
                  } else {
                    updateParams({ assigned_to: val,page:1 });
                    setFilters({ ...filters, assigned_to: val,page:1 });
                  }
                }
              }}
            />
          )}
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
