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
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";

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

        <div className="w-full flex justify-end items-center ">
          <div className="flex items-center gap-x-3">
            {!vendorNotesLoading && (
              <VendorNotes data={vendorNotes} vendor_id={vendor_id} />
            )}
            <Button
              onClick={() => setOpen(true)}
              className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-transparent bg-transparent shadow-none text-[#000000] font-poppins font-thin text-xs rounded-sm  border"
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                updateVendorDetails({ vendor_id, data });
              }}
              disabled={disapproving || updatingVendorDetails}
              className="h-[2.25rem] w-[5.5rem] border-primary flex justify-center hover:bg-primary bg-transparent shadow-none text-[#FFFFFF] font-poppins !font-thin text-xs rounded-sm border bg-primary"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
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
        </div>

        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2 mt-4 mb-16">
          <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.12)" }}
            className="p-2 rounded-xl"
          >
            {" "}
            <p className=" font-poppins  font-semibold text-[#222222] text-lg py-2 border-b border-b-[#F1F1F1]">
              <span className="px-2"> More Vendor Actions</span>
            </p>
            <div className="flex flex-col gap-y-4 justify-center my-2">
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  View Branches
                </p>
                <Link
                  to={`/vendor-branches/${vendor_id}`}
                  disabled={disapproving || updatingVendorDetails}
                >
                  <Button
                    disabled={disapproving || updatingVendorDetails}
                    className="h-[1.625rem] font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                  >
                    Click Here
                  </Button>
                </Link>
              </div>
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  View Invoices
                </p>
                <Button
                  disabled={disapproving || updatingVendorDetails}
                  onClick={() =>
                    navigate(`/invoice-details?vendor=${vendor_id}`)
                  }
                  className=" h-[1.625rem] font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                >
                  Click Here
                </Button>
              </div>{" "}
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  Find Similar Vendors
                </p>
                <Button
                  disabled={disapproving || updatingVendorDetails}
                  onClick={() => {
                    setActualVendorName(data?.data?.vendor_name);
                    navigate(
                      `/vendor-consolidation/combine-vendors/${vendor_id}`
                    );
                  }}
                  className=" h-[1.625rem] font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                >
                  Click Here
                </Button>
              </div>
            </div>
          </div>
          <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.12)" }}
            className="p-2 rounded-xl"
          >
            {" "}
            <p className=" font-poppins  font-semibold text-[#222222] text-lg py-2 border-b border-b-[#F1F1F1]">
              <span className="px-2"> Item Verification Actions</span>
            </p>
            <div className="flex flex-col gap-y-4 justify-center my-2">
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  Fast Item Verification
                </p>

                <Button
                  onClick={() =>
                    navigate(`/fast-item-verification/${vendor_id}`)
                  }
                  disabled={disapproving || updatingVendorDetails}
                  className="h-[1.625rem] !font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                >
                  Click Here
                </Button>
              </div>
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  View Items
                </p>
                <Button
                  disabled={disapproving || updatingVendorDetails}
                  onClick={() =>
                    navigate(
                      `/vendor-consolidation/vendor-item-master/${vendor_id}?vendor_name=${`'${data?.data?.vendor_name}'`}`
                    )
                  }
                  className=" h-[1.625rem] font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                >
                  Click Here
                </Button>
              </div>{" "}
              <div className="flex justify-between items-center px-2">
                <p className="font-poppins font-medium text-base text-[#222222]">
                  {" "}
                  Disapprove All Items
                </p>
                <Button
                  disabled={disapproving || updatingVendorDetails}
                  onClick={() => disapproveAllItems(vendor_id)}
                  className=" h-[1.625rem] font-thin text-xs bg-transparent border-primary border w-[5rem] rounded-sm font-poppins   bg-primary text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
                >
                  Click Here
                </Button>
              </div>
            </div>
          </div>
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
