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
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
const VendorsTable = ({ columns, data, isLoading }) => {
  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          .split(/[[\]]/g) // Split on brackets
          .filter(Boolean) // Remove empty strings
          .reduce((o, k) => (o ? o[k] : null), obj) // Access nested properties
      : obj[key];
  };
  const navigate = useNavigate();

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
            {isLoading ? (
              <>
                {new Array(25)?.fill(25)?.map((it, i) => {
                  return (
                    <TableRow
                      key={i}
                      className={`grid grid-cols-${columns?.length} w-full items-center text-xs sm:text-sm`}
                    >
                      {[0, 2, 3, 4]?.map((cel) => {
                        return (
                          <TableCell
                            key={cel}
                            className={`border-r h-full font-poppins px-[0.8rem] capitalize text-sm font-normal `}
                          >
                            <Skeleton className={"w-44 h-5"} />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <div className="w-full">
                {data
                  ?.sort(
                    (a, b) =>
                      b?.vendor?.human_verified - a?.vendor?.human_verified
                  )
                  ?.map((row, rowIndex) => (
                    <TableRow
                      onClick={() =>
                        navigate(
                          `/fast-item-verification/${row?.vendor?.vendor_id}?vendor_name=${row?.vendor?.vendor_name}&human_verified=${row?.vendor?.human_verified}&from_view=item-master-vendors`
                        )
                      }
                      key={rowIndex}
                      className={`grid grid-cols-${columns?.length} w-full items-center cursor-pointer text-xs sm:text-sm`}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={`border-r h-full font-poppins px-[0.8rem] capitalize text-sm font-normal `}
                        >
                          <div className="flex gap-x-4 ">
                            {column?.key == "vendor[recent_addition_date]"
                              ? formatDateTimeToReadable(
                                  getValue(row, column?.key)
                                ) || "-"
                              : getValue(row, column?.key) || "-"}
                            {column?.key == "vendor[vendor_name]" &&
                              row?.vendor?.human_verified && (
                                <img src={approved} alt=""></img>
                              )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorsTable;
