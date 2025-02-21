import { axiosInstance } from "@/axios/instance";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useUpdateVendorItemMaster } from "@/components/vendor/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const ItemMasterDetails = () => {
    const {mutate,isPending}=useUpdateVendorItemMaster()
  const { item_uuid } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["item-master-details", item_uuid],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/item-master/${item_uuid}/details/`
        );
        return response?.data;
      } catch (error) {
        return error?.data?.message;
      }
    }
  });
  console.log(data);

  return (
    <div className="w-full">
      <Sidebar />
      <div className="ml-12">
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Item Master Details"}
            crumbs={[
              {
                path: null,
                label: "Item Master Details"
              }
            ]}
          />


          <Table>
            <TableHeader>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableHeader>
          </Table>
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterDetails;
