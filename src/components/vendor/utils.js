import { axiosInstance } from "@/axios/instance";

export const getVendorList = async (payload) => {
  const { page, page_size ,vendor_category,human_verified,verified_by,} = payload;
  console.log(payload)
  const apiUrl = `/api/vendor/?page=${page}&page_size=${page_size}&verified_by=${verified_by}&human_verified=${human_verified}&vendor_category=${vendor_category}`;
  const response = await axiosInstance.get(apiUrl);
  if (response) {
    return response;
  }
};


export const createVendor=async(vendor_name)=>{
  const apiUrl=`/api/vendor/create/`;

  const response=await axiosInstance.post(apiUrl,{
    vendor_name
  });
  if(response){
    return response
  }
}