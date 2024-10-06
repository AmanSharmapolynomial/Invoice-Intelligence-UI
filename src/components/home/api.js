import { useMutation, useQuery } from "@tanstack/react-query";
import { listInvoices, listRestautants, listVendors,searchInvoice, } from "./utils";

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

export const useSearchInvoice=()=>{
  return useMutation({
    mutationFn:(invoice_number)=>searchInvoice(invoice_number),
    onSuccess:(data)=>data
  })
}