import { clsx } from "clsx";
import { QueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const queryConfig = {
  queries: {
    // useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false
  }
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
