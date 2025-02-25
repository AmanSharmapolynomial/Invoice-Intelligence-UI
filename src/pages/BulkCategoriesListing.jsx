import { useGetCategoriesForBulkCategorization } from "@/components/bulk-categorization/api";
import BulkCategorizationTable from "@/components/bulk-categorization/BulkCategorizationTable";
import Navbar from "@/components/common/Navbar";
import TablePagination from "@/components/common/TablePagination";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const BulkCategoriesListing = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm,setSearchTerm]=useState("")
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  const { data, isLoading } = useGetCategoriesForBulkCategorization({
    page,
    page_size
  });

  const columns = [
    { label: "Category", key: "category[category_id]" },
    { label: "Items Count", key: "items_count" },
    { label: "Vendors", key: "vendors_count" },
    { label: "Approved Items", key: "approved_items_count" },
    { label: "Not Approved Items", key: "not_approved_items_count" }
  ];
  return (
    <div className="w-full">
      <Navbar />
      <div className="px-8 mt-4 w-full h-full">
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
                setSearchTerm(value)
            }}
            onKeyDown={(e) => {
                
            }}
            className="min-w-72 max-w-96 border border-gray-200 relative  focus:!ring-0 focus:!outline-none remove-number-spinner"
          />
        </div>
        <BulkCategorizationTable
          columns={columns}
          data={data}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />
        <TablePagination
          totalPages={data?.total_pages}
          isFinalPage={data?.is_final_page}
        />
      </div>
    </div>
  );
};

export default BulkCategoriesListing;
