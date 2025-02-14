import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { useGetItemMasterPdfs } from "@/components/invoice/api";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { useGetVendorItemMaster } from "@/components/vendor/api";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import approved from "@/assets/image/approved.svg";
import FIVPdfViewer from "@/components/vendor/vendorItemMaster/FIVPdfViewer";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import TablePagination from "@/components/common/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
              currentValue={data?.data?.verified_item_count }
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
              extraHeaders={["Approved", "Category Review", "Actions"]}
            />
         
          </div>

      
        </Layout>
      </div>
    </div>
  );
};

export default FastItemVerification;
