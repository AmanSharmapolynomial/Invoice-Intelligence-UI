import warning from "@/assets/image/warning.svg";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import approved from "@/assets/image/approved.svg";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Modal, ModalDescription } from "@/components/ui/Modal";
import { useCombineVendors, useGetVendorsPdfs } from "@/components/vendor/api";
import {
  useDeleteDuplicateVendorFindings,
  useListRecentVendorDuplicates
} from "@/components/vendor/potentialDuplicates/api";
import { queryClient } from "@/lib/utils";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link, useSearchParams } from "react-router-dom";
import no_data from "@/assets/image/no-data.svg";
import { Skeleton } from "@/components/ui/skeleton";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { Combine, Eye, Trash, Trash2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { OLD_UI } from "@/config";
import { PdfViewer } from "@/components/common/PDFViewer";
let headers = [
  "Vendor",
  "Potential Duplicate Vendor",
  "Similarity Score",
  "Combine",
  "Actions"
];
const RecentDuplicateVendorsListing = () => {
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let vendor = searchParams.get("vendor") || null;
  let similarity_score = searchParams.get("similarity_score") || 70;
  let payload = {
    page,
    page_size,
    similarity_score,
    vendor
  };
  const { data, isLoading } = useListRecentVendorDuplicates(payload);
  const [showMergeConfirmationModal, setShowMergeConfirmationModal] =
    useState(false);
  const [currentSelectedRow, setCurrentSelectedRow] = useState({
    index: null,
    master_vendor: null,
    vendor: null,
    isLoading: false
  });

  const { mutate: combineVendors } = useCombineVendors();
  const { mutate: deleteDuplicateVendor, isPending } =
    useDeleteDuplicateVendorFindings();
  const [deletetionFinding, setDeletionFinding] = useState({
    index: null,
    id: null,
    isLoading: false
  });
  const [currentRowIndex, setCurrenRowIndex] = useState(null);
  const [currentVendorId, setCurrentVendorId] = useState(null);
  const { data: pdfsData, isLoading: loadingPdfsData } = useGetVendorsPdfs({
    vendor_one: currentVendorId
  });
  return (
    <div className="overflow-hidden flex w-full h-full">
      <Sidebar />
      <div className="w-full ml-12 h-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Vendors with Recent  Potential Duplicates"
            crumbs={[
              {
                path: null,
                label: "Vendors with Recent Potential Duplicates"
              }
            ]}
          />

          <div className={`${currentVendorId && "!flex"} w-full mt-4`}>
            <div
              className={`${
                currentVendorId && "w-1/2"
              } rounded-md border overflow-x-auto `}
            >
              <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[74vh] md:!max-h-[72vh] 2xl:!max-h-[78vh] 3xl:!max-h-[80vh] overflow-auto">
                <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
                  <TableRow className="!text-white !rounded-md w-full grid grid-cols-5 md:max-h-[5.65rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm">
                    {headers?.map((header) => {
                      return (
                        <TableHead className="cursor-pointer font-poppins !pr-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1">
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
                            className="border-b h-[3.75rem] grid grid-cols-5 items-center content-center"
                          >
                            {[0, 1, 2, 3, 4].map((it) => (
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
                          <Link
                            key={index}
                            target="_blank"
                            to={`/combine-duplicate-vendors/${
                              item?.verified_vendor?.vendor_id
                            }/${
                              item?.potential_duplicate_vendor?.vendor_id
                            }?vendor_1_name=${encodeURIComponent(
                              item?.verified_vendor?.vendor_name
                            )}&vendor_2_name=${encodeURIComponent(
                              item?.potential_duplicate_vendor?.vendor_name
                            )}&finding_id=${
                              item?.finding_id
                            }&vendor_1_human_verified=${
                              item?.verified_vendor?.human_verified
                            }&vendor_2_human_verified=${
                              item?.potential_duplicate_vendor?.human_verified
                            }`}
                            className={`${
                              index == 0 && "!border-t-0"
                            } grid grid-cols-5 border-b cursor-pointer md:h-[2.75rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] content-center self-center w-full items-center dark:!text-white text-xs sm:text-sm `}
                          >
                            <TableCell className="border-r h-full font-poppins !break-word dark:text-white md:h-[2.75rem] md:min-h-[2.65rem] 2xl:h-[4rem] self-center content-center  !truncate whitespace-normal px-[0.6rem] capitalize text-sm font-normal">
                              <CustomTooltip
                                className={"!min-w-fit"}
                                content={
                                  item?.verified_vendor?.vendor_name?.length >
                                    30 && item?.verified_vendor?.vendor_name
                                }
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    window.open(
                                      `${OLD_UI}/vendor-consolidation-v2/${item?.verified_matching_vendor?.vendor_id}`
                                    );
                                  }}
                                  className="flex text-primary items-center  justify-between truncate  w-full !capitalize gap-x-4"
                                >
                                  <span>
                                    {" "}
                                    {item?.verified_matching_vendor?.vendor_name
                                      ?.length > 30
                                      ? item?.verified_matching_vendor?.vendor_name?.slice(
                                          0,
                                          30
                                        ) + "..."
                                      : item?.verified_matching_vendor
                                          ?.vendor_name}
                                  </span>
                                  {item?.verified_matching_vendor
                                    ?.human_verified && (
                                    <span>{<img src={approved} alt="" />}</span>
                                  )}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell className="font-normal dark:!text-white capitalize border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center truncate">
                              <CustomTooltip
                                className={"!min-w-fit"}
                                content={
                                  item?.vendor?.vendor_name?.length >
                                    30 && item?.vendor?.vendor_name
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
                                  className="flex items-center text-primary  justify-between truncate  w-full !capitalize gap-x-4"
                                >
                                  <span>
                                    {" "}
                                    {item?.vendor?.vendor_name?.length > 30
                                      ? item?.vendor?.vendor_name?.slice(
                                          0,
                                          30
                                        ) + "..."
                                      : item?.vendor?.vendor_name ||"-"}
                                  </span>
                                  {item?.vendor?.human_verified && (
                                    <span>{<img src={approved} alt="" />}</span>
                                  )}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell className="font-normal  dark:!text-white border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center">
                              <CustomTooltip
                                className={"!min-w-72"}
                                content={item?.match_reason}
                              >
                                <div className=" !min-w-72 flex justify-start items-center !min-h-12 ">
                                  {item?.similarity_score}
                                </div>
                              </CustomTooltip>
                            </TableCell>
                            <TableCell
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMergeConfirmationModal(true);
                                setCurrentSelectedRow({
                                  index: index,
                                  master_vendor: item?.verified_matching_vendor,
                                  vendor: item?.vendor,
                                  isLoading: false
                                });
                              }}
                              className="font-normal border-r  md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm content-center"
                            >
                              <Button
                                disabled={currentSelectedRow?.isLoading||!item?.vendor?.vendor_id}
                                className="bg-transparent hover:bg-transparent shadow-none border-none disabled:cursor-not-allowed"
                              >
                                {currentSelectedRow?.index == index &&
                                currentSelectedRow?.isLoading ? (
                                  <Loader className={"text-gray-500 "} />
                                ) : (
                                  <Combine className="text-gray-500 " />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-normal  dark:!text-white border-r md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-gray-500 content-center">
                              <div className="flex items-center gap-x-1">
                                <CustomTooltip content={"Delete Finding"}>
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeletionFinding({
                                        id: item?.id,
                                        index: index,
                                        isLoading: true
                                      });
                                      deleteDuplicateVendor(item?.id, {
                                        onSuccess: () => {
                                          setDeletionFinding({
                                            id: null,
                                            index: null,
                                            isLoading: false
                                          });
                                        },
                                        onError: () => {
                                          setDeletionFinding({
                                            id: null,
                                            index: null,
                                            isLoading: false
                                          });
                                        }
                                      });
                                    }}
                                    disabled={currentSelectedRow?.isLoading||!item?.vendor?.vendor_id}
                                    className="bg-transparent hover:bg-transparent shadow-none border-none disabled:cursor-not-allowed"
                                  >
                                    {deletetionFinding?.index == index &&
                                    deletetionFinding?.isLoading ? (
                                      <Loader
                                        className={"text-gray-500 h-4 w-4"}
                                      />
                                    ) : (
                                      <Trash2 className="text-gray-500 " />
                                    )}
                                  </Button>
                                </CustomTooltip>
                                <CustomTooltip
                                  content={
                                    currentVendorId !==
                                      item?.vendor?.vendor_id && "View Pdfs"
                                  }
                                >
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (
                                        currentRowIndex == index &&
                                        currentVendorId ==
                                          item?.vendor?.vendor_id
                                      ) {
                                        setCurrenRowIndex(null);
                                        setCurrentVendorId(null);
                                      } else {
                                        setCurrenRowIndex(index);
                                        setCurrentVendorId(
                                          item?.vendor?.vendor_id
                                        );
                                      }
                                    }}
                                    disabled={currentSelectedRow?.isLoading||!item?.vendor?.vendor_id}
                                    className="bg-transparent hover:bg-transparent shadow-none border-none disabled:cursor-not-allowed"
                                  >
                                    {currentRowIndex == index &&
                                    currentVendorId ==
                                      item?.vendor?.vendor_id ? (
                                      <X className={"text-red-500 "} />
                                    ) : (
                                      <Eye className="text-gray-500 " />
                                    )}
                                  </Button>
                                </CustomTooltip>
                              </div>
                            </TableCell>
                          </Link>
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
            {currentVendorId !== null && (
              pdfsData?.data[currentVendorId]?
              <div className="!w-1/2">
                <PdfViewer
                  pdfUrls={pdfsData?.data[currentVendorId]}
                  isLoading={loadingPdfsData}
                  height={58}
                  multiple={true}
                />
              </div>:<div className="w-full flex items-center justify-center  h-full">
                
                <p className="font-poppins font-semibold text-sm text-black">No Pdfs Found</p>
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
            master_vendor: null,
            vendor: null,
            isLoading: false
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
                {currentSelectedRow?.vendor?.vendor_name}
              </span>{" "}
              with{" "}
              <span className="font-medium text-black capitalize">
                {currentSelectedRow?.master_vendor?.vendor_name}
              </span>{" "}
              ?
            </p>
            <div className="flex items-center gap-x-4 mb-4 mt-8">
              <Button
                onClick={() => {
                  setCurrentSelectedRow({
                    index: null,
                    master_vendor: null,
                    vendor: null,
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
                  combineVendors(
                    {
                      vendor_id: currentSelectedRow?.master_vendor?.vendor_id,
                      data: [currentSelectedRow?.vendor?.vendor_id]
                    },
                    {
                      onSuccess: () => {
                        setCurrentSelectedRow({
                          index: null,
                          master_vendor: null,
                          vendor: null,
                          isLoading: false
                        });
                        setShowMergeConfirmationModal(false);
                        queryClient.invalidateQueries([
                          "recent-duplicate-vendor-findings"
                        ]);
                      },
                      onError: () => {
                        setCurrentSelectedRow({
                          index: null,
                          master_vendor: null,
                          vendor: null,
                          isLoading: false
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

export default RecentDuplicateVendorsListing;
