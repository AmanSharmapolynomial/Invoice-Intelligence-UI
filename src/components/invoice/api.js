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

export const useGetDocumentMetadata = (payload) => {
  return useQuery({
    queryKey: ["document-metadata", payload],
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

export const useUpdateDocumentMetadata = () => {
  return useMutation({
    mutationFn: async ({ data, document_uuid }) => {
      const response = await axiosInstance.put(
        `/api/document/${document_uuid}/metadata/`,
        { ...data }
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${
          data?.data?.updated_fields?.length > 0
            ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
            : ``
        }`,
        {
          autoClose: 2000
        }
      );
    }
  });
};

export const useFindDuplicateInvoices = (document_uuid) => {
  return useQuery({
    queryKey: ["duplicate-invoices", document_uuid],
    queryFn: async () => {
      const apiUrl = `/api/document/${document_uuid}/find-duplicates/`;

      try {
        if (document_uuid) {
          const response = await axiosInstance.get(apiUrl);
          return response?.data;
        }
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
};

export const useGetRawTable = (document_uuid) => {
  return useQuery({
    queryKey: ["raw-table", document_uuid],
    queryFn: async () => {
      // /api/document/:document_uuid/items/

      try {
        if (document_uuid) {
          const response = await axiosInstance.get(
            `/api/document/${document_uuid}/items/`
          );
          return response?.data;
        }
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
};

export const useGetCombinedTable = (document_uuid) => {
  return useQuery({
    queryKey: ["combined-table", document_uuid],
    queryFn: async () => {
      // /api/document/:document_uuid/items/

      try {
        if (document_uuid) {
          const response = await axiosInstance.get(
            `/api/document/${document_uuid}/table/`
          );
          return response?.data;
        }
      } catch (error) {
        return error?.response?.data;
      }
    }
  });
};

export const useMarkAsNotSupported = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      const response = await axiosInstance.post(
        `/api/document/${document_uuid}/mark-as-unsupported/`
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${
          data?.data?.updated_fields?.length > 0
            ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
            : ``
        }`,
        {
          autoClose: 2000
        }
      );
    }
  });
};

export const useUpdateDocumentTable = () => {
  return useMutation({
    mutationFn: async ({ data, document_uuid }) => {
      const response = await axiosInstance.put(
        `/api/document/${document_uuid}/table/`,
        {
          operations: data
        }
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${
          data?.data?.updated_fields?.length > 0
            ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
            : ``
        }`,
        {
          autoClose: 2000
        }
      );
    }
  });
};

export const useExtractOcrText = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `/api/utils/ocr-text-extract/`,
        data
      );
      return response?.data;
    }
  });
};

export const useAutoCalculate = () => {
  return useMutation({
    mutationFn: async ({ document_uuid, row }) => {
      const response = await axiosInstance.post(
        `/api/document/${document_uuid}/table/auto-calculate-row/`,
        {
          ...row
        }
      );

      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      return data;
    }
  });
};

export const useUpdateVendorOrBranch = () => {
  return useMutation({
    mutationFn: async ({ document_uuid, data, Key }) => {
      let apiUrl = ``;

      if (Key == "vendor") {
        apiUrl = `/api/document/${document_uuid}/update-vendor/`;
      } else {
        apiUrl = `/api/document/${document_uuid}/update-branch/`;
      }

      let response = await axiosInstance.post(apiUrl, { ...data });
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    }
  });
};
