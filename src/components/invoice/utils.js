import { axiosInstance } from "@/axios/instance";

export const getInvoiceMetaData = async (payload) => {
  let apiUrl = ``;

  if (payload.document_uuid) {
    apiUrl = `/api/document/${payload.document_uuid}/metadata/`;
  } else {
    apiUrl = `/api/document/metadata/?page=${
      payload?.page
    }&page_size=1&vendor=${payload?.vendor_id}&invoice_type=${
      payload?.invoice_type
    }&invoice_detection_status=${
      payload?.invoice_detection_status
    }&rerun_status=${""}&auto_accepted=${
      payload?.auto_accepted
    }&start_date=${payload?.start_date}&end_date=${
      payload?.end_date
    }&clickbacon_status=${payload.clickbacon_status}&human_verified=${
      payload?.human_verified
    }&sort_order=${payload?.sort_order}&restaurant=${
      payload?.restaurant
    }&human_verification_required=${payload?.human_verification}&assigned_to=${
      payload?.assigned_to || ""
    }&review_later=${payload?.review_later}&auto_accepted_by_vda=${payload?.auto_accepted_by_vda}`;
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
  if (document_uuid) {
    const apiUrl = `/api/document/${document_uuid}/clickbacon-notes/`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  }
};
export const getRawTable = async (document_uuid) => {
  const apiUrl = `/api/document/${document_uuid}/items/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const createDocumentNote = async (payload) => {
  const { document_uuid, note } = payload;
  const apiUrl = `/api/document/${document_uuid}/clickbacon-notes/`;
  const response = await axiosInstance.post(apiUrl, { note: note });
  return response;
};
export const getDocumentTimeline = async (document_uuid) => {
  const apiUrl = `/api/document/${document_uuid}/timeline/`;
  const response = await axiosInstance.get(apiUrl);
  return response?.data;
};
export const updateDocumentPriority = async (payload) => {
  const apiUrl = `/api/document/${payload?.document_uuid}/update-priority/`;
  const response = await axiosInstance.put(apiUrl, {
    priority: payload?.priority
  });
  return response;
};
export const markAsReviewLater = async (document_uuid, comments) => {
  const apiUrl = `/api/document/${document_uuid}/review-later/`;
  const response = await axiosInstance.post(apiUrl, {
    comments
  });
  return response;
};
export const getCombinedTable = async (document_uuid) => {
  try {
    if (document_uuid) {
      const response = await axiosInstance.get(
        `/api/document/${document_uuid}/table/`
      );
      return response;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

export const getVendorTypesAndCategories = async (vendor_id) => {
  if (vendor_id) {
    const apiUrl = `/api/vendor/${vendor_id}/type-and-categories/`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  }
};

export const updateVendorTypesAndCategories = async ({
  vendor_id,
  payload
}) => {
  const apiUrl = `/api/vendor/${vendor_id}/type-and-categories/`;
  const response = await axiosInstance.put(apiUrl, { ...payload });
  return response;
};
