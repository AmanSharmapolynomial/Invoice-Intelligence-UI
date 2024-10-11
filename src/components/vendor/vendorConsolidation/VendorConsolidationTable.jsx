import no_data from "@/assets/image/no-data.svg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { vendorConsolidationHeaders } from "@/constants";
import { Eye, Trash2, Verified } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteVendor } from "@/components/vendor/api";
const VendorConsolidationTable = ({ data, isLoading }) => {
  const { mutate: deleteVendor, isPending: deletingVendor } = useDeleteVendor();
  const handleDeleteVendor = (vendor_id) => {
    deleteVendor(vendor_id);
  };
  return (
    <>
      <Table className="flex flex-col   box-border  scrollbar ">
        <TableHeader className="min-h-16">
          <TableRow className="flex  text-base  !border-none  ">
            {vendorConsolidationHeaders?.map(({ label, styling }) => (
              <TableHead
                key={label}
                className={`flex  border-r !text-left items-center  !font-semibold !text-gray-800 !${styling} border-b   bg-gray-200 h-14`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <div className="flex-1 ">
          <TableBody className="flex-1 h-full  ">
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
                          <TableHead
                            key={i}
                            className="flex  !text-left items-center justify-center pl-8 pb-4 !font-semibold !text-gray-800 !min-w-52 border-b  "
                          >
                            {" "}
                            <Skeleton className={"w-36 h-5"} />
                          </TableHead>
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
                      className="flex  text-base !items-center leading-5  !min-h-16  !border-none"
                      key={index}
                    >
                      <TableHead className="flex  border-r !text-left justify-between items-center gap-x-4 pl-6  !font-normal !text-gray-800 !min-w-60 border-b pb-4 !capitalize  ">
                        <Link
                          to={`/vendor-details/${vendor_id}`}
                          className="underline underline-offset-2 "
                        >
                          {vendor_name}
                        </Link>
                        <span>
                          {human_verified && (
                            <Verified d className="h-4 w-4 text-primary" />
                          )}
                        </span>
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-start pl-4  !font-normal !text-gray-800 !min-w-60 border-b pb-4  !capitalize ">
                        {vendor_category}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10  gap-x-2 !text-left items-center justify-start pl-4 !font-normal !text-gray-800 !min-w-36 border-b pb-4  ">
                        {created_date?.split("T")[0]}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-40 border-b  pb-4">
                        {document_count}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  capitalize !font-normal !text-gray-800 !min-w-40 border-b pb-4">
                        {branch_count}{" "}
                      </TableHead>
                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  capitalize pl-4 !font-normal !text-gray-800 !min-w-48 border-b pb- pb-4">
                        {verified_branch_count}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center pl-4 !font-normal !text-gray-800 !min-w-40 border-b  pb-4">
                        {item_count}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center  !font-normal !text-gray-800 !min-w-48 border-b  pb-4">
                        {verified_item_count}{" "}
                      </TableHead>

                      <TableHead className="flex  border-r !min-h-10 !text-left items-center justify-center !font-normal !text-gray-800 !min-w-44 border-b  pb-4">
                        {verified_by?.["username"]}{" "}
                      </TableHead>

                      <TableHead className="flex  !text-left items-center justify-center   !font-normal !text-gray-800 !min-w-44  border-b border-r  pb-4">
                        <Link to={`/invoice-details?vendor=${vendor_id}`}>
                          <Button className="bg-transparent border-none shadow-none hover:bg-transparent">
                            <Eye className="h-5  text-primary cursor-pointer" />
                          </Button>
                        </Link>
                        <Button
                          className="bg-transparent border-none shadow-none hover:bg-transparent"
                          disabled={deletingVendor}
                          onClick={() => handleDeleteVendor(vendor_id)}
                        >
                          <Trash2 className="h-5 w-5 text-red-600 cursor-pointer  " />
                        </Button>
                      </TableHead>
                    </TableRow>
                  );
                }
              )
            ) : (
              <div className="flex justify-center items-center h-[50vh] !w-[95vw] !overflow-hidden">
                <img src={no_data} alt="" className="flex-1 h-full" />
              </div>
            )}{" "}
          </TableBody>
        </div>
      </Table>
    </>
  );
};

export default VendorConsolidationTable;
