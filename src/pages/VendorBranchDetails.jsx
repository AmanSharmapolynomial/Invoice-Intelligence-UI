import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";

import {
  useDeleteVendorBranchDetails,
  useGetVendorBranchDetails,
  useSaveVendorBranchDetails
} from "@/components/vendor/api";

import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomInput from "@/components/ui/Custom/CustomInput";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ScrollableDropDown from "@/components/ui/ScrollableDropDown";
import { queryClient } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";

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
  const setCachedData = (key, value) => {
    let copyObj = { ...data };

    copyObj["data"][`${key}`] = value;
    queryClient.setQueryData(["vendor-branch-details", branch_id], copyObj);
  };
  const Template = ({ title, children, styles = false, className }) => {
    return (
      <div className={`${className} flex flex-col gap-y-3`}>
        <p className="font-medium font-poppins text-base text-[#000000]">
          {title}
        </p>

        {styles ? (
          <p className="border rounded-sm border-[#E0E0E0] bg-[#F6F6F6] font-poppins font-normal text-sm !h-[2.5rem] flex items-center px-2">
            {children}
          </p>
        ) : (
          children
        )}
      </div>
    );
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar className="" />

        <Layout>
          <BreadCrumb
            title={"Branch Details"}
            crumbs={[
              {
                path: "",
                label: `${data?.data?.vendor_address}`
              },
              {
                path: "",
                label: `Details`
              }
            ]}
          />

          <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.12)" }}
            className=" pb-4 pt-2 rounded-xl"
          >
            <div className="flex justify-between items-center pr-[1rem]">
              <p className="py-2 border-b border-b-[#F1F1F1]">
                <span className="px-4 text-lg !font-semibold text-[#222222] font-poppins">
                  Update Branch Details
                </span>
              </p>
              <div className="flex gap-x-2">
                <Button
                  disabled={savingDetails || deletingBranch}
                  className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-transparent bg-transparent shadow-none text-[#000000] font-poppins font-thin text-xs rounded-sm  border"
                  onClick={() => {
                    deleteBranch(branch_id, {
                      onSuccess: (data) => {
                        navigate(`/vendor-branches/${vendor_id}`);
                      }
                    });
                  }}
                >
                  Delete
                </Button>
                <Button
                  disabled={savingDetails || deletingBranch}
                  className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-primary bg-transparent shadow-none text-[#FFFFFF] font-poppins !font-thin text-xs rounded-sm border bg-primary"
                  onClick={() => {
                    saveDetails({ data: data?.data, branch_id });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 !w-full px-4 mt-4">
              <Template title={"Vendor Address"} className={"col-span-2"}>
                <CustomInput
                  value={vendorAddress}
                  placeholder="Vendor Address"
                  onChange={(val) => {
                    setCachedData("vendor_address", val);
                  }}
                />
              </Template>
              <Template
                title={"Created Date"}
                className={"col-span-1"}
                styles={true}
              >
                {data?.data?.created_date?.split("T")?.[0]}
              </Template>
              <Template title={"Last Modified Date"} styles={true}>
                {data?.data?.last_modified_date?.split("T")?.[0] || "NA"}
              </Template>

              <Template title={"Human Verified"}>
                <RadioGroup
                  defaultValue={data?.data?.["human_verified"]}
                  onValueChange={(v) => setCachedData("human_verified", v)}
                  className="flex w-full gap-x-24 items-center h-[2.5rem] i"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={true} id="r1" />
                    <Label htmlFor="r1">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={false} id="r2" />
                    <Label htmlFor="r2">No</Label>
                  </div>
                </RadioGroup>
              </Template>
              <Template title={"Document Count"} styles={true}>
                {data?.data?.document_count || "NA"}
              </Template>
              <Template title={"Vendor City"}>
                <CustomInput
                  value={data?.data?.["vendor_city"]}
                  placeholder="Vendor City"
                  onChange={(val) => {
                    setCachedData("vendor_city", val);
                  }}
                />
              </Template>

              <Template title={"Vendor Phone Number"}>
                <CustomInput
                  value={data?.data?.["vendor_phone_number"]}
                  placeholder="Vendor Phone Number"
                  onChange={(val) => {
                    setCachedData("vendor_phone_number", val);
                  }}
                />
              </Template>
              <Template title={"Vendor State"}>
                <CustomInput
                  value={data?.data?.["vendor_state"]}
                  placeholder="Vendor State"
                  onChange={(val) => {
                    setCachedData("vendor_state", val);
                  }}
                />
              </Template>
              <Template title={"Vendor Street"}>
                <CustomInput
                  value={data?.data?.["vendor_street"]}
                  placeholder="Vendor Street"
                  onChange={(val) => {
                    setCachedData("vendor_street", val);
                  }}
                />
              </Template>
              <Template title={"Vendor Zip Code"}>
                <CustomInput
                  value={data?.data?.["vendor_zip_code"]}
                  placeholder="Vendor Zip Code"
                  onChange={(val) => {
                    setCachedData("vendor_zip_code", val);
                  }}
                />
              </Template>

              <Template title={"Vendor Address Synonyms"}>
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
              </Template>

              <Template title={"Verified By"} styles={true}>
                {data?.data?.["verified_by"]?.["username"] || "NA"}
              </Template>
              <Template title={"Updated By"} styles={true}>
                {data?.data?.["updated_by"]?.["username"] || "NA"}
              </Template>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default VendorBranchDetails;
