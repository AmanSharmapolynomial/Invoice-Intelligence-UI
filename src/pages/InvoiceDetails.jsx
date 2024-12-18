import warning from "@/assets/image/warning.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import {
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
import { Label } from "@/components/ui/label";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
  const {
    updatedFields,
    branchChanged,
    vendorChanged,
    clearUpdatedFields,
    metaData,
    operations,
    setOperations
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
    if (currentTab == "metadata") {
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
  return (
    <>
      <Navbar />

      <Layout
        className={
          "mx-6 rounded-md    !shadow-none flex flex-1 flex-col justify-between gap-y-4   "
        }
      >
        <BreadCrumb
          title={selectedInvoiceVendorName}
          crumbs={[
            {
              path: null,
              label: `${selectedInvoiceVendorName} `
            },
            {
              path: null,
              label: `${selectedInvoiceRestaurantName} `
            }
          ]}
        />

        <div className="flex justify-end">
          <div className="flex items-center gap-x-3">
            <Button
              onClick={() => {
                setMarkForReviewModal(true);
                return;
              }}
              disabled={markingForReview}
              className="bg-transparent h-[2.4rem] border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
            >
              Review Later
            </Button>
            <Button
              onClick={() => {
                setShowRejectionModal(true);
              }}
              className="bg-transparent w-[6.5rem] h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
            >
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              disabled={loadingState?.accepting}
              className="bg-transparent h-[2.4rem] border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
            >
              {loadingState?.accepting ? "Accepting..." : "Accept"}
            </Button>
            <Button
              onClick={() => setMarkAsNotSupportedModal(true)}
              className="bg-transparent h-[2.4rem] border-primary w-[7.25rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm"
            >
              Not Supported
            </Button>
            <Button
              disabled={
                currentTab == "combined-table" ||
                loadingState?.saving ||
                loadingState?.rejecting ||
                loadingState?.accepting
              }
              onClick={() => handleSave()}
              className="font-poppins h-[2.4rem] font-normal text-sm leading-5 border-2 border-primary text-[#ffffff]"
            >
              {loadingState?.saving ? "Saving..." : "Save"}
            </Button>
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
            <InvoicePagination
              totalPages={data?.total_pages}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
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
            "flex justify-center  text-[#000000] font-poppins  font-medium  text-base  leading-4 pt-0.5 "
          }
        >
          <ModalDescription>
            <div className="p-2">
              <p className="mb-1.5  font-poppins text-[0.9rem] font-normal text-[#000000] ">
                Why are you marking this document for review later?
              </p>
              <Textarea
                placeholder="Reason"
                rows={6}
                value={reviewLaterComments}
                onChange={(e) => {
                  setReviewLaterComments(e.target.value);
                }}
                className="p-2.5  focus:!outline-none focus:!ring-0 "
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
                className="mt-8 text-[#FFFFFF] font-poppins  !font-normal text-xs rounded-sm leading-4 "
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
    </>
  );
};

export default InvoiceDetails;
