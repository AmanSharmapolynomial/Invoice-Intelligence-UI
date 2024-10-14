import direction from "@/assets/image/direction.svg";
import directions_text from "@/assets/image/directions-text.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { useGetVendorNames } from "@/components/vendor/api";
import { TestTube, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./components/ui/input";
import { Modal, ModalDescription } from "./components/ui/Modal";
import { usePersistStore } from "./components/vendor/store/persisitStore";
import CustomCard from "./components/ui/CustomCard";
import frame15 from "@/assets/image/frame-15.svg";

function App() {
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();
  const { setActualVendorName } = usePersistStore();
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  useEffect(() => {
    setFilteredVendors(vendorNamesList?.data?.vendor_names);
  }, [vendorNamesList]);
  const navigate = useNavigate();
  useEffect(() => {
    setActualVendorName(null);
  }, []);
  return (
    <>
      <Layout className={"h-screen !flex-1  overflow-hidden"}>
        <Navbar />
        <div className=" w-full flex h-full gap-x-4  overflow-hidden ">
          {/* Left Side */}
          <div className=" w-[50%] h-full !flex-1 flex-col flex !pt-[5.75%] gap-y-4 pl-[6.25rem] !bg-opacity-25 ">
            {" "}
            <div className="!text-left ">
              <p className="!font-poppins font-semibold text-[2rem] flex gap-x-2">
                <span className="text-primary ">Automated</span>
                <span className="text-primaryText">Invoice Solutions</span>
              </p>
              <p className="text-primaryText text-[1.25rem] font-poppins font-semibold w-full">
                Simplify Processing, Verification, and User
              </p>
              <p className="text-primaryText text-[1.25rem] font-poppins font-semibold">
                Monitoring
              </p>
            </div>
            <img
              src={direction}
              style={{ height: "22.32rem", width: "31.72rem" }}
              alt=""
              className="mt-[4.625rem]"
            />
          </div>

          {/* Right Side */}
          <div className=" w-[50%] flex flex-col gap-y-4 mt-[5.75%] pr-[6rem] h-full  items-center">
            <CustomCard
              Icon={frame15}
              onClick={() => navigate("/home")}
              showIcon={true}
              title="Manage Invoices"
              className={"cursor-pointer"}
              content="Ensure smooth processing and verification of invoices"
            />
            <CustomCard
              Icon={frame15}
              showIcon={true}
              onClick={() => setOpen(true)}
              className={"cursor-pointer"}
              title="Verify Vendors/Branches"
              content="Ensure vendor and branch information is correct and up-to-date."
            />
            <CustomCard
              Icon={frame15}
              showIcon={true}
              className={"cursor-pointer"}
              title="Check Item Master"
              content="Speed up item master verification for seamless operations."
            />
            <CustomCard
              Icon={frame15}
              showIcon={true}
              className={"cursor-pointer"}
              onClick={() => navigate("/user-activity")}
              title="View User Activity"
              content="Access a comprehensive log of all user activities."
            />
            <CustomCard
              Icon={frame15}
              className={"cursor-pointer"}
              showIcon={true}
              title="Invoice Assignment"
              content="Manage and delegate invoice tasks seamlessly."
            />
            <CustomCard
              Icon={frame15}
              onClick={()=>navigate("/process-invoice")}
              className={"cursor-pointer"}
              showIcon={true}
              title="Process Invoice"
              content="Upload invoices seamlessly."
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
{
  /* <Link to={"/home"} className="!w-full ">
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
</Link> */
}
