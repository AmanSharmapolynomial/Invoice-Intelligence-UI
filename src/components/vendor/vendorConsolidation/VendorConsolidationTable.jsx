import no_data from "@/assets/image/no-data.svg";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useDeleteVendor } from "@/components/vendor/api";
import { vendorConsolidationHeaders } from "@/constants";
import { Eye, Trash2, Verified } from "lucide-react";
import { Link } from "react-router-dom";
const VendorConsolidationTable = ({
  data,
  isLoading,
  className,
  totalPages,
  style,
  height
}) => {
  const { mutate: deleteVendor, isPending: deletingVendor } = useDeleteVendor();
  const handleDeleteVendor = (vendor_id) => {
    deleteVendor(vendor_id);
  };
console.log(height)
  return (
    <Table
      className={`flex flex-col   box-border  scrollbar mt-4 !h-[100%] w-[100%]   overflow-auto    `}
    >
      <TableHeader className="bg-white sticky top-0 ">
        <TableRow className="flex  text-base !sticky   !border-none  w-full  justify-between ">
          {vendorConsolidationHeaders?.map(({ label, styling }) => (
            <TableHead
              key={label}
              className={`font-poppins w-[10%] !font-semibold text-sm !text-[#000000] ${
                [
                  "Item Count",
                  "Verified Branch Count",
                  "Branch Count",
                  "Actions"
                ]?.includes(label)
                  ? "flex justify-center"
                  : ""
              }`}
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {/* <div className="flex-1 "> */}
      <TableBody   style={{ maxHeight: `${height}vh`}}  className={`   flex-1  !overflow-auto  w-full   `}>
        {/* <div> */}
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8]?.map((_, index) => {
              return (
                <TableRow
                  className="flex  !text-sm !border-none !min-h-16"
                  key={index}
                >
                  {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]?.map(
                    (_, i) => {
                      return (
                        <TableCell
                          key={i}
                          className="flex  !text-left items-center justify-center pl-8 pb-4 !font-semibold !text-gray-800 !min-w-52 border-b  "
                        >
                          {" "}
                          <Skeleton className={"w-36 h-5"} />
                        </TableCell>
                      );
                    }
                  )}{" "}
                </TableRow>
              );
            })
          ) : data && Object?.keys(data)?.length > 0 ? (
            data?.map(
              (
                {
                  vendor_id,
                  vendor_name,
                  created_date,
                  human_verified,
                  vendor_category,
                  branch_count,
                  verified_branch_count,
                  document_count,
                  item_count,
                  verified_item_count,
                  verified_by
                },
                index
              ) => {
                return (
                  <TableRow
                    className={`${index==data?.length-1 && "pb-0"} flex justify-between border-none items-center w-full !text-sm   !font-poppins`}
                    key={index}
                  >
                    <TableCell className="w-[10%] border-none flex items-center gap-x-2 justify-between !pr-5  !text-[#1E7944] !font-normal font-poppins ">
                      <Link to={`/vendor-details/${vendor_id}`} className="">
                        {vendor_name?.slice(0, 15)}
                      </Link>
                      <span>
                        {human_verified && (
                          <Verified d className="h-4 w-4 text-primary" />
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem]">
                      {vendor_category}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] ">
                      {created_date?.split("T")[0]}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] pl-[3.5rem]">
                      {document_count}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] flex justify-center">
                      {branch_count}{" "}
                    </TableCell>
                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] flex justify-center">
                      {verified_branch_count}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] flex justify-center">
                      {item_count}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] pl-[4.8rem]">
                      {verified_item_count}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] ">
                      {verified_by?.["username"]}{" "}
                    </TableCell>

                    <TableCell className="w-[10%] !border-none  font-poppins font-normal !text-sm text-[#000000] h-[2.375rem] items-center gap-x-4 justify-center flex">
                      <Link to={`/invoice-details?vendor=${vendor_id}`}>
                        <Button
                          className="bg-transparent border-none shadow-none hover:bg-transparent p-0"
                          disabled={deletingVendor}
                        >
                          <Eye className="h-5  text-primary cursor-pointer" />
                        </Button>
                      </Link>
                      <Button
                        className="bg-transparent border-none shadow-none hover:bg-transparent p-0"
                        disabled={deletingVendor}
                        onClick={() => handleDeleteVendor(vendor_id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-600 cursor-pointer  " />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )
          ) : (
            <div className="flex justify-center items-center h-[50vh] !w-[95vw] !overflow-hidden">
              <img src={no_data} alt="" className="flex-1 h-full" />
            </div>
          )}{" "}
        {/* </div> */}
      </TableBody>
      {/* </div> */}
    </Table>
  );
};

export default VendorConsolidationTable;
