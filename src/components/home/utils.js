import { axiosInstance } from "@/axios/instance";

export const listInvoices = async (payload) => {
  const {
    start_date,
    end_date,
    auto_accepted,
    human_verification,
    human_verified,
    detected,
    invoice_type,
    rerun_status,
    restaurant,
    vendor,
    page_size,
    page,
    clickbacon_status,
    sort_order,
    assigned_to,
    document_priority,
    review_later,
    auto_accepted_by_vda,
    supported_documents,
    restaurant_tier,
    rejected,
    extraction_source
  } = payload;
  let apiUrl;

  if(human_verification=="" ){
    return
  }
  if (review_later) {
    apiUrl = `/api/document/?page_size=${page_size}&page=${page}&invoice_type=${invoice_type}&end_date=${end_date}&start_date=${start_date}&auto_accepted=${auto_accepted}&human_verification_required=${human_verification}&rerun_status=&clickbacon_status=${clickbacon_status}&restaurant=${restaurant}&vendor=${vendor}&sort_order=${sort_order}&human_verified=${human_verified}&assigned_to=${
      assigned_to || ""
    }&document_priority=${document_priority}&review_later=${review_later}&auto_accepted_by_vda=${auto_accepted_by_vda}&restaurant_tier=${restaurant_tier}&rejected=${rejected}&extraction_source=${extraction_source}`;
  } else if(supported_documents==false){
    apiUrl = `/api/document/?page_size=${page_size}&page=${page}&invoice_type=${invoice_type}&end_date=${end_date}&start_date=${start_date}&auto_accepted=${auto_accepted}&human_verification_required=${human_verification}&rerun_status=&clickbacon_status=${clickbacon_status}&restaurant=${restaurant}&vendor=${vendor}&sort_order=${sort_order}&human_verified=${human_verified}&assigned_to=${
      assigned_to || ""
    }&document_priority=${document_priority}&auto_accepted_by_vda=${auto_accepted_by_vda}&supported_documents=false&restaurant_tier=${restaurant_tier}&rejected=${rejected}&extraction_source=${extraction_source}`;
    
  } else {
    apiUrl = `/api/document/?page_size=${page_size}&page=${page}&invoice_type=${invoice_type}&end_date=${end_date}&start_date=${start_date}&auto_accepted=${auto_accepted}&human_verification_required=${human_verification}&rerun_status=&clickbacon_status=${clickbacon_status}&restaurant=${restaurant}&vendor=${vendor}&sort_order=${sort_order}&human_verified=${human_verified}&assigned_to=${
      assigned_to || ""
    }&document_priority=${document_priority}&auto_accepted_by_vda=${auto_accepted_by_vda}&restaurant_tier=${restaurant_tier}&rejected=${rejected}&extraction_source=${extraction_source}`;
  }

  const response = await axiosInstance.get(apiUrl);
  return response;
};

export const listRestautants = async () => {
  const apiUrl = `/api/restaurant/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const listVendors = async () => {
  const apiUrl = `/api/vendor/`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
export const searchInvoice = async (invoice_number) => {
  const apiUrl = `/api/document/search/?invoice_number=${invoice_number}`;
  const response = await axiosInstance.get(apiUrl);
  return response;
};
