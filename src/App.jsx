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

  const { setActualVendorName } = usePersistStore();
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [isItemMaster, setIsItemMaster] = useState(false);
  
  const { theme } = useThemeStore();
  const { clearStore } = invoiceDetailStore();

  const navigate = useNavigate();

  useEffect(() => {
    setActualVendorName(null);
  }, []);
  const { setDefault } = useFilterStore();
  useEffect(() => {
    setDefault();
    clearStore();
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
            className={"cursor-pointer"}
            title="Fast Item Verification"
            onClick={() => {
              navigate(`/item-master-vendors`);
            }}
            content="Speed up item master verification for seamless operations."
          />

          <CustomCard
            Icon={frame15}
            className={"cursor-pointer"}
            showIcon={true}
            onClick={() => navigate(`/bulk-categorization`)}
            title="Bulk Item Categorization"
            content="Manage and delegate invoice tasks seamlessly."
          />
          {/* <CustomCard
            Icon={frame15}
            className={"cursor-pointer"}
            showIcon={true}
            onClick={() => navigate(`/vendors-potential-duplicates`)}
            title="Duplicate Vendor Findings"
          
          /> */}
        </div>
      </Layout>
  
    </div>
  );
}

export default App;
