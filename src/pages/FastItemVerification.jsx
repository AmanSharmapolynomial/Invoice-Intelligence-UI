import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import TablePagination from "@/components/common/TablePagination";
import { useGetItemMasterPdfs } from "@/components/invoice/api";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/Custom/ProgressBar";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  useGetVendorItemMaster
} from "@/components/vendor/api";
import VendorItemMasterTable from "@/components/vendor/vendorItemMaster/VendorItemMasterTable";
import { useParams, useSearchParams } from "react-router-dom";

const FastItemVerification = () => {
  const { vendor_id } = useParams();
  const [searchParams] = useSearchParams();
  let document_uuid = searchParams.get("document_uuid") || "";
  let page = searchParams.get("page") || 1;
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
    page: page
  });

  const item_uuid = data?.data?.items[0]?.item_uuid;
  const is_bounding_box = data?.data?.items[0]?.is_bounding_box_present;

  const { data: pdfsData, isLoading: loadingPdfs } =
    useGetItemMasterPdfs(item_uuid);

  return (
    <>
      <Navbar />
      <Layout className={"overflow-auto mx-10 mt-8 "}>
       
           <div className="flex  items-center justify-between">
           <ProgressBar
              title={"Verified Items"}
              currentValue={data?.data?.verified_item_count}
              totalValue={data?.data?.total_item_count}
            />
            <Button className="!h-[2.25rem] rounded-sm !font-thin w-[5.5rem] font-poppins text-xs">
              Save
            </Button>
           </div>
        
         
        <ResizablePanelGroup direction="vertical" className={"min-h-screen "}>
          <ResizablePanel defaultSize={50}>
            <PdfViewer
              showInvoiceButton
              pdfList={pdfsData?.data}
              isLoading={loadingPdfs}
              className="h-[400px]"
            >
              <p className="flex items-center ml-2">
                Bounding Box:{" "}
                {is_bounding_box ? (
                  <span className="h-5 w-5 rounded-full bg-primary ml-2" />
                ) : (
                  <span className="h-5 w-5 rounded-full bg-red-500 ml-2" />
                )}{" "}
              </p>
            </PdfViewer>
          </ResizablePanel>
          <ResizableHandle className={"w-1"} withHandle />
          <ResizablePanel className="!h-full !w-full flex flex-col">
            {" "}
            <VendorItemMasterTable
              isLoading={isLoading}
              data={data}
              extraHeaders={["Approved", "Category Review", "Actions"]}
            />
            <TablePagination
              totalPages={data?.total_pages}
              isFinalPage={data?.is_final_page}
            />
          </ResizablePanel>
        </ResizablePanelGroup>

      </Layout>
    </>
  );
};

export default FastItemVerification;
