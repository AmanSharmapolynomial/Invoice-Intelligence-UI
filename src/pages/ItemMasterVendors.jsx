import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { useGetItemMasterVendors } from "@/components/vendor/api";
import VendorsTable from "@/components/vendor/VendorsTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const columns = [
  { key: `vendor[vendor_name]`, label: "Vendor Name", sorting_key: "" },
  { key: `total_items`, label: "Total Items" },
  { key: "percentage_approved", label: "Percentage Approved" },
  { key: "unverified_item_count", label: "Unverified Item Count" },
  { key: "vendor[recent_addition_date]", label: "Last Item Update" }
];

const ItemMasterVendors = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const [vendorName, setVendorName] = useState("");

  const { data, isLoading } = useGetItemMasterVendors();
  const { resetStore } = fastItemVerificationStore();

  const human_verified_param = searchParams.get("human_verified");

  useEffect(() => {
    resetStore();
  }, []);

  // 🔍 Convert URL string param to actual boolean or null
  const parsedVerified = useMemo(() => {
    if (human_verified_param === "true") return true;
    if (human_verified_param === "false") return false;
    return null;
  }, [human_verified_param]);

  // 🧠 Filter the data on FE
  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((item) => {
      const matchesVerification =
        parsedVerified === null ? true : item.vendor?.human_verified === parsedVerified;

      const matchesSearch = vendorName
        ? item.vendor?.vendor_name?.toLowerCase().includes(vendorName.toLowerCase())
        : true;

      return matchesVerification && matchesSearch;
    });
  }, [data, parsedVerified, vendorName]);

  return (
    <div className="overflow-hidden flex w-full">
      <Sidebar />
      <div className="w-full ml-12">
        <Navbar />
        <Layout>
          <BreadCrumb title="Vendors" crumbs={[{ path: null, label: "Vendors" }]} />

          <div className="flex items-center gap-x-2 justify-end">
            <div className="flex items-center gap-x-3">
              <CustomDropDown
               contentClassName={"min-w-16"}
                data={[
                  { label: "All", value: null },
                  { label: "Verified", value: 'true' },
                  { label: "Not Verified", value: 'false' }
                ]}
                commandGroupClassName="!min-h-[5rem] !max-h-[10rem]"
                className={"!min-w-[10rem]  w-full"}
                value={parsedVerified}
                onChange={(v) => {
                  updateParams({ human_verified: v });
                }}
                placeholder="Human Verified"
              />
            </div>
            <div className="flex items-center gap-x-3">
              <CustomInput
                showIcon
                variant="search"
                placeholder="Search Vendors"
                value={vendorName}
                onChange={setVendorName}
                className="min-w-72 max-w-96 border border-gray-200"
              />
            </div>
          </div>

          <VendorsTable
            vendorName={vendorName}
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
