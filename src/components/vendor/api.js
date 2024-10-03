import {  QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { createVendor, getVendorList ,getVendorNamesList} from "./utils"
import toast from "react-hot-toast"
const queryClient=new QueryClient();
export const useGetVendorList=(payload)=>{
    return useQuery({
        queryKey:['vendor-list',payload],
        queryFn:()=>getVendorList(payload)
    })
}

export const createVendorMutation=()=>{
    return useMutation({
        mutationFn:(vendor_name)=>createVendor(vendor_name),
        onError:(error)=>{
            toast.error(error?.response?.data?.message)
        },
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:['vendor-list']
            })
              
            toast.success(data?.message)
        }
    })
}

export const useGetVendorNames=()=>{
    return useQuery({
        queryKey:['vendor-names-list'],
        queryFn:getVendorNamesList
    })
}