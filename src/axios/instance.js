import { BACKEND_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

axiosInstance.interceptors.response.use(
  response => response.data, // Return the data on success
  error => {
    // Check if the error response exists and reject with it
    if (error.response) {
      return Promise.reject(error.response.data); // Reject with the response data
    } else {
      return Promise.reject({ message: 'Network Error' }); // Handle network errors
    }
  }
);
