import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { vendorDetailsPageFirstColRowData } from "@/constants";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const VendorDetailsTable = ({ data = [], isLoading = false }) => {
  return (
    <div className="w-full ">
      <Table className="flex flex-col   box-border  scrollbar !w-full ">
        <TableRow className="flex  text-base  !border-none  ">
          <div className="!min-w-[50%]">
            <TableHead className="flex  border-r !text-left items-center justify-start pl-[15%] !font-semibold !text-gray-800  border-b   bg-gray-200 h-14">
              Field Name
            </TableHead>
            {vendorDetailsPageFirstColRowData.map(({ label, value }) => (
              <TableCell
                key={label}
                className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14"
              >
                {label}
              </TableCell>
            ))}
          </div>
          <div className="!min-w-[50%]">
            <TableHead className="flex  border-r !text-left items-center justify-start pl-[15%] !font-semibold !text-gray-800  border-b  !min-h-14 bg-gray-200 h-14">
              Field Value
            </TableHead>

            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              {data?.["vendor_id"]}
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14 ">
              <Input value={data?.vendor_name} />
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              <Switch value={data?.["human_verified"]} />
            </TableCell>

            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              <Switch value={data?.["auto_approve_invoices"]} />
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              {data?.["branch_count"]}
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              {data?.["verified_branch_count"]}
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              {data?.["item_count"]}
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
             
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
      
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
        
            </TableCell>
            <TableCell className="flex  !text-left items-center justify-start pl-[15%]   !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
              
            </TableCell>
          </div>
        </TableRow>

        <div className="flex-1 !w-full">
          <TableBody className="flex-1 h-full  ">
            <div className="grid grid-cols-2  ">
              <div></div>
              <div></div>
            </div>
          </TableBody>
        </div>
      </Table>
    </div>
  );
};

export default VendorDetailsTable;
