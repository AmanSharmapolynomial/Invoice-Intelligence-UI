import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";

import { Link, useNavigate, useParams } from "react-router-dom";

import { Modal, ModalDescription } from "@/components/ui/Modal";
import {
  useDeleteVendor,
  useDisapproveAllVendorItems,
  useGetAdditionalData,
  useGetVendorDetails,
  useGetVendorNotes,
  useUpdateVendorDetails
} from "@/components/vendor/api";
import VendorNotes from "@/components/vendor/notes/VendorNotes";
import { usePersistStore } from "@/components/vendor/store/persisitStore";
import InvoiceHeaderMapping from "@/components/vendor/vendorDetails/InvoiceHeaderMapping";
import InvoiceHeaderMappingExceptions from "@/components/vendor/vendorDetails/InvoiceHeaderMappingExceptions";
import VendorDetailsTable from "@/components/vendor/vendorDetails/VendorDetailsTable";
import VendorInvoiceColumnData from "@/components/vendor/vendorDetails/VendorInvoiceColumnData";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetVendorDetails(vendor_id);

  const [open, setOpen] = useState(false);

  const { data: vendorNotes, isLoading: vendorNotesLoading } =
    useGetVendorNotes(vendor_id);
  const { data: additionalData, isLoading: loadingAdditionalData } =
    useGetAdditionalData();
  const { mutate: updateVendorDetails, isPending: updatingVendorDetails } =
    useUpdateVendorDetails();

  const { mutate: deleteVendor, isPending: deletingVendor } = useDeleteVendor();
  const { setActualVendorName } = usePersistStore();
  useEffect(() => {
    setActualVendorName();
  }, []);
  const { mutate: disapproveAllItems, isPending: disapproving } =
    useDisapproveAllVendorItems();
  return (
    <>
      <Navbar className="" />

      <Layout>
        <BreadCrumb
          title={"Vendor Details"}
          crumbs={[
            {
              path: "",
              label: `${data?.data?.vendor_name}`
            },
            {
              path: "",
              label: `Details`
            }
          ]}
        />

        <div className="w-full flex justify-end items-center">
          <div className="flex items-center gap-x-2">
            {!vendorNotesLoading && (
              <VendorNotes data={vendorNotes} vendor_id={vendor_id} />
            )}
            <Button className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-transparent bg-transparent shadow-none text-[#000000] font-poppins font-normal text-xs border">
              Delete
            </Button>
            <Button className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-primary bg-transparent shadow-none text-[#FFFFFF] font-poppins font-normal text-xs border bg-primary">
              Save
            </Button>
          </div>
        </div>

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
            disabled={disapproving || updatingVendorDetails}
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
            disabled={disapproving || updatingVendorDetails}
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
            onClick={() => navigate(`/invoice-details?vendor=${vendor_id}`)}
            disabled={disapproving || updatingVendorDetails}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            View Invoices
          </Button>
          <Button
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>

          <Button
            disabled={disapproving || updatingVendorDetails}
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
            disabled={disapproving || updatingVendorDetails}
          >
            <Button
              disabled={disapproving || updatingVendorDetails}
              className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
            >
              View Branches
            </Button>
          </Link>
          <Button
            onClick={() => navigate(`/fast-item-verification/${vendor_id}`)}
            disabled={disapproving || updatingVendorDetails}
            className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
          >
            Fast Item Verification
          </Button>
          <Link
            disabled={disapproving || updatingVendorDetails}
            to={`/vendor-consolidation/vendor-item-master/${vendor_id}`}
          >
            <Button
              disabled={disapproving || updatingVendorDetails}
              className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary hover:text-[#FFFFFF]"
            >
              View Items
            </Button>
          </Link>
        </div>
        <Modal
          setOpen={setOpen}
          open={open}
          title={"Delete Vendor"}
          titleClassName={"border-b"}
        >
          <ModalDescription>
            <p className="font-medium pt-2 pb-4">
              Are you sure to delete this vendor ?
            </p>
            <p className="font-medium border-b pb-2 capitalize">
              Vendor Name : - {data?.data?.vendor_name}
            </p>
            <p className="font-medium py-2 border-b">
              Vendor Id : - {vendor_id}
            </p>

            <div className="flex justify-end pt-4 gap-x-2">
              <Button
                disabled={
                  deletingVendor || disapproving || updatingVendorDetails
                }
                className="bg-red-500 hover:bg-red-500/90 font-normal"
                onClick={() =>
                  deleteVendor(vendor_id, {
                    onSuccess: () => {
                      setOpen(false);
                      navigate("/vendor-consolidation");
                    }
                  })
                }
              >
                {deletingVendor ? (
                  <>
                    Deleting{" "}
                    <LoaderIcon className="!text-white ml-2 !bg-red-500" />{" "}
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                disabled={deletingVendor}
                className="font-normal bg-transparent text-gray-800 border hover:bg-white/70"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </ModalDescription>
        </Modal>
      </Layout>
    </>
  );
};

export default VendorDetails;
