import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInvoiceMetaData,
  getDuplicateInvoices,
  getMasterItemPdfs,
  getDocumentNotes,
  getRawTable,
  createDocumentNote,
  updateDocumentPriority,
  getCombinedTable,
  markAsReviewLater,
  getDocumentTimeline,
  getVendorTypesAndCategories,
  updateVendorTypesAndCategories,
  getItemMasterSimilarItems,
  getInvoiceMetaDataBoundingboxes,
  getUnsupportedDocuments
} from "./utils";
import { axiosInstance } from "@/axios/instance";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";

export const useGetDocumentMetadata = (payload) => {
  return useQuery({
    queryKey: ["document-metadata", payload],
    queryFn: () => getInvoiceMetaData(payload),
    gcTime: 0
  });
};
export const useGetUnSupportedDocuments = (payload) => {
  return useQuery({
    queryKey: ["unsupported-documents", payload],
    queryFn: () => getUnsupportedDocuments(payload),
    gcTime: 0
  });
};
export const useGetDocumentMetadataBoundingBoxes = (payload) => {
  return useQuery({
    queryKey: ["document-metadata-bounding-boxes", payload],
    queryFn: () => getInvoiceMetaDataBoundingboxes(payload),
    gcTime: 0
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
    queryFn: () => item_uuid && getMasterItemPdfs(item_uuid)
  });
};
export const useGetItemMastSimilarItems = (payload) => {
  return useQuery({
    queryKey: ["get-item-master-similar-items", payload],
    queryFn: () => payload?.item_uuid && getItemMasterSimilarItems(payload)
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

export const useUpdateDocumentPriority = () => {
  return useMutation({
    mutationFn: (payload) => updateDocumentPriority(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["list-invoices"] });
      toast.success(data?.message);
    }
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

export const useGetDocumentTimeLine = () => {
  return useMutation({
    mutationFn: (document_uuid) => getDocumentTimeline(document_uuid),
    onSuccess: (data) => {
      return data;
    }
  });
};
export const useGetVendorTypesAndCategories = (vendor_id) => {
  return useQuery({
    queryKey: ["vendor-types-and-categories", vendor_id],
    queryFn: () => getVendorTypesAndCategories(vendor_id)
  });
};

export const useUpdateVendorTypesAndCategories = () => {
  return useMutation({
    mutationFn: ({ vendor_id, payload }) =>
      updateVendorTypesAndCategories({ vendor_id, payload }),
    onSuccess: (data) => {
      toast.success(data?.message);
    }
  });
};
export const useMarkReviewLater = () => {
  return useMutation({
    mutationFn: ({ document_uuid, comments }) =>
      markAsReviewLater(document_uuid, comments),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (err) => {
      toast.error(err?.message);
    }
  });
};
export const useGetItemMasterLookUp = () => {
  return useMutation({
    mutationFn: async ({ document_uuid, item_code, item_description }) => {
      let apiUrl = `/api/document/${document_uuid}/similar-items/`;

      if (item_code) {
        apiUrl += `?item_code=${item_code}`;
      }
      if (item_description) {
        if (item_code) {
          apiUrl += `&item_description=${item_description}`;
        } else {
          apiUrl += `?item_description=${item_description}`;
        }
      }
      return axiosInstance.get(apiUrl);
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};
// Copied code from legacy

export const useUpdateDocumentMetadata = () => {
  return useMutation({
    mutationFn: async ({ data, document_uuid }) => {
      const response = await axiosInstance.put(
        `/api/document/${document_uuid}/metadata/`,
        { ...data }
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${data?.data?.updated_fields?.length > 0
          ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
          : ``
        }`,
        {
          autoClose: 2000
        }
      );
    },
    onError: (data) => {
      toast.error(data?.message);
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

export const useGetCombinedTable = (document_uuid) => {
  return useQuery({
    queryKey: ["combined-table", document_uuid],
    queryFn: () => getCombinedTable(document_uuid),
    gcTime: 0
  });
};

export const useMarkAsNotSupported = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      const response = await axiosInstance.post(
        `/api/document/${document_uuid}/mark-as-unsupported/`
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${data?.data?.updated_fields?.length > 0
          ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
          : ``
        }`,
        {
          autoClose: 2000
        }
      );
    },
    onError: (data) => {
      toast.error(data?.message);
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
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${data?.data?.updated_fields?.length > 0
          ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
          : ``
        }`,
        {
          autoClose: 2000
        }
      );

      queryClient.invalidateQueries({ queryKey: ["combined-table"] });
      queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
    },
    onError: (data) => {
      toast.error(data?.message);
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

      return response;
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
      return response;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    }
  });
};

export const useGetSimilarVendors = (payload) => {
  return useQuery({
    queryKey: ["get-similar-vendors", payload],
    queryFn: async () => {
      let { toFetch, document_uuid } = payload;

      let apiUrl = `/api/document/${document_uuid}/potential-verified-vendors/`;
      if (!toFetch) {
        return;
      }
      try {
        let response = await axiosInstance.get(apiUrl);
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useGetSimilarBranches = (document_uuid) => {
  return useQuery({
    queryKey: ["get-similar-branches", document_uuid],
    queryFn: async () => {
      if (!document_uuid) return;
      let apiUrl = `/api/document/${document_uuid}/potential-verified-branches/`;
      try {
        let response = await axiosInstance.get(apiUrl);
        return response;
      } catch (error) {
        return error?.response?.data?.message;
      }
    }
  });
};

export const useRevertChanges = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      let response = await axiosInstance.post(
        `/api/document/${document_uuid}/reset-document-status/`
      );
      return response;
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["document-metadata"]);
    }
  });
};




export const useReprocessDocument = () => {
  return useMutation({
    mutationFn: async ({ document_uuid, payload }) => {
      let response = await axiosInstance.post(`/api/invoice-processor/${document_uuid}/reprocess/`, {
        ...payload
      })
      return response
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      // queryClient.invalidateQueries(["document-metadata"]);
    }
  })
}



export const useUpdateDocumentStatus = () => {
  return useMutation({
    mutationFn: async (payload) => {
      let response = await axiosInstance.put(`/api/document/unsupported/${payload?.document_uuid}/update-status/`, {
        document_type: payload?.document_type
      });
      return response;
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(['unsupported-documents'])
      // queryClient.invalidateQueries(["document-metadata"]);
    }
  })
}


export const useGetSupportedUnsupportedOptions = () => {
  return useQuery({
    queryKey: ['unsupported-supported-options'],
    queryFn: async () => {
      let response = await axiosInstance.get(`/api/document/unsupported/supported-unsupported-options/`);
      return response;
    }
  })
}



export const useMarkAsMultiInvoice = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      const response = await axiosInstance.post(
        `/api/document/${document_uuid}/mark-as-multiple-invoice-document/`
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${data?.data?.updated_fields?.length > 0
          ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
          : ``
        }`,
        {
          autoClose: 2000
        }
      );
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};





export const useMarkMultipleInvoiceDocumentAsNotSupported = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      const response = await axiosInstance.post(
        `/api/document/multiple-invoice-detections/${document_uuid}/mark-as-unsupported/`
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `${data?.message} ${data?.data?.updated_fields?.length > 0
          ? `Updated Fields:-${data?.data?.updated_fields?.join(" , ")}`
          : ``
        }`,
        {
          autoClose: 2000
        }
      );
    },
    onError: (data) => {
      toast.error(data?.message);
    }
  });
};


export const useApplyBusinessRule = () => {
  return useMutation({
    mutationFn: async ({ rule, document_uuid }) => {
      let response = await axiosInstance.post(`/api/document/${document_uuid}/apply-business-rule/`, { rule });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("duplicate-invoices");
      queryClient.invalidateQueries("document-metadata");
      queryClient.invalidateQueries("combined-table");
      queryClient.invalidateQueries("additional-data");
      toast.success(data?.message)
    },
    onError: () => {
      toast.error(data?.message)
    },
    meta: {
      successMsg: true,
      errorMsg: true
    }
  })
}



export const useGetApplicableBusinessRules = () => {
  return useMutation({
    mutationFn: async (document_uuid) => {
      let response = await axiosInstance.get(`/api/document/${document_uuid}/check-applicable-business-rules/`);
      return response?.data || {};
    }
  })
}


export const useGetDocumentAnalytics=(document_uuid,enabled=true)=>{
  return useQuery({
    queryKey:['document-analytics',document_uuid],
    queryFn: async()=>{
      let response=await axiosInstance.get(`/api/document/${document_uuid}/analytics/`);
      return response?.data;
    },
    enabled:enabled
  })
}