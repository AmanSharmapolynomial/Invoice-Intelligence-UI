import { axiosInstance } from "@/axios/instance";

export const getInvoiceMetaData = async (payload) => {
  const {page,page_size,vendor}=payload;
  const apiUrl = `/api/document/metadata/?page_size=${page_size}&page=${page}&vendor=${vendor}`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
