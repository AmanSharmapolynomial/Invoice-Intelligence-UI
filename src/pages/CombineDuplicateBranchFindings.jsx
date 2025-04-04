import approved from "@/assets/image/approved.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import CustomDropDown from "@/components/ui/CustomDropDown";
import Loader from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { useCombineVendorBranches } from "@/components/vendor/api";
import {
  useGetVendorPotentialDuplicateBranches,
  useMartBranchAsNotDuplicate
} from "@/components/vendor/potentialDuplicates/api";
import { OLD_UI } from "@/config";
import { queryClient } from "@/lib/utils";
import { CopyX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CombineDuplicateBranchFindings = () => {
  const { vendor_id } = useParams();
  const { data, isLoading } = useGetVendorPotentialDuplicateBranches(vendor_id);
  const { mutate: markBranchAsNotDuplicate, isPending: markingAsNOtDuplicate } =
    useMartBranchAsNotDuplicate();
  const [currentMarkedBranch, setCurrentMarkedBranch] = useState(null);
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
      setDuplicates([
        ...duplicatess,
        { ...data?.data?.findings?.[0]?.branch, parent: true }
      ]);
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
    if (checkedBranches?.length == 0) {
      toast.error("Please Select Branches To Merge.");
      return;
    }
    if (!masterUUID) {
      toast.error("Please Select Master Branch.");
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
          queryClient.invalidateQueries({
            queryKey: ["duplicate-branches-listing"]
          });
        }
      }
    );
  };

  const handleMarkingAsNotDuplicate = (branch_id, finding_id) => {
    if (checkedBranches?.includes(branch_id)) {
      setCheckedBranches(checkedBranches?.filter((b) => b !== branch_id));
    }
    setCurrentMarkedBranch(finding_id);
    markBranchAsNotDuplicate(finding_id, {
      onSuccess: (data) => {
        toast.success(data?.message);
        setCurrentMarkedBranch(null);
        queryClient.invalidateQueries({
          queryKey: ["duplicate-branches-listing"]
        });
      },
      onError: (data) => {
        toast.error(data?.message);
        setCurrentMarkedBranch(false);
      }
    });
  };
  useEffect(() => {
    if (data && data?.data?.findings?.length == 0) {
      window.close();
    }
  }, [data]);

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
                <Skeleton className={"w-80 h-10  mb-1"} />
              </div>
            ) : (
              <div className="flex items-end gap-x-4">
                <div>
                  <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                    Vendor
                  </p>
                  <p
                    onClick={() => {
                      window.open(
                        `${OLD_UI}/vendor-consolidation-v2/${data?.data?.vendor?.vendor_id}`
                      );
                    }}
                    className="capitalize cursor-pointer text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl"
                  >
                    <span>{data?.data?.vendor?.vendor_name}</span>
                    {data?.data?.vendor?.human_verified && (
                      <img src={approved} alt="" className="h-4 w-4" />
                    )}
                  </p>
                </div>
                <p className="text-2xl">|</p>
                <div>
                  <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                    Group Findings
                  </p>
                  <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                    <span>
                      {
                        data?.data?.findings?.find(
                          (f) => f.branch?.branch_id == currentBranch
                        )?.total_potential_duplicates
                      }
                    </span>
                  </p>
                </div>
                <p className="text-2xl">|</p>
                <div>
                  <p className="text-[#6D6D6D] font-poppins font-medium text-xs leading-4">
                    Total Groups
                  </p>
                  <p className="capitalize text-[#121212] flex items-center gap-x-2 font-semibold font-poppins text-xl">
                    <span>
                      {
                       data?.data?.findings?.length
                      }
                    </span>
                  </p>
                </div>
              </div>
            )}
          </BreadCrumb>

          <div className="w-full border-t h-full  mb-4" />
          <div className="flex items-center justify-end gap-x-2">
            {isLoading ? (
              <div className="flex items-center gap-x-2">
                <Skeleton className={"w-80 h-10  mb-1"} />
              </div>
            ) : (
              <CustomDropDown
                data={data?.data?.findings?.map((branch) => {
                  let obj = {
                    label: branch?.branch?.vendor_address,
                    value: branch?.branch?.branch_id,
                    count: branch?.total_potential_duplicates,
                    human_verified: branch?.branch?.human_verified
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
                  setDuplicates([
                    ...data?.data?.findings?.find(
                      (b) => b?.branch?.branch_id == v
                    )?.potential_duplicates,
                    {
                      ...data?.data?.findings?.find(
                        (b) => b?.branch?.branch_id == v
                      )?.branch,
                      parent: true
                    }
                  ]);
                }}
                triggerClassName={"max-w-[18rem] !font-semibold"}
                className={"!min-w-[24em]"}
              />
            )}
            <Button
              onClick={() => {
                handleCombineBranches();
              }}
              disabled={
                data?.data?.findings?.length == 0 ||
                checkedBranches?.length == 0
              }
              className="rounded-sm font-poppins text-sm font-normal"
            >
              {combiningVendorBranches ? "Combining..." : "Combine"}
            </Button>
          </div>
          <div className=" border-b  mt-2 relative">
            <Table className="">
              <TableRow className="grid border-r border-t bg-white sticky top-0 z-50 grid-cols-6 items-center content-center pr-[0.75rem]">
                <TableHead className="font-semibold font-poppins text-sm  border-l text-black content-center border-r">
                  Branch Name
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black  content-center border-r">
                  Similarity Score
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black  content-center border-r">
                  Matching Reason
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm  text-black content-center border-r">
                  Select Master
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black  content-center border-r">
                  Select For Merge
                </TableHead>
                <TableHead className="font-semibold font-poppins text-sm text-black  content-center border-r">
                  Mark As Not Duplicate
                </TableHead>
              </TableRow>
              <TableBody>
                <div className="max-h-[50vh] overflow-auto">
                  {isLoading ? (
                    <>
                      {[0, 1, 2, 3, 4, 5, 6, 7]?.map((_, i) => {
                        return (
                          <TableRow key={i} className="grid grid-cols-6">
                            {[0, 1, 2, 3, 4, 5]?.map((_, ind) => (
                              <TableCell key={ind}>
                                <Skeleton className={"h-[2.5rem] w-full"} />
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    duplicates
                      ?.sort((a, b) => Boolean(b.parent) - Boolean(a.parent))

                      ?.map((dup, i) => {
                        return (
                          <TableRow
                            key={i}
                            className="grid grid-cols-6  items-center content-center  !border-b"
                          >
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `${OLD_UI}/vendor-v2/${
                                    data?.data?.vendor?.vendor_id
                                  }/branch/${
                                    i == 0 && dup?.vendor_address
                                      ? dup?.branch_id
                                      : dup?.branch?.branch_id
                                  }`
                                );
                              }}
                              className="font-normal  text-black font-poppins border-r  text-sm content-center border-l"
                            >
                              <div className="flex items-center gap-x-2 justify-between">
                                <span className="cursor-pointer capitalize !max-w-[12rem] text-primary">
                                  {" "}
                                  {i == 0 && dup?.vendor_address
                                    ? dup?.vendor_address
                                    : dup?.branch?.vendor_address}
                                </span>
                                <span>
                                  {(i == 0 && dup?.human_verified
                                    ? dup?.human_verified
                                    : dup?.branch?.human_verified) && (
                                        <img src={approved} alt="" />
                                      )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-normal text-black  font-poppins h-full border-r text-sm content-center">
                              {i == 0 && dup?.vendor_address ? 100 : dup?.score}
                            </TableCell>
                            <TableCell className="font-normal text-black  font-poppins h-full border-r text-sm content-center">
                              {i == 0 && dup?.vendor_address
                                ? "Fuzzy Matching"
                                : dup?.match_reason}
                            </TableCell>
                            <TableCell className="font-normal text-black  font-poppins h-full border-r text-sm content-center ">
                              <Checkbox
                                checked={
                                  i == 0 && dup?.vendor_address
                                    ? masterUUID === dup?.branch_id
                                    : masterUUID === dup?.branch?.branch_id
                                }
                                onCheckedChange={() => {
                                  if (i == 0 && dup?.vendor_address) {
                                    handleSelectMaster(dup?.branch_id);
                                  } else {
                                    handleSelectMaster(dup?.branch?.branch_id);
                                  }
                                }}
                                // Disable if it's already checked for merging
                                disabled={
                                  i == 0 && dup?.vendor_address
                                    ? checkedBranches.includes(dup?.branch_id)
                                    : checkedBranches.includes(
                                        dup?.branch?.branch_id
                                      )
                                }
                              />
                            </TableCell>
                            <TableCell className="font-normal text-black h-full  font-poppins border-r text-sm content-center ">
                              <Checkbox
                                checked={
                                  i == 0 && dup?.vendor_address
                                    ? checkedBranches.includes(dup?.branch_id)
                                    : checkedBranches.includes(
                                        dup?.branch?.branch_id
                                      )
                                }
                                onCheckedChange={() => {
                                  if (i == 0 && dup?.vendor_address) {
                                    handleSelectBranch(dup?.branch_id);
                                  } else {
                                    handleSelectBranch(dup?.branch?.branch_id);
                                  }
                                }}
                                // Disable if it's selected as master
                                disabled={
                                  i == 0 && dup?.vendor_address
                                    ? dup?.branch_id == masterUUID
                                    : dup?.branch?.branch_id === masterUUID
                                }
                              />
                            </TableCell>
                            <TableCell className="font-normal text-black h-full font-poppins border-r text-sm content-center">
                              <CustomTooltip
                                content={
                                  i == 0 && dup?.vendor_address
                                    ? "Can't Mark it as not Duplicate."
                                    : ""
                                }
                              >
                                <Button
                                  disabled={
                                    (i == 0 && dup?.vendor_address) ||
                                    currentMarkedBranch == dup?.finding_id ||
                                    markingAsNOtDuplicate
                                  }
                                  className="bg-transparent hover:bg-transparent shadow-none"
                                  onClick={() => {
                                    handleMarkingAsNotDuplicate(
                                      dup?.branch?.branch_id,
                                      dup?.finding_id
                                    );
                                  }}
                                >
                                  {currentMarkedBranch === dup?.finding_id ? (
                                    <Loader className="text-primary h-4 w-4" />
                                  ) : (
                                    <CopyX className="!font-thin border-none fill-none text-gray-600" />
                                  )}
                                </Button>
                              </CustomTooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </div>
              </TableBody>
            </Table>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default CombineDuplicateBranchFindings;
