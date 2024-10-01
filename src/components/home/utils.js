import { axiosInstance } from "@/axios/instance";

export const listInvoices = async (payload) => {
  const {
    start_date,
    end_date,
    auto_accepted,
    human_verification,
    human_verified,
    invoice_detection_status,
    invoice_type,
    rerun_status,
    restaurant,
    vendor,
    page_size,
    page
  } = payload;

  //   const apiUrl =`/api/document/?start_date=${start_date}&end_date=${end_date}&restaurant=${restaurant}&auto_accepted=${auto_accepted}&rerun_statu=${rerun_status}&invoice_detection_statu=${invoice_detection_status}&human_verified=${human_verified}&human_verification=${human_verification}&vendor=${vendor}&page_size=${page_size}&page=${page}&invoice_type=${invoice_type}`
  const apiUrl = `/api/document/?page_size=8&page=1`;

  const response = await axiosInstance.get(apiUrl);
  return response;
};
