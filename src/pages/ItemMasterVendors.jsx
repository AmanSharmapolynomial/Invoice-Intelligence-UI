import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import { useGetItemMasterVendors } from "@/components/vendor/api";
import VendorsTable from "@/components/vendor/VendorsTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const columns = [
  {
    key: `vendor[vendor_name]`,
    label: "Vendor Name",
    sorting_key: ""
  },
  {
    key: `total_items`,
    label: "Total Items"
  },
  {
    key: "percentage_approved",
    label: "Percentage Approved"
  },
  {
    key: "unverified_item_count",
    label: "Unverified Item Count"
  },
  {
    key: "vendor[recent_addition_date]",
    label: "Last Item Update"
  }
];

const ItemMasterVendors = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const [vendorName, setVendorName] = useState("");

  const { data, isLoading } = useGetItemMasterVendors();

  const { resetStore } = fastItemVerificationStore();
  useEffect(() => {
    resetStore();
  }, []);

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
                value={vendorName}
                onChange={(v) => {
                  setVendorName(v);
                }}
                className="min-w-72 max-w-96 border border-gray-200"
              />
            </div>
          </div>

          <VendorsTable
            vendorName={vendorName}
            columns={columns}
            data={data?.data?.length > 0 ? data?.data : []}
            isLoading={isLoading}
          />
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterVendors;
