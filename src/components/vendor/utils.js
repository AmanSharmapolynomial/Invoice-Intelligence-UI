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
  const apirUrl = `/api/vendor-branch/${vendor_id}/?vendor_address=${vendor_address}`;
  const response = await axiosInstance.get(apirUrl);
  return response;
};
export const getVendorBranchDetails = async (branch_id) => {
  const apirUrl = `/api/vendor-branch/${branch_id}/details/`;
  const response = await axiosInstance.get(apirUrl);
  return response;
};
export const getVendorNotes = async (vendor_id) => {
  const apirUrl = `/api/vendor/${vendor_id}/note/`;
  const response = await axiosInstance.get(apirUrl);
  return response;
};
export const addVendorNote = async (payload) => {
  const { vendor_id, note } = payload;
  const apirUrl = `/api/vendor/${vendor_id}/note/`;
  const response = await axiosInstance.post(apirUrl, {
    note
  });
  return response;
};
export const saveVendorBranchDetails = async ({ data, branch_id }) => {
  const apirUrl = `/api/vendor-branch/${branch_id}/details/`;
  const response = await axiosInstance.put(apirUrl, { ...data });
  return response;
};
export const deleteVendorBranchDetails = async (branch_id) => {
  const apirUrl = `/api/vendor-branch/${branch_id}/delete/`;
  const response = await axiosInstance.delete(apirUrl);
  return response;
};
export const getSimilarVendors = async (payload) => {
  const { similarity, vendor_id } = payload;
  const apirUrl = `/api/vendor/${vendor_id}/similar-vendors/?similarity=${Number(
    similarity
  )}`;
  const response = await axiosInstance.get(apirUrl);
  return response;
};
export const getVendorItemMaster = async (vendor_id) => {
  const apirUrl = `/api/item-master/vendor/${vendor_id}/`;
  const response = await axiosInstance.get(apirUrl);
  return response;
};
export const getVendorBranchPdfs = async (branch_id) => {
  const apirUrl = `/api/vendor-branch/${branch_id}/pdf/`;
  try {
    const response = await axiosInstance.get(apirUrl);
    return response; // This should not be reached on error
  } catch (error) {

    return Promise.reject(error); // Ensure you reject the promise
  }
};

export const getVendorsPdfs = async (payload) => {
  const { vendor_one, vendor_two } = payload;
  const apirUrl = `/api/vendor/pdf/`;
  const response = await axiosInstance.post(apirUrl, {
    fetch_mode: "vendor_name",
    vendors: [vendor_one, vendor_two]
  });
  return response;
};
