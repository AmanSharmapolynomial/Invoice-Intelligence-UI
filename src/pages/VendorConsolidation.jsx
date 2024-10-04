import React, { useState } from "react";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Header from "@/components/common/Header";
import { Progress } from "@/components/ui/progress";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { useGetUsersList } from "../components/user/api";
import { formatData, getUserNameFromId } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import {
  createVendorMutation,
  useGetVendorList,
  useGetVendorNames
} from "@/components/vendor/api";
import VendorConsolidationTable from "@/components/vendor/VendorConsolidationTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { humanVerifiedOptions, vendorCategories } from "@/constants";
import TablePagination from "@/components/common/TablePagination";
import { useSearchParams } from "react-router-dom";
import useUpdateParams from "@/lib/hooks/useUpdateParams";

const VendorConsolidation = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const page = searchParams.get("page") || 1;
  const page_size = searchParams.get("page_size") || 8;
  const verified_by = searchParams.get("verified_by") || "";
  const human_verified = searchParams.get("human_verified") || "all";
  const vendor_category = searchParams.get("vendor_category") ?? "";
  const vendor_name_search = searchParams.get("vendor_name_search") ?? "";

  const [addedVendor, setAddedVendor] = useState("");
  const [searchTerm, setSearchTerm] = useState(vendor_name_search);
  const { data: usersData, isLoading: usersListLoading } = useGetUsersList();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
  const { data: vendorsData, isLoading: vendorsDataLoading } = useGetVendorList(
    {
      page: page,
      page_size: page_size,
      verified_by: verified_by,
      human_verified: human_verified,
      vendor_category: vendor_category,
      vendor_name_search: vendor_name_search
    }
  );
  const { mutate: createVendor, isPending: creatingVendor } =
    createVendorMutation();
  const handleCreateVendor = () => {
    createVendor(addedVendor);
    setAddedVendor("");
  };
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border"}>
        <Header
          title={"Vendor Consolidation"}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative "
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
                    updateParams({ vendor_name_search: undefined });
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                placeholder="Search vendor name"
                className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
              />
              <Button
                type="submit"
                onClick={() => {
                  updateParams({ vendor_name_search: searchTerm });
                }}
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <CustomDropDown

              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              data={vendorCategories}
              onChange={(val) => {
                if (val == "none") {
                  updateParams({ vendor_category: undefined });
                } else {
                  updateParams({ vendor_category: val });
                }
              }}
              placeholder={
                vendor_category !== "" ? vendor_category : "Vendor Category"
              }
            />{" "}
            <CustomDropDown
      
              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              data={humanVerifiedOptions}
              onChange={(val) => {
                if (val === "none") {
                  updateParams({ human_verified: undefined });
                } else {
                  updateParams({ human_verified: val });
                }
              }}
              placeholder={
                <span className="capitalize">
                  {human_verified === "all" || human_verified === "none"
                    ? "Human Verified"
                    : human_verified}
                </span>
              }
            />
            <CustomDropDown
        
              triggerClassName={"bg-gray-100"}
              contentClassName={"bg-gray-100"}
              data={usersListLoading ? [] : formatData(usersData?.data)}
              onChange={(val) => {
                if (val == "none") {
                  updateParams({ verified_by: undefined });
                } else {
                  updateParams({ verified_by: val });
                }
              }}
              placeholder={
                <span className="capitalize">
                  {verified_by == undefined
                    ? "Verified By"
                    : usersData ?
                      getUserNameFromId(usersData?.data, verified_by):"Verified By"}
                </span>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger>
                {" "}
                <Button className="flex gap-x-1 bg-primary hover:bg-primary/95">
                  <span>
                    <CirclePlus className="h-4" />
                  </span>
                  <span>Add Vendor</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Vendor</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      placeholder="Enter vendor name"
                      className="focus:!outline-none  focus:!ring-0  !outline-none"
                      value={addedVendor}
                      onChange={(e) => setAddedVendor(e.target.value)}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <div onClick={() => handleCreateVendor()}>
                    <AlertDialogAction>Add</AlertDialogAction>
                  </div>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <VendorConsolidationTable
          data={vendorsData?.data}
          isLoading={vendorsDataLoading}
        />

        <TablePagination totalPages={vendorsData?.total_pages} />
      </Layout>
    </>
  );
};

export default VendorConsolidation;
