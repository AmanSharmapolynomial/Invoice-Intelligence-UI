import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import approved from "@/assets/image/approved.svg";

import { Verified } from "lucide-react";
import { formatDateTimeToReadable } from "@/lib/helpers";
const VendorsTable = ({ columns, data }) => {
  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          .split(/[[\]]/g) // Split on brackets
          .filter(Boolean) // Remove empty strings
          .reduce((o, k) => (o ? o[k] : null), obj) // Access nested properties
      : obj[key];
  };

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative !min-h-full box-border flex flex-col min-w-full">
          <TableHeader className="w-full sticky top-0 z-10 pr-[0.7rem]">
            <TableRow
              className={`!text-white !rounded-md w-full  grid grid-cols-${columns?.length} items-center justify-center text-xs sm:text-sm `}
            >
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={
                    " font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r  items-center flex"
                  }
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[44rem] overflow-auto w-full">
            <div className="w-full">
              {data?.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`grid grid-cols-${columns?.length} w-full items-center text-xs sm:text-sm`}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`border-r h-full font-poppins px-[0.8rem] capitalize text-sm font-normal `}
                    >
                      {column?.key == "vendor[human_verified]" &&
                      getValue(row, column?.key) == true ? (
                        <img src={approved} />
                      ) : column?.key == "vendor[recent_addition_date]" ? (
                        formatDateTimeToReadable(getValue(row, column?.key))
                      ) : (
                        getValue(row, column?.key)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </div>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorsTable;
