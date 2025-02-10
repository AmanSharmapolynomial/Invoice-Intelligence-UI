import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import VendorsTable from "@/components/vendor/VendorsTable";
import { itemMasterVendorData } from "@/constants/test";
import React from "react";
const columns = [
  { key: "vendor_name", label: "Vendor Name" },
  { key: "human_verified", label: "Human Verified" },
  { key: "unverified_item_count", label: "Unverified Item Count" },
  { key: "percentage_approved", label: "Percentage Approved" },
  { key: "last_item_update_date_time", label: "Last Item Update" }
];
const ItemMasterVendors = () => {
  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Vendors"}
            crumbs={[
              {
                path: null,
                label: "Vendors"
              }
            ]}
          />

          <div className="flex items-center gap-x-2 justify-end ">
            <div className="flex items-center gap-x-2">
              <CustomDropDown
                data={[]}
                Value={null}
                placeholder="Vendor Approval Percentage"
              />
              <CustomDropDown
                data={[]}
                Value={null}
                placeholder="Vendor Approval"
              />
              <CustomInput
                showIcon={true}
                variant="search"
                placeholder="Search invoice"
                value={null}
                onChange={(value) => {}}
                onKeyDown={(e) => {}}
                className="min-w-72 max-w-96 border border-gray-200 relative  focus:!ring-0 focus:!outline-none remove-number-spinner"
              />
            </div>
          </div>
          <VendorsTable columns={columns} data={itemMasterVendorData} />
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterVendors;
