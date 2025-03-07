import {
  useGetCategoriesForBulkCategorization,
  useGetCategoriesForBulkCategorizationWithoutPagination
} from "@/components/bulk-categorization/api";
import React from "react";

const Test = () => {
  const { data, isLoading } =
    useGetCategoriesForBulkCategorizationWithoutPagination();

  if (isLoading) return <div>Loading...</div>;

  // Calculate total unverified items
  console.log(data?.data)
  const totalUnverifiedItems =
    data?.data?.reduce((sum, category) => sum + category.items_count, 0) || 0;

  return <div>Total Unverified Items: {totalUnverifiedItems}</div>;
};

export default Test;
