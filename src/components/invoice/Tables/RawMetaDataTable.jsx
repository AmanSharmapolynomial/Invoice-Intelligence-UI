import CustomDropDown from "@/components/ui/CustomDropDown";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  documentTypePrediction,
  editableFieldsForInvoiceMetadata,
  quickBooksDocumentTypes,
  rawMetaDataHeaders,
  vendorCategories
} from "@/constants";
import { vendorNamesFormatter } from "@/lib/helpers";
import { useInvoiceStore } from "../store";
import DatePicker from "@/components/ui/DatePicker";
const RawMetaDataTable = ({ data, isLoading, tab }) => {
  const { vendorsNames } = useInvoiceStore();

  return (
    // <div className="w-full !max-h-[50%] overflow-auto">
    <Table className="flex flex-col !max-h-[67vh]  box-border  scrollbar !w-full ">
      <TableRow className="flex  text-base  !border-none  ">
        <div className="!min-w-[50%]">
          {rawMetaDataHeaders.map(({ label, value }) => (
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
            ? new Array(30).fill(1).map((_, index) => (
                <TableCell
                  key={index}
                  className="flex  !text-left items-center justify-start pl-[5%]  capitalize !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-16"
                >
                  <Skeleton className={"w-72 h-5"} />
                </TableCell>
              ))
            : rawMetaDataHeaders.map(({ label, value }) => (
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

                    {value == "invoice_number" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="invoice number"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        // <></>
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}

                    {value == "invoice_type" &&
                      (tab == "edit_metadata" ? (
                        <CustomSelect
                          showSearch={false}
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          placeholder={"Invoice Type"}
                          data={vendorCategories.slice(0, 3)}
                          onSelect={(val) => console.log(val)}
                        />
                      ) : (
                        // <></>
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "vendor_name" &&
                      (tab == "edit_metadata" ? (
                        <CustomDropDown
                          className={"!w-full !min-w-fit"}
                          triggerClassName={"w-full bg-transparent"}
                          contentClassName={"w-full"}
                          showSearch={true}
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          placeholder={"Vendor Name"}
                          data={vendorNamesFormatter(vendorsNames)}
                          onSelect={(val) => console.log(val)}
                        />
                      ) : (
                        // <></>
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "vendor_address" &&
                      (tab == "edit_metadata" ? (
                        <Textarea
                          placeholder="Vendor Address"
                          rows={1}
                          className="min-h-9 focus:!ring-0 focus:outline-none"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "quick_book_document_type" &&
                      (tab == "edit_metadata" ? (
                        <CustomDropDown
                          className={"!w-full !min-w-fit"}
                          triggerClassName={"w-full bg-transparent"}
                          contentClassName={"w!-full"}
                          showSearch={true}
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          placeholder={"QBO Document Type"}
                          data={quickBooksDocumentTypes}
                          onSelect={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "document_type" &&
                      (tab == "edit_metadata" ? (
                        <CustomDropDown
                          className={"!w-full !min-w-fit"}
                          triggerClassName={"w-full bg-transparent"}
                          contentClassName={"w!-full"}
                          showSearch={true}
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          placeholder={"Document Type"}
                          data={documentTypePrediction}
                          onSelect={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}

                    {value == "invoice_ship_to" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="Invoice Shipped To"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "invoice_bill_to" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="Invoice Billed To"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "invoice_sold_to" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="Invoice Sold To"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "credit_card_name" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="Credit Card Name"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "credit_card_number" &&
                      (tab == "edit_metadata" ? (
                        <CustomInput
                          placeholder="Credit Card Number"
                          value={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(val) => console.log(val)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "invoice_due_date" &&
                      (tab == "edit_metadata" ? (
                        <DatePicker
                          initialDate={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(d) => console.log(d)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}
                    {value == "invoice_date" &&
                      (tab == "edit_metadata" ? (
                        <DatePicker
                          initialDate={
                            data?.[value] ||
                            data?.["document_metadata"]?.[value]
                          }
                          onChange={(d) => console.log(d)}
                        />
                      ) : (
                        data?.[value] || data?.["document_metadata"]?.[value]
                      ))}

                    {editableFieldsForInvoiceMetadata.includes(value) ? (
                      <></>
                    ) : (
                      <>
                        {typeof value !== String
                          ? value == "vendor"
                            ? data?.["vendor"]?.["vendor_name"] ||
                              data?.["document_metadata"]?.["vendor"]?.[
                                "vendor_name"
                              ]
                            :  value == "restaurant"
                            ? data?.["restaurant"]?.["restaurant_name"] ||
                              data?.["document_metadata"]?.["restaurant"]?.[
                                "restaurant_name"
                              ]
                            :  value == "branch"
                            ? data?.["branch"]?.["vendor_address"] ||
                              data?.["document_metadata"]?.["branch"]?.[
                                "vendor_address"
                              ]
                            : data?.[value] ||
                            data?.["document_metadata"]?.[value]:null}
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