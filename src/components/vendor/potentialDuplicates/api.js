import { axiosInstance } from "@/axios/instance";
import { queryClient } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

export const useGetVendorsHavingDuplicatesList = () => {
  return useQuery({
    queryKey: ["vendors-list-with-duplicates"],
    queryFn: async () => {
      return await axiosInstance.get(
        "/api/vendor/duplicate-finder/vendors-with-duplicates/"
      );
    }
  });
};

export const useMarkAsNotDuplicate = () => {
  return useMutation({
    mutationFn: async (finding_id) => {
      const response = await axiosInstance.post(
        `/api/vendor/duplicate-finder/findings/${finding_id}/mark-as-not-duplicate/`
      );
      return response?.data;
    }
  });
};

export const useGetVendorBranchDuplicateFindingsSummary = ({
  page,
  page_size
}) => {
  return useQuery({
    queryKey: ["vendor-duplicate-branches-listing", { page, page_size }],
    queryFn: async () => {
      return axiosInstance.get(
        `/api/vendor-branch/duplicate-finder/vendor-duplicate-branch-summary/?page=${page}&page_size=${page_size}`
      );
    }
  });
};

export const useGetVendorPotentialDuplicateBranches = (vendor_id) => {
  return useQuery({
    queryKey: ["duplicate-branches-listing", vendor_id],
    queryFn: async () => {
      return axiosInstance.get(
        `/api/vendor-branch/duplicate-finder/vendor/${vendor_id}/findings/`
      );
    }
  });
};

export const useMartBranchAsNotDuplicate = () => {
  return useMutation({
    mutationFn: async (finding_id) => {
      return axiosInstance.post(
        `/api/vendor-branch/duplicate-finder/findings/${finding_id}/mark-as-not-duplicate/`
      );
    }
  });
};

export const useListRecentVendorDuplicateBranches = (payload) => {
  return useQuery({
    queryKey: ["recent-duplicate-branch-findings", payload],
    queryFn: async () => {
      let { page, page_size, similarity_score, vendor } = payload;
      let response = await axiosInstance.get(
        `/api/vendor-branch/duplicate-branch-findings/?page=${page}&page_size=${page_size}&similarity_score=${similarity_score} ${
          vendor ? `${`&vendor=${vendor}`}` : ""
        }`
      );
      return response;
    }
  });
};
export const useListRecentVendorDuplicates = (payload) => {
  return useQuery({
    queryKey: ["recent-duplicate-vendor-findings", payload],
    queryFn: async () => {
      let { page, page_size, vendor } = payload;
      let response = await axiosInstance.get(
        `/api/vendor/duplicate-vendor-findings/?page=${page}&page_size=${page_size}${
          vendor ? `${`&vendor=${vendor}`}` : ""
        }`
      );
      return response;
    }
  });
};

export const useDeleteDuplicateBranchFindings = () => {
  return useMutation({
    mutationFn: async (finding_id) => {
      let response = await axiosInstance.delete(
        `/api/vendor-branch/duplicate-branch-findings/${finding_id}/`
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success("Successfully Deleted");
    },
    onError: (data) => {
      toast.success("Something Went Wrong.");
    }
  });
};
export const useDeleteDuplicateVendorFindings = () => {
  return useMutation({
    mutationFn: async (finding_id) => {
      let response = await axiosInstance.delete(
        `/api/vendor/duplicate-vendor-findings/${finding_id}/`
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success("Successfully Deleted");
      queryClient.invalidateQueries(['recent-duplicate-vendor-findings'])
    },
    onError: (data) => {
      toast.error("Something Went Wrong.");
    }
  });
};
