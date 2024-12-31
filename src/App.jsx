import approved from "@/assets/image/approved.svg";
import frame15 from "@/assets/image/frame-15.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { useGetVendorNames } from "@/components/vendor/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "./components/ui/Custom/CustomInput";
import CustomCard from "./components/ui/CustomCard";
import { Modal, ModalDescription } from "./components/ui/Modal";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./components/ui/table";
import { usePersistStore } from "./components/vendor/store/persisitStore";
import useFilterStore from "./store/filtersStore";
import useThemeStore from "./store/themeStore";
import { invoiceDetailStore } from "./store/invoiceDetailStore";

function App() {
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames(true);
  const { setActualVendorName } = usePersistStore();
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [isItemMaster, setIsItemMaster] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  useEffect(() => {
    setFilteredVendors(vendorNamesList?.data?.vendor_names);
  }, [vendorNamesList]);
  const { theme } = useThemeStore();
  const {clearStore}=invoiceDetailStore()

  const navigate = useNavigate();

  useEffect(() => {
    setActualVendorName(null);
  }, []);
  const { setDefault } = useFilterStore();
  useEffect(() => {
    setDefault();
    clearStore()
  }, []);

  return (
    <div className="dark:bg-[#040807] !h-screen  ">
      <Navbar />
      <Layout className={" !flex-1  !overflow-hidden dark:bg-[#040807]  "}>
        <div className="w-full px-[6.25rem] flex flex-col  justify-center items-center mt-[8.75rem]">
          <p className="text-[2rem] font-semibold font-poppins dark:text-[#FFFFFF]">
            <span className="text-primary">Automated</span> Invoice Solutions
          </p>
          <p className="text-[1.25rem]  font-poppins font-normal text-[#000000] dark:text-[#FFFFFF]">
            Simplify Processing, Verification, and User Monitoring
          </p>
        </div>
        <div className=" px-[6.25rem]  grid grid-cols-3 gap-4 mt-[5.75%] pr-[6rem] h-full  items-center">
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
            onClick={() => {
              setOpen(true);
              setIsItemMaster(true);
            }}
            content="Speed up item master verification for seamless operations."
          />
          <CustomCard
            Icon={frame15}
            showIcon={true}
            className={"cursor-pointer"}
            // onClick={() => navigate("/user-activity")}
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
       
        </div>
      </Layout>
      <Modal
        open={open}
        setOpen={setOpen}
        className="bg-white dark:bg-[#051C14] dark:border-[#051C14]"
        title={"Available Vendors"}
        titleClassName={
          "font-semibold text-base font-poppins dark:text-[#F6F6F6]"
        }
      >
        <ModalDescription>
          <div className="flex flex-col gap-y-4 overflow-scroll !h-[35.875rem]  ">
            <CustomInput
              showIcon
              variant="search"
              placeholder="Search Vendor Name"
              className="border border-gray-200  focus:!ring-0 focus:!outline-none remove-number-spinner"
              Value={vendorName}
              onChange={(val) => {
                if (val == "") {
                  setFilteredVendors(vendorNamesList?.data?.vendor_names);
                  setVendorName("");
                } else {
                  setVendorName(val);
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
            <Table className="overflow-auto">
              <TableHeader className="!bg-[#FFFFFF] dark:!bg-[#051C14] sticky top-0">
                <TableRow className="border-none hover:bg-transparent ">
                  <TableHead className="!font-poppins !text-[#000000] dark:!text-[#F6F6F6] !text-sm font-semibold">
                    Vendor Name
                  </TableHead>
                  <TableHead className="!font-poppins !text-[#000000]  dark:!text-[#F6F6F6] !text-sm font-semibold flex justify-center">
                    Verified
                  </TableHead>
                </TableRow>
              </TableHeader>

              {filteredVendors?.length > 0 &&
                filteredVendors?.map(
                  ({ vendor_id, vendor_name, human_verified }) => (
                    <TableRow
                      key={vendor_id}
                      // onClick={() => {
                      //   isItemMaster
                      //     ? navigate(`/fast-item-verification/${vendor_id}`)
                      //     : navigate(`/vendor-details/${vendor_id}`);
                      // }}
                      className="hover:bg-textColor/50 dark:hover:bg-transparent w-full  justify-between border-none cursor-pointer"
                    >
                      <TableCell className="">
                        <p className="capitalize dark:text-[#F6F6F6] font-poppins font-normal text-primaryText text-xs">
                          {vendor_name}
                        </p>
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <p>
                          {human_verified ? (
                            <img
                              src={approved}
                              className="h-[1rem] w-[1rem] dark:text-[#F6F6F6] text-primary"
                            />
                          ) : (
                            <span className="font-poppins dark:text-[#F6F6F6] font-normal text-grey">
                              -
                            </span>
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                  )
                )}

              {filteredVendors?.length == 0 && (
                <p className="flex justify-end w-full py-4  font-poppins">
                  No match found
                </p>
              )}
            </Table>
          </div>
        </ModalDescription>
      </Modal>
    </div>
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
