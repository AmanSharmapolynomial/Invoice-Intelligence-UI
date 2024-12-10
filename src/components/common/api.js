import { useMutation } from "@tanstack/react-query";

export const useExtractOcrText = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await instance.post(
          `/api/utils/ocr-text-extract/`,
          data
        );
        return response?.data;
      }
    });
  };