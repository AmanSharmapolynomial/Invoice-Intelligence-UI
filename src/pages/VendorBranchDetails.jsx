import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Progress } from "@/components/ui/progress";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useGetVendorBranchDetails } from "@/components/vendor/api";
import { Save, Search, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import CustomSelect from "@/components/ui/CustomSelect";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { vendorBranchDetailsPageFirstColRowData } from "@/constants";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { queryClient } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import CustomInput from "@/components/ui/CustomInput";
import ScrollableDropDown from "@/components/ui/ScrollableDropDown";

const VendorBranchDetails = () => {
  const { branch_id } = useParams();
  const { data, isLoading } = useGetVendorBranchDetails(branch_id);
  const vendorAddress = data?.data?.["vendor_address"] || "";

  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto pb-8"}>
        <Header
          title={`Vendor Branch  ${
            data?.data?.vendor_name
              ? " Details for " + data?.data?.vendor_name
              : ""
          }`}
          className="border mt-10 rounded-t-md !capitalize !shadow-none bg-primary !text-[#FFFFFF] relative "
        />
        <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto">
          <div></div>
          <div className="flex gap-x-2">
            <Button>
              <Save
                className="h-5 w-5"
                onClick={() => {
                  console.log("Current saved data:", data);
                }}
              />
            </Button>
            <Button className="bg-red-600 hover:bg-red-600/90">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Table className="flex flex-col   box-border  scrollbar !w-full ">
          <TableRow className="flex  text-base  !border-none  ">
            <div className="!min-w-[50%]">
              <TableHead className="flex  border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b   bg-gray-200 h-14">
                Field Name
              </TableHead>
              {vendorBranchDetailsPageFirstColRowData.map(
                ({ label, value }) => (
                  <TableCell
                    key={label}
                    className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14"
                  >
                    {label}
                  </TableCell>
                )
              )}
            </div>
            <div className="!min-w-[50%]">
              <TableHead className="flex  border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b  !min-h-14 bg-gray-200 h-14">
                Field Value
              </TableHead>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((_, index) => (
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <Skeleton className={"w-96 h-5"} />
                  </TableCell>
                ))
              ) : (
                <>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={vendorAddress}
                      placeholder="Vendor Address"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_address"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14 ">
                    {data?.data?.created_date?.split("T")?.[0]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["last_modified_date"]?.split("T")?.[0]}
                  </TableCell>

                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <Switch
                      value={data?.data?.["human_verified"]}
                      onCheckedChange={(val) => {
                        let copyObj = { ...data };
                        copyObj.data["human_verified"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["document_count"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={data?.data?.["vendor_city"]}
                      placeholder="Vendor City"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_city"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={data?.data?.["vendor_phone_number"]}
                      placeholder="Vendor Phone Number"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_phone_number"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={data?.data?.["vendor_state"]}
                      placeholder="Vendor State"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_state"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={data?.data?.["vendor_street"]}
                      placeholder="Vendor Street"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_street"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomInput
                      value={data?.data?.["vendor_zip_code"]}
                      placeholder="Vendor Zip Code"
                      onChange={(val) => {
                        let copyObj = { ...data };
                        copyObj["data"]["vendor_zip_code"] = val;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <ScrollableDropDown
                      placeholder={
                        data?.data?.["vendor_address_synonyms"]?.[0]
                          ? data?.data?.["vendor_address_synonyms"]?.[0]
                          : "Vendor Address Synonyms"
                      }
                    >
                      {data?.data?.["vendor_address_synonyms"]?.map(
                        (item, index) => {
                          return (
                            <div
                              key={index}
                              className="bg-gray-100 p-2 px-2 flex justify-between items-center "
                            >
                              <p>{item}</p>
                              <Button
                                className={"h-8 font-normal"}
                                onClick={() => {
                                  let copyObj = { ...data };
                                  copyObj["data"]["vendor_address_synonyms"] =
                                    copyObj["data"][
                                      "vendor_address_synonyms"
                                    ].filter((it) => it !== item);
                                    console.log(copyObj)
                                  queryClient.setQueryData(
                                    ["vendor-branch-details", branch_id],
                                    copyObj
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        }
                      )}
                    </ScrollableDropDown>
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_id"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["branch_id"]}
                  </TableCell>
                </>
              )}
            </div>
          </TableRow>
        </Table>
      </Layout>
    </>
  );
};

export default VendorBranchDetails;
