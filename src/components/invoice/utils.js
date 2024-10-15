import { axiosInstance } from "@/axios/instance";

export const getInvoiceMetaData = async (payload) => {
  const { page, page_size, vendor, document_uuid } = payload;
  let apiUrl = "";
  if (document_uuid) {
    apiUrl = `/api/document/${document_uuid}/metadata/`;
  } else {
    apiUrl = `/api/document/metadata/?page_size=${page_size}&page=${page}&vendor=${vendor}`;
  }
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getDuplicateInvoices = async (document_uuid) => {
  const apiUrl = `/api/document/${document_uuid}/find-duplicates/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getMasterItemPdfs = async (item_uuid) => {
  const apiUrl = `/api/item-master/${item_uuid}/pdf/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getDocumentNotes = async (document_uuid) => {
  const apiUrl = `/api/document/${document_uuid}/clickbacon-notes/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getRawTable = async (document_uuid) => {
  const apiUrl = `/api/document/${document_uuid}/items/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const createDocumentNote=async(payload)=>{
  const {document_uuid,note}=payload;
  const apiUrl=`/api/document/${document_uuid}/clickbacon-notes/`
  const response = await axiosInstance.post(apiUrl,{note:note});
  return response;
}