import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { PdfViewer } from "@/components/common/PDFViewer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetVendorsPdfs } from "@/components/vendor/api";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CompareInvoices = () => {
  const { vendor_one, vendor_two } = useParams();
  const { data, isLoading } = useGetVendorsPdfs({ vendor_one, vendor_two });

  return (
    <>
      <Navbar />

      <Layout className={"mx-10 box-border"}>
        <Header
          title={"Compare Vendors"}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative "
        />

        <div className="w-full flex gap-x-2 h-[80vh] overflow-hidden">
          <div className="w-1/2 border relative box-border overflow-hidden">
            <p className="flex justify-center py-4 font-semibold text-lg capitalize">
              {vendor_one} PDFs
            </p>

            {data?.data?.[vendor_one] && (
              <PdfViewer
                pdfList={data?.data?.[vendor_one]}
                title={vendor_one}
              />
            )}
          </div>
          <div className="w-1/2 border relative h-full !overflow-hidden">
            <p className="flex justify-center py-4 font-semibold text-lg capitalize">
              {vendor_two} PDFs
            </p>
            {data?.data?.[vendor_two] && (
              <PdfViewer
                pdfList={data?.data?.[vendor_two]}
                title={vendor_two}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CompareInvoices;
