import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  createVendor,
  getVendorBranches,
  getVendorDetails,
  getVendorList,
  getVendorBranchDetails,
  getVendorNamesList
} from "@/components/vendor/utils";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";
export const useGetVendorList = (payload) => {
  return useQuery({
    queryKey: ["vendor-list", payload],
    queryFn: () => getVendorList(payload)
  });
};

export const createVendorMutation = () => {
  return useMutation({
    mutationFn: (vendor_name) => createVendor(vendor_name),
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-list"]
      });

      toast.success(data?.message);
    }
  });
};

export const useGetVendorNames = () => {
  return useQuery({
    queryKey: ["vendor-names-list"],
    queryFn: getVendorNamesList
  });
};

export const useGetVendorDetails = (vendor_id) => {
  return useQuery({
    queryKey: ["vendor-details", vendor_id],
    queryFn: () => getVendorDetails(vendor_id)
  });
};
export const useGetVendorBranches = (vendor_id) => {
  return useQuery({
    queryKey: ["vendor-branches", vendor_id],
    queryFn: () => getVendorBranches(vendor_id)
  });
};


export const useGetVendorBranchDetails=(branch_id)=>{
  return useQuery({
    queryKey:['vendor-branch-details',branch_id],
    queryFn:()=>getVendorBranchDetails(branch_id)
  })
}