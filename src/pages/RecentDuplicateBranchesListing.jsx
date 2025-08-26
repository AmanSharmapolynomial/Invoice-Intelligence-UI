import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import no_data from "@/assets/image/no-data.svg";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import {
  useDeleteDuplicateBranchFindings,
  useListRecentVendorDuplicateBranches
} from "@/components/vendor/potentialDuplicates/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Combine,
  Delete,
  Eye,
  FileText,
  Notebook,
  Trash2Icon,
  X
} from "lucide-react";
import {
  useCombineVendorBranches,
  useGetVendorBranchPdfs,
  useGetVendorNames
} from "@/components/vendor/api";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import warning from "@/assets/image/warning.svg";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/utils";
import approved from "@/assets/image/approved.svg";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { vendorNamesFormatter } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { PdfViewer } from "@/components/common/PDFViewer";
import { OLD_UI } from "@/config";
let headers = [
  "Vendor",
  "Verified Matching Branch",
  "Branch",
  "Pending Documents Count",
  "Similarity Score",
  "Actions"
];
const RecentDuplicateBranchesListing = () => {
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let vendor = searchParams.get("vendor") || null;
  let similarity_score = searchParams.get("similarity_score") || 70;
  const updateParams = useUpdateParams();
  let payload = {
    page,
    page_size,
    similarity_score,
    vendor
  };
  const { data, isLoading } = useListRecentVendorDuplicateBranches(payload);
  const [showMergeConfirmationModal, setShowMergeConfirmationModal] =
    useState(false);
  const [currentSelectedRow, setCurrentSelectedRow] = useState({
    index: null,
    master_branch: null,
    branch: null,
    isLoading: false
  });
  const [deletetionBranch, setDeletionBranch] = useState({
    index: null,
    id: null
  });
  const { data: vendorNamesList, isLoading: vendorNamesLoading } =
    useGetVendorNames();

  const { mutate: combineBranches, isPending: mergingBranches } =
    useCombineVendorBranches();

  const [currentRowIndex, setCurrenRowIndex] = useState(null);
  const [currentBrandId, setCurrentBranchId] = useState(null);
  const { data: pdfsData, isLoading: loadinPdfsData } =
    useGetVendorBranchPdfs(currentBrandId);
  const { mutate: deleteDuplicateBranch } = useDeleteDuplicateBranchFindings();

  return (
    <div className="overflow-hidden flex w-full h-full">
      <Sidebar />
      <div className="w-full ml-12 h-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Vendors with Recent  Potential Duplicate Branches"
            crumbs={[
              {
                path: null,
                label: "Vendors with Recent Potential Duplicate Branches"
              }
            ]}
          />
          <div className="flex justify-end items-center w-full  ">
            <CustomDropDown
              Value={searchParams.get("vendor")}
              triggerClassName={"!w-44"}
              data={vendorNamesFormatter(
                vendorNamesList?.data && vendorNamesList?.data?.vendor_names
              )}
              multiSelect={true}
              onChange={(val) => {
                if (typeof val == "object") {
                  let vendor = val.map((item) => item).join(",");
                  updateParams({ vendor: vendor });
                  //   setFilters({ ...filters, vendor: vendor });
                } else {
                  if (val == "none") {
                    updateParams({ vendor: undefined });
                    // setFilters({ ...filters, vendor: undefined });
                  } else {
                    // setFilters({ ...filters, vendor: val });
                  }
                }
              }}
              placeholder="All Vendors"
              searchPlaceholder="Search Vendor Name"
            />{" "}
          </div>
          <div className={`w-full mt-4 ${currentRowIndex !== null && "flex"}`}>
            <div
              className={`rounded-md border overflow-x-auto ${
                currentRowIndex !== null && "w-1/2"
              }`}
            >
              <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[74vh] md:!max-h-[72vh] 2xl:!max-h-[78vh] 3xl:!max-h-[80vh] overflow-auto">
                <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
                  <TableRow className="!text-white !rounded-md w-full grid grid-cols-6 md:max-h-[5.65rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm">
                    {headers?.map((header) => {
                      return (
                        <TableHead className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1">
                          {header}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody className="h-full ">
                  <div className="flex flex-col gap-y-0 ">
                    {isLoading ? (
                      <div>
                        {new Array(10).fill(0).map((_, index) => (
                          <TableRow
                            key={index}
                            className="border-b h-[3.75rem] grid grid-cols-6 items-center content-center"
                          >
                            {[0, 1, 2, 3, 4, 5].map((it) => (
                              <TableCell key={it} className="border-r">
                                <Skeleton className="w-full h-[2.5rem]" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </div>
                    ) : data?.data?.length > 0 ? (
                      data?.data?.map((item, index) => {
                        return (
                          <TableRow
                            key={index}
                            className={`${
                              index == 0 && "!border-t-0"
                            } grid grid-cols-6 border-b cursor-pointer md:h-[2.75rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] content-center self-center w-full items-center dark:!text-white text-xs sm:text-sm `}
                          >
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`
                                );
                              }}
                              className="border-r h-full font-poppins !break-word dark:text-white md:h-[2.75rem] md:min-h-[2.65rem] 2xl:h-[4rem] self-center content-center  !truncate whitespace-normal px-[0.8rem] capitalize text-sm font-normal"
                            >
                              <CustomTooltip
                                className={"!min-w-fit"}
                                content={
                                  item?.vendor?.vendor_name?.length > 30 &&
                                  item?.vendor?.vendor_name
                                }
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    window.open(
                                      `${OLD_UI}/vendor-consolidation-v2/${item?.vendor?.vendor_id}`
                                    );
                                  }}
                                  className="flex !text-primary items-center  justify-between truncate  w-full !capitalize gap-x-4"
                                >
                                  <span>
                                    {" "}
                                    {item?.vendor?.vendor_name?.length > 30
                                      ? item?.vendor?.vendor_name?.slice(
                                          0,
                                          30
                                        ) + "..."
                                      : item?.vendor?.vendor_name}
                                  </span>
                                  {item?.vendor?.human_verified && (
                                    <span>{<img src={approved} alt="" />}</span>
                                  )}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`
                                );
                              }}
                              className="font-normal dark:!text-white capitalize border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center truncate whitespace-normal"
                            >
                              <CustomTooltip
                                className={"!min-w-fit"}
                                content={
                                  item?.verified_matching_branch?.vendor_address
                                    ?.length > 30 &&
                                  item?.verified_matching_branch?.vendor_address
                                }
                              >
                                <div 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    window.open(
                                      `${OLD_UI}/vendor-consolidation-v2/branches/${item?.vendor?.vendor_id}`
                                    );
                                  }}
                                className="flex truncate break-words w-full  text-primary !capitalize items-center gap-x-4 justify-between">
                                  <span>
                                    {" "}
                                    {item?.verified_matching_branch
                                      ?.vendor_address?.length > 30
                                      ? item?.verified_matching_branch?.vendor_address?.slice(
                                          0,
                                          30
                                        ) + "..."
                                      : item?.verified_matching_branch
                                          ?.vendor_address}
                                  </span>
                                  {item?.verified_matching_branch
                                    ?.human_verified && (
                                    <span>{<img src={approved} alt="" />}</span>
                                  )}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`
                                );
                              }}
                              className="font-normal dark:!text-white capitalize border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  !break-word whitespace-normal !truncate font-poppins text-sm text-black content-center"
                            >
                              <CustomTooltip
                                className={"!min-w-fit"}
                                content={
                                  item?.branch?.vendor_address?.length > 30 &&
                                  item?.branch?.vendor_address
                                }
                              >
                                <div   onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    window.open(
                                      `${OLD_UI}/vendor-consolidation-v2/branches/${item?.vendor?.vendor_id}`
                                    );
                                  }} className="flex truncate  text-primary break-words !capitalize items-center gap-x-4 justify-between">
                                  <span className="">
                                    {" "}
                                    {item?.branch?.vendor_address?.length > 30
                                      ? item?.branch?.vendor_address?.slice(
                                          0,
                                          30
                                        ) + "..."
                                      : item?.branch?.vendor_address}
                                  </span>
                                  {item?.branch?.human_verified && (
                                    <span>{<img src={approved} alt="" />}</span>
                                  )}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`
                                );
                              }}
                              className="font-normal dark:!text-white border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center"
                            >
                              {item?.pending_document_counts}
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                window.open(
                                  `/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`
                                );
                              }}
                              className="font-normal dark:!text-white border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center"
                            >
                              <CustomTooltip
                                className={"!min-w-72"}
                                content={item?.match_reason}
                              >
                                <div className=" !min-w-72 flex justify-start items-center !min-h-12 ">
                                  {item?.similarity_score}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell className="font-normal  md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm content-center">
                              {/* <Button
                                disabled={currentSelectedRow?.isLoading}
                                className="bg-transparent  hover:bg-transparent shadow-none  flex items-center gap-x-4 border-none disabled:cursor-not-allowed"
                              > */}
                              <div className="flex items-center gap-x-4">
                                {currentSelectedRow?.index == index &&
                                currentSelectedRow?.isLoading ? (
                                  <Loader className={"text-gray-500 "} />
                                ) : (
                                  <CustomTooltip content={"Combine Branches"}>
                                    <Combine
                                      className="text-gray-500 h-4 w-4 "
                                      onClick={() => {
                                        console.log("clicker");
                                        setShowMergeConfirmationModal(true);
                                        setCurrentSelectedRow({
                                          index: index,
                                          master_branch:
                                            item?.verified_matching_branch,
                                          branch: item?.branch
                                        });
                                      }}
                                    />
                                  </CustomTooltip>
                                )}
                                {currentRowIndex == index ? (
                                  <X
                                    className="text-red-500 h-4 w-4"
                                    onClick={() => {
                                      setCurrenRowIndex(null);
                                      setCurrentBranchId(null);
                                    }}
                                  />
                                ) : (
                                  <CustomTooltip content={"View Branch Pdfs"}>
                                    <FileText
                                      className="text-gray-500 h-4 w-4 "
                                      onClick={() => {
                                        setCurrenRowIndex(index);
                                        setCurrentBranchId(null);
                                        setCurrentBranchId(
                                          item?.branch?.branch_id
                                        );
                                      }}
                                    />
                                  </CustomTooltip>
                                )}
                                {deletetionBranch?.index == index ? (
                                  <Loader className="h-4 w-4" />
                                ) : (
                                  <CustomTooltip content={"Delete Finding"}>
                                    <Trash2Icon
                                      className="text-gray-500 h-4 w-4 "
                                      onClick={() => {
                                        setDeletionBranch({
                                          index: index,
                                          id: item?.id
                                        });
                                        deleteDuplicateBranch(item?.id, {
                                          onSuccess: () => {
                                            setDeletionBranch({
                                              id: null,
                                              index: null
                                            });
                                            queryClient.invalidateQueries([
                                              "recent-duplicate-branch-findings"
                                            ]);
                                          },
                                          onError: () => {
                                            setDeletionBranch({
                                              id: null,
                                              index: null
                                            });
                                          }
                                        });
                                      }}
                                    />
                                  </CustomTooltip>
                                )}
                              </div>
                              {/* </Button> */}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <div className="w-full h-[60vh] flex items-start justify-center">
                        <img src={no_data} alt="" className="h-[80%]" />
                      </div>
                    )}
                  </div>
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                isFinalPage={data?.is_final_page}
                totalPages={data?.total_pages}
              />
            </div>
            {currentRowIndex !== null && (
              <div className="w-1/2 !h-full overflow-auto">
                {pdfsData?.data?.length > 0 ? (
                  <PdfViewer
                    className={"!max-h-[70vh] !min-h-[60vh]"}
                    height={58}
                    multiple={true}
                    isLoading={loadinPdfsData}
                    pdfUrls={pdfsData?.data}
                  />
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <p className="font-semibold text-sm font-poppins">
                      No Pdfs Found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Layout>
      </div>
      <Modal
        open={showMergeConfirmationModal}
        setOpen={() => {
          setCurrentSelectedRow({
            index: null,
            master_branch: null,
            isLoading: false,
            branch: null
          });
          setShowMergeConfirmationModal(false);
        }}
      >
        <ModalDescription>
          <div className="w-full flex  flex-col justify-center h-full items-center  ">
            <img src={warning} alt="" className="h-16 w-16 mb-2 mt-4" />
            <p className="font-poppins font-semibold text-base leading-6  text-[#000000]">
              Warning
            </p>
            <p className="px-8 !text-center mt-2 text-[#666667] font-poppins font-normal   text-sm leading-5">
              Are you sure to Combine{" "}
              <span className="font-medium text-black capitalize">
                {currentSelectedRow?.branch?.vendor_address}
              </span>{" "}
              with{" "}
              <span className="font-medium text-black capitalize">
                {currentSelectedRow?.master_branch?.vendor_address}
              </span>{" "}
              ?
            </p>
            <div className="flex items-center gap-x-4 mb-4 mt-8">
              <Button
                onClick={() => {
                  setCurrentSelectedRow({
                    index: null,
                    master_branch: null,
                    branch: null,
                    isLoading: false
                  });
                  setShowMergeConfirmationModal(false);
                }}
                className="rounded-sm !w-[4.5rem] !font-poppins bg-transparent border border-primary shadow-none text-[#000000] font-normal text-xs hover:bg-transparent"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setShowMergeConfirmationModal(false);
                  setCurrentSelectedRow({
                    ...currentSelectedRow,
                    isLoading: true
                  });
                  combineBranches(
                    {
                      branch_id: currentSelectedRow?.master_branch?.branch_id,
                      branches_to_combine: [
                        currentSelectedRow?.branch?.branch_id
                      ]
                    },
                    {
                      onSuccess: () => {
                        setCurrentSelectedRow({
                          index: null,
                          master_branch: null,
                          branch: null,
                          isLoading: false
                        });
                        setShowMergeConfirmationModal(false);
                        queryClient.invalidateQueries([
                          "recent-duplicate-branch-findings"
                        ]);
                      },
                      onError: () => {
                        setCurrentSelectedRow({
                          index: null,
                          master_branch: null,
                          branch: null,
                          isLoading: true
                        });
                        setShowMergeConfirmationModal(false);
                      }
                    }
                  );
                }}
                className="rounded-sm !w-[4.5rem] !font-poppins text-xs font-normal"
              >
                {"Yes"}
              </Button>
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default RecentDuplicateBranchesListing;
