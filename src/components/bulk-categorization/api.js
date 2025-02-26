import { axiosInstance } from "@/axios/instance";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoriesForBulkCategorization = (payload) => {
  return useQuery({
    queryKey: ["categories-for-bulk-categorization", payload],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/category/?page=${payload.page}&page_size=${payload.page_size}`
        );
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useGetCategoryWiseVendor = (payload) => {
  return useQuery({
    queryKey: ["category-wise-items", payload],
    queryFn: async () => {
      try {
        let { page, page_size, vendor_name, category_id } = payload;

        let apiUrl = `/api/category/${category_id}/vendor/`;
        let response = await axiosInstance.get(`${apiUrl}`);
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useGetCategoryWiseVendorItems = (payload) => {
  return useQuery({
    queryKey: ["category-wise-items", payload],
    queryFn: async () => {
      if((!payload?.vendor_id|| !payload?.category_id|| !payload?.page||!payload?.page_size)) {
        return
      }

      try {
        let response = await axiosInstance.get(
          `/api/category/${payload?.category_id}/vendor/${payload?.vendor_id}/?page=${payload?.page}&page_size=${payload?.page_size}`
        );
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};
