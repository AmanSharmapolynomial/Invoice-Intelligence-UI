import React from "react";
import { Table, TableBody, TableHead, TableRow } from "../ui/table";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router-dom";

const CategoryWiseSum = ({ isLoading }) => {
  const [searchParams] = useSearchParams();
  const document_uuid = searchParams.get("document_uuid");
  const { categoryWiseSum } = invoiceDetailStore();

  return (
    <div
      className={`${
        document_uuid && "mt-16"
      } w-full   border-[#F0F0F0]  rounded-md max-h-[20rem] relative overflow-auto my-4 px-2`}
      style={{ boxShadow: "0px 0px 8px 0px #0000001F" }}
    >
      <Table>
        <TableRow className="border-b border-b-[#E0E0E0]  !sticky !top-0">
          <TableHead>
            <p className="font-poppins font-semibold  pl-[5rem] text-[#000000] px-4 text-base py-3 leading-6">
              Category
            </p>
          </TableHead>
          <TableHead>
            <p className="font-poppins font-semibold 2xl:pl-[17rem] md:pl-[17em] text-[#000000] px-4 text-base  py-3 leading-6">
              Total
            </p>
          </TableHead>
        </TableRow>
        <TableBody className="!max-h-[10rem] !overflow-auto">
          {isLoading ? (
            <>
              {[1, 2, 3]?.map((_, i) => {
                return (
                  <TableRow className="border-none space-y-0 " key={i}>
                    <TableHead>
                      <p className="font-poppins font-normal  pl-[5rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
                        <Skeleton className={"w-44 h-4"} />
                      </p>
                    </TableHead>
                    <TableHead>
                      <p className="font-poppins font-normal  pl-[17rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
                        <Skeleton className={"w-44 h-5"} />
                      </p>
                    </TableHead>
                  </TableRow>
                );
              })}
            </>
          ) : (
            categoryWiseSum?.map(({ category, sum }, i) => {
              return (
                <TableRow className="border-none space-y-0 " key={i}>
                  <TableHead>
                    <p className="font-poppins font-normal  pl-[5rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
                      {category}
                    </p>
                  </TableHead>
                  <TableHead>
                    <p className="font-poppins font-normal  2xl:pl-[16.8rem] md:pl-[16rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
                       {String(sum)?.includes("N") ? "NA" : `$${sum?.toFixed(2)}`}
                    </p>
                  </TableHead>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryWiseSum;
