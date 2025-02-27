import { useGetCategoriesForBulkCategorization } from "@/components/bulk-categorization/api";
import BulkCategorizationTable from "@/components/bulk-categorization/BulkCategorizationTable";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
const columns = [
  { label: "Category", key: "category[category_id]" ,sorting_key:""},
  { label: "Items Count", key: "items_count",sorting_key:"items_count_order" },
  { label: "Vendors", key: "vendors_count",sorting_key:"vendors_count_order" },
  { label: "Approved Items", key: "approved_items_count" ,sorting_key:"approved_items_count_order"},
  { label: "Not Approved Items", key: "not_approved_items_count",sorting_key:"not_approved_items_count_order" }
];
const BulkCategoriesListing = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let items_count_order = searchParams.get('items_count_order') || 'all'
  let vendors_count_order = searchParams.get('vendors_count_order') || 'all'
  let approved_items_count_order = searchParams.get('approved_items_count_order') || 'all'
  let not_approved_items_count_order = searchParams.get('not_approved_items_count_order') || 'all'
  const { data, isLoading } = useGetCategoriesForBulkCategorization({
    page,
    page_size,
    items_count_order,
    vendors_count_order,
    approved_items_count_order,
    not_approved_items_count_order
  });

  return (
    <div className="w-full">
      <Sidebar/>
      <div className="pl-12">
      <Navbar />
      <div className="px-8 mt-2 w-full h-full">
        <BreadCrumb
          title={"Categories List"}
          crumbs={[{ path: null, label: "Categories List" }]}
        />
        <div className="flex justify-end items-center mt-4">
          <CustomInput

            showIcon={true}
            variant="search"
            placeholder="Search Category"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
            }}
            onKeyDown={(e) => { }}
            className="min-w-72 max-w-96 border border-gray-200 relative   focus:!ring-0 focus:!outline-none remove-number-spinner"
          />
        </div>
        <div className="w-full h-full">
          <BulkCategorizationTable
            columns={columns}
            data={data}
            searchTerm={searchTerm}
            isLoading={isLoading}
          />
        </div>
        <TablePagination
          totalPages={data?.total_pages}
          isFinalPage={data?.is_final_page}
        />
      </div>
      </div>
    </div>
  );
};

export default BulkCategoriesListing;
