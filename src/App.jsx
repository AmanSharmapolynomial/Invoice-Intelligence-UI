import direction from "@/assets/image/direction.svg";
import { Link } from "react-router-dom";
import Layout from "./components/common/Layout";
import { Button } from "./components/ui/button";
import Navbar from "./components/common/Navbar";
function App() {
  return (
    <Layout>
      <Navbar />
      <div className=" w-full flex h-[90vh] gap-x-4  overflow-hidden bg-gray-100">
        <div className=" w-[30%] h-full !flex-1 flex-col px-10  flex !items-center gap-y-4 justify-center bg-gray-200 !bg-opacity-25 ">
          <Link to={"/home"} className="!w-full ">
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-transparent">Invoice Balancing</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-transparent">Vendor & Branch Verification</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-transparent">Fast Item Master Verification</Button>
          </Link>
          <Link to={"/user-activity"} className="!w-full ">
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-transparent">User Activity</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-full  text-gray-800 bg-transparent border-primary border-2 hover:bg-transparent">Invoice Assignment</Button>
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
  );
}

export default App;
