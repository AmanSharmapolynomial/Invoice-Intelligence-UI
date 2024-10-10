import { useQuery } from "@tanstack/react-query"
import { getInvoiceMetaData } from "./utils"

export const useGetInvoiceMetaData=(payload)=>{
return useQuery({
    queryKey:['invoice-metadata',payload],
    queryFn:()=>getInvoiceMetaData(payload)
})
}