import warning from "@/assets/image/warning.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import {
  useFindDuplicateInvoices,
  useMarkAsNotSupported,
  useMarkReviewLater,
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
import { formatDateToReadable } from "@/lib/helpers";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { Info, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

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

  const [currentTab, setCurrentTab] = useState("metadata");
  const [markForReviewModal, setMarkForReviewModal] = useState(false);
  const [markAsNotSupportedModal, setMarkAsNotSupportedModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [reviewLaterComments, setReviewLaterComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
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
    metadata
  } = invoiceDetailStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({
    saving: false,
    rejecting: false,
    accepting: false,
    markingForReview: false,
    markingAsNotSupported: false
  });
  const { filters } = useFilterStore();
  const { mutate: updateTable } = useUpdateDocumentMetadata();
  const { mutate: markForReview, isPending: markingForReview } =
    useMarkReviewLater();
  const { mutate: saveDocumentTable } = useUpdateDocumentTable();
  const { mutate: markAsNotSupported } = useMarkAsNotSupported();
  const { selectedInvoiceVendorName, selectedInvoiceRestaurantName } =
    globalStore();
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
            clearUpdatedFields();
          },
          onError: () => {
            setLoadingState({ ...loadingState, saving: false });
          }
        }
      );
    } else if (currentTab == "human-verification") {
      setLoadingState({ ...loadingState, saving: true });
      if (updatedFields) {
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
              clearUpdatedFields();
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
              queryClient.invalidateQueries({ queryKey: ["combined-table"] });
              queryClient.invalidateQueries({ queryKey: ["additional-data"] });
              // queryClient.invalidateQueries({ queryKey: ["document-metadata"] });
              setCombinedTableCopy({});
              if (!refreshed) {
                refreshed = true;
                window.location.reload();
              }
              setAdded(false);
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
            setCombinedTableCopy({});
            setAdded(false);
          },

          onError: () => setLoadingState({ ...loadingState, saving: false })
        }
      );
    }
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
  };

  const handleAccept = () => {
    setLoadingState({ ...loadingState, accepting: true });
    metaData["human_verified"] = true;
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
            setCombinedTableCopy({});
            setAdded(false);
          },

          onError: () => setLoadingState({ ...loadingState, saving: false })
        }
      );
    }
    setLoadingState({ ...loadingState, saving: true });

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
        },
        onError: () => {
          setLoadingState({ ...loadingState, saving: false });
          queryClient.invalidateQueries({ queryKey: ["combined-table"] });
        }
      }
    );
  };

  let action_controls =
    metadata?.data?.[0]?.action_controls || metadata?.data?.action_controls;

  useEffect(() => {
    if (duplicateInvoices?.duplicate_documents?.length > 0) {
      setShowDuplicateInvoicesWarning(true);
    }
  }, [duplicateInvoices]);
  const myData = data?.data?.[0] || data?.data;
  return (
    <div className="hide-scrollbar">
      <Navbar />

      <Layout
        className={
          "mx-6 rounded-md  hide-scrollbar   !shadow-none flex flex-1 flex-col justify-between gap-y-4   "
        }
      >
        <BreadCrumb
          showCustom={true}
          title={`${selectedInvoiceRestaurantName}  | ${selectedInvoiceVendorName} `}
          crumbs={[
            {
              path: null,
              label: `Invoice Details`
            }
          ]}
        >
          <div className="flex gap-x-4 items-end">
           {(data?.data?.restaurant || data?.data?.[0]?.restaurant) && (<>
           <div className="flex flex-col gap-y-0.5">
              <p className="text-[#6D6D6D] font-poppins font-medium text-sm leading-4">
                Restaurant
              </p>
              <p className="capitalize text-[#121212] font-semibold font-poppins text-2xl">
                {data?.data?.restaurant?.restaurant_name || data?.data?.[0]?.restaurant?.restaurant_name}
              </p>
            </div>
            </>
            )}

           {(data?.data?.vendor || data?.data?.[0]?.vendor) && (<>
            <p className="text-2xl">|</p>
            <div className="flex flex-col gap-y-0.5">
              <p className="text-[#6D6D6D] font-poppins font-medium text-sm leading-4">
                Vendor
              </p>
              <p className="capitalize text-[#121212] font-semibold font-poppins text-2xl">
                {data?.data?.vendor?.vendor_name || 
                   data?.data?.[0].vendor?.vendor_name
                }
              </p>
            </div>
           </>)}
            <div>
           <div className=" -mt-[1.78rem] -ml-3">
           {myData?.human_verified === true && myData?.rejected === false && (
              <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#348355] text-[#ffffff] p-1 rounded-xl px-3">
                Accepted{" "}
              </span>
            )}
            {myData?.rejected === true && (
              <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#F15156] text-[#ffffff] p-1 rounded-xl   px-3">
                Rejected{" "}
              </span>
            )}
            {myData?.human_verified === false && myData?.rejected === false && (
              <span className="mx-2  font-poppins font-normal text-xs leading-3 bg-[#B28F10] text-[#ffffff] py-1  px-3 rounded-xl ">
                Pending{" "}
              </span>
            )}
           </div>
          </div>
          </div>
        </BreadCrumb>
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
        <div className="flex justify-end">
         
          <div className="flex items-center gap-x-3">
            {!document_uuid && (
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
            )}
            <CustomTooltip content={"Click To Mark It For A Review."}>
              <Button
                onClick={() => {
                  setMarkForReviewModal(true);
                  return;
                }}
                disabled={markingForReview}
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
                disabled={action_controls?.reject?.disabled}
                className="bg-transparent w-[6.5rem] dark:text-white h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
              >
                Reject
              </Button>
            </CustomTooltip>
            <CustomTooltip
              content={
                action_controls?.accept?.disabled
                  ? action_controls?.accept?.reason
                  : "Click To Accept This Document."
              }
            >
              <Button
                onClick={handleAccept}
                disabled={
                  action_controls?.accept?.disabled || loadingState?.accepting
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
                disabled={action_controls?.mark_as_not_supported?.disabled}
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
                  currentTab == "combined-table" ||
                  loadingState?.saving ||
                  loadingState?.rejecting ||
                  loadingState?.accepting
                }
                onClick={() => handleSave()}
                className="font-poppins h-[2.4rem] dark:text-white font-normal text-sm leading-5 border-2 border-primary text-[#ffffff]"
              >
                {loadingState?.saving ? "Saving..." : "Save"}
              </Button>
            </CustomTooltip>
          </div>
        </div>

        <div className="w-full flex  ">
          <div className="w-1/2 flex flex-col gap-y-4 2xl:px-16 md:px-8">
            <PdfViewer
              loadinMetadata={isLoading}
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
            <CategoryWiseSum isLoading={isLoading} />
            <LastUpdateInfo
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
                  setReviewLaterComments(e.target.value);
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
          showXicon={false}
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
                  setRejectionReason(e.target.value);
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
          <div className="flex flex-col gap-y-4 px-4  top">
            <p className="font-poppins  font-semibold text-sm leading-5 text-[#222222]">
              Current Invoice
            </p>

            <div className="grid grid-cols-3 gap-x-4 mt-1">
              <div className="flex flex-col gap-y-3 items-center">
                <p className="font-poppins font-medium text-sm leading-5 text-[#222222]">
                  Upload Date
                </p>
                <p className="font-poppins font-normal text-xs leading-4 text-[#6D6D6D]">
                  {formatDateToReadable(
                    duplicateInvoices?.current_document?.date_uploaded
                  ) +
                    " " +
                    " " +
                    duplicateInvoices?.current_document?.date_uploaded
                      ?.split("T")[1]
                      ?.split(".")[0]}
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

            {duplicateInvoices?.duplicate_documents?.map((d, i) => {
              return (
                <div className="w-full  py-2 grid grid-cols-4 gap-x-4">
                  <div className="flex items-center gap-x-8">
                    <p className="font-poppins !font-normal  text-center text-xs text-[#000000] leading-4 pl-1">
                      {i + 1}
                    </p>
                    <Link
                      onClick={() => setShowDuplicateInvoicesModal(false)}
                      to={`/invoice-details?document_uuid=${d.document_uuid}`}
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
                      ? formatDateToReadable(d?.date_uploaded) +
                        " " +
                        " " +
                        " " +
                        d?.date_uploaded?.split("T")[1]?.split(".")[0]
                      : "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default InvoiceDetails;
