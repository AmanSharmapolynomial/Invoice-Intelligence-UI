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

export const useGetVendorsNames = (archived_status) => {
  return useQuery({
    queryKey: ["vendors-names"],
    queryFn: async () => {
      try {
        if(archived_status){
          const response = await axiosInstance.get(
            `/api/vendor/names/?archived_status=${archived_status}`
          );
  
          return response?.data;
        }else{
          const response = await axiosInstance.get(
            `/api/vendor/names/`
          );
  
          return response?.data;
        }
      
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




export const useGetSidebarCounts=(payload)=>{
  return useQuery({
    queryKey: ["sidebar-counts",payload],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/document/unverified-document-counts/?invoice_type=${payload?.invoice_type}&start_date=${payload?.start_date}&end_date=${payload?.end_date}&clickbacon_status=${payload?.clickbacon_status}&restaurant=${payload?.restaurant}&auto_accpepted=${payload?.auto_accpepted}&rerun_status=${payload?.rerun_status}&invoice_detection_status=${payload?.invoice_detection_status}&human_verified=${payload?.human_verified}&human_verification_required=${payload?.human_verification_required}&vendor=${payload?.vendor}&sort_order=${payload?.sort_order}&restaurant_tier=${payload?.restaurant_tier}&rejected=${payload?.rejected}&extraction_source=${payload?.extraction_source}&assigned_to=${payload?.assigned_to}&auto_accepted_by_vda=${payload?.auto_accepted_by_vda}`
        );
        return response?.data;
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
}