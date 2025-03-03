import { axiosInstance } from "@/axios/instance";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomDropDown from "@/components/ui/CustomDropDown";
import approved from "@/assets/image/approved.svg";
import unApproved from "@/assets/image/unapproved.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAdditionalData,
  useUpdateVendorItemMaster
} from "@/components/vendor/api";
import { categoryNamesFormatter, keysCapitalizer } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { da } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import stringSimilarity from "string-similarity";

const ItemMasterDetails = () => {
  const { mutate, isPending } = useUpdateVendorItemMaster();
  const [updating, setUpdating] = useState(false);
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
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();

  const textAreaRefs = useRef({}); // Store multiple refs in an object



  return (
    <div className="w-full">
      <Sidebar />
      <Toaster />
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
          <div className="w-full px-16 mt-8">
            <Table className="">
              <TableHeader className="text-black">
                {isLoading || loadingAdditionalData ? (
                  <TableRow className="items-center   w-full relative border !min-h-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableCell
                        key={i}
                        className="border-r  items-center h-12  border-b-0 font-poppins font-semibold text-sm text-black "
                      >
                        <Skeleton className={"w-44 h-5"} />
                      </TableCell>
                    ))}
                  </TableRow>
                ) : (
                  <TableRow className="items-center   w-full relative border !min-h-12">
                    <TableCell className="border-r  items-center h-full  border-b-0 font-poppins font-semibold text-sm text-black ">
                      Category
                    </TableCell>
                    {data?.required_invoice_columns_for_item_master
                      ?.filter((it) => it?.toLowerCase() !== "category")
                      ?.map((it, i) => {
                        return (
                          <TableCell
                            key={i}
                            className="border-r  items-center h-full  border-b-0 font-poppins font-semibold text-sm text-black "
                          >
                            {" "}
                            {keysCapitalizer(it)}
                          </TableCell>
                        );
                      })}
                    <TableCell className="border-r  items-center h-full  border-b-0 font-poppins font-semibold text-sm text-black ">
                      Human Verified
                    </TableCell>
                    <TableCell className="border-r  items-center h-full  border-b-0 font-poppins font-semibold text-sm text-black ">
                      Category Review Required
                    </TableCell>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {isLoading || loadingAdditionalData ? (
                  <TableRow className="border !min-h-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableCell key={i} className="border h-16">
                        <Skeleton className={"w-44 h-5"} />
                      </TableCell>
                    ))}
                  </TableRow>
                ) : (
                  <TableRow className="border !min-h-12">
                    <TableCell className="border">
                      <CustomDropDown
                        Value={data?.category?.category_id}
                        className="!min-w-[16rem]"
                        onChange={(v, obj) => {
                          let copyObj = { ...data };
                          copyObj.category = {
                            name: obj?.label,
                            category_id: obj?.value
                          };

                          queryClient.setQueryData(
                            ["item-master-details", item_uuid],
                            copyObj
                          );
                        }}
                        commandGroupClassName={"px-0"}
                        data={[
                          ...categoryNamesFormatter(
                            additionalData?.data?.category_choices
                          ),
                          { label: "NA", value: null }
                        ]}
                      />
                    </TableCell>

                    {data?.required_invoice_columns_for_item_master
                      ?.filter((it) => it?.toLowerCase() !== "category")
                      ?.map((it, i) => {
                        return (
                          <TableCell
                            key={i}
                            className="border-r  items-center h-full   border-b font-poppins font-normal text-sm text-black "
                          >
                            <Textarea
                              ref={(el) => {
                                if (el) textAreaRefs.current[it] = el; // Store ref for each `it`
                              }}
                              onChange={(e) => {
                                const { selectionStart } = e.target;
                                const newValue = e.target.value;

                                queryClient.setQueryData(
                                  ["item-master-details", item_uuid],
                                  (oldData) => {
                                    if (!oldData) return {};
                                    return {
                                      ...oldData,
                                      [`${it
                                        ?.split(" ")
                                        ?.join("_")
                                        ?.toLowerCase()}`]: newValue
                                    };
                                  }
                                );

                                setTimeout(() => {
                                  if (textAreaRefs.current[it]) {
                                    textAreaRefs.current[it].setSelectionRange(
                                      selectionStart,
                                      selectionStart
                                    );
                                  }
                                }, 0);
                              }}
                              value={
                                data[
                                  `${it?.split(" ")?.join("_")?.toLowerCase()}`
                                ] || ""
                              }
                            />
                          </TableCell>
                        );
                      })}
                    <TableCell className="border-r  items-center h-full   justify-center  border-b font-poppins font-normal text-sm text-black ">
                      <div className="w-full h-full flex items-center justify-start pl-10">
                        {data?.human_verified ? (
                          <img src={approved} className="h-5 w-5" />
                        ) : (
                          <img
                            src={unApproved}
                            className="h-5 w-5"
                            onClick={() => {
                              let copyObj = { ...data };
                              copyObj[`human_verified`] = true;
                              queryClient.setQueryData(
                                ["item-master-details", item_uuid],
                                copyObj
                              );
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="border-r  items-center h-full  border-b font-poppins pl-10 font-normal text-sm text-black ">
                      <Switch
                        checked={data?.category_review_required}
                        onCheckedChange={(v) => {
                          let copyObj = { ...data };
                          copyObj["category_review_required"] = v;
                          queryClient.setQueryData(
                            ["item-master-details", item_uuid],
                            copyObj
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="w-full flex items-center justify-end mt-4">
              <Button
                disabled={updating}
                className="rounded-sm text-sm font-normal"
                onClick={() => {
                  setUpdating(true);
                  mutate(
                    { data: { ...data }, item_uuid },
                    {
                      onSuccess: () => {
                        setUpdating(false);
                      },
                      onError: () => {
                        setUpdating(false);
                      }
                    }
                  );
                }}
              >
                {updating ? "Updating...." : "Update"}
              </Button>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default ItemMasterDetails;
