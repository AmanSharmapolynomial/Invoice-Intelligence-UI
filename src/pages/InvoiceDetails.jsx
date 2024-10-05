import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { useGetInvoiceMetaData } from "@/components/invoice/api";
import { Button } from "@/components/ui/button";
import { useGetVendorNotes } from "@/components/vendor/api";
import VendorNotes from "@/components/vendor/VendorNotes";
import { useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const { invoice_id } = useParams();

  const { data, isLoading } = useGetInvoiceMetaData(invoice_id);
  const { data: vendorNotes, isLoading: vendorNotesLoading } =
    useGetVendorNotes(data?.["data"]?.["vendor_id"]);
 
  return (
    <>
      <Navbar />
      <Layout className={"mx-6 rounded-md  border mt-8 !shadow-none   "}>
        <Header
          className={
            "shadow-none bg-primary rounded-t-md !text-[#FFFFFF] relative overflow-auto"
          }
          showVC={true}
          title={"Invoice Details"}
          showDeDuplication={true}
        >
          {" "}
          <Button className=" bg-[#FFFFFF] text-black hover:bg-white/95">
            Re Run Invoices
          </Button>
          <VendorNotes  data={vendorNotes} vendor_id={data?.['data']?.['vendor_id']}/>
        </Header>
        <Header className={"!overflow-x-auto !overflow-y-visible"}>
        
        </Header>
      </Layout>
    </>
  );
};

export default InvoiceDetails;
