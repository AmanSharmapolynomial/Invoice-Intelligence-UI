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

import { Skeleton } from "@/components/ui/skeleton";
import { useGetVendorItemMaster } from "@/components/vendor/api";
import FIVPdfViewer from "@/components/vendor/vendorItemMaster/FIVPdfViewer";
import SimilarItems from "@/components/vendor/vendorItemMaster/SImilarItems";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
const FastItemVerification = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  let document_uuid = searchParams.get("document_uuid") || "";
  let page = searchParams.get("page") || 1;
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

  const { data: pdfsData, isLoading: loadingPdfs } =
    useGetItemMasterPdfs(item_uuid);
  const { data: similarItems, isLoading: loadinSimilarItems } =
    useGetItemMastSimilarItems({ item_uuid: item_uuid, threshold: 60 });
  const navigate = useNavigate();
 
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
          <div className="w-full flex justify-end items-center ">
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
              <FIVPdfViewer
                document_source={pdfsData?.data[0]?.document_source}
                document_link={pdfsData?.data[0]?.document_link}
                isLoading={loadingPdfs}
                lineItem={pdfsData?.data?.[0]?.line_item}
              />
            </div>
          )}
          <div className="flex flex-col gap-y-2 mt-4 px-16 ">
            <VendorItemMasterTable
              data={data}
              pdfsData={pdfsData}
              isLoading={isLoading}
              extraHeaders={["Approved",  "Actions"]}
            />
          </div>

          {/* Similar Items Accordion */}
         {similarItems?.data?.total_matches >0&& <div className="px-16 mt-6">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="border  rounded-md px-4 border-[#E0E0E0] "
              >
                <AccordionTrigger className="hover:no-underline  border-b font-poppins font-semibold text-sm">
                  Similar Items ({similarItems?.data?.total_matches || 0})
                </AccordionTrigger>
                <AccordionContent>
                  <SimilarItems
                    data={similarItems}
                    isLoading={loadinSimilarItems}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>}
        </Layout>
      </div>
    </div>
  );
};

export default FastItemVerification;
