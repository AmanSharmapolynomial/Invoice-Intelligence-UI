import { Checkbox } from "@/components/ui/checkbox";

import { queryClient } from "@/lib/utils";
import no_data from "@/assets/image/no-data.svg";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
const VendorInvoiceColumnData = ({
  data = [],
  additionalData = [],
  vendor_id
}) => {
  const { processed_table_header_candidates } = additionalData;
  const filteredColumns = processed_table_header_candidates?.filter(
    (item) => item?.is_required_for_item_master
  );

  const handleCheckboxChange = (column_name, value) => {
    let copyObj = JSON.parse(JSON.stringify(data));
    let { required_invoice_columns_for_item_master } = copyObj?.data;

    if (!required_invoice_columns_for_item_master) {
      required_invoice_columns_for_item_master = [];
    }
    const columnNameLower = column_name.toLowerCase();

    if (value === false) {
      //    Remove the column name if it exists
      required_invoice_columns_for_item_master =
        required_invoice_columns_for_item_master.filter(
          (item) => item.toLowerCase() !== columnNameLower
        );
    } else {
      //   Add the column name if it doesn't exist
      if (!required_invoice_columns_for_item_master.includes(columnNameLower)) {
        required_invoice_columns_for_item_master.push(columnNameLower);
      }
    }

    // Update the copy of the data
    copyObj.data.required_invoice_columns_for_item_master =
      required_invoice_columns_for_item_master;

    // Update the query data with the modified copy
    queryClient.setQueryData(["vendor-details", vendor_id], copyObj);
  };


  return (
    <CustomAccordion title="Vendor Invoice Column Data">
      <div className="mt-4 px-4">
        {filteredColumns?.length == 0 ? (
          <div className="w-full flex justify-center items-center">
            <img src={no_data} alt="" className="max-h-72" />
          </div>
        ) : (
          <>
            {" "}
            <div className="grid grid-cols-5 gap-x-4 gap-y-8 pb-4 mt-4">
              {filteredColumns?.map(({ column_name }, index) => (
                <div key={index} className="flex items-center gap-x-4 gap-y-8">
                  <Checkbox
                    id={column_name}
                    onCheckedChange={(val) =>
                      handleCheckboxChange(column_name, val)
                    }
                    checked={data?.data?.required_invoice_columns_for_item_master?.includes(
                      column_name?.toLowerCase()
                    )}
                  />
                  <label
                    htmlFor={column_name}
                    className={`${data?.data?.required_invoice_columns_for_item_master?.includes(
                      column_name?.toLowerCase()
                    ) && "text-primary"} text-sm font-normal font-poppins  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                  >
                    {column_name}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </CustomAccordion>
  );
};

export default VendorInvoiceColumnData;
