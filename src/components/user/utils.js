import { axiosInstance } from "@/axios/instance";

export const getUsersList = async () => {
  const response = await axiosInstance.get("/api/user/");

  if (response) {
    return response;
  }
};
