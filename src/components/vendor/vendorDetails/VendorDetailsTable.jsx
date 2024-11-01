import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import ScrollableDropDown from "@/components/ui/ScrollableDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { vendorDetailsPageFirstColRowData } from "@/constants";
import { getValueFromLabel, makeKeyValueFromKey } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const VendorDetailsTable = ({
  data = [],
  isLoading = false,
  vendor_id,
  additionalData = []
}) => {
  const {
    vendor_invoice_document_types,
    vendor_invoice_categories,
    category_choices
  } = additionalData;

  const setCachedData = (key, value) => {
    let copyObj = JSON.parse(JSON.stringify(data));

    copyObj["data"][`${key}`] = value;
    queryClient.setQueryData(["vendor-details", vendor_id], copyObj);
  };

  const Template = ({ title, children, styles = false }) => {
    return (
      <div className="flex flex-col gap-y-3">
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
    <div className="w-full ">
      <CustomAccordion title="Update Vendor Details">
        <div className="grid grid-cols-3 gap-6 px-4 py-4">
          <Template title={"Vendor Id"} styles={true}>
            {data?.data?.["vendor_id"]}
          </Template>

          <Template title={"Vendor Name"}>
            <CustomInput
              value={data?.data?.vendor_name}
              onChange={(val) => {
                setCachedData("vendor_name", val);
              }}
            />
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
            {data?.data?.["document_count"]}
          </Template>
          <Template title={"Branch Count"} styles={true}>
            {data?.data?.["branch_count"]}
          </Template>
          <Template title={"Auto Approve Invoices"}>
            <RadioGroup
              defaultValue={data?.data?.["auto_approve_invoices"]}
              onValueChange={(v) => setCachedData("auto_approve_invoices", v)}
              className="flex w-full gap-x-24 items-center h-[2.5rem] "
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

          <Template title={"Verified Branches Count"} styles={true}>
            {data?.data?.["verified_branch_count"]}
          </Template>

          <Template title={"Items Count"} styles={true}>
            {data?.data?.["item_count"]}
          </Template>

          <Template title={"Verified Items Count"} styles={true}>
            {data?.data?.["verified_item_count"]}
          </Template>

          <Template title={"Vendor Category"}>
            <CustomDropDown
              Value={data?.data?.vendor_category}
              className="xl:min-w-[600px] md:max-w-[37rem] md:min-w-[24rem]"
              triggerClassName={"bg-gray-100 !min-w-full"}
              contentClassName={"bg-gray-100 !min-w-full"}
              data={makeKeyValueFromKey(vendor_invoice_categories)}
              onChange={(val) => {
                setCachedData("vendor_category", val);
              }}
              placeholder="None"
              showSearch={false}
            />{" "}
          </Template>

          <Template title={"Account Category"}>
            <CustomDropDown
              Value={data?.data?.vendor_account_category?.category_id}
              className="xl:min-w-[600px] md:max-w-[37rem] md:min-w-[24rem]"
              triggerClassName={"bg-gray-100 !min-w-full"}
              contentClassName={"bg-gray-100 !min-w-full"}
              data={category_choices?.map(({ name, category_id }) => {
                let obj = {
                  label: name,
                  value: category_id
                };
                return obj;
              })}
              onChange={(val) => {
                setCachedData("vendor_account_category", val);
              }}
              placeholder="None"
              searchPlaceholder="Search Account Category"
            />{" "}
          </Template>
          <Template title={"Document Type"}>
            <CustomDropDown
              Value={data?.data?.vendor_document_type}
              className="xl:min-w-[600px] md:max-w-[37rem] md:min-w-[24rem]"
              triggerClassName={"bg-gray-100 !min-w-full"}
              contentClassName={"bg-gray-100 !min-w-full"}
              data={makeKeyValueFromKey(vendor_invoice_document_types)}
              onChange={(val) => {
                setCachedData("vendor_document_type", val);
              }}
              placeholder="None"
              showSearch={false}
            />{" "}
          </Template>

          <Template title={"Vendor Name Synonyms"}>
            <ScrollableDropDown
              placeholder={"Vendor Name Synonyms"}
              triggerClassName="font-semibold capitalize"
              data={data?.data?.vendor_name_synonyms}
              onButtonClick={(item) => {
                let copyObj = JSON.parse(JSON.stringify(data));
                let filtered = copyObj["data"]["vendor_name_synonyms"]?.filter(
                  (it) => it !== item.value
                );
                copyObj["data"]["vendor_name_synonyms"] = filtered;
                queryClient.setQueryData(
                  ["vendor-details", vendor_id],
                  copyObj
                );
              }}
            />
          </Template>
        </div>
      </CustomAccordion>
    </div>
  );
};

export default VendorDetailsTable;
