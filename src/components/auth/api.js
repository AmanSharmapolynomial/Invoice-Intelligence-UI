import { axiosInstance } from "@/axios/instance";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const apirUrl = "/api/user/register";
      const response = await axiosInstance.post(apirUrl, payload);
      return response;
    },
    onError: (data) => {
      toast.error(data?.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    }
  });
};
export const useSignIn = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const apirUrl = "/api/user/login";
      const response = await axiosInstance.post(apirUrl, payload);
      return response;
    },
    onError: (data) => {
      toast.error(Object?.values(data?.errors)?.[0]?.[0]);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    }
  });
};
