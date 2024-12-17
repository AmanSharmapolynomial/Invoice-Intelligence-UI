import {
  useGetVendorAddresses,
  useGetVendorsNames
} from "@/components/common/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import DatePicker from "@/components/ui/Custom/DatePicker";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { vendorCategories } from "@/constants";
import { makeKeyValueFromKey, vendorNamesFormatter } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { formatISO, isValid, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateVendorOrBranch } from "../api";
const Template = ({ title, children, className, titleContent }) => {
  return (
    <div className={`${className} flex flex-col gap-y-2`}>
      <p className="font-poppins  font-medium text-sm leading-5 text-[#000000]">
        {title} {titleContent}
      </p>
      {children}
    </div>
  );
};
const MetadataTable = ({
  data,
  payload,
  additionalData,
  loadingAdditionalData
}) => {
  const { data: vendorsData, isLoading: loadingVendors } = useGetVendorsNames();

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

  const vendorAddressFormatter = (vendorAddress) => {
    return vendorAddress?.map(
      ({ created_date, document_count, item_count, verified_by, ...rest }) => {
        let pair = {
          label: rest?.vendor_address,
          value: rest?.branch_id,
          human_verified: rest?.human_verified
        };
        return pair;
      }
    );
  };

  return (
    <div className="w-full mt-1 border border-[#F0F0F0] shadow-sm p-2 rounded-md">
      <div className="grid grid-cols-3 gap-x-4">
        <Template
          title="Invoice Number"
          titleContent={
            <>
              {human_verified === true && rejected === false && (
                <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#348355] text-[#ffffff] p-1 rounded-md px-2">
                  Accepted{" "}
                </span>
              )}
              {rejected === true && (
                <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#F15156] text-[#ffffff] p-1 rounded-md px-2">
                  Rejected{" "}
                </span>
              )}
              {human_verified === false && rejected === false && (
                <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#B28F10] text-[#ffffff] p-1 rounded-md px-2">
                  Pending{" "}
                </span>
              )}
            </>
          }
        >
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
            {editVendor ? (
              <CustomInput
                className="!text-xs text-[#666666] hover:text-[#666666]"
                value={newVendor}
                placeholder="Vendor Name"
                onChange={(v) => setNewVendor(v)}
              />
            ) : (
              <div className="w-full  flex gap-x-4">
                <CustomDropDown
                  Value={vendor?.vendor_id}
                  className={"min-w-full "}
                  triggerClassName={`${
                    editVendor ? " !min-w-[80%]" : "!min-w-full"
                  } `}
                  onChange={(v, vendor) => {
                    setVendorChanged(true);
                    setCachedData(
                      "vendor",
                      {
                        vendor_name: vendor?.label,
                        vendor_id: vendor?.value,
                        human_verified: vendor?.human_verified
                      },
                      false
                    );
                  }}
                  data={vendorNamesFormatter(vendorsData?.vendor_names)}
                >
                  <p
                    onClick={() => setEditVendor(true)}
                    className=" cursor-pointer text-[#348355] font-poppins font-bold text-xs leading-4 px-5 py-2"
                  >
                    + Add new Vendor
                  </p>
                </CustomDropDown>
              </div>
            )}
            <Button
              className={`${
                !editVendor && "!border-[#CBCBCB] "
              } bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm`}
              disabled={!editVendor}
              onClick={() => {
                if (newVendor?.length > 0) {
                  updateVendor({ vendor_name: newVendor });
                } else {
                  updateVendor(vendor);
                }
              }}
            >
              {loadingState?.savingVendor ? "Updating.." : "Update"}
            </Button>
            {editVendor && (
              <Button
                className="bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                onClick={() => {
                  setEditVendor(false);
                  setEditBranch("");
                }}
              >
                Close
              </Button>
            )}
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-1 gap-x-4 mt-4">
        <Template title="Vendor Address" className={"col-span-2"}>
          <div className="flex items-center gap-x-4 pr-2 w-full">
            {editBranch ? (
              <CustomInput value={branch?.vendor_address} />
            ) : (
              <div className="flex items-center gap-x-4 w-full">
                <CustomDropDown
                  Value={branch?.branch_id}
                  className={"min-w-[30rem]"}
                  triggerClassName={`${
                    editBranch ? "!min-w-[80%]" : "!min-w-full"
                  } `}
                  onChange={(v, branch) => {
                    setCachedData(
                      "branch",
                      {
                        vendor_address: branch?.label,
                        branch_id: branch?.value,
                        human_verified: branch?.human_verified
                      },
                      false
                    );
                    setBranchChanged(true);
                  }}
                  data={vendorAddressFormatter(vendorAddress?.branches)}
                >
                  <p
                    onClick={() => setEditBranch(true)}
                    className=" cursor-pointer text-[#348355] font-poppins font-bold text-xs leading-4 px-5 py-2"
                  >
                    + Add New Branch
                  </p>
                </CustomDropDown>
              </div>
            )}
            <Button
              className={`${
                !editBranch && "!border-[#CBCBCB]"
              } bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm`}
              disabled={!editBranch}
              onClick={() => {
                if (newBranch?.length > 0) {
                  updateBranch({ vendor_address: newBranch });
                } else {
                  updateBranch(branch);
                }
              }}
            >
              {loadingState?.savingBranch ? "Updating.." : "Update"}
            </Button>
            {editBranch && (
              <Button
                className="bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                onClick={() => {
                  setEditBranch(false);
                  setNewBranch("");
                }}
              >
                Close
              </Button>
            )}
          </div>
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
