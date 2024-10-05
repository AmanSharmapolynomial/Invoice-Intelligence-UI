import { useQuery } from "@tanstack/react-query"
import { getInvoiceMetaData } from "./utils"

export const useGetInvoiceMetaData=(invoice_id)=>{
return useQuery({
    queryKey:['invoice-metadata',invoice_id],
    queryFn:()=>getInvoiceMetaData(invoice_id)
})
}