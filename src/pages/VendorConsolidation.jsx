import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
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
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Input } from "@/components/ui/input";
import { useGetUsersList } from "@/components/user/api";
import {
  createVendorMutation,
  useGetVendorList,
  useGetVendorNames
} from "@/components/vendor/api";
import VendorConsolidationTable from "@/components/vendor/vendorConsolidation/VendorConsolidationTable";
import { humanVerifiedOptions, vendorCategories } from "@/constants";
import { formatData, getUserNameFromId } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VendorConsolidation = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const page = searchParams.get("page") || 1;
  const page_size = searchParams.get("page_size") || 15;
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

  const [final, setFinal] = useState(50);
  // Function to calculate the height of a div in vh
  function calculateDivHeightInVh(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      // Get the height of the element in pixels
      const elementHeight = element.getBoundingClientRect().height;

      // Get the viewport height in pixels
      const viewportHeight = window.innerHeight;

      // Calculate height in vh
      const heightInVh = (elementHeight / viewportHeight) * 100;


      return heightInVh;
    } else {
      console.error("Element not found");
      return null;
    }
  }


  useEffect(() => {
    setFinal(calculateDivHeightInVh("maindiv") -
      (calculateDivHeightInVh("bread") +
        calculateDivHeightInVh("div1") +
        calculateDivHeightInVh("div2") +
        calculateDivHeightInVh("navbar") +
        16.5))
  }, [])

  return (
    <div className="h-screen flex" id="maindiv">
      <Sidebar />
      <div className="w-full">
        <Navbar className="" />
        <Layout className="mx-6 box-border flex flex-col gap-y-4 mt-2  ">
          <BreadCrumb
            crumbs={[
              { path: "/vendor-consolidation", label: "Vendor Consolidation" }
            ]}
          />
          <div className="flex flex-col flex-grow dark:border-t  dark:rounded-b-lg dark:rounded-t-xl   dark:border-primary ">
            <div
              id="div1"
              className="flex dark:bg-[#051C14] justify-between dark:border-l dark:border-r items-center  dark:border-b rounded-t-xl dark:border-primary pr-[0.625rem] "
            >
              <ProgressBar
                title={"Verified Vendors"}
                currentValue={vendorsData?.["data"]?.["verified_vendor_count"]}
                totalValue={vendorsData?.["data"]?.["total_vendor_count"]}
              />
              <div className="flex items-center gap-x-2 dark:bg-[#051C14]">
                <AlertDialog className="!bg-white">
                  <AlertDialogTrigger>
                    <Button className="!p-0 h-[2.50rem] w-[2.5rem]">
                      <Plus className="h-4 w-4 text-[#FFFFFF]" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Vendor</AlertDialogTitle>
                      <AlertDialogDescription>
                        <Input
                          placeholder="Enter vendor name"
                          className="focus:!outline-none focus:!ring-0 !outline-none"
                          value={addedVendor}
                          onChange={(e) => setAddedVendor(e.target.value)}
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <div onClick={() => handleCreateVendor()}>
                        <AlertDialogAction disabled={addedVendor?.length === 0}>
                          Add
                        </AlertDialogAction>
                      </div>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <CustomInput
                  variant="search"
                  showIcon
                  value={searchTerm}
                  onChange={(v) => {
                    if (v === "") {
                      setSearchTerm("");
                      updateParams({ vendor_name_search: undefined });
                    } else {
                      setSearchTerm(v);
                    }
                  }}
                  placeholder="Search Vendor Name"
                  className="!min-w-[300px]"
                />
              </div>
            </div>

            <div
              id="div2"
              className="flex dark:border-l dark:bg-[#051C14] dark:border-r items-center gap-x-2 justify-end py-2 pr-[0.625rem] dark:border-b dark:border-primary"
            >
              <CustomDropDown
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                className={"!min-w-fit"}
                data={vendorCategories}
                onChange={(val) => {
                  if (val === "none") {
                    updateParams({ vendor_category: undefined });
                  } else {
                    updateParams({ vendor_category: val });
                  }
                }}
                placeholder={
                  vendor_category !== "" ? vendor_category : "Vendor Category"
                }
              />
              <CustomDropDown
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                className={"!min-w-fit"}
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
                className={""}
                contentClassName={"bg-gray-100"}
                data={usersListLoading ? [] : formatData(usersData?.data)}
                onChange={(val) => {
                  if (val === "none") {
                    updateParams({ verified_by: undefined });
                  } else {
                    updateParams({ verified_by: val });
                  }
                }}
                placeholder={
                  <span className="capitalize">
                    {verified_by === undefined
                      ? "Verified By"
                      : usersData
                        ? getUserNameFromId(usersData?.data, verified_by)
                        : "Verified By"}
                  </span>
                }
              />
            </div>
            <VendorConsolidationTable
              data={vendorsData?.data?.["vendors"]}
              isLoading={vendorsDataLoading}
              totalPages={vendorsData?.total_pages}
              height={final}
            />
            <TablePagination
              isFinalPage={vendorsData?.is_final_page}
              totalPages={vendorsData?.total_pages}
              className={"h-[5.5vh] mt-4"}
            />
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default VendorConsolidation;
