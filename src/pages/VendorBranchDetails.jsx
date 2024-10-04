import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useGetVendorBranchDetails } from "@/components/vendor/api";
import { Save, Search, Trash2 } from "lucide-react";

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

const VendorBranchDetails = () => {
  const { branch_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetVendorBranchDetails(branch_id);

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
        >
          <Progress
            innerClassName="border-primary  !bg-white/85 "
            value={33}
            className="w-72 absolute right-4 h-4 bg-white/15 "
          />
        </Header>
        <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto">
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSearchTerm("");
                    // updateParams({ vendor_name_search: undefined });
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                placeholder="Search vendor address"
                className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
              />
              <Button
                type="submit"
                onClick={() => {
                  //   updateParams({ vendor_name_search: searchTerm });
                }}
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className="flex gap-x-2">
            <Button>
              <Save
                className="h-5 w-5"
                onClick={() => {
                  const updatedData = queryClient.getQueryData([
                    "vendor-branch-details",
                    branch_id
                  ]);
                  console.log("Current saved data:", updatedData);
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
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13].map((_, index) => (
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <Skeleton className={"w-96 h-5"} />
                  </TableCell>
                ))
              ) : (
                <>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <Input
                      value={data?.data?.["vendor_address"]}
                      onChange={(e) => {
                        const newData = {
                          ...data,
                          data: {
                            ...data.data,
                            vendor_address: e.target.value
                          }
                        };

                        // Update the query data
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          newData
                        );
                        const updatedData = queryClient.getQueryData([
                          "vendor-branch-details",
                          branch_id
                        ]);
                        console.log("Updated data:", updatedData);
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          updatedData
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
                        const newData = {
                          ...data,
                          data: {
                            ...data.data,
                            human_verified: val
                          }
                        };
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          newData
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["document_count"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_city"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_phone_number"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_state"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_street"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["vendor_zip_code"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    <CustomSelect
                    searchPlaceHolder="Search Vendor Address Synonym"
                      showCustomContent={true}
                      placeholder={
                        makeKeyValueFromKey(
                          data?.data?.["vendor_address_synonyms"]
                        )?.[0]?.label
                      }
                      placeholderClassName={"font-normal"}
                      onSelect={(val) => {}}
                      data={makeKeyValueFromKey(
                        data?.data?.["vendor_address_synonyms"]
                      )}
                      className={"!min-w-fit"}
                    ></CustomSelect>
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
