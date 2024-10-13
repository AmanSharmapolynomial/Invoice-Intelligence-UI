import CustomAccordion from "@/components/ui/CustomAccordion";
import CustomSelect from "@/components/ui/CustomSelect";
import ScrollableDropDown from "@/components/ui/ScrollableDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import no_data from "@/assets/image/no-data.svg";
import {
  useGetInvoiceHeaderExceptions,
  useUpdateInvoiceHeaderExceptions
} from "@/components/vendor/api";
import CustomDropDown from "@/components/ui/CustomDropDown";

const InvoiceHeaderMappingExceptions = ({ additionalData = [], vendor_id }) => {
  const [headerRawName, setHeaderRawName] = useState("");
  const { data, isLoading } = useGetInvoiceHeaderExceptions(vendor_id);
  const { mutate: saveHeaders, isPending: savingHeaders } =
    useUpdateInvoiceHeaderExceptions();
  let myData = data?.data?.invoice_header_exceptions;

  let headerDisplayNameOptions = makeKeyValueFromKey(
    additionalData?.processed_table_header_candidates
      ?.map(
        ({ is_default_in_item_master, is_required_for_item_master, ...rest }) =>
          rest
      )
      ?.map(({ column_name }) => column_name)
  );

  const handleAddHeaderRawName = (index) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_exceptions } = copyObj?.data;

    invoice_header_exceptions[index]["header_raw_names"].push(headerRawName);
    queryClient.setQueryData(["invoice-header-exceptions", vendor_id], copyObj);
    setHeaderRawName("");
  };

  const handleRemoveItem = (item, index) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_exceptions } = copyObj?.data;

    let filtered = invoice_header_exceptions[index]["header_raw_names"]?.filter(
      (it) => it !== item.value
    );
    invoice_header_exceptions[index]["header_raw_names"] = filtered;
    queryClient.setQueryData(["invoice-header-exceptions", vendor_id], copyObj);
  };

  const handleHeaderDisplayNameSelect = (value, index) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_exceptions } = copyObj?.data;
    invoice_header_exceptions[index]["header_display_name"] = value;
    queryClient.setQueryData(["invoice-header-exceptions", vendor_id], copyObj);
  };

  const addNewHeader = () => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_exceptions } = copyObj?.data;
    invoice_header_exceptions.push({
      header_display_name: null,
      header_raw_names: []
    });
    queryClient.setQueryData(["invoice-header-exceptions", vendor_id], copyObj);
  };
  const deleteRow = (index) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { invoice_header_exceptions } = copyObj?.data;
    invoice_header_exceptions.splice(index, 1);
    queryClient.setQueryData(["invoice-header-exceptions", vendor_id], copyObj);
  };
  return (
    <CustomAccordion
      title={"Invoice Header Mapping Exceptions"}
      contentClassName={"!text-2xl !font-bold"}
    >
      <Table className="!w-full mt-4 ">
        <TableRow className="flex bg-gray-200 items-center  hover:bg-gray-200 rounde-md">
          <TableHead className="text-base flex justify-center items-center !w-full ">
            Header Display Name
          </TableHead>
          <TableHead className="text-base flex justify-center items-center !w-full ">
            Header Raw Name
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
              </TableRow>
            ))}
          {myData?.map(({ header_raw_names, header_display_name }, index) => {
            return (
              <TableRow className="flex mt-4 !border-none" key={index}>
                <TableHead className="text-base flex  !w-full ">
                  <CustomDropDown
                    triggerClassName={"!w-full !bg-transparent "}
                    
                    placeholder="Header Display Name"
                    contentClassName="!z-450"
                    showSearch={true}
                    Value={header_display_name}
                    onChange={(val) => {
                      handleHeaderDisplayNameSelect(val, index);
                    }}
                    data={headerDisplayNameOptions}
                  />
                </TableHead>
                <TableHead className="text-base !border-none flex justify-center gap-x-2 !w-full ">
                  <ScrollableDropDown
                    placeholder={"Header Raw Name"}
                    contentClassName="py-1"
                    data={header_raw_names}
                    onButtonClick={(item) => {
                      handleRemoveItem(item, index);
                    }}
                  >
                    <div className="flex gap-x-4 my-2 px-1">
                      <Input
                        placeholder="Header raw name"
                        value={headerRawName}
                        onChange={(e) => setHeaderRawName(e.target.value)}
                        className=" focus:!ring-0 focus:!outline-none  border"
                      />
                      <Button
                        disabled={headerRawName.length == 0}
                        className="!flex gap-x-2  items-center"
                        onClick={() => handleAddHeaderRawName(index)}
                      >
                        <span>
                          {" "}
                          <PlusCircle className="h-4 w-4" />
                        </span>{" "}
                        <span className="text-sm font-normal">Add</span>
                      </Button>
                    </div>
                  </ScrollableDropDown>
                  <Button
                    className="bg-red-600 hover:bg-red-600/90"
                    onClick={() => deleteRow(index)}
                  >
                    {false ? (
                      <LoaderIcon className="w-5 h-5" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </TableHead>
              </TableRow>
            );
          })}
          {myData?.length == 0 && (
            <div className="w-full flex items-center justify-center min-h-96">
              <img src={no_data} alt="" className="max-h-72" />
            </div>
          )}

          <div className="flex justify-center gap-x-4 mb-2 mt-6">
            <Button
              className="p-0 min-w-40 gap-x-2 font-normal flex justify-center"
              onClick={addNewHeader}
            >
              <span>
                {" "}
                <PlusCircle className="h-4 w-4" />
              </span>{" "}
              <span className="text-sm font-normal">Add New Header</span>
            </Button>
            {myData?.length !== 0 && (
              <Button
                onClick={() => saveHeaders({ vendor_id, data: data?.data })}
                disabled={savingHeaders || isLoading}
                className="p-0 min-w-40 gap-x-2 font-normal flex justify-center"
              >
                <span>
                  {" "}
                  <Save className="h-4 w-4" />
                </span>{" "}
                <span className="text-sm font-normal">
                  {savingHeaders ? "Saving" : "Save"}
                </span>
              </Button>
            )}
          </div>
        </TableBody>
      </Table>
    </CustomAccordion>
  );
};

export default InvoiceHeaderMappingExceptions;
