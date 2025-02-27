import { axiosInstance } from "@/axios/instance";
import { queryClient } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetCategoriesForBulkCategorization = (payload) => {
  return useQuery({
    queryKey: ["categories-for-bulk-categorization", payload],
    queryFn: async () => {
     
      try {
        const response = await axiosInstance.get(
          `/api/category/?page=${payload.page}&page_size=${payload.page_size}&items_count_order=${payload.items_count_order}&vendors_count_order=${payload.vendors_count_order}&approved_items_count_order=${payload.approved_items_count_order}&not_approved_items_count_order=${payload.not_approved_items_count_order}`
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
      if (
        !payload?.vendor_id ||
        !payload?.category_id ||
        !payload?.page ||
        !payload?.page_size
      ) {
        return;
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

export const useGetRemovedVendorItems = (payload) => {
  return useQuery({
    queryKey: ["removed-vendor-items", payload],
    queryFn: async () => {
      if (!payload?.vendor_id || !payload?.category_id) {
        return;
      }

      try {

        let response = await axiosInstance.get(
          `/api/category/${payload?.category_id}/vendor/${payload?.vendor_id}/removed-items/`
        );
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useRemoveVendorItem = () => {
  return useMutation({
    mutationFn: async (payload) => {
      let response = await axiosInstance.post(
        `/api/category/item-master/${payload?.item_uuid}/removed-items/`
      );
      return response;
    },
    onError: (data) => { },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["removed-vendor-items"] });
    }
  });
};


export const useUpdateBulkItemsCategory = () => {
  return useMutation({
    mutationFn: async (items_category) => {
      let apiUrl = `/api/category/item-master/bulk-update/`;
      let response = await axiosInstance.post(apiUrl, items_category);
      return response
    },

  })
}