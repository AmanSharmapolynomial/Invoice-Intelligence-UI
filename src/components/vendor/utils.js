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

export const getVendorDetails=async(vendor_id)=>{
  const apiUrl=`/api/vendor/${vendor_id}/details/`;
  const response=await axiosInstance.get(apiUrl)
  return response
}
export const getVendorBranches=async(vendor_id)=>{
  const apirUrl=`/api/vendor-branch/${vendor_id}/`;
  const response=await axiosInstance.get(apirUrl)
  return response
}