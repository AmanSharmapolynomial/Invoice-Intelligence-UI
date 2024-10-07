import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSimilarVendors } from "@/components/vendor/api";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const CombineVendors = () => {
  const { vendor_id } = useParams();
  const { data, isLoading } = useGetSimilarVendors(vendor_id);
  const [similarity, setSimilarity] = useState([50]);
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto"}>
        <Header
          title={`Combine Vendors`}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !capitalize !text-[#FFFFFF] relative "
        >
          <p>Actual Vendor Name :- {} </p>
        </Header>

        <div className="w-full border flex justify-end p-4 gap-x-4 overflow-auto !h-20">
          {/* <div className="flex w-full max-w-sm items-center justify-between space-x-2"> */}
            <div className="w-full flex justify-center items-center max-w-xs">
             <div className="w-full justify-center flex flex-col items-center gap-y-2">
             <Slider
                defaultValue={similarity}
                max={100}
                step={5}
                onValueChange={(val) => setSimilarity(val)}
              />
             <p> Similarity :- {" "}<span>{similarity[0]}</span></p>
             </div>
            </div>
            <Button
              type="submit"
              onClick={() => {
                //   updateParams({ vendor_address: searchTerm });
              }}
            >
              Find Similar Vendors
            </Button>
          {/* </div> */}
        </div>
      </Layout>
    </>
  );
};

export default CombineVendors;
