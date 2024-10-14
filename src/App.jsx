import direction from "@/assets/image/direction.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { useGetVendorNames } from "@/components/vendor/api";
import { Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./components/ui/input";
import { Modal, ModalDescription } from "./components/ui/Modal";
import { usePersistStore } from "./components/vendor/store/persisitStore";

function App() {
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
    const {setActualVendorName}=usePersistStore()
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  useEffect(() => {
    setFilteredVendors(vendorNamesList?.data?.vendor_names);
  }, [vendorNamesList]);
  useEffect(()=>{
    setActualVendorName(null)
  },[])
  return (
    <>
      <Layout>
        <Navbar />
        <div className=" w-full flex h-[90vh] gap-x-4  overflow-hidden bg-gray-100">
          <div className=" w-[30%] h-full !flex-1 flex-col px-10  flex !items-center gap-y-4 justify-center bg-gray-200 !bg-opacity-25 ">
            <Link to={"/home"} className="!w-full ">
              <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:!text-[#FFFFFF]">
                Invoice Balancing
              </Button>
            </Link>{" "}
            <Button
              className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:text-[#FFFFFF]"
              onClick={() => setOpen(!open)}
            >
              Vendor & Branch Verification
            </Button>
            <Link to={""} className="!w-full ">
              <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:text-[#FFFFFF]">
                Fast Item Master Verification
              </Button>
            </Link>
            <Link to={"/user-activity"} className="!w-full ">
              <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:text-[#FFFFFF]">
                User Activity
              </Button>
            </Link>
            <Link to={""} className="!w-full ">
              <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:text-[#FFFFFF]">
                Invoice Assignment
              </Button>
            </Link>
            <Link to={"/invoice-processor"} className="!w-full ">
              <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-primary/90 hover:text-[#FFFFFF]">
                Invoice Processor
              </Button>
            </Link>
          </div>
          <div className=" w-[70%] flex h-full justify-center items-center">
            <iframe
              src={direction}
              style={{ height: "900px", width: "800px" }}
              alt=""
              className="img-fluid !pt-44"
            />
          </div>
        </div>
      </Layout>
      <Modal
        open={open}
        setOpen={setOpen}
        className=""
        title={"Available Vendors"}
      >
        <ModalDescription>
          <div className="flex flex-col gap-y-4 overflow-scroll">
            <Input
              placeholder="Search Vendor Name"
              className="border border-gray-200  focus:!ring-0 focus:!outline-none remove-number-spinner"
              value={vendorName}
              onChange={(e) => {
                if (e.target.value == "") {
                  setFilteredVendors(vendorNamesList?.data?.vendor_names);
                  setVendorName("");
                } else {
                  setVendorName(e.target.value);
                  let filtered = vendorNamesList?.data?.vendor_names?.filter(
                    ({ vendor_name }) =>
                      vendor_name
                        ?.toLowerCase()
                        ?.trim()
                        ?.includes(vendorName?.toLowerCase()?.trim())
                  );
                  setFilteredVendors(filtered);
                }
              }}
            />

            <div className=" flex flex-col gap-y-2 max-h-72 h-48 overflow-auto">
              {filteredVendors?.length > 0 ? (
                filteredVendors?.map(
                  ({ vendor_id, vendor_name, human_verified }) => (
                    <Link
                      to={`/vendor-details/${vendor_id}`}
                      key={vendor_id}
                      className="flex w-full justify-between py-1 cursor-pointer items-center border rounded-sm px-3 bg-gray-100"
                    >
                      <p className="capitalize">{vendor_name}</p>
                      <p>
                        {human_verified && (
                          <Verified className="h-4 w-4 text-primary" />
                        )}
                      </p>
                    </Link>
                  )
                )
              ) : (
                <p className="w-full flex justify-center h-full mt-16">
                  No Item Found.
                </p>
              )}
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </>
  );
}

export default App;
