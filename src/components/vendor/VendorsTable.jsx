import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import approved from "@/assets/image/approved.svg";
import { ChevronsDownUp, ChevronUp, Verified } from "lucide-react";
import { formatDateTimeToReadable } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ChevronDown } from "lucide-react";

const VendorsTable = ({ columns, data, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          .split(/[[\]]/g)
          .filter(Boolean)
          .reduce((o, k) => (o ? o[k] : null), obj)
      : obj[key];
  };

  const sortedData = [...(data || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (sortConfig.key === "vendor[recent_addition_date]") {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : prev.direction === "desc"
          ? { key: null, direction: null }
          : { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      );
    }
    return <ChevronsDownUp size={16} className="opacity-50" />;
  };

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative !min-h-full box-border flex flex-col min-w-full max-h-[74vh] 2xl:max-h-[78vh] overflow-auto">
          <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary  ">
            <TableRow
              className={`!text-white  !rounded-md w-full  grid grid-cols-${columns?.length} items-center justify-center text-xs sm:text-sm `}
            >
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={
                    "cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black leading-5 text-sm border-r items-center flex gap-1"
                  }
                >
                  {column.label} {getSortIcon(column.key)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 25 }).map((_, i) => (
                <TableRow
                  key={i}
                  className={`grid grid-cols-${columns?.length} w-full items-center text-xs sm:text-sm`}
                >
                  {[0, 2, 3, 4, 5].map((cel) => (
                    <TableCell
                      key={cel}
                      className="border-r h-full font-poppins px-[0.8rem] capitalize text-sm font-normal"
                    >
                      <Skeleton className="w-44 h-5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <div className="w-full">
                {sortedData.map((row, rowIndex) => (
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
                        className="border-r h-full font-poppins !break-word dark:text-white !truncate whitespace-normal  px-[0.8rem] capitalize text-sm font-normal"
                      >
                        <div className="flex gap-x-4 !break-word whitespace-normal">
                          {column?.key === "vendor[recent_addition_date]"
                            ? formatDateTimeToReadable(
                                getValue(row, column?.key)
                              ) || "-"
                            : getValue(row, column?.key) || "-"}
                          {column?.key === "vendor[vendor_name]" &&
                            row?.vendor?.human_verified && (
                              <img src={approved} alt="" />
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
