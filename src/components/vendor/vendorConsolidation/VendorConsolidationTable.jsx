import approved from "@/assets/image/approved.svg";
import no_data from "@/assets/image/no-data.svg";
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
import { Eye, Trash2 } from "lucide-react";
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

  return (
    <Table
      className={`flex flex-col border dark:bg-[#051C14]   mt-4 !h-[100%] w-[100%]   dark:border-l dark:border-r dark:border-primary  overflow-auto    `}
    >
      <TableHeader className="bg-white dark:bg-[#051C14] h-12 !sticky top-0 ">
        <TableRow className="flex  text-base !sticky     items-center w-full  justify-between pl-[1rem]">
          {vendorConsolidationHeaders?.map(({ label, styling }) => (
            <TableHead
              key={label}
              className={`font-poppins w-[10%] border-r h-12 !font-semibold   text-center text-sm !text-[#000000] dark:!text-[#F6F6F6] ${
                [
                  "Item Count",
                  "Verified Branch Count",
                  "Branch Count",
                  "Actions",
                  "Verified Item Count"
                ]?.includes(label)
                  ? "flex justify-start pl-[1rem]"
                  : "pl-[1rem]"
              }`}
            >
              <div className="flex items-center justify-start h-full">
                <p> {label}</p>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {/* <div className="flex-1 "> */}
      <TableBody
        style={{ height: `${height}vh` }}
        className={`!rounded-none  w-full dark:border-b dark:border-b-primary pl-[1rem] `}
      >
        {/* <div> */}
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9,10]?.map((_, index) => {
            return (
              <TableRow
                className="flex  !text-sm !border-none  !min-w-[100%] h-14"
                key={index}
              >
                {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]?.map(
                  (_, i) => {
                    return (
                      <TableCell
                        key={i}
                        className="flex  !text-left items-center justify-center   !font-semibold !text-gray-800 border-none  w-[10%] "
                      >
                        {" "}
                        <Skeleton className={"w-full h-[2rem]"} />
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
                  className={`${
                    index == data?.length - 1 && "pb-0"
                  }  flex justify-between border-none items-center w-full h-14 !text-sm   !font-poppins`}
                  key={index}
                >
                  <TableCell className="w-[10%] border-r h-full border-b content-center flex items-center gap-x-2 justify-between !pr-5  !text-[#1E7944] !font-normal font-poppins ">
                    <Link to={`/vendor-details/${vendor_id}`} className="">
                      {vendor_name?.slice(0, 15)}
                    </Link>
                    <span>
                      {human_verified && (
                        <img src={approved} className="h-4 w-4 text-primary" />
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full  font-poppins font-normal !text-sm text-[#000000] border-b">
                    {vendor_category}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full font-poppins font-normal !text-sm text-[#000000] border-b ">
                    {created_date?.split("T")[0]}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full  font-poppins font-normal !text-sm text-[#000000] border-b pl-[1rem]">
                    {document_count}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] !content-center h-full  items-center font-poppins font-normal !text-sm text-[#000000] border-b flex justify-start pl-[1rem]">
                    {branch_count}{" "}
                  </TableCell>
                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full  items-center font-poppins font-normal !text-sm text-[#000000] border-b flex justify-start pl-[1rem]">
                    {verified_branch_count}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full items-center font-poppins font-normal !text-sm text-[#000000] border-b flex justify-start pl-[1rem]">
                    {item_count}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full   font-poppins font-normal !text-sm text-[#000000] border-b  pl-[1rem]">
                    {verified_item_count}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full font-poppins font-normal !text-sm text-[#000000] border-b ">
                    {verified_by?.["username"]}{" "}
                  </TableCell>

                  <TableCell className="w-[10%] border-r dark:text-[#F6F6F6] content-center h-full  font-poppins font-normal !text-sm text-[#000000] border-b items-center gap-x-4 justify-start pl-[1rem] flex">
                    <Link to={`/invoice-details?vendor=${vendor_id}`}>
                      <Button
                        className="bg-transparent border-none shadow-none hover:bg-transparent p-0"
                        disabled={deletingVendor}
                      >
                        <Eye className="h-[1rem] cursor-pointer dark:text-textColor/200  text-[#1C1C1E] " />
                      </Button>
                    </Link>
                    <Button
                      className="bg-transparent border-none shadow-none hover:bg-transparent p-0"
                      disabled={deletingVendor}
                      onClick={() => handleDeleteVendor(vendor_id)}
                    >
                      <Trash2 className="h-[1rem]  dark:text-textColor/200  text-[#1C1C1E] cursor-pointer  " />
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
