import { ACCESS_TOKEN, BACKEND_URL } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

let isRefreshing = false; // To prevent multiple refresh calls
let failedQueue = []; // To queue requests while the token is being refreshed

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Access-Token'] = `${ACCESS_TOKEN}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to an expired token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue requests if a refresh token request is already in progress
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
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
         return
        }

        // Request new token
        const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const newToken = response.data.token;
        const newRefreshToken = response.data.refresh_token;

        // Update tokens in localStorage
        localStorage.setItem("token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // Update headers for queued requests
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect to login or handle logout
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Adjust the route as per your app
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
