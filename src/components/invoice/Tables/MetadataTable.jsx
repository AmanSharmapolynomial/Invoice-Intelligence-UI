import {
  useGetVendorAddresses,
  useGetVendorsNames
} from "@/components/common/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { vendorCategories } from "@/constants";
import { makeKeyValueFromKey, vendorNamesFormatter } from "@/lib/helpers";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateVendorOrBranch } from "../api";
import { useGetAdditionalData } from "@/components/vendor/api";
import DatePicker from "@/components/ui/Custom/DatePicker";
import { formatISO, isValid, parseISO } from "date-fns";
import { queryClient } from "@/lib/utils";
const Template = ({ title, children, className }) => {
  return (
    <div className={`${className} flex flex-col gap-y-2`}>
      <p className="font-poppins  font-medium text-sm leading-5 text-[#000000]">
        {title}
      </p>
      {children}
    </div>
  );
};
const MetadataTable = ({ data,payload }) => {
  const { data: vendorsData, isLoading: loadingVendors } = useGetVendorsNames();
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState({
    savingVendor: false,
    savingBranch: false
  });
  const {
    setUpdatedFields,
    vendorChanged,
    setVendorChanged,
    branchChanged,
    setBranchChanged,
    newVendor,
    setNewVendor,
    newBranch,
    setNewBranch,
    editBranch,
    setEditBranch,
    editVendor,
    setEditVendor
  } = invoiceDetailStore();
  const {
    document_uuid,

    restaurant,
    vendor,
    human_verified,
    branch,
    document_type,

    version,
    rejected,
    rerun_status,

    quick_book_document_type,
    document_metadata,
    human_verification_required,
    invoice_type
  } = data?.data?.[0] || data?.data;
  const [vendorNameSearch, setVendorNameSearch] = useState("");
  const [vendorAddressSearch, setVendorAddressSearch] = useState("");

  const setCachedData = (key, value, setFields = true) => {
    // Normalize the data structure
    let normalizedData = Array.isArray(data?.data) ? data?.data : [data?.data];
    let updated = false;
    let isDocumentMetadata = false;

    // Iterate over normalized data to apply changes
    normalizedData.forEach((item, index) => {
      if (item?.document_metadata?.hasOwnProperty(key)) {
        normalizedData[index].document_metadata[key] = value;
        isDocumentMetadata = true;
        updated = true;
      } else if (item?.hasOwnProperty(key)) {
        normalizedData[index][key] = value;

        updated = true;
      }
    });

    // Update the original `data` object based on the normalization
    let updatedData = Array.isArray(data?.data)
      ? { ...data, data: normalizedData }
      : { ...data, data: normalizedData[0] };

    // Set the updated query data
    queryClient.setQueryData(["document-metadata", payload], updatedData);

    if (updated) {
      if (setFields) {
        setUpdatedFields((prevFields) => {
          if (isDocumentMetadata) {
            return {
              ...prevFields,
              document_metadata: {
                ...prevFields.document_metadata,
                [key]: value
              }
            };
          }
          return {
            ...prevFields,
            [key]: value
          };
        });
      }
    }
  };
  useEffect(() => {
    setUpdatedFields([]);
  }, []);
  const { data: vendorAddress, isLoading: loadingAddresses } =
    useGetVendorAddresses(vendor?.vendor_id);

  const { mutate: updateVendorOrBranch, isPending } = useUpdateVendorOrBranch();
  const updateVendor = (vendor) => {
    setLoadingState({ ...loadingState, savingVendor: true });
    updateVendorOrBranch(
      {
        document_uuid: document_uuid,
        data: {
          vendor_id: vendor?.vendor_id || null,
          vendor_name: vendor?.vendor_name
        },
        Key: "vendor"
      },
      {
        onSuccess: () => {
          setVendorChanged(false);
          setLoadingState({ ...loadingState, savingVendor: false });
          setEditVendor(false);
          setNewVendor("");
        },
        onError: () => {
          setLoadingState({ ...loadingState, savingVendor: false });
        }
      }
    );
  };
  const updateBranch = (branch) => {
    setLoadingState({ ...loadingState, savingBranch: true });
    updateVendorOrBranch(
      {
        document_uuid: document_uuid,
        data: {
          branch_id: branch?.branch_id || null,
          vendor_address: branch?.vendor_address
        },
        Key: "branch"
      },
      {
        onSuccess: () => {
          setBranchChanged(false);
          setLoadingState({ ...loadingState, savingBranch: false });
          setEditBranch(false);
          setNewBranch("");
        },
        onError: () => {
          setLoadingState({ ...loadingState, savingBranch: false });
        }
      }
    );
  };

  return (
    <div className="w-full mt-1 border border-[#F0F0F0] shadow-sm p-2 rounded-md">
      <div className="grid grid-cols-3 gap-x-4">
        <Template title="Invoice Number">
          <CustomInput
            value={document_metadata?.invoice_number}
            onChange={(v) => setCachedData("invoice_number", v)}
          />
        </Template>
        <Template title="Invoice Type">
          <CustomDropDown
            showSearch={false}
            className={"!min-w-[300px]"}
            data={vendorCategories?.slice(0, 3)}
            Value={invoice_type}
            onChange={(v) => console.log(v)}
          />
        </Template>
        <Template title="Invoice Date">
          <div className="flex">
            <DatePicker
              date={
                document_metadata?.invoice_date &&
                isValid(parseISO(document_metadata.invoice_date))
                  ? parseISO(document_metadata.invoice_date) // Parse ISO string
                  : null
              }
              onChange={(date) => {
                if (date && isValid(date)) {
                  // Store date as ISO string in UTC format
                  setCachedData(
                    "invoice_date",
                    formatISO(date, { representation: "date" })
                  );
                } else {
                  setCachedData("invoice_date", null);
                }
              }}
            />
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-3 gap-x-4 mt-4">
        <Template title="Due Date">
        <DatePicker
              date={
                document_metadata?.invoice_due_date &&
                isValid(parseISO(document_metadata.invoice_due_date))
                  ? parseISO(document_metadata.invoice_due_date) // Parse ISO string
                  : null
              }
              onChange={(date) => {
                if (date && isValid(date)) {
                  // Store date as ISO string in UTC format
                  setCachedData(
                    "invoice_due_date",
                    formatISO(date, { representation: "date" })
                  );
                } else {
                  setCachedData("invoice_due_date", null);
                }
              }}
            />
        </Template>
        <Template title="Vendor Name" className="col-span-2">
          <div className="flex items-center gap-x-4 pr-2 w-full">
            <CustomDropDown
              className={"min-w-full"}
              triggerClassName={"!min-w-[80%]"}
              data={vendorNamesFormatter(vendorsData?.vendor_names)}
            />
            <Button className="bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Update
            </Button>
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-1 gap-x-4 mt-4">
        <Template title="Vendor Address">
          <CustomInput value={branch?.vendor_address} />
        </Template>
      </div>
      <div className="grid grid-cols-2 gap-x-4 mt-4">
        <Template title="Document Type Prediction">
          <CustomDropDown
            value={document_type}
            className={"min-w-[28rem]"}
            data={makeKeyValueFromKey(additionalData?.data?.document_types)}
            onChange={(v) => {
              setCachedData("document_type", v);
            }}
          />
        </Template>
        <Template title="QuickBooks Documents Type">
          <CustomDropDown
            value={quick_book_document_type}
            className={"min-w-[28rem]"}
            data={makeKeyValueFromKey(
              additionalData?.data?.vendor_invoice_document_types
            )}
            onChange={(v) => {
              setCachedData("quick_book_document_type", v);
            }}
          />
        </Template>
      </div>
      <div className="grid grid-cols-2 gap-x-4 mt-4">
        <Template title="Credit Card Name">
          <CustomInput
            value={document_metadata?.credit_card_name}
            onChange={(v) => {
              setCachedData("credit_card_name", v);
            }}
          />
        </Template>
        <Template title="Credit Card Number">
          <CustomInput
            value={document_metadata?.credit_card_number}
            onChange={(v) => {
              setCachedData("credit_card_number", v);
            }}
          />
        </Template>
      </div>

      <div className="flex flex-col gap-y-4 mt-4">
        <Template title="Invoice Shipped To">
          <CustomInput
            value={document_metadata?.invoice_ship_to}
            onChange={(v) => setCachedData("invoice_ship_to", v)}
          />
        </Template>
        <Template title="Invoice Billed To">
          <CustomInput
            value={document_metadata?.invoice_bill_to}
            onChange={(v) => setCachedData("invoice_bill_to", v)}
          />
        </Template>
        <Template title="Invoice Sold To">
          <CustomInput
            value={document_metadata?.invoice_sold_to}
            onChange={(v) => setCachedData("invoice_sold_to", v)}
          />
        </Template>
      </div>
    </div>
  );
};

export default MetadataTable;
