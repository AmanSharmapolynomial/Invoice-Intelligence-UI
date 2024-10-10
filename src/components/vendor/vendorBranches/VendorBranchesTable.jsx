import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import no_data from "@/assets/image/no-data.svg";
import { vendorNamesFormatter } from "@/lib/helpers";
import { ArrowBigUp, Edit, Eye, Save, Trash2, Verified } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteBranch,
  useGetVendorNames,
  useMigrateVendorBranch,
  useSaveVendorBranchDetails
} from "@/components/vendor/api";
import { LoaderIcon } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/utils";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
const VendorBranchesTable = ({
  data = [],
  isLoading,
  checkedBranches,
  setCheckedBranches,
  masterBranch,
  setShowPdfs,
  setMasterBranch,
  showPdfs
}) => {
  const { vendor_id } = useParams();
  const updateParams = useUpdateParams();
  const { mutate: migrateBranch, isPending: migrating } =
    useMigrateVendorBranch();
  const { mutate: deleteBranch, isPending: deleting } = useDeleteBranch();
  const { data: vendorNamesList } = useGetVendorNames();
const [searchParams]=useSearchParams()
  const [currentBranch, setCurrentBranch] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [open, setOpen] = useState(false);
  const [editableRow, setEditableRow] = useState(0);
  const [viewIconIndex, setViewIconIndex] = useState(0);
  const [vendorAddress, setVendoraddess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: saveAddress, isPending: savingAddress } =
    useSaveVendorBranchDetails();
  const handleCheckedChange = (branch_id, check) => {
    if (check) {
      setCheckedBranches([...checkedBranches, branch_id]);
    } else {
      let filtered = checkedBranches?.filter((item) => item != branch_id);
      setCheckedBranches(filtered);
    }
  };
  let currentSelectedBranch=searchParams.get("branch")||""
  return (
    <>
      <Table className="flex flex-col   box-border  scrollbar min-h-[65vh] ">
        <TableHeader className="min-h-16">
          <TableRow className="flex text-base  !border-none  ">
            <TableHead className="flex  border-r !text-left items-center justify-start  !font-semibold !text-gray-800  !max-w-[20%] !min-w-[25%]  border-b pl-6  bg-gray-200 !h-14">
              Vendor Address
            </TableHead>

            <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
              Document Count
            </TableHead>

            <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center   !font-semibold !text-gray-800 !min-w-[10%] border-b  bg-gray-200 h-14">
              Creation Date
            </TableHead>

            <TableHead className="flex  border-r !min-h-10  gap-x-2 !text-left items-center justify-center  !font-semibold !text-gray-800 !min-w-[12.5%] border-b  bg-gray-200 h-14">
              Select Master
            </TableHead>

            <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-[12.5%] border-b  bg-gray-200 h-14">
              Select For Merge
            </TableHead>

            <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center   !font-semibold !text-gray-800 !min-w-[15%] capitalize border-b  bg-gray-200 h-14">
              Migrate
            </TableHead>

            <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-semibold !text-gray-800 !min-w-[15%] border-b pb- bg-gray-200 h-14">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="flex-1 h-full  w-full">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8]?.map((_, index) => {
              return (
                <TableRow
                  className="flex  !text-sm !border-none !min-h-16"
                  key={index}
                >
                  {["a", "b", "c", "d", "e", "f", "g", "h","i","j"]?.map((_, i) => {
                    return (
                      <TableHead
                        key={i}
                        className="flex  !text-left items-center justify-center pl-8 pb-4 !font-semibold !text-gray-800 !min-w-52 border-b  "
                      >
                        {" "}
                        <Skeleton className={"w-36 h-5"} />
                      </TableHead>
                    );
                  })}{" "}
                </TableRow>
              );
            })
          ) : data && Object?.keys(data)?.length > 0 ? (
            data?.map(
              (
                {
                  vendor_address,
                  created_date,
                  human_verified,
                  document_count,
                  branch_id,
                  verified_by
                },
                index
              ) => {
                return (
                  <TableRow
                    className="flex !w-[100%]  text-base !items-center leading-5  !min-h-16  !border-none"
                    key={index}
                  >
                    <TableHead className="flex  border-r !text-left justify-between items-center gap-x-4 pl-6  !font-normal !text-gray-800 !min-w-[25%]  border-b py-8 min-h-16 ">
                      {editableRow == index + 1 ? (
                        <Input
                          value={vendorAddress}
                          onChange={(e) => setVendoraddess(e.target.value)}
                        />
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center justify-between gap-x-2 pr-2 w-full">
                              {" "}
                              <Link
                                to={`/vendor-branch-details/${vendor_id}/${branch_id}`}
                                className="underline underline-offset-2 capitalize"
                              >
                                {vendor_address?.length > 45
                                  ? vendor_address?.slice(0, 45) + "..."
                                  : vendor_address}
                              </Link>
                              <span>
                                {human_verified && (
                                  <Verified className="h-5 w-5 text-primary" />
                                )}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className=" bg-[#FFFFFF] !capitalize font-semibold text-primary !text-sm">
                              <p>{vendor_address}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableHead>

                    <TableHead className="flex  border-r min-h-16 !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-[10%] border-b ">
                      {document_count}{" "}
                    </TableHead>

                    <TableHead className="flex  border-r min-h-16  gap-x-2 !text-left items-center justify-center  !font-normal !text-gray-800 !min-w-[10%] border-b  ">
                      {created_date?.split("T")[0]}{" "}
                    </TableHead>
                    <TableHead className="flex border-r min-h-16 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-[12.5%] border-b">
                      <RadioGroup
                        value={masterBranch}
                        onValueChange={(val) => setMasterBranch(val)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            onClick={() => setMasterBranch("")}
                            value={branch_id}
                            id={`branch-${branch_id}`}
                          />
                        </div>
                      </RadioGroup>
                    </TableHead>

                    <TableHead className="flex  border-r min-h-16 !text-left items-center justify-center  capitalize !font-normal !text-gray-800 !min-w-[12.5%] border-b ">
                      <Checkbox
                        disabled={
                          masterBranch == "" || masterBranch == branch_id
                        }
                        className="h-4 w-4"
                        onCheckedChange={(val) =>
                          handleCheckedChange(branch_id, val)
                        }
                      />
                    </TableHead>
                    <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center  capitalize !font-normal !text-gray-800 !min-w-[15%] border-b ">
                      <AlertDialog
                        open={open}
                        className="!bg-black/30 backdrop:bg-transparent "
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            className="font-normal bg-transparent !border-none shadow-none hover:border-none hover:bg-transparent"
                            onClick={() => {
                              setCurrentBranch(vendor_address);
                              setOpen(true);
                            }}
                          >
                            {" "}
                            <ArrowBigUp className="text-primary" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Migrate Vendor Branch
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="mt-2">
                                <p className="font-semibold px-1">
                                  Selected Branch
                                </p>
                                <p className="mt-1.5 border p-1 rounded-sm bg-gray-100 capitalize">
                                  {currentBranch}
                                </p>
                                <p className="font-semibold px-1 mt-4">
                                  Select Vendor
                                </p>
                                <CustomDropDown
                                  Value={vendorId}
                                  className="!w-full"
                                  triggerClassName={"w-full mt-1.5"}
                                  contentClassName={"!z-50"}
                                  data={vendorNamesFormatter(
                                    vendorNamesList?.data &&
                                      vendorNamesList?.data?.vendor_names
                                  )}
                                  onChange={(val) => {
                                    if (val == "none") {
                                      setVendorId("none");
                                      updateParams({ vendor: undefined });
                                    } else {
                                      setVendorId(val);
                                      updateParams({ vendor: val });
                                    }
                                  }}
                                  placeholder="Vendor"
                                  searchPlaceholder="Search Vendor Name"
                                />{" "}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <Button
                              disabled={!vendorId || migrating}
                              onClick={() => {
                                migrateBranch(
                                  { branch_id, vendorId },
                                  {
                                    onSuccess: () => {
                                      setOpen(false);
                                      setVendorId("");
                                    }
                                  }
                                );
                              }}
                              className="font-normal text-sm !border-none"
                            >
                              {migrating ? (
                                <>
                                  <LoaderIcon />
                                  Migrating
                                </>
                              ) : (
                                "Migrate"
                              )}
                            </Button>
                            <AlertDialogCancel
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                              }}
                            >
                              Close
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableHead>

                    <TableHead className="flex  border-r min-h-16  !text-left items-center justify-center gap-x-6 !font-normal !text-gray-800 !min-w-[15%] border-b  ">
                      {editableRow == index + 1 ? (
                        <Save
                          className="w-5 h-5 text-primary cursor-pointer"
                          onClick={() => {
                            saveAddress(
                              {
                                data: { vendor_address: vendorAddress },
                                branch_id
                              },
                              {
                                onSuccess: () => {
                                  setVendoraddess(""); // Optionally clear the input field
                                  queryClient.invalidateQueries({
                                    queryKey: ["vendor-branches"]
                                  });
                                }
                              }
                            );
                            setEditableRow(0);
                          }}
                        />
                      ) : (
                        <Edit
                          className="h-4 text-gray-700 cursor-pointer"
                          onClick={() => {
                            setEditableRow(index + 1);
                            setVendoraddess(vendor_address);
                          }}
                        />
                      )}
                      {!showPdfs ? (
                        <Button
                          // disabled={viewIconIndex == 0}
                          onClick={() => {
                            setShowPdfs((prev) => !prev);
                            updateParams({ branch: branch_id });
                            setViewIconIndex(index+1)
                          }}
                          className="w-12 bg-transparent border-none shadow-none hover:bg-transparent"
                        >
                          <Eye className="h-6 w-6 text-primary cursor-pointer" />
                        </Button>
                      ) : viewIconIndex == index + 1 ? (
                        <EyeClosedIcon
                          className="h-5 w-5 text-primary cursor-pointer"
                          onClick={() => {
                            updateParams({ branch: undefined });
                            setViewIconIndex(0);
                            setShowPdfs((prev) => !prev);
                          }}
                        />
                      ) : (
                        <Button
                          disabled={currentSelectedBranch!==branch_id}
                          onClick={() => {
                            setShowPdfs((prev) => !prev);
                            setViewIconIndex(0);
                            updateParams({ branch: branch_id });
                          }}
                          className=" !p-0 bg-transparent border-none shadow-none hover:bg-transparent"
                        >
                          <Eye className="h-6 w-6 text-primary cursor-pointer" />
                        </Button>
                      )}
                      <AlertDialog
                        open={showDeleteModal}
                        className="!bg-black/30 backdrop:bg-transparent "
                      >
                        <AlertDialogTrigger asChild>
                          <Trash2
                            onClick={() => {
                              setShowDeleteModal(true);
                            }}
                            className="h-5 w-5 -mt-0.5 text-red-500 cursor-pointer"
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Vendor Branch
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              <p className="text-base font-medium px-1 border-t border-b py-4">
                                {" "}
                                Are you sure to delete ?{" "}
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <Button
                              disabled={migrating}
                              onClick={() => {
                                deleteBranch(branch_id, {
                                  onSuccess: () => {
                                    setShowDeleteModal(false);
                                  }
                                });
                              }}
                              className="font-normal text-sm !border-none"
                            >
                              {deleting ? (
                                <>
                                  <LoaderIcon />
                                  Deleting
                                </>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                            <AlertDialogCancel
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(false);
                              }}
                            >
                              Close
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableHead>
                  </TableRow>
                );
              }
            )
          ) : (
            <div className="flex justify-center items-center h-[60vh] !w-[90vw]">
              <img src={no_data} alt="" className="flex-1 h-full" />
            </div>
          )}{" "}
        </TableBody>
      </Table>
    </>
  );
};

export default VendorBranchesTable;
