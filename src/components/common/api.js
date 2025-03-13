import { axiosInstance } from "@/axios/instance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useExtractOcrText = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `/api/utils/ocr-text-extract/`,
        data
      );
      return response;
    }
  });
};

export const useGetVendorsNames = (archived_status = true) => {
  return useQuery({
    queryKey: ["vendors-names"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/vendor/names/?archived_status=${archived_status}`
        );

        return response?.data;
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
};

export const useGetVendorAddresses = (vendor_id) => {
  return useQuery({
    queryKey: ["vendor-addresses", vendor_id],
    queryFn: async () => {
      if (vendor_id) {
        try {
          const response = await axiosInstance.get(
            `/api/vendor-branch/${vendor_id}/?vendor_address`
          );
          return response?.data;
        } catch (error) {
          return error?.response?.data;
        }
      }
    }
  });
};

export const useGetFormatteddateFromAnyFormat = () => {
  return useMutation({
    mutationFn: async (date) => {
      const response = await axiosInstance.get(
        `/api/utils/get-standardize-date/?date=${date}`
      );
      return response;
    }
  });
};
