import { BACKEND_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

axiosInstance.interceptors.response.use(
  function (response) {

    return response?.data;
  },
  function (error) {

    return Promise.reject(error);
  }
);
