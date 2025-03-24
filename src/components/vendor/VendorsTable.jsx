import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import approved from "@/assets/image/approved.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateTimeToReadable } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import no_data from "@/assets/image/no-data.svg";

const sortingStates = ["all", "asc", "desc"];

const VendorsTable = ({ columns, data, isLoading, vendorName }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortConfig, setSortConfig] = useState({ key: "", order: "all" });
  let vendor_name = searchParams.get("vendor_name");

  const handleSort = (column) => {
    const newOrder =
      sortConfig.key === column.key && sortConfig.order === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: column.key, order: newOrder });
    setSearchParams({ sort_by: column.key, sort_order: newOrder });
  };
  const getValue = (obj, key) => {
    return key.includes("[")
      ? key
          ?.split(/[[\]]/g)
          ?.filter(Boolean)
          ?.reduce((o, k) => (o ? o[k] : null), obj)
      : obj[key];
  };
  const sortedData = useMemo(() => {
    if (!sortConfig.key || sortConfig.order === "all") return data;

    return [...data]?.sort((a, b) => {
      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);

      if (sortConfig?.key === "vendor[recent_addition_date]") {
        return sortConfig?.order === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (sortConfig?.key === "vendor[vendor_name]") {
        return sortConfig?.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="w-full mt-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="!rounded-md !relative box-border flex flex-col min-w-full h-[75vh] 2xl:max-h-[78vh] overflow-auto">
          <TableHeader className="w-full sticky top-0 z-10 bg-white dark:bg-primary">
            <TableRow
              className={`!text-white !rounded-md w-full grid grid-cols-${columns?.length} md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center items-center justify-center text-xs sm:text-sm`}
            >
              {columns?.map((column) => (
                <TableHead
                  key={column.key}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer font-poppins !px-[0.75rem] font-semibold text-black md:max-h-[5.65rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center leading-5 text-sm border-r items-center flex gap-1"
                >
                  {column?.label}
                  {sortConfig.key === column.key ? (
                    sortConfig.order === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
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
              <div className="w-full flex flex-col justify-between h-full">
                {sortedData?.length > 0 ? (
                  sortedData
                    ?.filter((r) =>
                      r?.vendor?.vendor_name
                        ?.toLowerCase()
                        ?.includes(vendorName?.toLowerCase())
                    )

                    ?.map((row, rowIndex) => (
                      <Link
                        to={`/fast-item-verification/${
                          row?.vendor?.vendor_id
                        }?vendor_name=${encodeURIComponent(
                          row?.vendor?.vendor_name
                        )}&human_verified=${
                          row?.vendor?.human_verified
                        }&from_view=item-master-vendors`}
                        target="_blank"
                        key={rowIndex}
                        className={`grid grid-cols-${columns?.length} w-full md:max-h-[2.75rem]  md:min-h-[2.65rem] 2xl:min-h-[4rem] xl:min-h-[3.25rem] border border-grey/5 self-center content-center cursor-pointer text-xs sm:text-sm`}
                      >
                        {columns?.map((column) => (
                          <TableCell
                            key={column.key}
                            className="border-r h-full font-poppins !break-word dark:text-white md:max-h-[2.75rem] md:min-h-[2.65rem] 2xl:min-h-[4rem] self-center content-center !truncate whitespace-normal px-[0.8rem] capitalize text-sm font-normal"
                          >
                            <div className="flex gap-x-4 !break-word whitespace-normal">
                              {column?.key === "vendor[recent_addition_date]"
                                ? formatDateTimeToReadable(
                                    getValue(row, column?.key)
                                  ) || "NA"
                                : column?.key === "percentage_approved"
                                ? `${getValue(row, column?.key)} %`
                                : getValue(row, column?.key) || 0}
                              {column?.key === "vendor[vendor_name]" &&
                                row?.vendor?.human_verified && (
                                  <img src={approved} alt="" />
                                )}
                            </div>
                          </TableCell>
                        ))}
                      </Link>
                    ))
                ) : (
                  <div className="w-full flex items-center justify-center h-full">
                    <img src={no_data} alt="" className="h-[50%] w-[40%]" />
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

export default VendorsTable;
