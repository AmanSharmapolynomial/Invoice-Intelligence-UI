import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";

import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  useDeleteVendorBranchDetails,
  useGetVendorBranchDetails,
  useSaveVendorBranchDetails
} from "@/components/vendor/api";
import { Save, Trash2 } from "lucide-react";

import CustomInput from "@/components/ui/Custom/CustomInput";
import ScrollableDropDown from "@/components/ui/ScrollableDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { vendorBranchDetailsPageFirstColRowData } from "@/constants";
import { queryClient } from "@/lib/utils";
import { LoaderIcon } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const VendorBranchDetails = () => {
  const { branch_id } = useParams();
  const { data, isLoading } = useGetVendorBranchDetails(branch_id);
  const vendorAddress = data?.data?.["vendor_address"] || "";
  const { mutate: saveDetails, isPending: savingDetails } =
    useSaveVendorBranchDetails();
  const { mutate: deleteBranch, isPending: deletingBranch } =
    useDeleteVendorBranchDetails();
  const navigate = useNavigate();
  const { vendor_id } = useParams();
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border  pb-8 !overflow-auto h-full"}>
        <Header
          title={`Vendor Branch  ${
            data?.data?.vendor_name
              ? " Details for " + data?.data?.vendor_name
              : ""
          }`}
          className="border mt-10 rounded-t-md !capitalize !shadow-none bg-primary !text-[#FFFFFF] relative "
        />
        <div className="w-full border flex justify-between p-4 gap-x-4 !overflow-auto">
          <div></div>
          <div className="flex gap-x-2">
            <Button
            disabled={savingDetails||deletingBranch}
              onClick={() => {
                saveDetails({ data: data?.data, branch_id });
              }}
            >
              {savingDetails ? (
                <LoaderIcon className="w-5 h-5" />
              ) : (
                <Save className="h-5 w-5" />
              )}
            </Button>
            <Button
                     disabled={savingDetails||deletingBranch}
              className="bg-red-600 hover:bg-red-600/90"
              onClick={() => {
                deleteBranch(branch_id, {
                  onSuccess: (data) => {
                    navigate(`/vendor-branches/${vendor_id}`);
                  }
                });
              }}
            >
              {deletingBranch ? (
                <LoaderIcon className="w-5 h-5" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <Table className="flex flex-col   box-border  scrollbar !w-full max-h-[70vh] overflow-auto h-full">
          <TableRow className="flex  text-base  !border-none  ">
            <div className="!min-w-[50%]">
              <TableHead className="flex sticky top-0  border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b   bg-gray-200 h-14">
                Field Name
              </TableHead>
              {vendorBranchDetailsPageFirstColRowData?.map(
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
              <TableHead className="flex sticky top-0 border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b  !min-h-14 bg-gray-200 h-14">
                Field Value
              </TableHead>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]?.map((_, index) => (
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
                      checked={data?.data?.["human_verified"]}
                      onCheckedChange={(val) => {
                        let copyObj = JSON.parse(JSON.stringify(data));
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
                      placeholder={"Vendor Address Synonyms"}
                      data={data?.data?.["vendor_address_synonyms"]}
                      onButtonClick={(item) => {
                        let copyObj = JSON.parse(JSON.stringify(data));
                        let filtered = copyObj["data"][
                          "vendor_address_synonyms"
                        ]?.filter((it) => it !== item.value);
                        copyObj["data"]["vendor_address_synonyms"] = filtered;
                        queryClient.setQueryData(
                          ["vendor-branch-details", branch_id],
                          copyObj
                        );
                      }}
                    />
                  </TableCell>

                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["verified_by"]?.["username"]}
                  </TableCell>
                  <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                    {data?.data?.["updated_by"]?.["username"]}
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
