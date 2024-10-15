import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/CustomInput";
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
  return (
    <div className="w-full ">
      <Table className="flex flex-col   box-border  scrollbar !w-full ">
        <TableRow className="flex  text-base  !border-none  ">
          <div className="!min-w-[50%]">
            <TableHead className="flex  border-r !text-left items-center justify-start pl-[15%] !font-semibold !text-gray-800  border-b   bg-gray-200 h-14">
              Field Name
            </TableHead>
            {vendorDetailsPageFirstColRowData?.map(({ label, value }) => (
              <TableCell
                key={label}
                className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14"
              >
                {label}
              </TableCell>
            ))}
          </div>
          <div className="!min-w-[50%]">
            <TableHead className="flex  border-r !text-left items-center justify-start pl-[15%] !font-semibold !text-gray-800  border-b  !min-h-14 bg-gray-200 h-14">
              Field Value
            </TableHead>
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]?.map((_, index) => (
                <TableCell
                  key={index}
                  className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14"
                >
                  <Skeleton className={"w-96 h-5"} />
                </TableCell>
              ))
            ) : (
              <>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  {data?.data?.["vendor_id"]}
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14 ">
                  <CustomInput
                    value={data?.data?.vendor_name}
                    onChange={(val) => {
                      let copyObj = JSON.parse(JSON.stringify(data));

                      copyObj["data"]["vendor_name"] = val;
                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <Switch
                    value={data?.data?.["human_verified"]}
                    onCheckedChange={(val) => {
                      let copyObj = JSON.parse(JSON.stringify(data));

                      copyObj["data"]["human_verified"] = val;
                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                  />
                </TableCell>

                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <Switch
                    value={data?.data?.["auto_approve_invoices"]}
                    onCheckedChange={(val) => {
                      let copyObj = JSON.parse(JSON.stringify(data));

                      copyObj["data"]["auto_approve_invoices"] = val;
                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  {data?.data?.["branch_count"]}
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  {data?.data?.["verified_branch_count"]}
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  {data?.data?.["item_count"]}
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <CustomDropDown
                    triggerClassName={"!w-full !bg-transparent"}
                    placeholder="None"

                    showSearch={false}
                    Value={
                      data?.data?.vendor_category == null
                        ? null
                        : data?.data?.vendor_category
                    }
                    onChange={(val) => {
                      let copyObj = {...data};

                      copyObj["data"]["vendor_category"] = val;
          
                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                    data={makeKeyValueFromKey(vendor_invoice_categories)}
                  />
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <CustomSelect
                    value={data?.data?.vendor_account_category?.category_id}
                    className="!min-w-[400px]"
                    triggerClassName={"bg-gray-100 !min-w-full"}
                    contentClassName={"bg-gray-100 !min-w-full"}
                    data={category_choices?.map(({ name, category_id }) => {
                      let obj = {
                        label: name,
                        value: category_id
                      };
                      return obj;
                    })}
                    onSelect={(val) => {
                      let copyObj = JSON.parse(JSON.stringify(data));

                      copyObj["data"]["vendor_account_category"] = {
                        category: getValueFromLabel(
                          category_choices?.map(({ name, category_id }) => {
                            let obj = {
                              label: name,
                              value: category_id
                            };
                            return obj;
                          }),
                          val
                        ),
                        category_id: val
                      };

                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                    placeholder="None"
                    searchPlaceholder="Search Vendor Name"
                  />{" "}
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <ScrollableDropDown
                    placeholder={"Vendor Name Synonyms"}
                    triggerClassName="font-semibold capitalize"
                    data={data?.data?.vendor_name_synonyms}
                    onButtonClick={(item) => {
                      let copyObj = JSON.parse(JSON.stringify(data));
                      let filtered = copyObj["data"][
                        "vendor_name_synonyms"
                      ]?.filter((it) => it !== item.value);
                      copyObj["data"]["vendor_name_synonyms"] = filtered;
                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                  <CustomDropDown
                    Value={data?.data?.vendor_document_type?.toLowerCase()}
                    className="!min-w-[400px]"
                    triggerClassName={"bg-gray-100 !min-w-full"}
                    contentClassName={"bg-gray-100 !min-w-full"}
                    data={makeKeyValueFromKey(vendor_invoice_document_types)}
                    onChange={(val) => {
                      let copyObj = JSON.parse(JSON.stringify(data));

                      copyObj["data"]["vendor_document_type"] = val;

                      queryClient.setQueryData(
                        ["vendor-details", vendor_id],
                        copyObj
                      );
                    }}
                    placeholder="None"
                    searchPlaceholder="Search Vendor Name"
                  />{" "}
                </TableCell>
              </>
            )}
          </div>
        </TableRow>

        <div className="flex-1 !w-full">
          <TableBody className="flex-1 h-full  ">
            <div className="grid grid-cols-2  ">
              <div></div>
              <div></div>
            </div>
          </TableBody>
        </div>
      </Table>
    </div>
  );
};

export default VendorDetailsTable;
