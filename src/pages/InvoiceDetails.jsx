import approved from "@/assets/image/approved.svg";
import warning from "@/assets/image/warning.svg";
import tier_1 from "@/assets/image/tier_1.svg";
import tier_2 from "@/assets/image/tier_2.svg";
import tier_3 from "@/assets/image/tier_3.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import copy from "@/assets/image/copy.svg";

import {
  useFindDuplicateInvoices,
  useGetDocumentNotes,
  useGetSimilarBranches,
  useGetSimilarVendors,
  useMarkAsNotSupported,
  useMarkReviewLater,
  useReprocessDocument,
  useRevertChanges,
  useUpdateDocumentMetadata,
  useUpdateDocumentTable
} from "@/components/invoice/api";
import CategoryWiseSum from "@/components/invoice/CategoryWiseSum";
import InvoicePagination from "@/components/invoice/InvoicePagination";
import LastUpdateInfo from "@/components/invoice/LastUpdateInfo";
import Tables from "@/components/invoice/Tables/Tables";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { Label } from "@/components/ui/label";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateTimeDifference,
  formatDateTime,
  formatDateToReadable,
  formatRestaurantsList,
  vendorNamesFormatter
} from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";

import review_later_white from "@/assets/image/review_later_white.svg";
import review_later_black from "@/assets/image/review_later_black.svg";
import all_invoices_black from "@/assets/image/all_invoices_black.svg";
import all_invoices_white from "@/assets/image/all_invoices_white.svg";
import not_supported_white from "@/assets/image/not_supported_white.svg";
import not_supported_black from "@/assets/image/not_supported_black.svg";
import my_tasks_white from "@/assets/image/check_book_white.svg";
import my_tasks_black from "@/assets/image/check_book_black.svg";
import book_user_white from "@/assets/image/book_user_white.svg";
import book_user_black from "@/assets/image/book_user_black.svg";
import { useListRestaurants } from "@/components/home/api";
import InvoiceFilters from "@/components/invoice/InvoiceFilters";
import { useInvoiceStore } from "@/components/invoice/store";
import CustomDropDown from "@/components/ui/CustomDropDown";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useGetVendorNames, useGetVendorNotes } from "@/components/vendor/api";
import DocumentNotes from "@/components/vendor/notes/DocumentNotes";
import VendorNotes from "@/components/vendor/notes/VendorNotes";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import persistStore from "@/store/persistStore";
import useThemeStore from "@/store/themeStore";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Filter,
  Info,
  Menu,
  NotebookTabs,
  Share2,
  Table2,
  TextSelect,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import CustomToolTip from "@/components/ui/CustomToolTip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import userStore from "@/components/auth/store/userStore";
import ResizableModal from "@/components/ui/Custom/ResizeableModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import flagged_white from "@/assets/image/flagged_white.svg";
import flagged_black from "@/assets/image/flagged_black.svg";
// import book_user_white from "@/assets/image/book_user_white.svg";
// import book_user_black from "@/assets/image/book_user_black.svg";
import { useGetSidebarCounts } from "@/components/common/api";
import useSidebarStore from "@/store/sidebarStore";
const rejectionReasons = [
  "Duplicate invoice",
  "Multiple invoices in one PDF",
  "Multiple invoices on a page",
  "Invoice details unclear",
  "Total amount unclear",
  "Vendor not identifiable",
  "Missing invoice page"
];

const InvoiceDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState({});
  const { role } = userStore();
  const updateParams = useUpdateParams();
  const [currentTab, setCurrentTab] = useState("metadata");
  const [markForReviewModal, setMarkForReviewModal] = useState(false);
  const [markAsNotSupportedModal, setMarkAsNotSupportedModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [reviewLaterComments, setReviewLaterComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAlreadySyncedModal, setShowAlreadySyncedModal] = useState(false);
  const [clickedOnAcceptButton, setClickedOnAcceptButton] = useState(false);
  const [
    showSimilarVendorsAndBranchesWarningModal,
    setShowSimilarVendorsAndBranchesWarningModal
  ] = useState(false);
  const [showDuplicateInvoicesModal, setShowDuplicateInvoicesModal] =
    useState(false);
  const [showDuplicateInvoicesWarning, setShowDuplicateInvoicesWarning] =
    useState(false);
  let document_uuid =
    searchParams.get("document_uuid") || searchParams.get("document");
  const {
    updatedFields,
    branchChanged,
    vendorChanged,
    clearUpdatedFields,
    metaData,
    operations,
    setOperations,
    setBranchChanged,
    setVendorChanged,
    metadata,
    setHistory,
    is_unverified_vendor,
    current_document_uuid,
    warning_checkbox_checked,
    setWarningCheckboxChecked,
    is_unverified_branch,
    clearStore,
    tableData,
    loadingMetadata
  } = invoiceDetailStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({
    saving: false,
    rejecting: false,
    accepting: false,
    markingForReview: false,
    markingAsNotSupported: false,
    reverting: false,
    reprocessing: false
  });

  const { data: similarVendors, isLoading: loadingSimilarVendors } =
    useGetSimilarVendors({
      toFetch: is_unverified_vendor,
      document_uuid: current_document_uuid
    });

  const { data: similarBranches, isLoading: loadingSimilarBranches } =
    useGetSimilarBranches(metaData?.document_uuid);

  useEffect(() => {
    if (
      (is_unverified_vendor && similarVendors?.data?.length > 0) ||
      (similarBranches?.data?.length > 0 && is_unverified_branch)
    ) {
      setShowSimilarVendorsAndBranchesWarningModal(true);
    }
  }, [similarVendors, similarBranches]);
  const { filters, setFilters } = useFilterStore();
  const { mutate: updateTable } = useUpdateDocumentMetadata();
  const { mutate: markForReview, isPending: markingForReview } =
    useMarkReviewLater();
  const { mutate: saveDocumentTable } = useUpdateDocumentTable();
  const { mutate: markAsNotSupported } = useMarkAsNotSupported();
  const { selectedInvoiceVendorName, selectedInvoiceRestaurantName } =
    globalStore();
  const [showAgentValidation, setShowAgentValidation] = useState(false);

  useEffect(() => {
    if (metaData?.metadata_validation_status !== "unassigned") {
      setShowAgentValidation(true);
    }
  }, [metaData]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const { data: duplicateInvoices } = useFindDuplicateInvoices(
    data?.data?.document_uuid || data?.data?.[0]?.document_uuid
  );

  const appendFiltersToUrl = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    appendFiltersToUrl();
  }, []);

  const handleSave = () => {
    if (Object?.keys(updatedFields)?.length == 0 && operations?.length == 0) {
      return toast("No Fields Updated..", {
        icon: "⚠️"
      });
    }
    if (currentTab == "metadata" && updatedFields) {
      setLoadingState({ ...loadingState, saving: true });
      updateTable(
        {
          document_uuid:
            data?.data?.[0]?.document_uuid || data?.data?.document_uuid,
          data: updatedFields
        },
        {
          onSuccess: () => {
            setLoadingState({ ...loadingState, saving: false });
            queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
            queryClient.invalidateQueries({ queryKey: ["duplicate-invoices"] });
            clearUpdatedFields();
            setBranchChanged(false);
            setVendorChanged(false);
          },
          onError: () => {
            setLoadingState({ ...loadingState, saving: false });
          }
        }
      );
    } else if (currentTab == "human-verification") {
      setLoadingState({ ...loadingState, saving: true });
      if (Object.keys(updatedFields)?.length > 0) {
        updateTable(
          {
            document_uuid:
              data?.data?.[0]?.document_uuid || data?.data?.document_uuid,
            data: updatedFields
          },
          {
            onSuccess: () => {
              setLoadingState({ ...loadingState, saving: false });
              queryClient.invalidateQueries({
                queryKey: ["document-metadata"]
              });
              queryClient.invalidateQueries({
                queryKey: ["duplicate-invoices"]
              });
              clearUpdatedFields();
              setBranchChanged(false);
              setVendorChanged(false);
            },
            onError: () => {
              setLoadingState({ ...loadingState, saving: false });
            }
          }
        );
      }
      if (operations?.length > 0) {
        saveDocumentTable(
          { document_uuid: metaData?.document_uuid, data: operations },
          {
            onSuccess: () => {
              setLoadingState({ ...loadingState, saving: false });
              setOperations([]);

              setHistory([]);
              queryClient.invalidateQueries({
                queryKey: ["duplicate-invoices"]
              });
              queryClient.invalidateQueries({ queryKey: ["combined-table"] });
              queryClient.invalidateQueries({ queryKey: ["additional-data"] });
              // queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
              // setCombinedTableCopy({});
              // if (!refreshed) {
              //   refreshed = true;
              //   window.location.reload();
              // }
            },

            onError: () => setLoadingState({ ...loadingState, saving: false })
          }
        );
      }
    }
  };

  const handleRejection = () => {
    setLoadingState({ ...loadingState, rejecting: true });
    let payload = {};
    payload["rejected"] = true;

    payload["rejection_reason"] = rejectionReason;
    updateTable(
      {
        document_uuid: metaData?.document_uuid,
        data: { ...payload, ...updatedFields }
      },
      {
        onSuccess: () => {
          setLoadingState({ ...loadingState, rejecting: false });
          // queryClient.invalidateQueries({ queryKey: ["combined-table"] });
          setRejectionReason("");
          setShowRejectionModal(false);
          queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
        },
        onError: () => setLoadingState({ ...loadingState, rejecting: false })
      }
    );
    if (operations?.length !== 0) {
      setLoadingState({ ...loadingState, saving: true });

      saveDocumentTable(
        { document_uuid: metaData?.document_uuid, data: operations },
        {
          onSuccess: () => {
            setLoadingState({ ...loadingState, saving: false });
            setOperations([]);

            setRejectionReason("");
            setHistory([]);
            setShowRejectionModal(false);
            queryClient.invalidateQueries({ queryKey: ["combined-table"] });
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
            queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
            // setCombinedTableCopy({});
          },

          onError: () => setLoadingState({ ...loadingState, saving: false })
        }
      );
    }
  };

  const handleAccept = () => {
    const selectedColumnIds = tableData?.data?.processed_table?.rows
      ?.filter((f) => f?.selected_column)
      ?.map(
        ({ column_name, column_order, selected_column, ...rest }) =>
          rest?.column_uuid
      );

    const hasUnknown = tableData?.data?.processed_table?.rows?.some((r) =>
      r.cells?.some(
        (cell) =>
          cell?.text === "Unknown" &&
          selectedColumnIds?.includes(cell?.column_uuid)
      )
    );

    if (hasUnknown && metaData?.invoice_type !== "Summary Invoice") {
      return toast.error("There is Unknown Category in the table");
    }

    if (
      operations
        ?.filter((it) => it?.type == "update_cell")
        ?.find((it) => it?.data?.text == "Unknown")?.data?.text &&
      metaData?.invoice_type !== "Summary Invoice"
    ) {
      return toast.error("There is Unknown Category in the table");
    }
    setLoadingState({ ...loadingState, saving: true });
    metaData["human_verified"] = true;
    updateTable(
      {
        document_uuid: metaData?.document_uuid,
        data: { human_verified: true, ...updatedFields }
      },
      {
        onSuccess: () => {
          setLoadingState({ ...loadingState, saving: false });
          queryClient.invalidateQueries({ queryKey: ["combined-table"] });
          queryClient.invalidateQueries({ queryKey: ["document-metadata"] });

          clearUpdatedFields();
          setShowAcceptModal(false);
        },
        onError: () => {
          setLoadingState({ ...loadingState, saving: false });
          queryClient.invalidateQueries({ queryKey: ["combined-table"] });
        }
      }
    );
    if (operations?.length !== 0) {
      setLoadingState({ ...loadingState, saving: true });

      saveDocumentTable(
        { document_uuid: metaData?.document_uuid, data: operations },
        {
          onSuccess: () => {
            setLoadingState({ ...loadingState, saving: false });
            setOperations([]);

            setHistory([]);
            queryClient.invalidateQueries({ queryKey: ["combined-table"] });
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
            queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
            // setCombinedTableCopy({});
          },

          onError: () => setLoadingState({ ...loadingState, saving: false })
        }
      );
    }
    setLoadingState({ ...loadingState, saving: true });
  };

  let action_controls =
    data?.data?.[0]?.action_controls || data?.data?.action_controls;

  useEffect(() => {
    setShowDuplicateInvoicesWarning(false);
    if (duplicateInvoices?.duplicate_count > 0) {
      setShowDuplicateInvoicesWarning(true);
    }
  }, [duplicateInvoices]);
  const myData = data?.data?.[0] || data?.data;
  const { pathname } = useLocation();
  const { theme } = useThemeStore();

  const { data: vendorNotes, isLoading: loadingVendorNotes } =
    useGetVendorNotes(
      data?.data?.vendor?.vendor_id || data?.data?.[0]?.vendor?.vendor_id
    );
  const { data: documentNotes, isLoading: loadingDocumentNotes } =
    useGetDocumentNotes(
      data?.data?.document_uuid || data?.data?.[0]?.document_uuid
    );

  const [showWarningForBranchAndVendor, setShowWarningForBranchAndVendor] =
    useState(true);

  useEffect(() => {
    if (branchChanged || vendorChanged) {
      setShowWarningForBranchAndVendor(true);
    }
  }, [branchChanged, vendorChanged]);

  const navigate = useNavigate();
  let page_number = searchParams.get("page_number");
  let from_view = searchParams.get("from_view");
  const { data: restaurantsList, isLoading: restaurantsListLoading } =
    useListRestaurants();
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
  const {
    setRestaurantFilter,
    setVendorFilter,
    vendorFilterValue,
    restaurantFilterValue,
    setVendorNames
  } = useInvoiceStore();
  const { setDefault } = useFilterStore();
  useEffect(() => {
    const resValue = formatRestaurantsList(
      restaurantsList && restaurantsList?.data
    )?.find((item) => item?.value == restaurant)?.value;
    const vendValue = vendorNamesFormatter(
      vendorNamesList?.data && vendorNamesList?.data?.vendor_names
    )?.find((item) => item?.value == vendor)?.value;

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
  const [open, setOpen] = useState(false);
  const { setVendorNames: setVendorsList } = persistStore();

  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  useEffect(() => {
    if (data?.data?.rejected || data?.data?.[0]?.rejected) {
      setShowAlreadySyncedModal(true);
      return;
    }
    if (
      action_controls?.accept?.disabled ||
      action_controls?.reject?.disabled
    ) {
      setShowAlreadySyncedModal(true);
    }
  }, [action_controls, data]);

  // const { filters } = useFilterStore();
  let page = searchParams.get("page_number") || 1;
  let vendor_id = searchParams.get("vendor") || "";
  // let document_uuid = searchParams.get("document_uuid") || "";
  let layout = searchParams.get("layout") || null;
  let extraction_source = searchParams.get("extraction_source") || "all";
  let assigned_to = searchParams.get("assigned_to");

  let payload = {
    page: page,
    page_size: filters?.page_size,
    invoice_type: filters?.invoice_type,
    invoice_detection_status: filters?.invoice_detection_status,
    rerun_status: filters?.rerun_status,
    auto_accepted: filters?.auto_accepted,
    start_date: filters?.start_date,
    end_date: filters?.end_date,
    clickbacon_status: filters?.clickbacon_status,
    human_verification: filters?.human_verification,
    sort_order: filters?.sort_order,
    restaurant: filters?.restaurant,
    human_verified: filters?.human_verified,
    vendor_id,
    document_uuid,
    assigned_to,
    auto_accepted_by_vda: filters?.auto_accepted_by_vda,
    review_later: filters?.review_later || "false",
    from_view: from_view?.includes("not-supported")
      ? "not-supported-documents"
      : "",
    extraction_source
  };

  useEffect(() => {
    setShowAlreadySyncedModal(false);
    setWarningCheckboxChecked(false);
    setShowSimilarVendorsAndBranchesWarningModal(false);
    setShowAcceptModal(false);
    clearStore();
  }, [page_number]);

  const { mutate: revertChanges } = useRevertChanges();
  let rest_tier =
    data?.data?.restaurant?.tier ||
    data?.data?.[0]?.restaurant?.tier ||
    data?.data?.restaurant?.tier ||
    data?.data?.[0]?.restaurant?.tier;
  const [showAiNotesModal, setShowAiNotesModal] = useState(false);
  const [reprocessingModal, setShowReprocessingModal] = useState(false);
  const [reExtractionMethod, setReExtractionMethod] = useState(null);
  const { mutate: reprocessDocument } = useReprocessDocument();
  const [reprocessedData, setReprocessedData] = useState({});
  const [shoeReferenceLinkModal, setShowReferenceLinkModal] = useState(false);
  let linkModalTimer;
  const { data: sideBarCounts } = useGetSidebarCounts({
    invoice_type: filters?.invoice_type,
    start_date: filters?.start_date,
    end_date: filters?.end_date,
    clickbacon_status: filters?.clickbacon_status,
    restaurant: filters?.restaurant,
    auto_accpepted: filters?.auto_accepted,
    rerun_status: filters?.rerun_status,
    invoice_detection_status: filters?.invoice_detection_status,
    human_verified: filters?.human_verified,
    human_verification_required: filters?.human_verification,
    vendor: filters?.vendor,
    sort_order: filters?.sort_order,
    restaurant_tier: filters?.restaurant_tier,
    rejected: filters?.rejected,
    extraction_source: filters?.extraction_source
  });
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { expanded, setExpanded } = useSidebarStore();

  const options = [
    {
      path: "/home",
      text: "All Invoices",
      image: theme === "light" ? all_invoices_black : all_invoices_white,
      hoverImage: all_invoices_white,
      count: sideBarCounts?.all_invoices
    },
    {
      path: "/flagged-invoices",
      text: "All Flagged Documents",
      image: theme === "light" ? flagged_black : flagged_white,
      hoverImage: flagged_white,
      count: sideBarCounts?.all_flagged_documents
    },
    {
      path: "/my-tasks",
      text: "My Tasks",
      image: theme === "light" ? my_tasks_black : my_tasks_white,
      hoverImage: my_tasks_white,
      count:
        sideBarCounts?.my_tasks?.invoices +
        sideBarCounts?.my_tasks?.flagged_documents,
      children: [
        {
          path: "/my-tasks",
          text: "Invoices",
          count: sideBarCounts?.my_tasks?.invoices
        },
        {
          path: "/unsupported-documents",
          text: "Flagged Documents",
          count: sideBarCounts?.my_tasks?.flagged_documents
        }
      ]
    },
    {
      path: "/review-later-tasks",
      text: "Review Later Invoices",
      image: theme === "light" ? review_later_black : review_later_white,
      hoverImage: review_later_white,
      count: sideBarCounts?.review_later
    },
    {
      path: "/not-supported-documents",
      text: "Not Supported Documents",
      image: theme === "light" ? not_supported_black : not_supported_white,
      hoverImage: not_supported_white,
      count: sideBarCounts?.not_supported
    },
    {
      path: null,
      text: "Vendor Consolidation",
      image: theme === "light" ? book_user_black : book_user_white,
      hoverImage: book_user_white
    }
  ];
  useEffect(() => {
    const matchingIndex = options.findIndex((option) =>
      option.children?.some((child) => child.path === pathname)
    );
    if (matchingIndex !== -1) {
      setOpenSubmenu(matchingIndex);
    }
  }, [pathname]);

  const handleToggle = (index, hasChildren) => {
    if (hasChildren) {
      setOpenSubmenu(openSubmenu === index ? null : index);
    } else {
      setOpenSubmenu(null);
    }
  };

  return (
    <div className="hide-scrollbar relative">
      {/* <div> */}{" "}
      <ResizableModal
        title={"AI Notes"}
        y={50}
        x={500}
        width={200}
        isOpen={showAiNotesModal}
        onClose={() => {
          setShowAiNotesModal(false);
        }}
      >
        <span className="font-poppins font-semibold p-2 text-base">
          AI Notes
        </span>
        <div className="flex flex-col gap-y-4 max-h-96 overflow-auto my-4">
          {metaData?.ai_notes?.length > 0 &&
            metaData?.ai_notes?.map(({ note_type, note, created_at }) => {
              return (
                <div key={note} className="bg-accent rounded-md z-10 px-2">
                  <div className="w-96">
                    <p className="font-poppins font-semibold flex items-center justify-between capitalize text-sm border-b py-2">
                      <span> {note_type} </span>
                      <img
                        src={copy}
                        alt="copy icon"
                        onClick={() => {
                          navigator.clipboard.writeText(note_type);
                          toast.success("Note Type copied to clipboard");
                        }}
                        className=" cursor-pointer h-4  z-50"
                      />
                    </p>
                    <p className="max-w-96 font-poppins flex items-start justify-between font-medium text-xs mt-1 leading-5">
                      <span> {note}</span>
                      <img
                        src={copy}
                        alt="copy icon"
                        onClick={() => {
                          navigator.clipboard.writeText(note);
                          toast.success("Note copied to clipboard");
                        }}
                        className=" cursor-pointer h-4  z-50"
                      />
                    </p>
                    <p className="max-w-96 font-poppins font-medium text-xs mt-1.5 text-end leading-5">
                      {formatDateToReadable(created_at)}{" "}
                      {created_at?.split(".")?.[0]?.split("T")?.[1]}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </ResizableModal>
      <Navbar />
      <Sheet>
        <SheetTrigger asChild>
          <div
            onClick={() => {
              setExpanded(!true);
            }}
            className={`bg-primary w-5 h-5 rounded-r-sm cursor-pointer  fixed  mt-1  top-16 left-0 !z-50 flex justify-center items-center 
          ${false ? "opacity-0" : "opacity-100"}
          transition-opacity duration-300 ease-in-out`}
          >
            <ChevronRight className="text-white h-3.5 w-3.5" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="px-0 !max-w-[300px] pt-8 ">
          <SheetClose
            asChild
            onClick={() => {
              setExpanded(!false);
            }}
          >
            <Menu className="h-5 w-5 cursor-pointer absolute right-4 top-2  text-end text-[#000000] " />
          </SheetClose>

          <div className=" space-y-2 flex flex-col">
            {options?.map((option, index) => {
              const isActive =
                pathname === option?.path ||
                option.children?.some((child) => child?.path === pathname);
              const isSubmenuOpen = openSubmenu === index;
              const hasChildren = option?.children?.length > 0;

              const handleClick = (e) => {
                if (hasChildren) {
                  e.preventDefault();
                  if (!expanded) {
                    setExpanded(true);
                    setTimeout(() => handleToggle(index, true), 150);
                  } else {
                    handleToggle(index, true);
                  }
                } else {
                  if (pathname === option?.path) {
                    e.preventDefault();
                    return;
                  }
                  setDefault();
                }
              };

              const Wrapper = option?.path ? Link : "div";

              return (
                <div
                  key={index}
                  className={`${
                    role !== "admin" &&
                    option?.text === "Not Supported Documents" &&
                    "hidden"
                  }`}
                >
                  <Wrapper
                    to={option.path || "#"}
                    onClick={handleClick}
                    className={`group cursor-pointer flex  items-center px-4 gap-2 py-3 text-sm font-normal transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-black hover:bg-primary hover:text-white"
                    }`}
                  >
                    <div className="relative flex-shrink-0 w-5 h-5">
                      <img
                        src={option?.image}
                        alt={option?.text}
                        className="absolute inset-0 w-full h-full transition-opacity duration-300"
                      />
                      <img
                        src={option?.hoverImage}
                        alt={option?.text}
                        className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? "opacity-100" : ""
                        }`}
                      />
                    </div>

                    {expanded && (
                      <div className="flex items-center justify-between w-full ml-2 dark:text-white">
                        <span className="truncate">{option?.text}</span>
                        <div className="flex items-center gap-2">
                          {typeof option.count === "number" && (
                            <CustomTooltip
                              content={"Unverified Documents Count"}
                            >
                              <span className="text-xs bg-red-500 text-white  dark:bg-white/10 dark:text-white px-2 py-1 rounded-full">
                                {option?.count}
                              </span>
                            </CustomTooltip>
                          )}
                          {hasChildren &&
                            (isSubmenuOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </div>
                    )}
                  </Wrapper>

                  {hasChildren && isSubmenuOpen && expanded && (
                    <div className="ml-8 space-y-1">
                      {option.children.map((child, idx) => (
                        <Link
                          to={child?.path}
                          onClick={() => setDefault()}
                          key={idx}
                          className={`block text-sm py-3 mt-1 px-2 hover:bg-primary hover:text-white ${
                            pathname === child?.path
                              ? "bg-primary text-white"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate">{child?.text}</span>
                            {typeof child?.count === "number" && (
                              <CustomTooltip
                                content={"Unverified Documents Count"}
                              >
                                <span className="ml-2 text-xs bg-red-500 text-white dark:bg-white/10 dark:text-white px-2 mr-2.5 py-1 rounded-full">
                                  {child?.count}
                                </span>
                              </CustomTooltip>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
      {/* </div> */}
      <Layout
        className={
          "mx-6 rounded-md  hide-scrollbar  !relative !shadow-none flex flex-1 flex-col justify-between gap-y-4   "
        }
      >
        <BreadCrumb
          showCustom={true}
          hideTitle={true}
          crumbs={[
            {
              path: null,
              label: `Invoice Details`
            }
          ]}
        >
          {isLoading ? (
            <div className="flex items-center gap-x-2">
              <Skeleton className={"w-44 h-10  mb-1"} />
              <Skeleton className={"w-44 h-10  mb-1"} />
            </div>
          ) : (
            <>
              <div className="flex gap-x-4 items-end">
                {(data?.data?.restaurant || data?.data?.[0]?.restaurant) && (
                  <>
                    <div className="flex flex-col gap-y-0">
                      <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                        Restaurant
                      </p>
                      <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                        <span>
                          {data?.data?.restaurant?.restaurant_name ||
                            data?.data?.[0]?.restaurant?.restaurant_name ||
                            data?.data?.restaurant?.restaurant_id ||
                            data?.data?.[0]?.restaurant?.restaurant_id}
                        </span>
                        <img
                          className="h-4 w-4"
                          src={
                            rest_tier == 1
                              ? tier_1
                              : rest_tier == 2
                              ? tier_2
                              : tier_3
                          }
                          alt=""
                        />
                      </p>
                    </div>
                  </>
                )}

                {(data?.data?.vendor || data?.data?.[0]?.vendor) && (
                  <>
                    <p className="text-2xl">|</p>
                    <div className="flex flex-col gap-y-0">
                      <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                        Vendor
                      </p>
                      <p className="capitalize text-[#121212] font-semibold font-poppins text-xl flex gap-x-2 items-center">
                        {data?.data?.vendor?.vendor_name ||
                          data?.data?.[0]?.vendor?.vendor_name}

                        {data?.data?.vendor?.human_verified ||
                          (data?.data?.[0]?.vendor?.human_verified && (
                            <img src={approved} />
                          ))}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <div className=" -mt-[1.78rem] flex  gap-x-2 !capitalize -ml-3">
                    {myData?.human_verified === true &&
                      myData?.rejected === false && (
                        <CustomTooltip
                        className={"mb-1 !min-w-fit"}
                          content={`Accepted By :- ${myData?.accepted_by?.username}`}
                        >
                          <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#348355] text-[#ffffff] p-1 rounded-xl px-3">
                            Accepted{" "}
                          </span>
                        </CustomTooltip>
                      )}
                    {myData?.rejected === true && (
                       <CustomTooltip
                        className={"mb-1 !min-w-fit"}
                          content={`Rejected By :- ${myData?.rejected_by?.username}`}
                        >

                      <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#F15156] text-[#ffffff] p-1 rounded-xl   px-3">
                        Rejected{" "}
                      </span>
                        </CustomTooltip>
                    )}
                    {myData?.human_verified === false &&
                      myData?.rejected === false && (
                        <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#B28F10] text-[#ffffff] py-1.5  px-3 rounded-xl ">
                          Pending{" "}
                        </span>
                      )}
                    {myData?.human_verified === false &&
                      myData?.rejected === false && (
                        <span
                          className={`${
                            calculateTimeDifference(
                              new Date(
                                metaData?.assignment_details?.verification_due_at
                              )
                            )?.includes("ago")
                              ? "!text-[#F15156]"
                              : "!text-black"
                          } mx-2 bg-gray-200  font-poppins font-normal text-xs leading-3  text-[#ffffff] h-6 flex items-center   px-3 rounded-xl `}
                        >
                          <div className="flex items-center gap-x-2">
                            <CustomTooltip content={"Due Time"}>
                              <Clock className="w-4 h-4" />
                            </CustomTooltip>
                            <div>
                              <CustomTooltip
                                className={"mb-2 !min-w-fit"}
                                content={
                                  metaData?.assignment_details?.assigned_to
                                    ?.username &&
                                  `Assigned To :- ${metaData?.assignment_details?.assigned_to?.username}`
                                }
                              >
                                {calculateTimeDifference(
                                  new Date(
                                    metaData?.assignment_details?.verification_due_at
                                  )
                                )}
                              </CustomTooltip>
                            </div>
                          </div>
                          {/* </CustomTooltip> */}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </BreadCrumb>
        {(branchChanged || vendorChanged) && showWarningForBranchAndVendor && (
          <div className="flex flex-col relative  justify-center items-center w-full rounded-md bg-red-500/10 p-4 border border-[#FF9800] bg-[#FFF3E0]">
            <div className="flex items-center gap-x-2">
              <Info className="h-5 w-5 text-[#FF9800]" />
              <p className="text-[#263238] font-poppins font-semibold text-sm leading-5 pt-[0.5px] ">
                {vendorChanged && branchChanged
                  ? "Please Save the Vendor Name and Branch Address before proceeding."
                  : vendorChanged
                  ? " Please Save the Vendor Name before proceeding."
                  : "Please Save the Branch Address before proceeding."}
              </p>
            </div>

            <X
              className="h-6 w-6 text-[#546E7A] absolute top-2 right-2 cursor-pointer"
              onClick={() => {
                setShowWarningForBranchAndVendor(false);
              }}
            />
          </div>
        )}

        {showSimilarVendorsAndBranchesWarningModal && (
          <div className="flex flex-col relative  justify-center items-center w-full rounded-md bg-red-500/10 p-4 border border-[#FF9800] bg-[#FFF3E0]">
            <div className="flex items-center gap-x-2">
              <Info className="h-5 w-5 text-[#FF9800]" />
              <p className="text-[#263238] font-poppins font-semibold text-sm leading-5 pt-[0.5px] ">
                {similarBranches?.data?.length > 0 &&
                similarVendors?.data?.length > 0
                  ? `Found ${similarVendors?.data?.length} Vendors and ${similarBranches?.data?.length} Branches.`
                  : similarVendors?.data?.length > 0
                  ? `Found ${similarVendors?.data?.length} Similar ${
                      similarVendors?.data?.length > 1 ? "Vendors." : "Vendor."
                    }`
                  : `Found ${similarBranches?.data?.length} Similar ${
                      similarBranches?.data?.length > 1
                        ? "Branches."
                        : "Branch."
                    }`}
              </p>
              <p
                onClick={() => setShowAcceptModal(true)}
                className="text-[#1E7944] font-poppins cursor-pointer font-medium  text-sm  leading-5 border-b border-b-[#1E7944]"
              >
                Check Now
              </p>
            </div>

            <X
              className="h-6 w-6 text-[#546E7A] absolute top-2 right-2 cursor-pointer"
              onClick={() => {
                setShowSimilarVendorsAndBranchesWarningModal(false);
              }}
            />
          </div>
        )}
        {showAlreadySyncedModal && (
          <div className="flex flex-col relative  justify-center items-center w-full rounded-md bg-red-500/10 p-4 border border-[#FF9800] bg-[#FFF3E0]">
            <div className="flex items-center gap-x-2">
              <Info className="h-5 w-5 text-[#FF9800]" />
              <p className="text-[#263238] font-poppins font-semibold text-sm leading-5 pt-[0.5px] ">
                {(data?.data?.rejected || data?.data?.[0]?.rejected) &&
                  "Rejection Reason :- "}{" "}
                {data?.data?.rejected || data?.data?.[0]?.rejected
                  ? data?.data?.rejection_reason ||
                    data?.data?.[0]?.rejection_reason
                  : action_controls?.accept?.disabled
                  ? action_controls?.accept?.reason
                  : action_controls?.reject?.disabled
                  ? action_controls?.reject?.reason
                  : null}
              </p>
            </div>

            <X
              className="h-6 w-6 text-[#546E7A] absolute top-2 right-2 cursor-pointer"
              onClick={() => {
                setShowAlreadySyncedModal(false);
              }}
            />
          </div>
        )}
        {showDuplicateInvoicesWarning && (
          <div className="flex flex-col relative  justify-center items-center w-full rounded-md bg-red-500/10 p-4 border border-[#FF9800] bg-[#FFF3E0]">
            <div className="flex items-center gap-x-2">
              <Info className="h-5 w-5 text-[#FF9800]" />
              <p className="text-[#263238] font-poppins font-semibold text-sm leading-5 pt-[0.5px] ">
                {duplicateInvoices?.duplicate_documents?.length} Duplicate
                Invoices Found
              </p>
            </div>

            <p
              onClick={() => setShowDuplicateInvoicesModal(true)}
              className="text-[#1E7944] font-poppins cursor-pointer font-medium  text-sm  leading-5 border-b border-b-[#1E7944]"
            >
              Check Now
            </p>
            <X
              className="h-6 w-6 text-[#546E7A] absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowDuplicateInvoicesWarning(false)}
            />
          </div>
        )}

        <div
          className={`${
            metaData?.extraction_source ? "justify-between" : "justify-end"
          } flex  gap-x-2 items-center`}
        >
          {/* <div className="flex items-center justify-start"> */}

          {metaData?.extraction_source && (
            <CustomTooltip content={"Extraction Source"}>
              {/* {metadata?.extraction_source && ( */}
              <p
                onDoubleClick={() => {
                  setShowReprocessingModal(true);
                }}
                className="font-poppins font-medium text-sm leading-5 capitalize px-4 border border-primary rounded-md py-0.5 cursor-pointer"
              >
                {metaData?.extraction_source}
              </p>
              {/* )} */}
            </CustomTooltip>
          )}
          {/* </div> */}
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-2 dark:bg-[#051C14]">
              <CustomDropDown
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                Value={searchParams.get("restaurant") || restaurantFilterValue}
                placeholder="All Restaurants"
                multiSelect={true}
                className={"!max-w-fit"}
                data={formatRestaurantsList(
                  restaurantsList && restaurantsList?.data
                )}
                searchPlaceholder="Search Restaurant"
                onChange={(val) => {
                  if (typeof val == "object") {
                    let restaurant = val?.map((item) => item)?.join(",");
                    setFilters({ ...filters, restaurant: restaurant });
                    updateParams({ restaurant: restaurant });
                  } else {
                    if (val == "none") {
                      updateParams({ restaurant: undefined });
                      setFilters({ ...filters, restaurant: undefined });
                    } else {
                      updateParams({ restaurant: val });
                      setFilters({ ...filters, restaurant: val });
                    }
                  }
                }}
              />{" "}
              <CustomDropDown
                Value={searchParams.get("vendor") || vendorFilterValue}
                className={"!max-w-56"}
                triggerClassName={"bg-gray-100"}
                contentClassName={"bg-gray-100"}
                data={vendorNamesFormatter(
                  vendorNamesList?.data && vendorNamesList?.data?.vendor_names
                )}
                multiSelect={true}
                onChange={(val) => {
                  if (typeof val == "object") {
                    let vendor = val?.map((item) => item)?.join(",");
                    updateParams({ vendor: vendor });
                    setFilters({ ...filters, vendor: vendor });
                  } else {
                    if (val == "none") {
                      updateParams({ vendor: undefined });
                      setFilters({ ...filters, vendor: undefined });
                    } else {
                      setFilters({ ...filters, vendor: val });
                    }
                  }
                }}
                placeholder="All Vendors"
                searchPlaceholder="Search Vendor Name"
              />{" "}
              <Sheet
                className="!overflow-auto "
                open={open}
                onOpenChange={() => setOpen(!open)}
              >
                <SheetTrigger>
                  {" "}
                  <Button
                    className={`bg-transparent hover:bg-transparent p-0 w-[2.5rem] shadow-none border flex items-center justify-center h-[2.5rem] border-[#D9D9D9] rounded-sm dark:bg-[#000000] dark:border-[#000000] ${
                      open ||
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
                      className={`${
                        open ||
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
            </div>
            <div className="flex items-center gap-x-3">
              <CustomTooltip content={"Click To Copy The Link."}>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${
                        window.location.origin
                      }/invoice-details?document_uuid=${
                        document_uuid ||
                        data?.data?.[0]?.document_uuid ||
                        data?.data?.document_uuid
                      }`
                    );
                    toast.success("Link copied to clipboard");
                  }}
                  disabled={markingForReview}
                  className="bg-transparent h-[2.4rem] border-primary w-[3rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  <Share2 className="dark:text-white" />
                </Button>
              </CustomTooltip>
              {metaData?.ai_notes?.length > 0 && (
                <Button
                  onClick={() => {
                    setShowAiNotesModal(!showAiNotesModal);
                  }}
                  disabled={markingForReview}
                  className="bg-transparent h-[2.4rem] fixed bottom-5 left-4 border-primary w-[3rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  <div className="w-full h-full relative">
                    <NotebookTabs className="dark:text-white" />
                    <p className="absolute px-2 rounded-full border bg-primary  -top-5 -right-6 text-white">
                      {metaData?.ai_notes?.length}
                    </p>
                  </div>
                </Button>
              )}

              <DocumentNotes
                data={documentNotes?.data}
                document_uuid={
                  data?.data?.document_uuid || data?.data?.[0]?.document_uuid
                }
                isLoading={loadingDocumentNotes}
              />

              <VendorNotes
                data={vendorNotes?.data}
                isLoading={loadingVendorNotes}
                vendor_id={
                  data?.data?.vendor?.vendor_id ||
                  data?.data?.[0]?.vendor?.vendor_id
                }
              />
              {(role?.toLowerCase() == "admin" ||
                role?.toLowerCase() == "manager") && (
                <CustomTooltip content={"Click To reset the invoice status ."}>
                  <Button
                    onClick={() => {
                      setLoadingState((prev) => ({ ...prev, reverting: true }));
                      revertChanges(
                        data?.data?.document_uuid ||
                          data?.data?.[0]?.document_uuid,
                        {
                          onSuccess: () => {
                            setLoadingState((prev) => ({
                              ...prev,
                              reverting: false
                            }));
                          },
                          onError: () => {
                            setLoadingState((prev) => ({
                              ...prev,
                              reverting: false
                            }));
                          }
                        }
                      );
                    }}
                    disabled={
                      loadingState?.reverting ||
                      loadingState?.rejecting ||
                      loadingState?.markingAsNotSupported ||
                      loadingState?.markingForReview ||
                      loadingState?.reverting ||
                      loadingState?.accepting ||
                      loadingState?.saving
                    }
                    className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                  >
                    {loadingState?.reverting ? "Resetting.." : "Reset Status"}
                  </Button>
                </CustomTooltip>
              )}
              <CustomTooltip
                content={
                  action_controls?.review_later?.disabled
                    ? action_controls?.review_later?.reason
                    : "Click To Mark It For A Review."
                }
              >
                <Button
                  onClick={() => {
                    setMarkForReviewModal(true);
                    return;
                  }}
                  disabled={
                    action_controls?.review_later?.disabled ||
                    markingForReview ||
                    loadingState?.rejecting ||
                    loadingState?.markingAsNotSupported ||
                    loadingState?.markingForReview ||
                    loadingState?.reverting ||
                    loadingState?.accepting ||
                    loadingState?.saving
                  }
                  className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  Review Later
                </Button>
              </CustomTooltip>
              <CustomTooltip
                content={
                  action_controls?.reject?.disabled
                    ? action_controls?.reject?.reason
                    : "Click To Reject This Document."
                }
              >
                <Button
                  onClick={() => {
                    setShowRejectionModal(true);
                  }}
                  disabled={
                    action_controls?.reject?.disabled ||
                    loadingState?.rejecting ||
                    loadingState?.markingAsNotSupported ||
                    loadingState?.markingForReview ||
                    loadingState?.reverting ||
                    loadingState?.accepting ||
                    loadingState?.saving
                  }
                  className="bg-transparent w-[6.5rem] dark:text-white h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  Reject
                </Button>
              </CustomTooltip>
              <CustomTooltip
                className={"!max-w-72"}
                content={
                  !warning_checkbox_checked
                    ? "Please check vendor name checkbox."
                    : action_controls?.accept?.disabled
                    ? action_controls?.accept?.reason
                    : "Click To Accept This Document."
                }
              >
                <Button
                  onClick={() => {
                    if (
                      (is_unverified_vendor &&
                        similarVendors?.data?.length > 0) ||
                      (is_unverified_branch &&
                        similarBranches?.data?.length > 0)
                    ) {
                      setShowAcceptModal(true);
                      setClickedOnAcceptButton(true);
                      setShowSimilarVendorsAndBranchesWarningModal(false);
                    } else {
                      handleAccept();
                    }
                  }}
                  disabled={
                    !warning_checkbox_checked ||
                    action_controls?.accept?.disabled ||
                    loadingState?.accepting ||
                    loadingState?.rejecting ||
                    loadingState?.markingAsNotSupported ||
                    loadingState?.markingForReview ||
                    loadingState?.reverting ||
                    loadingState?.saving
                  }
                  className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  {loadingState?.accepting ? "Accepting..." : "Accept"}
                </Button>
              </CustomTooltip>

              <CustomTooltip
                content={
                  action_controls?.mark_as_not_supported?.disabled
                    ? action_controls?.mark_as_not_supported?.reason
                    : "Click To Mark This Document As Not Supported."
                }
              >
                <Button
                  disabled={
                    action_controls?.mark_as_not_supported?.disabled ||
                    loadingState?.rejecting ||
                    loadingState?.markingAsNotSupported ||
                    loadingState?.markingForReview ||
                    loadingState?.reverting ||
                    loadingState?.accepting ||
                    loadingState?.saving
                  }
                  onClick={() => setMarkAsNotSupportedModal(true)}
                  className="bg-transparent h-[2.4rem] dark:text-white border-primary w-[7.25rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
                >
                  Not Supported
                </Button>
              </CustomTooltip>

              <CustomTooltip
                content={
                  action_controls?.save?.disabled
                    ? action_controls?.save?.reason
                    : "Click To Save This Document."
                }
              >
                <Button
                  disabled={
                    action_controls?.save?.disabled ||
                    loadingState?.saving ||
                    loadingState?.rejecting ||
                    loadingState?.accepting ||
                    loadingState?.rejecting ||
                    loadingState?.markingAsNotSupported ||
                    loadingState?.markingForReview ||
                    loadingState?.reverting ||
                    loadingState?.saving
                  }
                  onClick={() => handleSave()}
                  className="font-poppins h-[2.4rem] dark:text-white font-normal text-sm leading-5 border-2 border-primary text-[#ffffff]"
                >
                  {loadingState?.saving ? "Saving..." : "Save"}
                </Button>
              </CustomTooltip>
            </div>
          </div>
        </div>

        <div className="w-full flex  -mt-4">
          <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
            <PdfViewer
              payload={payload}
              loadinMetadata={isLoading}
              image_rotations={
                data?.data?.document_metadata?.image_rotations ||
                data?.data?.[0]?.document_metadata?.image_rotations
              }
              pdfUrls={[
                {
                  document_link: `${
                    data?.data?.document_link || data?.data?.[0]?.document_link
                  }
                    `,
                  document_source: `${
                    data?.data?.document_source ||
                    data?.data?.[0]?.document_source
                  }`
                }
              ]}
            />
            {!document_uuid && (
              <InvoicePagination
                totalPages={data?.total_pages}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {myData?.invoice_type !== "Summary Invoice" && (
              <CategoryWiseSum isLoading={isLoading} />
            )}
            <LastUpdateInfo
              document_id={
                data?.data?.[0]?.document_uuid || data?.data?.document_uuid
              }
              info={
                data?.data?.latest_update_info ||
                data?.data?.[0]?.latest_update_info
              }
            />
          </div>
          <div className="w-1/2">
            <Tables
              setData={setData}
              setIsLoading={setIsLoading}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          </div>
        </div>
        {/* Mark For Review Modal */}
        <Modal
          open={markForReviewModal}
          setOpen={setMarkForReviewModal}
          title={"Reason"}
          className={"!rounded-2xl"}
          titleClassName={
            "flex justify-center  text-[#000000] font-poppins dark:text-white  font-medium  text-base  leading-4 pt-0.5 "
          }
        >
          <ModalDescription>
            <div className="p-2">
              <p className="mb-1.5  font-poppins text-[0.9rem] dark:text-white font-normal text-[#000000] ">
                Why are you marking this document for review later?
              </p>
              <Textarea
                placeholder="Reason"
                rows={6}
                value={reviewLaterComments}
                onChange={(e) => {
                  setReviewLaterComments(e?.target?.value);
                }}
                className="p-2.5 dark:text-white  focus:!outline-none focus:!ring-0 "
              />
            </div>
            <div className="flex justify-center">
              <Button
                disabled={
                  loadingState?.markingForReview ||
                  reviewLaterComments?.length == 0
                }
                onClick={() => {
                  setLoadingState({ ...loadingState, markingForReview: true });
                  markForReview(
                    {
                      document_uuid:
                        data?.data?.document_uuid ||
                        data?.data?.[0]?.document_uuid,
                      comments: reviewLaterComments
                    },
                    {
                      onSuccess: () => {
                        setLoadingState({
                          ...loadingState,
                          markingForReview: false
                        });
                        setReviewLaterComments("");
                        setMarkForReviewModal(false);

                        if (page_number == 1 && data?.totalPages == 1) {
                          if (from_view == "my-tasks") {
                            navigate("/my-tasks");
                          } else if (from_view == "reviw-later") {
                            navigate("/review-later-tasks");
                          } else {
                            navigate("/home");
                          }
                          setDefault();
                        }
                        window.location.reload();
                      },
                      onError: () => {
                        setLoadingState({
                          ...loadingState,
                          markingForReview: false
                        });
                      }
                    }
                  );
                }}
                className="mt-8 text-[#FFFFFF] dark:text-white font-poppins  !font-normal text-xs rounded-sm leading-4 "
              >
                {loadingState?.markingForReview
                  ? "Marking...."
                  : " Mark for Review"}
              </Button>
            </div>
          </ModalDescription>
        </Modal>
        {/* Mark As Not Supported */}
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
                    setLoadingState({
                      ...loadingState,
                      markingAsNotSupported: true
                    });
                    markAsNotSupported(
                      data?.data?.document_uuid ||
                        data?.data?.[0]?.document_uuid,
                      {
                        onSuccess: () => {
                          setLoadingState({
                            ...loadingState,
                            markingAsNotSupported: false
                          });
                          window.location.reload();
                        },
                        onError: () => {
                          setLoadingState({
                            ...loadingState,
                            markingAsNotSupported: false
                          });
                        }
                      }
                    );
                  }}
                  disabled={loadingState?.markingAsNotSupported}
                  className="rounded-sm !w-[4.5rem] !font-poppins text-xs font-normal"
                >
                  {loadingState?.markingAsNotSupported ? "Marking..." : "Yes"}
                </Button>
              </div>
            </div>
          </ModalDescription>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          open={showRejectionModal}
          setOpen={setShowRejectionModal}
          title={"Reason"}
          className={"!rounded-2xl"}
          titleClassName={
            "flex justify-center  text-[#000000] font-poppins  font-medium  text-base  leading-4 pt-0.5 "
          }
        >
          <ModalDescription>
            <div className="p-2">
              <p className="mb-1.5  font-poppins text-[0.9rem] font-normal text-[#000000] ">
                Why are you rejecting this document ?
              </p>
              <RadioGroup
                defaultValue={null}
                onValueChange={(v) => {
                  setRejectionReason(v);
                }}
                className="grid grid-cols-2  gap-y-2 mt-4"
              >
                {rejectionReasons?.map((r, i) => {
                  return (
                    <div className="flex items-center space-x-2" key={i}>
                      <RadioGroupItem value={r} id={r} />

                      <Label
                        htmlFor={r}
                        className="text-[#6D6D6D] capitalize cursor-pointer font-normal font-poppins text-xs leading-5"
                      >
                        {r}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              <p className="mt-4 mb-2 font-poppins text-[0.9rem] font-normal text-[#000000] ">
                Other Reason :
              </p>

              <Textarea
                placeholder="Description"
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e?.target?.value);
                }}
                className="p-2.5  focus:!outline-none focus:!ring-0 "
              />
            </div>
            <div className="flex justify-center">
              <Button
                disabled={
                  loadingState?.rejecting || rejectionReason?.length == 0
                }
                onClick={handleRejection}
                className="mt-8 text-[#FFFFFF] font-poppins tracking-wide  !font-normal text-xs rounded-sm leading-4 "
              >
                {loadingState?.rejecting ? "Rejecting...." : "Reject"}
              </Button>
            </div>
          </ModalDescription>
        </Modal>
      </Layout>
      <Modal
        iconCN={"top-[28px]"}
        open={showDuplicateInvoicesModal}
        setOpen={setShowDuplicateInvoicesModal}
        title={"Duplicate Invoices Found"}
        className={"!px-0  !min-w-[40rem]"}
        titleClassName={
          "text-[#000000] !font-medium  flex justify-center border-b border-b-[#E0E0E0] pb-4 pt-3 font-poppins !text-base  leading-6  pt-0.5"
        }
      >
        <ModalDescription>
          <div className="flex flex-col gap-y-4 px-4  top  ">
            <p className="font-poppins  font-semibold text-sm leading-5 text-[#222222]">
              Current Invoice
            </p>

            <div className="grid grid-cols-3 gap-x-4 mt-1">
              <div className="flex flex-col gap-y-3 items-center">
                <p className="font-poppins font-medium text-sm leading-5 text-[#222222]">
                  Upload Date
                </p>
                <p className="font-poppins font-normal text-xs leading-4 text-[#6D6D6D]">
                  {formatDateTime(
                    duplicateInvoices?.current_document?.date_uploaded
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-y-3 items-center">
                <p className="font-poppins font-medium text-sm leading-5 text-[#222222]">
                  Human Verified
                </p>
                <p className="font-poppins font-normal text-xs leading-4 text-[#6D6D6D]">
                  {duplicateInvoices?.current_document.human_verified
                    ? "Yes"
                    : "No"}
                </p>
              </div>
              <div className="flex flex-col gap-y-3 items-center">
                <p className="font-poppins font-medium text-sm leading-5 text-[#222222]">
                  Rejected
                </p>
                <p className="font-poppins font-normal text-xs leading-4 text-[#6D6D6D]">
                  {duplicateInvoices?.current_document.rejected ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="w-full border-b border-t py-3 grid grid-cols-4 gap-x-4">
              <div className="flex items-center gap-x-8">
                <p className="font-poppins font-semibold text-center text-xs text-[#222222] leading-4">
                  #
                </p>
                <p className="font-poppins font-semibold text-center text-xs text-[#222222] leading-4">
                  Invoice
                </p>
              </div>
              <p className="font-poppins font-semibold text-center text-xs text-[#222222] leading-4">
                Human Verified
              </p>
              <p className="font-poppins font-semibold text-center text-xs text-[#222222] leading-4">
                Rejected
              </p>
              <p className="font-poppins font-semibold text-center text-xs text-[#222222] leading-4">
                Upload Date
              </p>
            </div>
            <div className="max-h-72 overflow-auto">
              {duplicateInvoices?.duplicate_documents?.map((d, i) => {
                return (
                  <div className="w-full  py-2 grid grid-cols-4 gap-x-4">
                    <div className="flex items-center gap-x-8">
                      <p className="font-poppins !font-normal  text-center text-xs text-[#000000] leading-4 pl-1">
                        {i + 1}
                      </p>
                      <Link
                        target="_blank"
                        onClick={() => setShowDuplicateInvoicesModal(false)}
                        to={`/invoice-details?document_uuid=${d?.document_uuid}`}
                        className="font-poppins !font-normal    pl-1 underline underline-offset-4 !text-center text-xs text-[#348355] leading-4"
                      >
                        View
                      </Link>
                    </div>
                    <p className="font-poppins !font-normal  pl-0 !text-center text-xs text-[#222222] leading-4">
                      {d.human_verified ? "Yes" : "No"}
                    </p>
                    <p className="font-poppins !font-normal text-center text-xs text-[#222222] leading-4">
                      {d.rejected ? "Yes" : "No"}
                    </p>
                    <p className="font-poppins !font-normal text-center text-xs text-[#222222] leading-4">
                      {d?.date_uploaded
                        ? formatDateTime(d?.date_uploaded)
                        : "N/A"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalDescription>
      </Modal>
      <ResizableModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal()}
        title={"Information"}
        className={"!rounded-2xl  max-w-[50rem] "}
      >
        {similarVendors?.data?.length > 0 &&
        similarBranches?.data?.length > 0 ? (
          <div className="my-2">
            <p className="mb-3 pl-0.5  font-poppins text-[0.9rem] font-semibold text-[#000000] ">
              Matching Verified Vendors ({similarVendors?.data?.length}) and
              Branches ({similarBranches?.data?.length})
            </p>
          </div>
        ) : similarVendors?.data?.length > 0 ? (
          <div className="my-2">
            <p className="mb-3 pl-0.5  font-poppins text-[0.9rem] font-semibold text-[#000000] ">
              Matching Verified Vendors ({similarVendors?.data?.length})
            </p>
          </div>
        ) : (
          <div className="my-2">
            <p className="mb-3 pl-0.5  font-poppins text-[0.9rem] font-semibold text-[#000000] ">
              Matching Verified Branches ({similarBranches?.data?.length})
            </p>
          </div>
        )}

        {similarVendors?.data?.length > 0 && (
          <div className="w-full !max-h-52 overflow-auto !relative">
            {similarVendors?.data?.length > 0 ? (
              <>
                <div className="sticky top-0 bg-white z-50">
                  <Table className="!sticky !top-0">
                    <TableRow className="grid grid-cols-3 items-center content-center ">
                      <TableHead className="border-r  border-t border-l font-poppins text-sm font-semibold content-center text-black leading-5">
                        Vendor Name
                      </TableHead>
                      <TableHead className="border-r border-t  font-poppins text-sm font-semibold text-black leading-5 content-center">
                        Similarity{" "}
                      </TableHead>
                      <TableHead className=" font-poppins text-sm border-t border-r font-semibold text-black leading-5 content-center">
                        Finding Method
                      </TableHead>
                    </TableRow>
                  </Table>
                </div>
                <div className="">
                  <Table className="mb-4  ">
                    <TableBody>
                      {similarVendors?.data?.length > 0 &&
                        similarVendors?.data
                          ?.sort((a, b) => {
                            return b?.similarity_score - a?.similarity_score;
                          })
                          ?.map((row, index) => (
                            <TableRow
                              className=" !border-b grid grid-cols-3 "
                              key={index}
                            >
                              <TableCell className=" border-l font-poppins border-r font-normal content-center text-black text-sm">
                                <div className="flex items-center gap-x-2  justify-between w-full capitalize">
                                  <span className="max-w-44">
                                    {" "}
                                    {row?.vendor?.vendor_name}
                                  </span>
                                  <div className="flex items-center gap-x-2 !w-12">
                                    <img src={approved} alt="" />
                                    <Copy
                                      className="cursor-pointer h-4 w-4"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          row?.vendor?.vendor_name
                                        );
                                        toast.success("Vendor Name Copied");
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className=" border-r content-center font-poppins font-normal text-black text-sm">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger div className=" z-50">
                                      <span> {row?.similarity_score}%</span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black border  absolute -top-[3rem] -left-[15rem] shadow-sm px-4 flex items-center  gap-x-1  min-w-[18rem]    min-h-10 ml-[16rem]">
                                      {row?.match_reason}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className=" border-r content-center font-poppins font-normal text-black text-sm">
                                {row?.finding_method}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="w-full h-[10rem] flex items-center justify-center">
                <p className="font-medium text-sm font-poppins text-black">
                  No Matching Verified Vendors Found.
                </p>
              </div>
            )}
          </div>
        )}
        {similarBranches?.data?.length > 0 && (
          <div className="w-full !max-h-52 overflow-auto !relative">
            {similarBranches?.data?.length > 0 ? (
              <>
                <div className="sticky top-0 bg-white z-50">
                  <Table className="!sticky !top-0">
                    <TableRow className="grid grid-cols-3 items-center content-center ">
                      <TableHead className="border-r  border-t border-l font-poppins text-sm font-semibold content-center text-black leading-5">
                        Branch Name
                      </TableHead>
                      <TableHead className="border-r border-t  font-poppins text-sm font-semibold text-black leading-5 content-center">
                        Similarity{" "}
                      </TableHead>
                      <TableHead className=" font-poppins text-sm border-t border-r font-semibold text-black leading-5 content-center">
                        Finding Method
                      </TableHead>
                    </TableRow>
                  </Table>
                </div>
                <div className="">
                  <Table className="mb-4  ">
                    <TableBody>
                      {similarBranches?.data?.length > 0 &&
                        similarBranches?.data
                          ?.sort((a, b) => {
                            return b?.similarity_score - a?.similarity_score;
                          })
                          ?.map((row, index) => (
                            <TableRow
                              className=" !border-b grid grid-cols-3 "
                              key={index}
                            >
                              <TableCell className=" border-l font-poppins border-r font-normal content-center text-black text-sm">
                                <div className="flex items-center gap-x-2 capitalize justify-between">
                                  <span className="max-w-44">
                                    {row?.branch?.vendor_address}
                                  </span>
                                  <div className="flex items-center gap-x-2">
                                    <img src={approved} alt="" />
                                    <Copy
                                      className="cursor-pointer h-4 w-4"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          row?.branch?.vendor_address
                                        );
                                        toast.success("Branch Address Copied");
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className=" border-r content-center font-poppins font-normal text-black text-sm">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger div className=" z-50">
                                      <span> {row?.similarity_score}%</span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black border  absolute -top-[3rem] -left-[15rem] shadow-sm px-4 flex items-center  gap-x-1  min-w-[18rem]    min-h-10 ml-[16rem]">
                                      {row?.match_reason}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className=" border-r content-center font-poppins font-normal text-black text-sm">
                                {row?.finding_method}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="w-full h-[10rem] flex items-center justify-center">
                <p className="font-medium text-sm font-poppins text-black">
                  No Matching Verified Branches Found.
                </p>
              </div>
            )}
          </div>
        )}

        {clickedOnAcceptButton && (
          <div className="flex justify-center mt-4 mb-2 gap-x-4">
            <Button
              onClick={() => {
                handleAccept();
                setShowAcceptModal(false);
                setClickedOnAcceptButton(false);
                setShowSimilarVendorsAndBranchesWarningModal(false);
              }}
              className="rounded-sm font-normal font-poppins "
            >
              Accept
            </Button>
            <Button
              className="rounded-sm font-normal font-poppins bg-transparent hover:bg-transparent border border-primary text-black"
              onClick={() => {
                setShowAcceptModal(false);
                setClickedOnAcceptButton(false);
                setShowSimilarVendorsAndBranchesWarningModal(false);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </ResizableModal>
      {/* Reprocess Modal */}
      <Modal
        iconCN={"top-[28px]"}
        open={reprocessingModal}
        setOpen={() => {
          setShowReprocessingModal(false);
          setReExtractionMethod(null);
        }}
        title={"Reprocess Document"}
        className={"!px-0  !z-50 !min-w-[40rem] "}
        titleClassName={
          "text-[#000000] !font-medium  flex justify-start px-4 border-b border-b-[#E0E0E0] pb-4 pt-3 font-poppins !text-base  leading-6  pt-0.5"
        }
      >
        <ModalDescription className="px-4 !z-50">
          <div className="px-4 z-50">
            <p className="font-poppins font-medium text-start   text-black">
              Select Extraction Method
            </p>

            <RadioGroup
              className="flex gap-x-4 items-center py-4"
              value={reExtractionMethod}
              onValueChange={(v) => {
                setReExtractionMethod(v);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={"method_a"}
                  id="method_a"
                ></RadioGroupItem>
                <Label
                  htmlFor="method_a"
                  className="font-poppins font-normal text-sm leading-5 text-[#000000] cursor-pointer "
                >
                  Method A
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={"method_b"}
                  id="method_b"
                ></RadioGroupItem>
                <Label
                  htmlFor="method_b"
                  className="font-poppins font-normal text-sm leading-5 text-[#000000] cursor-pointer "
                >
                  Method B
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-center gap-x-2  pr-2 mt-6">
            <Button
              onClick={() => {
                setShowReprocessingModal(false);
                setReExtractionMethod(null);
              }}
              className="rounded-sm border border-primary bg-transparent hover:bg-transparent font-poppins font-normal text-sm text-black"
            >
              Close
            </Button>
            <Button
              disabled={loadingState?.reprocessing}
              onClick={() => {
                setLoadingState({ ...loadingState, reprocessing: true });
                reprocessDocument(
                  {
                    document_uuid:
                      document_uuid ||
                      data?.data?.[0]?.document_uuid ||
                      data?.data?.document_uuid,
                    payload: {
                      extraction_method: reExtractionMethod
                    }
                  },
                  {
                    onSuccess: (data) => {
                      setLoadingState({ ...loadingState, reprocessing: false });
                      setShowReprocessingModal(false);
                      setShowReferenceLinkModal(true);
                      setShowReferenceLinkModal(true);
                      setReprocessedData(data?.data);
                    },
                    onError: () => {
                      setLoadingState({ ...loadingState, reprocessing: false });
                      setShowReprocessingModal(false);
                    }
                  }
                );
              }}
              className={
                "rounded-sm font-poppins text-sm text-white font-normal"
              }
            >
              {loadingState?.reprocessing ? "Reprocessing..." : "Reprocess"}
            </Button>
          </div>
        </ModalDescription>
      </Modal>
      {/* Reprocess Link Modal */}
      <Modal
        iconCN={"top-[28px]"}
        open={shoeReferenceLinkModal}
        setOpen={() => {
          setShowReferenceLinkModal(false);
          setReprocessedData({});
        }}
        title={"Reprocess Document"}
        className={"!px-0  !z-50 !min-w-[40rem] "}
        titleClassName={
          "text-[#000000] !font-medium  flex justify-start px-4 border-b border-b-[#E0E0E0] pb-4 pt-3 font-poppins !text-base  leading-6  pt-0.5"
        }
      >
        <ModalDescription className="px-4 !z-50">
          <div className="px-4 z-50">
            <p className="font-poppins font-medium text-start  capitalize  text-black">
              Currently the document is is queued for processing and after
              processing the document will be available. Copy the document link
              from below button .
            </p>
          </div>

          <div className="flex items-center justify-center gap-x-2  pr-2 mt-6">
            <Button
              onClick={() => {
                setShowReferenceLinkModal(false);
                setReprocessedData({});
              }}
              className="rounded-sm border border-primary bg-transparent hover:bg-transparent font-poppins font-normal text-sm text-black"
            >
              Close
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/invoice-details?document_uuid=${reprocessedData?.document_reference}`
                );

                toast.success("Document Link copied to clipboard");
              }}
              className="flex items-center gap-x-2 bg-transparent hover:bg-transparent rounded-sm border-primary border font-poppins font-normal text-sm text-black"
            >
              <p>Copy</p>
              <img
                src={copy}
                alt="copy icon"
                className=" right-3  top-10 cursor-pointer h-4  z-50"
              />
            </Button>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default InvoiceDetails;
