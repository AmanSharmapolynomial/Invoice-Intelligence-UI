import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createVendor,
  getVendorBranches,
  getVendorDetails,
  getVendorList,
  getVendorBranchDetails,
  getVendorNamesList,
  getVendorNotes,
  addVendorNote,
  saveVendorBranchDetails,
  deleteVendorBranchDetails,
  getSimilarVendors,
  getVendorItemMaster,
  getVendorsPdfs,
  getVendorBranchPdfs
} from "@/components/vendor/utils";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";
import { axiosInstance } from "@/axios/instance";
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
export const useGetVendorBranches = (vendor_id, vendor_address) => {
  return useQuery({
    queryKey: ["vendor-branches", vendor_id, vendor_address],
    queryFn: () => getVendorBranches(vendor_id, vendor_address)
  });
};

export const useGetVendorBranchDetails = (branch_id) => {
  return useQuery({
    queryKey: ["vendor-branch-details", branch_id],
    queryFn: () => getVendorBranchDetails(branch_id)
  });
};
export const useGetVendorNotes = (vendor_id) => {
  return useQuery({
    queryKey: ["vendor-notes", vendor_id],
    queryFn: () => getVendorNotes(vendor_id)
  });
};

export const useAddVendorNote = () => {
  return useMutation({
    mutationKey: ["add-vedor-note"],
    mutationFn: (payload) => addVendorNote(payload)
  });
};
export const useSaveVendorBranchDetails = () => {
  return useMutation({
    mutationFn: ({ data, branch_id }) =>
      saveVendorBranchDetails({ data, branch_id }),
    onSuccess: (data) => {
      toast.success(data?.message)
      queryClient.invalidateQueries(["vendor-branch-details", branch_id]);
      return data;
    }
  });
};
export const useDeleteVendorBranchDetails = () => {
  return useMutation({
    mutationFn: (branch_id) => deleteVendorBranchDetails(branch_id),
    onSuccess: (data) => {
      toast.success(error?.message)
      queryClient.invalidateQueries(["vendor-branches"]);
      return data;
    },onError:(data)=>{
      toast.error(data?.message)
    }
  });
};

export const useGetSimilarVendors = (payload) => {
  return useQuery({
    queryKey: ["similar-vendors", payload],
    queryFn: () => getSimilarVendors(payload)
  });
};

export const useGetVendorItemMaster = (vendor_id) => {
  return useQuery({
    queryKey: ["get-similar-vendors", vendor_id],
    queryFn: () => getVendorItemMaster(vendor_id)
  });
};

export const useCombineVendors = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { vendor_id, data } = payload;
      const apiUrl = `/api/vendor/${vendor_id}/combine/`;
      const response = await axiosInstance.post(apiUrl, {
        vendors_to_combine: data
      });
      return response;
    },
    onError: (data) => {
      if (data?.error) {
        toast.error(data?.message);
      } else {
        // toast.error(data?.message);
      }
    },
    onSuccess: (data) => {
      if (!data?.error) {
        toast.success(data?.message);
        queryClient.invalidateQueries({ queryKey: ["similar-vendors"] });
      } else {
        toast.error(data?.message);
      }
    }
  });
};

export const useGetVendorsPdfs = (payload) => {
  return useQuery({
    queryKey: ["get-vendors-pdfs", payload],
    queryFn: () => getVendorsPdfs(payload)
  });
};
export const useDeleteVendor = () => {
  return useMutation({
    mutationFn: async (vendor_id) => {
      try {
        const apiUrl = `/api/vendor/${vendor_id}/delete/`;
        const response = axiosInstance.delete(apiUrl);
        return response;
      } catch (error) {
        return error;
      }
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["vendor-list"] });
    }
  });
};

export const useCombineVendorBranches = () => {
  return useMutation({
    mutationFn: async ({ branch_id, branches_to_combine }) => {
      try {
        const apiUrl = `/api/vendor-branch/${branch_id}/combine/`;
        const response = axiosInstance.post(apiUrl, {
          branches_to_combine
        });
        return response;
      } catch (error) {
        return error;
      }
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["vendor-branches"] });
    }
  });
};

export const useMigrateVendorBranch = () => {
  return useMutation({
    mutationFn: async (payload) => {
      let { branch_id, vendorId } = payload;
      try {
        const apiUrl = `/api/vendor-branch/${branch_id}/migrate/`;
        const response = axiosInstance.post(apiUrl, {
          new_vendor_id: vendorId
        });
        return response;
      } catch (error) {
        return error;
      }
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["vendor-branches"] });
    }
  });
};

export const useDeleteBranch = () => {
  return useMutation({
    mutationFn: async (branch_id) => {
      try {
        const apiUrl = `/api/vendor-branch/${branch_id}/delete/`;
        const response = axiosInstance.delete(apiUrl);
        return response;
      } catch (error) {
        return error;
      }
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["vendor-branches"] });
    }
  });
};

export const useGetVendorBranchPdfs = (branch_id) => {
  return useQuery({
    queryKey: ['vendor-branch-pdfs', branch_id],
    queryFn: () => getVendorBranchPdfs(branch_id), // Pass a function
    enabled: !!branch_id, // Only run if branch_id is valid
  });
};
