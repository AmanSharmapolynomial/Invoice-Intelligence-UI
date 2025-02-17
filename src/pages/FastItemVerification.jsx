import approved from "@/assets/image/approved.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import {
  useGetItemMasterPdfs,
  useGetItemMastSimilarItems
} from "@/components/invoice/api";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetVendorItemMaster,
  useMergeVendorItemMaster,
  useUpdateVendorItemMaster
} from "@/components/vendor/api";
import FIVPdfViewer from "@/components/vendor/vendorItemMaster/FIVPdfViewer";
import SimilarItems from "@/components/vendor/vendorItemMaster/SImilarItems";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { queryClient } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
const FastItemVerification = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  let document_uuid = searchParams.get("document_uuid") || "";
  let page = searchParams.get("page") || 1;
  const [loadingState, setLoadingState] = useState({
    nextAndSaving: false,
    nextAndApproving: false,
    groupingAndApproving: false
  });
  const [updateHumanVerified, setUpdateHumanVerified] = useState({
    status: null,
    index: -1,
    key: null
  });
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  let vendor_name = searchParams.get("vendor_name");
  let human_verified = searchParams.get("human_verified");
  const { data, isLoading } = useGetVendorItemMaster({
    page: 1,
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

  const item_uuid = data?.data?.items[0]?.item_uuid;
  const is_bounding_box = data?.data?.items[0]?.is_bounding_box_present;
  const updateParams = useUpdateParams();
  const { data: pdfsData, isLoading: loadingPdfs } =
    useGetItemMasterPdfs(item_uuid);
  const { data: similarItems, isLoading: loadinSimilarItems } =
    useGetItemMastSimilarItems({ item_uuid: item_uuid, threshold: 60 });
  const navigate = useNavigate();
  const { mutate: mergeItemMaster, isPending: mergingItemMaster } =
    useMergeVendorItemMaster();
  const {
    mutate: updateVendorItemMaster,
    isPending: updatingVendorItemMaster
  } = useUpdateVendorItemMaster();

  const approveAndNextHandler = (uuid, payload) => {
    setLoadingState((prev) => ({ ...prev, nextAndApproving: true }));

    updateVendorItemMaster(
      { item_uuid: uuid, data: payload },
      {
        onSuccess: () => {
          setLoadingState((prev) => ({ ...prev, nextAndApproving: false }));

          if (updateHumanVerified.key == "human_verified") {
            setUpdateHumanVerified((prevState) => ({
              ...prevState,
              status: true
            }));
          }
          let copyObj = { ...data };
          let { items } = copyObj.data;

          items.find((it) => it.item_uuid == uuid).human_verified = true;

          queryClient.setQueryData(["vendor-item-master"], copyObj);
          if (page !== data?.total_pages) {
            updateParams({ page: Number(page) + 1 });
          }
        },
        onError: (e) => {
          let copyObj = { ...data };
          let { items } = copyObj.data;

          items.find((it) => it.item_uuid == uuid).human_verified = false;

          queryClient.setQueryData(["vendor-item-master"], copyObj);
          setLoadingState((prev) => ({ ...prev, nextAndApproving: false }));
        }
      }
    );
  };

  const saveAndNextHandler = (uuid, payload) => {
    setLoadingState((prev) => ({ ...prev, nextAndSaving: true }));

    updateVendorItemMaster(
      { item_uuid: uuid, data: payload },
      {
        onSuccess: () => {
          setLoadingState((prev) => ({ ...prev, nextAndSaving: false }));

          if (updateHumanVerified.key == "human_verified") {
            setUpdateHumanVerified((prevState) => ({
              ...prevState,
              status: true
            }));
          }

          if (page !== data?.total_pages) {
            updateParams({ page: Number(page) + 1 });
          }
        },
        onError: (e) => {
          setLoadingState((prev) => ({ ...prev, nextAndSaving: false }));
        }
      }
    );
  };

  const groupAndApproveAndNextHandler = () => {
    if (!data?.data?.items?.[0]?.category?.category_id) {
      toast.error("Category cannot be None.");
      return;
    }
    setLoadingState((prev) => ({ ...prev, groupingAndApproving: true }));
    updateVendorItemMaster(
      {
        item_uuid: data?.data?.items?.[0]?.item_uuid,
        data: { ...data?.data?.items?.[0], human_verified: true }
      },
      {
        onSuccess: () => {
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
          if (updateHumanVerified.key == "human_verified") {
            setUpdateHumanVerified((prevState) => ({
              ...prevState,
              status: true
            }));
          }
          let copyObj = { ...data };
          let { items } = copyObj.data;

          items.find((it) => it.item_uuid == uuid).human_verified = true;

          queryClient.setQueryData(["vendor-item-master"], copyObj);
        },
        onError: (e) => {
          let copyObj = { ...data };
          let { items } = copyObj.data;

          items.find((it) => it.item_uuid == uuid).human_verified = false;

          queryClient.setQueryData(["vendor-item-master"], copyObj);
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
        }
      }
    );
    setLoadingState((prev) => ({ ...prev, groupingAndApproving: true }));
    mergeItemMaster(
      {
        master_item_uuid: data?.data?.items?.[0]?.item_uuid,
        items_to_merge: selectedItems
      },
      {
        onSuccess: () => {
          if (page !== data?.total_pages) {
            updateParams({ page: Number(page) + 1 });
          }
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
          setSelectedItems([]);
        },
        onError: () => {
          setLoadingState((prev) => ({ ...prev, groupingAndApproving: false }));
        }
      }
    );
  };

  return (
    <div className="h-screen flex w- overflow-x-hidden" id="maindiv">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            showCustom={true}
            title={`Fast Item Verification ${
              vendor_name && "| "
            } ${vendor_name}`}
            crumbs={[{ path: null, label: "Fast Item Verification" }]}
          >
            {human_verified && (
              <img src={approved} alt="" className="h-4 w-4" />
            )}
          </BreadCrumb>
          <div className="w-full flex justify-end items-center px-16 ">
            <ProgressBar
              title={"Verified Items"}
              currentValue={data?.data?.verified_item_count}
              totalValue={data?.data?.total_item_count}
            />
          </div>
          {isLoading ? (
            <div className="md:px-44  flex items-center justify-center">
              <Skeleton className={" w-full h-[26vh]"} />
            </div>
          ) : (
            <div className="md:px-44  flex items-center justify-center">
              {!isAccordionOpen&&<FIVPdfViewer
                document_source={pdfsData?.data[0]?.document_source}
                document_link={pdfsData?.data[0]?.document_link}
                isLoading={loadingPdfs}
                lineItem={pdfsData?.data?.[0]?.line_item}
              />}
            </div>
          )}
          <div className="flex flex-col gap-y-2 mt-4 px-16 ">
            <VendorItemMasterTable
              data={data}
              pdfsData={pdfsData}
              isLoading={isLoading}
              extraHeaders={["Approved", "Actions"]}
            />
          </div>

          {/* Similar Items Accordion */}
          {similarItems?.data?.total_matches > 0 && (
            <div className="px-16 mt-6">
              <Accordion type="single" collapsible value={isAccordionOpen ? "item-1" : ""} onValueChange={(val) => setIsAccordionOpen(val === "item-1")}>
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
                      isLoading={loadinSimilarItems}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          <div className="min-w-full justify-between  flex items-center mt-4 px-16">
            <div>
              <Button
                disabled={!pdfsData?.data?.[0]?.document_uuid}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                <Link
                  to={`/invoice-details?document_uuid=${pdfsData?.data[0]?.document_uuid}`}
                  target="_blank"
                >
                  View Invoice
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-x-4">
              <Button
                disabled={
                  !pdfsData?.data?.[0]?.document_uuid ||
                  loadingState?.nextAndApproving
                }
                onClick={() => {
                  if (selectedItems?.length > 0) {
                    groupAndApproveAndNextHandler();
                  } else {
                    approveAndNextHandler(data?.data?.items?.[0]?.item_uuid, {
                      ...data?.data?.items?.[0],
                      human_verified: true
                    });
                  }
                }}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                {(
                  selectedItems?.length > 0
                    ? loadingState.groupingAndApproving
                    : loadingState?.nextAndApproving
                )
                  ? selectedItems?.length > 0
                    ? "Grouping & Approving..."
                    : "Approving..."
                  : selectedItems?.length > 0
                  ? "Group & Approve & Next"
                  : "Approve & Next"}
              </Button>
              <Button
                disabled={
                  !pdfsData?.data?.[0]?.document_uuid ||
                  loadingState?.nextAndSaving
                }
                onClick={() => {
                  saveAndNextHandler(data?.data?.items?.[0]?.item_uuid, {
                    ...data?.data?.items?.[0]
                  });
                }}
                className="rounded-sm font-poppins font-normal text-sm bg-transparent hover:bg-transparent border-primary text-black border"
              >
                {loadingState?.nextAndSaving ? "Saving..." : "Save & Next"}
              </Button>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default FastItemVerification;
