import { useQuery } from "@tanstack/react-query";
import { listInvoices, listRestautants, listVendors } from "./utils";

export const useListInvoices = (payload) => {
  return useQuery({
    queryKey: ["list-invoices", payload],
    queryFn: () => listInvoices(payload)
  });
};

export const useListRestaurants = () => {
  return useQuery({
    queryKey: ["list-restaurants"],
    queryFn: listRestautants
  });
};
export const useListVendors = () => {
  return useQuery({
    queryKey: ["list-vendors"],
    queryFn: listVendors
  });
};
