// import userStore from "@/components/auth/store/userStore";
import { BACKEND_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});


axiosInstance.interceptors.request.use(
  config => {
    
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  error => {
    return Promise.reject(error); 
  }
);

axiosInstance.interceptors.response.use(
  response => response.data, 
  error => {
    if (error.response) {
      return Promise.reject(error.response.data); 
    } else {
      return Promise.reject({ message: "Network Error" }); 
    }
  }
);
