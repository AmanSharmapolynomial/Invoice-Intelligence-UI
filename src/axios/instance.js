import { ACCESS_TOKEN, BACKEND_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    // Bypass token handling for login requests
    if (config.url.includes("/auth/login")) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Access-Token"] = `${ACCESS_TOKEN}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If the request is for login, don't retry or refresh
    if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      // If no refresh token exists, logout the user
      if (!refreshToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // If a refresh request is already in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request a new token
        const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const newToken = response.data.token;
        const newRefreshToken = response.data.refresh_token;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" }
    );
  }
);
