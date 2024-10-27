import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import DatePicker from "@/components/ui/DatePicker";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useGetVendorNames } from "@/components/vendor/api";
import {
  documentTypePrediction,
  editableFieldsForInvoiceMetadata,
  quickBooksDocumentTypes,
  rawMetaDataHeaders,
  vendorCategories
} from "@/constants";
import { vendorNamesFormatter } from "@/lib/helpers";
const RawMetaDataTable = ({ data, isLoading, tab }) => {
  const { data: vendorNamesList } = useGetVendorNames();
  return (
    // <div className="w-full !max-h-[50%] overflow-auto">
    <Table className="flex flex-col !min-h-[67vh] !max-h-full   box-border  border scrollbar !w-full ">
      <TableRow className="flex  text-base  !border-none  ">
        <div className="!min-w-[50%]">
          {rawMetaDataHeaders?.map(({ label, value }) => (
            <TableCell
              key={label}
              className={`flex  ${
                label == "Vendor Address" && tab == "edit_metadata"
                  ? "!min-h-14"
                  : "!min-h-16"
              }  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r `}
            >
              {label}
            </TableCell>
          ))}
        </div>
        <div className="!min-w-[50%] ">
          {isLoading
            ? new Array(30)?.fill(1)?.map((_, index) => (
                <TableCell
                  key={index}
                  className="flex  !text-left items-center justify-start pl-[5%]  capitalize !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-16"
                >
                  <Skeleton className={"w-72 h-5"} />
                </TableCell>
              ))
            : rawMetaDataHeaders?.map(({ label, value }) => (
                <TableCell
                  key={label}
                  className={`flex  ${
                    label == "Vendor Address" && tab == "edit_metadata"
                      ? "!min-h-14  "
                      : "!min-h-16"
                  }  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r `}
                >
                  <div className="w-full overflow-x-auto whitespace-nowrap">
                    {value === "human_verification_required" &&
                      (data?.[value] || data?.["document_metadata"]?.[value]
                        ? "Yes"
                        : "No")}
                    {value === "rerun_status" &&
                      (data?.[value] || data?.["document_metadata"]?.[value]
                        ? "Rerun"
                        : "Not Rerun")}

                    {value == "invoice_number" && (
                      <CustomInput
                        placeholder="invoice number"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}

                    {value == "invoice_type" && (
                      <CustomSelect
                        showSearch={false}
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        placeholder={"Invoice Type"}
                        data={vendorCategories.slice(0, 3)}
                        onSelect={(val) => console.log(val)}
                      />
                    )}
                    {value == "vendor_name" && (
                      <CustomDropDown
                        Value={data?.vendor?.vendor_name}
                        className="!min-w-56"
                        Key="label"
                        triggerClassName={"bg-gray-100"}
                        contentClassName={"bg-gray-100"}
                        data={vendorNamesFormatter(
                          vendorNamesList?.data?.vendor_names
                        )}
                        onChange={(val) => {
                          if (val == "none") {
                            // setVendorFilter("none");
                            // updateParams({ vendor: undefined });
                          } else {
                            // setVendorFilter(val);
                            // updateParams({ vendor: val });
                          }
                        }}
                        placeholder="Vendor Name"
                        searchPlaceholder="Search Vendor Name"
                      />
                    )}
                    {value == "vendor_address" && (
                      <Textarea
                        placeholder="Vendor Address"
                        rows={1}
                        className="min-h-9 focus:!ring-0 focus:outline-none"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                      />
                    )}
                    {value == "quick_book_document_type" && (
                      <CustomDropDown
                        className={"!w-full !min-w-fit"}
                        triggerClassName={"w-full bg-transparent"}
                        contentClassName={"w!-full"}
                        showSearch={true}
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        placeholder={"QBO Document Type"}
                        data={quickBooksDocumentTypes}
                        onSelect={(val) => console.log(val)}
                      />
                    )}
                    {value == "document_type" && (
                      <CustomDropDown
                        className={"!w-full !min-w-fit"}
                        triggerClassName={"w-full bg-transparent"}
                        contentClassName={"w!-full"}
                        showSearch={true}
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        placeholder={"Document Type"}
                        data={documentTypePrediction}
                        onSelect={(val) => console.log(val)}
                      />
                    )}

                    {value == "invoice_ship_to" && (
                      <CustomInput
                        placeholder="Invoice Shipped To"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}
                    {value == "invoice_bill_to" && (
                      <CustomInput
                        placeholder="Invoice Billed To"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}
                    {value == "invoice_sold_to" && (
                      <CustomInput
                        placeholder="Invoice Sold To"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}
                    {value == "credit_card_name" && (
                      <CustomInput
                        placeholder="Credit Card Name"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}
                    {value == "credit_card_number" && (
                      <CustomInput
                        placeholder="Credit Card Number"
                        value={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(val) => console.log(val)}
                      />
                    )}
                    {value == "invoice_due_date" && (
                      <DatePicker
                        initialDate={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(d) => console.log(d)}
                      />
                    )}
                    {value == "invoice_date" && (
                      <DatePicker
                        initialDate={
                          data?.[value] || data?.["document_metadata"]?.[value]
                        }
                        onChange={(d) => console.log(d)}
                      />
                    )}

                    {editableFieldsForInvoiceMetadata.includes(value) ? (
                      <></>
                    ) : (
                      <>
                        {typeof value !== String ? (
                          value == "vendor" ? (
                            <></>
                          ) : value == "restaurant" ? (
                            <>
                              {data?.["restaurant"]?.["restaurant_name"]
                                ? data?.["restaurant"]?.["restaurant_name"]
                                : data?.["restaurant"]?.["restaurant_id"]}
                            </>
                          ) : value == "branch" ? (
                            data?.["branch"]?.["vendor_address"] ||
                            data?.["document_metadata"]?.["branch"]?.[
                              "vendor_address"
                            ]
                          ) : (
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          )
                        ) : null}
                      </>
                    )}
                  </div>
                </TableCell>
              ))}
        </div>
      </TableRow>
    </Table>
    // </div>
  );
};

export default RawMetaDataTable;

// Invoice number
// Invoice Type
// Vendor Name
// Vendor Address
// Quick Books Document Type
// Document Type Prediction
// Due Date
// Invoice Date
// Invoice Ship To
// Invoice Bill To
// Invoice Sold To
// Credit Card Name
// Credit Card Number
