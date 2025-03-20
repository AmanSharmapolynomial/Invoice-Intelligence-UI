import { Skeleton } from "@/components/ui/skeleton";
import no_data from "@/assets/image/no-data.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import React from "react";
import approved from "@/assets/image/approved.svg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const PotentialDuplicatesTable = ({ data, isLoading, columns }) => {
  const navigate = useNavigate();
  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          ?.split(/[[\]]/g)
          ?.filter(Boolean)
          ?.reduce((o, k) => (o ? o[k] : null), obj)
      : obj[key];
  };
  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[73vh] 2xl:max-h-[78vh] overflow-auto">
          <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
            <TableRow
              className={`!text-white !rounded-md w-full grid grid-cols-${columns?.length} md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm`}
            >
              {columns?.map((column) => (
                <TableHead
                  key={column.key}
                  // onClick={() => handleSort(column)}
                  className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1"
                >
                  {column?.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {isLoading ? (
              Array?.from({ length: 10 }).map((_, i) => (
                <TableRow
                  key={i}
                  className={`grid grid-cols-${columns?.length} md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] content-center self-center w-full items-center text-xs sm:text-sm`}
                >
                  {columns?.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className="border-r h-full font-poppins px-[0.8rem] capitalize text-sm md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] content-center self-center font-normal"
                    >
                      <Skeleton className="w-44 h-5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <div className="w-full flex flex-col gap-y-1 justify-between h-full">
                {data?.findings?.length > 0 ? (
                  data?.findings?.map((row, index) => {
                    return (
                      <TableRow onClick={() => {}} key={index}>
                        <Link
                          className={`grid grid-cols-${columns?.length} w-full md:max-h-[2.75rem]  md:min-h-[2.65rem] 2xl:min-h-[4rem] xl:min-h-[3.25rem] self-center content-center cursor-pointer text-xs sm:text-sm`}
                          target="_blank"
                          to={`/combine-duplicate-vendors/${row?.verified_vendor?.vendor_id}/${row?.potential_duplicate_vendor?.vendor_id}?vendor_1_name=${row?.verified_vendor?.vendor_name}&vendor_2_name=${row?.potential_duplicate_vendor?.vendor_name}&finding_id=${row?.finding_id}`}
                        >
                          {" "}
                          {columns?.map((col, i) => {
                            return (
                              <TableCell
                                key={i}
                                className="border-r h-full font-poppins !break-word dark:text-white md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center !truncate whitespace-normal px-[0.8rem] capitalize text-sm font-normal"
                              >
                                <div className="flex items-center gap-x-2 break-words truncate whitespace-normal">
                                  <span>
                                    {" "}
                                    {getValue(row, col?.key)}
                                    {col?.key == "similarity_score" && "%"}
                                  </span>
                                  {col?.key ==
                                  "verified_vendor[vendor_name]" ? (
                                    <div>
                                      {row?.verified_vendor?.human_verified && (
                                        <img src={approved} alt="" />
                                      )}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                        </Link>
                      </TableRow>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-start w-full h-full">
                    <img src={no_data} alt="" className="h-[80%]  w-[60%]" />
                  </div>
                )}
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PotentialDuplicatesTable;
