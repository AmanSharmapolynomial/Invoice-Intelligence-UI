import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
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
  {
    key: `vendor[vendor_name]`,
    label: "Vendor Name",
    sorting_key: "human_verified"
  },
  {
    key: `total_items`,
    label: "Total Items",
    sorting_key: "total_items_count"
  },
  {
    key: "percentage_approved",
    label: "Percentage Approved",
    sorting_key: "percentage_approved"
  },
  {
    key: "unverified_item_count",
    label: "Unverified Item Count",
    sorting_key: "unverified_item_count"
  },
  {
    key: "vendor[recent_addition_date]",
    label: "Last Item Update",
    sorting_key: "recent_addition_date"
  }
];

const approvalOptions = [
  { label: "All", value: "all" },
  { label: "Approved", value: "true" },
  { label: "Not Approved", value: "false" }
];

const percentageOptions = [
  { label: "All", value: "all" },
  { label: "0-50%", value: "0-50" },
  { label: "50-100%", value: "50-100" }
];

const ItemMasterVendors = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let human_verified = searchParams.get("human_verified") || "all";
  let percentage_approved = searchParams.get("percentage_approved") || "all";
  let recent_addition_date = searchParams.get("recent_addition_date") || "all";
  let total_items_count = searchParams.get("total_items_count") || "all";
  let vendor_name = searchParams.get("vendor_name") || "";
  let unverified_item_count =
    searchParams.get("unverified_item_count") || "desc";

  const { data, isLoading } = useGetItemMasterVendors({
    page,
    page_size,
    human_verified,
    unverified_item_count,
    percentage_approved,
    vendor_name,
    recent_addition_date,
    total_items_count
  });
  let selected_approval = searchParams.get("selected_approval") || null;
  let selected_percentage = searchParams.get("selected_percentage") || null;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(selected_approval);
  const [selectedPercentage, setSelectedPercentage] =
    useState(selected_percentage);

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

  const [showFilters, setShowFilters] = useState(false);
  let searchTimer;
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
              <CustomInput
                showIcon
                variant="search"
                placeholder="Search Vendors"
                value={vendor_name}
                onChange={(v) => {
                  clearTimeout(searchTimer);
                  searchTimer = setTimeout(() => {
                    updateParams({
                      vendor_name: v
                    });
                  }, 300);
                }}
                className="min-w-72 max-w-96 border border-gray-200"
              />
            </div>
          </div>

          <VendorsTable
            columns={columns}
            data={data?.data?.length > 0 ? data?.data : []}
            isLoading={isLoading}
          />
          <TablePagination
            isFinalPage={data?.is_final_page}
            totalPages={data?.total_pages}
          />
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterVendors;
