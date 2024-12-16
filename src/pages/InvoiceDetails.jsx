import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import {
  useMarkReviewLater,
  useUpdateDocumentMetadata
} from "@/components/invoice/api";
import CategoryWiseSum from "@/components/invoice/CategoryWiseSum";
import LastUpdateInfo from "@/components/invoice/LastUpdateInfo";
import Tables from "@/components/invoice/Tables/Tables";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import { useGetAdditionalData } from "@/components/vendor/api";
import { queryClient } from "@/lib/utils";
import useFilterStore from "@/store/filtersStore";
import globalStore from "@/store/globalStore";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const InvoiceDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [markForReviewModal, setMarkForReviewModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("metadata");
  const [reviewLaterComments, setReviewLaterComments] = useState("");
  const { updatedFields, branchChanged, vendorChanged, clearUpdatedFields } =
    invoiceDetailStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({
    saving: false,
    rejecting: false,
    accepting: false,
    markingForReview: false
  });
  const { filters } = useFilterStore();
  const { mutate: updateTable } = useUpdateDocumentMetadata();
  const { mutate: markForReview, isPending: markingForReview } =
    useMarkReviewLater();
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
              path: "/vendor-consolidation",
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
            <Button className="bg-transparent w-[6.5rem] h-[2.4rem] border-[#F15156]  hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Reject
            </Button>
            <Button className="bg-transparent h-[2.4rem] border-primary w-[6.5rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
              Accept
            </Button>
            <Button className="bg-transparent h-[2.4rem] border-primary w-[7.25rem] hover:bg-transparent border-2 shadow-none text-[#000000] font-poppins font-normal text-sm">
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
              isLoading={isLoading}
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
                disabled={loadingState?.markingForReview}
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
      </Layout>
    </>
  );
};

export default InvoiceDetails;
