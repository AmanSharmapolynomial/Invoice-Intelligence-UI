import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { NotebookIcon } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import VendorDetailsTable from "@/components/vendor/VendorDetailsTable";
import { useGetVendorDetails } from "@/components/vendor/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const { data, isLoading } = useGetVendorDetails(vendor_id);

  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  // console.log(data);s
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto"}>
        <Header
          title={`Vendor Details ${
            data?.data?.vendor_name ? " for " + data?.data?.vendor_name : ""
          }`}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !capitalize !text-[#FFFFFF] relative "
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className={"!absolute !right-4"}>
                {" "}
                <Button
                  className={" bg-[#FFFFFF] !w-fit hover:bg-[#FFFFFF] px-2"}
                >
                  <NotebookIcon className="text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm">
                <p>View Vendor Notes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Header>
        <VendorDetailsTable data={data?.data} isLoading={isLoading} />

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              Vendor Invoice Column Data
            </AccordionTrigger>
            <AccordionContent>
              <p>All Invoice Columns</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              Invoice Header Mapping
            </AccordionTrigger>
            <AccordionContent>
              <p>All Invoice Columns</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              Invoice Header Mapping - Exceptions
            </AccordionTrigger>
            <AccordionContent>
              <p>All Invoice Columns</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="w-full grid xl:grid-cols-4 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 mb-16">
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Save
          </Button>

          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Find Similar Vendors
          </Button>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            View Invoices
          </Button>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Delete
          </Button>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Disapprove All Items
          </Button>

          <Link to={`/vendor-branches/${vendor_id}`}>
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
              View Branches
            </Button>
          </Link>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Fast Item Verification
          </Button>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            View Items
          </Button>
        </div>
      </Layout>
    </>
  );
};

export default VendorDetails;
