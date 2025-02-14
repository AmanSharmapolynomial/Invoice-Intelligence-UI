import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { useGetItemMasterVendors } from "@/components/vendor/api";
import VendorsTable from "@/components/vendor/VendorsTable";
import React, { useState, useMemo } from "react";

const columns = [
  { key: `vendor[vendor_name]`, label: "Vendor Name" },
  { key: "unverified_item_count", label: "Unverified Item Count" },
  { key: "percentage_approved", label: "Percentage Approved" },
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

  return (
    <div className="h-screen flex w-full" id="maindiv">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Vendors"}
            crumbs={[{ path: null, label: "Vendors" }]}
          />

          <div className="flex items-center gap-x-2 justify-end">
            <div className="flex items-center gap-x-2">
              {/* Approval Dropdown */}
              <CustomDropDown
                data={approvalOptions}
                Value={selectedApproval}
                onChange={setSelectedApproval}
                showSearch={false}
                className={"!min-w-[12rem]"}
                commandGroupClassName="!min-h-[0rem] !max-h-[8rem]"
                contentClassName={"!w-[10rem]"}
                placeholder="Vendor Approval"
              />

              {/* Percentage Approval Dropdown */}
              <CustomDropDown
                data={percentageOptions}
                Value={selectedPercentage}
                className={"!min-w-[12rem]"}
                onChange={setSelectedPercentage}
                 commandGroupClassName="!min-h-[0rem] !max-h-[8rem]"
                showSearch={false}
                placeholder="Vendor Approval Percentage"
              />

              {/* Search Input */}
              <CustomInput
                showIcon={true}
                variant="search"
                placeholder="Search Vendors"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                className="min-w-72 max-w-96 border border-gray-200"
              />
            </div>
          </div>

          <VendorsTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
          />
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterVendors;
