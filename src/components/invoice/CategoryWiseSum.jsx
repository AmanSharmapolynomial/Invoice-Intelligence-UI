import React from "react";
import { Table, TableBody, TableHead, TableRow } from "../ui/table";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";

const CategoryWiseSum = ({}) => {
    const {categoryWiseSum}=invoiceDetailStore();

  return (
    <div
      className="w-full   border-[#F0F0F0]  rounded-md my-4 px-2"
      style={{ boxShadow: "0px 0px 8px 0px #0000001F" }}
    >
      <Table>
        <TableRow className="border-b border-b-[#E0E0E0] ">
          <TableHead>
            <p className="font-poppins font-semibold  pl-[5rem] text-[#000000] px-4 text-base py-3 leading-6">
              Category
            </p>
          </TableHead>
          <TableHead>
            <p className="font-poppins font-semibold pl-[17rem] text-[#000000] px-4 text-base  py-3 leading-6">
              Total
            </p>
          </TableHead>
        </TableRow>
        <TableBody>
{categoryWiseSum?.map(({category,sum},i)=>{
    return (
        <TableRow className="border-none space-y-0 " key={i}>
        <TableHead>
          <p className="font-poppins font-normal  pl-[5rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
            {category}
          </p>
        </TableHead>
        <TableHead>
          <p className="font-poppins font-normal  pl-[17rem] text-[#000000] px-4 text-sm py-3 leading-6 capitalize">
            {sum}
          </p>
        </TableHead>
      </TableRow>
    )
})}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryWiseSum;
