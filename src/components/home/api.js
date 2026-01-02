import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listInvoices,
  listMultiInvoiceDocument,
  listRestautants,
  listVendors,
  searchInvoice
} from "./utils";
import { axiosInstance } from "@/axios/instance";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";

export const useListInvoices = (payload) => {
  return useQuery({
    queryKey: ["list-invoices", payload],
    queryFn: () => listInvoices(payload)
  });
};

export const useListRestaurants = () => {
  return useQuery({
    queryKey: ["list-restaurants"],
    queryFn: listRestautants
  });
};
export const useListVendors = () => {
  return useQuery({
    queryKey: ["list-vendors"],
    queryFn: listVendors
  });
};

export const useSearchInvoice = () => {
  return useMutation({
    mutationFn: (invoice_number) => searchInvoice(invoice_number),
    onSuccess: (data) => data
  });
};

export const useListMultiInvoiceDocuments = (payload) => {
  return useQuery({
    queryKey: ["multi-invoice-documents", payload],
    queryFn: () => listMultiInvoiceDocument(payload),
    // refetchOnWindowFocus: true,
    staleTime:0,
    cacheTime: 0,
  });
};

export const useRejectMultiInvoiceDocument = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      let response = await axiosInstance.post(
        `/api/document/multiple-invoice-detections/${document_uuid}/reject/`
      );
      return response;
    },
     onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(['multi-invoice-documents'])
    },
    onError: () => {
      toast.error(data?.error);
    },
    meta: {
      successMsg: true,
      errorMsg: true
    }
  });
};
export const useApproveMultiInvoiceDocument = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      let response = await axiosInstance.post(
        `/api/document/multiple-invoice-detections/${document_uuid}/approve/`
      );
      return response;
    },
     onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: () => {
      toast.error(data?.error);
    },
    meta: {
      successMsg: true,
      errorMsg: true
    }
  });
};
export const useUpdateMultiInvoiceDocument = () => {
  return useMutation({
    mutationFn: async ({ document_uuid, data }) => {
      let response = await axiosInstance.put(
        `/api/document/multiple-invoice-detections/${document_uuid}/details/`,
        { ...data }
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(['multi-invoice-documents'])
    },
    onError: () => {
      toast.error(data?.error);
    },
    meta: {
      successMsg: true,
      errorMsg: true
    }
  });
};
