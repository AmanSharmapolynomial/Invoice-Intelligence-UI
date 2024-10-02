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
import { useSearchParams } from "react-router-dom";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Label } from "../ui/label";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 8;
  let invoice_type = searchParams.get("invoice_type") ?? "all";
  const updateParams = useUpdateParams();
  const { data, isLoading } = useListInvoices({
    auto_accepted: "all",
    end_date: null,
    human_verification: "all",
    human_verified: "all",
    invoice_detection_status: "all",
    invoice_type: invoice_type,
    rerun_status: "both",
    restaurant: null,
    start_date: null,
    vendor: "all",
    page_size: page_size,
    page: page
  });
  const handleValueChange = (value) => {
    updateParams({invoice_type:value,page:1}); 
  };
  return (
    <>
      <Navbar></Navbar>
      <Layout className={"mx-10 rounded-md  border mt-8 !shadow-none "}>
        <Header
          className={"shadow-none bg-gray-200 relative"}
          showVC={true}
          showDeDuplication={true}
        >
          <Select
            className="!bg-[#FFFFFF]"
            placeholder={invoice_type}
            onValueChange={handleValueChange}
          >
            <Label className="mr-4">
              Invoice Type
            </Label>
            <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0 !bg-gray-100">
              <SelectValue placeholder={<span className="capitalize">{invoice_type}</span>??"Invoice Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Summary Invoice">Summay Invoice</SelectItem>
              <SelectItem value="Liquor Invoice">Liquor Invoice</SelectItem>
              <SelectItem value="Normal Invoice">Normal Invoice</SelectItem>
            </SelectContent>
          </Select>
        </Header>
        <InfoSection />
        <InvoiceTable data={data?.data} isLoading={isLoading} />
        <div className="w-full flex !justify-end  pt-2 z-10">
          <TablePagination
            totalPages={data?.total_pages}
            isFinalPage={data?.is_final_page}
            page={page}
            previousPage={data?.previous_page}
          />
        </div>
      </Layout>
    </>
  );
};

export default Home;
