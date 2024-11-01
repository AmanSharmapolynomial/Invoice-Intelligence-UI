import no_data from "@/assets/image/no-data.svg";
import { Button } from "@/components/ui/button";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
import CustomInput from "@/components/ui/Custom/CustomInput";

import CustomDropDown from "@/components/ui/CustomDropDown";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const InvoiceHeaderMapping = ({
  additionalData = [],
  vendor_id,
  data,
  isLoading = true
}) => {
  let myData = data?.data?.invoice_header_names_mapping;
  let headerDisplayNameOptions = makeKeyValueFromKey(
    additionalData?.processed_table_header_candidates
      ?.map(
        ({ is_default_in_item_master, is_required_for_item_master, ...rest }) =>
          rest
      )
      ?.map(({ column_name }) => column_name),
    true
  );

  const handleInputValueChange = (key, value, item) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_names_mapping } = copyObj?.data;
    invoice_header_names_mapping[item][key] = value;
    queryClient.setQueryData(["vendor-details", vendor_id], copyObj);
  };
  const handleHeaderDisplayNameSelect = (item, value, index) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_names_mapping } = copyObj?.data;

    if (item in invoice_header_names_mapping) {
      // Create a new object to maintain order
      const newMapping = {};
      // Copy existing keys to the new object
      Object?.keys(invoice_header_names_mapping).forEach((key) => {
        if (key === item) {
          newMapping[value] = invoice_header_names_mapping[key]; // Add the new key
        } else {
          newMapping[key] = invoice_header_names_mapping[key]; // Copy other keys as is
        }
      });
      copyObj.data.invoice_header_names_mapping = newMapping;
    }

    queryClient.setQueryData(["vendor-details", vendor_id], copyObj);
  };
  const deleteRow = (item) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_names_mapping } = copyObj?.data;

    if (item in invoice_header_names_mapping) {
      delete invoice_header_names_mapping[item];
    }
    queryClient.setQueryData(["vendor-details", vendor_id], copyObj);
  };

  return (
    <CustomAccordion title={"Invoice Header Mapping "}>
      <Table className="!w-full mt-4 !h-fit mb-4">
        <TableRow className="flex border-none gap-x-2 px-1 items-center rounde-sm !font-poppins !font-medium !text-[#000000]">
          <TableHead className="text-base flex pl-[0.7rem] justify-start items-center !text-[#000000] !w-full ">
            Header Display Name
          </TableHead>
          <TableHead className="text-base flex  pl-[0.7rem]  justify-start items-center !text-[#000000] !w-full ">
            Actual Header Name
          </TableHead>
          <TableHead className="text-base flex pl-[0.7rem]  justify-start items-center !text-[#000000] !w-full ">
            Actual Header Position
          </TableHead>
        </TableRow>
        <TableBody className="!mt-4 h-full">
          {isLoading &&
            new Array(4)?.fill(4)?.map((_, index) => (
              <TableRow key={index} className="flex rounde-md">
                <TableHead className="text-base flex justify-center items-center !w-full ">
                  <Skeleton className={"w-96 h-5"} />
                </TableHead>
                <TableHead className="text-base flex justify-center items-center !w-full ">
                  <Skeleton className={"w-96 h-5"} />
                </TableHead>
                <TableHead className="text-base flex justify-center items-center !w-full ">
                  <Skeleton className={"w-96 h-5"} />
                </TableHead>
              </TableRow>
            ))}
          {!isLoading &&
            data?.data?.invoice_header_names_mapping == undefined && (
              <div className="max-h-96 flex justify-center pt-4">
                <img src={no_data} alt="" className="!max-h-72" />
              </div>
            )}
          {!isLoading &&
            data?.data?.invoice_header_names_mapping &&
            Object?.keys(data?.data?.invoice_header_names_mapping)?.map(
              (item) => (
                <TableRow
                  className="flex mt-4 gap-x-4 !border-none px-1"
                  key={item}
                >
                  <TableHead className="text-base flex !w-full ">
                    <CustomDropDown
                      triggerClassName={"!w-full !bg-transparent"}
                      placeholder="Header Display Name"
                      contentClassName="!z-450"
                      showSearch={true}
                      Value={item?.toLowerCase()}
                      onChange={(val) => {
                        handleHeaderDisplayNameSelect(item, val);
                      }}
                      data={headerDisplayNameOptions}
                    />
                  </TableHead>
                  <TableHead className="text-base !border-none flex justify-center gap-x-2 !w-full ">
                    <CustomInput
                      triggerClassName={"!w-full "}
                      placeholder="Header Display Name"
                      contentClassName="!z-450"
                      showSearch={true}
                      onChange={(val) =>
                        handleInputValueChange("actual_header_name", val, item)
                      }
                      value={
                        data.data.invoice_header_names_mapping[item]
                          ?.actual_header_name || ""
                      }
                    />
                  </TableHead>
                  <TableHead className="text-base !border-none flex justify-center gap-x-8 pr-[2rem] !w-full ">
                    <CustomInput
                      triggerClassName={"!w-full "}
                      placeholder="Actual Header Position"
                      contentClassName="!z-450 !remove-number-spinner"
                      type="number"
                      onChange={(val) =>
                        handleInputValueChange(
                          "actual_header_position",
                          val,
                          item
                        )
                      }
                      value={
                        data.data.invoice_header_names_mapping[item]
                          ?.actual_header_position || ""
                      }
                    />
                    <p className="flex items-center">
                      <Trash2
                        className="h-5 w-5 text-[#939393] cursor-pointer"
                        onClick={() => deleteRow(item)}
                      />
                    </p>
                  </TableHead>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </CustomAccordion>
  );
};

export default InvoiceHeaderMapping;
