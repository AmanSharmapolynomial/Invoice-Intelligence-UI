import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useDisapproveAllVendorItems,
  useGetAdditionalData,
  useGetVendorDetails,
  useGetVendorNotes,
  useUpdateVendorDetails
} from "@/components/vendor/api";
import VendorNotes from "@/components/vendor/notes/VendorNotes";
import { usePersistStore } from "@/components/vendor/store";
import InvoiceHeaderMapping from "@/components/vendor/vendorDetails/InvoiceHeaderMapping";
import InvoiceHeaderMappingExceptions from "@/components/vendor/vendorDetails/InvoiceHeaderMappingExceptions";
import VendorDetailsTable from "@/components/vendor/vendorDetails/VendorDetailsTable";
import VendorInvoiceColumnData from "@/components/vendor/vendorDetails/VendorInvoiceColumnData";
import { useEffect } from "react";
import { LoaderIcon } from "react-hot-toast";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetVendorDetails(vendor_id);
  const { data: vendorNotes, isLoading: vendorNotesLoading } =
    useGetVendorNotes(vendor_id);
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();
  const { mutate: updateVendorDetails, isPending: updatingVendorDetails } =
    useUpdateVendorDetails();
  const { setActualVendorName } = usePersistStore();
  useEffect(() => {
    setActualVendorName();
  }, []);
  const { mutate: disapproveAllItems, isPending: disapproving } =
    useDisapproveAllVendorItems();
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
          {!vendorNotesLoading && (
            <VendorNotes data={vendorNotes} vendor_id={vendor_id} />
          )}
        </Header>
        <VendorDetailsTable
          data={data}
          additionalData={additionalData?.data}
          isLoading={isLoading}
          vendor_id={vendor_id}
        />

        <VendorInvoiceColumnData
          additionalData={additionalData?.data}
          vendor_id={vendor_id}
          data={data}
        />
        <InvoiceHeaderMapping
          additionalData={additionalData?.data}
          vendor_id={vendor_id}
          data={data}
          isLoading={isLoading}
        />
        <InvoiceHeaderMappingExceptions
          additionalData={additionalData?.data}
          vendor_id={vendor_id}
        />

        <div className="w-full grid xl:grid-cols-4 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 mb-16">
          <Button
            onClick={() => {
              updateVendorDetails({ vendor_id, data });
            }}
            disabled={disapproving||updatingVendorDetails}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            {updatingVendorDetails ? (
              <>
                {" "}
                Saving
                <LoaderIcon className="ml-0.5" />{" "}
              </>
            ) : (
              "Save"
            )}
          </Button>
          <Button
        disabled={disapproving||updatingVendorDetails}
            onClick={() => {
              setActualVendorName(data?.data?.vendor_name);
              navigate(`/vendor-consolidation/combine-vendors/${vendor_id}`);
            }}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            Find Similar Vendors
          </Button>
          {/* </Link> */}
          <Button
            disabled={disapproving||updatingVendorDetails}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            View Invoices
          </Button>
          <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]">
            Delete
          </Button>

          <Button
            disabled={disapproving||updatingVendorDetails}
            onClick={() => disapproveAllItems(vendor_id)}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            {disapproving ? (
              <>
                Disapproving <LoaderIcon className="ml-0.5" />
              </>
            ) : (
              "Disapprove All Items"
            )}
          </Button>

          <Link
            to={`/vendor-branches/${vendor_id}`}
            disabled={disapproving||updatingVendorDetails}
          >
            <Button
              disabled={disapproving||updatingVendorDetails}
              className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
            >
              View Branches
            </Button>
          </Link>
          <Button
            disabled={disapproving||updatingVendorDetails}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            Fast Item Verification
          </Button>
          <Link
            disabled={disapproving||updatingVendorDetails}
            to={`/vendor-consolidation/vendor-item-master/${vendor_id}`}
          >
            <Button
              disabled={disapproving||updatingVendorDetails}
              className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
            >
              View Items
            </Button>
          </Link>
        </div>
      </Layout>
    </>
  );
};

export default VendorDetails;
