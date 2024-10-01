import "@/App.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Header from "../common/Header";
import Layout from "../common/Layout";
import Navbar from "../common/Navbar";
import InfoSection from "./InfoSection";

import InvoiceTable from "@/components/invoice/InvoiceTable";
import { useListInvoices } from "./api";
import TablePagination from "../common/TablePagination";
import { Table } from "../ui/table";

const Home = () => {
  const { data, isLoading } = useListInvoices({
    auto_accepted: "all",
    end_date: null,
    human_verification: "all",
    human_verified: "all",
    invoice_detection_status: "all",
    invoice_type: "all",
    rerun_status: "both",
    restaurant: null,
    start_date: null,
    vendor_name: null,
    page_size: 8,
    page: 1
  });
  return (
    <>
      <Navbar></Navbar>
      <Layout className={"mx-10 rounded-md  border mt-8 !shadow-none "}>
        <Header
          className={"shadow-none bg-gray-100 relative"}
          showVC={true}
          showDeDuplication={true}
        >
          <Select>
            <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
              <SelectValue placeholder="Invoice Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="false">Raw Invoices</SelectItem>
              <SelectItem value="true">Verified Invoices</SelectItem>
            </SelectContent>
          </Select>
        </Header>
        <InfoSection />
        <InvoiceTable data={data?.data} isLoading={isLoading} />
       <div className="absolute right-14 bottom-14">
        <TablePagination/>
       </div>
      </Layout>
    </>
  );
};

export default Home;
