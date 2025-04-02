import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { useGetVendorPotentialDuplicateBranches } from "@/components/vendor/potentialDuplicates/api";
import React from "react";
import { useParams } from "react-router-dom";
import approved from "@/assets/image/approved.svg";
import { Skeleton } from "@/components/ui/skeleton";

const CombineDuplicateBranchFindings = () => {
  const { vendor_id } = useParams();
  const { data, isLoading } = useGetVendorPotentialDuplicateBranches(vendor_id);
  return (
    <div className="overflow-hidden flex w-full h-full">
      <Sidebar />

      <div className="w-full ml-12 h-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            showCustom={true}
            hideTitle={true}
            crumbs={[
              { path: null, label: "Branches With Potential Duplicates" }
            ]}
          >
            {isLoading ? (
              <div className="flex items-center gap-x-2">
                <Skeleton className={"w-44 h-10  mb-1"} />
                
              </div>
            ) : (
              <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                <span>{data?.data?.vendor?.vendor_name}</span>
                {data?.data?.vendor?.human_verified && (
                  <img src={approved} alt="" className="h-4 w-4" />
                )}
              </p>
            )}
          </BreadCrumb>
        </Layout>
      </div>
    </div>
  );
};

export default CombineDuplicateBranchFindings;
