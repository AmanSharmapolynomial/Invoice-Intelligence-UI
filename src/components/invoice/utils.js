import { axiosInstance } from "@/axios/instance";

export const getInvoiceMetaData = async (invoice_id) => {
  const apiUrl = `/api/document/${invoice_id}/metadata/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
