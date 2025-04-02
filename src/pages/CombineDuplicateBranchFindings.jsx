import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { useGetVendorPotentialDuplicateBranches } from "@/components/vendor/potentialDuplicates/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import approved from "@/assets/image/approved.svg";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import CustomAccordion from "@/components/ui/Custom/CustomAccordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCombineVendorBranches } from "@/components/vendor/api";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/utils";

const CombineDuplicateBranchFindings = () => {
  const { vendor_id } = useParams();
  const { data, isLoading } = useGetVendorPotentialDuplicateBranches(vendor_id);
  const [duplicates, setDuplicates] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(
    data?.data?.findings?.[0]?.branch?.branch_id
  );
  const [masterUUID, setMasterUUID] = useState(null);
  const [checkedBranches, setCheckedBranches] = useState([]);
  useEffect(() => {
    setCurrentBranch(data?.data?.findings?.[0]?.branch?.branch_id);
    let duplicatess = data?.data?.findings?.[0]?.potential_duplicates;

    if (duplicatess) {
      setDuplicates([...duplicatess]);
    }
  }, [data]);
  const handleSelectBranch = (findingId) => {
    setCheckedBranches(
      (prev) =>
        prev.includes(findingId)
          ? prev.filter((id) => id !== findingId) // Unselect if already selected
          : [...prev, findingId] // Add to selection if not selected
    );
  };

  const handleSelectMaster = (findingId) => {
    setMasterUUID((prevMaster) => {
      // If the selected master is already the master, remove it
      if (prevMaster === findingId) return null;

      // If selecting a new master, remove it from checked branches
      setCheckedBranches((prev) => prev.filter((id) => id !== findingId));

      return findingId;
    });
  };

  const { mutate: combineVendorBranches, isPending: combiningVendorBranches } =
    useCombineVendorBranches();
  const handleCombineBranches = () => {
    if(checkedBranches?.length==0){
      toast.error("Please Select Branches To Merge.");
      return;
    }
    if(!masterUUID){
      toast.error("Please Select Master Branch.")
    }
    combineVendorBranches(
      {
        branch_id: masterUUID,
        branches_to_combine: checkedBranches
      },
      {
        onSuccess: () => {
          setCheckedBranches([]);
          setMasterUUID([]);
          queryClient.invalidateQueries({queryKey:['duplicate-branches-listing']})
        }
      }
    );
  };
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
              <div className="flex items-end gap-x-4">
                <div>
                  <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                    Vendor
                  </p>
                  <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                    <span>{data?.data?.vendor?.vendor_name}</span>
                    {data?.data?.vendor?.human_verified && (
                      <img src={approved} alt="" className="h-4 w-4" />
                    )}
                  </p>
                </div>
                <p className="text-2xl">|</p>
                <div>
                  <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                    Total Findings
                  </p>
                  <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                    <span>{data?.data?.total_findings}</span>
                  </p>
                </div>
              </div>
            )}
          </BreadCrumb>

          <div className="w-full border-t h-full  mb-4" />
          <div className="flex items-center justify-end gap-x-2">
            <CustomDropDown
              data={data?.data?.findings?.map((branch) => {
                let obj = {
                  label: branch?.branch?.vendor_address,
                  value: branch?.branch?.branch_id
                };
                return obj;
              })}
              Value={currentBranch}
              onChange={(v) => {
                setCurrentBranch(
                  data?.data?.findings?.find(
                    (b) => b?.branch?.branch_id == v
                  )?.["branch"]?.branch_id
                );
                setDuplicates(
                  data?.data?.findings?.find((b) => b?.branch?.branch_id == v)
                    ?.potential_duplicates
                );
              }}
              triggerClassName={"max-w-[18rem] !font-semibold"}
              className={"!min-w-[24em]"}
            />
            <Button
              onClick={() => {
                handleCombineBranches();
              }}
              className="rounded-sm font-poppins text-sm font-normal"
            >
              {combiningVendorBranches?"Combining...":"Combine"}
            </Button>
          </div>
          <div className=" h-full mt-2">
            <Table className="">
              <TableRow className="grid grid-cols-5 items-center content-center ">
                <TableHead className="font-semibold font-poppins text-sm border-t border-l text-black content-center border-r">
                  Branch Name
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black border-t content-center border-r">
                  Similarity Score
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black border-t content-center border-r">
                  Matching Reason
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm border-t text-black content-center border-r">
                  Select Master
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black border-t content-center border-r">
                  Select For Merge
                </TableHead>
              </TableRow>
              <TableBody>
                {duplicates?.map((dup, i) => {
                  return (
                    <TableRow
                      key={i}
                      className="grid grid-cols-5 items-center content-center  !border-b"
                    >
                      <TableCell className="font-normal text-black font-poppins border-r  text-sm  border-l">
                        {dup?.branch?.vendor_address}
                      </TableCell>
                      <TableCell className="font-normal text-black font-poppins border-r text-sm ">
                        {dup?.score}
                      </TableCell>
                      <TableCell className="font-normal text-black font-poppins border-r text-sm ">
                        {dup?.match_reason}
                      </TableCell>
                      <TableCell className="font-normal text-black font-poppins border-r text-sm ">
                        <Checkbox
                          checked={masterUUID === dup?.branch?.branch_id}
                          onCheckedChange={() =>
                            handleSelectMaster(dup?.branch?.branch_id)
                          }
                          disabled={checkedBranches.includes(dup?.branch?.branch_id)} // Disable if already checked
                        />
                      </TableCell>
                      <TableCell className="font-normal text-black font-poppins border-r text-sm ">
                        <Checkbox
                          checked={checkedBranches.includes(dup?.branch?.branch_id)}
                          onCheckedChange={() =>
                            handleSelectBranch(dup?.branch?.branch_id)
                          }
                          disabled={dup?.finding_id === masterUUID} // Disable if it's the master
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default CombineDuplicateBranchFindings;
