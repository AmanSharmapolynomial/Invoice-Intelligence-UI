import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInvoiceMetaData,
  getDuplicateInvoices,
  getMasterItemPdfs,
  getDocumentNotes,
  getRawTable,
  createDocumentNote
} from "./utils";
import { axiosInstance } from "@/axios/instance";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";

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

export const useGetItemMasterPdfs = (item_uuid) => {
  return useQuery({
    queryKey: ["get-item-master-pdf", item_uuid],
    queryFn: () => getMasterItemPdfs(item_uuid)
  });
};

export const useGetDocumentNotes = (documnent_uuid) => {
  return useQuery({
    queryKey: ["document-notes", documnent_uuid],
    queryFn: () => getDocumentNotes(documnent_uuid)
    // enabled:false
  });
};

export const useGetRawTableData = (documnent_uuid) => {
  return useQuery({
    queryKey: ["raw-table-data", documnent_uuid],
    queryFn: () => getRawTable(documnent_uuid)
  });
};

export const useCreateDocumentNote = () => {
  return useMutation({
    mutationFn: (payload) => createDocumentNote(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["document-notes"] });
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};
