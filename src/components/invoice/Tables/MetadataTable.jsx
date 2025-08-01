import {
  useGetVendorAddresses,
  useGetVendorsNames
} from "@/components/common/api";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/Custom/CustomInput";
import DatePicker from "@/components/ui/Custom/DatePicker";
import CustomDropDown from "@/components/ui/CustomDropDown";
import Fuse from "fuse.js";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { vendorCategories } from "@/constants";
import {
  categoryNamesFormatter,
  makeKeyValueFromKey,
  vendorNamesFormatter
} from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { formatISO, isValid, parseISO } from "date-fns";
import { InfoIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetDocumentMetadataBoundingBoxes,
  useGetVendorTypesAndCategories,
  useUpdateVendorOrBranch,
  useUpdateVendorTypesAndCategories
} from "../api";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
const Template = ({ title, children, className, titleContent }) => {
  return (
    <div className={`${className} flex flex-col gap-y-2 !z-12`}>
      <p className="font-poppins  font-medium text-sm leading-5 text-[#000000] !z-10">
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
  const [searchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });

  const [updatingCategoriesAndTypes, setUpdatingCategoriesAndTypes] =
    useState(false);
  const { data: vendorsData, isLoading: loadingVendors } = useGetVendorsNames();
  const { mutate: updateVendorTypesAndCategories } =
    useUpdateVendorTypesAndCategories();
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState({
    savingVendor: false,
    savingBranch: false
  });
  const {
    stopHovering,
    updatedFields,
    setStopHovering,
    setUpdatedFields,
    vendorChanged,
    setVendorChanged,
    branchChanged,
    setBranchChanged,
    setMetadata,
    newVendor,
    setNewVendor,
    newBranch,
    setNewBranch,
    editBranch,
    setEditBranch,
    editVendor,
    setEditVendor,
    setIsUnverifiedVendor,
    setCurrentDocumentUUID,
    setIsUnverifiedBranch,
    setBoundingBoxes,
    setBoundingBox,
    warning_checkbox_checked,
    setWarningCheckboxChecked
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
    invoice_type,
    invoice_type_preference_from_restaurant
  } = data?.data?.[0] || data?.data;
  const {
    data: metadataBoundingBoxes,
    isLoading: loadingMetadataBoundingBoxes
  } = useGetDocumentMetadataBoundingBoxes({
    ...payload,
    document_uuid: document_uuid
  });
  useEffect(() => {
    if (!vendor?.human_verified) {
      setIsUnverifiedVendor(true);
      setCurrentDocumentUUID(document_uuid);
    }
    if (!branch?.human_verified) {
      setIsUnverifiedBranch(true);
      setCurrentDocumentUUID(document_uuid);
    }
  }, [vendor, branch]);

  const [showToChangeCategoriesAndTypes, setShowToChangeCategoriesAndTypes] =
    useState(false);
  const [highlight, setHighlight] = useState(false);
  const [wantToChangeCategoriesAndTypes, setWantToChangeCategoriesAndTypes] =
    useState(null);
  const setCachedData = (key, value, setFields = true) => {
    // Normalize the data structure
    let normalizedData = Array?.isArray(data?.data) ? data?.data : [data?.data];
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
    let updatedData = Array?.isArray(data?.data)
      ? { ...data, data: normalizedData }
      : { ...data, data: normalizedData?.[0] };

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

    if (key === "invoice_type" || key === "document_type") {
      setShowToChangeCategoriesAndTypes(true);
    }
  };
  useEffect(() => {
    setUpdatedFields([]);
  }, []);
  const { data: vendorAddress, isLoading: loadingAddresses } =
    useGetVendorAddresses(vendor?.vendor_id);
  let page = searchParams.get("page");
  let page_number = searchParams.get("page_number");
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
          queryClient.invalidateQueries({
            queryKey: ["document-metadata", payload]
          });
          queryClient.invalidateQueries({
            queryKey: ["combined-table", document_uuid]
          });
          queryClient.invalidateQueries({
            queryKey: ["get-similar-vendors"]
          });
          setNewVendor("");
        },
        onError: (data) => {
          setLoadingState({ ...loadingState, savingVendor: false });
          toast.error(data?.message);
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
          queryClient.invalidateQueries({
            queryKey: ["document-metadata", payload]
          });
          queryClient.invalidateQueries({
            queryKey: ["combined-table", document_uuid]
          });
          queryClient.invalidateQueries({
            queryKey: ["get-similar-vendors"]
          });
          queryClient.invalidateQueries({
            queryKey: ["get-similar-branches"]
          });
          setEditBranch(false);
          setNewBranch("");
        },
        onError: (data) => {
          setLoadingState({ ...loadingState, savingBranch: false });
          toast.error(data?.message);
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

  const [vendorIdForTypesAndCategories, setVendorIdForTypesAndCategories] =
    useState(null);

  const { data: vendorTypesAndCategories } = useGetVendorTypesAndCategories(
    vendorIdForTypesAndCategories
  );

  const [types_and_categories, setTypes_and_categories] = useState({
    vendor_document_type: vendorTypesAndCategories?.data?.vendor_document_type,
    vendor_category: vendorTypesAndCategories?.data?.vendor_category,
    vendor_account_category:
      vendorTypesAndCategories?.data?.vendor_account_category?.category_id
  });

  useEffect(() => {
    setTypes_and_categories({
      vendor_document_type:
        vendorTypesAndCategories?.data?.vendor_document_type,
      vendor_category: vendorTypesAndCategories?.data?.vendor_category,
      vendor_account_category:
        vendorTypesAndCategories?.data?.vendor_account_category?.category_id
    });
  }, [vendorTypesAndCategories]);
  let action_controls =
    data?.data?.[0]?.action_controls || data?.data?.action_controls;

  const handleHighlighting = (field_name) => {
    if (!stopHovering) {
      return;
    }
    let boundng_boxes = metadataBoundingBoxes?.data?.[`${field_name}`];
    if (boundng_boxes) {
      setBoundingBox({
        box: boundng_boxes,
        page_index: boundng_boxes["page_index"]
      });
      setBoundingBoxes([
        { box: boundng_boxes, page_index: boundng_boxes["page_index"] }
      ]);
    }
  };

  const handleRestBoundingBoxes = (field_name) => {
    if (metadataBoundingBoxes?.data?.[`${field_name}`] !== null) {
      setBoundingBox({});
      setBoundingBoxes([]);
    }
  };
  console.log(vendorsData);
  const [showPreference, setShowPreference] = useState(true);
  return (
    <div className="w-full -mt-3 border border-[#F0F0F0] shadow-sm p-2 rounded-md">
      <div className="grid grid-cols-3 gap-x-4">
        <Template title="Invoice Number">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_number");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_number");
            }}
          >
            <CustomInput
              className={`${
                !document_metadata?.invoice_number ? "!border-[#F97074]" : ""
              }`}
              value={document_metadata?.invoice_number}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("invoice_number", v);
                }
              }}
            />
          </div>
        </Template>
        <Template title="Invoice Type" className={"relative"}>
          {invoice_type_preference_from_restaurant &&  showPreference&&(
            <div className="absolute right-0 cursor-pointer z-50">
              {/* <CustomTooltip className={"!min-w-fit"} content={invoice_type_preference_from_restaurant&&`Restaurant Preference : - ${invoice_type_preference_from_restaurant}`}> */}

              <div className="text-[10px]  absolute -top-6 bg-gray-200 text-black font-medium !min-w-[16rem] p-2 right-5  h-6 flex items-center rounded-md border !z-50">
                {invoice_type_preference_from_restaurant &&
                  `Restaurant Preference : - ${invoice_type_preference_from_restaurant}`}
                  <X className="absolute right-1  h-3.5 w-3.5" onClick={()=>{
                    setShowPreference(false)
                  }}/>
              </div>
              
              {/* </CustomTooltip> */}
            </div>
          )}
         {invoice_type_preference_from_restaurant&& <InfoIcon className=" w-4 h-4 text-yellow-500  absolute  right-1 cursor-pointer z-50"  onClick={()=>{
                setShowPreference(true)
              }}/>}
          <CustomDropDown
            showSearch={false}
            showWarning={invoice_type_preference_from_restaurant && true}
            warning={"Restaurant Preference"}
            warningOption={invoice_type_preference_from_restaurant}
            className={`!min-w-[300px] ${
              !invoice_type ? "!border-[#F97074]" : ""
            }`}
            data={vendorCategories?.slice(0, 3)}
            Value={invoice_type}
            onChange={(v) => {
              if (branchChanged || vendorChanged) {
                if (branchChanged) {
                  toast.error(
                    "Please Update the Vendor Address before proceeding for other changes.",
                    {
                      icon: "⚠️"
                    }
                  );
                  return;
                } else {
                  toast.error(
                    "Please Update the Vendor Name before proceeding for other changes.",
                    {
                      icon: "⚠️"
                    }
                  );
                  return;
                }
              } else {
                setCachedData("invoice_type", v);
                setVendorIdForTypesAndCategories(vendor?.vendor_id);
              }
            }}
          />
        </Template>

        <Template title="Invoice Date">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_date");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_date");
            }}
          >
            <div className="flex !w-full">
              <DatePicker
                className={`${
                  !document_metadata?.invoice_date ? "!border-[#F97074]" : ""
                }`}
                date={
                  document_metadata?.invoice_date &&
                  isValid(parseISO(document_metadata?.invoice_date))
                    ? parseISO(document_metadata?.invoice_date) // Parse ISO string
                    : null
                }
                onChange={(date) => {
                  if (branchChanged || vendorChanged) {
                    if (branchChanged) {
                      toast.error(
                        "Please Update the Vendor Address before proceeding for other changes.",
                        {
                          icon: "⚠️"
                        }
                      );
                      return;
                    } else {
                      toast.error(
                        "Please Update the Vendor Name before proceeding for other changes.",
                        {
                          icon: "⚠️"
                        }
                      );
                      return;
                    }
                  }
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
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-3 gap-x-4 mt-4">
        <Template title="Due Date">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_due_date");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_due_date");
            }}
          >
            <DatePicker
              className={`${
                !document_metadata?.invoice_due_date ? "!border-[#F97074]" : ""
              }`}
              date={
                document_metadata?.invoice_due_date &&
                isValid(parseISO(document_metadata?.invoice_due_date))
                  ? parseISO(document_metadata?.invoice_due_date) // Parse ISO string
                  : null
              }
              onChange={(date) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  if (date && isValid(date)) {
                    // Store date as ISO string in UTC format
                    setCachedData(
                      "invoice_due_date",
                      formatISO(date, { representation: "date" })
                    );
                  } else {
                    setCachedData("invoice_due_date", null);
                  }
                }
              }}
            />
          </div>
        </Template>
        <Template title="Vendor Name" className="col-span-2 w-full">
          <div
            onMouseEnter={() => {
              handleHighlighting("vendor");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("vendor");
            }}
          >
            <div className="flex items-center gap-x-4 pr-2  !min-w-full">
              {editVendor ? (
                <CustomInput
                  className={`${
                    !newVendor ? "!border-[#F97074]" : ""
                  } !text-xs text-[#666666] hover:text-[#666666]`}
                  value={newVendor}
                  vendor_id={vendor?.vendor_id}
                  placeholder="Vendor Name"
                  onChange={(v) => {
                    setNewVendor(v);
                    setVendorChanged(true);
                  }}
                />
              ) : (
                <div className="!w-full overflow-auto     flex gap-x-4">
                  <CustomDropDown
                    Value={vendor?.vendor_id}
                    placeholder={
                      loadingVendors ? "Loading..." : "Select Vendor"
                    }
                    className={`!max-w-full !min-w-full ${
                      !vendor?.vendor_id ? "!border-[#F97074]" : ""
                    }`}
                    triggerClassName={`${
                      editVendor ? " !min-w-[80%]" : "!min-w-fit"
                    }  md:max-w-[15rem] xl:!min-w-full`}
                    showVendorAsLink={true}
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
                    data={(() => {
                      // Format vendor names
                      if (loadingVendors) {
                        return [];
                      }
                      let formattedVendors = vendorNamesFormatter(
                        vendorsData?.vendor_names
                      );
                      console.log(vendorsData, "formatted vendors");
                      if (
                        !formattedVendors?.find(
                          (v) => v?.value == vendor?.vendor_id
                        )
                      ) {
                        formattedVendors = [
                          ...formattedVendors,
                          {
                            label: vendor?.vendor_name,
                            value: vendor?.vendor_id
                          }
                        ];
                      }

                      // Get the vendor name to compare
                      const referenceString = vendor?.vendor_name || "";

                      // Configure Fuse.js
                      const fuse = new Fuse(formattedVendors, {
                        keys: ["label"], // Search based on label field
                        threshold: 0.8 // Adjust similarity sensitivity
                      });
                      try {
                        const searchResults = referenceString
                          ? fuse
                              ?.search(referenceString)
                              ?.map((result) => result?.item)
                          : formattedVendors;

                        // If you want all vendors returned, merge missing items:
                        const remainingVendors = formattedVendors?.filter(
                          (vendor) => !searchResults?.includes(vendor)
                        );
                        const sortedVendors = [
                          ...searchResults,
                          ...remainingVendors
                        ];
                        return sortedVendors;
                      } catch (error) {
                        return [];
                      }
                      // Perform the search and sort based on relevance
                    })()}
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
              <Checkbox
                checked={warning_checkbox_checked}
                onCheckedChange={(v) => setWarningCheckboxChecked(v)}
              />
              <CustomTooltip
                content={
                  action_controls?.update_vendor?.disabled &&
                  action_controls?.update_vendor?.reason
                }
              >
                <Button
                  className={`${
                    !vendorChanged && "!border-[#CBCBCB] "
                  } bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm`}
                  disabled={
                    action_controls?.update_vendor?.disabled || !vendorChanged
                  }
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
              </CustomTooltip>
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
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-1 gap-x-4 mt-4">
        <Template title="Vendor Address" className={"col-span-2 "}>
          <div
            onMouseEnter={() => {
              handleHighlighting("branch");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("branch");
            }}
          >
            <div className="flex items-center gap-x-4 pr-2 !min-w-full">
              {editBranch ? (
                <CustomInput
                  value={branch?.vendor_address}
                  className={`${
                    !newBranch ? "!border-[#F97074]" : ""
                  } !max-w-full`}
                  onChange={(v) => {
                    setNewBranch(v);
                    setBranchChanged(true);
                  }}
                />
              ) : (
                <div className="flex items-center gap-x-4 w-full">
                  <CustomDropDown
                    Value={branch}
                    vendor_id={vendor?.vendor_id}
                    placeholder={
                      loadingAddresses ? "Loading...." : "Select Vendor Address"
                    }
                    className={`min-w-[30rem] ${
                      !branch?.branch_id ? "!border-[#F97074]" : ""
                    }`}
                    triggerClassName={`${
                      editBranch ? "!min-w-[80%]" : "!min-w-full"
                    } !max-w-[10rem] `}
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
                    showBranchAsLink={true}
                    data={(() => {
                      if (loadingAddresses) {
                        return [];
                      }
                      let formattedVendorAddresses =
                        vendorAddressFormatter(vendorAddress?.branches) || [];

                      if (
                        !formattedVendorAddresses?.find(
                          (v) => v?.value == branch?.branch_id
                        )
                      ) {
                        if (branch) {
                          formattedVendorAddresses = [
                            ...formattedVendorAddresses,
                            {
                              label: branch?.vendor_address,
                              value: branch?.branch_id
                            }
                          ];
                        }
                      }
                      const referenceString = branch?.vendor_address || "";
                      const fuse = new Fuse(formattedVendorAddresses, {
                        keys: ["label"], // Search based on label field
                        threshold: 0.8 // Adjust similarity sensitivity
                      });
                      try {
                        const searchResults = referenceString
                          ? fuse
                              ?.search(referenceString)
                              ?.map((result) => result.item)
                          : formattedVendorAddresses;

                        // Merge addresses not included in the fuzzy results:
                        const remainingAddresses =
                          formattedVendorAddresses?.filter(
                            (address) => !searchResults?.includes(address)
                          );

                        const sortedVendorAddresses = [
                          ...searchResults,
                          ...remainingAddresses
                        ];
                        return sortedVendorAddresses;
                      } catch (error) {
                        return [];
                      }
                    })()}
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
              <CustomTooltip
                content={
                  action_controls?.update_branch?.disabled &&
                  action_controls?.update_branch?.reason
                }
              >
                <Button
                  className={`${
                    !branchChanged && "!border-[#CBCBCB]"
                  } bg-transparent h-[2.4rem] border-primary w-[4.85rem] !rounded-md hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm`}
                  disabled={
                    action_controls?.update_branch?.disabled || !branchChanged
                  }
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
              </CustomTooltip>
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
          </div>
        </Template>
      </div>
      <div className="grid grid-cols-1 gap-x-4 mt-4">
        <Template title="QuickBooks Documents Type">
          <CustomDropDown
            Value={quick_book_document_type}
            className={`min-w-[28rem] ${
              !quick_book_document_type ? "!border-[#F97074]" : ""
            }`}
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
          <div
            onMouseEnter={() => {
              handleHighlighting("credit_card_name");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("credit_card_name");
            }}
          >
            <CustomInput
              value={document_metadata?.credit_card_name}
              className={`${
                !document_metadata?.credit_card_name ? "!border-[#F97074]" : ""
              }`}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("credit_card_name", v);
                }
              }}
            />
          </div>
        </Template>
        <Template title="Credit Card Number">
          <div
            onMouseEnter={() => {
              handleHighlighting("credit_card_number");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("credit_card_number");
            }}
          >
            <CustomInput
              value={document_metadata?.credit_card_number}
              className={`${
                !document_metadata?.credit_card_number
                  ? "!border-[#F97074]"
                  : ""
              }`}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("credit_card_number", v);
                }
              }}
            />
          </div>
        </Template>
      </div>

      <div className="flex flex-col gap-y-4 mt-4">
        <Template title="Invoice Shipped To">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_ship_to");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_ship_to");
            }}
          >
            <CustomInput
              value={document_metadata?.invoice_ship_to}
              className={`${
                !document_metadata?.invoice_ship_to ? "!border-[#F97074]" : ""
              }`}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("invoice_ship_to", v);
                }
              }}
            />
          </div>
        </Template>
        <Template title="Invoice Billed To">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_bill_to");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_bill_to");
            }}
          >
            <CustomInput
              value={document_metadata?.invoice_bill_to}
              className={`${
                !document_metadata?.invoice_bill_to ? "!border-[#F97074]" : ""
              }`}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("invoice_bill_to", v);
                }
              }}
            />
          </div>
        </Template>
        <Template title="Invoice Sold To">
          <div
            onMouseEnter={() => {
              handleHighlighting("invoice_sold_to");
            }}
            onMouseLeave={() => {
              handleRestBoundingBoxes("invoice_sold_to");
            }}
          >
            <CustomInput
              value={document_metadata?.invoice_sold_to}
              className={`${
                !document_metadata?.invoice_sold_to ? "!border-[#F97074]" : ""
              }`}
              onChange={(v) => {
                if (branchChanged || vendorChanged) {
                  if (branchChanged) {
                    toast.error(
                      "Please Update the Vendor Address before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  } else {
                    toast.error(
                      "Please Update the Vendor Name before proceeding for other changes.",
                      {
                        icon: "⚠️"
                      }
                    );
                    return;
                  }
                } else {
                  setCachedData("invoice_sold_to", v);
                }
              }}
            />
          </div>
        </Template>
      </div>
      <AlertDialog
        open={showToChangeCategoriesAndTypes}
        onOpenChange={() => setShowToChangeCategoriesAndTypes(false)}
      >
        <AlertDialogContent className="!max-h-[40rem] !min-h-[10rem]  !min-w-[15rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className=" relative !text-base font-poppins font-semibold leading-5 text-center  pb-3  border-b border-[#F0F0F0]">
              Change Categories and Types
              <X
                onClick={() => {
                  setShowToChangeCategoriesAndTypes(false);
                  setWantToChangeCategoriesAndTypes(null);
                  setTypes_and_categories({
                    vendor_document_type: null,
                    vendor_category: null,
                    vendor_account_category: null
                  });
                }}
                className="absolute  cursor-pointer -right-2 -top-0.5 text-[#000000]/80  font-thin"
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="w-full mt-2">
                <p>
                  Do You want to change the Categories and Types at Vendor
                  level?
                </p>
                <RadioGroup
                  className="flex gap-x-4 items-center py-4"
                  value={wantToChangeCategoriesAndTypes}
                  onValueChange={(v) => {
                    setWantToChangeCategoriesAndTypes(v);
                    if (v === false) {
                      setTypes_and_categories({
                        vendor_document_type: null,
                        vendor_category: null,
                        vendor_account_category: null
                      });
                      setShowToChangeCategoriesAndTypes(false);
                      setMetadata(data);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={true} id="true"></RadioGroupItem>
                    <Label
                      htmlFor="true"
                      className="font-poppins font-normal text-sm leading-5 text-[#000000] cursor-pointer "
                    >
                      Yes
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={false}
                      id="false"
                      className="!cursor-pointer"
                    ></RadioGroupItem>
                    <Label
                      htmlFor="false"
                      className="font-poppins font-normal text-sm leading-5 text-[#000000] cursor-pointer "
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {wantToChangeCategoriesAndTypes && (
                <div className="grid grid-cols-3 gap-x-4 gap-y-4 ">
                  {/* Vendor Document Type */}
                  <div className="flex flex-col gap-y-2">
                    <p>Vendor Document Type</p>
                    <CustomDropDown
                      Value={types_and_categories?.document_types}
                      className={"min-w-[28rem]"}
                      data={makeKeyValueFromKey(
                        additionalData?.data?.vendor_invoice_document_types
                      )}
                      onChange={(v) => {
                        setTypes_and_categories({
                          ...types_and_categories,
                          vendor_document_type: v
                        });
                      }}
                    />
                  </div>

                  {/* Vendor Category*/}
                  <div className="flex flex-col gap-y-2">
                    <p>Vendor Category</p>
                    <CustomDropDown
                      Value={types_and_categories?.vendor_category}
                      className={"min-w-[28rem] !z-50"}
                      data={makeKeyValueFromKey(
                        additionalData?.data?.vendor_invoice_categories
                      )}
                      onChange={(v) => {
                        setTypes_and_categories({
                          ...types_and_categories,
                          vendor_category: v
                        });
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <p>Vendor Account Category</p>
                    <CustomDropDown
                      Value={
                        vendorTypesAndCategories?.data?.vendor_account_category
                          ?.category_id
                      }
                      className={"min-w-[28rem]"}
                      data={categoryNamesFormatter(
                        additionalData?.data?.category_choices
                      )}
                      onChange={(v) => {
                        setTypes_and_categories({
                          ...types_and_categories,
                          vendor_account_category: v
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </AlertDialogDescription>
            {wantToChangeCategoriesAndTypes && (
              <DialogFooter className={"!mt-4"}>
                <Button
                  className="bg-primary text-white font-poppins text-xs font-normal rounded-sm mt-1"
                  onClick={() => {
                    setUpdatingCategoriesAndTypes(true);
                    updateVendorTypesAndCategories(
                      {
                        vendor_id: vendor?.vendor_id,
                        payload: types_and_categories
                      },
                      {
                        onSuccess: () => {
                          setUpdatingCategoriesAndTypes(false);
                          setShowToChangeCategoriesAndTypes(false);
                          setWantToChangeCategoriesAndTypes(null);
                          setTypes_and_categories({
                            vendor_document_type: null,
                            vendor_category: null,
                            vendor_account_category: null
                          });
                          setShowToChangeCategoriesAndTypes(false);
                        },
                        onError: () => {
                          setUpdatingCategoriesAndTypes(false);
                        }
                      }
                    );
                  }}
                >
                  {updatingCategoriesAndTypes ? "Updating..." : "Update"}
                </Button>
                <Button
                  className="bg-transparent text-[#000000]/90 font-poppins text-xs font-normal rounded-sm mt-1 shadow-none border-primary border-2 hover:bg-transparent hover:text-[#000000]"
                  onClick={() => {
                    setShowToChangeCategoriesAndTypes(false);
                    setWantToChangeCategoriesAndTypes(null);
                    setTypes_and_categories({
                      vendor_document_type: null,
                      vendor_category: null,
                      vendor_account_category: null
                    });
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MetadataTable;
