import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useGetItemMasterVendors } from "@/components/vendor/api";
import VendorsTable from "@/components/vendor/VendorsTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { ArrowRight, Filter } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const columns = [
  { key: `vendor[vendor_name]`, label: "Vendor Name" },
  { key: `total_items`, label: "Total Items" },
  { key: "percentage_approved", label: "Percentage Approved" },
  { key: "unverified_item_count", label: "Unverified Item Count" },
  { key: "vendor[recent_addition_date]", label: "Last Item Update" }
];

const approvalOptions = [
  { label: "All", value: null },
  { label: "Approved", value: "true" },
  { label: "Not Approved", value: "false" }
];

const percentageOptions = [
  { label: "All", value: null },
  { label: "0-50%", value: "0-50" },
  { label: "50-100%", value: "50-100" }
];

const ItemMasterVendors = () => {
  const { data, isLoading } = useGetItemMasterVendors();
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  let selected_approval = searchParams.get("selected_approval") || null;
  let selected_percentage = searchParams.get("selected_percentage") || null;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(selected_approval);
  const [selectedPercentage, setSelectedPercentage] =
    useState(selected_percentage);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const { resetStore } = fastItemVerificationStore();
  useEffect(() => {
    resetStore();
  }, []);
  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          .split(/[[\]]/g)
          .filter(Boolean)
          .reduce((o, k) => (o ? o[k] : ""), obj)
      : obj[key];
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((row) => {
      const matchesSearch = columns.some((col) =>
        String(getValue(row, col.key))
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      const matchesApproval =
        selectedApproval === null ||
        getValue(row, "vendor[human_verified]") ===
          (selectedApproval === "true");

      const matchesPercentage =
        !selectedPercentage ||
        (selectedPercentage === "0-50" &&
          getValue(row, "percentage_approved") <= 50) ||
        (selectedPercentage === "50-100" &&
          getValue(row, "percentage_approved") > 50);

      return matchesSearch && matchesApproval && matchesPercentage;
    });
  }, [data, searchQuery, selectedApproval, selectedPercentage]);

  const sortedData = useMemo(() => {
    if (!filteredData || !sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, sortConfig.key) || "";
      const bValue = getValue(b, sortConfig.key) || "";

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else if (sortConfig.direction === "desc") {
        return aValue < bValue ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  const [showFilters, setShowFilters] = useState(false);


   const handleReset=()=>{
    setSelectedApproval(null)
    setSelectedPercentage(null)
    updateParams({selected_approval:null,selected_percentage:null})
   }
  return (
    <div className="overflow-hidden flex w-full">
      <Sidebar />

      <div className="w-full ml-12">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Vendors"
            crumbs={[{ path: null, label: "Vendors" }]}
          />
          <div className="flex items-center gap-x-2 justify-end">
            <div className="flex items-center gap-x-3">
              <Sheet
                open={showFilters}
                onOpenChange={() => setShowFilters(!showFilters)}
              >
                <SheetTrigger>
                  <Button
                    className={`${
                      selected_percentage || selected_approval
                        ? "bg-primary"
                        : "bg-transparent hover:bg-transparent"
                    } rounded-sm h-[2.5rem] w-[2.5rem]  border  shadow-none`}
                  >
                    <Filter
                      className={`${
                        (selected_percentage || selected_approval) &&
                        "text-white"
                      } text-black/40 dark:text-white/50 h-5 `}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-y-4">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex justify-between items-center">
                        <p>Filters</p>
                        <div
                          className="flex items-center gap-x-2 cursor-pointer"
                          onClick={() => setShowFilters(!showFilters)}
                        >
                          <p className="text-sm font-poppins font-normal text-[#000000]">
                            Collapse
                          </p>
                          <ArrowRight className="h-4 w-4 text-[#000000]" />
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-y-0.5">
                    <CustomSelect
                      data={approvalOptions}
                      Value={selected_approval}
                      label="Vendor Approval"
                      onSelect={(v) => {
                        setSelectedApproval(v);
                        updateParams({ selected_approval: v });
                      }}
                      showSearch={false}
                      className="!min-w-[12rem] !z-50 "
                      commandGroupClassName="!min-h-[0rem] !max-h-[8rem] !z-50"
                      contentClassName={"!z-50"}
                      placeholder={selectedApproval || "All"}
                    />
                  </div>
                  <div className="flex flex-col gap-y-0.5">
                    <CustomSelect
                      data={percentageOptions}
                      Value={selected_percentage}
                      label="Vendor Approval Percentage"
                      onSelect={(v) => {
                        setSelectedPercentage(v);
                        updateParams({ selected_percentage: v });
                      }}
                      commandGroupClassName="!min-h-[0rem] !max-h-[8rem]"
                      showSearch={false}
                      className="!min-w-[12rem]"
                      placeholder={selectedPercentage || "All"}
                    />
                  </div>
                  <div className="w-full flex items-center justify-end">
                    <Button
                      className="bg-primary hover:bg-primary/95 font-poppins !font-normal !rounded-sm text-white text-xs"
                      onClick={handleReset}
                    >
                        Reset
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <CustomInput
                showIcon
                variant="search"
                placeholder="Search Vendors"
                value={searchQuery}
                onChange={setSearchQuery}
                className="min-w-72 max-w-96 border border-gray-200"
              />
            </div>
          </div>

          <VendorsTable
            columns={columns}
            data={sortedData}
            isLoading={isLoading}
            handleSort={setSortConfig}
            sortConfig={sortConfig}
          />
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterVendors;
