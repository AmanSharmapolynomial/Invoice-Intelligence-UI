import { useMutation, useQuery } from "@tanstack/react-query";
import { getInvoiceMetaData, getDuplicateInvoices } from "./utils";
import { axiosInstance } from "@/axios/instance";
import toast from "react-hot-toast";

export const useGetInvoiceMetaData = (payload) => {
  return useQuery({
    queryKey: ["invoice-metadata", payload],
    queryFn: () => getInvoiceMetaData(payload)
  });
};

export const useGetDuplicateInvoices = (documnent_uuid) => {
  return useQuery({
    queryKey: ["duplicate-invoices", documnent_uuid],
    queryFn: () => getDuplicateInvoices(documnent_uuid)
  });
};

export const useProcessInvoice = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = axiosInstance.post(
        "/api/invoice-processor/process/",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      return response;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};
