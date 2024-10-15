import { axiosInstance } from "@/axios/instance";

export const getVendorList = async (payload) => {
  const {
    page,
    page_size,
    vendor_category,
    human_verified,
    verified_by,
    vendor_name_search
  } = payload;
  const apiUrl = `/api/vendor/?page=${page}&page_size=${page_size}&verified_by=${verified_by}&human_verified=${human_verified}&vendor_category=${vendor_category}&vendor_name_search=${vendor_name_search}`;
  const response = await axiosInstance.get(apiUrl);
  if (response) {
    return response;
  }
};

export const createVendor = async (vendor_name) => {
  const apiUrl = `/api/vendor/create/`;

  const response = await axiosInstance.post(apiUrl, {
    vendor_name
  });
  if (response) {
    return response;
  }
};
export const getVendorNamesList = async () => {
  const response = await axiosInstance.get("/api/vendor/names/");
  return response;
};

export const getVendorDetails = async (vendor_id) => {
  const apiUrl = `/api/vendor/${vendor_id}/details/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getVendorBranches = async (vendor_id, vendor_address) => {
  const apiUrl = `/api/vendor-branch/${vendor_id}/?vendor_address=${vendor_address}`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getVendorBranchDetails = async (branch_id) => {
  const apiUrl = `/api/vendor-branch/${branch_id}/details/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getVendorNotes = async (vendor_id) => {
  const apiUrl = `/api/vendor/${vendor_id}/note/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const addVendorNote = async (payload) => {
  const { vendor_id, note } = payload;
  const apiUrl = `/api/vendor/${vendor_id}/note/`;
  const response = await axiosInstance.post(apiUrl, {
    note
  });
  return response;
};
export const saveVendorBranchDetails = async ({ data, branch_id }) => {
  const apiUrl = `/api/vendor-branch/${branch_id}/details/`;
  const response = await axiosInstance.put(apiUrl, { ...data });
  return response;
};
export const deleteVendorBranchDetails = async (branch_id) => {
  const apiUrl = `/api/vendor-branch/${branch_id}/delete/`;
  const response = await axiosInstance.delete(apiUrl);
  return response;
};
export const getSimilarVendors = async (payload) => {
  const { similarity, vendor_id } = payload;
  const apiUrl = `/api/vendor/${vendor_id}/similar-vendors/?similarity=${Number(
    similarity
  )}`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getVendorItemMaster = async (payload) => {
  const {
    vendor_id,
    human_verified,
    category_review_required,
    verified_by,
    item_code,
    item_description,
    page,
    document_uuid
  } = payload;
  const apiUrl = `/api/item-master/vendor/${vendor_id}/?page=${page}&human_verified=${human_verified}&category_review_required=${category_review_required}&verified_by=${verified_by}&item_code=${item_code}&item_description=${item_description}&document_uuid=${document_uuid}`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const getVendorBranchPdfs = async (branch_id) => {
  const apiUrl = `/api/vendor-branch/${branch_id}/pdf/`;
  try {
    const response = await axiosInstance.get(apiUrl);
    return response; // This should not be reached on error
  } catch (error) {
    return Promise.reject(error); // Ensure you reject the promise
  }
};

export const getVendorsPdfs = async (payload) => {
  const { vendor_one, vendor_two } = payload;
  const apiUrl = `/api/vendor/pdf/`;
  const response = await axiosInstance.post(apiUrl, {
    fetch_mode: "vendor_name",
    vendors: [vendor_one, vendor_two]
  });
  return response;
};
export const getAdditionalData = async () => {
  const apiUrl = `api/utils/additional_data?category_choices=true&processed_table_header_candidates=true&vendor_invoice_document_types=true&vendor_invoice_categories=true`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};

export const getInvoiceHeaderExceptions = async (vendor_id) => {
  const apiUrl = `/api/vendor/${vendor_id}/invoice-header-exceptions/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const updateInvoiceHeaderExceptions = async ({ vendor_id, data }) => {
  const apiUrl = `/api/vendor/${vendor_id}/invoice-header-exceptions/`;
  const response = await axiosInstance.post(apiUrl, { ...data });
  return response;
};

export const updateVendorDetails = async ({ vendor_id, data }) => {
  const apiUrl = `/api/vendor/${vendor_id}/details/`;
  const response = await axiosInstance.put(apiUrl, { ...data.data });
  return response;
};

export const disapproveAllVendorItems = async (vendor_id) => {
  const apiUrl = `/api/item-master/vendor/${vendor_id}/unverify-all-items/`;
  const response = await axiosInstance.post(apiUrl);
  return response;
};

export const updateVendorItemMaster = async (payload) => {
  const { item_uuid, data } = payload;
  const apiUrl = `/api/item-master/${item_uuid}/details/`;
  const response = await axiosInstance.put(apiUrl, { ...data });
  return response;
};
export const deleteVendorItemMaster = async (payload) => {
  const { item_uuid, type } = payload;
  const apiUrl = `/api/item-master/${item_uuid}/delete/?type=${type}`;
  const response = await axiosInstance.delete(apiUrl);

  return response;
};
export const mergeVendorItemMaster = async (payload) => {
  const { master_item_uuid, items_to_merge } = payload;
  const apiUrl = `/api/item-master/merge/`;
  const response = await axiosInstance.post(apiUrl, {
    master_item_uuid,
    items_to_merge
  });

  return response;
};
