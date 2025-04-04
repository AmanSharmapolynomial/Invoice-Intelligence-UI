import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import approved from "@/assets/image/approved.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useGetVendorBranchDuplicateFindingsSummary } from "@/components/vendor/potentialDuplicates/api";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import no_data from "@/assets/image/no-data.svg";

const VendorsDuplicateBranchFindingsListing = () => {
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  const { data, isLoading } = useGetVendorBranchDuplicateFindingsSummary({
    page,
    page_size
  });

  return (
    <div className="overflow-hidden flex w-full h-full">
      <Sidebar />

      <div className="w-full ml-12 h-full">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Vendors with Potential Duplicate Branches"
            crumbs={[
              { path: null, label: "Vendors with Potential Duplicate Branches" }
            ]}
          />
          <div className="w-full mt-4">
            <div className="rounded-md border overflow-x-auto">
              <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[72vh] 2xl:max-h-[78vh] overflow-auto">
                <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
                  <TableRow className="!text-white !rounded-md w-full grid grid-cols-2 md:max-h-[5.65rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm">
                    <TableHead className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1">
                      Vendor
                    </TableHead>
                    <TableHead className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1">
                      Duplicate Branch Findings
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="h-full ">
                  <div className="flex flex-col gap-y-0 ">
                    {isLoading ? (
                      <div>
                        {new Array(10).fill(0).map((_, index) => (
                          <TableRow
                            key={index}
                            className="border-none h-[3.75rem] grid grid-cols-2 items-center content-center"
                          >
                            {[0, 1].map((it) => (
                              <TableCell key={it}>
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
                            to={`/combine-duplicate-branch-findings/${item?.vendor?.vendor_id}`}
                            className={`${
                              index == 0 && "!border-t-0"
                            } grid grid-cols-2 border-b cursor-pointer md:h-[2.75rem] md:min-h-[3.65rem] 2xl:min-h-[4rem] content-center self-center w-full items-center text-xs sm:text-sm `}
                          >
                            <TableCell className="border-r h-full font-poppins !break-word dark:text-white md:h-[2.75rem] md:min-h-[2.65rem] 2xl:h-[4rem] self-center content-center !truncate whitespace-normal px-[0.8rem] capitalize text-sm font-normal">
                              <div className="flex items-center gap-x-2">
                                <span>{item?.vendor?.vendor_name}</span>
                                {item?.vendor?.human_verified && (
                                  <span>
                                    <img
                                      src={approved}
                                      alt=""
                                      className="h-4 w-4"
                                    />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-normal md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem]  font-poppins text-sm text-black content-center">
                              {item?.total_findings}
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
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default VendorsDuplicateBranchFindingsListing;
