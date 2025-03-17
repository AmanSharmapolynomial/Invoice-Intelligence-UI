import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { useCombineVendors, useGetVendorsPdfs } from "@/components/vendor/api";
import { useMarkAsNotDuplicate } from "@/components/vendor/potentialDuplicates/api";
import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const CombineDuplicateVendors = () => {
  const { vendor1, vendor2 } = useParams();
  const [searchParams] = useSearchParams();
  let vendor_1_name = searchParams.get("vendor_1_name");
  let vendor_2_name = searchParams.get("vendor_2_name");
  const navigate = useNavigate();
  const { data, isLoading } = useGetVendorsPdfs({
    vendor_one: vendor1,
    vendor_two: vendor2
  });
  const { mutate: markAsNotDuplicate, isPending: markingAsNotDuplicate } =
    useMarkAsNotDuplicate();
  const { mutate: combineVendors, isPending: combiningVendors } =
    useCombineVendors();

  const [vendor1PdfIndex, setVendor1PdfIndex] = useState(0);
  const [vendor2PdfIndex, setVendor2PdfIndex] = useState(0);

  return (
    <div className="overflow-hidden flex w-full">
      <Sidebar />

      <div className="w-full ml-12">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Combine Vendors"
            crumbs={[{ path: null, label: "Combine Vendors" }]}
          />
          <div className="px-10">
            {!isLoading && (
              <div className="flex items-center gap-x-16  justify-between max-w-full overflow-auto mb-2">
                <div className="w-full">
                  <p className="font-poppins font-semibold capitalize text-sm mt-2 mb-2">
                    {vendor_1_name}
                  </p>
                  <PdfViewer
                    pdfUrls={[...data?.data?.[vendor1]]}
                    multiple={true}
                    className={"!min-h-[45rem] !w-full"}
                  />
                </div>
                <div className="w-full">
                  <p className="font-poppins capitalize font-semibold text-sm mt-2 mb-2">
                    {vendor_2_name}
                  </p>
                  <PdfViewer
                    pdfUrls={[...data?.data?.[vendor2]]}
                    multiple={true}
                    className={"!min-h-[45rem] !w-full"}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-x-2 mb-2 justify-end">
              <div className="flex items-center gap-x-2">
                <Button
                  onClick={() => {
                    combineVendors(
                      { vendor_id: vendor1, data: [vendor2] },
                      {
                        onSuccess: () => {}
                      }
                    );
                  }}
                  className="rounded-sm font-poppins font-normal text-sm"
                >
                  {combiningVendors ? "Combining..." : "Combine"}
                </Button>
                <Button
                  disabled={markingAsNotDuplicate}
                  onClick={() => {
                    markAsNotDuplicate(vendor2, {
                      onSuccess: () => {
                        navigate("/vendors-potential-duplicates");
                      }
                    });
                  }}
                  className="rounded-sm font-poppins font-normal text-sm"
                >
                  {markingAsNotDuplicate ? "Marking..." : "Not Duplicate"}
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default CombineDuplicateVendors;
