import { useQuery } from "@tanstack/react-query"
import { listInvoices } from "./utils"

export const useListInvoices=(payload)=>{


    return useQuery({
        queryKey:['list-invoices',payload],
        queryFn:listInvoices
    })
}