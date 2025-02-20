import approved from "@/assets/image/approved.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { useGetItemMastSimilarItems } from "@/components/invoice/api";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteVendorItemMaster,
  useGetVendorItemMaster,
  useGetVendorItemMasterAllItems,
  useMergeVendorItemMaster,
  useUpdateVendorItemMaster
} from "@/components/vendor/api";
import FIVPagination from "@/components/vendor/vendorItemMaster/FIVPagination";
import FIVPdfViewer from "@/components/vendor/vendorItemMaster/FIVPdfViewer";
import SimilarItems from "@/components/vendor/vendorItemMaster/SImilarItems";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import { OLD_UI } from "@/config";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { truncate } from "lodash";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useParams, useSearchParams } from "react-router-dom";
const FastItemVerification = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  let document_uuid = searchParams.get("document_uuid") || "";
  let page = searchParams.get("page") || 1;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingState, setLoadingState] = useState({
    nextAndSaving: false,
    nextAndApproving: false,
    groupingAndApproving: false,
    deletingAndNext: false
  });

  const {
    setFIVDocumentLink,
    setFIVDocumentSource,
    setFIVCurrentItem,
    setFIVBoundingBoxes,
    setFIVDocumentUUID,
    fiv_document_uuid,
    is_good_document,
    setIsGoodDocument,
    fiv_items,
    setFIVItems,
    fiv_current_item,
    resetStore,
    setFIVItemNumber,
    fiv_item_number,
    isGoodDocument,
    setFIVVerifiedItemsCount,
    setFIVTotalItemsCount,
    fiv_total_items_count,
    fiv_verified_items_count
  } = fastItemVerificationStore();

  const [selectedItems, setSelectedItems] = useState([]);
  const updateParams = useUpdateParams();
  const [masterUUID, setMasterUUID] = useState(null);
  let vendor_name = searchParams.get("vendor_name");
  let human_verified = searchParams.get("human_verified");
  const { data, isLoading } = useGetVendorItemMaster({
    page_size: 1,
    vendor_id,
    document_uuid: document_uuid,
    human_verified: "",
    category_review_required: "",
    verified_by: "",
    item_code: "",
    item_description: "",
    page: page,
    is_bounding_box_present: true
  });

  const item_uuid = fiv_current_item?.item_uuid;
  useEffect(() => {
    setFIVDocumentLink(data?.data?.item?.[0]?.document_link);
    setFIVDocumentSource(data?.data?.item?.[0]?.document_source);
    setFIVCurrentItem(data?.data?.item?.[0]);
  }, [data, isLoading]);

  const total_items = fiv_items?.length || 0;
  const { data: similarItems, isLoading: loadinSimilarItems } =
    useGetItemMastSimilarItems({ item_uuid: item_uuid, threshold: 60 });
  const { mutate: getAllItems } = useGetVendorItemMasterAllItems();

  const { mutate: mergeItemMaster, isPending: mergingItemMaster } =
    useMergeVendorItemMaster();
  const {
    mutate: updateVendorItemMaster,
    isPending: updatingVendorItemMaster
  } = useUpdateVendorItemMaster();

  const { mutate: deleteVendorItem } = useDeleteVendorItemMaster();

  useEffect(() => {
    setIsAccordionOpen(false);
  }, [page]);

  useEffect(() => {
    if (fiv_items?.length == 0 && data?.data?.item?.[0]?.document_uuid) {
      setFIVDocumentUUID(data?.data?.item?.[0]?.document_uuid);

      getAllItems(
        {
          vendor_id,
          document_uuid: data?.data?.item?.[0]?.document_uuid,
          page: page
        },
        {
          onSuccess: (data) => {
            setFIVItems(
              data?.data?.items?.filter(
                (it) => it.item_uuid !== fiv_current_item?.item_uuid
              )
            );
            setIsGoodDocument(false);
            setFIVTotalItemsCount(data?.data?.total_item_count);
            setFIVVerifiedItemsCount(data?.data?.verified_item_count);
            setFIVCurrentItem(
              data?.data?.items?.length == 1
                ? data?.data?.items[fiv_item_number]
                : data?.data?.items[fiv_item_number + 1]
            );
          }
        }
      );
    }
  }, [fiv_items, data]);
  useEffect(() => {
    if (fiv_items?.length !== 0) {
      setIsGoodDocument(true);
    }
  }, [data]);

  // Handlers
  const approveAndNextHandler = () => {
    setLoadingState((prev) => ({ ...prev, nextAndApproving: true }));

    updateVendorItemMaster(
      {
        item_uuid: fiv_current_item?.item_uuid,
        data: { human_verified: true }
      },
      {
        onSuccess: () => {
          setLoadingState((prev) => ({ ...prev, nextAndApproving: false }));

          // Update item verification state
          const updatedItems = fiv_items.map((item) =>
            item.item_uuid === fiv_current_item?.item_uuid
              ? { ...item, human_verified: true }
              : item
          );

          setFIVItems(updatedItems);
          setIsGoodDocument(fiv_items.length === 0);
          setFIVVerifiedItemsCount(Number(fiv_verified_items_count) + 1);

          // Handle pagination & moving to the next item
          if (fiv_items?.length == 0) {
            getAllItems(
              {
                vendor_id,
                document_uuid: data?.data?.item?.[0]?.document_uuid,
                page: page
              },
              {
                onSuccess: (data) => {
                  setFIVItems(
                    data?.data?.items?.filter(
                      (it) => it.item_uuid !== fiv_current_item?.item_uuid
                    )
                  );
                  setIsGoodDocument(false);
      
                  setFIVCurrentItem(data?.data?.items[fiv_item_number + 2]);
                }
              }
            );
          }
          if (fiv_item_number < total_items - 1) {
            setFIVItemNumber(Number(fiv_item_number) + 1);
            setFIVCurrentItem(fiv_items[Number(fiv_item_number)]);
          } else {
            if (fiv_item_number >= total_items - 1) {
              if ((page<=data?.data?.total_item_count)) {
                updateParams({ page: Number(page) + 1 });
              }
              setFIVItemNumber(0);
              setFIVCurrentItem({});
              resetStore();
            }
          }
      
        },
        onError: () => {
          setLoadingState((prev) => ({ ...prev, nextAndApproving: false }));
        }
      }
    );
  };

  const saveAndNextHandler = () => {
    setLoadingState((prev) => ({ ...prev, nextAndSaving: true }));

    // Construct payload from required columns
    let payload = fiv_current_item?.required_columns?.reduce((acc, key) => {
      if (key !== "category" && fiv_current_item?.line_item?.[key]) {
        acc[key] = fiv_current_item.line_item[key].text || "";
      }
      return acc;
    }, {});

    payload.human_verified = fiv_current_item?.human_verified;

    updateVendorItemMaster(
      { item_uuid: fiv_current_item?.item_uuid, data: payload },
      {
        onSuccess: () => {
          setLoadingState((prev) => ({ ...prev, nextAndSaving: false }));

          // Update item verification state
          const updatedItems = fiv_items.map((item) =>
            item.item_uuid === fiv_current_item?.item_uuid
              ? { ...item, payload }
              : item
          );

          setFIVItems(updatedItems);
          setIsGoodDocument(fiv_items.length === 0);
          if (fiv_items?.length == 0) {
            getAllItems(
              {
                vendor_id,
                document_uuid: data?.data?.item?.[0]?.document_uuid,
                page: page
              },
              {
                onSuccess: (data) => {
                  setFIVItems(
                    data?.data?.items?.filter(
                      (it) => it.item_uuid !== fiv_current_item?.item_uuid
                    )
                  );
                  setIsGoodDocument(false);

                  setFIVCurrentItem(data?.data?.items[fiv_item_number + 2]);
                }
              }
            );
          }
          // Handle pagination & moving to the next item

          if (fiv_item_number < total_items - 1) {
            setFIVItemNumber(fiv_item_number + 1);
            setFIVCurrentItem(fiv_items[fiv_item_number + 1]);
          } else if (!data?.is_final_page) {
            updateParams({ page: Number(page) + 1 });
            resetStore();
          }
        },
        onError: () => {
          setLoadingState((prev) => ({ ...prev, nextAndSaving: false }));
        }
      }
    );
  };

  const groupAndApproveAndNextHandler = () => {
    setLoadingState((prev) => ({ ...prev, groupingAndApproving: true }));

    updateVendorItemMaster(
      {
        item_uuid: fiv_current_item?.item_uuid,
        data: { human_verified: true }
      },
      {
        onSuccess: () => {
          setFIVCurrentItem({ ...fiv_current_item, human_verified: true });
          setFIVVerifiedItemsCount(Number(fiv_verified_items_count) + 1);
        },
        onError: () => {
          setFIVCurrentItem({ ...fiv_current_item, human_verified: false });
        }
      }
    );

    mergeItemMaster(
      {
        master_item_uuid: masterUUID ? masterUUID : fiv_current_item?.item_uuid,
        items_to_merge: [
          ...selectedItems,
          masterUUID && fiv_current_item?.item_uuid
        ]?.filter((it) => it !== masterUUID)
      },
      {
        onSuccess: () => {
          if (fiv_items?.length == 0) {
            getAllItems(
              {
                vendor_id,
                document_uuid: data?.data?.item?.[0]?.document_uuid,
                page: page
              },
              {
                onSuccess: (data) => {
                  setFIVItems(
                    data?.data?.items?.filter(
                      (it) => it.item_uuid !== fiv_current_item?.item_uuid
                    )
                  );
                  setIsGoodDocument(false);

                  setFIVCurrentItem(data?.data?.items[fiv_item_number + 2]);
                }
              }
            );
          }
          if (fiv_item_number < total_items - 1) {
            setFIVCurrentItem(fiv_items[Number(fiv_item_number) + 2]);
            setFIVItemNumber(Number(fiv_item_number) + 1);
          } else if (!data?.is_final_page) {
            updateParams({ page: Number(page) + 1 });
            resetStore();
          }
          setFIVCurrentItem({
            ...fiv_current_item,
            human_verified: true
          });

          setSelectedItems([]);
          setMasterUUID(null);
          setIsAccordionOpen(false);
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
        },
        onError: () => {
          setFIVCurrentItem({ ...fiv_current_item, human_verified: false });
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
        }
      }
    );
  };

  const deleteAndNextHandler = (type) => {
    setLoadingState((prev) => ({ ...prev, deletingAndNext: true }));

    deleteVendorItem(
      { type, item_uuid: fiv_current_item?.item_uuid },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setLoadingState((prev) => ({ ...prev, deletingAndNext: false }));

          // Filter out the deleted item from fiv_items
          const updatedItems = fiv_items.filter(
            (item) => item.item_uuid !== fiv_current_item?.item_uuid
          );

          setFIVItems(updatedItems);

          if (updatedItems.length > 0) {
            // Set next item as current if available
            if (fiv_item_number < updatedItems.length) {
              setFIVCurrentItem(updatedItems[fiv_item_number]);
            } else {
              // If we deleted the last item in the array, go to previous index
              setFIVItemNumber(updatedItems.length - 1);
              setFIVCurrentItem(updatedItems[updatedItems.length - 1]);
            }
          } else {
            // If no items left, move to next page or reset
            if (!data?.is_final_page) {
              updateParams({ page: Number(page) + 1 });
            }
            resetStore();
          }
        },
        onError: () => {
          setLoadingState((prev) => ({ ...prev, deletingAndNext: false }));
        }
      }
    );
  };

  useEffect(() => {
    if (
      fiv_total_items_count !== 0 &&
      fiv_verified_items_count !== 0 &&
      fiv_total_items_count == fiv_verified_items_count
    ) {
      setFIVCurrentItem({});
      setIsAccordionOpen(false);
    }
  }, [fiv_total_items_count, fiv_verified_items_count]);

  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full h-full ml-14">
        <Navbar />
        <Layout>
          <Toaster />
          <BreadCrumb
            showCustom={true}
            title={`Fast Item Verification ${
              vendor_name && "| "
            } ${vendor_name}`}
            crumbs={[{ path: null, label: "Fast Item Verification" }]}
          >
            {human_verified == "true" && (
              <img src={approved} alt="" className="h-4 w-4" />
            )}
          </BreadCrumb>
          <div className="w-full flex justify-end items-center ">
            <ProgressBar
              title={"Verified Items"}
              currentValue={fiv_verified_items_count}
              totalValue={fiv_total_items_count}
            />
          </div>
          {isLoading ? (
            <div className="md:px-44  flex items-center justify-center">
              <Skeleton className={" w-full h-[26vh]"} />
            </div>
          ) : (
            <div className="md:px-44  flex items-center justify-center">
              {!isAccordionOpen && <FIVPdfViewer />}
            </div>
          )}
          <div className="flex flex-col gap-y-2 mt-4 px-16 ">
            <VendorItemMasterTable
              data={data}
              similarItems={similarItems}
              required_columns={data?.data?.required_columns}
              isLoading={isLoading}
              human_verified={data?.data?.human_verified}
              extraHeaders={["Approved"]}
            />
          </div>

          {/* Similar Items Accordion */}

          <div className="px-16 mt-6">
            <Accordion
              type="single"
              collapsible
              value={isAccordionOpen ? "item-1" : ""}
              onValueChange={(val) => {
                if (similarItems?.data?.total_matches > 0) {
                  setIsAccordionOpen(val === "item-1");
                }
              }}
            >
              <AccordionItem
                value="item-1"
                className="border  rounded-md px-4 border-[#E0E0E0] "
              >
                <AccordionTrigger className="hover:no-underline  border-b font-poppins font-semibold text-sm">
                  Similar Items ({similarItems?.data?.total_matches || 0})
                </AccordionTrigger>
                <AccordionContent>
                  <SimilarItems
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    data={similarItems}
                    masterUUID={masterUUID}
                    setMasterUUID={setMasterUUID}
                    isLoading={loadinSimilarItems}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="min-w-full justify-between  flex items-center mt-4 px-16">
            <div>
              <Button
                disabled={!data?.data?.item?.[0]?.document_uuid}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                <Link
                  to={`/invoice-details?document_uuid=${data?.data?.item?.[0]?.document_uuid}`}
                  target="_blank"
                >
                  View Invoice
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-x-4">
              <Button
                disabled={
                  !data?.data?.item?.[0]?.document_uuid ||
                  loadingState?.nextAndApproving ||
                  loadingState.groupingAndApproving ||
                  data?.data?.item?.length == 0 ||
                  fiv_total_items_count === fiv_verified_items_count
                }
                onClick={() => {
                  if (selectedItems?.length > 0) {
                    groupAndApproveAndNextHandler();
                  } else {
                    approveAndNextHandler(fiv_current_item?.item_uuid, {
                      human_verified: true
                    });
                  }
                }}
                className={`${
                  fiv_current_item?.human_verified &&
                  selectedItems?.length == 0 &&
                  "hidden"
                } rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border`}
              >
                {(
                  selectedItems?.length > 0
                    ? loadingState.groupingAndApproving
                    : loadingState?.nextAndApproving
                )
                  ? selectedItems?.length > 0 || masterUUID
                    ? "Grouping & Approving..."
                    : "Approving..."
                  : selectedItems?.length > 0 || masterUUID
                  ? "Group & Approve & Next"
                  : "Approve & Next"}
              </Button>
              <Button
                disabled={
                  loadingState?.nextAndSaving ||
                  data?.data?.item?.length == 0 ||
                  fiv_total_items_count === fiv_verified_items_count
                }
                onClick={() => {
                  saveAndNextHandler();
                }}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                {loadingState?.nextAndSaving ? "Saving..." : "Save & Next"}
              </Button>
              <Button
                disabled={
                  data?.data?.item?.length == 0 ||
                  fiv_total_items_count === fiv_verified_items_count
                }
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                {"Delete & Next"}
              </Button>

              <FIVPagination
                data={data}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                masterUUID={masterUUID}
                isAccordionOpen={isAccordionOpen}
                setIsAccordionOpen={setIsAccordionOpen}
                setMasterUUID={setMasterUUID}
              />
            </div>
          </div>
        </Layout>
      </div>
      <Modal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        className={"z-50"}
        title={"  Are you sure to delete this item ?"}
      >
        <ModalDescription>
          <p className="font-normal font-poppins text-base  text-black"></p>
          <div className="mt-2 flex items-center gap-x-2 justify-end">
            <Button
              disabled={true}
              onClick={() => {
                deleteAndNextHandler("hard");
              }}
              className="bg-red-500 rounded-sm font-poppins text-xs px-3 hover:bg-red-500"
            >
              Hard Delete
            </Button>
            <Button
              onClick={() => {
                deleteAndNextHandler("soft");
              }}
              disabled={loadingState?.deletingAndNext}
              className=" font-poppins rounded-sm text-xs px-3 "
            >
              {loadingState?.deletingAndNext ? "Deleting.." : "Soft Delete"}
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="rounded-sm font-poppins font-normal text-xs px-3 bg-transparent border border-primary text-black hover:bg-transparent"
            >
              Close
            </Button>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default FastItemVerification;
