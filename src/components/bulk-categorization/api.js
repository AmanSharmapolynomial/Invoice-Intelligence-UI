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
          `/api/category/?page=${payload.page}&page_size=${payload.page_size}&items_count_order=${payload.items_count_order}&vendors_count_order=${payload.vendors_count_order}&approved_items_count_order=${payload.approved_items_count_order}&not_approved_items_count_order=${payload.not_approved_items_count_order}&name=${payload.name}`
        );
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};
export const useGetCategoriesForBulkCategorizationWithoutPagination = (
  payload
) => {
  return useQuery({
    queryKey: ["categories-for-bulk-categorization", payload],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/category/`);
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
      // scrollingMode
      let apiUrl = ``;
      if (payload?.scrollingMode) {
        apiUrl = `/api/category/${payload?.category_id}/vendor/${payload?.vendor_id}/`;
      } else {
        apiUrl = `/api/category/${payload?.category_id}/vendor/${payload?.vendor_id}/?page=${payload?.page}&page_size=${payload?.page_size}`;
      }
      try {
        let response = await axiosInstance.get(apiUrl);
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
      if (payload?.mode == "all") {
        try {
          let response = await axiosInstance.get(
            `/api/category/${payload?.category_id}/removed-items/?page=${payload?.page}&page_size=${payload?.page_size}`
          );

          return response;
        } catch (error) {
          return error?.response?.data?.message;
        }
      } else {
        if (!payload?.vendor_id || !payload?.category_id) {
          return;
        }
        try {
          let response = await axiosInstance.get(
            `/api/category/${payload?.category_id}/vendor/${payload?.vendor_id}/removed-items/?page=${payload?.page}&page_size=${payload?.page_size}`
          );
          return response;
        } catch (error) {
          return error?.response?.data?.message;
        }
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
    onError: (data) => {},
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
      return response;
    }
  });
};

export const useApproveCategoryVendorItems = () => {
  return useMutation({
    mutationFn: async (item_uuids) => {
      let apiUrl = `/api/category/item-master/bulk-approval/`;
      let response = await axiosInstance.post(apiUrl, { item_uuids });
      return response;
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};

export const useGetRemovedItemsCount = (payload) => {
  return useQuery({
    queryKey: ["removed-items-count", payload],
    queryFn: async () => {
      let { mode, category_id, vendor_id } = payload;
      let apiUrl = ``;
      if (mode == "vendor") {
        if (!vendor_id) {
          return;
        }
        apiUrl = `/api/category/${category_id}/removed-items-count/?vendor_id=${vendor_id}`;
      } else {
        apiUrl = `/api/category/${category_id}/removed-items-count/`;
      }

      try {
        let response = await axiosInstance.get(apiUrl);
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useRemoveCategoryItemsInBulk = () => {
  return useMutation({
    mutationFn: async (payload) => {
      let apiUrl = `/api/category/removed-items-bulk/`;
      let response = await axiosInstance.post(apiUrl, {
        item_uuids: payload?.item_uuids
      });
      return response;
    }
  });
};

export const useGetAllItemsOfACategory = (payload) => {
  return useQuery({
    queryKey: ["all-items-of-category", payload],
    queryFn: async () => {
      if (payload?.scrollingMode && payload?.mode == "all") {
        let apiUrl = `/api/category/${payload?.category_id}/items/`;
        let response = await axiosInstance.get(apiUrl);
        return response;
      }
    }
  });
};
