import { axiosInstance } from "@/axios/instance";
import { useQuery } from "@tanstack/react-query";

export const useGetVendorsWithPotentialDuplicates = (payload) => {
  return useQuery({
    queryKey: ["vendors-with-potential-duplicates", payload],
    queryFn: async () => {
      let { page, page_size, vendor_id } = payload;
      let apiUrl = ``;
      if (vendor_id) {
        apiUrl = `/api/vendor/duplicate-finder/findings/?page=${page}&page_size=${page_size}&vendor=${vendor_id}`;
      } else {
        apiUrl = `/api/vendor/duplicate-finder/findings/?page=${page}&page_size=${page_size}`;
      }
      try {
        let response = await axiosInstance.get(apiUrl);
        return response;
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
};


export const useGetVendorsHavingDuplicatesList=()=>{
    return useQuery({
        queryKey:['vendors-list-with-duplicates'],
        queryFn:async()=>{
            return await axiosInstance.get("/api/vendor/duplicate-finder/vendors-with-duplicates/");

        }
    })
}