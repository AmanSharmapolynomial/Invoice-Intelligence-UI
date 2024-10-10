import no_data from '@/assets/image/no-data.svg';
import { Button } from "@/components/ui/button";
import CustomAccordion from "@/components/ui/CustomAccordion";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
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
      ?.map(({ column_name }) => column_name),true
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
      Object.keys(invoice_header_names_mapping).forEach((key) => {
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
console.log(headerDisplayNameOptions)
  return (
    <CustomAccordion
      title={"Invoice Header Mapping "}
      contentClassName={"!text-2xl !font-bold"}
    >
      <Table className="!w-full mt-4 ">
        <TableRow className="flex bg-gray-200 items-center  hover:bg-gray-200 rounde-md">
          <TableHead className="text-base flex justify-center items-center !w-full ">
            Header Display Name
          </TableHead>
          <TableHead className="text-base flex justify-center items-center !w-full ">
            Actual Header Name
          </TableHead>
          <TableHead className="text-base flex justify-center items-center !w-full ">
            Actual Header Position
          </TableHead>
        </TableRow>
        <TableBody className="!mt-4">
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
{(data &&
            Object?.keys(data.data.invoice_header_names_mapping)?.length==0 )&& <div className="min-h-96">
              <img src={no_data} alt="" className="min-h-72" />
            </div>}
          {data &&
            Object?.keys(data.data.invoice_header_names_mapping)?.map((item) => (
              <TableRow className="flex mt-4 !border-none" key={item}>
                <TableHead className="text-base flex !w-full ">
                  <CustomSelect
                    triggerClassName={"!w-full "}
                    placeholder="Header Display Name"
                    contentClassName="!z-450"
                    showSearch={true}
                    value={item}
                    onSelect={(val) => {
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
                <TableHead className="text-base !border-none flex justify-center gap-x-2 !w-full ">
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
                  <Button
                    className="bg-red-600 hover:bg-red-600/90"
                    onClick={() => deleteRow(item)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableHead>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </CustomAccordion>
  );
};

export default InvoiceHeaderMapping;
