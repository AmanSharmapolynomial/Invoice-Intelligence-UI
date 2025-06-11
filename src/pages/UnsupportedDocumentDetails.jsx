import userStore from "@/components/auth/store/userStore";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import Sidebar from "@/components/common/Sidebar";
import {
  useGetUnSupportedDocuments,
  useUpdateDocumentStatus
} from "@/components/invoice/api";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import Loader from "@/components/ui/Loader";
import { formatDateTimeToReadable } from "@/lib/helpers";
import useFilterStore from "@/store/filtersStore";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const UnsupportedDocumentDetails = () => {
  const [searchParams] = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  let { userId } = userStore();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 1;
  let invoice_type = searchParams.get("invoice_type") || "";
  let human_verification =
    searchParams.get("human_verification") || filters?.human_verification;
  let human_verified =
    searchParams.get("human_verified") || filters?.human_verified;
  let detected =
    searchParams.get("invoice_detection_status") || filters?.detected || "all";
  let rerun_status =
    searchParams.get("rerun_status") || filters?.human_verified;
  let auto_accepted =
    searchParams.get("auto_accepted") || filters?.auto_accepted;
  let start_date = searchParams.get("start_date") || filters?.start_date;
  let end_date = searchParams.get("end_date") || filters?.end_date;
  let clickbacon_status =
    searchParams.get("clickbacon_status") || filters?.clickbacon_status;
  let restaurant =
    searchParams.get("restaurant_id") || searchParams.get("restaurant") || "";
  let vendor =
    searchParams.get("vendor_id") || searchParams.get("vendor") || "";
  let sort_order = searchParams.get("sort_order") || "desc";
  let invoice_number = searchParams.get("invoice_number") || "";
  let assigned_to = searchParams.get("assigned_to");
  let rejected = searchParams.get("rejected") || "all";
  let extraction_source = searchParams.get("extraction_source") || "all";
  let auto_accepted_by_vda = searchParams.get("auto_accepted_by_vda") || "all";
  let document_priority = searchParams.get("document_priority") || "all";
  let restaurant_tier =
    searchParams.get("restaurant_tier") == "null" ||
    searchParams.get("restaurant_tier") == "all"
      ? null
      : searchParams.get("restaurant_tier");
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
    page_size,
    page,
    sort_order,
    human_verified,
    assigned_to: userId,
    document_priority,
    auto_accepted_by_vda,
    review_later: "false",
    restaurant_tier: restaurant_tier || "all",
    rejected,
    extraction_source
  };
  const { data, isLoading } = useGetUnSupportedDocuments(payload);
  const { mutate: updateStatus } = useUpdateDocumentStatus();
  const [markingAsFlagged, setMarkingAsFlagged] = useState(false);
  const [markingAsSupported, setMarkingAsSupported] = useState(false);
  return (
    <div className="h-screen  flex w-full " id="maindiv">
      <Sidebar />
      <div className="w-full pl-12">
        {" "}
        <Navbar />
        <Layout>
          <BreadCrumb
            // title={"Unsupported Documents"}
            crumbs={[
              {
                path: null,
                label: "My Tasks"
              },
              {
                path: null,
                label: "Unsupported Documents"
              },

              {
                path: null,
                label: data?.data?.[0]?.restaurant?.restaurant_name
              }
            ]}
          />
          {
            isLoading?<div className="w-[90vw] h-[80vh] flex items-center justify-center"><Loader className={"!h-16 !w-16"}/></div>:
          
          <div className="w-full">
            <div className="gap-x-2 flex justify-between mt-2 items-center">
                <p className="capitalize font-poppins font-medium text-sm">Document Classifier Prediction - {data?.data?.[0]?.document_classifier_prediction}</p>
              <div className="flex  items-center gap-x-2">
                <div className="font-poppins font-medium mr-2 text-sm flex items-center gap-x-1">
              
                  <p className="rounded-md border px-3 py-1.5 flex items-center justify-center border-primary">{formatDateTimeToReadable(data?.data?.[0]?.date_uploaded) }</p>
                
                </div>
                <div className="font-poppins font-medium mr-2 text-sm flex items-center gap-x-1">
              
                  <p className="rounded-md border px-3 py-1.5 flex items-center justify-center border-primary">{data?.data?.[0]?.user_marked_as_unsupported ?"User Reviewed":"Not User Reviewed"}</p>
                
                </div>
                <CustomTooltip
                  className={"!min-w-80"}
                  content={
                    data?.data?.[0]?.action_controls
                      ?.mark_as_supported_or_unsupported?.disabled
                      ? data?.data?.[0]?.action_controls
                          ?.mark_as_supported_or_unsupported?.reason
                      : "Mark this document as a Supported Document."
                  }
                >
                  <Button
                    onClick={() => {
                      setMarkingAsSupported(true);
                      let payload = {
                        is_unsupported_document: false,
                        document_uuid: data?.data?.[0]?.document_uuid
                      };
                      updateStatus(payload, {
                        onSuccess: () => {
                          setMarkingAsSupported(false);
                        },
                        onError: () => {
                          setMarkingAsSupported(false);
                        }
                      });
                    }}
                    disabled={
                      data?.data?.[0]?.action_controls
                        ?.mark_as_supported_or_unsupported?.disabled ||
                      markingAsFlagged ||
                      markingAsSupported
                    }
                    className="rounded-sm font-poppins font-normal  text-sm"
                  >
                    Supported
                  </Button>
                </CustomTooltip>
                <CustomTooltip
                  className={"!min-w-80"}
                  content={
                    data?.data?.[0]?.action_controls
                      ?.mark_as_supported_or_unsupported?.disabled
                      ? data?.data?.[0]?.action_controls
                          ?.mark_as_supported_or_unsupported?.reason
                      : "Mark this document as a Flagged Document."
                  }
                >
                  <Button
                    onClick={() => {
                      setMarkingAsFlagged(true);
                      let payload = {
                        is_unsupported_document: true,
                        document_uuid: data?.data?.[0]?.document_uuid
                      };
                      updateStatus(payload, {
                        onSuccess: () => {
                          setMarkingAsFlagged(false);
                        },
                        onError: () => {
                          setMarkingAsFlagged(false);
                        }
                      });
                    }}
                    disabled={
                      data?.data?.[0]?.action_controls
                        ?.mark_as_supported_or_unsupported?.disabled ||
                      markingAsFlagged ||
                      markingAsSupported
                    }
                    className="rounded-sm font-poppins font-normal  text-sm"
                  >
                    Not Supported
                  </Button>
                </CustomTooltip>
              </div>

            </div>


            <div className="w-full flex gap-x-2 ">
              <div className="w-[100%] ">
                <PdfViewer
                  pdfUrls={[
                    {
                      document_link: data?.data?.[0]?.document_link,
                      document_source: data?.data?.[0]?.document_source
                    }
                  ]}
                />
              </div>
            </div>
          </div>}
        </Layout>
      </div>
    </div>
  );
};

export default UnsupportedDocumentDetails;
