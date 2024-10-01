import direction from "@/assets/image/direction.svg";
import { Link } from "react-router-dom";
import Layout from "./components/common/Layout";
import { Button } from "./components/ui/button";
import Navbar from "./components/common/Navbar";
function App() {
  return (
    <Layout>
            <Navbar />
      <div className="px-16 w-full flex h-[90vh] gap-x-4 mt-2 overflow-hidden">
        <div className=" w-[30%] h-full !flex-1 flex-col flex  gap-y-4 justify-center ">
          <Link to={"/home"} className="!w-full ">
            <Button className="w-3/4">Invoice Balancing</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-3/4">Vendor & Branch Verification</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-3/4">Fast Item Master Verification</Button>
          </Link>
          <Link to={"/user-activity"} className="!w-full ">
            <Button className="w-3/4">User Activity</Button>
          </Link>
          <Link to={""} className="!w-full ">
            <Button className="w-3/4">Invoice Assignment</Button>
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
