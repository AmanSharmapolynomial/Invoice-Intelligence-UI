import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import warning from "@/assets/image/warning.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import Sidebar from "@/components/common/Sidebar";
import {
  useApproveMultiInvoiceDocument,
  useListMultiInvoiceDocuments,
  useListRestaurants,
  useRejectMultiInvoiceDocument,
  useSearchInvoice,
  useUpdateMultiInvoiceDocument
} from "@/components/home/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import InvoicePagination from "@/components/invoice/InvoicePagination";
import { useMarkMultipleInvoiceDocumentAsNotSupported } from "@/components/invoice/api";
import { useInvoiceStore } from "@/components/invoice/store";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import CustomDropDown from "@/components/ui/CustomDropDown";
import Loader from "@/components/ui/Loader";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorNames } from "@/components/vendor/api";
import {
  calculateTimeDifference,
  formatDateTimeToReadable,
  formatRestaurantsList,
  vendorNamesFormatter
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import persistStore from "@/store/persistStore";
import {
  ArrowRight,
  Check,
  Clock,
  Filter,
  Move,
  Pencil,
  Plus,
  Save,
  Share2,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

let dropdownOptions = [
  { label: "Noise", value: "noise" },
  { label: "Multiple Invoice", value: "multiple_invoice" },
  { label: "Unidentified", value: "unidentified" },
  { label: "Not Supported", value: "not_supported" },
  { label: "Blank Page", value: "blank_page" },
  { label: "Invoice Details Unclear", value: "invoice_details_unclear" },
]

const InvoiceGroupAccordion = ({
  group,
  f_key,
  payload,
  data,
  pagesCount,
  resetTrigger,
  checkedIndices,
  setCheckedIndices,
  setCurrentPageIndex
}) => {
  const [newIndex, setNewIndex] = useState("");
  const [addingIndex, setAddingIndex] = useState(false);
  const [groupIndices, setGroupIndices] = useState(group?.page_indices || []);

  const [editing, setEditing] = useState(false);
  // Local states for editing fields
  const [localVendorName, setLocalVendorName] = useState(group?.vendor_name || "");
  const [localInvoiceNumber, setLocalInvoiceNumber] = useState(group?.invoice_number || "");
  const [localType, setLocalType] = useState(group?.type || "");
  useEffect(() => {
    if (editing) {
      setLocalVendorName(group?.vendor_name || "");
      setLocalInvoiceNumber(group?.invoice_number || "");
      setLocalType(group?.type || "");
    }
  }, [editing, group]);

  useEffect(() => {
    setAddingIndex(false);
    setNewIndex("");
    setGroupIndices(group?.page_indices || []);
  }, [resetTrigger]);
  const handleSave = () => {
    let copyData = JSON.parse(
      JSON.stringify(queryClient.getQueryData(["multi-invoice-documents", payload]))
    );
    if (!copyData) return;
    let myData = copyData?.data?.[0];

    myData?.[f_key]?.forEach((g) => {
      if (g?.id === group?.id) {
        g.vendor_name = localVendorName;
        g.invoice_number = localInvoiceNumber;
        g.type = localType;
      }
    });

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
    setEditing(false);
    toast.success("Group updated successfully!");
  }
  const invoiceToCompanyMap = useMemo(() => {
    const map = {};
    data?.data?.[0]?.[f_key]?.forEach((doc) => {
      if (doc.invoice_number && doc.company_id) {
        map[doc.invoice_number] = doc.company_id;
      }
    });
    return map;
  }, [data]);

  const handleAddIndex = () => {
    const companyId = invoiceToCompanyMap[group.invoice_number];
    const indexNum = parseInt(newIndex);

    // Basic validation with toasts
    if (indexNum
      > pagesCount
    ) {
      toast.error(`Page Index must be between 1 and ${pagesCount}.`);
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }
    if (isNaN(indexNum)) {
      toast.error("Please enter a valid number.");
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    if (indexNum < 1 || indexNum > pagesCount) {
      toast.error(`Page Index must be between 1 and ${pagesCount}.`);
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    if (groupIndices.includes(indexNum)) {
      toast.error("This page index  is already added.");
      // setNewIndex("");
      // setAddingIndex(false);
      return;
    }

    const allGroups = [
      ...(data?.data?.[0]?.["closed_groups"] || []),
      ...(data?.data?.[0]?.["open_groups"] || []),
      ...(data?.data?.[0]?.["incomplete_groups"] || [])
    ].flat();

    const usedIndicesInCompany = allGroups?.flatMap(
      (g) => g.page_indices || []
    );

    if (usedIndicesInCompany.includes(indexNum)) {
      toast.error("This page index is already used.");
      return;
    }

    const updatedIndices = [...groupIndices, indexNum];
    setGroupIndices(updatedIndices);
    setNewIndex("");
    setAddingIndex(false);

    // ✅ Update React Query cache
    let copyData = JSON.parse(
      JSON.stringify(
        data
      )
    );
    if (!copyData) return;

    let myData = copyData?.data?.[0];
    myData?.[f_key]?.forEach((g) => {
      if (
        g?.id === group?.id
      ) {
        g.page_indices = updatedIndices;
      }
    });

    
    myData?.[f_key]?.forEach((g) => {
      if (g?.id === group?.id) {
        g.vendor_name = localVendorName;
        g.invoice_number = localInvoiceNumber;
        g.type = localType;
      }
    });
    setEditing(false)

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
  };

  const handleRemoveIndex = (indexToRemove) => {
    const updatedIndices = groupIndices.filter((idx) => idx !== indexToRemove);
    setGroupIndices(updatedIndices);

    // ✅ Update React Query cache
    let copyData = JSON.parse(JSON.stringify(data));
    if (!copyData) return;

    let myData = copyData?.data?.[0];
    myData?.[f_key]?.forEach((g) => {
      if
        (g?.id === group?.id) {
        g.page_indices = updatedIndices;
      }
    });

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
  };


  const handleDeleteGroup = () => {
    let copyData = JSON.parse(
      JSON.stringify(data)
    );
    if (!copyData) return;
    let myData = copyData?.data?.[0];
    if (f_key == "open_groups") {
      myData[f_key] = myData?.[f_key]?.filter(
        (g) => g?.id !== group?.id
      );
    } else {

      myData[f_key] = myData?.[f_key]?.filter(
        (g) => g?.id !== group?.id
      );
    }
    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
    setCheckedIndices((prev) =>
      prev?.filter((id) => id !== group?.id)
    );
  }

  const [showMoveGroupModal, setShowMoveGroupModal] = useState(false);
  const [selectedGroupToMove, setSelectedGroupToMove] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState(null);
  const handleMoveGroup = () => {
    if (!selectedGroupToMove || !selectedGroupType) {
      toast.error("Please select a group type to move.");
      return;
    }

    let copyData = JSON.parse(JSON.stringify(data));
    if (!copyData) return;

    let myData = copyData?.data?.[0];
    if (!myData) return;

    // Map UI labels to API keys
    const typeMap = {
      "Closed Groups": "closed_groups",
      "Incomplete Groups": "incomplete_groups",
      "Open Groups": "open_groups"
    };

    const targetKey = typeMap[selectedGroupType];
    if (!targetKey) {
      toast.error("Invalid target group type.");
      return;
    }

    // 1. Remove group from current list
    myData[f_key] = myData?.[f_key]?.filter((g) => g?.id !== selectedGroupToMove?.id);

    // 2. Add group to new list (updating its group_type)
    const movedGroup = {
      ...selectedGroupToMove,
      group_type: targetKey
    };

    myData[targetKey] = [...(myData[targetKey] || []), movedGroup];

    // 3. Update React Query cache
    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);

    // 4. Reset modal state
    setShowMoveGroupModal(false);
    setSelectedGroupToMove(null);
    setSelectedGroupType(null);

    toast.success(`Group moved to ${selectedGroupType}`);
    setResetTrigger(prev => prev + 1)
  };

  return (
    <div className="my-1">
      <CustomAccordion
        className="!rounded-sm !shadow-none border !text-sm w-full"
        triggerClassName="!text-sm"
        triggerButtons={<div className="flex items-center gap-x-2">
          <CustomTooltip content={"Move Group"}>

            <Button className="bg-red-500 hover:bg-red-500 w-7 h-7 rounded-sm"
              disabled={editing}
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveGroupModal(true)
                setSelectedGroupToMove(group)
              }}
            >
              <Move className="w-5 h-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content={"Delete Group"}>

            <Button className="bg-red-500 hover:bg-red-500 w-7 h-7 rounded-sm"
              onClick={(e) => {

                e.stopPropagation();
                handleDeleteGroup();
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content={editing ? "Save Group" : "Edit Group"}>


            {!editing ? (

              <Button

                className="bg-primary hover:bg-primary w-7 h-7 rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
              >
                <Pencil />
              </Button>
            )
              : (
                <Button

                  className="bg-primary hover:bg-primary w-7 h-7 rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();

                    handleSave()
                  }}
                >
                  <Save />
                </Button>
              )
            }
          </CustomTooltip>
        </div>

        }

        title={
          f_key == "open_groups"
            ? `${group?.type?.split("_")?.join(" ") || ""}`
            : `${group?.vendor_name} ${group?.vendor_name && group?.invoice_number && "|"} ${group?.invoice_number}`
        }
      >

        {/*  Vendor Name and Invoice NUmber We have to give input fields for saving and editing  */}
        {editing && <div className="flex items-start ml-2 mt-2 gap-y-2 flex-col gap-x-2">
          {f_key !== "open_groups" && <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
            <p className="font-poppins font-medium text-sm">Vendor Name</p>
            <Input
              className="w-72"
              value={localVendorName}
              onChange={(e) => setLocalVendorName(e.target.value)}
              placeholder="Vendor Name"
            />
          </div>}
          {f_key !== "open_groups" && <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
            <p className="font-poppins font-medium text-sm">Invoice Number</p>
            <Input
              className="w-72"
              value={localInvoiceNumber}
              onChange={(e) => setLocalInvoiceNumber(e.target.value)}
              placeholder="Invoice Number"
            />
          </div>}

          {
            f_key === "open_groups" && (
              <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
                <p className="font-poppins font-medium text-sm">Type</p>
                <CustomDropDown
                  Value={localType}
                  data={dropdownOptions}
                  onChange={(v) => setLocalType(v)}
                />

              </div>
            )
          }
        </div>}
        <div className="flex items-center  gap-x-2 w-full px-2 mt-4">
          <div className="!w-[90%] flex justify-center items-center gap-2 flex-wrap">
            {groupIndices?.map((index, i) => (
              <div className="w-10 h-10 relative" key={i}>
                <Button
                  onClick={() => setCurrentPageIndex(index)}
                  className="w-10 h-10 flex items-center hover:bg-transparent justify-center bg-gray-50 text-black"
                >
                  {index}
                </Button>
                <div
                  onClick={() => handleRemoveIndex(index)}
                  className="h-4 w-4 rounded-full bg-red-500 absolute -top-1 flex items-center justify-center -right-1.5 cursor-pointer"
                >
                  <X className="h-3 w-3 text-white" />
                </div>
              </div>
            ))}

            {addingIndex && (
              <div className="w-20 h-10 relative">
                <input
                  type="number"
                  className="w-20 h-10 text-center text-sm border border-gray-300 rounded"
                  value={newIndex}
                  onChange={(e) => setNewIndex(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddIndex()}
                />
                <div
                  className="h-4 w-4 rounded-full bg-green-500 absolute -top-1.5 right-3 flex items-center justify-center cursor-pointer"
                  onClick={handleAddIndex}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div
                  className="h-4 w-4 rounded-full bg-red-500 absolute -top-1.5 -right-1.5 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setAddingIndex(false);
                    setNewIndex("");
                  }}
                >
                  <X className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </div>
          <div className="!flex items-center !w-[10%]  gap-x-4 justify-end  px-2 my-2">
            <Button
              className="rounded-sm h-7 w-7"
              onClick={() => setAddingIndex(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Checkbox
              className="h-5 w-5"
              checked={checkedIndices.includes(group?.id)}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  if (f_key === "open_groups") {
                    setCheckedIndices((prev) => [...prev, group?.id]);
                  } else {

                    setCheckedIndices((prev) => [...prev, group?.id]);
                  }
                } else {
                  if (f_key === "open_groups") {
                    setCheckedIndices((prev) =>
                      prev?.filter((id) => id !== group?.id)
                    );
                  } else {

                    setCheckedIndices((prev) =>
                      prev?.filter((id) => id !== group?.id)
                    )
                  }
                }
              }}
            />
          </div>


        </div>
      </CustomAccordion>
      <Modal
        open={showMoveGroupModal}
        title={"Move Group"}
        // className={"h-[70vh]"}
        titleClassName={"font-poppins font-semibold text-base"}
        setOpen={setShowMoveGroupModal}
      >
        <ModalDescription >
          <p className="font-poppins font-medium text-black text-sm">Select the Group Type where u want to move the selected group :</p>
          <RadioGroup
            defaultValue={null}
            onValueChange={(v) => {
              setSelectedGroupType(v);
              if (v !== "Open Groups") {
                setSelectedGroupToMove({ ...selectedGroupToMove, type: "" })
              } else {

                setSelectedGroupToMove({ ...selectedGroupToMove, vendor_name: "", invoice_number: "", type: "" })
              }
            }}
            className=" flex flex-col font-poppins text-black font-medium text-sm  gap-y-2 mt-4"
          >
            {['Closed Groups', "Incomplete Groups", "Open Groups"]?.map((r, i) => {
              return (
                <div className="flex items-center space-x-2" key={i}>
                  <RadioGroupItem value={r} id={r} disabled={selectedGroupToMove?.group_type == r?.split(" ")?.join("_")?.toLowerCase()} />

                  <Label
                    htmlFor={r}
                    className="text-[#6D6D6D] font-medium capitalize cursor-pointer font-poppins text-xs leading-5"
                  >
                    {r} {f_key}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          <div className="mt-6 mb-4">
            {selectedGroupToMove?.group_type == "open_groups" ?
              <div className="flex flex-col gap-y-2 my-2">
                <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
                  <p className="font-poppins font-medium text-xs">Vendor Name</p>
                  <Input
                    className="w-72"
                    value={selectedGroupToMove?.vendor_name || ""}
                    onChange={(e) => {
                      setSelectedGroupToMove({ ...selectedGroupToMove, vendor_name: e.target.value })
                    }}
                    placeholder="Vendor Name"
                  />
                </div>
                <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
                  <p className="font-poppins font-medium text-xs">Invoice Number</p>
                  <Input
                    className="w-72 text-xs"
                    value={selectedGroupToMove?.invoice_number || ""}
                    onChange={(e) => {
                      setSelectedGroupToMove({ ...selectedGroupToMove, invoice_number: e.target.value })
                    }}

                    placeholder="Invoice Number"
                  />
                </div>
              </div> : selectedGroupType?.split(" ")?.join("_")?.toLowerCase() == "open_groups" && <>
                <div className="flex items-center gap-x-2 ml-4 w-[420px] justify-between">
                  <p className="font-poppins font-medium text-sm">Type</p>
                  <select
                    value={selectedGroupToMove?.type || ""}
                    onChange={(e) =>
                      setSelectedGroupToMove({
                        ...selectedGroupToMove,
                        type: e.target.value,
                      })
                    }
                    className="
    w-full rounded-md border border-gray-300 bg-white
    px-3 py-2 text-sm text-gray-900
    shadow-sm focus:outline-none  focus:ring-0
     appearance-auto 
  "
                  >
                    <option value="" disabled>
                      Select group type
                    </option>
                    {
                      dropdownOptions?.map((option, index) => (
                        <option value={option?.value} key={index} className="hover:!bg-gray-200">{option?.label}</option>

                      ))
                    }
                  </select>


                </div>
              </>
            }



          </div>

          <div className="flex items-center justify-center gap-x-4 my-2">
            <Button
              onClick={() => {
                setShowMoveGroupModal(false);
                setSelectedGroupToMove(null);
                setSelectedGroupType(null);
                setEditing(false);
              }}
              className="rounded-sm !w-[4.5rem] !font-poppins bg-transparent border border-primary shadow-none text-[#000000] font-normal text-xs hover:bg-transparent"
            >
              No
            </Button>
            <Button
              onClick={() => handleMoveGroup()}
              className="rounded-sm !w-[4.5rem] !font-poppins text-xs font-normal"
            >
              {"Move"}
            </Button>
          </div>

        </ModalDescription>
      </Modal>
    </div>
  );
};

const MultiInvoiceDocumentsDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, setFilters, setDefault } = useFilterStore();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchedInvoices, setSearchedInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();
  let page = searchParams.get("page_number") || 1;
  let page_size = searchParams.get("page_size") || 1;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verification =
    searchParams.get("human_verification") || filters?.human_verification;
  let human_verified =
    searchParams.get("human_verified") || filters?.human_verified;
  let detected =
    searchParams.get("invoice_detection_status") || filters?.detected;
  let rerun_status =
    searchParams.get("rerun_status") || filters?.human_verified;
  let rejected = searchParams.get("rejected") || "all";
  let auto_accepted =
    searchParams.get("auto_accepted") || filters?.auto_accepted;
  let start_date = searchParams.get("start_date") || filters?.start_date;
  let end_date = searchParams.get("end_date") || filters?.end_date;
  let extraction_source = searchParams.get("extraction_source") || "all";
  let clickbacon_status =
    searchParams.get("clickbacon_status") || filters?.clickbacon_status;
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  let sort_order = searchParams.get("sort_order") || "desc";
  let invoice_number = searchParams.get("invoice_number") || "";
  let assigned_to = searchParams.get("assigned_to");
  let detailed_view = searchParams.get("detailed_view") || "false";

  let document_priority = searchParams.get("document_priority") || "all";
  let restaurant_tier =
    searchParams.get("restaurant_tier") == "null" ||
      searchParams.get("restaurant_tier") == "all"
      ? null
      : searchParams.get("restaurant_tier");

  const updateParams = useUpdateParams();
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames("all", restaurant);
  const {
    setRestaurantFilter,
    setVendorFilter,
    vendorFilterValue,
    restaurantFilterValue,
    setVendorNames
  } = useInvoiceStore();
  const payload = {
    auto_accepted: auto_accepted,
    end_date: end_date,
    human_verification: human_verification,
    detected: detected,
    invoice_type: invoice_type,
    clickbacon_status: clickbacon_status,
    rerun_status: rerun_status,
    restaurant: restaurant,
    start_date: start_date,
    vendor: vendor,
    page_size: 1,
    page,
    sort_order,
    human_verified,
    auto_accepted_by_vda,
    assigned_to,
    document_priority,
    review_later: false,
    // supported_documents: false,
    restaurant_tier: restaurant_tier || "all",
    rejected,
    extraction_source,
    detailed_view
  };
  const { data, isLoading, refetch } = useListMultiInvoiceDocuments(payload);
  const {
    mutate: rejectDocument,
    isPending: rejecting,
    isError: errorRejecting
  } = useRejectMultiInvoiceDocument();
  const {
    mutate: approveDocument,
    isPending: approving,
    isError: errorApproving
  } = useApproveMultiInvoiceDocument();
  const {
    mutate: updateDocument,
    isPending: updating,
    isError: errorUpdating
  } = useUpdateMultiInvoiceDocument();
  useEffect(() => {
    const resValue = formatRestaurantsList(
      restaurantsList && restaurantsList?.data
    )?.find((item) => item.value == restaurant)?.value;
    const vendValue = vendorNamesFormatter(
      vendorNamesList?.data && vendorNamesList?.data?.vendor_names
    )?.find((item) => item.value == vendor)?.value;

    setRestaurantFilter(resValue);
    setVendorFilter(vendValue);
    setVendorNames(vendorNamesList?.data?.vendor_names);
    setVendorsList(vendorNamesList?.data?.vendor_names);
  }, [
    restaurantsList,
    vendorNamesList,
    vendorNamesLoading,
    restaurantsListLoading
  ]);

  const {
    mutate: searchInvoices,
    isPending: searchingInvoices,
    isSuccess
  } = useSearchInvoice();
  function calculateDivHeightInVh(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementHeight = element.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const heightInVh = (elementHeight / viewportHeight) * 100;
      return heightInVh;
    } else {
      console.error("Element not found");
      return null;
    }
  }

  let final =
    calculateDivHeightInVh("maindiv") -
    (calculateDivHeightInVh("bread") +
      calculateDivHeightInVh("vendor-consolidation") +
      calculateDivHeightInVh("div2") +
      calculateDivHeightInVh("div2") +
      calculateDivHeightInVh("pagination") +
      9.5);
  let timer;
  let myData = data?.data?.[0];
  const [totalInvoicePages, setTotalInvoicePages] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const appendFiltersToUrl = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key == "start_date" || key == "end_date") {
          return;
        }
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    appendFiltersToUrl();
  }, []);
  const [checkedIndices, setCheckedIndices] = useState([]);
  const getAllGroupIds = () => {
    const allGroups = [
      ...(myData?.closed_groups || []),
      ...(myData?.open_groups || []),
      ...(myData?.incomplete_groups || [])
    ];
    return allGroups?.map((g) => g?.id);
  };

  const areAllGroupsChecked = () => {
    const allIds = getAllGroupIds();
    return (
      allIds?.length > 0 && allIds?.every((id) => checkedIndices?.includes(id))
    );
  };

  const [currentPageIndex, setCurrentPageIndex] = useState(null);
  const [allIndices, setAllIndices] = useState([]);

  useEffect(() => {
    if (data && allIndices?.length === 0) { // only set once
      const indices = [
        ...(data?.data?.[0]?.closed_groups || []),
        ...(data?.data?.[0]?.open_groups || []),
        ...(data?.data?.[0]?.incomplete_groups || [])
      ].flatMap(it => it?.page_indices);

      setAllIndices(indices);
    }
  }, [data, allIndices.length]);

  let indices = [
    ...(data?.data?.[0]?.closed_groups || []),
    ...(data?.data?.[0]?.open_groups || []),
    ...(data?.data?.[0]?.incomplete_groups || [])
  ].flatMap(it => it?.page_indices)
  const added = indices?.filter(x => !allIndices.includes(x));
  const removed = allIndices?.filter(x => !indices.includes(x));
  const difference = [
    ...added,
    ...removed
  ];


  let all_have_indices = useMemo(() => {
    return [
      ...(data?.data?.[0]?.closed_groups || []),
      ...(data?.data?.[0]?.open_groups || []),
      ...(data?.data?.[0]?.incomplete_groups || [])
    ]?.map(it => it?.page_indices)?.every((it) => it?.length > 0);
  }, [data]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleAddGroup = (group_type) => {
    let copyData = JSON.parse(JSON.stringify(data));
    if (!copyData) return;
    let myData = copyData?.data?.[0];
    let newGroup = {};
    if (group_type !== "open_groups") {
      newGroup = {
        invoice_number: "",
        vendor_name: "",
        page_indices: [],
        id: uuidv4(),
        group_type
      };
      myData[group_type] = [
        ...myData[group_type],
        newGroup
      ];

    } else {
      newGroup = {
        page_indices: [],
        type: "",
        id: uuidv4(),
        group_type
      };
      myData[group_type] = [
        ...myData[group_type],
        newGroup,

      ];
    }

    queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
  }
  // Add id in all the groups
  useEffect(() => {
    if (data && data?.data?.[0]) {
      let copyData = JSON.parse(JSON.stringify(data));
      if (!copyData) return;
      let myData = copyData?.data?.[0];
      myData?.closed_groups?.forEach((group) => {
        if (!group.id) {
          group.id = uuidv4();
          group.group_type = "closed_groups"
        }
      });
      myData?.open_groups?.forEach((group) => {
        if (!group.id) {
          group.id = uuidv4();
          group.group_type = "open_groups"
        }
      });
      myData?.incomplete_groups?.forEach((group) => {
        if (!group.id) {
          group.id = uuidv4();
          group.group_type = "incomplete_groups"
        }
      });

      queryClient.setQueryData(["multi-invoice-documents", payload], copyData);
      setResetTrigger(prev => prev + 1); // Trigger reset to re-render

    }
  }, [data]);
  let action_controls = data?.data?.[0]?.action_controls

  useEffect(() => {
    setAllIndices([]);
    setCurrentPageIndex(null);

  }, [page])
  const checkAllHaveCorrectData = () => {
    // Merge all groups into one array
    const all_groups = [
      ...(data?.data?.[0]?.closed_groups || []),
      ...(data?.data?.[0]?.open_groups || []),
      ...(data?.data?.[0]?.incomplete_groups || [])
    ];
    console.log(all_groups)

    return all_groups?.every(group => {
      if (group?.group_type === "open_groups") {
        // For open groups, check for "type"
        return Boolean(group?.type);
      } else {
        // For closed/incomplete, check invoice_number & vendor
        return Boolean(group?.invoice_number && group?.vendor_name);
      }
    });
  };

  const { mutate: markAsNotSupported, isPending, isError } = useMarkMultipleInvoiceDocumentAsNotSupported()
  const [markAsNotSupportedModal, setMarkAsNotSupportedModal] = useState(false);
  return (
    <div className="!h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full h-full ml-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            title={"Multiple Invoice Document Details"}
            hideTitle={true}
            showCustom={true}
            crumbs={[
              {
                path: null,
                label: "Multiple Invoice Document Details"
              }
            ]}
          >
            {isLoading ? (
              <div className="flex items-center gap-x-2">
                <Skeleton className={"w-44 h-10  mb-1"} />
                {/* <Skeleton className={"w-44 h-10  mb-1"} /> */}
              </div>
            ) : (
              <>
                <div className="flex gap-x-4 items-end ">
                  {myData?.restaurant?.restaurant_id && (
                    <>
                      <div className="flex flex-col gap-y-0">
                        <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                          Restaurant
                        </p>
                        <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                          <span>{myData?.restaurant?.restaurant_name}</span>
                          <img
                            className="h-4 w-4"
                            src={
                             myData?.restaurant?.tier== 1
                                ? tier_1
                                : myData?.restaurant?.tier == 2
                                  ? tier_2
                                  : tier_3
                            }
                            alt=""
                          />
                        </p>
                      </div>
                    </>
                  )}
                  <CustomTooltip
                    className={"!min-w-fit capitalize"}
                    content={`Assigned to ${myData?.assignment_details?.assigned_to?.username
                      ?.split("_")
                      ?.join(" ")} at ${formatDateTimeToReadable(
                        myData?.assignment_details?.assigned_at
                      )}`}
                  >
                    <p
                      className={`mx-2  font-poppins font-normal capitalize text-xs leading-3 ${myData?.status == "verified"
                        ? "bg-primary"
                        : myData?.status == "failed"
                          ? "bg-red-500"
                          : myData?.status == "split and merged"
                            ? "bg-primary"
                            : "bg-[#B28F10]"
                        }  text-[#ffffff] py-1.5  px-3 rounded-xl  cursor-pointer`}
                    >
                      {myData?.status}
                    </p>
                  </CustomTooltip>
                  {myData?.status !== "split and merged" && <span
                    className={`${calculateTimeDifference(
                      new Date(
                        myData?.assignment_details?.verification_due_at
                      )
                    )?.includes("ago")
                      ? "!text-[#F15156]"
                      : "!text-black"
                      } mx-2 bg-gray-200  font-poppins font-normal -mb-0.5 text-xs leading-3 py-1.5    text-[#ffffff]  flex items-center   px-4 rounded-full  `}
                  >
                    <div className="flex items-center gap-x-2 ">
                      {/* <CustomTooltip content={"Due Time"}> */}
                      <Clock className="w-4 h-4" />
                      {/* </CustomTooltip> */}
                      <div>
                        <CustomTooltip
                          className={"mb-2 !min-w-fit capitalize"}
                          content={`Due Time`}
                        >
                          {calculateTimeDifference(
                            new Date(
                              myData?.assignment_details?.verification_due_at
                            )
                          )}
                        </CustomTooltip>
                      </div>
                    </div>
                    {/* </CustomTooltip> */}
                  </span>}
                </div>
              </>
            )}
          </BreadCrumb>
          <div className="mt-4 flex justify-end w-full gap-x-4 mb-3">
            {" "}
            <Sheet
              className="!overflow-auto "
              open={open}
              onOpenChange={() => setOpen(!open)}
            >
              <SheetTrigger>
                {" "}
                <Button
                  className={`bg-transparent hover:bg-transparent p-0 w-[2.5rem] shadow-none border flex items-center justify-center h-[2.5rem] border-[#D9D9D9] rounded-sm dark:bg-[#000000] dark:border-[#000000] ${open ||
                    filters?.human_verified !== "all" ||
                    filters?.human_verification !== "all" ||
                    filters?.invoice_type !== "" ||
                    filters?.start_date !== "" ||
                    filters?.end_date !== "" ||
                    filters?.clickbacon_status !== "" ||
                    filters?.auto_accepted !== ""
                    ? "!bg-primary !text-white"
                    : "!bg-white"
                    }   `}
                >
                  <Filter
                    className={`${open ||
                      filters?.human_verified !== "all" ||
                      filters?.human_verification !== "all" ||
                      filters?.invoice_type !== "" ||
                      filters?.start_date !== "" ||
                      filters?.end_date !== "" ||
                      filters?.clickbacon_status !== "" ||
                      filters?.auto_accepted !== ""
                      ? "!text-white"
                      : ""
                      } h-5  text-black/40 dark:text-white/50`}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent className="min-w-fit !max-w-[20rem] !overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div
                      id="invoice-filters"
                      className="flex justify-between items-center"
                    >
                      <p>Filters</p>
                      <div
                        className="flex items-center gap-x-2 cursor-pointer"
                        onClick={() => setOpen(!open)}
                      >
                        <p className="text-sm font-poppins font-normal text-[#000000]">
                          Collapse
                        </p>
                        <ArrowRight className="h-4 w-4 text-[#000000]" />
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <InvoiceFilters />
              </SheetContent>
            </Sheet>
            <CustomTooltip content={"Click to Copy The Link."}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/multi-invoice-documents/${data?.data?.[0]?.document_uuid}`
                  );
                  toast.success("Link copied to clipboard");
                }}
                // disabled={markingForReview}
                className="bg-transparent h-[2.4rem] border-primary w-[3rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                <Share2 className="dark:text-white" />
              </Button>
            </CustomTooltip>
            <CustomTooltip className={"!min-w-fit"} content={action_controls?.mark_as_unsupported?.disabled ? action_controls?.mark_as_unsupported?.reason : "Click to Mark this document as Not Supported."}>
              <Button

                onClick={() => setMarkAsNotSupportedModal(true)}
                disabled={action_controls?.mark_as_unsupported?.disabled}
                className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[7.25rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                Not Supported
              </Button>
            </CustomTooltip>
            <CustomTooltip
              className={"!min-w-fit"}
              content={
                action_controls?.reject?.disabled ? action_controls?.reject?.reason : difference?.length !== 0 ? "Some Page Indices are missing." : !all_have_indices ? "Some groups are without page indices." : !areAllGroupsChecked()
                  ? "Check all the checkboxes in all groups to mark as Single Invoice Document." : ""

              }
            >
              <Button
                onClick={() => {
                  setShowRejectModal(true);

                }}
                disabled={action_controls?.reject?.disabled || !areAllGroupsChecked() || difference?.length !== 0 || !all_have_indices}
                className="bg-transparent min-w-[6.5rem] max-w-fit dark:text-white h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                {rejecting && !errorRejecting ? "Marking..." : "Mark as Single Invoice"}
              </Button>
            </CustomTooltip>
            <CustomTooltip
              className={"!min-w-fit"}
              content={
                action_controls?.approve?.disabled ? action_controls?.approve?.reason : difference?.length !== 0 ? "Some Page Indices are missing." : !all_have_indices ? "Some groups are without page indices." : !areAllGroupsChecked()
                  ? "Check all the checkboxes in all groups to approve the document." : !checkAllHaveCorrectData() ? "Vendor Name or Invoice Number or Type is missing in some groups." : ""
              }
            >
              <Button
                onClick={() => {

                  setShowApproveModal(true);

                }}
                disabled={action_controls?.approve?.disabled || !checkAllHaveCorrectData() || !areAllGroupsChecked() || difference?.length !== 0 || !all_have_indices}
                className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                {approving && !errorApproving ? "Approving..." : "Approve"}
              </Button>
            </CustomTooltip>
            <CustomTooltip
              className={"!min-w-fit"}
              content={
                action_controls?.save?.disabled ? action_controls?.save?.reason : difference?.length !== 0 ? "Some Page Indices are missing." : !all_have_indices ? "Some groups are without page indices." : !areAllGroupsChecked()
                  ? "Check all the checkboxes in all groups to save the document." : !checkAllHaveCorrectData() ? "Vendor Name or Invoice Number or Type is missing in some groups." : ""
              }

            >
              <Button
                onClick={() => {
                  updateDocument(
                    {
                      document_uuid: data?.data?.[0]?.document_uuid,
                      data: {
                        closed_groups: data?.data?.[0]?.closed_groups,
                        incomplete_groups: data?.data?.[0]?.incomplete_groups,
                        open_groups: data?.data?.[0]?.open_groups
                      }
                    },
                    {
                      onSuccess: () => {
                        setResetTrigger((prev) => prev + 1);
                      }
                    }
                  );
                }}
                disabled={action_controls?.save?.disabled || !checkAllHaveCorrectData() || !areAllGroupsChecked() || difference?.length !== 0 || !all_have_indices}
                className="font-poppins h-[2.4rem] dark:text-white font-normal text-sm w-[6.5rem] leading-5 border-2 border-primary text-[#ffffff]"
              >
                {updating && !errorUpdating ? "Saving..." : "Save"}
              </Button>
            </CustomTooltip>
          </div>
          <div className="w-full flex  pt-4 ">
            <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
              <PdfViewer
                className={"w-[45rem]"}
                setCurentPage={setCurrentPageIndex}
                payload={payload}
                setTotalPages={setTotalInvoicePages}
                loadinMetadata={isLoading}
                pdfUrls={[
                  {
                    document_uuid: myData?.document_uuid,
                    document_source: myData?.document_source,
                    document_link: myData?.document_link
                  }
                ]}
                multiple={false}
                currentPage={currentPageIndex}
              />
              {
                <InvoicePagination
                  totalPages={data?.total_pages}
                  currentTab={""}
                  setCurrentTab={() => { }}
                />
              }
            </div>
            <div className="w-1/2">
              {isLoading ? (
                <Skeleton className={"max-w-[50rem]  h-[38.25rem] mt-8"} />
              ) : myData?.status == "in progress" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex items-center gap-x-4">
                    <Loader />
                    <span className="font-poppins font-medium text-sm text-black">
                      Extracting multiple invoice data from the document.
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-x-2 mb-4">
                    <p className="font-poppins font-medium text-sm text-black">
                      Page Indices :
                    </p>
                    <div className="flex items-center gap-x-2">
                      {allIndices?.sort((a, b) => a - b)?.map((i) => {
                        return (
                          <span className={`${(difference?.includes(i)) && "text-red-500"} text-sm font-poppins font-medium`}>
                            {i}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {/* -------------------------------------------------------------------Closed Groups--------------------------------------------- */}

                  <div>
                    <CustomAccordion
                      title={`Closed Groups (${myData?.closed_groups?.length})`}
                      className="!rounded-sm  !shadow-none border !text-sm w-full"
                      triggerClassName="!text-sm"
                      contentClassName={"px-4 py-3"}
                      triggerButtons={<>
                        <CustomTooltip content={"Add New Group"}>

                          <Button
                            className="rouned-sm h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddGroup("closed_groups");
                            }}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </CustomTooltip>

                      </>}
                    >
                      <div className="flex flex-col gap-y-1  max-h-[22.5rem]  overflow-auto">
                        {myData?.closed_groups?.map((group, groupIdx) => (
                          <InvoiceGroupAccordion
                            key={groupIdx}
                            data={data}
                            group={group}
                            payload={payload}
                            f_key={"closed_groups"}
                            pagesCount={totalInvoicePages}
                            resetTrigger={resetTrigger}
                            checkedIndices={checkedIndices}
                            setCheckedIndices={setCheckedIndices}
                            setCurrentPageIndex={setCurrentPageIndex}
                          />
                        ))}
                      </div>
                    </CustomAccordion>
                  </div>

                  {/* -------------------------------------------------------------------Incomplete Groups--------------------------------------------- */}

                  <div className=" pt-4 ">
                    <CustomAccordion
                      title={`Incomplete Groups (${myData?.incomplete_groups?.length})`}
                      className="!rounded-sm  !shadow-none border !text-sm w-full"
                      triggerClassName="!text-sm"
                      contentClassName={"px-4 py-3"}
                      triggerButtons={<>
                        <CustomTooltip content={"Add New Group"}>

                          <Button
                            className="rouned-sm h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddGroup("incomplete_groups");
                            }}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>

                        </CustomTooltip>
                      </>}
                    >
                      <div className="flex flex-col gap-y-1  max-h-[22.5rem]  overflow-auto">
                        {myData?.incomplete_groups?.map((group, groupIdx) => (
                          <InvoiceGroupAccordion
                            key={groupIdx}
                            data={data}
                            group={group}
                            payload={payload}
                            f_key={"incomplete_groups"}
                            pagesCount={totalInvoicePages}
                            resetTrigger={resetTrigger}
                            checkedIndices={checkedIndices}
                            setCheckedIndices={setCheckedIndices}
                            setCurrentPageIndex={setCurrentPageIndex}
                          />
                        ))}
                      </div>
                    </CustomAccordion>
                  </div>

                  {/* -------------------------------------------------------------------Open Groups--------------------------------------------- */}

                  <div className=" pt-4 ">
                    <CustomAccordion
                      title={`Open Groups (${myData?.open_groups?.length})`}
                      className="!rounded-sm  !shadow-none border !text-sm w-full"
                      triggerClassName="!text-sm"
                      triggerButtons={<>

                        <CustomTooltip content={"Add New Group"}>

                          <Button
                            className="rouned-sm h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddGroup("open_groups");
                            }}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </CustomTooltip>
                      </>}

                      contentClassName={"px-4 py-3"}
                    >
                      <div className="flex flex-col gap-y-1  max-h-[22.5rem]  overflow-auto">
                        {myData?.open_groups?.map((group, groupIdx) => (
                          <InvoiceGroupAccordion
                            key={groupIdx}
                            data={data}
                            group={group}
                            payload={payload}
                            f_key={"open_groups"}
                            pagesCount={totalInvoicePages}
                            resetTrigger={resetTrigger}
                            checkedIndices={checkedIndices}
                            setCheckedIndices={setCheckedIndices}
                            setCurrentPageIndex={setCurrentPageIndex}
                          />
                        ))}
                      </div>
                    </CustomAccordion>
                  </div>

                </>
              )}
            </div>
          </div>
        </Layout>
      </div>

      <Modal
        open={showRejectModal}
        setOpen={setShowRejectModal}
        title={"Mark As Not Multiple Invoice Document"}
        titleClassName={"font-poppins font-semibold text-lg text-black"}
      >

        <ModalDescription className="font-poppins font-medium text-black text-sm ">
          <p className="font-poppins font-medium text-black/70 text-sm">This document will be marked as a single invoice. Its data will be extracted accordingly and it will be moved to the Invoice section.</p>
        </ModalDescription>
        <div className="flex items-center justify-end gap-x-4 mt-4">
          <Button
            onClick={() => setShowRejectModal(false)}
            className="bg-transparent hover:bg-transparent border-2 border-[#D9D9D9] text-[#000000] font-poppins font-normal text-sm h-[2.4rem] w-[6.5rem]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // First Save 

              rejectDocument(data?.data?.[0]?.document_uuid, {
                onSuccess: () => {
                  queryClient.invalidateQueries(["multi-invoice-documents", payload]);
                  setShowRejectModal(false);
                }
              });
            }}
            disabled={!areAllGroupsChecked() || difference?.length !== 0 || !all_have_indices}
            className="bg-red-500 text-white font-poppins hover:bg-red-500 font-normal text-sm h-[2.4rem] min-w-[6.5rem] max-w-fit"
          >
            {rejecting && !errorRejecting ? "Marking..." : "Mark As Single Invoice"}
          </Button>
        </div>

      </Modal>
      <Modal
        open={showApproveModal}
        setOpen={setShowApproveModal}
        title={"Approve Document"}
        titleClassName={"font-poppins font-semibold text-lg text-black"}
      >
        <ModalDescription className="font-poppins font-medium text-black text-sm ">
          <p className="font-poppins font-medium text-black/70 text-sm">This action is permanent. The document will be split and merged according to the provided data, and you won’t be able to undo it.</p>
        </ModalDescription>
        <div className="flex items-center justify-end gap-x-4 mt-4">
          <Button
            onClick={() => setShowApproveModal(false)}
            className="bg-transparent hover:bg-transparent border-2 border-[#D9D9D9] text-[#000000] font-poppins font-normal text-sm h-[2.4rem] w-[6.5rem]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateDocument(
                {
                  document_uuid: data?.data?.[0]?.document_uuid,
                  data: {
                    closed_groups: data?.data?.[0]?.closed_groups,
                    incomplete_groups: data?.data?.[0]?.incomplete_groups,
                    open_groups: data?.data?.[0]?.open_groups
                  }
                },
                {
                  onSuccess: () => {
                    approveDocument(data?.data?.[0]?.document_uuid, {
                      onSuccess: () => {
                        queryClient.invalidateQueries(["multi-invoice-documents", payload]);
                        setShowApproveModal(false);
                      }
                    });
                  }
                }
              );

            }}
            disabled={!areAllGroupsChecked() || difference?.length !== 0 || !all_have_indices}
            className="bg-primary text-white font-poppins hover:bg-primary font-normal text-sm h-[2.4rem] w-[6.5rem]"
          >
            {approving && !errorApproving ? "Approving..." : "Approve"}
          </Button>
        </div>

      </Modal>
      <Modal
        open={markAsNotSupportedModal}
        showXicon={true}
        className={"max-w-[25rem] !rounded-xl"}
        setOpen={setMarkAsNotSupportedModal}
      >
        <ModalDescription>
          <div className="w-full flex  flex-col justify-center h-full items-center  ">
            <img src={warning} alt="" className="h-16 w-16 mb-2 mt-4" />
            <p className="font-poppins font-semibold text-base leading-6  text-[#000000]">
              Warning
            </p>
            <p className="px-8 !text-center mt-2 text-[#666667] font-poppins font-normal  text-sm leading-4">
              Are you sure to mark this document as Not Supported ?
            </p>
            <div className="flex items-center gap-x-4 mb-4 mt-8">
              <Button
                onClick={() => setMarkAsNotSupportedModal(false)}
                className="rounded-sm !w-[4.5rem] !font-poppins bg-transparent border border-primary shadow-none text-[#000000] font-normal text-xs hover:bg-transparent"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  markAsNotSupported(
                    data?.data?.document_uuid ||
                    data?.data?.[0]?.document_uuid,
                    {
                      onSuccess: () => {
                        setMarkAsNotSupportedModal(false);
                        queryClient.invalidateQueries('multi-invoice-documents')
                      }
                    }
                  );
                }}
                disabled={isPending && !isError}
                className="rounded-sm !w-[4.5rem] !font-poppins text-xs font-normal"
              >
                {isPending && !isError ? "Marking..." : "Yes"}
              </Button>
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default MultiInvoiceDocumentsDetails;
