import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { useGetItemMasterVendors } from "@/components/vendor/api";
import VendorsTable from "@/components/vendor/VendorsTable";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import React, { useState, useMemo, useEffect } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedPercentage, setSelectedPercentage] = useState(null);
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
            <div className="flex items-center gap-x-2">
              <CustomDropDown
                data={approvalOptions}
                Value={selectedApproval}
                onChange={setSelectedApproval}
                showSearch={false}
                className="!min-w-[12rem] "
                commandGroupClassName="!min-h-[0rem] !max-h-[8rem]"
                placeholder="Vendor Approval"
              />

              <CustomDropDown
                data={percentageOptions}
                Value={selectedPercentage}
                onChange={setSelectedPercentage}
                commandGroupClassName="!min-h-[0rem] !max-h-[8rem]"
                showSearch={false}
                className="!min-w-[12rem]"
                placeholder="Vendor Approval Percentage"
              />

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
