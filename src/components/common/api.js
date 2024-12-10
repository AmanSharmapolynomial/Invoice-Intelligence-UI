import { useMutation, useQuery } from "@tanstack/react-query";

export const useExtractOcrText = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await instance.post(
        `/api/utils/ocr-text-extract/`,
        data
      );
      return response?.data;
    }
  });
};

export const useGetVendorsList = () => {
  return useQuery({
    queryKey: ["vendors-list"],
    queryFn: async () => {
      try {
        const response = await instance.get(`/api/vendor/names/`);
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
          const response = await instance.get(
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
