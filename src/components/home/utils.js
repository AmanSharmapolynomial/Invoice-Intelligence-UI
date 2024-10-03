import { axiosInstance } from "@/axios/instance";

export const listInvoices = async (payload) => {
  const {
    start_date,
    end_date,
    auto_accepted,
    human_verified,
    detected,
    invoice_type,
    rerun_status,
    restaurant,
    vendor,
    page_size,
    page,
    clickbacon_status
  } = payload;

  const apiUrl = `/api/document/?page_size=${page_size}&page=${page}&invoice_type=${invoice_type}&end_date=${end_date}&start_date=${start_date}&auto_accepted=${auto_accepted}&human_verified=${human_verified}&detected=${detected}&rerun_status=${rerun_status}&clickbacon_status=${clickbacon_status}&restaurant=${restaurant}`;

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
